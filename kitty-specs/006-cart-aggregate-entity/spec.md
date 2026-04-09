# Cart Aggregate & CartItem Entity

## Overview

**Ticket**: T-004  
**Layer**: `entities/cart`  
**Complexity**: 🟡 Medium  
**Depends On**: T-001 (`Money` Value Object)  
**Mission**: `006-cart-aggregate-entity`

The Cart is the central aggregate root for the shopping cart domain. It manages a collection of CartItems, enforces business invariants, computes pricing using the Money value object, and emits domain events for all state changes.

---

## Key Entities

### Cart (Aggregate Root)

The Cart is the single source of truth for cart state. It owns:
- A collection of CartItems keyed by `skuId`
- Applied coupon code (single coupon per cart; designed for extensibility)
- Lifecycle state
- Computed subtotal (sum of item totals)

### CartItem (Entity)

A CartItem represents a product variant in the cart. It is owned by the Cart and is identified by `skuId`. Changing the quantity or removing the item are operations on the Cart aggregate.

### Money (from T-001)

All monetary values are represented using the Money value object (integers in cents) to avoid floating-point precision errors.

---

## User Scenarios & Testing

### Scenario 1: Adding an item to an empty cart

**Given** the user is on the product page  
**When** they click "Add to Cart" for a product with `skuId = "SKU-001"` and price $25.00  
**Then** a new Cart is created with one CartItem: `{ skuId: "SKU-001", quantity: 1, unitPrice: $25.00 }`  
**And** the cart state is `Active`  
**And** the subtotal is `$25.00`  
**And** an `ItemAddedToCart` event is emitted

### Scenario 2: Adding the same item again (quantity increment)

**Given** the cart already contains `skuId = "SKU-001"` with quantity 1  
**When** the user adds `skuId = "SKU-001"` again  
**Then** the quantity increases to 2  
**And** the subtotal updates accordingly  
**And** a `CartItemQuantityChanged` event is emitted

### Scenario 3: Changing item quantity

**Given** the cart has `skuId = "SKU-001"` with quantity 2  
**When** the user changes the quantity to 5  
**Then** the quantity is updated to 5  
**And** the subtotal reflects the new total  
**And** a `CartItemQuantityChanged` event is emitted

### Scenario 4: Quantity enforcement (minimum 1)

**Given** the cart has `skuId = "SKU-001"` with quantity 1  
**When** the user attempts to change the quantity to 0  
**Then** the operation is rejected  
**And** an error is returned indicating quantity must be ≥ 1  
**And** the cart state remains unchanged

### Scenario 5: Removing an item

**Given** the cart contains `skuId = "SKU-001"`  
**When** the user removes the item  
**Then** the item is deleted from the cart  
**And** the subtotal is recalculated  
**And** an `ItemRemovedFromCart` event is emitted

### Scenario 6: Clearing the cart

**Given** the cart has multiple items  
**When** the user clears the entire cart  
**Then** all items are removed  
**And** the subtotal becomes `$0.00`  
**And** a `CartCleared` event is emitted

### Scenario 7: Initiating checkout

**Given** the cart has items and state is `Active`  
**When** `initiateCheckout()` is called  
**Then** the cart state transitions to `Checkout_Pending`  
**And** a `CheckoutInitiated` event is emitted

### Scenario 8: Completing checkout

**Given** the cart state is `Checkout_Pending`  
**When** `markCheckedOut()` is called  
**Then** the cart state transitions to `Checked_Out`  
**And** a `CheckoutCompleted` event is emitted

### Scenario 9: Applying a coupon

**Given** the cart has items with subtotal `$100.00`  
**When** `applyCoupon("SAVE10")` is called with a valid coupon  
**Then** the coupon code is stored  
**And** the discount is calculated  
**And** the cart total reflects the discount  
**And** a `CouponApplied` event is emitted

### Scenario 10: Coupon replaces previous coupon

**Given** the cart has coupon `"SAVE10"` applied  
**When** `applyCoupon("FLAT20")` is called  
**Then** `"SAVE10"` is replaced with `"FLAT20"`  
**And** a `CouponApplied` event is emitted for the new coupon

---

## Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | Cart manages a collection of CartItems keyed by `skuId` | Pending |
| FR-002 | Adding an existing `skuId` increments quantity instead of duplicating | Pending |
| FR-003 | `cart.addItem(item)` adds new item or increments existing item quantity | Pending |
| FR-004 | `cart.removeItem(skuId)` removes item and emits `ItemRemovedFromCart` | Pending |
| FR-005 | `cart.changeQuantity(skuId, qty)` enforces qty ≥ 1 (throws otherwise) | Pending |
| FR-006 | `cart.subtotal` returns a `Money` value computed from all item totals | Pending |
| FR-007 | Cart holds a single applied coupon code (empty string if none) | Pending |
| FR-008 | `cart.applyCoupon(code)` replaces any existing coupon | Pending |
| FR-009 | Cart lifecycle states: `Active`, `Checkout_Pending`, `Checked_Out` | Pending |
| FR-010 | `cart.initiateCheckout()` transitions `Active` → `Checkout_Pending` | Pending |
| FR-011 | `cart.markCheckedOut()` transitions `Checkout_Pending` → `Checked_Out` | Pending |
| FR-012 | Domain events emitted: `ItemAddedToCart`, `CartItemQuantityChanged`, `ItemRemovedFromCart`, `CartCleared`, `CheckoutInitiated`, `CheckoutCompleted`, `CouponApplied` | Pending |
| FR-013 | CartItem stores: `skuId`, `name`, `unitPrice` (Money), `quantity`, `createdAt` | Pending |

---

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | All monetary calculations use integer cents internally (via Money VO) | 100% compliance | Pending |
| NFR-002 | Immutability: all Cart operations that change state return new instances | No mutations on existing instances | Pending |

---

## Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Quantity must always be ≥ 1; operations that would violate this are rejected | Pending |
| C-002 | Only one coupon can be applied at a time (design allows future multi-coupon support) | Pending |

---

## Success Criteria

1. **Cart operations are correct**: All CRUD operations (add, remove, change quantity, clear) work as specified with proper event emission.
2. **Invariants are enforced**: Quantity never drops below 1; operations that would violate invariants return errors.
3. **Subtotal is accurate**: `subtotal` correctly sums all item totals using Money arithmetic.
4. **State transitions are valid**: Only legal transitions are allowed; invalid transitions are rejected.
5. **Events are emitted**: Every mutation emits the appropriate domain event.
6. **Unit tests pass**: All invariants and state transitions have test coverage.

---

## Assumptions

1. The Money value object (T-001) will be available before or alongside this implementation.
2. Cart is instantiated fresh per user session (no hydration/persistence in this ticket; handled later via repository).
3. Domain events are dispatched via the EventBus (T-002), but Cart itself only publishes events — the EventBus is injected/used by the calling code.
