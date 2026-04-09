# Tasks: Async Domain Event Bus

**Mission**: 002-async-domain-event-bus  
**Generated**: 2026-04-09  
**Status**: Planned

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create DomainEvent interface and type definitions | WP01 | No |
| T002 | Implement subscribe() method with unsubscribe return | WP01 | No |
| T003 | Implement publish() method with async dispatch | WP01 | No |
| T004 | Implement error isolation (try/catch per handler) | WP01 | No |
| T005 | Add strict TypeScript types, no `any` | WP01 | No |
| T006 | Write unit tests: single handler subscription | WP02 | No |
| T007 | Write unit tests: multiple handlers per event | WP02 | No |
| T008 | Write unit tests: unsubscribe cleanup | WP02 | No |
| T009 | Write unit tests: async non-blocking dispatch | WP02 | No |
| T010 | Update shared/lib/index.ts exports | WP03 | No |
| T011 | Run lint, typecheck, verify tests pass | WP03 | No |

---

## Work Packages

### WP01: EventBus Implementation

**Summary**: Implement the EventBus class with all core functionality.

**Goal**: Complete EventBus class in `src/shared/lib/event-bus.ts` with typed subscribe/publish methods, unsubscribe, and error isolation.

**Priority**: 1 (Foundation)

**Test Criteria**: No runtime tests yet — WP02 covers testing.

**Included Subtasks**:
- [ ] T001: Create DomainEvent interface and type definitions
- [ ] T002: Implement subscribe() method with unsubscribe return
- [ ] T003: Implement publish() method with async dispatch
- [ ] T004: Implement error isolation (try/catch per handler)
- [ ] T005: Add strict TypeScript types, no `any`

**Implementation Sketch**:
1. Define `DomainEvent` interface and `Handler` type
2. Create `EventBus` class with internal `Map<string, Set<Handler>>`
3. Implement `subscribe<T>` — add handler to Set, return unsubscribe function
4. Implement `publish<T>` — use `Promise.resolve().then()` for async dispatch
5. Wrap each handler invocation in try/catch to isolate errors

**Risks**: None — well-understood pattern with clear spec.

**Prompt File**: `tasks/WP01-event-bus-implementation.md`

---

### WP02: Unit Tests

**Summary**: Write comprehensive unit tests covering all user scenarios.

**Goal**: Complete test suite in `src/shared/lib/event-bus.test.ts` with vitest.

**Priority**: 2 (Validation)

**Test Criteria**: All tests pass.

**Included Subtasks**:
- [ ] T006: Write unit tests: single handler subscription
- [ ] T007: Write unit tests: multiple handlers per event
- [ ] T008: Write unit tests: unsubscribe cleanup
- [ ] T009: Write unit tests: async non-blocking dispatch

**Implementation Sketch**:
1. Set up test file with vitest imports
2. Test T006: subscribe → publish → handler called
3. Test T007: two subscribes → publish → both called
4. Test T008: subscribe → unsubscribe → publish → handler NOT called
5. Test T009: publish returns before handler executes

**Dependencies**: WP01 (requires EventBus implementation)

**Risks**: Async timing — use `await Promise.resolve()` for microtask flush.

**Prompt File**: `tasks/WP02-unit-tests.md`

---

### WP03: Integration & Polish

**Summary**: Update exports and verify project quality gates.

**Goal**: All project commands pass (`npm run lint`, `npm run lint:arch`, `npm run build`).

**Priority**: 3 (Finalization)

**Test Criteria**: All commands exit with code 0.

**Included Subtasks**:
- [ ] T010: Update shared/lib/index.ts exports
- [ ] T011: Run lint, typecheck, verify tests pass

**Implementation Sketch**:
1. Read existing `index.ts` structure
2. Add re-exports for `EventBus` and `DomainEvent`
3. Run `npm run lint` — fix any errors
4. Run `npm run lint:arch` — fix any violations
5. Run `npm run build` — verify TypeScript compiles

**Dependencies**: WP01, WP02

**Risks**: Low — small changes, well-defined project.

**Prompt File**: `tasks/WP03-integration-polish.md`

---

## Size Summary

| WP | Subtasks | Est. Lines | Status |
|----|----------|------------|--------|
| WP01 | 5 | ~350 | ✓ Ideal |
| WP02 | 4 | ~300 | ✓ Ideal |
| WP03 | 2 | ~150 | ✓ Good |

**Total**: 11 subtasks across 3 work packages.

---

## MVP Scope

**WP01** is the MVP — it delivers the core EventBus functionality. WP02 and WP03 are validation and polish.

---

## Next Command

Run `/spec-kitty.implement WP01` to start implementation.
