# Specification: Feature UI Components for Cart, Coupon, and Checkout

## Feature Title

Feature UI Components for Cart, Coupon, and Checkout

## Description

Build interactive feature-level UI components that connect the design system's base components to domain use cases. These components handle user interactions for cart quantity management, item removal, coupon application, and checkout initiation. Each component is self-contained, receives data via props, delegates actions through callbacks, and reuses existing base components from the design system.

The components are organized into three feature areas:
- **Cart Actions**: QuantitySelector and RemoveButton
- **Apply Coupon**: CouponInput
- **Checkout**: CheckoutButton and StockConflictModal

## User Scenarios & Testing

### Scenario 1: Adjusting Cart Item Quantity
**Actor**: Shopper viewing their cart
**Flow**:
1. Shopper sees a cart item with current quantity displayed
2. Shopper clicks the "+" button to increase quantity
3. System checks stock availability before applying the change
4. If stock is sufficient, quantity updates; if not, "+" button is disabled
5. Shopper clicks the "−" button to decrease quantity
6. When quantity reaches 1, the "−" button becomes disabled

**Edge cases**:
- Attempting to increase beyond available stock disables the "+" button
- Quantity never goes below 1

### Scenario 2: Removing an Item from Cart
**Actor**: Shopper viewing their cart
**Flow**:
1. Shopper clicks the "Remove" link next to a cart item
2. A confirmation modal appears with title "Confirm Item Removal"
3. Modal body asks: "Are you sure you want to remove this item from your shopping cart?"
4. Shopper clicks "Cancel" — modal closes, item remains in cart
5. Shopper clicks "Yes" — modal closes, item is removed from cart
6. Shopper can also close the modal via the × button, ESC key, or backdrop click

**Edge cases**:
- Modal traps focus while open
- Focus returns to the Remove button when modal closes

### Scenario 3: Applying a Coupon Code
**Actor**: Shopper on the cart page
**Flow**:
1. Shopper sees an "Apply coupon" button in the order summary
2. Shopper clicks the button — an input field appears
3. Shopper enters a coupon code and submits
4. If the field is empty, an error message appears: "Please enter a valid code"
5. If the code is invalid, an error message appears: "Sorry, but this coupon doesn't exist"
6. If the code is valid, the input is replaced by a dismissible tag showing the applied coupon, and a discount row appears in the summary
7. Shopper clicks the × on the coupon tag to remove the applied coupon

**Edge cases**:
- Coupon validation happens on submit, not while typing
- Empty submission triggers immediate error feedback

### Scenario 4: Initiating Checkout with Stock Conflict
**Actor**: Shopper ready to checkout
**Flow**:
1. Shopper clicks the "Checkout" button
2. System validates stock for all cart items
3. If stock is sufficient, checkout proceeds
4. If stock has changed since items were added, a modal appears showing affected products with old vs. new quantities
5. For multiple affected products: modal shows "Change of stock" title, product cards with quantity changes, and an "Ok" button
6. For a single product that empties the cart: modal shows additional message "Since there are no more items in your cart, you will be brought back to cart" and a "Go back to cart" button
7. Shopper acknowledges the conflict and returns to the cart

**Edge cases**:
- Checkout button is disabled when cart is empty
- Stock conflicts detected during checkout do not modify cart automatically

## Functional Requirements

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | QuantitySelector displays current quantity with "−" and "+" controls | Must | Proposed |
| FR-002 | QuantitySelector disables "−" button when quantity equals the minimum (1) | Must | Proposed |
| FR-003 | QuantitySelector disables "+" button when quantity equals or exceeds available stock | Must | Proposed |
| FR-004 | QuantitySelector invokes the ChangeQuantity use case when user increments or decrements | Must | Proposed |
| FR-005 | RemoveButton renders as a text link labeled "Remove" | Must | Proposed |
| FR-006 | RemoveButton opens a confirmation modal on click before executing removal | Must | Proposed |
| FR-007 | Confirmation modal displays title "Confirm Item Removal" | Must | Proposed |
| FR-008 | Confirmation modal displays body text: "Are you sure you want to remove this item from your shopping cart?" | Must | Proposed |
| FR-009 | Confirmation modal provides "Cancel" and "Yes" action buttons | Must | Proposed |
| FR-010 | Confirmation modal closes via × button, ESC key, backdrop click, or Cancel button | Must | Proposed |
| FR-011 | Confirmation modal traps focus while open and restores focus on close | Must | Proposed |
| FR-012 | CouponInput initial state displays an "Apply coupon" button | Must | Proposed |
| FR-013 | CouponInput reveals a text input field when the button is clicked | Must | Proposed |
| FR-014 | CouponInput validates the entered code on submit | Must | Proposed |
| FR-015 | CouponInput displays "Please enter a valid code" error when submitted empty | Must | Proposed |
| FR-016 | CouponInput displays "Sorry, but this coupon doesn't exist" error for invalid codes | Must | Proposed |
| FR-017 | CouponInput success state displays the applied coupon as a dismissible tag with discount amount | Must | Proposed |
| FR-018 | CouponInput allows removing the applied coupon via the tag's dismiss button | Must | Proposed |
| FR-019 | CheckoutButton triggers the InitiateCheckout use case on click | Must | Proposed |
| FR-020 | CheckoutButton is disabled when the cart is empty or not in an active state | Must | Proposed |
| FR-021 | StockConflictModal displays when InitiateCheckout returns stock conflicts | Must | Proposed |
| FR-022 | StockConflictModal shows a list of affected products with old quantity, arrow indicator, and new available quantity | Must | Proposed |
| FR-023 | StockConflictModal multi-product variant provides an "Ok" button to acknowledge | Must | Proposed |
| FR-024 | StockConflictModal single-product empty-cart variant shows message "Since there are no more items in your cart, you will be brought back to cart" and a "Go back to cart" button | Must | Proposed |
| FR-025 | All components include visual documentation covering their states and variants | Must | Proposed |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | All interactive elements are keyboard accessible | Tab navigation works for all controls; buttons activate with Enter/Space | Proposed |
| NFR-002 | Modal dialogs expose correct ARIA semantics | role="dialog", aria-modal="true", aria-labelledby references the modal title | Proposed |
| NFR-003 | Icon-only controls have descriptive accessible labels | Every button containing only an icon has an aria-label | Proposed |
| NFR-004 | Quantity changes are announced to assistive technology | Live region announces quantity updates | Proposed |
| NFR-005 | Components adapt to responsive breakpoints | Layouts work on viewport widths from 320px to 1440px | Proposed |
| NFR-006 | Error states are perceivable without color alone | Error indicators include text and icon, not just border color change | Proposed |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Reuse existing base components: Button, InputField, CartControl, Tag, Modal | Proposed |
| C-002 | Components receive data via props and delegate actions via callbacks — no direct store access | Proposed |
| C-003 | Components reside in the features layer and import only from lower layers (entities, shared) per the project's architecture rules | Proposed |
| C-004 | CouponInput button-to-input transition is an instant toggle without CSS animations | Proposed |
| C-005 | RemoveButton confirmation uses the existing Modal component, not a custom implementation | Proposed |

## Success Criteria

1. Users can adjust cart item quantities using stock-aware +/− controls without page reload
2. Users receive explicit confirmation before an item is permanently removed from the cart
3. Users can apply coupon codes with immediate validation feedback and see applied discounts
4. Users are informed of stock changes during checkout via a clear modal before proceeding
5. All components are visually documented with stories covering every state and variant
6. No duplicate base component implementations exist — all feature UI components reuse existing design system elements

## Key Entities

- **CartItem** — represents a product in the cart with skuId, name, variant specs, unit price, and quantity
- **StockConflict** — represents a mismatch between requested quantity and available stock for a product
- **Coupon** — represents a discount code with flat or percentage discount mode
- **Cart** — aggregate root holding items, applied coupons, and lifecycle state

## Assumptions

1. The ChangeQuantity, RemoveFromCart, ApplyCoupon, and InitiateCheckout use cases are already implemented and expose stable interfaces
2. The CartControl, Button, InputField, Tag, and Modal base components are already implemented with the interfaces documented in their respective stories
3. The Zustand cart store and mock repositories provide reactive data that parent components can pass as props
4. Product images for StockConflictModal are available as URLs or placeholders

## Dependencies

- T-010 (Cart Actions use cases) — ChangeQuantity, RemoveFromCart
- T-011 (Apply Coupon use cases) — ApplyCoupon, RemoveCoupon
- T-012 (Checkout use case) — InitiateCheckout
- T-017 (Design System Foundation) — tokens, theme
- T-019 (Button component)
- T-020 (Input Field component)
- T-021 (Cart Control component)
- T-023 (Tag component)
- T-024 (Modal component)

## Out of Scope

- Widget composition (CartList, OrderSummary) — covered by T-027
- Page-level layout (CartPage, HomePage) — covered by T-028
- App shell wiring (routing, providers, header) — covered by T-029
- Product card component for StockConflictModal — if not already present, a minimal inline version may be created within the modal
- Payment processing or order completion flow
- Real-time stock updates via WebSocket or polling
