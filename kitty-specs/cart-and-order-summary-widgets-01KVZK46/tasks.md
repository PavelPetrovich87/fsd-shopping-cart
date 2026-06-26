# Tasks: Cart and Order Summary Widgets

## Subtask Index

| ID | Description | WP | Parallel |
| -- | ----------- | -- | -------- |
| T001 | Create `src/widgets/cart/model/types.ts` with shared widget prop types | WP01 | [P] |
| T002 | Create directory structure for `cart-list` and `order-summary` segments | WP01 | [P] |
| T003 | Implement `CartList` component | WP02 | - |
| T004 | Add `CartList` Storybook stories | WP02 | - |
| T005 | Add `CartList` Vitest Browser Mode tests | WP02 | - |
| T006 | Implement `OrderSummary` component | WP03 | - |
| T007 | Add `OrderSummary` Storybook stories | WP03 | - |
| T008 | Add `OrderSummary` Vitest Browser Mode tests | WP03 | - |
| T009 | Create `src/widgets/cart/index.ts` public API | WP04 | - |
| T010 | Add combined layout story for cart page composition | WP04 | - |
| T011 | Run lint, lint:arch, build and fix issues | WP04 | - |

## Work Packages

### WP01 — Foundation and shared types

**Goal**: Create the `widgets/cart` slice directory and shared prop types so that WP02 and WP03 can be implemented in parallel.

**Priority**: High (blocks all other WPs)

**Included subtasks**:

- [ ] T001 Create `src/widgets/cart/model/types.ts` with shared widget prop types (WP01)
- [ ] T002 Create directory structure for `cart-list` and `order-summary` segments (WP01)

**Implementation sketch**:

1. Create `src/widgets/cart/model/types.ts`.
2. Define `CartListItem`, `CartListProps`, `AppliedCoupon`, and `OrderSummaryProps` based on `data-model.md` and `contracts/`.
3. Create empty `src/widgets/cart/cart-list/` and `src/widgets/cart/order-summary/` directories.

**Parallel opportunities**: T001 and T002 are independent within this WP.

**Dependencies**: None.

**Risks**: Type definitions must match the existing `CartRowProps` and `CouponInputProps` shapes. Reconcile field naming (e.g., `imageUrl` vs `imageURL`) against the actual `CartRow` implementation.

**Estimated prompt size**: ~250 lines.

### WP02 — CartList widget

**Goal**: Implement the `CartList` widget that renders cart rows or an empty state and forwards item-level actions to the parent.

**Priority**: High

**Included subtasks**:

- [x] T003 Implement `CartList` component (WP02)
- [x] T004 Add `CartList` Storybook stories (WP02)
- [x] T005 Add `CartList` Vitest Browser Mode tests (WP02)

**Implementation sketch**:

1. Implement `src/widgets/cart/cart-list/cart-list.tsx` using `CartRow` and `EmptyState` from `entities/cart`.
2. Map `items` to `CartRow`, forwarding `onIncrement`, `onDecrement`, and `onRemove` per `skuId`.
3. Render `EmptyState` with configurable title, description, action label, and callback when `items` is empty.
4. Add stories for populated list, empty cart, and disabled state.
5. Add browser-mode tests that interact with quantity controls and remove action.

**Parallel opportunities**: Stories and tests can be drafted in parallel after the component is stubbed.

**Dependencies**: WP01.

**Risks**: `CartRow` already contains quantity controls and a remove button; `CartList` must not duplicate them. Browser-mode tests need fixture data and may require MSW only if components fetch data.

**Estimated prompt size**: ~400 lines.

### WP03 — OrderSummary widget

**Goal**: Implement the `OrderSummary` widget that displays monetary line items and embeds coupon input and checkout action.

**Priority**: High

**Included subtasks**:

- [x] T006 Implement `OrderSummary` component (WP03)
- [x] T007 Add `OrderSummary` Storybook stories (WP03)
- [x] T008 Add `OrderSummary` Vitest Browser Mode tests (WP03)

**Implementation sketch**:

1. Implement `src/widgets/cart/order-summary/order-summary.tsx` using `CouponInput` from `features/apply-coupon` and `CheckoutButton` from `features/checkout`.
2. Render `subtotal`, optional `discount`, optional `shipping`, and `total` as distinct lines.
3. Pass coupon state and callbacks to `CouponInput` unchanged.
4. Add stories for no discount, with discount/coupon, and disabled checkout.
5. Add browser-mode tests for applying a coupon and triggering checkout.

**Parallel opportunities**: Stories and tests can be drafted in parallel after the component is stubbed.

**Dependencies**: WP01.

**Risks**: Widget must remain purely presentational (C-003); no internal computation of discount or total. Browser-mode tests for `CouponInput` must handle its multi-state UI (button -> form -> tag).

**Estimated prompt size**: ~400 lines.

### WP04 — Public API and integration validation

**Goal**: Wire both widgets into a single public API, demonstrate page-level composition, and run all quality gates.

**Priority**: Medium

**Included subtasks**:

- [x] T009 Create `src/widgets/cart/index.ts` public API (WP04)
- [x] T010 Add combined layout story for cart page composition (WP04)
- [x] T011 Run lint, lint:arch, build and fix issues (WP04)

**Implementation sketch**:

1. Create `src/widgets/cart/index.ts` re-exporting `CartList` and `OrderSummary` and their prop types.
2. Add a combined Storybook story that places `CartList` and `OrderSummary` side-by-side on desktop and stacked on mobile.
3. Run `npm run lint`, `npm run lint:arch`, and `npm run build`. Fix any issues.

**Parallel opportunities**: None within this WP; it is sequential integration work.

**Dependencies**: WP02, WP03.

**Risks**: Combined layout story must not introduce `widgets` importing from `pages` or other `widgets`. Quality gates may fail on FSD import rules if the story imports from the wrong layer.

**Estimated prompt size**: ~300 lines.

## MVP Scope

WP02 (`CartList`) is the minimal shippable unit for the populated/empty cart scenarios. WP03 (`OrderSummary`) can follow immediately. WP04 is required before merge to ensure public API and quality gates pass.
