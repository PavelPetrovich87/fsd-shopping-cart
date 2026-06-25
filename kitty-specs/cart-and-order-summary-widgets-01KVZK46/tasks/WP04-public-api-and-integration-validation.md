---
work_package_id: WP04
title: Public API and integration validation
dependencies:
- WP02
- WP03
requirement_refs:
- NFR-001
- NFR-002
- NFR-003
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T009
- T010
- T011
history: []
authoritative_surface: src/widgets/cart/
create_intent:
  - src/widgets/cart/index.ts
  - src/widgets/cart/cart-page.stories.tsx
execution_mode: code_change
owned_files:
- src/widgets/cart/index.ts
- src/widgets/cart/cart-page.stories.tsx
tags: []
---

# WP04 — Public API and integration validation

## Objective

Publish the `CartList` and `OrderSummary` widgets through a single public API, demonstrate their page-level composition, and run all project quality gates.

## Context

- This WP depends on WP02 and WP03.
- It owns the main `src/widgets/cart/index.ts` barrel file so that WP02 and WP03 do not overlap on this file.
- The page-level responsive layout (side-by-side desktop, stacked mobile) is owned by the consuming page. This WP demonstrates the layout in Storybook only.

## Subtasks

### T009 — Create `src/widgets/cart/index.ts` public API

**Purpose**: Expose both widgets from a single import path.

**Steps**:

1. Create `src/widgets/cart/index.ts`.
2. Re-export `CartList` and `CartListProps` from `@/widgets/cart/cart-list`.
3. Re-export `OrderSummary` and `OrderSummaryProps` from `@/widgets/cart/order-summary`.
4. Re-export `CartListItem`, `AppliedCoupon` from `@/widgets/cart/model/types` if useful for consumers.

**Files to create**:

- `src/widgets/cart/index.ts`

**Validation**:

- [ ] `import { CartList, OrderSummary } from '@/widgets/cart'` resolves correctly.
- [ ] TypeScript compiles without errors.

### T010 — Add combined layout story for cart page composition

**Purpose**: Validate that both widgets compose cleanly in the intended page layout.

**Steps**:

1. Create `src/widgets/cart/cart-page.stories.tsx` (or similar filename).
2. Write a story that renders `CartList` and `OrderSummary` together.
3. Use a Tailwind grid that is side-by-side on desktop (`lg:grid-cols-3`) and stacked on mobile, with `OrderSummary` above `CartList` on narrow viewports.
4. Provide mock state and callbacks so the story is interactive.
5. Add viewports for 375px, 768px, and 1440px.

**Files to create**:

- `src/widgets/cart/cart-page.stories.tsx`

**Validation**:

- [ ] Story renders without errors.
- [ ] Layout matches the design reference: side-by-side on 1440px, stacked on 768px/375px.

### T011 — Run lint, lint:arch, build and fix issues

**Purpose**: Ensure all quality gates pass before handoff.

**Steps**:

1. Run `npm run lint` and fix any errors.
2. Run `npm run lint:arch` and fix any FSD architecture violations.
3. Run `npm run build` and fix any TypeScript or Vite build errors.
4. If new custom Tailwind classes were added, verify they exist in `dist/assets/index-*.css`.
5. Run `npm run build-storybook` to confirm stories build.

**Validation**:

- [ ] `npm run lint` exits with code 0.
- [ ] `npm run lint:arch` exits with code 0.
- [ ] `npm run build` exits with code 0.
- [ ] `npm run build-storybook` exits with code 0.

## Definition of Done

- `src/widgets/cart/index.ts` exports both widgets and their prop types.
- A combined layout story demonstrates the intended page composition.
- All quality gates pass.
- No FSD layer violations are introduced.

## Risks

- Combined story must not import from `pages` or other `widgets`; it can only compose the two widgets within the same slice.
- Quality gates may reveal import-rule violations if a widget accidentally imports from a forbidden layer.

## Reviewer Guidance

- Verify the public API exports only what is documented in `plan.md`.
- Confirm the combined story matches the Penpot design reference viewports.
- Check that all quality gate commands pass with zero errors.
