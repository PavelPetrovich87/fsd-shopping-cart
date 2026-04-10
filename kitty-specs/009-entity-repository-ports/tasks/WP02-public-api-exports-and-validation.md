---
work_package_id: WP02
title: Public API Exports and Validation
dependencies:
- WP01
requirement_refs:
- FR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T005
- T006
- T007
- T008
agent: "kilo:minimax:implementer:reviewer"
shell_pid: "11913"
history:
- timestamp: '2026-04-10T13:57:20Z'
  action: planned
  by: kilo
authoritative_surface: src/entities/
execution_mode: code_change
owned_files:
- src/entities/cart/index.ts
- src/entities/product/index.ts
- src/entities/coupon/index.ts
tags: []
---

# WP02 - Public API Exports and Validation

## Objective

Expose all newly defined repository ports through entity slice public APIs and complete project quality gate validation so the mission is implementation-ready and architecture-compliant.

## Context

- Mission: `009-entity-repository-ports`
- Planning branch: `main`
- Merge target: `main`
- This package covers FR-004 and validates overall mission compliance against NFR-001/NFR-002/NFR-003.
- WP02 depends on WP01 because export updates require finalized port definitions.

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Execution worktrees are allocated later per computed lane in `lanes.json`.
- Implementation command: `spec-kitty agent action implement WP02 --agent <name>`

## Subtask Guidance

### T005 - Export cart port types from `src/entities/cart/index.ts` public API

Purpose:
- Make cart repository contracts available to other slices through the canonical entrypoint.

Implementation details:
- Update `src/entities/cart/index.ts`.
- Re-export `ICartRepository` (and any directly related cart port types if present).
- Preserve existing export ordering/style conventions used in the file.
- Avoid exporting internal-only model helpers not intended for cross-slice usage.

Validation checklist:
- `@/entities/cart` exposes cart port contract type(s).
- Existing exports remain intact.
- No new deep-import requirement is introduced.

### T006 - Export product port types from `src/entities/product/index.ts` public API

Purpose:
- Publish stock repository contract for consumer use cases and adapters.

Implementation details:
- Update `src/entities/product/index.ts`.
- Re-export `IStockRepository` (and related public port types if applicable).
- Maintain file consistency with existing product slice API style.

Validation checklist:
- `@/entities/product` exposes stock port contract type(s).
- Existing public API surface remains stable.

### T007 - Export coupon port types from `src/entities/coupon/index.ts` public API

Purpose:
- Publish coupon repository contract with nullable lookup semantics through the slice entrypoint.

Implementation details:
- Update `src/entities/coupon/index.ts`.
- Re-export `ICouponRepository` and preserve existing API conventions.
- Ensure nullability semantics remain encoded in exported type signatures.

Validation checklist:
- `@/entities/coupon` exposes coupon port contract type(s).
- No accidental export of non-public internals.

### T008 - Run `npm run lint`, `npm run lint:arch`, and `npm run build` to validate mission scope

Purpose:
- Confirm code quality, architecture boundaries, and type/build integrity for the full mission surface.

Implementation details:
- Run commands in required sequence from repository root:
  1. `npm run lint`
  2. `npm run lint:arch`
  3. `npm run build`
- Resolve any failures introduced by WP01/WP02 contract and export changes.
- Ensure final state has zero warnings/errors (warnings are treated as failures in this repository).

Validation checklist:
- All three commands exit with code 0.
- No FSD boundary violations introduced.
- Type checks pass with strict contract signatures.

## Integration Notes

- This WP must not edit `ports.ts` definitions; signature fixes belong in WP01 ownership.
- Keep changes constrained to slice public entrypoints plus command execution for validation.

## Risks

- Export path mistakes can silently break downstream imports.
- Architecture linter may reject public API changes if imports are not aligned with FSD rules.

## Reviewer Guidance

- Confirm changes are limited to listed `owned_files`.
- Confirm each entity slice exports its repository contract from `index.ts`.
- Confirm quality gate command outputs demonstrate clean completion.

## Definition of Done

- All three slice entrypoints export their respective repository port contracts.
- Cross-slice consumption is possible through public API imports only.
- `npm run lint`, `npm run lint:arch`, and `npm run build` all pass.

## Activity Log

- 2026-04-10T14:25:12Z – kilo:minimax:implementer:implementer – shell_pid=11913 – Started implementation via action command
- 2026-04-10T14:27:06Z – kilo:minimax:implementer:implementer – shell_pid=11913 – Ready for review: public API exports complete, all quality gates pass
- 2026-04-10T14:27:17Z – kilo:minimax:implementer:reviewer – shell_pid=11913 – Started review via action command
