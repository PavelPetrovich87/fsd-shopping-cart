---
work_package_id: WP02
title: AddToCart Use Case
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-014
- FR-015
- FR-016
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-011-cart-actions-feature
base_commit: 596156aabb746b864ae68a8c97348af6ee2fdbbf
created_at: '2026-04-14T12:52:36.491879+00:00'
subtasks:
- T004
- T005
shell_pid: "11961"
agent: "kilocode:minimax:reviewer:reviewer"
history:
- date: '2026-04-14T12:34:57Z'
  action: created
  note: Initial WP02 creation
authoritative_surface: src/features/cart-actions/
execution_mode: code_change
owned_files:
- src/features/cart-actions/model/add-to-cart.ts
- src/features/cart-actions/model/add-to-cart.test.ts
tags: []
---

# WP02: AddToCart Use Case

## Objective

Implement the `AddToCart` use case that validates stock availability before adding items to the cart, and write comprehensive unit tests covering all happy paths and error scenarios.

## Context

**Feature:** Cart Actions Feature (T-011)
**Mission:** 011-cart-actions-feature
**Spec:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/spec.md`
**Plan:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/plan.md`

### Dependencies
- **WP01** must complete first (requires `errors.ts` and `results.ts`)

### Repository Interfaces (from T-007)

```typescript
interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
}

interface IStockRepository {
  findBySku(skuId: string): Promise<ProductVariant | null>;
}
```

### EventBus Interface (from T-002)

```typescript
interface EventBus {
  publish<T>(event: T): Promise<void>;
}
```

---

## Subtask T004: Implement AddToCart Use Case

**Purpose:** Create the `AddToCart` use case with full stock validation and cart state checks.

**Steps:**

1. Create `src/features/cart-actions/model/add-to-cart.ts`

2. Import dependencies:
   ```typescript
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { ProductVariant, IStockRepository } from '@/entities/product';
   import { EventBus } from '@/shared/lib/event-bus';
   import { CartActionsError } from './errors';
   import { AddToCartResult } from './results';
   import { ItemAddedToCart } from '@/entities/cart/model/events';
   ```

3. Implement the function signature:
   ```typescript
   export async function AddToCart(
     skuId: string,
     quantity: number,
     cartRepo: ICartRepository,
     stockRepo: IStockRepository,
     eventBus: EventBus
   ): Promise<AddToCartResult> {
     // Implementation below
   }
   ```

4. **Step 1 — Get Cart:**
   ```typescript
   const cart = await cartRepo.getCart();
   ```

5. **Step 2 — Check Cart State:**
   ```typescript
   if (cart.state !== CartState.Active) {
     const error: CartActionsError = {
       type: 'CartNotModifiableError',
       currentState: cart.state
     };
     return { success: false, error };
   }
   ```

6. **Step 3 — Check Stock:**
   ```typescript
   const variant = await stockRepo.findBySku(skuId);
   if (!variant) {
     const error: CartActionsError = {
       type: 'ItemNotFoundError',
       skuId
     };
     return { success: false, error };
   }
   if (quantity > variant.availableStock) {
     const error: CartActionsError = {
       type: 'InsufficientStockError',
       skuId,
       requested: quantity,
       available: variant.availableStock
     };
     return { success: false, error };
   }
   ```

7. **Step 4 — Double-Check Stock (Race Condition):**
   ```typescript
   const recheckVariant = await stockRepo.findBySku(skuId);
   if (!recheckVariant || quantity > recheckVariant.availableStock) {
     const error: CartActionsError = {
       type: 'StockConflictError',
       skuId,
       requested: quantity,
       currentAvailable: recheckVariant?.availableStock ?? 0
     };
     return { success: false, error };
   }
   ```

8. **Step 5 — Mutate Cart:**
   ```typescript
   cart.addItem({
     skuId,
     quantity,
     price: variant.price
   });
   ```

9. **Step 6 — Save Cart:**
   ```typescript
   await cartRepo.saveCart(cart);
   ```

10. **Step 7 — Publish Event:**
    ```typescript
    const event = new ItemAddedToCart({ skuId, quantity });
    await eventBus.publish(event);
    ```

11. **Step 8 — Return Success:**
    ```typescript
    return { success: true, cart, event };
    ```

**Files:**
- `src/features/cart-actions/model/add-to-cart.ts` (new file)

**Validation:**
- [ ] Function is async and returns `Promise<AddToCartResult>`
- [ ] All 4 error conditions handled (CartNotModifiable, ItemNotFound, InsufficientStock, StockConflict)
- [ ] Success path publishes `ItemAddedToCart` event
- [ ] Cart is saved after mutation
- [ ] TypeScript compiles without errors

---

## Subtask T005: Write AddToCart Unit Tests

**Purpose:** Create comprehensive unit tests covering happy path and all error scenarios.

**Steps:**

1. Create `src/features/cart-actions/model/add-to-cart.test.ts`

2. Import dependencies and create mock factories:
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { AddToCart } from './add-to-cart';
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { ProductVariant, IStockRepository } from '@/entities/product';
   import { EventBus } from '@/shared/lib/event-bus';

   // Mock factories
   const createMockCart = (overrides = {}): Cart => ({
     state: CartState.Active,
     items: new Map(),
     addItem: vi.fn(),
     removeItem: vi.fn(),
     changeQuantity: vi.fn(),
     ...overrides
   } as unknown as Cart);

   const createMockVariant = (overrides = {}): ProductVariant => ({
     skuId: 'SKU001',
     availableStock: 10,
     price: { cents: 1000 }, // Money
     ...overrides
   } as unknown as ProductVariant);
   ```

3. **Happy Path Tests:**
   ```typescript
   describe('AddToCart', () => {
     describe('happy path', () => {
       it('should add new item to cart', async () => {
         const cart = createMockCart();
         const variant = createMockVariant();
         const mockSave = vi.fn().mockResolvedValue(undefined);
         const mockPublish = vi.fn().mockResolvedValue(undefined);
         
         const result = await AddToCart(
           'SKU001', 2,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: mockSave },
           { findBySku: vi.fn().mockResolvedValue(variant) },
           { publish: mockPublish }
         );

         expect(result.success).toBe(true);
         expect(cart.addItem).toHaveBeenCalledWith({ skuId: 'SKU001', quantity: 2, price: variant.price });
         expect(mockSave).toHaveBeenCalledWith(cart);
         expect(mockPublish).toHaveBeenCalled();
       });

       it('should increment quantity if item already in cart', async () => {
         // Similar setup but cart.items has existing item
       });
     });
   ```

4. **Insufficient Stock Tests:**
   ```typescript
     describe('insufficient stock', () => {
       it('should return InsufficientStockError when requested > available', async () => {
         const cart = createMockCart();
         const variant = createMockVariant({ availableStock: 5 });
         
         const result = await AddToCart(
           'SKU001', 10,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(variant) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('InsufficientStockError');
           expect(result.error.requested).toBe(10);
           expect(result.error.available).toBe(5);
         }
         expect(cart.addItem).not.toHaveBeenCalled();
       });
     });
   ```

5. **Cart Not Modifiable Tests:**
   ```typescript
     describe('cart not modifiable', () => {
       it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
         const cart = createMockCart({ state: CartState.Checkout_Pending });
         
         const result = await AddToCart(
           'SKU001', 2,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(createMockVariant()) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('CartNotModifiableError');
           expect(result.error.currentState).toBe(CartState.Checkout_Pending);
         }
       });

       it('should return CartNotModifiableError when cart is Checked_Out', async () => {
         // Similar test for Checked_Out state
       });
     });
   ```

6. **Item Not Found Tests:**
   ```typescript
     describe('item not found', () => {
       it('should return ItemNotFoundError when variant is null', async () => {
         const cart = createMockCart();
         
         const result = await AddToCart(
           'INVALID_SKU', 2,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(null) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('ItemNotFoundError');
           expect(result.error.skuId).toBe('INVALID_SKU');
         }
       });
     });
   ```

7. **Stock Conflict (Race) Tests:**
   ```typescript
     describe('stock conflict (race)', () => {
       it('should return StockConflictError when stock drops between check and save', async () => {
         const cart = createMockCart();
         // First call returns 10, second call (recheck) returns 3
         
         const result = await AddToCart(
           'SKU001', 5,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { 
             findBySku: vi.fn()
               .mockResolvedValueOnce(createMockVariant({ availableStock: 10 }))
               .mockResolvedValueOnce(createMockVariant({ availableStock: 3 }))
           },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('StockConflictError');
           expect(result.error.currentAvailable).toBe(3);
         }
       });
     });
   ```

**Files:**
- `src/features/cart-actions/model/add-to-cart.test.ts` (new file)

**Validation:**
- [ ] All test describe blocks exist (happy path, insufficient stock, cart not modifiable, item not found, stock conflict)
- [ ] Tests verify `cartRepo.saveCart` was called on success
- [ ] Tests verify `eventBus.publish` was called on success
- [ ] Tests verify cart mutation was NOT called on error paths
- [ ] All tests pass: `npm test`

---

## Implementation Notes

### Critical Validation Steps
1. **Stock double-check**: Re-query `stockRepo.findBySku()` after cart mutation to detect race conditions
2. **Cart state check**: Must check BEFORE stock check for early exit
3. **Event publishing**: Only on successful save, after cart mutation

### Error Handling Pattern
All errors return early with typed error result — no thrown exceptions. This enables exhaustive handling in consumers.

### What NOT To Do
- Do NOT call `cart.save()` — use `cartRepo.saveCart(cart)`
- Do NOT directly manipulate cart items — use `cart.addItem()`
- Do NOT import EventBus implementation — use the interface

---

## Definition of Done

1. **T004:** `add-to-cart.ts` implements AddToCart with all 4 error variants + success path — TypeScript compiles
2. **T005:** `add-to-cart.test.ts` covers all 5 scenarios with mocked dependencies — all tests pass
3. **No `any` types** in implementation or tests
4. **FSD Compliance:** Only imports from `@/entities/cart`, `@/entities/product`, `@/shared/lib`

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cart aggregate methods don't exist | Medium | High | Check Cart interface in entities/cart before implementing |
| EventBus not yet implemented | Medium | Medium | Use vi.fn() mocks in tests |
| availableStock field naming | Low | Medium | Check ProductVariant interface for exact field name |

---

## Reviewer Guidance

When reviewing this WP:
- Verify stock is double-checked (race condition protection)
- Verify cart state is checked BEFORE stock
- Verify error results have all required fields per `CartActionsError` variants
- Verify `cartRepo.saveCart` is called on success path
- Verify `eventBus.publish` is called on success path
- Verify no mutations on error paths
- Run `npm test` and verify all tests pass

---

## Next WP

WP02 is complete. WP03 (RemoveFromCart + ChangeCartItemQuantity) can run in parallel with any other WP that depends only on WP01.

## Activity Log

- 2026-04-14T12:52:46Z – kilocode:minimax:implementer:implementer – shell_pid=11961 – Assigned agent via action command
- 2026-04-14T12:58:51Z – kilocode:minimax:implementer:implementer – shell_pid=11961 – Ready for review: AddToCart with stock validation and 7 tests
- 2026-04-14T13:01:43Z – kilocode:minimax:reviewer:reviewer – shell_pid=11961 – Started review via action command
- 2026-04-14T13:02:03Z – kilocode:minimax:reviewer:reviewer – shell_pid=11961 – Review passed: AddToCart with stock validation (double-check pattern), all 7 tests pass
