# Tasks: Reactive Zustand Cart Repository

**Mission**: `007-reactive-zustand-cart-repository`  
**Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository`  
**Spec**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/spec.md`  
**Plan**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/plan.md`

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Current branch matches target: `true`
- Execution worktrees are created later per computed lane in `lanes.json`; implementers must use `spec-kitty agent action implement WP## --agent <name>`.

## Subtask Index

| ID | Description | WP | Parallel |
| --- | --- | --- | --- |
| T001 | Define Zustand cart store state contract and initializer | WP01 | No | [D] |
| T002 | Implement store actions for replacing persisted cart state | WP01 | No | [D] |
| T003 | Add selector/hook-style reactive access helpers for cart consumers | WP01 | Yes | [D] |
| T004 | Add store-level behavior tests for initialization and update propagation | WP01 | No | [D] |
| T005 | Implement `ZustandCartRepository` construction over cart store | WP02 | No |
| T006 | Implement `getCart()` reactive read behavior through selector/hook integration | WP02 | No |
| T007 | Implement `saveCart(cart)` persistence path with atomic store update semantics | WP02 | No |
| T008 | Export repository and store artifacts via `src/entities/cart/index.ts` public API | WP02 | Yes |
| T009 | Add repository integration tests for save->get round-trip equivalence | WP03 | No |
| T010 | Add integration checks for sequential saves and empty-cart save edge case | WP03 | No |
| T011 | Validate local save-to-update latency target and capture evidence in assertions | WP03 | No |
| T012 | Run required quality gates (`lint`, `lint:arch`, `build`) and verify mission acceptance coverage | WP03 | No |

## Work Packages

## WP01 - Cart Store Reactive Foundation

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/tasks/WP01-cart-store-reactive-foundation.md`  
**Goal**: Establish the Zustand cart store with deterministic initialization, mutation entrypoints, and selector/hook reactive access building blocks.  
**Priority**: P1  
**Independent Test**: Store initializes with valid cart state, applies replacements safely, and reactive selector output updates after state changes.  
**Estimated Prompt Size**: ~360 lines

- [x] T001 Define Zustand cart store state contract and initializer (WP01)
- [x] T002 Implement store actions for replacing persisted cart state (WP01)
- [x] T003 Add selector/hook-style reactive access helpers for cart consumers (WP01)
- [x] T004 Add store-level behavior tests for initialization and update propagation (WP01)

Implementation sketch:
- Create `src/entities/cart/api/cart-store.ts` with explicit cart state shape and initialization strategy aligned to domain invariants.
- Implement controlled store update action for full cart replacement to support repository-driven persistence.
- Expose selector/hook-friendly access utility for reactive reads without leaking mutable store internals.
- Add tests validating initial state, single update propagation, and deterministic state replacement semantics.

Parallel opportunities:
- T003 can run in parallel with T004 once store state shape and action names are finalized.

Dependencies:
- No WP dependencies.

Risks:
- Store shape drift from cart domain expectations.
- Exposing mutable references that break repository boundary guarantees.

## WP02 - Repository Adapter and Public API Wiring

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/tasks/WP02-repository-adapter-and-public-api-wiring.md`  
**Goal**: Implement `ZustandCartRepository` over the store and expose all required entrypoints through the cart slice public API.  
**Priority**: P1  
**Independent Test**: Repository `saveCart` writes through to the store and `getCart` reflects the latest state reactively through the agreed selector/hook model.  
**Estimated Prompt Size**: ~330 lines

- [ ] T005 Implement `ZustandCartRepository` construction over cart store (WP02)
- [ ] T006 Implement `getCart()` reactive read behavior through selector/hook integration (WP02)
- [ ] T007 Implement `saveCart(cart)` persistence path with atomic store update semantics (WP02)
- [ ] T008 Export repository and store artifacts via `src/entities/cart/index.ts` public API (WP02)

Implementation sketch:
- Create `src/entities/cart/api/zustand-cart-repository.ts` implementing `ICartRepository`.
- Bind repository read path to store selectors/hook utilities and ensure read semantics match reactive requirements.
- Bind repository write path to atomic store replacement action.
- Update `src/entities/cart/index.ts` to expose adapter APIs through slice public surface only.

Parallel opportunities:
- T008 can run in parallel once repository and store export names are stable.

Dependencies:
- Depends on WP01.

Risks:
- Contract mismatch between repository port signature and reactive read model.
- Public API leakage of internal-only helpers.

## WP03 - Integration Validation and Quality Gates

**Prompt File**: `/Users/user/work/fsd-shopping-cart/kitty-specs/007-reactive-zustand-cart-repository/tasks/WP03-integration-validation-and-quality-gates.md`  
**Goal**: Prove mission requirements through integration validation, performance threshold checks, and mandatory project quality gates.  
**Priority**: P2  
**Independent Test**: Integration tests pass for round-trip, sequential update, and empty-cart edge cases; all required gates pass with exit code 0.  
**Estimated Prompt Size**: ~350 lines

- [ ] T009 Add repository integration tests for save->get round-trip equivalence (WP03)
- [ ] T010 Add integration checks for sequential saves and empty-cart save edge case (WP03)
- [ ] T011 Validate local save-to-update latency target and capture evidence in assertions (WP03)
- [ ] T012 Run required quality gates (`lint`, `lint:arch`, `build`) and verify mission acceptance coverage (WP03)

Implementation sketch:
- Add integration test file at cart API scope to verify end-to-end repository/store behavior.
- Validate round-trip and edge scenarios from spec user flows.
- Add measurable latency validation aligned to NFR threshold in local test conditions.
- Execute and record full quality-gate sequence and confirm FR/NFR acceptance alignment.

Parallel opportunities:
- Test case authoring for T010 can begin while T009 base harness is prepared, then merged into one integration suite.

Dependencies:
- Depends on WP02.

Risks:
- Timing assertions may be flaky if not bounded carefully for local environments.
- Gate failures may expose pre-existing architectural issues requiring bounded fixes.

## Parallelization Highlights

- WP01 is foundational and starts immediately.
- WP02 starts after WP01 and focuses on repository integration without introducing new ownership overlap.
- WP03 starts after WP02 and consolidates validation and quality gates.

## MVP Recommendation

- MVP scope: WP01 + WP02 (reactive store and repository contract in place). WP03 completes production-readiness validation.
