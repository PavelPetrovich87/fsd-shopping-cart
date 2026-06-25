---
work_package_id: WP01
title: Foundation and shared types
dependencies: []
requirement_refs:
- NFR-001
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
history: []
authoritative_surface: src/widgets/cart/
create_intent:
  - src/widgets/cart/model/types.ts
  - src/widgets/cart/cart-list/
  - src/widgets/cart/order-summary/
execution_mode: code_change
owned_files:
- src/widgets/cart/model/types.ts
- src/widgets/cart/cart-list/
- src/widgets/cart/order-summary/
tags: []
---

# WP01 — Foundation and shared types

## Objective

Create the `widgets/cart` slice directory and shared prop types so that WP02 and WP03 can implement `CartList` and `OrderSummary` in parallel without type conflicts.

## Context

- Feature specification: `kitty-specs/cart-and-order-summary-widgets-01KVZK46/spec.md`
- Implementation plan: `kitty-specs/cart-and-order-summary-widgets-01KVZK46/plan.md`
- Data model: `kitty-specs/cart-and-order-summary-widgets-01KVZK46/data-model.md`
- Contracts: `kitty-specs/cart-and-order-summary-widgets-01KVZK46/contracts/`
- Lower-level components already exist:
  - `src/entities/cart/ui/cart-row/cart-row.tsx`
  - `src/entities/cart/ui/empty-state/empty-state.tsx`
  - `src/features/apply-coupon/ui/coupon-input/coupon-input.tsx`
  - `src/features/checkout/ui/checkout-button/checkout-button.tsx`

## Subtasks

### T001 — Create `src/widgets/cart/model/types.ts` with shared widget prop types

**Purpose**: Define a single source of truth for the props consumed by both widgets.

**Steps**:

1. Create `src/widgets/cart/model/types.ts`.
2. Define `CartListItem` matching the fields required by `CartRow`:
   - `skuId: string`
   - `name: string`
   - `description: string`
   - `imageUrl: string`
   - `specs?: Record<string, string>`
   - `price: string`
   - `quantity: number`
   - `minQuantity?: number`
   - `maxQuantity?: number`
3. Define `CartListProps`:
   - `items: CartListItem[]`
   - `emptyStateTitle?: string`
   - `emptyStateDescription?: string`
   - `emptyStateActionLabel?: string`
   - `onEmptyStateAction?: () => void`
   - `onIncrement: (skuId: string) => void`
   - `onDecrement: (skuId: string) => void`
   - `onRemove: (skuId: string) => void`
   - `disabled?: boolean`
4. Define `AppliedCoupon`:
   - `code: string`
   - `discountLabel: string`
5. Define `OrderSummaryProps`:
   - `subtotal: string`
   - `discount?: string`
   - `shipping?: string`
   - `total: string`
   - `appliedCoupon?: AppliedCoupon`
   - `couponError?: string`
   - `isCouponLoading?: boolean`
   - `onApplyCoupon: (code: string) => void`
   - `onRemoveCoupon: () => void`
   - `onCheckout: () => void`
   - `isCheckoutDisabled?: boolean`
6. Verify field names match the actual `CartRowProps` and `CouponInputProps` exports to avoid mismatches during implementation.

**Files to create**:

- `src/widgets/cart/model/types.ts`

**Validation**:

- [ ] TypeScript compiles without errors in `src/widgets/cart/model/types.ts`.
- [ ] All exported types are used by at least one of the widget components after WP02/WP03.

### T002 — Create directory structure for `cart-list` and `order-summary` segments

**Purpose**: Establish the physical layout of the new `widgets/cart` slice.

**Steps**:

1. Create `src/widgets/cart/cart-list/` directory.
2. Create `src/widgets/cart/order-summary/` directory.
3. Create `src/widgets/cart/model/` directory (parent of `types.ts`).
4. Do not create component files yet; leave directories empty for WP02 and WP03.

**Files/directories to create**:

- `src/widgets/cart/cart-list/`
- `src/widgets/cart/order-summary/`
- `src/widgets/cart/model/`

**Validation**:

- [ ] Directory tree matches the structure documented in `plan.md`.
- [ ] No source files are added beyond `types.ts`.

## Definition of Done

- `src/widgets/cart/model/types.ts` exists and exports all required prop types.
- `src/widgets/cart/cart-list/`, `src/widgets/cart/order-summary/`, and `src/widgets/cart/model/` exist.
- `npm run lint:arch` passes for the new directories.
- No implementation code is added in this WP.

## Risks

- Field naming drift between `CartListItem` and `CartRowProps` (e.g., `imageUrl` casing). Compare with the actual `CartRow` source before finalizing types.
- `OrderSummaryProps` must not include derived monetary fields beyond what the parent passes.

## Reviewer Guidance

- Verify that types are derived from `data-model.md` and `contracts/` exactly.
- Confirm no cross-slice imports are introduced in `types.ts` (it should only reference standard TypeScript types).
- Check that directory layout follows the FSD widgets layer convention.
