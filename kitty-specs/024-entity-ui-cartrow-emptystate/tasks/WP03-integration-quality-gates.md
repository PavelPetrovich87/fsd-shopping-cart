---
work_package_id: WP03
title: Integration and Quality Gates
dependencies:
- WP01
- WP02
requirement_refs:
- C-006
- C-007
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T012
- T013
- T014
- T015
- T016
phase: Phase 2 - Integration
assignee: ''
agent: "kilo:kimi-for-coding:frontend-reviewer:reviewer"
shell_pid: "5453"
history:
- timestamp: '2026-05-18T12:32:09Z'
  agent: system
  action: Prompt generated via /spec-kitty.tasks
authoritative_surface: src/entities/cart/
execution_mode: code_change
owned_files:
- src/entities/cart/index.ts
tags: []
---

# Work Package Prompt: WP03 - Integration and Quality Gates

## Objective

Export the new UI components from the `entities/cart` public API and run all project quality gates to ensure the implementation is production-ready.

## Context

- WP01 creates `src/entities/cart/ui/cart-row/` with CartRow component
- WP02 creates `src/entities/cart/ui/empty-state/` with EmptyState component
- This WP depends on both WP01 and WP02 being complete
- The `entities/cart/index.ts` file is the public API for the cart entity slice
- Quality gates: `npm run lint` (ESLint), `npm run lint:arch` (Steiger FSD linter), `npm run build` (TypeScript + Vite)

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- **Execution**: This WP will be implemented in a dedicated worktree allocated by `finalize-tasks`. Do not edit files directly in the main checkout.
- **Implementation command**: `spec-kitty agent action implement WP03 --agent <name>`

---

## Subtasks

### T012: Update entities/cart/index.ts exports

**Purpose**: Add the new UI components and their prop types to the cart entity's public API.

**Steps**:
1. Open `src/entities/cart/index.ts`
2. Add exports for CartRow:
```typescript
export { CartRow } from './ui/cart-row'
export type { CartRowProps } from './ui/cart-row'
```
3. Add exports for EmptyState:
```typescript
export { EmptyState } from './ui/empty-state'
export type { EmptyStateProps } from './ui/empty-state'
```
4. Ensure the exports are organized logically (group UI exports together)
5. Verify no duplicate exports or naming conflicts

**Important**: Do NOT modify any existing exports. Only ADD new ones.

**Files**:
- `src/entities/cart/index.ts` (modified)

**Validation**:
- [ ] CartRow is exported from `entities/cart`
- [ ] CartRowProps type is exported from `entities/cart`
- [ ] EmptyState is exported from `entities/cart`
- [ ] EmptyStateProps type is exported from `entities/cart`
- [ ] No duplicate exports
- [ ] Existing exports are unchanged

---

### T013: Run lint and fix errors

**Purpose**: Ensure all code passes ESLint checks.

**Steps**:
1. Run `npm run lint`
2. If errors are found:
   - Read the error messages carefully
   - Fix each error in the appropriate file
   - Common issues for new UI components:
     - Missing React import (if using classic JSX transform - but this project uses the new transform, so React import is not needed)
     - Unused variables or imports
     - Missing accessibility attributes
     - Incorrect hook dependencies
     - Tailwind class ordering issues
3. Re-run `npm run lint` until it passes with exit code 0

**Files that may need fixes**:
- `src/entities/cart/ui/cart-row/cart-row.tsx`
- `src/entities/cart/ui/cart-row/cart-row.stories.tsx`
- `src/entities/cart/ui/empty-state/empty-state.tsx`
- `src/entities/cart/ui/empty-state/empty-state.stories.tsx`
- `src/entities/cart/index.ts`

**Validation**:
- [ ] `npm run lint` exits with code 0
- [ ] No ESLint warnings (warnings are treated as errors per AGENTS.md)

---

### T014: Run lint:arch and fix FSD violations

**Purpose**: Ensure all code follows Feature-Sliced Design architecture rules.

**Steps**:
1. Run `npm run lint:arch`
2. If violations are found:
   - Read the violation messages
   - Common FSD violations for UI components:
     - Importing from higher layers (e.g., `entities/cart/ui` importing from `widgets/` or `pages/`)
     - Importing from unrelated slices at the same layer
     - Circular dependencies
     - Missing public API exports (files not exported from index.ts)
   - Fix each violation:
     - If a component imports from the wrong layer, refactor to use props/callbacks instead
     - If a file is not exported, add it to the appropriate index.ts
3. Re-run `npm run lint:arch` until it passes with exit code 0

**Important FSD rules for this feature**:
- `entities/cart/ui/` MUST NOT import from `features/`, `widgets/`, or `pages/`
- `entities/cart/ui/` MAY import from `shared/` (design system, utilities)
- `entities/cart/ui/` MAY import from `entities/cart/model/` (same slice)
- `entities/cart/ui/` MUST NOT import from `entities/product/` or `entities/coupon/` (different slices)

**Validation**:
- [ ] `npm run lint:arch` exits with code 0
- [ ] No FSD layer violations
- [ ] No cross-slice imports in UI components

---

### T015: Run build and fix type/build errors

**Purpose**: Ensure the project type-checks and bundles successfully.

**Steps**:
1. Run `npm run build`
2. If errors are found:
   - Read the TypeScript compiler errors
   - Common issues:
     - Missing type exports
     - Incorrect prop types
     - Missing dependencies in package.json
     - Storybook configuration issues
   - Fix each error
3. Re-run `npm run build` until it passes with exit code 0

**Validation**:
- [ ] `npm run build` exits with code 0
- [ ] No TypeScript compilation errors
- [ ] Vite bundle succeeds

---

### T016: Verify all Storybook stories render

**Purpose**: Confirm all Storybook stories for CartRow and EmptyState render without runtime errors.

**Steps**:
1. Start Storybook: `npm run storybook`
2. Navigate to each story and verify it renders:
   - `entities/cart/CartRow` -> Default
   - `entities/cart/CartRow` -> MinQuantity
   - `entities/cart/CartRow` -> MaxQuantity
   - `entities/cart/CartRow` -> Disabled
   - `entities/cart/CartRow` -> WithSpecs
   - `entities/cart/EmptyState` -> Default
   - `entities/cart/EmptyState` -> WithSecondaryAction
   - `entities/cart/EmptyState` -> CustomIcon
   - `entities/cart/EmptyState` -> LongDescription
3. Check the browser console for any runtime errors
4. Verify visual appearance matches expectations (no broken layouts, missing styles, etc.)
5. Stop Storybook when done

**Note**: If Storybook is not available or fails to start, document the issue and proceed. The lint and build gates are the critical ones.

**Validation**:
- [ ] All CartRow stories render without errors
- [ ] All EmptyState stories render without errors
- [ ] No runtime errors in browser console
- [ ] Visual appearance is correct

---

## Definition of Done

- [ ] All 5 subtasks complete
- [ ] `entities/cart/index.ts` exports both components and their prop types
- [ ] `npm run lint` passes (exit code 0)
- [ ] `npm run lint:arch` passes (exit code 0)
- [ ] `npm run build` passes (exit code 0)
- [ ] All Storybook stories render correctly

## Risks

- **Dependency on WP01/WP02**: If WP01 or WP02 has issues, this WP cannot complete. Ensure both are done before starting WP03.
- **FSD violations**: The most common issue is importing from the wrong layer. Double-check all imports in the UI components.
- **Build failures**: TypeScript strict mode may catch issues that weren't obvious during development. Be prepared to fix type errors.

## Reviewer Guidance

- Verify `entities/cart/index.ts` exports are complete and correct
- Confirm all three quality gates pass
- Check that no existing functionality was broken
- Verify Storybook stories render without errors
- Review any fixes made to WP01/WP02 files during quality gate resolution

## Coordination Notes

- This WP MUST NOT start until WP01 and WP02 are both marked as done
- If quality gate fixes require changes to WP01 or WP02 files, coordinate with the respective WP owners
- Prefer minimal fixes - do not refactor WP01/WP02 code unless necessary to pass gates

## Activity Log

- 2026-05-19T11:36:45Z – kilo:kimi-for-coding:frontend-implementer:implementer – shell_pid=5453 – Started implementation via action command
- 2026-05-19T11:38:41Z – kilo:kimi-for-coding:frontend-implementer:implementer – shell_pid=5453 – Ready for review: exports integrated, all quality gates pass (lint, lint:arch, build). Storybook test runner has pre-existing infrastructure issue with @storybook/addon-vitest setup-file import, not related to WP03 changes.
- 2026-05-19T11:39:03Z – kilo:kimi-for-coding:frontend-reviewer:reviewer – shell_pid=5453 – Started review via action command
