# Data Model: Cart and Order Summary Widgets

This feature does not introduce new domain entities. It composes existing entities and features into two higher-level widgets. The data model below describes the props contracts consumed by the widgets.

## CartList Widget

### Input: Cart item (from `entities/cart`)

A cart item rendered by `CartList` matches the data already passed to `CartRow`.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| skuId | string | yes | Stable product identifier |
| name | string | yes | Product display name |
| description | string | yes | Short product description |
| imageUrl | string | yes | Product image URL |
| specs | Record<string, string> | no | Selected product specs, e.g. `{ Color: "Black" }` |
| price | string | yes | Display price; may include crossed-out original price separated by a space |
| quantity | number | yes | Current quantity in cart |
| minQuantity | number | no | Minimum allowed quantity (defaults to 1 in CartRow) |
| maxQuantity | number | no | Maximum allowed quantity (defaults to 99 in CartRow) |

### CartList Props

| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| items | `CartItemViewModel[]` | yes | Array of items to render |
| emptyStateTitle | string | no | Heading shown when cart is empty |
| emptyStateDescription | string | no | Body text shown when cart is empty |
| emptyStateActionLabel | string | no | Label for the empty-state CTA button |
| onEmptyStateAction | () => void | no | Called when the empty-state CTA is clicked |
| onIncrement | (skuId: string) => void | yes | Called when a row's increment control is activated |
| onDecrement | (skuId: string) => void | yes | Called when a row's decrement control is activated |
| onRemove | (skuId: string) => void | yes | Called when a row's remove action is confirmed |
| disabled | boolean | no | Disables all interactive controls in the list |

## OrderSummary Widget

### Input: Order summary line items

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| subtotal | string | yes | Subtotal for all items |
| discount | string | no | Discount amount; omitted or empty when no coupon applied |
| shipping | string | no | Shipping cost; may be omitted if free |
| total | string | yes | Final order total |

### Applied coupon (passed through to CouponInput)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| code | string | yes | Applied coupon code |
| discountLabel | string | yes | Human-readable discount description |

### OrderSummary Props

| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| subtotal | string | yes | Order subtotal line |
| discount | string | no | Discount line |
| shipping | string | no | Shipping line |
| total | string | yes | Final total line |
| appliedCoupon | `{ code: string; discountLabel: string }` | no | Coupon currently applied |
| couponError | string | no | Error message to display in the coupon input |
| isCouponLoading | boolean | no | Loading state for coupon apply/remove |
| onApplyCoupon | (code: string) => void | yes | Called when the shopper submits a coupon |
| onRemoveCoupon | () => void | yes | Called when the shopper removes the applied coupon |
| onCheckout | () => void | yes | Called when the checkout button is clicked |
| isCheckoutDisabled | boolean | no | Disables the checkout button |

## State Transitions

No internal state transitions in the widgets themselves. State changes are forwarded to the parent page via callbacks.

- `CartList` forwards `onIncrement`, `onDecrement`, `onRemove` to the page.
- `OrderSummary` forwards `onApplyCoupon`, `onRemoveCoupon`, `onCheckout` to the page.
