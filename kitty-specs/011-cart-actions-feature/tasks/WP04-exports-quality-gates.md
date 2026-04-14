---
work_package_id: WP04
title: Exports & Quality Gates
dependencies:
- WP01
- WP02
- WP03
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
- FR-013
- FR-014
- FR-015
- FR-016
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch for this feature: main. Completed changes must merge into main.'
subtasks:
- T010
- T011
- T012
history:
- date: '2026-04-14T12:34:57Z'
  action: created
  note: Initial WP04 creation
authoritative_surface: src/features/cart-actions/
execution_mode: code_change
owned_files:
- src/features/cart-actions/model/index.ts
- src/features/cart-actions/index.ts
tags: []
---

# WP04: Exports & Quality Gates

## Objective

Create the public API surface (`model/index.ts` and `index.ts`) and verify all quality gates pass (lint, typecheck, tests).

## Context

**Feature:** Cart Actions Feature (T-011)
**Mission:** 011-cart-actions-feature
**Spec:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/spec.md`
**Plan:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/plan.md`

### Dependencies
- **WP01** (types), **WP02** (AddToCart), **WP03** (RemoveFromCart + ChangeCartItemQuantity) must all complete first

---

## Subtask T010: Create model/index.ts — Re-exports

**Purpose:** Create barrel file that re-exports all model-level exports.

**Steps:**

1. Create `src/features/cart-actions/model/index.ts`

2. Re-export all public items:
   ```typescript
   // Use cases
   export { AddToCart } from './add-to-cart';
   export { RemoveFromCart } from './remove-from-cart';
   export { ChangeCartItemQuantity } from './change-quantity';

   // Types
   export { CartActionsError } from './errors';
   export type {
     AddToCartResult,
     RemoveFromCartResult,
     ChangeCartItemQuantityResult
   } from './results';
   ```

**Files:**
- `src/features/cart-actions/model/index.ts` (new file)

**Validation:**
- [ ] File exists and exports all 3 use cases
- [ ] File exports `CartActionsError` type
- [ ] File exports all 3 result types
- [ ] TypeScript compiles without errors

---

## Subtask T011: Create index.ts — Public API

**Purpose:** Create the feature slice's public API entry point.

**Steps:**

1. Create `src/features/cart-actions/index.ts`

2. Re-export from model/index.ts:
   ```typescript
   // Use cases
   export { AddToCart, RemoveFromCart, ChangeCartItemQuantity } from './model';

   // Types
   export { CartActionsError } from './model';
   export type {
     AddToCartResult,
     RemoveFromCartResult,
     ChangeCartItemQuantityResult
   } from './model';
   ```

**Files:**
- `src/features/cart-actions/index.ts` (new file)

**Validation:**
- [ ] File exists and re-exports from model/index.ts
- [ ] TypeScript compiles without errors

---

## Subtask T012: Run Quality Gates

**Purpose:** Verify all quality gates pass (lint, typecheck, tests).

**Steps:**

1. **Lint Check:**
   ```bash
   npm run lint
   ```
   Expected: Exit code 0, no warnings

2. **Architecture Lint:**
   ```bash
   npm run lint:arch
   ```
   Expected: Exit code 0, FSD violations reported if any

3. **TypeScript + Build:**
   ```bash
   npm run build
   ```
   Expected: Exit code 0, tsc -b succeeds

4. **Run Tests:**
   ```bash
   npm test
   ```
   Expected: All tests pass

**Files (no new files created — validation only):**

**Validation:**
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run lint:arch` passes (no FSD violations)
- [ ] `npm run build` succeeds (type check + bundle)
- [ ] `npm test` passes (all unit tests)

---

## Final Directory Structure

After all WPs complete, the feature should look like:

```
src/features/cart-actions/
├── model/
│   ├── add-to-cart.ts
│   ├── add-to-cart.test.ts
│   ├── remove-from-cart.ts
│   ├── remove-from-cart.test.ts
│   ├── change-quantity.ts
│   ├── change-quantity.test.ts
│   ├── errors.ts
│   ├── results.ts
│   └── index.ts
└── index.ts
```

---

## Implementation Notes

### FSD Compliance Check
Ensure the feature's public API follows FSD rules:
- `features/cart-actions` imports from `entities/cart`, `entities/product`, `shared/lib` only
- No circular dependencies
- No imports from other features

### What NOT To Do
- Do NOT export internal implementation details
- Do NOT create additional files beyond what's specified
- Do NOT modify other feature slices

---

## Definition of Done

1. **T010:** `model/index.ts` re-exports all use cases and types
2. **T011:** `index.ts` re-exports from model/index.ts as public API
3. **T012:** All quality gates pass:
   - `npm run lint` — exit 0
   - `npm run lint:arch` — exit 0
   - `npm run build` — exit 0
   - `npm test` — all pass

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| FSD violations in lint:arch | Medium | Medium | Fix any layer boundary violations before committing |
| Tests fail due to missing mocks | Low | High | Ensure all mocks match expected interface shapes |

---

## Reviewer Guidance

When reviewing this WP:
- Verify model/index.ts re-exports everything needed
- Verify index.ts properly exposes public API
- Run quality gates and confirm all pass
- Check that no infrastructure imports leak through

---

## Handoff

WP04 is the final work package. Once it completes:
1. All 3 use cases are implemented and tested
2. All types are exported
3. All quality gates pass

The feature is ready for review and merge.
