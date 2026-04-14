---
work_package_id: WP03
title: RemoveFromCart + ChangeCartItemQuantity Use Cases
dependencies:
- WP01
requirement_refs:
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
- FR-013
- FR-014
- FR-015
- FR-016
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch for this feature: main. Completed changes must merge into main.'
subtasks:
- T006
- T007
- T008
- T009
history:
- date: '2026-04-14T12:34:57Z'
  action: created
  note: Initial WP03 creation
authoritative_surface: src/features/cart-actions/
execution_mode: code_change
owned_files:
- src/features/cart-actions/model/remove-from-cart.ts
- src/features/cart-actions/model/remove-from-cart.test.ts
- src/features/cart-actions/model/change-quantity.ts
- src/features/cart-actions/model/change-quantity.test.ts
tags: []
---

# WP03: RemoveFromCart + ChangeCartItemQuantity Use Cases

## Objective

Implement `RemoveFromCart` and `ChangeCartItemQuantity` use cases with full validation and unit tests. T006 and T008 can be implemented in parallel since they are independent use cases sharing only type definitions from WP01.

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

---

## Part A: RemoveFromCart (T006 + T007)

### Subtask T006: Implement RemoveFromCart Use Case

**Purpose:** Create the `RemoveFromCart` use case that removes an item from the cart.

**Steps:**

1. Create `src/features/cart-actions/model/remove-from-cart.ts`

2. Import dependencies:
   ```typescript
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { EventBus } from '@/shared/lib/event-bus';
   import { CartActionsError } from './errors';
   import { RemoveFromCartResult } from './results';
   import { ItemRemovedFromCart } from '@/entities/cart/model/events';
   ```

3. Implement the function:
   ```typescript
   export async function RemoveFromCart(
     skuId: string,
     cartRepo: ICartRepository,
     eventBus: EventBus
   ): Promise<RemoveFromCartResult> {
     // 1. Get cart
     const cart = await cartRepo.getCart();

     // 2. Check cart state
     if (cart.state !== CartState.Active) {
       const error: CartActionsError = {
         type: 'CartNotModifiableError',
         currentState: cart.state
       };
       return { success: false, error };
     }

     // 3. Check if item exists in cart
     if (!cart.items.has(skuId)) {
       const error: CartActionsError = {
         type: 'ItemNotFoundError',
         skuId
       };
       return { success: false, error };
     }

     // 4. Remove item
     cart.removeItem(skuId);

     // 5. Save cart
     await cartRepo.saveCart(cart);

     // 6. Publish event
     const event = new ItemRemovedFromCart({ skuId });
     await eventBus.publish(event);

     // 7. Return success
     return { success: true, cart, event };
   }
   ```

**Files:**
- `src/features/cart-actions/model/remove-from-cart.ts` (new file)

**Validation:**
- [ ] Function is async and returns `Promise<RemoveFromCartResult>`
- [ ] CartNotModifiableError when cart is not Active
- [ ] ItemNotFoundError when item not in cart
- [ ] EventBus publishes ItemRemovedFromCart on success
- [ ] TypeScript compiles without errors

---

### Subtask T007: Write RemoveFromCart Unit Tests

**Purpose:** Create unit tests for RemoveFromCart covering happy path and error scenarios.

**Steps:**

1. Create `src/features/cart-actions/model/remove-from-cart.test.ts`

2. Set up mocks (reuse pattern from WP02):
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { RemoveFromCart } from './remove-from-cart';
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { EventBus } from '@/shared/lib/event-bus';

   const createMockCart = (items = new Map(), state = CartState.Active): Cart => ({
     state,
     items,
     addItem: vi.fn(),
     removeItem: vi.fn(),
     changeQuantity: vi.fn(),
   } as unknown as Cart);
   ```

3. **Happy Path Test:**
   ```typescript
   describe('RemoveFromCart', () => {
     describe('happy path', () => {
       it('should remove item from cart', async () => {
         const items = new Map([['SKU001', { skuId: 'SKU001', quantity: 2 }]]);
         const cart = createMockCart(items);
         const mockSave = vi.fn().mockResolvedValue(undefined);
         const mockPublish = vi.fn().mockResolvedValue(undefined);

         const result = await RemoveFromCart(
           'SKU001',
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: mockSave },
           { publish: mockPublish }
         );

         expect(result.success).toBe(true);
         expect(cart.removeItem).toHaveBeenCalledWith('SKU001');
         expect(mockSave).toHaveBeenCalledWith(cart);
         expect(mockPublish).toHaveBeenCalled();
       });
     });
   ```

4. **Cart Not Modifiable Tests:**
   ```typescript
     describe('cart not modifiable', () => {
       it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
         const cart = createMockCart(new Map(), CartState.Checkout_Pending);

         const result = await RemoveFromCart(
           'SKU001',
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('CartNotModifiableError');
         }
       });
     });
   ```

5. **Item Not Found Test:**
   ```typescript
     describe('item not found', () => {
       it('should return ItemNotFoundError when item not in cart', async () => {
         const cart = createMockCart(new Map()); // empty cart

         const result = await RemoveFromCart(
           'NONEXISTENT_SKU',
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('ItemNotFoundError');
           expect(result.error.skuId).toBe('NONEXISTENT_SKU');
         }
       });
     });
   ```

**Files:**
- `src/features/cart-actions/model/remove-from-cart.test.ts` (new file)

**Validation:**
- [ ] Happy path test verifies removeItem, saveCart, publish called
- [ ] Cart not modifiable test verifies early return with correct error
- [ ] Item not found test verifies early return with correct error
- [ ] All tests pass

---

## Part B: ChangeCartItemQuantity (T008 + T009)

### Subtask T008: Implement ChangeCartItemQuantity Use Case

**Purpose:** Create the `ChangeCartItemQuantity` use case with stock validation and quantity enforcement.

**Steps:**

1. Create `src/features/cart-actions/model/change-quantity.ts`

2. Import dependencies:
   ```typescript
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { ProductVariant, IStockRepository } from '@/entities/product';
   import { EventBus } from '@/shared/lib/event-bus';
   import { CartActionsError } from './errors';
   import { ChangeCartItemQuantityResult } from './results';
   import { CartItemQuantityChanged } from '@/entities/cart/model/events';
   ```

3. Implement the function:
   ```typescript
   export async function ChangeCartItemQuantity(
     skuId: string,
     newQuantity: number,
     cartRepo: ICartRepository,
     stockRepo: IStockRepository,
     eventBus: EventBus
   ): Promise<ChangeCartItemQuantityResult> {
     // 1. Enforce quantity >= 1
     if (newQuantity < 1) {
       const error: CartActionsError = {
         type: 'ItemNotFoundError', // Use this to indicate invalid quantity
         skuId
       };
       return { success: false, error };
     }

     // 2. Get cart
     const cart = await cartRepo.getCart();

     // 3. Check cart state
     if (cart.state !== CartState.Active) {
       const error: CartActionsError = {
         type: 'CartNotModifiableError',
         currentState: cart.state
       };
       return { success: false, error };
     }

     // 4. Check if item exists in cart
     if (!cart.items.has(skuId)) {
       const error: CartActionsError = {
         type: 'ItemNotFoundError',
         skuId
       };
       return { success: false, error };
     }

     // 5. Check stock
     const variant = await stockRepo.findBySku(skuId);
     if (!variant) {
       const error: CartActionsError = {
         type: 'ItemNotFoundError',
         skuId
       };
       return { success: false, error };
     }
     if (newQuantity > variant.availableStock) {
       const error: CartActionsError = {
         type: 'InsufficientStockError',
         skuId,
         requested: newQuantity,
         available: variant.availableStock
       };
       return { success: false, error };
     }

     // 6. Double-check stock (race condition)
     const recheckVariant = await stockRepo.findBySku(skuId);
     if (!recheckVariant || newQuantity > recheckVariant.availableStock) {
       const error: CartActionsError = {
         type: 'StockConflictError',
         skuId,
         requested: newQuantity,
         currentAvailable: recheckVariant?.availableStock ?? 0
       };
       return { success: false, error };
     }

     // 7. Change quantity
     cart.changeQuantity(skuId, newQuantity);

     // 8. Save cart
     await cartRepo.saveCart(cart);

     // 9. Publish event
     const event = new CartItemQuantityChanged({ skuId, quantity: newQuantity });
     await eventBus.publish(event);

     // 10. Return success
     return { success: true, cart, event };
   }
   ```

**Files:**
- `src/features/cart-actions/model/change-quantity.ts` (new file)

**Validation:**
- [ ] Function is async and returns `Promise<ChangeCartItemQuantityResult>`
- [ ] Rejects quantity < 1
- [ ] CartNotModifiableError when cart is not Active
- [ ] ItemNotFoundError when item not in cart
- [ ] InsufficientStockError when quantity > available
- [ ] StockConflictError on race condition
- [ ] TypeScript compiles without errors

---

### Subtask T009: Write ChangeCartItemQuantity Unit Tests

**Purpose:** Create comprehensive unit tests for ChangeCartItemQuantity.

**Steps:**

1. Create `src/features/cart-actions/model/change-quantity.test.ts`

2. Set up mocks:
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { ChangeCartItemQuantity } from './change-quantity';
   import { Cart, CartState, ICartRepository } from '@/entities/cart';
   import { ProductVariant, IStockRepository } from '@/entities/product';
   import { EventBus } from '@/shared/lib/event-bus';

   const createMockCart = (items = new Map(), state = CartState.Active): Cart => ({
     state,
     items,
     addItem: vi.fn(),
     removeItem: vi.fn(),
     changeQuantity: vi.fn(),
   } as unknown as Cart);

   const createMockVariant = (overrides = {}): ProductVariant => ({
     skuId: 'SKU001',
     availableStock: 10,
     price: { cents: 1000 },
     ...overrides
   } as unknown as ProductVariant);
   ```

3. **Happy Path Tests:**
   ```typescript
   describe('ChangeCartItemQuantity', () => {
     describe('happy path', () => {
       it('should increase quantity within stock limits', async () => {
         const items = new Map([['SKU001', { skuId: 'SKU001', quantity: 2 }]]);
         const cart = createMockCart(items);
         const variant = createMockVariant({ availableStock: 10 });

         const result = await ChangeCartItemQuantity(
           'SKU001', 5,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(variant) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(true);
         expect(cart.changeQuantity).toHaveBeenCalledWith('SKU001', 5);
       });

       it('should decrease quantity', async () => {
         // Similar test for decreasing quantity
       });
     });
   ```

4. **Quantity < 1 Test:**
   ```typescript
     describe('quantity < 1', () => {
       it('should return ItemNotFoundError for quantity 0', async () => {
         const items = new Map([['SKU001', { skuId: 'SKU001', quantity: 2 }]]);
         const cart = createMockCart(items);

         const result = await ChangeCartItemQuantity(
           'SKU001', 0,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(createMockVariant()) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('ItemNotFoundError');
         }
       });
     });
   ```

5. **Insufficient Stock Test:**
   ```typescript
     describe('insufficient stock', () => {
       it('should return InsufficientStockError when quantity > available', async () => {
         const items = new Map([['SKU001', { skuId: 'SKU001', quantity: 2 }]]);
         const cart = createMockCart(items);
         const variant = createMockVariant({ availableStock: 3 });

         const result = await ChangeCartItemQuantity(
           'SKU001', 5,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(variant) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('InsufficientStockError');
         }
       });
     });
   ```

6. **Cart Not Modifiable Test:**
   ```typescript
     describe('cart not modifiable', () => {
       it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
         const cart = createMockCart(new Map(), CartState.Checkout_Pending);

         const result = await ChangeCartItemQuantity(
           'SKU001', 5,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           { findBySku: vi.fn().mockResolvedValue(createMockVariant()) },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('CartNotModifiableError');
         }
       });
     });
   ```

7. **Stock Conflict Test:**
   ```typescript
     describe('stock conflict (race)', () => {
       it('should return StockConflictError when stock drops between check and save', async () => {
         const items = new Map([['SKU001', { skuId: 'SKU001', quantity: 2 }]]);
         const cart = createMockCart(items);

         const result = await ChangeCartItemQuantity(
           'SKU001', 5,
           { getCart: vi.fn().mockResolvedValue(cart), saveCart: vi.fn() },
           {
             findBySku: vi.fn()
               .mockResolvedValueOnce(createMockVariant({ availableStock: 10 }))
               .mockResolvedValueOnce(createMockVariant({ availableStock: 2 }))
           },
           { publish: vi.fn() }
         );

         expect(result.success).toBe(false);
         if (!result.success) {
           expect(result.error.type).toBe('StockConflictError');
         }
       });
     });
   ```

**Files:**
- `src/features/cart-actions/model/change-quantity.test.ts` (new file)

**Validation:**
- [ ] All test describe blocks exist
- [ ] Tests verify changeQuantity, saveCart, publish called on success
- [ ] Tests verify early returns on all error paths
- [ ] All tests pass

---

## Implementation Notes

### Parallelization
- T006 and T008 can be implemented in parallel (independent use cases)
- T007 depends on T006, T009 depends on T008

### Critical Differences from AddToCart
- `ChangeCartItemQuantity` requires stock check (like AddToCart)
- `RemoveFromCart` does NOT require stock check (removing doesn't affect stock)
- `ChangeCartItemQuantity` rejects quantity < 1 (should use RemoveFromCart instead)

### What NOT To Do
- Do NOT re-check stock in RemoveFromCart (not needed)
- Do NOT allow quantity 0 — return error (use RemoveFromCart)
- Do NOT import from infrastructure layers

---

## Definition of Done

1. **T006:** `remove-from-cart.ts` implements RemoveFromCart with cart state + item existence checks — TypeScript compiles
2. **T007:** `remove-from-cart.test.ts` covers happy path, cart not modifiable, item not found — all tests pass
3. **T008:** `change-quantity.ts` implements ChangeCartItemQuantity with quantity >= 1 enforcement + all validations — TypeScript compiles
4. **T009:** `change-quantity.test.ts` covers all scenarios — all tests pass
5. **No `any` types** in implementation or tests
6. **FSD Compliance:** Only imports from `@/entities/cart`, `@/entities/product`, `@/shared/lib`

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cart.changeQuantity signature differs | Low | Medium | Check Cart interface for exact method signature |
| Confusion between ItemNotFoundError vs InsufficientStockError for qty < 1 | Low | Low | Document that qty < 1 returns ItemNotFoundError per spec |

---

## Reviewer Guidance

When reviewing this WP:
- Verify RemoveFromCart does NOT check stock (not needed)
- Verify ChangeCartItemQuantity rejects quantity < 1
- Verify ChangeCartItemQuantity has double-check stock logic
- Verify both use cases check cart state before any operation
- Verify events are published only on success paths
- Run `npm test` and verify all tests pass

---

## Next WP

WP03 is complete. WP04 (Exports + Quality Gates) depends on all previous WPs and should be run last.
