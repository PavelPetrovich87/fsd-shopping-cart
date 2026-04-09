---
work_package_id: WP03
title: Integration & Polish
dependencies:
- WP01
- WP02
requirement_refs:
- FR-005
- NFR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-09T12:09:29Z'
subtasks:
- T010
- T011
history:
- date: '2026-04-09T12:09:29Z'
  action: created
  note: Export updates and project quality gates
authoritative_surface: src/shared/lib/
execution_mode: code_change
owned_files:
- src/shared/lib/index.ts
---

# WP03: Integration & Polish

## Objective

Update `src/shared/lib/index.ts` exports and verify all project quality gates pass.

## Context

**Dependencies**: Requires WP01 (EventBus) and WP02 (tests) to be complete.

**Goal**: Ensure EventBus is properly exported and all project commands succeed.

## Implementation

### Subtask T010: Update Shared Lib Exports

**Purpose**: Make EventBus available via the shared lib public API.

**Steps**:
1. Read `src/shared/lib/index.ts` to understand existing structure
2. Add re-export for `EventBus`:
   ```typescript
   export { EventBus } from './event-bus';
   ```
3. Add re-export for `DomainEvent` type:
   ```typescript
   export type { DomainEvent } from './event-bus';
   ```
4. Preserve existing exports (do not remove them)

**Files**:
- `src/shared/lib/index.ts` (modify, ~5 lines added)

**Validation**:
- [ ] EventBus is exported
- [ ] DomainEvent type is exported
- [ ] No breaking changes to existing exports

---

### Subtask T011: Run Project Quality Gates

**Purpose**: Verify TypeScript compiles, linting passes, and tests run.

**Steps**:
1. Run `npm run lint`:
   - Fix any ESLint errors in modified files
   - No warnings allowed (warnings are errors in this project)

2. Run `npm run lint:arch`:
   - Fix any architecture violations
   - Verify FSD layer rules pass

3. Run `npm run build`:
   - `tsc -b` should succeed
   - `vite build` should succeed

4. Run tests:
   - `vitest` should pass all tests

**Files**:
- None (verification only)

**Validation**:
- [ ] `npm run lint` exits with code 0
- [ ] `npm run lint:arch` exits with code 0
- [ ] `npm run build` exits with code 0
- [ ] All vitest tests pass

---

## Definition of Done

- [ ] `EventBus` and `DomainEvent` exported from `@/shared/lib`
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` succeeds
- [ ] All tests pass

## Files Modified

| File | Action |
|------|--------|
| `src/shared/lib/index.ts` | Modify (add exports) |

## Reviewer Guidance

- Verify index.ts has both `export { EventBus }` and `export type { DomainEvent }`
- Verify all three project commands exit with code 0

## Next Step

This is the final WP. After completion, the feature is done.
