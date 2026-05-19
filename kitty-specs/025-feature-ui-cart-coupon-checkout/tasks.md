# Tasks: 025-feature-ui-cart-coupon-checkout

**Generated**: 2026-05-19T11:59:19Z
**Feature**: UI Components for Cart, Coupon, and Checkout
**Mission**: 025-feature-ui-cart-coupon-checkout

---

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Create QuantitySelector component | WP01 | [P] | [D] |
| T002 | Create QuantitySelector stories | WP01 | [D] |
| T003 | Create RemoveButton component | WP01 | [D] |
| T004 | Create RemoveButton stories | WP01 | [D] |
| T005 | Update cart-actions index.ts exports | WP01 | — | [D] |
| T006 | Quality gates: lint, lint:arch, build | WP01 | — | [D] |
| T007 | Create CouponInput component | WP02 | [P] |
| T008 | Create CouponInput stories | WP02 | [P] |
| T009 | Update apply-coupon index.ts exports | WP02 | — |
| T010 | Quality gates: lint, lint:arch, build | WP02 | — |
| T011 | Create CheckoutButton component | WP03 | [P] |
| T012 | Create CheckoutButton stories | WP03 | [P] |
| T013 | Create StockConflictModal component | WP03 | [P] |
| T014 | Create StockConflictModal stories | WP03 | [P] |
| T015 | Update checkout index.ts exports | WP03 | — |
| T016 | Quality gates: lint, lint:arch, build | WP03 | — |

---

## Work Package 1: Cart Actions UI Components

**Goal**: Implement QuantitySelector and RemoveButton components in the `cart-actions` feature slice.

**Priority**: Must

**Prompt file**: [tasks/WP01-cart-actions-ui.md](tasks/WP01-cart-actions-ui.md)

**Estimated size**: ~420 lines

**Dependencies**: None

**Included subtasks**:
- [x] T001 Create QuantitySelector component (WP01)
- [x] T002 Create QuantitySelector stories (WP01)
- [x] T003 Create RemoveButton component (WP01)
- [x] T004 Create RemoveButton stories (WP01)
- [x] T005 Update cart-actions index.ts exports (WP01)
- [x] T006 Quality gates: lint, lint:arch, build (WP01)

**Implementation sketch**:
1. Create `src/features/cart-actions/ui/quantity-selector/` with component and index.ts
2. Create `src/features/cart-actions/ui/quantity-selector/quantity-selector.stories.tsx`
3. Create `src/features/cart-actions/ui/remove-button/` with component and index.ts
4. Create `src/features/cart-actions/ui/remove-button/remove-button.stories.tsx`
5. Update `src/features/cart-actions/index.ts` to re-export UI components
6. Run lint, lint:arch, build; fix any errors

**Parallel opportunities**:
- T001–T004 can be developed in any order (different files)
- WP01 can run in parallel with WP02 and WP03

**Risks**:
- CartControl interface mismatch — verify min/max/disabled props before implementing
- Modal component may need custom footer layout for confirmation dialog

---

## Work Package 2: Apply Coupon UI Component

**Goal**: Implement CouponInput component in the `apply-coupon` feature slice.

**Priority**: Must

**Prompt file**: [tasks/WP02-apply-coupon-ui.md](tasks/WP02-apply-coupon-ui.md)

**Estimated size**: ~380 lines

**Dependencies**: None

**Included subtasks**:
- [ ] T007 Create CouponInput component (WP02)
- [ ] T008 Create CouponInput stories (WP02)
- [ ] T009 Update apply-coupon index.ts exports (WP02)
- [ ] T010 Quality gates: lint, lint:arch, build (WP02)

**Implementation sketch**:
1. Create `src/features/apply-coupon/ui/coupon-input/` with component and index.ts
2. Manage internal state: button-visible → input-visible → loading → error/success → tag-visible
3. Wire Button, InputField, Tag base components; no CSS animations per C-004
4. Create stories for all state variants
5. Update `src/features/apply-coupon/index.ts` to re-export UI component
6. Run lint, lint:arch, build; fix any errors

**Parallel opportunities**:
- WP02 can run in parallel with WP01 and WP03

**Risks**:
- State machine has 6+ states; must be clear and testable via stories
- Error messages must match spec exactly (FR-015, FR-016)

---

## Work Package 3: Checkout UI Components

**Goal**: Implement CheckoutButton and StockConflictModal components in the `checkout` feature slice.

**Priority**: Must

**Prompt file**: [tasks/WP03-checkout-ui.md](tasks/WP03-checkout-ui.md)

**Estimated size**: ~450 lines

**Dependencies**: None

**Included subtasks**:
- [ ] T011 Create CheckoutButton component (WP03)
- [ ] T012 Create CheckoutButton stories (WP03)
- [ ] T013 Create StockConflictModal component (WP03)
- [ ] T014 Create StockConflictModal stories (WP03)
- [ ] T015 Update checkout index.ts exports (WP03)
- [ ] T016 Quality gates: lint, lint:arch, build (WP03)

**Implementation sketch**:
1. Create `src/features/checkout/ui/checkout-button/` with component and index.ts
2. Create `src/features/checkout/ui/checkout-button/checkout-button.stories.tsx`
3. Create `src/features/checkout/ui/stock-conflict-modal/` with component and index.ts
4. Implement multi-product and single-product-empty-cart variants
5. Create `src/features/checkout/ui/stock-conflict-modal/stock-conflict-modal.stories.tsx`
6. Update `src/features/checkout/index.ts` to re-export UI components
7. Run lint, lint:arch, build; fix any errors

**Parallel opportunities**:
- WP03 can run in parallel with WP01 and WP02
- T011–T014 can be developed in any order

**Risks**:
- StockConflictModal needs product image placeholders if not already available
- Single-product empty-cart variant has a distinct layout and button label

---

## Parallelization Summary

All three work packages are **independent** and can be implemented in parallel. They share no files and depend only on the existing base component layer (`shared/ui/`) and entity types, which are already implemented.

**Recommended execution**:
- Run all three WPs concurrently across separate agents
- After all WPs are approved, a single integration check (lint + lint:arch + build) on main confirms cross-component consistency

## MVP Scope

Any single WP delivers usable UI components. WP01 (Cart Actions) is the most foundational — quantity and removal are the primary cart interactions.

## Next Command

After finalization, run:
```bash
spec-kitty next --agent <agent-name> --mission 025-feature-ui-cart-coupon-checkout
```
