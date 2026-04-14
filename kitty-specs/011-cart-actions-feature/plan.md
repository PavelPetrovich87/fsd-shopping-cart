# Cart Actions Feature — Implementation Plan

**Mission:** 011-cart-actions-feature
**Plan created:** 2026-04-14
**Spec:** `kitty-specs/011-cart-actions-feature/spec.md`

---

## 1. Technical Context

### Feature Summary
Implement three use cases in `features/cart-actions/model/`:
- `AddToCart(skuId, quantity)` — validates stock, adds/increments item, returns `AddToCartResult`
- `RemoveFromCart(skuId)` — removes item, returns `RemoveFromCartResult`
- `ChangeCartItemQuantity(skuId, newQuantity)` — validates stock + quantity >= 1, updates, returns `ChangeCartItemQuantityResult`

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Result typing | Discriminated union `{ success: true/false; ... }` | Enables exhaustive handling in consumers |
| Error typing | `CartActionsError` union | Matches spec's 4 error variants |
| Repository access | Async (Promise-based) | Matches T-007 port interface contract |
| Stock check timing | Synchronous check before each mutation | Prevents adding unavailable stock |
| Test file structure | One `.test.ts` per use case | Matches spec structure; parallelizable |

### Data Model (from spec)

**Error Types** (`model/errors.ts`):
```typescript
type CartActionsError =
  | { type: 'InsufficientStockError'; skuId: string; requested: number; available: number }
  | { type: 'StockConflictError'; skuId: string; requested: number; currentAvailable: number }
  | { type: 'CartNotModifiableError'; currentState: CartState }
  | { type: 'ItemNotFoundError'; skuId: string }
```

**Result Types** (`model/results.ts`):
```typescript
type AddToCartResult =
  | { success: true; cart: Cart; event: ItemAddedToCart }
  | { success: false; error: CartActionsError }
// ... similarly for RemoveFromCartResult, ChangeCartItemQuantityResult
```

### File Structure

```
src/features/cart-actions/
├── model/
│   ├── add-to-cart.ts        # AddToCart use case
│   ├── add-to-cart.test.ts   # Unit tests for AddToCart
│   ├── remove-from-cart.ts   # RemoveFromCart use case
│   ├── remove-from-cart.test.ts  # Unit tests for RemoveFromCart
│   ├── change-quantity.ts    # ChangeCartItemQuantity use case
│   ├── change-quantity.test.ts   # Unit tests for ChangeQuantity
│   ├── errors.ts             # CartActionsError types
│   ├── results.ts            # Result types
│   └── index.ts              # Re-exports all use cases + types
└── index.ts                  # Public API
```

### Implementation Pattern (per use case)

```typescript
export async function AddToCart(
  skuId: string,
  quantity: number,
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
  eventBus: EventBus
): Promise<AddToCartResult> {
  // 1. Get cart
  const cart = await cartRepo.getCart();

  // 2. Check cart state
  if (cart.state !== CartState.Active) {
    return { success: false, error: { type: 'CartNotModifiableError', currentState: cart.state } };
  }

  // 3. Check stock
  const variant = await stockRepo.findBySku(skuId);
  if (!variant) { /* ItemNotFoundError */ }
  if (quantity > variant.availableStock) { /* InsufficientStockError */ }

  // 4. Mutate cart
  cart.addItem({ skuId, quantity, price: variant.price });

  // 5. Save
  await cartRepo.saveCart(cart);

  // 6. Publish event
  await eventBus.publish(new ItemAddedToCart({ skuId, quantity }));

  return { success: true, cart, event: /* ... */ };
}
```

---

## 2. Charter Check

| Directive | Status | Notes |
|-----------|--------|-------|
| DIRECTIVE_001 (Arch Integrity) | PASS | FSD layers respected: use cases in `features/cart-actions` import from `entities/cart`, `entities/product`, `shared/lib` only |
| DIRECTIVE_003 (Decision Doc) | PASS | Decisions documented in this plan |
| DIRECTIVE_010 (Spec Fidelity) | PASS | Implementation matches spec.md exactly |
| DIRECTIVE_024 (Locality) | PASS | All changes contained within `features/cart-actions` slice |
| DIRECTIVE_025 (Boy Scout) | N/A | No refactoring of existing code required |
| DIRECTIVE_028 (Efficient Tooling) | PASS | Uses project's existing test harness (`npm run lint`, `npm run build`) |

**Charter compliance: PASS** — No conflicts identified.

---

## 3. Gates

All gates must pass before work package generation:

| Gate | Criteria | Status |
|------|----------|--------|
| G-1 | Spec has no unresolved [NEEDS CLARIFICATION] markers | PASS |
| G-2 | Spec has measurable success criteria | PASS (8 criteria) |
| G-3 | Spec has defined error types | PASS (4 error variants) |
| G-4 | Implementation uses async/await with Promise-based ports | PASS |
| G-5 | All imports respect FSD layer boundaries | PASS |

---

## 4. Phase 1: Design & Contracts

### 4.1 Repository Interface Expectations

**From ICartRepository (T-007):**
```typescript
interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
}
```

**From IStockRepository (T-007):**
```typescript
interface IStockRepository {
  findBySku(skuId: string): Promise<ProductVariant | null>;
  save(variant: ProductVariant): Promise<void>;
}
```

**From EventBus (T-002):**
```typescript
interface EventBus {
  publish<T>(event: T): Promise<void>;
  subscribe<T>(handler: (event: T) => void): () => void;
}
```

### 4.2 Domain Events Consumed/Emitted

| Use Case | Emits | Consumes |
|----------|-------|----------|
| AddToCart | `ItemAddedToCart` | — |
| RemoveFromCart | `ItemRemovedFromCart` | — |
| ChangeCartItemQuantity | `CartItemQuantityChanged` | — |

### 4.3 Stock Validation Logic

For `AddToCart` and `ChangeCartItemQuantity`:
1. Fetch variant via `stockRepo.findBySku(skuId)`
2. If `null` → `ItemNotFoundError`
3. If `quantity > variant.availableStock` → `InsufficientStockError`
4. After fetch but before save: re-check `variant.availableStock` for race conditions → `StockConflictError`

Note: True atomicity (check-then-act) requires distributed locking or saga pattern. For this implementation, the synchronous check-before-mutation approach with optimistic concurrency at checkout (T-013) is sufficient per NFR-001.

### 4.4 Cart State Enforcement

All three operations check `cart.state === CartState.Active` before mutating. If not active:
- `Checkout_Pending` or `Checked_Out` → `CartNotModifiableError`

---

## 5. Implementation Notes

### Test Structure

Each `.test.ts` file follows pattern:
```typescript
describe('AddToCart', () => {
  describe('happy path', () => { /* ... */ });
  describe('insufficient stock', () => { /* ... */ });
  describe('cart not modifiable', () => { /* ... */ });
  describe('item not found', () => { /* ... */ });
  describe('stock conflict (race)', () => { /* ... */ });
});
```

### Dependencies Required

- `@/entities/cart` — Cart, CartState, ICartRepository, domain event types
- `@/entities/product` — ProductVariant, IStockRepository
- `@/shared/lib/event-bus` — EventBus singleton
- `@/shared/lib/money` — Money type (for cart item price)

### Out of Scope (from spec)

- UI components (T-015)
- Stock reservation (T-013)
- Payment processing

---

## 6. Acceptance Test Coverage

| Requirement | Test Coverage |
|-------------|---------------|
| FR-001 | add-to-cart.test.ts — adds new item, increments existing |
| FR-002 | add-to-cart.test.ts — stock check before add |
| FR-003 | add-to-cart.test.ts — insufficient stock returns error |
| FR-004 | add-to-cart.test.ts — stock conflict returns error |
| FR-005 | add-to-cart.test.ts — non-active cart returns error |
| FR-006 | remove-from-cart.test.ts — removes existing item |
| FR-007 | remove-from-cart.test.ts — non-active cart returns error |
| FR-008 | change-quantity.test.ts — updates quantity |
| FR-009 | change-quantity.test.ts — rejects quantity < 1 |
| FR-010 | change-quantity.test.ts — stock check before update |
| FR-011 | change-quantity.test.ts — insufficient stock returns error |
| FR-012 | change-quantity.test.ts — stock conflict returns error |
| FR-013 | change-quantity.test.ts — non-active cart returns error |
| FR-014 | All three test files — verify eventBus.publish called |
| FR-015 | All three test files — verify cartRepo.saveCart called |
| FR-016 | All three test files — verify return type structure |

---

## 7. Quality Gates (Pre-commit)

Before marking implementation complete:
- [ ] `npm run lint` passes (zero warnings)
- [ ] `npm run lint:arch` passes (FSD violations)
- [ ] `npm run build` passes (type check + bundle)
- [ ] All test files execute: `npm test`
- [ ] No `any` types in implementation (strict typing throughout)

---

## 8. Next Step

Proceed to `/spec-kitty.tasks` to generate work packages (WP) for implementation.
