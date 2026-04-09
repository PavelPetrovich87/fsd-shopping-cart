---
work_package_id: WP03
title: Cart Extended - Coupons, State Transitions, Subtotal
dependencies: [WP02]
requirement_refs:
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch: main. Planning/base: main. Merge target: main. Execution worktrees allocated per computed lane from lanes.json.'
subtasks: [T009, T010, T011]
history:
- date: '2026-04-09T14:25:50Z'
  action: created
  detail: Initial work package
authoritative_surface: src/entities/cart/model/
execution_mode: code_change
owned_files: [src/entities/cart/model/cart.ts]
requirements: [FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012]
---

# Work Package WP03: Cart Extended - Coupons, State Transitions, Subtotal

## Objective

Implement coupon handling, state transitions, and subtotal computation on the Cart aggregate.

## Context

**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004  
**Layer**: `entities/cart/model/`  
**Depends On**: WP02 (Cart foundation and core operations)  
**Event Pattern**: Each mutation returns `{ cart: Cart, events: DomainEvent[] }` tuple

## Subtask T009: Implement Coupon Operations

**Purpose**: Add and remove coupons from cart (single coupon per cart).

**Steps**:

1. Add `applyCoupon` method to `Cart` class:
   ```typescript
   applyCoupon(code: string): CartOperationResult {
     const normalizedCode = code.trim().toUpperCase();
     
     if (!normalizedCode) {
       throw new Error('Coupon code cannot be empty');
     }
     
     const events: CartDomainEvent[] = [{
       occurredAt: new Date(),
       eventType: 'CouponApplied',
       couponCode: normalizedCode
     } as CouponApplied];
     
     return {
       cart: this._with({ couponCode: normalizedCode }),
       events
     };
   }
   ```

2. Add `removeCoupon` method to `Cart` class:
   ```typescript
   removeCoupon(): CartOperationResult {
     if (!this._couponCode) {
       return { cart: this, events: [] };
     }
     
     const previousCode = this._couponCode;
     
     const events: CartDomainEvent[] = [{
       occurredAt: new Date(),
       eventType: 'CouponRemoved',
       previousCouponCode: previousCode
     } as CouponRemoved];
     
     return {
       cart: this._with({ couponCode: '' }),
       events
     };
   }
   ```

**Validation**:
- [ ] `applyCoupon` stores coupon code (normalized to uppercase, trimmed)
- [ ] `applyCoupon` with empty code throws error
- [ ] `applyCoupon` replaces any existing coupon
- [ ] `applyCoupon` emits CouponApplied event
- [ ] `removeCoupon` clears coupon if one exists
- [ ] `removeCoupon` on no coupon returns unchanged
- [ ] `removeCoupon` emits CouponRemoved event

---

## Subtask T010: Implement State Transitions

**Purpose**: Implement checkout lifecycle transitions with validation.

**Steps**:

1. Add `initiateCheckout` method:
   ```typescript
   initiateCheckout(): CartOperationResult {
     if (this._state !== CartState.Active) {
       throw new Error(`Cannot initiate checkout from state '${this._state}'. Cart must be in 'Active' state.`);
     }
     
     if (this._items.size === 0) {
       throw new Error('Cannot initiate checkout with empty cart');
     }
     
     const events: CartDomainEvent[] = [{
       occurredAt: new Date(),
       eventType: 'CheckoutInitiated',
       cartId: this._id
     } as CheckoutInitiated];
     
     return {
       cart: this._with({ state: CartState.Checkout_Pending }),
       events
     };
   }
   ```

2. Add `markCheckedOut` method:
   ```typescript
   markCheckedOut(): CartOperationResult {
     if (this._state !== CartState.Checkout_Pending) {
       throw new Error(`Cannot complete checkout from state '${this._state}'. Cart must be in 'Checkout_Pending' state.`);
     }
     
     const events: CartDomainEvent[] = [{
       occurredAt: new Date(),
       eventType: 'CheckoutCompleted',
       cartId: this._id
     } as CheckoutCompleted];
     
     return {
       cart: this._with({ state: CartState.Checked_Out }),
       events
     };
   }
   ```

3. Add helper for valid transitions:
   ```typescript
   canTransitionTo(targetState: CartState): boolean {
     const validTransitions: Record<CartState, CartState[]> = {
       [CartState.Active]: [CartState.Checkout_Pending],
       [CartState.Checkout_Pending]: [CartState.Checked_Out],
       [CartState.Checked_Out]: []  // Terminal state
     };
     return validTransitions[this._state].includes(targetState);
   }
   ```

**Validation**:
- [ ] `initiateCheckout` transitions Active → Checkout_Pending
- [ ] `initiateCheckout` throws if cart is empty
- [ ] `initiateCheckout` throws if not in Active state
- [ ] `initiateCheckout` emits CheckoutInitiated event
- [ ] `markCheckedOut` transitions Checkout_Pending → Checked_Out
- [ ] `markCheckedOut` throws if not in Checkout_Pending state
- [ ] `markCheckedOut` emits CheckoutCompleted event
- [ ] Cannot transition from Checked_Out (terminal state)

---

## Subtask T011: Implement Subtotal Computation

**Purpose**: Compute cart subtotal using Money arithmetic (integer cents).

**Steps**:

1. Add `subtotalCents` getter to `Cart` class:
   ```typescript
   get subtotalCents(): number {
     let total = 0;
     for (const item of this._items.values()) {
       total += item.totalPriceCents;
     }
     return total;
   }
   ```

2. Optionally add `itemCount` getter for convenience:
   ```typescript
   get itemCount(): number {
     let count = 0;
     for (const item of this._items.values()) {
       count += item.quantity;
     }
     return count;
   }
   
   get uniqueItemCount(): number {
     return this._items.size;
   }
   ```

3. Update `toData()` to include subtotal:
   ```typescript
   toData(): CartData & { subtotalCents: number } {
     return {
       ...super.toData(),
       subtotalCents: this.subtotalCents
     };
   }
   ```

**Validation**:
- [ ] `subtotalCents` sums all item totals correctly
- [ ] Empty cart has subtotal of 0
- [ ] Single item returns item.totalPriceCents
- [ ] Multiple items sum correctly
- [ ] Uses integer arithmetic (no floating point)

---

## Definition of Done

1. All coupon operations work as specified
2. State transitions follow valid paths only
3. Invalid transitions throw descriptive errors
4. Subtotal computed correctly from item totals
5. All operations return `{ cart: Cart, events: CartDomainEvent[] }`
6. `npm run lint` passes
7. Code compiles without errors

## Risks

- **Medium**: State machine logic needs careful validation
- **Low**: Subtotal is straightforward arithmetic

## Reviewer Guidance

- Verify only valid state transitions are allowed
- Verify error messages are descriptive
- Verify subtotal uses integer arithmetic (cents, not floats)
- Verify coupon replaces previous coupon (not additive)

## Implementation Command

```bash
spec-kitty implement WP03
```
