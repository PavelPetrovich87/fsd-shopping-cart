# Quickstart: 025-feature-ui-cart-coupon-checkout

## Running Component Stories

```bash
# Start Storybook dev server
npm run storybook

# Or with npx
npx storybook dev -p 6006
```

Stories will be available at `http://localhost:6006` under:
- `features/cart-actions/QuantitySelector`
- `features/cart-actions/RemoveButton`
- `features/apply-coupon/CouponInput`
- `features/checkout/CheckoutButton`
- `features/checkout/StockConflictModal`

## Running Tests

```bash
# Run all checks (lint + arch + build)
npm run lint
npm run lint:arch
npm run build

# Run Vitest Browser Mode for story-based tests
npx vitest --project=storybook
```

## Component Development Workflow

1. **Create component file** in the appropriate feature slice `ui/` directory:
   - `src/features/cart-actions/ui/quantity-selector/`
   - `src/features/cart-actions/ui/remove-button/`
   - `src/features/apply-coupon/ui/coupon-input/`
   - `src/features/checkout/ui/checkout-button/`
   - `src/features/checkout/ui/stock-conflict-modal/`

2. **Follow the existing pattern**:
   - `component.tsx` - implementation
   - `component.stories.tsx` - Storybook stories
   - `index.ts` - public API exports

3. **Import rules** (per FSD architecture):
   - Import base components from `@/shared/ui`
   - Import entity types from `@/entities/<slice>`
   - Never import from `features/` or `widgets/` or `pages/`

4. **Export from feature index.ts**:
   ```typescript
   // src/features/cart-actions/index.ts
   export { QuantitySelector } from './ui/quantity-selector'
   export type { QuantitySelectorProps } from './ui/quantity-selector'
   export { RemoveButton } from './ui/remove-button'
   export type { RemoveButtonProps } from './ui/remove-button'
   ```

## Story Requirements

Each component must have stories covering:

| Component | Required Stories |
|---|---|
| QuantitySelector | Default, AtMinimum, AtMaximum, Disabled |
| RemoveButton | Default, ModalOpen |
| CouponInput | Idle (button), InputVisible, EmptyError, InvalidError, Success (tag) |
| CheckoutButton | Default, Disabled |
| StockConflictModal | MultiProductConflict, SingleProductEmptyCart |

## Accessibility Checklist

Before marking a component complete, verify:
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Modal dialogs have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Icon-only buttons have `aria-label`
- [ ] Quantity changes are announced via `aria-live="polite"` (inherited from CartControl)
- [ ] Error states include both text and icon (not just color)
- [ ] Focus management works correctly for modals (trap + restore)

## Base Component Reference

| Base Component | Import Path | Used By |
|---|---|---|
| Button | `@/shared/ui` | RemoveButton, CheckoutButton, CouponInput |
| CartControl | `@/shared/ui` | QuantitySelector |
| InputField | `@/shared/ui` | CouponInput |
| Tag | `@/shared/ui` | CouponInput |
| Modal | `@/shared/ui` | RemoveButton, StockConflictModal |
