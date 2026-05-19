# Research: 025-feature-ui-cart-coupon-checkout

**Date**: 2026-05-19
**Feature**: Feature UI Components for Cart, Coupon, and Checkout

## Research Questions

1. What are the exact prop interfaces of existing base components?
2. What entity types and use case result types are available?
3. How should feature components bridge base components to domain use cases without direct store access?
4. What is the established story pattern in this codebase?
5. Are there any gaps between the spec requirements and existing base component capabilities?

## Findings

### Base Component APIs (from `/Users/user/work/fsd-shopping-cart/src/shared/ui/`)

| Component | Key Props | Relevant For |
|---|---|---|
| `Button` | `variant`, `size`, `disabled`, `onClick`, `children` | RemoveButton (link variant), CheckoutButton, CouponInput toggle |
| `CartControl` | `quantity`, `min`, `max`, `disabled`, `onIncrement`, `onDecrement` | QuantitySelector (wraps with stock-aware max) |
| `InputField` | `label`, `placeholder`, `value`, `error`, `disabled`, `autoFocus`, `onChange`, `onFocus`, `onBlur` | CouponInput (revealed on toggle) |
| `Tag` | `children`, `onDismiss` | CouponInput (success state with dismiss) |
| `Modal` | `open`, `onClose`, `title`, `children` | RemoveButton confirmation, StockConflictModal |

### Entity Types

**CartItem** (`src/entities/cart/model/cart-item.ts`):
- `skuId: string`
- `name: string`
- `unitPriceCents: number`
- `quantity: number`
- `createdAt: Date`

**Cart** (`src/entities/cart/model/cart.ts`):
- `id: string`
- `state: CartState` ('Active' | 'Checkout_Pending' | 'Checked_Out')
- `items: ReadonlyMap<string, CartItem>`
- `couponCode: string`

**StockConflict** (`src/features/checkout/model/result-types.ts`):
- `skuId: string`
- `productName: string`
- `requestedQuantity: number`
- `availableQuantity: number`

### Use Case Results

- `ChangeCartItemQuantityResult`: `{ success: true; cart: Cart; event: CartItemQuantityChanged } | { success: false; error: CartActionsError }`
- `RemoveFromCartResult`: `{ success: true; cart: Cart; event: ItemRemovedFromCart } | { success: false; error: CartActionsError }`
- `ApplyCouponResult`: `{ success: true; cart: Cart; event: CouponApplied } | { success: false; error: ApplyCouponError }`
- `InitiateCheckoutResult`: `{ success: true; cart: Cart } | { success: false; reason: 'empty_cart' | 'invalid_state' | 'stock_conflict'; conflicts?: StockConflict[] }`

## Decisions

### Decision: Feature components are pure presentational with callback delegation
**Rationale**: Constraint C-002 explicitly requires "Components receive data via props and delegate actions via callbacks - no direct store access." The use cases require `ICartRepository`, `IStockRepository`, and `EventBus` dependencies that must be injected at a higher layer. Feature components emit callbacks like `onChangeQuantity(skuId, newQuantity)` and parent widgets/container components wire them to use cases.

**Alternatives considered**:
- Container/Presenter pattern where feature components call use cases directly: **Rejected** - violates C-002 and would couple UI to repository injection.
- Hooks-based approach (`useQuantitySelector`): **Rejected** - not mentioned in spec, adds unnecessary abstraction for simple callback delegation.

### Decision: StockConflictModal inline product card
**Rationale**: The spec explicitly states "Product card component for StockConflictModal - if not already present, a minimal inline version may be created within the modal." No product card exists in `entities/product/ui/`. A minimal inline card will be created inside StockConflictModal to display product name, old quantity, arrow, and new quantity.

**Alternatives considered**:
- Create a reusable `ProductCard` in `entities/product/ui/`: **Rejected** - out of scope per spec. YAGNI until another feature needs it.

### Decision: CouponInput validation error messages come from use case
**Rationale**: The `ApplyCoupon` use case already returns specific error messages: "Please enter a valid code" for empty input, "Sorry, but this coupon doesn't exist" for invalid codes. The component should pass these through rather than hardcoding duplicates.

**Alternatives considered**:
- Hardcode messages in component: **Rejected** - duplicates use case logic and makes i18n harder.

### Decision: QuantitySelector is a thin wrapper around CartControl
**Rationale**: `CartControl` in `shared/ui/` already implements the quantity UI with min/max disabling and aria-live region. `QuantitySelector` in the features layer adds domain awareness (stock-based max) and delegates quantity changes via callback. This respects FSD layer boundaries: `shared/ui/` is generic, `features/` adds domain semantics.

**Alternatives considered**:
- Extend CartControl with stock-aware logic: **Rejected** - CartControl is a generic base component; stock awareness is domain logic that belongs in the features layer.
- Duplicate CartControl implementation: **Rejected** - violates C-001 (reuse base components).

### Decision: Story titles follow existing `features/<slice>/<Component>` pattern
**Rationale**: Existing entity stories use `entities/<slice>/<Component>` (e.g., `entities/cart/CartRow`). Feature stories should follow `features/<slice>/<Component>` for consistency.

## Gaps Identified

1. **CouponInput discount display**: The spec (FR-017) says success state shows "applied coupon as a dismissible tag with discount amount." The existing `Tag` component accepts `children: React.ReactNode` so it can display text like "SAVE20 - $5.00 off." The discount amount must be passed as a prop to CouponInput since the use case returns `discountAmountCents` in the `CouponApplied` event.

2. **CheckoutButton disabled state**: The parent must compute disabled state based on `cart.items.size === 0 || cart.state !== 'Active'`. The component receives `disabled: boolean` as a prop.

3. **StockConflictModal empty-cart variant**: The spec (FR-024) describes a single-product variant where `availableQuantity === 0` that shows a different message and button. This requires the modal to detect when all conflicts have `availableQuantity === 0` (or when there's exactly one conflict with `availableQuantity === 0`).

## No Outstanding Clarifications

All questions from the planning interrogation have been answered:
- Component organization: co-located in respective feature slices
- Architecture pattern: pure presentational with props/callbacks
- Base component reuse: confirmed all required base components exist
