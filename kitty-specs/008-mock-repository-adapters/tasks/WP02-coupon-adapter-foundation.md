---
work_package_id: WP02
title: Coupon Adapter Foundation
dependencies: []
requirement_refs:
- FR-004
- FR-005
- FR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T006
- T007
- T008
- T009
- T010
agent: "kilo:minimax-m2.7:reviewer:reviewer"
shell_pid: "11920"
history:
- timestamp: '2026-04-10T13:55:23Z'
  action: planned
  by: kilo
authoritative_surface: src/entities/coupon/
execution_mode: code_change
owned_files:
- src/entities/coupon/api/mock-coupon-repository.ts
- src/entities/coupon/index.ts
- src/entities/coupon/api/mock-coupon-repository.test.ts
tags: []
---

# WP02 - Coupon Adapter Foundation

## Objective

Implement the coupon driven adapter so consumers can resolve coupons through `ICouponRepository` from static fixtures, including deterministic `null` behavior for unknown or empty codes.

## Context

- Mission: `008-mock-repository-adapters`
- Planning branch: `main`
- Merge target: `main`
- This WP covers coupon-side functional requirements: FR-004, FR-005, FR-006.
- Scope is read-only and deterministic; no writes, no fallback source, no cache.

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Implementation uses lane-based workspace allocation from `lanes.json` after task finalization.
- Use command: `spec-kitty agent action implement WP02 --agent <name>`

## Subtask Guidance

### T006 - Implement coupon repository initialization from shared fixtures

Purpose:
- Create repository class that reads coupon fixtures once and stores immutable in-memory lookup state.

Implementation details:
- Add `src/entities/coupon/api/mock-coupon-repository.ts`.
- Implement class using existing `ICouponRepository` contract.
- Load coupon fixtures from `@/shared/api` exports.
- Build internal lookup keyed by coupon code.
- Keep initialization deterministic and side-effect free beyond internal state.

Validation checklist:
- Repository initializes using shared fixture source.
- Internal state supports stable repeatable lookups.
- No mutation API is added.

### T007 - Implement `findByCode` mapping from fixture data to `Coupon`

Purpose:
- Ensure known coupon codes return domain `Coupon` aggregate instances.

Implementation details:
- Implement `findByCode(code)` using lookup map.
- Convert fixture record into domain `Coupon` with valid discount mode/value mapping.
- Keep mapping aligned with domain constructor expectations and invariants.
- Prevent leakage of raw fixture record beyond adapter boundary.

Validation checklist:
- Known coupon code yields domain `Coupon`.
- Domain discount mode/value semantics are preserved.
- Returned type matches repository contract.

### T008 - Handle unknown/empty coupon code returning `null` deterministically

Purpose:
- Define and enforce stable not-found behavior for invalid lookup inputs.

Implementation details:
- Normalize lookup input as needed (trim/empty handling) while preserving deterministic behavior.
- Return `null` for unknown or empty values.
- Avoid throwing runtime errors for not-found path.
- Ensure repeated calls produce identical outcomes.

Validation checklist:
- Unknown code always returns `null`.
- Empty input always returns `null`.
- Behavior is deterministic across repeated calls.

### T009 - Export coupon repository through coupon slice public API

Purpose:
- Expose adapter via slice entrypoint for stable consumer imports.

Implementation details:
- Update `src/entities/coupon/index.ts`.
- Preserve existing public exports.
- Export only intended adapter symbol(s).

Validation checklist:
- Adapter import works from `@/entities/coupon`.
- Public API remains clean and FSD-compliant.

### T010 - Add coupon repository behavior tests for found/not-found/determinism

Purpose:
- Add regression coverage for core coupon adapter behavior and deterministic guarantees.

Implementation details:
- Add `src/entities/coupon/api/mock-coupon-repository.test.ts`.
- Include cases for:
  - fixture initialization path,
  - known code success returning `Coupon`,
  - unknown code returns `null`,
  - empty code returns `null`,
  - deterministic repeated lookups.
- Keep tests scoped to adapter contract and domain output.

Validation checklist:
- Test suite covers all expected behavior branches.
- Assertions are deterministic and stable.
- Tests confirm contract-compatible return values.

## Integration Notes

- Keep method naming/behavior conventions aligned with inventory adapter WP.
- Avoid touching product slice files in this WP.

## Risks

- Coupon fixture record fields may not map directly to domain aggregate constructor.
- Inconsistent input normalization may break deterministic outcomes.

## Reviewer Guidance

- Verify all edits stay inside `owned_files`.
- Verify FR-004/005/006 behavior via tests.
- Verify no infrastructure or transport-level details leak into domain boundaries.

## Definition of Done

- Coupon adapter implemented and publicly exported.
- Deterministic found/not-found behavior validated by tests.
- Behavior satisfies FR-004, FR-005, FR-006 with static fixture-only operation.

## Activity Log

- 2026-04-10T14:09:17Z – kilo:minimax-m2.7:implementer:implementer – shell_pid=11920 – Started implementation via action command
- 2026-04-10T14:12:18Z – kilo:minimax-m2.7:implementer:implementer – shell_pid=11920 – Ready for review: coupon adapter implemented with 11 passing tests
- 2026-04-10T14:23:20Z – kilo:minimax-m2.7:reviewer:reviewer – shell_pid=11920 – Started review via action command
- 2026-04-10T14:23:43Z – kilo:minimax-m2.7:reviewer:reviewer – shell_pid=11920 – Review passed: coupon adapter correctly implements ICouponRepository, loads from fixtures, returns Coupon for known codes and null for unknown, deterministic behavior, all quality gates pass
