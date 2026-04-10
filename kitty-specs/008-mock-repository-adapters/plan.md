# Implementation Plan: Mock Repository Adapters
*Path: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/plan.md`*

**Branch**: `008-mock-repository-adapters` | **Date**: 2026-04-10 | **Spec**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/spec.md`
**Input**: Feature specification from `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/spec.md`

## Summary

Implement two fixture-backed, read-only driven adapters that satisfy existing repository ports for product inventory and coupon lookup. The design preserves strict port/domain boundaries, deterministic lookup behavior, and static fixture sourcing so downstream use cases can execute without infrastructure coupling.

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: Existing domain entities and repository ports in `entities/product` and `entities/coupon`; shared fixture datasets in `shared/api/fixtures`  
**Storage**: Static in-memory fixture data loaded at repository initialization (read-only)  
**Testing**: Project unit-test harness for repository behavior and port conformance  
**Target Platform**: Browser-based React application runtime and local CI environment  
**Project Type**: Single web application (FSD architecture)  
**Performance Goals**: Fixture lookups complete within 100 ms for at least 95% of single-item requests  
**Constraints**: No runtime mutation, no caching layer, no fallback source, deterministic results for repeated identical lookups  
**Scale/Scope**: Two repository adapters plus slice public API exposure updates

## Charter Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Charter file not found at `/Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md`; charter gate is skipped for this mission.

## Project Structure

### Documentation (this feature)

```
kitty-specs/008-mock-repository-adapters/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```
src/
├── entities/
│   ├── product/
│   │   ├── api/
│   │   │   └── mock-inventory-repository.ts
│   │   └── index.ts
│   └── coupon/
│       ├── api/
│       │   └── mock-coupon-repository.ts
│       └── index.ts
└── shared/
    └── api/
        └── fixtures/
```

**Structure Decision**: Use existing single-project FSD layout and add only adapter files in `entities/*/api` with corresponding `index.ts` public API updates.

## Phase 0: Research Plan

- Confirm fixture-to-domain mapping strategy for `ProductVariant` reconstruction and missing-SKU handling.
- Confirm fixture-to-domain mapping strategy for `Coupon` reconstruction and missing-code null behavior.
- Confirm deterministic read-only adapter pattern for static datasets and repeated lookups.
- Confirm repository port conformance verification approach and required test assertions.

## Phase 1: Design & Contracts Plan

- Define adapter-facing data model for lookup requests, fixture records, and domain return types.
- Define lookup contracts for inventory and coupon adapters as port-aligned interface behavior.
- Document quickstart validation flow for lint, architecture checks, and build.
- Update agent context for planning artifacts by resolving mission context with `spec-kitty agent context resolve --action tasks --mission 008-mock-repository-adapters --json`.

## Complexity Tracking

No charter violations requiring justification.
