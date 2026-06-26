---
work_package_id: WP03
title: OrderSummary widget
dependencies:
- WP01
requirement_refs:
- FR-005
- FR-006
- FR-007
- FR-008
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T006
- T007
- T008
history: []
authoritative_surface: src/widgets/cart/order-summary/
create_intent:
  - src/widgets/cart/order-summary/**
execution_mode: code_change
owned_files:
- src/widgets/cart/order-summary/**
tags: []
---

# WP03 — OrderSummary widget

## Objective

Implement the `OrderSummary` widget that displays subtotal, discount, shipping, and total line items and embeds the coupon input and checkout action without computing any monetary values internally.

## Context

- This WP depends on WP01 for shared prop types.
- Lower-level components already exist:
  - `CouponInput` from `src/features/apply-coupon`.
  - `CheckoutButton` from `src/features/checkout`.
- The widget must remain purely presentational (C-003). All amounts are props.

## Subtasks

### T006 — Implement `OrderSummary` component

**Purpose**: Build the core `OrderSummary` React component.

**Steps**:

1. Create `src/widgets/cart/order-summary/order-summary.tsx`.
2. Import `CouponInput` from `@/features/apply-coupon` and `CheckoutButton` from `@/features/checkout`.
3. Import `OrderSummaryProps` from `@/widgets/cart/model/types`.
4. Implement the component:
   - Render a card-like container using Tailwind and shared layout primitives.
   - Render `Subtotal`, optional `Discount`, optional `Shipping`, and `Total` as distinct rows.
   - Render `CouponInput` with `appliedCoupon`, `couponError`, `isCouponLoading`, `onApplyCoupon`, and `onRemoveCoupon`.
   - Render `CheckoutButton` with `onCheckout` and `isCheckoutDisabled`.
   - Do not compute `total` from `subtotal`, `discount`, or `shipping`.
5. Use presentational props for labels (e.g., "Subtotal", "Discount", "Shipping", "Total") so they are easy to localize later.
6. Create `src/widgets/cart/order-summary/index.ts` exporting `OrderSummary` and `OrderSummaryProps`.

**Files to create**:

- `src/widgets/cart/order-summary/order-summary.tsx`
- `src/widgets/cart/order-summary/index.ts`

**Validation**:

- [ ] Component renders without TypeScript errors.
- [ ] All four line items render when provided.
- [ ] `Discount` and `Shipping` rows are omitted when props are undefined.
- [ ] `CouponInput` receives all its props correctly.

### T007 — Add `OrderSummary` Storybook stories

**Purpose**: Provide visual regression coverage for all `OrderSummary` states.

**Steps**:

1. Create `src/widgets/cart/order-summary/order-summary.stories.tsx`.
2. Write a default story with subtotal, shipping, and total but no discount.
3. Write a `WithDiscount` story showing subtotal, discount, shipping, total, and an applied coupon.
4. Write a `DisabledCheckout` story with the checkout button disabled.
5. Write a `CouponError` story showing an error message in the coupon input.
6. Use mock callback handlers for all interactions.

**Files to create**:

- `src/widgets/cart/order-summary/order-summary.stories.tsx`

**Validation**:

- [ ] `npm run storybook` shows all stories without errors.
- [ ] Each story renders correctly at viewport widths 375px, 768px, and 1440px.

### T008 — Add `OrderSummary` Vitest Browser Mode tests

**Purpose**: Verify coupon apply/remove and checkout interactions.

**Steps**:

1. Create `src/widgets/cart/order-summary/order-summary.test.tsx`.
2. Write a test that enters a coupon code and submits it, asserting `onApplyCoupon` is called with the entered code.
3. Write a test that removes an applied coupon, asserting `onRemoveCoupon` is called.
4. Write a test that clicks the checkout button, asserting `onCheckout` is called.
5. Account for `CouponInput`'s multi-state UI: initial button, input form, and applied-coupon tag.

**Files to create**:

- `src/widgets/cart/order-summary/order-summary.test.tsx`

**Validation**:

- [ ] `npm run test:browser` passes for the new test file.
- [ ] Tests cover coupon apply, coupon remove, and checkout trigger.

## Definition of Done

- `OrderSummary` component, stories, and browser tests exist and pass.
- The widget does not compute any monetary values internally.
- `npm run lint`, `npm run lint:arch`, and `npm run build` pass for files owned by this WP.
- No widget imports from `pages` or other `widgets`.

## Risks

- `CouponInput` manages its own internal visibility state. Browser tests must interact with the correct phase (button, form, or tag).
- A future localization requirement may change label strings; keep labels as props or constants, not hardcoded inline.

## Reviewer Guidance

- Confirm `OrderSummary` only imports from `features/apply-coupon`, `features/checkout`, `@/widgets/cart/model/types`, and `shared/ui`.
- Verify the component does not derive `total` from other props.
- Check that line items render conditionally based on prop presence.

## Activity Log

- 2026-06-25T15:46:58Z – user – Start WP03 implementation
- 2026-06-25T15:50:14Z – user – Ready for review: OrderSummary widget, stories, and browser tests pass
- 2026-06-25T15:50:37Z – user – Review passed: OrderSummary is presentational, composes CouponInput/CheckoutButton, conditionally renders money rows, stories and browser tests pass
