---
work_package_id: WP01
title: Cart Store Reactive Foundation
dependencies: []
requirement_refs:
- FR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-007-reactive-zustand-cart-repository
base_commit: 20c19abd624a78b7e30b058600b63e94a5b37819
created_at: '2026-04-10T14:02:33.345919+00:00'
subtasks:
- T001
- T002
- T003
- T004
shell_pid: '11961'
history:
- timestamp: '2026-04-10T13:57:04Z'
  action: planned
  note: WP generated during /spec-kitty.tasks
authoritative_surface: src/entities/cart/api/
execution_mode: code_change
owned_files:
- src/entities/cart/api/cart-store.ts
- src/entities/cart/api/cart-store.test.ts
tags: []
---

# WP01 - Cart Store Reactive Foundation

## Objective
Establish a Zustand-backed cart store that can hold a valid cart aggregate, replace persisted cart state safely, and expose selector/hook-style reactive reads for repository consumers.

## Context
- Mission: `007-reactive-zustand-cart-repository`
- Spec path: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/spec.md`
- Plan path: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/plan.md`
- This WP owns foundational store behavior used by repository implementation in WP02.

## Branch Strategy
- Planning branch: `main`
- Final merge target: `main`
- Execution occurs in lane-specific worktrees computed after finalization (`lanes.json`).
- Implement with: `spec-kitty agent action implement WP01 --agent <name>`

## Included Subtasks
- `T001` Define Zustand cart store state contract and initializer.
- `T002` Implement store actions for replacing persisted cart state.
- `T003` Add selector/hook-style reactive access helpers for cart consumers.
- `T004` Add store-level behavior tests for initialization and update propagation.

## Detailed Guidance

### T001 - Define store state and initializer
- Create `src/entities/cart/api/cart-store.ts` with explicit state type containing cart aggregate and optional update marker.
- Ensure initializer provides a valid initial cart representation aligned to existing cart domain invariants.
- Keep state definition stable and minimal; avoid embedding repository logic in the store module.

### T002 - Implement replacement action
- Add an action that replaces current cart state from a passed cart aggregate.
- Keep update semantics atomic so observers never receive partially updated cart state.
- Ensure the action is the only write path in this WP; avoid ad hoc mutation helpers.

### T003 - Expose selector/hook reactive helpers
- Provide selector/hook-friendly API for reading current cart state reactively.
- Preserve encapsulation: expose read utilities, not raw mutable internals.
- Align naming with cart slice conventions for public API reuse in WP02.

### T004 - Add store behavior tests
- Add `src/entities/cart/api/cart-store.test.ts`.
- Cover initialization state validity, single replacement update, and consecutive replacement determinism.
- Add assertion that selector/hook output reflects replaced cart value after update.

## Implementation Sequence
1. Define state types and initializer.
2. Add replacement action and wiring.
3. Add reactive selector/hook helper.
4. Add and run focused store tests.

## Validation
- [ ] Store initializes with valid cart value.
- [ ] Replacement action updates cart atomically.
- [ ] Reactive read helper reflects updated cart after replacement.
- [ ] Store tests pass for initialization and update propagation.

## Risks and Mitigations
- Risk: Store shape diverges from cart aggregate expectations.
  - Mitigation: Use explicit cart-typed state and tests based on valid cart fixtures.
- Risk: Reactive helper leaks mutable internals.
  - Mitigation: Expose selectors only and avoid direct mutation APIs.

## Reviewer Guidance
- Confirm owned-file boundary is respected.
- Confirm no imports violate FSD layer/slice rules.
- Confirm tests validate observable updates, not just static snapshots.

## Definition of Done
- All subtasks T001-T004 completed.
- `src/entities/cart/api/cart-store.ts` and tests are present and passing.
- Behavior supports repository integration in WP02.
