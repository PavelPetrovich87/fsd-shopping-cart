# Tasks: Mock Repository Adapters

**Mission**: `008-mock-repository-adapters`  
**Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters`  
**Spec**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/spec.md`  
**Plan**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/plan.md`

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Current branch matches target: `true`
- Execution worktrees are created later per computed lane in `lanes.json`; implementers must use `spec-kitty agent action implement WP## --agent <name>`.

## Subtask Index

| ID | Description | WP | Parallel |
| --- | --- | --- | --- |
| T001 | Implement inventory repository initialization from shared fixtures | WP01 | No | [D] |
| T002 | Implement `findBySku` mapping from fixture data to `ProductVariant` | WP01 | No | [D] |
| T003 | Handle unknown/malformed SKU with deterministic not-found outcome | WP01 | No | [D] |
| T004 | Export inventory repository through product slice public API | WP01 | Yes | [D] |
| T005 | Add inventory repository behavior tests for found/not-found/determinism | WP01 | No | [D] |
| T006 | Implement coupon repository initialization from shared fixtures | WP02 | No | [D] |
| T007 | Implement `findByCode` mapping from fixture data to `Coupon` | WP02 | No | [D] |
| T008 | Handle unknown/empty coupon code returning `null` deterministically | WP02 | No | [D] |
| T009 | Export coupon repository through coupon slice public API | WP02 | Yes | [D] |
| T010 | Add coupon repository behavior tests for found/not-found/determinism | WP02 | No | [D] |
| T011 | Run lint/arch/build and verify FR/NFR coverage evidence | WP03 | No | [D] |
| T012 | Add cross-slice adapter usage verification test for port compatibility | WP03 | No | [D] |
| T013 | Record final implementation verification notes in feature quickstart doc | WP03 | No | [D] |

## Work Packages

## WP01 - Inventory Adapter Foundation

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/tasks/WP01-inventory-adapter-foundation.md`  
**Goal**: Deliver the product inventory driven adapter behind the `IStockRepository` contract with deterministic read-only fixture behavior.  
**Priority**: P1  
**Independent Test**: Known SKU resolves to valid `ProductVariant`; unknown SKU returns not-found outcome without runtime failure.  
**Estimated Prompt Size**: ~340 lines

- [x] T001 Implement inventory repository initialization from shared fixtures (WP01)
- [x] T002 Implement `findBySku` mapping from fixture data to `ProductVariant` (WP01)
- [x] T003 Handle unknown/malformed SKU with deterministic not-found outcome (WP01)
- [x] T004 Export inventory repository through product slice public API (WP01)
- [x] T005 Add inventory repository behavior tests for found/not-found/determinism (WP01)

Implementation sketch:
- Create repository in `src/entities/product/api/mock-inventory-repository.ts` with fixture snapshot loaded once at adapter initialization.
- Implement domain reconstruction path from fixture records to `ProductVariant` while preserving existing entity invariants.
- Define explicit not-found behavior for missing or malformed SKU input according to product repository contract expectations.
- Update `src/entities/product/index.ts` to expose adapter from slice public API.
- Add focused unit tests for initialization, successful lookup, not-found behavior, and deterministic repeated reads.

Parallel opportunities:
- T004 can run in parallel with T005 once public API names are stable.

Dependencies:
- No WP dependencies.

Risks:
- Fixture shape mismatch with domain constructor inputs.
- Returning raw fixture data instead of domain entity by mistake.

## WP02 - Coupon Adapter Foundation

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/tasks/WP02-coupon-adapter-foundation.md`  
**Goal**: Deliver the coupon driven adapter behind the `ICouponRepository` contract with deterministic read-only fixture behavior.  
**Priority**: P1  
**Independent Test**: Known coupon code resolves to valid `Coupon`; unknown or empty code returns `null`.  
**Estimated Prompt Size**: ~320 lines

- [x] T006 Implement coupon repository initialization from shared fixtures (WP02)
- [x] T007 Implement `findByCode` mapping from fixture data to `Coupon` (WP02)
- [x] T008 Handle unknown/empty coupon code returning `null` deterministically (WP02)
- [x] T009 Export coupon repository through coupon slice public API (WP02)
- [x] T010 Add coupon repository behavior tests for found/not-found/determinism (WP02)

Implementation sketch:
- Create repository in `src/entities/coupon/api/mock-coupon-repository.ts` with fixture snapshot loaded once at initialization.
- Implement fixture-to-domain mapping path for coupon creation including discount mode/value validation through existing domain rules.
- Define deterministic null-return behavior for missing and empty codes.
- Update `src/entities/coupon/index.ts` to expose adapter through public API.
- Add unit tests for successful lookup, unknown lookup, and deterministic repeated reads.

Parallel opportunities:
- Fully parallelizable with WP01 due to non-overlapping slice ownership.

Dependencies:
- No WP dependencies.

Risks:
- Coupon fixture shape divergence from domain expectations.
- Inconsistent code normalization causing non-deterministic lookup behavior.

## WP03 - Integration Verification and Mission Validation

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/008-mock-repository-adapters/tasks/WP03-integration-verification-and-validation.md`  
**Goal**: Validate both adapters together against mission requirements and quality gates, including port-compatibility checks and completion evidence.  
**Priority**: P2  
**Independent Test**: All required quality gates pass and integration checks confirm both adapters are consumable through repository contracts.  
**Estimated Prompt Size**: ~250 lines

- [x] T011 Run lint/arch/build and verify FR/NFR coverage evidence (WP03)
- [x] T012 Add cross-slice adapter usage verification test for port compatibility (WP03)
- [x] T013 Record final implementation verification notes in feature quickstart doc (WP03)

Implementation sketch:
- Add a small integration-level verification in test scope that exercises both repository ports from consumer perspective.
- Execute quality gates in required sequence: `npm run lint`, `npm run lint:arch`, `npm run build`.
- Document completion evidence and verification outcomes in feature quickstart artifact.

Parallel opportunities:
- Starts after WP01 and WP02 complete.

Dependencies:
- Depends on WP01, WP02.

Risks:
- Integration test accidentally crossing FSD boundaries.
- Missing evidence linkage to FR/NFR coverage.

## Parallelization Highlights

- WP01 and WP02 can execute concurrently in separate lanes with no file overlap.
- WP03 consolidates validation and runs after both foundational WPs are merged.

## MVP Recommendation

- MVP scope: WP01 only (inventory adapter path) for earliest usable repository-driven stock lookup.
