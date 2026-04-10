# Tasks: Entity Repository Ports

**Mission**: `009-entity-repository-ports`  
**Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/009-entity-repository-ports`  
**Spec**: `/Users/user/work/fsd-shopping-cart/kitty-specs/009-entity-repository-ports/spec.md`  
**Plan**: `/Users/user/work/fsd-shopping-cart/kitty-specs/009-entity-repository-ports/plan.md`

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Current branch matches target: `true`
- Execution worktrees are created later per computed lane in `lanes.json`; implementers must use `spec-kitty agent action implement WP## --agent <name>`.

## Subtask Index

| ID | Description | WP | Parallel |
| --- | --- | --- | --- |
| T001 | Define `ICartRepository` contract in `src/entities/cart/model/ports.ts` using cart domain types | WP01 | No |
| T002 | Define `IStockRepository` contract in `src/entities/product/model/ports.ts` using product variant domain types | WP01 | Yes |
| T003 | Define `ICouponRepository` contract in `src/entities/coupon/model/ports.ts` with nullable coupon lookup result | WP01 | Yes |
| T004 | Verify each port contract avoids infrastructure payload shapes and ambiguous typing | WP01 | No |
| T005 | Export cart port types from `src/entities/cart/index.ts` public API | WP02 | No | [D] |
| T006 | Export product port types from `src/entities/product/index.ts` public API | WP02 | Yes | [D] |
| T007 | Export coupon port types from `src/entities/coupon/index.ts` public API | WP02 | Yes | [D] |
| T008 | Run `npm run lint`, `npm run lint:arch`, and `npm run build` to validate mission scope | WP02 | No | [D] |

## Work Packages

## WP01 - Domain Port Contracts

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/009-entity-repository-ports/tasks/WP01-domain-port-contracts.md`  
**Goal**: Create the three entity repository port interfaces with domain-safe method signatures and deterministic type contracts.  
**Priority**: P1  
**Independent Test**: Repository interfaces compile with domain entity/value object signatures only and no infrastructure-shape leakage.  
**Estimated Prompt Size**: ~280 lines

- [ ] T001 Define `ICartRepository` contract in `src/entities/cart/model/ports.ts` using cart domain types (WP01)
- [ ] T002 Define `IStockRepository` contract in `src/entities/product/model/ports.ts` using product variant domain types (WP01)
- [ ] T003 Define `ICouponRepository` contract in `src/entities/coupon/model/ports.ts` with nullable coupon lookup result (WP01)
- [ ] T004 Verify each port contract avoids infrastructure payload shapes and ambiguous typing (WP01)

Implementation sketch:
- Add one `ports.ts` file per entity slice model directory and declare interface methods exactly as required by T-007.
- Import only domain-level types from the same slice model surface and keep signatures minimal and explicit.
- Ensure coupon lookup contract expresses nullable result for missing codes.
- Review each contract for strict type safety and absence of raw JSON/infrastructure DTO shapes.

Parallel opportunities:
- T002 and T003 are parallel-safe after T001 establishes naming and signature style conventions.

Dependencies:
- No WP dependencies.

Risks:
- Method signatures diverge from expected downstream use-case contracts.
- Contract files compile but expose weak/ambiguous type surfaces.

## WP02 - Public API Exports and Quality Gates

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/009-entity-repository-ports/tasks/WP02-public-api-exports-and-validation.md`  
**Goal**: Expose all new ports through slice public APIs and validate architecture/type integrity through required project gates.  
**Priority**: P1  
**Independent Test**: Port types are importable from each slice entrypoint and all lint/architecture/build checks pass with exit code 0.  
**Estimated Prompt Size**: ~260 lines

- [x] T005 Export cart port types from `src/entities/cart/index.ts` public API (WP02)
- [x] T006 Export product port types from `src/entities/product/index.ts` public API (WP02)
- [x] T007 Export coupon port types from `src/entities/coupon/index.ts` public API (WP02)
- [x] T008 Run `npm run lint`, `npm run lint:arch`, and `npm run build` to validate mission scope (WP02)

Implementation sketch:
- Update each entity slice `index.ts` to re-export its new port interfaces while preserving existing export conventions.
- Confirm consumers can import contracts from `@/entities/cart`, `@/entities/product`, and `@/entities/coupon` without deep imports.
- Run quality gates in required sequence and resolve any violations introduced by port/export changes.

Parallel opportunities:
- T006 and T007 can run in parallel after T005 clarifies export pattern.

Dependencies:
- Depends on WP01.

Risks:
- Entry-point exports accidentally omit new port types or break existing export surface.
- Architecture linter detects boundary violations from incorrect import paths.

## Parallelization Highlights

- WP01 is the foundational contract-definition package.
- Within WP01, T002 and T003 are parallel-safe after interface style alignment.
- WP02 begins after WP01 and includes limited intra-WP parallelism across index export updates.

## MVP Recommendation

- MVP scope: WP01 (domain port interface definitions) to unblock downstream adapter and feature work with minimal change surface.
