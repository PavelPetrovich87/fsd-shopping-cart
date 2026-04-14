# Checkout Feature — Implementation Plan

**Mission:** 014-checkout-feature
**Plan created:** 2026-04-14
**Spec:** `kitty-specs/014-checkout-feature/spec.md`

---

## 1. Technical Context

### Feature Summary
Implement `InitiateCheckout` use case in `features/checkout/model/`:
- Validates stock availability for all cart items
- Transitions cart from `Active` to `Checkout_Pending`
- Emits `CheckoutInitiated` event via EventBus
- Returns structured result (success, error, or stock conflict)

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Result typing | Discriminated union | Enables exhaustive handling in consumers |
| Conflict typing | `StockConflict[]` array | Returns all conflicts at once, not just first |
| Repository access | Async (Promise-based) | Matches T-010 async port interface |
| Stock validation | Check all items before any mutation | Atomic decision: all-or-nothing |

### Data Model (from spec)

**Result Types**:
```typescript
type InitiateCheckoutResult =
  | { success: true; cart: Cart }
  | { success: false; reason: 'empty_cart' }
  | { success: false; reason: 'invalid_state' }
  | { success: false; reason: 'stock_conflict'; conflicts: StockConflict[] }

interface StockConflict {
  skuId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}
```

**Event Emitted**:
```typescript
interface CheckoutInitiated {
  eventType: 'CheckoutInitiated';
  cartId: string;
  userId: string;
  items: CartItem[];
  subtotal: Money;
  timestamp: Date;
}
```

### File Structure

```
src/features/checkout/
├── model/
│   ├── initiate-checkout.ts        # InitiateCheckout use case
│   ├── initiate-checkout.test.ts    # Unit tests
│   ├── events.ts                    # CheckoutInitiated event type
│   └── index.ts                     # Re-exports
└── index.ts                         # Public API
```

### Implementation Pattern

```typescript
export async function InitiateCheckout(
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
  eventBus: EventBus
): Promise<InitiateCheckoutResult> {
  // 1. Get cart
  const cart = await cartRepo.getCart();

  // 2. Validate cart state
  if (cart.state !== CartState.Active) {
    return { success: false, reason: 'invalid_state' };
  }

  // 3. Check empty
  if (cart.items.length === 0) {
    return { success: false, reason: 'empty_cart' };
  }

  // 4. Validate stock for ALL items
  const conflicts: StockConflict[] = [];
  for (const item of cart.items) {
    const variant = await stockRepo.findBySku(item.skuId);
    if (!variant) continue; // product still exists
    if (item.quantity > variant.availableStock) {
      conflicts.push({
        skuId: item.skuId,
        productName: variant.name,
        requestedQuantity: item.quantity,
        availableQuantity: variant.availableStock,
      });
    }
  }

  // 5. If conflicts, return early
  if (conflicts.length > 0) {
    return { success: false, reason: 'stock_conflict', conflicts };
  }

  // 6. Transition cart state
  cart.initiateCheckout();
  await cartRepo.saveCart(cart);

  // 7. Publish event
  await eventBus.publish(new CheckoutInitiated({
    cartId: cart.id,
    userId: cart.userId,
    items: cart.items,
    subtotal: cart.subtotal,
    timestamp: new Date(),
  }));

  return { success: true, cart };
}
```

---

## 2. Charter Check

| Directive | Status | Notes |
|-----------|--------|-------|
| Arch Integrity | PASS | FSD layers respected: `features/checkout` imports from `entities/cart`, `entities/product`, `shared/lib` only |
| Decision Doc | PASS | Decisions documented in this plan |
| Spec Fidelity | PASS | Implementation matches spec.md |
| Locality | PASS | All changes within `features/checkout` slice |
| Boy Scout | N/A | No refactoring required |
| Efficient Tooling | PASS | Uses existing test harness |

**Charter compliance: PASS**

---

## 3. Gates

| Gate | Criteria | Status |
|------|----------|--------|
| G-1 | Spec has no unresolved clarifications | PASS |
| G-2 | Spec has measurable success criteria | PASS |
| G-3 | Spec has defined result types | PASS (4 variants) |
| G-4 | Implementation uses async/await | PASS |
| G-5 | FSD layer boundaries respected | PASS |

---

## 4. Phase 1: Design & Contracts

### 4.1 Repository Interface Expectations

**From ICartRepository (T-010, async):**
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

**From EventBus (T-002, T-012 fix):**
```typescript
interface EventBus {
  publish<T>(event: T): Promise<void>;
  subscribe<T>(handler: (event: T) => void): () => void;
}
```

### 4.2 Cart State Transitions

```
Active → Checkout_Pending (via initiateCheckout())
Active → Checked_Out (via markCheckedOut())
```

### 4.3 Event Subscription (handled in T-019)

The `CheckoutInitiated` event is consumed by the App Shell (T-019) to trigger stock reservation:
```typescript
eventBus.subscribe<CheckoutInitiated>((event) => {
  // Reserve stock for each item via ProductVariant.reserve()
});
```

---

## 5. Implementation Notes

### Test Structure

```typescript
describe('InitiateCheckout', () => {
  describe('happy path', () => {
    it('validates stock, transitions cart, emits event', async () => { /* ... */ });
  });
  describe('empty cart', () => {
    it('returns empty_cart error', async () => { /* ... */ });
  });
  describe('invalid cart state', () => {
    it('returns invalid_state error for Checkout_Pending', async () => { /* ... */ });
  });
  describe('stock conflict', () => {
    it('returns stock_conflict with all conflicting items', async () => { /* ... */ });
    it('cart state unchanged after conflict', async () => { /* ... */ });
  });
});
```

### Dependencies Required

- `@/entities/cart` — Cart, CartState, CartItem, ICartRepository
- `@/entities/product` — ProductVariant, IStockRepository
- `@/shared/lib/event-bus` — EventBus
- `@/shared/lib/money` — Money type (for subtotal)

### Out of Scope

- UI components (T-015, T-016)
- Stock reservation (T-019 app shell)
- Payment processing
- Order confirmation

---

## 6. Acceptance Test Coverage

| Requirement | Test Coverage |
|-------------|---------------|
| FR-001 | initiate-checkout.test.ts — validates all items |
| FR-002 | initiate-checkout.test.ts — stock conflict returns all conflicts |
| FR-003 | initiate-checkout.test.ts — cart transitions to Checkout_Pending |
| FR-004 | initiate-checkout.test.ts — CheckoutInitiated event published |
| FR-005 | initiate-checkout.test.ts — empty_cart error |
| FR-006 | initiate-checkout.test.ts — invalid_state error |
| FR-007 | All tests — eventBus.publish called with correct structure |

---

## 7. Quality Gates (Pre-commit)

Before marking implementation complete:
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` passes
- [ ] All tests execute
- [ ] No `any` types

---

## 8. Next Step

Run `/spec-kitty.tasks` to generate work packages.
