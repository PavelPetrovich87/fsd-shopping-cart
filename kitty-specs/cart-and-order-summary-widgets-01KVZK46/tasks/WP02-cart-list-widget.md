---
work_package_id: WP02
title: CartList widget
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T003
- T004
- T005
history: []
authoritative_surface: src/widgets/cart/cart-list/
create_intent:
  - src/widgets/cart/cart-list/**
  - src/widgets/cart/index.ts
execution_mode: code_change
owned_files:
- src/widgets/cart/cart-list/**
- src/widgets/cart/index.ts
tags: []
---

# WP02 — CartList widget

## Objective

Implement the `CartList` widget that renders the shopper's cart as a list of item rows or an empty-state fallback, forwarding all item-level actions to the parent.

## Context

- This WP depends on WP01 for shared prop types.
- Lower-level components already exist:
  - `CartRow` from `src/entities/cart` bundles product image, name, specs, price, quantity controls, and remove action.
  - `EmptyState` from `src/entities/cart` renders the empty-cart message.
- Page-level responsive layout is owned by the consuming page, not by this widget.

## Subtasks

### T003 — Implement `CartList` component

**Purpose**: Build the core `CartList` React component.

**Steps**:

1. Create `src/widgets/cart/cart-list/cart-list.tsx`.
2. Import `CartRow` and `EmptyState` from `@/entities/cart`.
3. Import `CartListProps` from `@/widgets/cart/model/types`.
4. Implement the component:
   - If `items.length === 0`, render `EmptyState` with the configurable title, description, action label, and callback.
   - If `items.length > 0`, render a container with `CartRow` for each item.
   - Map each `CartListItem` to `CartRow` props, forwarding `onIncrement`, `onDecrement`, and `onRemove` callbacks bound to the item's `skuId`.
   - Pass the `disabled` prop down to each `CartRow`.
5. Add minimal Tailwind classes for vertical stacking and spacing. Avoid layout assumptions that would conflict with page-level grids.
6. Create `src/widgets/cart/cart-list/index.ts` exporting `CartList` and `CartListProps`.
7. Update `src/widgets/cart/index.ts` to re-export `CartList` and `CartListProps`.

**Files to create/modify**:

- `src/widgets/cart/cart-list/cart-list.tsx` (new)
- `src/widgets/cart/cart-list/index.ts` (new)
- `src/widgets/cart/index.ts` (modify)

**Validation**:

- [ ] Component renders without TypeScript errors.
- [ ] Empty state renders when `items` is empty.
- [ ] `CartRow` renders for each item when `items` is populated.
- [ ] `onIncrement`, `onDecrement`, and `onRemove` callbacks receive the correct `skuId`.

### T004 — Add `CartList` Storybook stories

**Purpose**: Provide visual regression coverage for all `CartList` states.

**Steps**:

1. Create `src/widgets/cart/cart-list/cart-list.stories.tsx`.
2. Write a default story with a populated list of at least two cart items.
3. Write an `Empty` story showing the empty state with a custom CTA label.
4. Write a `Disabled` story showing controls in a disabled state.
5. Use mock callback handlers (e.g., `action` from Storybook) for all interactions.

**Files to create**:

- `src/widgets/cart/cart-list/cart-list.stories.tsx`

**Validation**:

- [ ] `npm run storybook` shows all three stories without errors.
- [ ] Each story renders correctly at viewport widths 375px, 768px, and 1440px.

### T005 — Add `CartList` Vitest Browser Mode tests

**Purpose**: Verify key interactions in a real browser environment.

**Steps**:

1. Create `src/widgets/cart/cart-list/cart-list.test.tsx`.
2. Write a test that renders the populated `CartList` and verifies all item names are visible.
3. Write a test that clicks the increment button on an item and asserts the callback is invoked with the correct `skuId`.
4. Write a test that clicks the remove button and asserts the callback is invoked with the correct `skuId`.
5. Write a test that renders the empty state and clicks the CTA, asserting the callback is invoked.
6. Use Vitest Browser Mode (`page.getByText`, `userEvent.click`, etc.) consistent with existing shared/ui tests.

**Files to create**:

- `src/widgets/cart/cart-list/cart-list.test.tsx`

**Validation**:

- [ ] `npm run test:browser` passes for the new test file.
- [ ] Tests cover populated list, increment, remove, and empty-state CTA.

## Definition of Done

- `CartList` component, stories, and browser tests exist and pass.
- `src/widgets/cart/index.ts` exports `CartList`.
- `npm run lint`, `npm run lint:arch`, and `npm run build` pass for files owned by this WP.
- No widget imports from `pages` or other `widgets`.

## Risks

- `CartRow` already includes quantity controls and a remove button. Do not import `QuantitySelector` or `RemoveButton` separately in this widget.
- Browser-mode tests may need to target buttons inside `CartRow`. Use stable test IDs or accessible labels; avoid brittle selectors.

## Reviewer Guidance

- Confirm `CartList` only imports from `entities/cart`, `@/widgets/cart/model/types`, and `shared/ui` if needed.
- Verify callback signatures match `CartListProps`.
- Check that the empty state is reachable and the CTA is configurable.

## Activity Log

- 2026-06-25T15:39:56Z – user – Start WP02 implementation (bypassing action command due to worktree pre-commit hook conflict)
- 2026-06-25T15:46:24Z – user – Ready for review: CartList component, stories, and browser tests pass; storybook suite has pre-existing modal a11y failure unrelated to this WP
- 2026-06-25T15:46:47Z – user – Review passed: CartList widget correctly composes CartRow/EmptyState, callbacks bound to skuId, stories and browser tests pass, no FSD violations
