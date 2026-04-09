---
work_package_id: WP02
title: Cart - Full Implementation
dependencies: [WP01]
requirement_refs:
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
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: [T004, T005, T006, T007, T008, T009, T010, T011]
history:
- date: '2026-04-09T14:25:50Z'
  action: created
  detail: Initial work package
authoritative_surface: src/entities/cart/model/
execution_mode: code_change
owned_files: [src/entities/cart/model/cart.ts]
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012]
---

# Work Package WP02: Cart - Full Implementation

## Objective

Implement the complete Cart aggregate root with all operations: item CRUD, coupons, state transitions, and subtotal computation. Each operation returns `{ cart: Cart, events: DomainEvent[] }` tuple.

## Context

**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004  
**Layer**: `entities/cart/model/`  
**Depends On**: WP01 (types, events, CartItem entity)  
**Event Pattern**: Each mutation returns `{ cart: Cart, events: DomainEvent[] }` tuple

## Files to Create

| File | Purpose |
|------|---------|
| `src/entities/cart/model/cart.ts` | Cart aggregate root (complete implementation) |

## Subtask T004: Create cart.ts Foundation

**Purpose**: Establish the Cart class structure with immutable state and factory methods.

**Steps**:

1. Create `src/entities/cart/model/cart.ts`

2. Import dependencies:
   ```typescript
   import { CartItem } from './cart-item';
   import { CartState, CartItemData, CartData } from './types';
   import { 
     CartDomainEvent, 
     ItemAddedToCart, 
     CartItemQuantityChanged,
     ItemRemovedFromCart,
     CartCleared,
     CouponApplied,
     CouponRemoved,
     CheckoutInitiated,
     CheckoutCompleted
   } from './events';
   ```

3. Define result type for operations:
   ```typescript
   export interface CartOperationResult {
     cart: Cart;
     events: CartDomainEvent[];
   }
   ```

4. Create immutable `Cart` class:
   ```typescript
   export class Cart {
     private constructor(
       private readonly _id: string,
       private readonly _state: CartState,
       private readonly _items: ReadonlyMap<string, CartItem>,
       private readonly _couponCode: string,
       private readonly _createdAt: Date,
       private readonly _updatedAt: Date
     ) {
       Object.freeze(this);
     }
   
     static create(id?: string): Cart {
       const now = new Date();
       return new Cart(
         id ?? crypto.randomUUID(),
         CartState.Active,
         new Map(),
         '',
         now,
         now
       );
     }
   
     get id(): string { return this._id; }
     get state(): CartState { return this._state; }
     get couponCode(): string { return this._couponCode; }
     get createdAt(): Date { return this._createdAt; }
     get updatedAt(): Date { return this._updatedAt; }
   
     get items(): CartItem[] {
       return Array.from(this._items.values());
     }
   
     hasItem(skuId: string): boolean {
       return this._items.has(skuId);
     }
   
     getItem(skuId: string): CartItem | undefined {
       return this._items.get(skuId);
     }
   
     get subtotalCents(): number {
       let total = 0;
       for (const item of this._items.values()) {
         total += item.totalPriceCents;
       }
       return total;
     }
   
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
   
     protected _with(partial: {
       state?: CartState;
       items?: ReadonlyMap<string, CartItem>;
       couponCode?: string;
       updatedAt?: Date;
     }): Cart {
       return new Cart(
         this._id,
         partial.state ?? this._state,
         partial.items ?? this._items,
         partial.couponCode ?? this._couponCode,
         this._createdAt,
         partial.updatedAt ?? new Date()
       );
     }
   
     toData(): CartData & { subtotalCents: number } {
       return {
         id: this._id,
         state: this._state,
         items: this.items.map(item => item.toData()),
         couponCode: this._couponCode,
         createdAt: this._createdAt,
         updatedAt: this._updatedAt,
         subtotalCents: this.subtotalCents
       };
     }
   }
   ```

**Validation**:
- [ ] Cart is immutable (instance frozen)
- [ ] `create()` factory returns new Active cart
- [ ] Items stored as ReadonlyMap keyed by skuId
- [ ] subtotalCents computed correctly

---

## Subtask T005: Implement addItem Operation

**Purpose**: Add item to cart or increment quantity if SKU already exists.

**Steps**:

Add `addItem` method:
```typescript
addItem(data: Omit<CartItemData, 'createdAt'>): CartOperationResult {
  const events: CartDomainEvent[] = [];
  let newItems = new Map(this._items);
  
  const existingItem = this._items.get(data.skuId);
  let newItem: CartItem;
  
  if (existingItem) {
    newItem = existingItem.withQuantity(existingItem.quantity + data.quantity);
    events.push({
      occurredAt: new Date(),
      eventType: 'CartItemQuantityChanged',
      skuId: data.skuId,
      previousQuantity: existingItem.quantity,
      newQuantity: newItem.quantity
    } as CartItemQuantityChanged);
  } else {
    newItem = CartItem.create({
      ...data,
      createdAt: new Date()
    });
    events.push({
      occurredAt: new Date(),
      eventType: 'ItemAddedToCart',
      skuId: data.skuId,
      name: data.name,
      unitPriceCents: data.unitPriceCents,
      quantity: data.quantity
    } as ItemAddedToCart);
  }
  
  newItems.set(data.skuId, newItem);
  
  return {
    cart: this._with({ items: newItems }),
    events
  };
}
```

**Validation**:
- [ ] Adding new item creates ItemAddedToCart event
- [ ] Adding existing SKU increments quantity with CartItemQuantityChanged event
- [ ] Returns new Cart instance

---

## Subtask T006: Implement removeItem Operation

**Purpose**: Remove item from cart by SKU.

**Steps**:

Add `removeItem` method:
```typescript
removeItem(skuId: string): CartOperationResult {
  const events: CartDomainEvent[] = [];
  
  const existingItem = this._items.get(skuId);
  if (!existingItem) {
    return { cart: this, events: [] };
  }
  
  const newItems = new Map(this._items);
  newItems.delete(skuId);
  
  events.push({
    occurredAt: new Date(),
    eventType: 'ItemRemovedFromCart',
    skuId,
    previousQuantity: existingItem.quantity
  } as ItemRemovedFromCart);
  
  return {
    cart: this._with({ items: newItems }),
    events
  };
}
```

**Validation**:
- [ ] Removing existing item emits ItemRemovedFromCart event
- [ ] Removing non-existent item returns unchanged cart

---

## Subtask T007: Implement changeQuantity Operation

**Purpose**: Change item quantity with enforced minimum of 1.

**Steps**:

Add `changeQuantity` method:
```typescript
changeQuantity(skuId: string, newQuantity: number): CartOperationResult {
  const existingItem = this._items.get(skuId);
  
  if (!existingItem) {
    throw new Error(`Item with skuId '${skuId}' not found in cart`);
  }
  
  if (newQuantity < 1) {
    throw new Error('Quantity must be at least 1');
  }
  
  if (newQuantity === existingItem.quantity) {
    return { cart: this, events: [] };
  }
  
  const newItem = existingItem.withQuantity(newQuantity);
  const newItems = new Map(this._items);
  newItems.set(skuId, newItem);
  
  const events: CartDomainEvent[] = [{
    occurredAt: new Date(),
    eventType: 'CartItemQuantityChanged',
    skuId,
    previousQuantity: existingItem.quantity,
    newQuantity
  } as CartItemQuantityChanged];
  
  return {
    cart: this._with({ items: newItems }),
    events
  };
}
```

**Validation**:
- [ ] Changing quantity emits CartItemQuantityChanged event
- [ ] Changing to quantity < 1 throws error
- [ ] Changing non-existent item throws error

---

## Subtask T008: Implement clearCart Operation

**Purpose**: Remove all items from cart.

**Steps**:

Add `clearCart` method:
```typescript
clearCart(): CartOperationResult {
  const itemCount = this._items.size;
  
  if (itemCount === 0) {
    return { cart: this, events: [] };
  }
  
  const events: CartDomainEvent[] = [{
    occurredAt: new Date(),
    eventType: 'CartCleared',
    itemCount
  } as CartCleared];
  
  return {
    cart: this._with({ items: new Map() }),
    events
  };
}
```

**Validation**:
- [ ] Clearing cart emits CartCleared event with item count
- [ ] Clearing empty cart returns unchanged

---

## Subtask T009: Implement Coupon Operations

**Purpose**: Add and remove coupons from cart (single coupon per cart).

**Steps**:

Add `applyCoupon` method:
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

Add `removeCoupon` method:
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
- [ ] applyCoupon stores coupon code (normalized)
- [ ] applyCoupon with empty code throws error
- [ ] applyCoupon replaces existing coupon
- [ ] removeCoupon clears coupon if exists

---

## Subtask T010: Implement State Transitions

**Purpose**: Implement checkout lifecycle transitions with validation.

**Steps**:

Add `initiateCheckout` method:
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

Add `markCheckedOut` method:
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

Add `canTransitionTo` helper:
```typescript
canTransitionTo(targetState: CartState): boolean {
  const validTransitions: Record<CartState, CartState[]> = {
    [CartState.Active]: [CartState.Checkout_Pending],
    [CartState.Checkout_Pending]: [CartState.Checked_Out],
    [CartState.Checked_Out]: []
  };
  return validTransitions[this._state].includes(targetState);
}
```

**Validation**:
- [ ] initiateCheckout: Active → Checkout_Pending
- [ ] initiateCheckout throws if empty cart
- [ ] initiateCheckout throws if not Active
- [ ] markCheckedOut: Checkout_Pending → Checked_Out
- [ ] markCheckedOut throws if not Checkout_Pending

---

## Subtask T011: Verify Subtotal Computation

**Purpose**: Confirm subtotal uses integer arithmetic.

**Steps**:

Verify `subtotalCents` getter (already implemented in T004):
- Sums all item `totalPriceCents` using integer arithmetic
- Returns 0 for empty cart
- Handles multiple items correctly

**Validation**:
- [ ] Uses integer cents (not floats)
- [ ] Correctly sums multiple items

---

## Definition of Done

1. `cart.ts` implements complete Cart aggregate
2. All operations return `{ cart: Cart, events: CartDomainEvent[] }`
3. All operations are immutable
4. Quantity ≥ 1 invariant enforced
5. Valid state transitions only
6. `npm run lint` passes
7. Code compiles without errors

## Risks

- **Medium**: Immutability pattern must be consistent
- **Medium**: State machine logic needs careful validation

## Reviewer Guidance

- Verify all operations are truly immutable
- Verify events contain correct payload
- Verify quantity invariant (≥ 1)
- Verify state transitions follow valid paths only

## Implementation Command

```bash
spec-kitty implement WP02
```
