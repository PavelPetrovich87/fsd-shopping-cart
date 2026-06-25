# Cart and Order Summary Widgets

## Overview

Create two self-contained, reusable widgets that compose lower-level cart UI into cohesive blocks for the cart and checkout experiences.

- **CartList widget** displays the collection of items in the shopper's cart. When items exist, it renders each item as a row with quantity controls and a remove action. When the cart is empty, it renders an empty-state message with a call to action.
- **OrderSummary widget** displays the financial summary of the order—subtotal, discount, shipping, and total—and surfaces the coupon input and checkout action.

These widgets belong to the `widgets` layer of the architecture. They orchestrate `entities` and `features` but remain presentation-focused so that pages can place them into any layout without duplication.

## User Scenarios & Testing

### Scenario 1: Shopper views a populated cart

A shopper navigates to the cart page and sees every item they added. Each item shows the product image, name, description, selected specs, unit price, current quantity, controls to increase or decrease quantity, and a way to remove the item.

### Scenario 2: Shopper views an empty cart

A shopper opens the cart page before adding any items. Instead of a blank list, they see a friendly empty-state illustration, a short explanation, and a primary action that leads them back to browsing products.

### Scenario 3: Shopper reviews order totals

On the cart page, a shopper sees a summary card showing the subtotal for all items, any active discount, shipping cost, and the final total. The summary also lets them apply or remove a coupon and proceed to checkout.

## Functional Requirements

| ID | Requirement | Status |
| -- | ----------- | ------ |
| FR-001 | The CartList widget renders one row for every item in the cart when at least one item is present. | proposed |
| FR-002 | The CartList widget renders the existing empty-state component when the cart contains no items. | proposed |
| FR-003 | The CartList widget exposes per-item quantity increment and decrement controls and forwards the shopper's actions to the parent. | proposed |
| FR-004 | The CartList widget exposes a per-item remove action and forwards the shopper's action to the parent. | proposed |
| FR-005 | The OrderSummary widget displays the order subtotal, discount, shipping, and total amounts as distinct line items. | proposed |
| FR-006 | The OrderSummary widget embeds the coupon input feature so the shopper can apply or remove a coupon. | proposed |
| FR-007 | The OrderSummary widget embeds the checkout action trigger. | proposed |
| FR-008 | The OrderSummary widget receives subtotal, discount, shipping, and total as input props and does not compute them internally. | proposed |

## Non-Functional Requirements

| ID | Requirement | Status |
| -- | ----------- | ------ |
| NFR-001 | Each widget is delivered as a single root component that accepts all data and callbacks via props, so it can be placed into any page layout without modification. | proposed |
| NFR-002 | Widgets render legibly without horizontal scroll on viewports ranging from 320px to 1920px. | proposed |
| NFR-003 | Loading, error, and disabled states are handled by the composing page or by lower-level components; the widgets themselves contain no bespoke loading or error UI. | proposed |

## Constraints

| ID | Constraint |
| -- | ---------- |
| C-001 | Widgets may only import from `entities`, `features`, and `shared` layers. |
| C-002 | Widgets must not import from `pages` or from other `widgets`. |
| C-003 | The OrderSummary widget must not derive discount or shipping values internally; it must remain purely presentational. |

## Success Criteria

- Shoppers see a list of cart items with working quantity and remove controls.
- Shoppers see a friendly empty state when the cart has no items.
- Shoppers see subtotal, discount, shipping, and total line items in the order summary.
- Shoppers can apply or remove a coupon and initiate checkout from the order summary.
- Both widgets can be reused on the cart page and any future checkout page without changes.

## Key Entities

- **Cart item**: A product added to the cart, identified by SKU, with name, description, image, selected specs, unit price, and quantity.
- **Cart**: The shopper's current selection of items and optional coupon code.
- **Order summary line items**: Subtotal, discount, shipping, and total monetary amounts.

## Assumptions

- The empty-state component already exists in the cart entity layer.
- Quantity selector, remove button, coupon input, and checkout button are available as lower-level feature components.
- The parent page computes discount and shipping values and passes them into the OrderSummary widget.

## Dependencies

- T-025: Cart actions feature (quantity selector, remove button) — completed.
- T-026: Coupon input feature — completed.
- T-017: Cart entity (CartRow, EmptyState) — completed.

## Design Reference

Source file: `shopping-cart-section-figma` (Penpot)
- File ID: `4cba8d8d-63bf-80c5-8007-e20e604c26a0`
- Page: `Design`
- Page ID: `6af293a7-f75e-808e-8007-e20dfb265d42`

### Widget boards

| Widget | Board name | Board ID |
| ------ | ---------- | -------- |
| CartList | `product-list container` | `385bff8a-10f2-525c-818e-84b70d058d27` |
| OrderSummary | `order-summary` | `051c740f-9da6-5b2e-a071-97948e3db770` |
| OrderSummary (with discount/coupon applied) | `order-summary-discount` | `01133815-c5a9-54d9-b582-06c74f37a294` |

### Supported viewport resolutions

| Viewport | Width | Layout of CartList + OrderSummary |
| -------- | ----- | --------------------------------- |
| Desktop | 1440px | Side-by-side (CartList left, OrderSummary right) |
| Tablet | 768px | Stacked vertically (OrderSummary above CartList) |
| Mobile | 375px | Stacked vertically (OrderSummary above CartList) |
