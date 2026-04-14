# Checkout Feature Specification

## 1. Overview

### Purpose
Implements the checkout initiation use case for the shopping cart application. When a user proceeds to checkout, the system validates stock availability for all items in the cart, transitions the cart to a checkout-pending state, and emits a `CheckoutInitiated` event. The app shell (T-019) is responsible for subscribing to this event and triggering stock reservation.

### Scope
This feature covers only the `InitiateCheckout` use case within `features/checkout`. It does not include payment processing, order confirmation, or stock reservation logic (those are handled by the app shell or other features).

### Users
- **Customer**: Initiates checkout from a cart with items
- **System**: Validates stock availability and emits domain events

---

## 2. User Scenarios & Testing

### Primary Flow: Successful Checkout Initiation

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Customer | Views cart with valid items | Cart displays items, subtotal, and checkout button |
| 2 | Customer | Clicks "Proceed to Checkout" | System validates stock for all cart items |
| 3 | Customer | — | All items have sufficient stock |
| 4 | System | — | Cart transitions to `Checkout_Pending` state |
| 5 | System | — | `CheckoutInitiated` event is published via EventBus |

### Error Flow: Stock Conflict During Checkout

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Customer | Views cart and clicks checkout | System validates stock |
| 2 | System | — | One or more items have insufficient stock |
| 3 | System | — | Returns conflict information with items and available quantities |
| 4 | Customer | — | Presented with stock conflict modal showing updated quantities |

### Edge Cases

- **Empty cart**: Checkout button should be disabled; no way to initiate checkout
- **Already in checkout state**: Attempting to initiate checkout on a cart already in `Checkout_Pending` or `Checked_Out` state should return an error
- **Zero-quantity item**: Should not be allowed in cart (invariant enforcement in T-004)
- **Negative stock**: Stock validation must handle cases where `availableStock` returns 0 or negative

---

## 3. Functional Requirements

### FR-014-001: Stock Validation
The `InitiateCheckout` use case must validate stock availability for **all items** in the cart before proceeding.

- For each cart item, query `IStockRepository.findBySku(skuId)` to get the current `ProductVariant`
- Compare requested quantity against `variant.availableStock`
- If any item has insufficient stock, return a conflict result containing the affected items and their updated available quantities

### FR-014-002: Conflict Information
When stock has changed, the use case must return structured conflict information:

- List of items with insufficient stock
- For each conflicting item: `skuId`, product name, requested quantity, and available quantity
- The cart state remains unchanged (stays `Active`)

### FR-014-003: Cart State Transition
On successful validation:

- Cart transitions from `Active` to `Checkout_Pending` state
- Transition is persisted via `ICartRepository.saveCart(cart)`
- The `CartStateChanged` domain event is emitted

### FR-014-004: CheckoutInitiated Event
After cart state transition:

- Publish `CheckoutInitiated` event via EventBus
- Event payload includes: `cartId`, `userId`, `items`, `subtotal`, `timestamp`
- EventBus subscription handling (stock reservation) is implemented in T-019 app shell, not in this feature

### FR-014-005: Error Handling
- If cart is not in `Active` state → return error result
- If cart is empty → return error result
- If stock validation fails → return conflict result (not an error)

---

## 4. Non-Functional Requirements

### NFR-014-001: Performance
- Stock validation for a cart with up to 20 items must complete in under 500ms
- Event publishing must be non-blocking (async)

### NFR-014-002: Reliability
- Cart state transition and event publishing should be atomic where possible
- If event publishing fails, cart state should still be persisted

---

## 5. Constraints

### C-014-001: No Payment Processing
This feature does not handle payment. It stops at checkout initiation.

### C-014-002: No Direct Stock Modification
This feature does not directly modify stock. It only validates and emits events. Stock reservation is handled by the app shell subscription to `CheckoutInitiated`.

### C-014-003: FSD Compliance
All imports must follow Feature-Sliced Design layer rules:

- `features/checkout` may only import from `entities/cart`, `entities/product`, `shared/lib`
- No direct imports from other features

---

## 6. Key Entities

### InitiateCheckoutResult
```typescript
type InitiateCheckoutResult =
  | { success: true; cart: Cart }
  | { success: false; reason: 'empty_cart' | 'invalid_state' }
  | { success: false; reason: 'stock_conflict'; conflicts: StockConflict[] }
```

### StockConflict
```typescript
interface StockConflict {
  skuId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}
```

### CheckoutInitiated Event
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

---

## 7. Assumptions

- The cart repository (`ICartRepository`) uses async signatures (`getCart(): Promise<Cart>`, `saveCart(cart: Cart): Promise<void>`) per T-010 correction
- The EventBus is already implemented and available via `@/shared/lib`
- Stock reservation logic will be implemented in T-019 app shell, subscribing to `CheckoutInitiated`
- All domain events use `eventType` field (fixed in T-012)

---

## 8. Files to Create

| File | Purpose |
|------|---------|
| `src/features/checkout/model/initiate-checkout.ts` | `InitiateCheckout` use case |
| `src/features/checkout/model/initiate-checkout.test.ts` | Unit tests |
| `src/features/checkout/index.ts` | Public API re-exports |

---

## 9. Dependencies

- T-004: Cart aggregate + CartItem entity
- T-005: ProductVariant aggregate
- T-007: Entity port interfaces
- T-008: Mock repositories
- T-009: Zustand cart repository
- T-010: Cart repository contract (async)
- T-002: EventBus
- T-012: EventBus.publish fix (eventType field)
