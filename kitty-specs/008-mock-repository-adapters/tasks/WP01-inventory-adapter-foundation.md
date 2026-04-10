---
work_package_id: WP01
title: Inventory Adapter Foundation
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-008-mock-repository-adapters
base_commit: 832c8f53eea16f33d8b588e7c9f89166d3343de1
created_at: '2026-04-10T14:03:21.722177+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
shell_pid: "11920"
agent: "kilo:minimax-m2.7:implementer:implementer"
history:
- timestamp: '2026-04-10T13:55:23Z'
  action: planned
  by: kilo
authoritative_surface: src/entities/product/
execution_mode: code_change
owned_files:
- src/entities/product/api/mock-inventory-repository.ts
- src/entities/product/index.ts
- src/entities/product/api/mock-inventory-repository.test.ts
tags: []
---

# WP01 - Inventory Adapter Foundation

## Objective

Implement the product inventory driven adapter so consumers can resolve stock data through `IStockRepository` using static fixture data only, with deterministic read behavior and contract-safe return values.

## Context

- Mission: `008-mock-repository-adapters`
- Planning branch: `main`
- Merge target: `main`
- This WP covers inventory-side functional requirements: FR-001, FR-002, FR-003.
- Scope is read-only fixture-backed adapter behavior; no runtime writes, no caching, no fallback data source.

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Implementation uses lane-based workspace allocation from `lanes.json` after task finalization.
- Use command: `spec-kitty agent action implement WP01 --agent <name>`

## Subtask Guidance

### T001 - Implement inventory repository initialization from shared fixtures

Purpose:
- Create repository class that loads inventory/product fixtures once at initialization and keeps an immutable in-memory representation for lookups.

Implementation details:
- Add `src/entities/product/api/mock-inventory-repository.ts`.
- Implement class aligned with existing `IStockRepository` port signature.
- Load fixtures from `@/shared/api` public API surface (no deep internal imports outside allowed boundaries).
- Normalize fixture records into an internal lookup map keyed by `skuId`.
- Ensure initialization handles fixture arrays deterministically (stable iteration, no random ordering dependence).

Validation checklist:
- Adapter can be instantiated without side effects outside internal memory.
- Fixture data source is shared fixtures, not hardcoded inline objects.
- Initialization path is read-only.

### T002 - Implement `findBySku` mapping from fixture data to `ProductVariant`

Purpose:
- Provide domain-conformant lookup return for known SKUs.

Implementation details:
- Implement `findBySku(skuId)` on the adapter using normalized map.
- Reconstruct and return `ProductVariant` domain object from fixture-backed values.
- Ensure domain constructor/invariant rules are respected (do not bypass aggregate integrity).
- Keep returned object shape strictly domain-level (no raw fixture DTO leakage).

Validation checklist:
- Known fixture SKU returns `ProductVariant`.
- Returned object includes expected identity and stock-relevant fields.
- Consumer-facing type is repository contract type.

### T003 - Handle unknown/malformed SKU with deterministic not-found outcome

Purpose:
- Guarantee safe and predictable behavior for missing or invalid lookup requests.

Implementation details:
- Define how malformed input (empty string, whitespace-only, invalid pattern if applicable) is treated.
- Return the repository’s not-found outcome consistently for unknown or malformed values.
- Do not throw runtime exceptions for not-found paths.
- Keep response deterministic across repeated calls.

Validation checklist:
- Unknown SKU returns not-found each time.
- Malformed SKU returns not-found each time.
- No random or stateful drift across repeated calls.

### T004 - Export inventory repository through product slice public API

Purpose:
- Make adapter available through slice entrypoint to satisfy public API requirement.

Implementation details:
- Update `src/entities/product/index.ts` to export the inventory adapter.
- Preserve existing exports and ordering conventions.
- Avoid exposing internal helper-only symbols.

Validation checklist:
- Consumer import from `@/entities/product` resolves adapter export.
- No forbidden cross-layer or deep import exposure is introduced.

### T005 - Add inventory repository behavior tests for found/not-found/determinism

Purpose:
- Provide explicit regression guard for all inventory adapter behaviors covered by FR and NFR scope.

Implementation details:
- Add `src/entities/product/api/mock-inventory-repository.test.ts`.
- Include tests for:
  - initialization from fixtures,
  - known SKU success,
  - unknown SKU not-found,
  - malformed SKU not-found,
  - deterministic repeated lookup equivalence.
- Keep tests focused on adapter contract behavior (no UI or feature orchestration assertions).

Validation checklist:
- Tests are deterministic and independent.
- Assertions verify domain object return type/shape where relevant.
- Not-found assertions are explicit and repeatable.

## Integration Notes

- Coordinate naming conventions with coupon adapter WP to keep repository API semantics consistent.
- Do not modify coupon slice files in this WP.

## Risks

- Fixture/domain field mismatch during reconstruction.
- Inadvertent leakage of fixture DTOs through repository boundary.

## Reviewer Guidance

- Confirm all changed files are within `owned_files`.
- Confirm FR-001/002/003 acceptance behavior by reading tests first.
- Confirm imports remain FSD-compliant and go through public APIs when crossing slices.

## Definition of Done

- Adapter implemented and exported through product slice API.
- All WP01 tests pass locally with deterministic outcomes.
- Behavior satisfies FR-001, FR-002, FR-003 without violating read-only constraint.

## Activity Log

- 2026-04-10T14:03:28Z – kilo:minimax-m2.7:implementer:implementer – shell_pid=11920 – Assigned agent via action command
- 2026-04-10T14:09:02Z – kilo:minimax-m2.7:implementer:implementer – shell_pid=11920 – Ready for review: inventory adapter implemented with 14 passing tests
