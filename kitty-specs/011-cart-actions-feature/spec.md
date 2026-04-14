# Cart Actions Feature — Specification

## 1. Overview

**Feature Name:** Cart Actions (Add, Remove, Change Quantity)

**Feature Type:** software-dev

**Summary:** Implement three use cases — `AddToCart`, `RemoveFromCart`, and `ChangeCartItemQuantity` — that orchestrate the Cart aggregate while validating stock availability via the Product entity. All operations emit typed domain events and return typed results that callers can handle programmatically.

**Dependencies:**
- `entities/cart` (Cart aggregate, ICartRepository)
- `entities/product` (ProductVariant, IStockRepository)
- `shared/lib` (EventBus, Money)

---

## 2. User Scenarios & Testing

### Scenario: Add Item to Cart (Happy Path)

1. User selects a product with quantity N on the product listing page
2. System checks stock availability via `IStockRepository.findBySku(skuId)`
3. System adds item to cart with quantity N (or increments existing item quantity)
4. System saves updated cart via `ICartRepository.saveCart()`
5. System publishes `ItemAddedToCart` domain event via EventBus
6. User sees cart updated with new item/quantity

### Scenario: Add Item to Cart (Insufficient Stock)

1. User selects a product with quantity N
2. System checks stock — requested quantity exceeds available stock
3. System returns `InsufficientStockError` with conflict info (available quantity, requested quantity)
4. No cart mutation occurs
5. User sees error message explaining stock limitation

### Scenario: Remove Item from Cart

1. User clicks "Remove" on a cart item
2. System removes the item from cart
3. System saves updated cart via `ICartRepository.saveCart()`
4. System publishes `ItemRemovedFromCart` domain event via EventBus
5. User sees cart updated without the item

### Scenario: Change Item Quantity (Increase)

1. User clicks "+" to increase quantity to N
2. System checks stock availability for quantity N
3. System updates item quantity in cart
4. System saves updated cart via `ICartRepository.saveCart()`
5. System publishes `CartItemQuantityChanged` domain event via EventBus
6. User sees quantity updated

### Scenario: Change Item Quantity (Blocked — Checkout Pending)

1. User is in checkout flow; cart is in `Checkout_Pending` state
2. User attempts to add/remove/change quantity
3. System returns `CartNotModifiableError`
4. No cart mutation occurs
5. User cannot modify cart during checkout

### Scenario: Change Item Quantity (Insufficient Stock After Check)

1. User selects new quantity N for item
2. System checks stock — stock dropped between check and update
3. System returns `StockConflictError` with updated available quantity
4. No cart mutation occurs

---

## 3. Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | `AddToCart(skuId, quantity)` adds item to cart or increments quantity if item already exists | Pending |
| FR-002 | `AddToCart` checks stock via `IStockRepository.findBySku()` before adding | Pending |
| FR-003 | `AddToCart` returns `InsufficientStockError` if requested quantity exceeds available stock | Pending |
| FR-004 | `AddToCart` returns `StockConflictError` if stock changed between check and add (race condition) | Pending |
| FR-005 | `AddToCart` returns `CartNotModifiableError` if cart is in `Checkout_Pending` or `Checked_Out` state | Pending |
| FR-006 | `RemoveFromCart(skuId)` removes item from cart | Pending |
| FR-007 | `RemoveFromCart` returns `CartNotModifiableError` if cart is in `Checkout_Pending` or `Checked_Out` state | Pending |
| FR-008 | `ChangeCartItemQuantity(skuId, newQuantity)` updates item quantity | Pending |
| FR-009 | `ChangeCartItemQuantity` enforces quantity >= 1 (rejects 0, which should be remove) | Pending |
| FR-010 | `ChangeCartItemQuantity` checks stock before updating | Pending |
| FR-011 | `ChangeCartItemQuantity` returns `InsufficientStockError` if new quantity exceeds available stock | Pending |
| FR-012 | `ChangeCartItemQuantity` returns `StockConflictError` if stock changed between check and update | Pending |
| FR-013 | `ChangeCartItemQuantity` returns `CartNotModifiableError` if cart is in `Checkout_Pending` or `Checked_Out` state | Pending |
| FR-014 | All operations publish corresponding domain events via EventBus (`ItemAddedToCart`, `ItemRemovedFromCart`, `CartItemQuantityChanged`) | Pending |
| FR-015 | All operations persist cart changes via `ICartRepository.saveCart()` | Pending |
| FR-016 | All operations return typed results with either success data or typed errors | Pending |

---

## 4. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | Stock check and cart update must be atomic to prevent overselling | N/A (synchronous operations; event-driven reservation in checkout) | Pending |
| NFR-002 | All use case functions complete within | < 100ms (repository operations are synchronous mocks) | Pending |
| NFR-003 | Unit tests cover 100% of use case code paths | 100% coverage | Pending |
| NFR-004 | No direct imports from infrastructure (Zustand, API clients) | Zero violations | Pending |

---

## 5. Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | FSD Compliance: use cases import only from `entities/cart`, `entities/product`, `shared/lib` | Pending |
| C-002 | All repository access goes through port interfaces (ICartRepository, IStockRepository) | Pending |
| C-003 | No direct cart store access — all mutations through ICartRepository | Pending |

---

## 6. Success Criteria

1. **SC-001**: User can add a product to cart with stock validation — item appears in cart with correct quantity
2. **SC-002**: User cannot add more items than available stock — receives clear error with available quantity
3. **SC-003**: User can remove an item from cart — item disappears from cart
4. **SC-004**: User can change item quantity within stock limits — updated quantity shown
5. **SC-005**: User cannot modify cart during checkout — receives clear blocking error
6. **SC-006**: All mutations emit domain events via EventBus — downstream features can react
7. **SC-007**: All operations return typed results — consumers can handle errors programmatically
8. **SC-008**: Unit tests cover happy paths and error paths for all three use cases

---

## 7. Key Entities

### CartActionsError (Discriminated Union)
```
type CartActionsError =
  | { type: 'InsufficientStockError'; skuId: string; requested: number; available: number }
  | { type: 'StockConflictError'; skuId: string; requested: number; currentAvailable: number }
  | { type: 'CartNotModifiableError'; currentState: CartState }
  | { type: 'ItemNotFoundError'; skuId: string }
```

### AddToCartResult
```
type AddToCartResult =
  | { success: true; cart: Cart; event: ItemAddedToCart }
  | { success: false; error: CartActionsError }
```

### RemoveFromCartResult
```
type RemoveFromCartResult =
  | { success: true; cart: Cart; event: ItemRemovedFromCart }
  | { success: false; error: CartActionsError }
```

### ChangeCartItemQuantityResult
```
type ChangeCartItemQuantityResult =
  | { success: true; cart: Cart; event: CartItemQuantityChanged }
  | { success: false; error: CartActionsError }
```

---

## 8. File Structure

```
src/features/cart-actions/
├── model/
│   ├── add-to-cart.ts        # AddToCart use case
│   ├── remove-from-cart.ts   # RemoveFromCart use case
│   ├── change-quantity.ts    # ChangeCartItemQuantity use case
│   ├── errors.ts             # Typed error types
│   ├── results.ts            # Typed result types
│   ├── index.ts              # Re-exports
│   └── add-to-cart.test.ts   # Unit tests
├── index.ts                  # Public API (use cases + types)
```

---

## 9. Assumptions

- `IStockRepository.findBySku()` returns `Promise<ProductVariant | null>`
- `ICartRepository.getCart()` returns `Promise<Cart>`
- `ICartRepository.saveCart()` accepts `Promise<void>`
- Cart aggregate exposes `state: CartState` property to check lifecycle state
- Cart aggregate exposes methods: `addItem()`, `removeItem()`, `changeQuantity()`
- EventBus is a singleton or injected instance available via `@/shared/lib/event-bus`

---

## 10. Out of Scope

- UI components (handled in T-015)
- Inventory reservation (handled in T-013 via EventBus subscription)
- Payment processing
- Order persistence beyond cart state
