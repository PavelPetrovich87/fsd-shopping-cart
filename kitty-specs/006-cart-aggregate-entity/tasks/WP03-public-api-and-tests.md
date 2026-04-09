---
work_package_id: WP03
title: Polish - Public API and Tests
dependencies: [WP01, WP02]
requirement_refs:
- C-001
- C-002
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
- FR-013
- NFR-001
- NFR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: [T012, T013]
agent: "kilo:auto/balanced:reviewer"
shell_pid: "19459"
history:
- date: '2026-04-09T14:25:50Z'
  action: created
  detail: Initial work package
authoritative_surface: src/entities/cart/
execution_mode: code_change
owned_files: [src/entities/cart/index.ts, src/entities/cart/model/cart.test.ts]
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, NFR-001, NFR-002, C-001, C-002]
---

# Work Package WP03: Polish - Public API and Tests

## Objective

Create the public API export file and comprehensive unit tests to verify all Cart functionality.

## Context

**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004  
**Layer**: `entities/cart/`  
**Depends On**: WP01, WP02 (all code complete)

## Files to Create

| File | Purpose |
|------|---------|
| `src/entities/cart/index.ts` | Public API exports |
| `src/entities/cart/model/cart.test.ts` | Comprehensive unit tests |

## Subtask T012: Create Public API (index.ts)

**Purpose**: Export all public types, classes, and interfaces for external use.

**Steps**:

1. Create `src/entities/cart/index.ts`

2. Export from model:
   ```typescript
   // Types
   export { CartState } from './model/types';
   export type { CartItemData, CartData } from './model/types';
   
   // Events
   export type { CartDomainEvent } from './model/events';
   export {
     ItemAddedToCart,
     CartItemQuantityChanged,
     ItemRemovedFromCart,
     CartCleared,
     CheckoutInitiated,
     CheckoutCompleted,
     CouponApplied,
     CouponRemoved
   } from './model/events';
   
   // CartItem
   export { CartItem } from './model/cart-item';
   
   // Cart
   export { Cart } from './model/cart';
   export type { CartOperationResult } from './model/cart';
   ```

**Validation**:
- [ ] All public types are exported
- [ ] All classes are exported
- [ ] Event types are exported individually

---

## Subtask T013: Create Unit Tests

**Purpose**: Comprehensive test coverage for all Cart operations and scenarios.

**Steps**:

1. Create `src/entities/cart/model/cart.test.ts`

2. Set up test structure:
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { Cart, CartItem } from './index';
   import { CartState } from './model/types';
   
   describe('Cart', () => {
     const createItem = (overrides = {}) => ({
       skuId: 'SKU-001',
       name: 'Test Product',
       unitPriceCents: 2500,
       quantity: 1,
       ...overrides
     });
   });
   ```

3. Test CartItem:
   ```typescript
   describe('CartItem', () => {
     it('creates with valid data', () => {
       const item = CartItem.create(createItem());
       expect(item.skuId).toBe('SKU-001');
     });
   
     it('calculates totalPriceCents correctly', () => {
       const item = CartItem.create(createItem({ quantity: 3 }));
       expect(item.totalPriceCents).toBe(7500);
     });
   
     it('throws for zero quantity', () => {
       expect(() => CartItem.create(createItem({ quantity: 0 })))
         .toThrow('Quantity must be at least 1');
     });
   
     it('withQuantity creates new instance', () => {
       const item = CartItem.create(createItem());
       const updated = item.withQuantity(5);
       expect(updated.quantity).toBe(5);
       expect(item.quantity).toBe(1);
     });
   });
   ```

4. Test Cart creation:
   ```typescript
   describe('Cart.create', () => {
     it('creates empty active cart', () => {
       const cart = Cart.create();
       expect(cart.state).toBe(CartState.Active);
       expect(cart.items).toHaveLength(0);
     });
   });
   ```

5. Test addItem:
   ```typescript
   describe('Cart.addItem', () => {
     it('adds new item to empty cart', () => {
       const cart = Cart.create();
       const { cart: newCart, events } = cart.addItem(createItem());
       
       expect(newCart.items).toHaveLength(1);
       expect(events[0].eventType).toBe('ItemAddedToCart');
     });
   
     it('increments quantity for existing SKU', () => {
       const cart = Cart.create().addItem(createItem()).cart;
       const { cart: newCart, events } = cart.addItem(createItem());
       
       expect(newCart.getItem('SKU-001')?.quantity).toBe(2);
       expect(events[0].eventType).toBe('CartItemQuantityChanged');
     });
   });
   ```

6. Test removeItem:
   ```typescript
   describe('Cart.removeItem', () => {
     it('removes existing item', () => {
       const cart = Cart.create().addItem(createItem()).cart;
       const { cart: newCart, events } = cart.removeItem('SKU-001');
       
       expect(newCart.items).toHaveLength(0);
       expect(events[0].eventType).toBe('ItemRemovedFromCart');
     });
   
     it('handles non-existent item gracefully', () => {
       const cart = Cart.create();
       const { cart: resultCart, events } = cart.removeItem('NON-EXISTENT');
       
       expect(resultCart).toBe(cart);
       expect(events).toHaveLength(0);
     });
   });
   ```

7. Test changeQuantity:
   ```typescript
   describe('Cart.changeQuantity', () => {
     it('changes quantity', () => {
       const cart = Cart.create().addItem(createItem()).cart;
       const { cart: newCart } = cart.changeQuantity('SKU-001', 5);
       expect(newCart.getItem('SKU-001')?.quantity).toBe(5);
     });
   
     it('throws for quantity < 1', () => {
       const cart = Cart.create().addItem(createItem()).cart;
       expect(() => cart.changeQuantity('SKU-001', 0))
         .toThrow('Quantity must be at least 1');
     });
   
     it('throws for non-existent item', () => {
       const cart = Cart.create();
       expect(() => cart.changeQuantity('NON-EXISTENT', 5))
         .toThrow("Item with skuId 'NON-EXISTENT' not found in cart");
     });
   });
   ```

8. Test clearCart:
   ```typescript
   describe('Cart.clearCart', () => {
     it('clears all items', () => {
       const cart = Cart.create()
         .addItem(createItem({ skuId: 'SKU-001' })).cart
         .addItem(createItem({ skuId: 'SKU-002' })).cart;
       
       const { cart: newCart, events } = cart.clearCart();
       expect(newCart.items).toHaveLength(0);
       expect(events[0].eventType).toBe('CartCleared');
     });
   });
   ```

9. Test coupons:
   ```typescript
   describe('Cart coupon operations', () => {
     it('applies coupon', () => {
       const cart = Cart.create();
       const { cart: newCart, events } = cart.applyCoupon('SAVE10');
       
       expect(newCart.couponCode).toBe('SAVE10');
       expect(events[0].eventType).toBe('CouponApplied');
     });
   
     it('replaces existing coupon', () => {
       const cart = Cart.create().applyCoupon('SAVE10').cart;
       const { cart: newCart } = cart.applyCoupon('FLAT20');
       expect(newCart.couponCode).toBe('FLAT20');
     });
   
     it('throws for empty coupon', () => {
       const cart = Cart.create();
       expect(() => cart.applyCoupon('')).toThrow('Coupon code cannot be empty');
     });
   
     it('removes coupon', () => {
       const cart = Cart.create().applyCoupon('SAVE10').cart;
       const { cart: newCart, events } = cart.removeCoupon();
       expect(newCart.couponCode).toBe('');
       expect(events[0].eventType).toBe('CouponRemoved');
     });
   });
   ```

10. Test state transitions:
    ```typescript
    describe('Cart state transitions', () => {
      it('initiates checkout from Active', () => {
        const cart = Cart.create().addItem(createItem()).cart;
        const { cart: newCart, events } = cart.initiateCheckout();
        
        expect(newCart.state).toBe(CartState.Checkout_Pending);
        expect(events[0].eventType).toBe('CheckoutInitiated');
      });
      
      it('throws for empty cart checkout', () => {
        const cart = Cart.create();
        expect(() => cart.initiateCheckout())
          .toThrow('Cannot initiate checkout with empty cart');
      });
      
      it('marks checked out from Checkout_Pending', () => {
        const cart = Cart.create().addItem(createItem()).cart.initiateCheckout().cart;
        const { cart: newCart, events } = cart.markCheckedOut();
        
        expect(newCart.state).toBe(CartState.Checked_Out);
        expect(events[0].eventType).toBe('CheckoutCompleted');
      });
      
      it('throws for invalid transition', () => {
        const cart = Cart.create();
        expect(() => cart.markCheckedOut())
          .toThrow("Cannot complete checkout from state 'Active'");
      });
    });
    ```

11. Test subtotal:
    ```typescript
    describe('Cart.subtotalCents', () => {
      it('calculates correctly for single item', () => {
        const cart = Cart.create().addItem(createItem({ quantity: 2 })).cart;
        expect(cart.subtotalCents).toBe(5000);
      });
      
      it('calculates correctly for multiple items', () => {
        const cart = Cart.create()
          .addItem(createItem({ skuId: 'SKU-001', quantity: 2 })).cart
          .addItem(createItem({ skuId: 'SKU-002', quantity: 3, unitPriceCents: 1000 })).cart;
        
        expect(cart.subtotalCents).toBe(8000);
      });
      
      it('returns 0 for empty cart', () => {
        const cart = Cart.create();
        expect(cart.subtotalCents).toBe(0);
      });
    });
    ```

12. Test immutability:
    ```typescript
    describe('Immutability', () => {
      it('operations return new cart instance', () => {
        const original = Cart.create();
        const { cart: modified } = original.addItem(createItem());
        
        expect(original).not.toBe(modified);
        expect(original.items).toHaveLength(0);
      });
    });
    ```

**Validation**:
- [ ] All 10 scenarios from spec have test coverage
- [ ] Quantity ≥ 1 invariant tested
- [ ] State transition validation tested
- [ ] Event emission verified
- [ ] Immutability verified
- [ ] Tests pass (`npm run test`)

---

## Definition of Done

1. `index.ts` exports all public API
2. All unit tests pass
3. Tests cover all 10 user scenarios from spec
4. `npm run lint` passes
5. `npm run build` passes

## Reviewer Guidance

- Verify test coverage matches spec scenarios
- Run `npm run test` to confirm all pass

## Implementation Command

```bash
spec-kitty implement WP03
```

## Activity Log

- 2026-04-09T15:11:11Z – kilo:auto/balanced:implementer – shell_pid=19459 – Started implementation via action command
- 2026-04-09T15:18:36Z – kilo:auto/balanced:implementer – shell_pid=19459 – Ready for review: Public API index.ts and 54 comprehensive unit tests covering all operations
- 2026-04-09T15:18:48Z – kilo:auto/balanced:reviewer – shell_pid=19459 – Started review via action command
