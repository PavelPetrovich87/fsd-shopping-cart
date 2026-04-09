---
work_package_id: WP01
title: Foundation - Types, Events, CartItem Entity
dependencies: []
requirement_refs:
- FR-009
- FR-012
- FR-013
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: [T001, T002, T003]
agent: "kilo:auto/balanced:reviewer"
shell_pid: "19459"
history:
- date: '2026-04-09T14:25:50Z'
  action: created
  detail: Initial work package
authoritative_surface: src/entities/cart/model/
execution_mode: code_change
owned_files: [src/entities/cart/model/types.ts, src/entities/cart/model/events.ts, src/entities/cart/model/cart-item.ts]
requirements: [FR-009, FR-012, FR-013]
---

# Work Package WP01: Foundation - Types, Events, CartItem Entity

## Objective

Create the foundational types, domain event interfaces, and CartItem entity class. This WP establishes the data model and event contracts that the Cart aggregate will use.

## Context

**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004  
**Layer**: `entities/cart/model/`  
**Depends On**: T-001 (`Money` Value Object)  
**Event Pattern**: Each mutation returns `{ cart: Cart, events: DomainEvent[] }` tuple

## Files to Create

| File | Purpose |
|------|---------|
| `src/entities/cart/model/types.ts` | CartState enum, CartItem type |
| `src/entities/cart/model/events.ts` | Domain event interfaces |
| `src/entities/cart/model/cart-item.ts` | CartItem entity class |

## Subtask T001: Create types.ts

**Purpose**: Define the core type definitions for Cart state and CartItem data.

**Steps**:

1. Create `src/entities/cart/model/types.ts`

2. Define `CartState` enum:
   ```typescript
   export enum CartState {
     Active = 'Active',
     Checkout_Pending = 'Checkout_Pending',
     Checked_Out = 'Checked_Out'
   }
   ```

3. Define `CartItemData` interface (plain data, used for inputs):
   ```typescript
   export interface CartItemData {
     skuId: string;
     name: string;
     unitPriceCents: number;  // Price in cents (integer)
     quantity: number;
     createdAt: Date;
   }
   ```

4. Define `CartData` interface for cart state:
   ```typescript
   export interface CartData {
     id: string;
     state: CartState;
     items: CartItemData[];
     couponCode: string;  // Empty string if no coupon
     createdAt: Date;
     updatedAt: Date;
   }
   ```

5. Export all types

**Validation**:
- [ ] CartState enum has all three states
- [ ] CartItemData has all required fields
- [ ] Types are exported for external use

---

## Subtask T002: Create events.ts

**Purpose**: Define all domain event interfaces that Cart will emit.

**Steps**:

1. Create `src/entities/cart/model/events.ts`

2. Define base `DomainEvent` interface:
   ```typescript
   export interface DomainEvent {
     readonly occurredAt: Date;
     readonly eventType: string;
   }
   ```

3. Define item-related events:
   ```typescript
   export interface ItemAddedToCart extends DomainEvent {
     readonly eventType: 'ItemAddedToCart';
     readonly skuId: string;
     readonly name: string;
     readonly unitPriceCents: number;
     readonly quantity: number;
   }
   
   export interface CartItemQuantityChanged extends DomainEvent {
     readonly eventType: 'CartItemQuantityChanged';
     readonly skuId: string;
     readonly previousQuantity: number;
     readonly newQuantity: number;
   }
   
   export interface ItemRemovedFromCart extends DomainEvent {
     readonly eventType: 'ItemRemovedFromCart';
     readonly skuId: string;
     readonly previousQuantity: number;
   }
   
   export interface CartCleared extends DomainEvent {
     readonly eventType: 'CartCleared';
     readonly itemCount: number;
   }
   ```

4. Define checkout events:
   ```typescript
   export interface CheckoutInitiated extends DomainEvent {
     readonly eventType: 'CheckoutInitiated';
     readonly cartId: string;
   }
   
   export interface CheckoutCompleted extends DomainEvent {
     readonly eventType: 'CheckoutCompleted';
     readonly cartId: string;
   }
   ```

5. Define coupon events:
   ```typescript
   export interface CouponApplied extends DomainEvent {
     readonly eventType: 'CouponApplied';
     readonly couponCode: string;
   }
   
   export interface CouponRemoved extends DomainEvent {
     readonly eventType: 'CouponRemoved';
     readonly previousCouponCode: string;
   }
   ```

6. Export all event types and a union type:
   ```typescript
   export type CartDomainEvent = 
     | ItemAddedToCart
     | CartItemQuantityChanged
     | ItemRemovedFromCart
     | CartCleared
     | CheckoutInitiated
     | CheckoutCompleted
     | CouponApplied
     | CouponRemoved;
   ```

**Validation**:
- [ ] All 8 event types defined
- [ ] Union type `CartDomainEvent` covers all events
- [ ] Events include relevant payload data

---

## Subtask T003: Create cart-item.ts

**Purpose**: Implement the CartItem entity as an immutable class.

**Steps**:

1. Create `src/entities/cart/model/cart-item.ts`

2. Import types:
   ```typescript
   import { CartItemData } from './types';
   ```

3. Create `CartItem` class:
   ```typescript
   export class CartItem {
     readonly skuId: string;
     readonly name: string;
     readonly unitPriceCents: number;
     readonly quantity: number;
     readonly createdAt: Date;
   
     private constructor(data: CartItemData) {
       // Freeze all properties
       Object.freeze(this);
     }
   
     static create(data: CartItemData): CartItem {
       if (data.quantity < 1) {
         throw new Error('Quantity must be at least 1');
       }
       if (data.unitPriceCents < 0) {
         throw new Error('Unit price cannot be negative');
       }
       return new CartItem({
         ...data,
         createdAt: data.createdAt ?? new Date()
       });
     }
   
     get totalPriceCents(): number {
       return this.unitPriceCents * this.quantity;
     }
   
     withQuantity(newQuantity: number): CartItem {
       if (newQuantity < 1) {
         throw new Error('Quantity must be at least 1');
       }
       return CartItem.create({
         skuId: this.skuId,
         name: this.name,
         unitPriceCents: this.unitPriceCents,
         quantity: newQuantity,
         createdAt: this.createdAt
       });
     }
   
     toData(): CartItemData {
       return {
         skuId: this.skuId,
         name: this.name,
         unitPriceCents: this.unitPriceCents,
         quantity: this.quantity,
         createdAt: this.createdAt
       };
     }
   }
   ```

**Validation**:
- [ ] CartItem is immutable (properties cannot be modified after creation)
- [ ] `create()` validates quantity ≥ 1
- [ ] `withQuantity()` creates new instance, enforces qty ≥ 1
- [ ] `totalPriceCents` computed correctly (unitPrice × quantity)
- [ ] `toData()` returns plain object representation

**Edge Cases**:
- Negative unit price: Throw error
- Zero quantity: Throw error (enforced by create and withQuantity)
- Negative quantity: Throw error

---

## Definition of Done

1. All three files created in `src/entities/cart/model/`
2. Types are properly exported
3. All validation checks pass
4. `npm run lint` passes
5. Code compiles without errors

## Risks

- **Low**: Pure type definitions and a simple entity class

## Reviewer Guidance

- Verify CartItem immutability (properties should be readonly)
- Verify validation logic catches invalid inputs
- Verify event interfaces match spec requirements (8 total events)

## Activity Log

- 2026-04-09T15:04:03Z – kilo:auto/balanced:implementer – shell_pid=19459 – Started implementation via action command
- 2026-04-09T15:06:22Z – kilo:auto/balanced:implementer – shell_pid=19459 – Ready for review: Foundation types, events, and CartItem entity created with immutability and validation
- 2026-04-09T15:06:34Z – kilo:auto/balanced:reviewer – shell_pid=19459 – Started review via action command
