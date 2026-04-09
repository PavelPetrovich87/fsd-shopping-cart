---
work_package_id: WP02
title: Cart Core - Item Operations
dependencies: [WP01]
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-012
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch: main. Planning/base: main. Merge target: main. Execution worktrees allocated per computed lane from lanes.json.'
subtasks: [T004, T005, T006, T007, T008]
history:
- date: '2026-04-09T14:25:50Z'
  action: created
  detail: Initial work package
authoritative_surface: src/entities/cart/model/
execution_mode: code_change
owned_files: [src/entities/cart/model/cart.ts, src/entities/cart/model/cart-item.ts]
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-012]
---

# Work Package WP02: Cart Core - Item Operations

## Objective

Implement the Cart aggregate root with core item CRUD operations (add, remove, change quantity, clear). Each operation returns `{ cart: Cart, events: DomainEvent[] }` tuple for explicit event handling.

## Context

**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004  
**Layer**: `entities/cart/model/`  
**Depends On**: WP01 (types, events, CartItem entity)  
**Event Pattern**: Each mutation returns `{ cart: Cart, events: DomainEvent[] }` tuple

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `src/entities/cart/model/cart.ts` | Cart aggregate root (new file) |

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
     CartCleared 
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
       private readonly _items: ReadonlyMap<string, CartItem>,  // keyed by skuId
       private readonly _couponCode: string,
       private readonly _createdAt: Date,
       private readonly _updatedAt: Date
     ) {
       // Freeze the instance
       Object.freeze(this);
     }
   
     static create(id?: string): Cart {
       const now = new Date();
       return new Cart(
         id ?? crypto.randomUUID(),
         CartState.Active,
         new Map(),  // Empty items
         '',         // No coupon
         now,
         now
       );
     }
   
     // Getters
     get id(): string { return this._id; }
     get state(): CartState { return this._state; }
     get couponCode(): string { return this._couponCode; }
     get createdAt(): Date { return this._createdAt; }
     get updatedAt(): Date { return this._updatedAt; }
   
     // Read-only item access
     get items(): CartItem[] {
       return Array.from(this._items.values());
     }
   
     hasItem(skuId: string): boolean {
       return this._items.has(skuId);
     }
   
     getItem(skuId: string): CartItem | undefined {
       return this._items.get(skuId);
     }
   
     // Internal factory for creating modified instances
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
   
     toData(): CartData {
       return {
         id: this._id,
         state: this._state,
         items: this.items.map(item => item.toData()),
         couponCode: this._couponCode,
         createdAt: this._createdAt,
         updatedAt: this._updatedAt
       };
     }
   }
   ```

**Validation**:
- [ ] Cart is immutable (instance frozen)
- [ ] `create()` factory returns new Active cart
- [ ] Items stored as ReadonlyMap keyed by skuId
- [ ] `toData()` returns plain object

---

## Subtask T005: Implement addItem Operation

**Purpose**: Add item to cart or increment quantity if SKU already exists.

**Steps**:

1. Add `addItem` method to `Cart` class:
   ```typescript
   addItem(data: Omit<CartItemData, 'createdAt'>): CartOperationResult {
     const events: CartDomainEvent[] = [];
     let newItems = new Map(this._items);
     
     const existingItem = this._items.get(data.skuId);
     let newItem: CartItem;
     
     if (existingItem) {
       // Increment quantity
       newItem = existingItem.withQuantity(existingItem.quantity + data.quantity);
       events.push({
         occurredAt: new Date(),
         eventType: 'CartItemQuantityChanged',
         skuId: data.skuId,
         previousQuantity: existingItem.quantity,
         newQuantity: newItem.quantity
       } as CartItemQuantityChanged);
     } else {
       // Add new item
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

2. Add type to CartDomainEvent union in events.ts if needed (already covered)

**Validation**:
- [ ] Adding new item creates ItemAddedToCart event
- [ ] Adding existing SKU increments quantity with CartItemQuantityChanged event
- [ ] Returns new Cart instance (immutable)
- [ ] Events array contains correct event type

---

## Subtask T006: Implement removeItem Operation

**Purpose**: Remove item from cart by SKU.

**Steps**:

1. Add `removeItem` method to `Cart` class:
   ```typescript
   removeItem(skuId: string): CartOperationResult {
     const events: CartDomainEvent[] = [];
     
     const existingItem = this._items.get(skuId);
     if (!existingItem) {
       // Item not found - return unchanged
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
- [ ] Removing non-existent item returns unchanged cart with empty events
- [ ] Returns new Cart instance (immutable)

---

## Subtask T007: Implement changeQuantity Operation

**Purpose**: Change item quantity with enforced minimum of 1.

**Steps**:

1. Add `changeQuantity` method to `Cart` class:
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
       // No change needed
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
- [ ] Changing quantity to valid value emits CartItemQuantityChanged event
- [ ] Changing to quantity < 1 throws error
- [ ] Changing quantity of non-existent item throws error
- [ ] Changing to same quantity returns unchanged cart
- [ ] Returns new Cart instance (immutable)

---

## Subtask T008: Implement clearCart Operation

**Purpose**: Remove all items from cart.

**Steps**:

1. Add `clearCart` method to `Cart` class:
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
- [ ] Clearing cart with items emits CartCleared event with item count
- [ ] Clearing empty cart returns unchanged cart with empty events
- [ ] Returns new Cart instance (immutable)

---

## Definition of Done

1. `cart.ts` implements all 4 item operations
2. Each operation returns `{ cart: Cart, events: CartDomainEvent[] }`
3. All operations are immutable (return new Cart instance)
4. Quantity ≥ 1 invariant enforced in changeQuantity
5. Appropriate events emitted for each operation
6. `npm run lint` passes
7. Code compiles without errors

## Risks

- **Medium**: Immutability pattern must be consistent throughout
- **Medium**: Error handling for invalid states

## Reviewer Guidance

- Verify all operations are truly immutable (no mutation of existing Cart)
- Verify events contain correct payload data
- Verify quantity invariant (≥ 1) is enforced
- Verify addItem increments existing SKU quantity
- Verify removeItem handles non-existent SKU gracefully

## Implementation Command

```bash
spec-kitty implement WP02
```
