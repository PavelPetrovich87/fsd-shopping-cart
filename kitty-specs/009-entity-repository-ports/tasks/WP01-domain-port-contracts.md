---
work_package_id: WP01
title: Domain Port Contracts
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-009-entity-repository-ports
base_commit: 785da1a5c98ac72865b62649f4d558fb89c48dd1
created_at: '2026-04-10T14:20:46.032899+00:00'
subtasks:
- T001
- T002
- T003
- T004
shell_pid: "11913"
agent: "kilo:minimax:implementer:reviewer"
history:
- timestamp: '2026-04-10T13:57:20Z'
  action: planned
  by: kilo
authoritative_surface: src/entities/
execution_mode: code_change
owned_files:
- src/entities/cart/model/ports.ts
- src/entities/product/model/ports.ts
- src/entities/coupon/model/ports.ts
tags: []
---

# WP01 - Domain Port Contracts

## Objective

Define all repository interfaces required by T-007 so that cart, product stock, and coupon data access is represented as strict domain contracts with no infrastructure leakage.

## Context

- Mission: `009-entity-repository-ports`
- Planning branch: `main`
- Merge target: `main`
- This package establishes the contract layer for FR-001, FR-002, FR-003, and FR-005.
- Scope is intentionally type-only: no adapters, no runtime data access, no behavior changes.

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Execution worktrees are allocated later per computed lane in `lanes.json`.
- Implementation command: `spec-kitty agent action implement WP01 --agent <name>`

## Subtask Guidance

### T001 - Define `ICartRepository` contract in `src/entities/cart/model/ports.ts` using cart domain types

Purpose:
- Introduce cart persistence and retrieval contract surface for use cases without exposing data-source concerns.

Implementation details:
- Create `src/entities/cart/model/ports.ts`.
- Define `ICartRepository` interface with methods:
  - `getCart()`
  - `saveCart(cart)`
- Use cart domain aggregate type(s) already present in the cart slice model.
- Keep method signatures explicit and free from `any` or raw object shapes.
- Preserve naming exactly as ticketed to reduce integration ambiguity.

Validation checklist:
- Interface exists and compiles.
- `getCart()` returns domain cart type.
- `saveCart(cart)` accepts domain cart type.
- No infrastructure DTO type imports appear.

### T002 - Define `IStockRepository` contract in `src/entities/product/model/ports.ts` using product variant domain types

Purpose:
- Establish stock data access contract keyed by SKU while preserving product domain abstractions.

Implementation details:
- Create `src/entities/product/model/ports.ts`.
- Define `IStockRepository` interface with methods:
  - `findBySku(skuId)`
  - `save(variant)`
- Use existing product variant domain type(s) from the product slice.
- Keep SKU identifier as a typed input compatible with existing domain conventions.
- Ensure no fixture/API payload shapes appear in signatures.

Validation checklist:
- Interface exists and compiles.
- `findBySku(skuId)` returns domain product variant type (or existing domain-consistent optional/null pattern if defined).
- `save(variant)` accepts domain product variant type.
- No infrastructure type coupling.

### T003 - Define `ICouponRepository` contract in `src/entities/coupon/model/ports.ts` with nullable coupon lookup result

Purpose:
- Provide coupon retrieval contract that communicates missing-coupon outcomes explicitly via nullability.

Implementation details:
- Create `src/entities/coupon/model/ports.ts`.
- Define `ICouponRepository` interface with method:
  - `findByCode(code)`
- Return type must represent coupon domain aggregate or `null` for not-found outcome.
- Keep coupon code input type aligned with existing coupon domain expectations.
- Avoid throwing semantics in contract shape; encode absence as nullable result.

Validation checklist:
- Interface exists and compiles.
- `findByCode(code)` return type is nullable domain coupon.
- Signature avoids raw payload types and ambiguous typing.

### T004 - Verify each port contract avoids infrastructure payload shapes and ambiguous typing

Purpose:
- Enforce FR-005 and NFR-003 by ensuring contract quality before public export and gate checks.

Implementation details:
- Review all three `ports.ts` files together for consistency in style and strictness.
- Remove any permissive typing (`any`, broad `unknown` without narrowing rationale, generic object maps) unless required by existing domain conventions.
- Ensure imports are domain-local and FSD-compliant.
- Ensure method naming and semantics align with T-007 acceptance criteria.

Validation checklist:
- No ambiguous or infrastructure-shaped signatures.
- All method names and arguments match planned contract surface.
- Files are internally consistent for downstream usage.

## Integration Notes

- Keep this WP isolated to model `ports.ts` files only; do not edit slice `index.ts` files in this package.
- Maintain compatibility with existing consumers that will be updated in WP02.

## Risks

- Domain type names may differ from assumptions across slices; verify existing model exports before finalizing signatures.
- Inconsistent nullability semantics can cause downstream adapter or use-case mismatches.

## Reviewer Guidance

- Confirm all changes are limited to `owned_files`.
- Confirm contract signatures satisfy T-007 methods exactly.
- Confirm no infrastructure import or payload type appears in interfaces.

## Definition of Done

- `ICartRepository`, `IStockRepository`, and `ICouponRepository` are defined in their respective slice model `ports.ts` files.
- Interfaces are domain-typed, deterministic, and infrastructure-agnostic.
- Contract files compile cleanly and are ready for public API export work.

## Activity Log

- 2026-04-10T14:20:52Z – kilo:minimax:implementer:implementer – shell_pid=11913 – Assigned agent via action command
- 2026-04-10T14:22:59Z – kilo:minimax:implementer:implementer – shell_pid=11913 – Ready for review: 3 port interfaces defined and all quality gates pass
- 2026-04-10T14:23:13Z – kilo:minimax:implementer:reviewer – shell_pid=11913 – Started review via action command
- 2026-04-10T14:23:53Z – kilo:minimax:implementer:reviewer – shell_pid=11913 – Review passed: All 3 port interfaces implemented correctly with domain types, all quality gates pass
