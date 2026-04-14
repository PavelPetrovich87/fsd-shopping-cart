---
work_package_id: WP02
title: Repository Adapter and Public API Wiring
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-003
- FR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T005
- T006
- T007
- T008
agent: "opencode"
shell_pid: "11961"
history:
- timestamp: '2026-04-10T13:57:04Z'
  action: planned
  note: WP generated during /spec-kitty.tasks
authoritative_surface: src/entities/cart/
execution_mode: code_change
owned_files:
- src/entities/cart/api/zustand-cart-repository.ts
- src/entities/cart/index.ts
tags: []
---

# WP02 - Repository Adapter and Public API Wiring

## Objective
Implement `ZustandCartRepository` so cart persistence and reactive reads are delivered through `ICartRepository`, then expose repository/store entrypoints through the cart slice public API.

## Context
- Mission: `007-reactive-zustand-cart-repository`
- Depends on WP01 store foundations.
- Keeps implementation strictly within T-009 scope (`entities/cart/api` + cart index exports).

## Branch Strategy
- Planning branch: `main`
- Final merge target: `main`
- Execution runs in lane-specific worktree resolved after finalization.
- Implement with: `spec-kitty agent action implement WP02 --agent <name>`

## Included Subtasks
- `T005` Implement `ZustandCartRepository` construction over cart store.
- `T006` Implement `getCart()` reactive read behavior through selector/hook integration.
- `T007` Implement `saveCart(cart)` persistence path with atomic store update semantics.
- `T008` Export repository and store artifacts via `src/entities/cart/index.ts` public API.

## Detailed Guidance

### T005 - Create repository adapter
- Create `src/entities/cart/api/zustand-cart-repository.ts` implementing existing `ICartRepository` contract.
- Inject or bind the store access layer from WP01 without leaking implementation details.
- Keep adapter responsibilities narrow: contract translation between repository calls and store operations.

### T006 - Implement reactive `getCart()`
- Wire repository read path to selector/hook-style API agreed during planning.
- Ensure consumers receive current cart state reactively after store updates.
- Keep return semantics consistent and deterministic across repeated calls.

### T007 - Implement `saveCart(cart)` persistence
- Route save operation through WP01 replacement action.
- Ensure a completed save makes new state visible to reactive reads immediately.
- Preserve atomic semantics and avoid partial writes or multi-step mutation paths.

### T008 - Public API exposure
- Update `src/entities/cart/index.ts` to export repository/store interfaces required by slice consumers.
- Expose only intended public surface; keep internal implementation details private.

## Implementation Sequence
1. Scaffold repository adapter type and dependencies.
2. Implement `getCart()` using reactive selector/hook path.
3. Implement `saveCart(cart)` write path.
4. Update cart slice public API exports.

## Validation
- [ ] Adapter implements all required `ICartRepository` members.
- [ ] `getCart()` reflects latest saved cart state through reactive model.
- [ ] `saveCart(cart)` writes and exposes updated state reliably.
- [ ] Public API exports compile and remain FSD-compliant.

## Risks and Mitigations
- Risk: Port signature and reactive model mismatch.
  - Mitigation: Keep adapter return/update semantics aligned to specification FR-001/FR-003.
- Risk: Public API overexposes internal helpers.
  - Mitigation: Export only stable consumer-facing symbols.

## Reviewer Guidance
- Verify no direct internal-folder imports are introduced from outside slice boundaries.
- Confirm adapter uses store contract rather than bypassing with direct mutation.
- Confirm no files outside owned list are modified.

## Definition of Done
- Subtasks T005-T008 are complete.
- `zustand-cart-repository.ts` compiles and implements repository behavior.
- Cart slice public API is updated for downstream consumption.

## Activity Log

- 2026-04-10T14:11:20Z – kilocode:minimax-m2.7:implementer:implementer – shell_pid=11961 – Started implementation via action command
- 2026-04-10T14:14:54Z – kilocode:minimax-m2.7:implementer:implementer – shell_pid=11961 – Ready for review
- 2026-04-10T14:38:40Z – opencode – shell_pid=11961 – Started review via action command
- 2026-04-10T14:39:32Z – opencode – shell_pid=11961 – Review passed: ZustandCartRepository implements ICartRepository with getCart/saveCart, public API exports all required symbols, FSD-compliant. Lint, lint:arch, and build all pass.
- 2026-04-14T11:24:51Z – opencode – shell_pid=11961 – Done override: Feature merged to main
