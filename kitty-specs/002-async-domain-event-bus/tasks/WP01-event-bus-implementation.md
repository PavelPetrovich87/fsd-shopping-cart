---
work_package_id: WP01
title: EventBus Implementation
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- NFR-001
- NFR-002
- NFR-003
- C-001
- C-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-09T12:09:29Z'
subtasks:
- T001
- T002
- T003
- T004
- T005
agent: "kilo:kilo-auto/balanced:implementer:implementer"
shell_pid: "83516"
history:
- date: '2026-04-09T12:09:29Z'
  action: created
  note: Initial work package for EventBus implementation
authoritative_surface: src/shared/lib/event-bus.ts
execution_mode: code_change
owned_files:
- src/shared/lib/event-bus.ts
---

# WP01: EventBus Implementation

## Objective

Implement the `EventBus` class in `src/shared/lib/event-bus.ts` — a typed, async Pub/Sub event bus using the Dependency Injection pattern.

## Context

This is a Tier 1 shared library component for the shopping cart application. It enables domain entities to emit events that other parts of the system can react to, promoting loose coupling.

**Design Decisions** (from plan):
- Instance model: DI (each consumer creates own `new EventBus()`)
- Async execution: `Promise` microtask queue
- Type safety: Generics with `DomainEvent` base interface
- Error isolation: Best-effort dispatch (one handler error doesn't block others)

**Spec Reference**: `kitty-specs/002-async-domain-event-bus/spec.md`

## Implementation

### Subtask T001: Create DomainEvent Interface and Type Definitions

**Purpose**: Define the base types for the event bus.

**Steps**:
1. Create `src/shared/lib/event-bus.ts` (new file)
2. Export `DomainEvent` interface with single `type: string` property
3. Export `Handler<T>` type as `(event: T) => void`
4. Export `Unsubscribe` type as `() => void`

**Files**:
- `src/shared/lib/event-bus.ts` (create, ~10 lines)

**Validation**:
- [ ] `DomainEvent` interface compiles
- [ ] Generic `Handler<T extends DomainEvent>` type works

---

### Subtask T002: Implement subscribe() Method

**Purpose**: Allow consumers to register handlers for specific event types.

**Steps**:
1. Add private `handlers: Map<string, Set<Handler>>` property to EventBus class
2. Implement `subscribe<T extends DomainEvent>(eventType: T['type'], handler: Handler<T>): Unsubscribe`
3. On subscribe:
   - Get or create Set for the event type in the Map
   - Add handler to the Set
   - Return function that removes handler from Set
4. If Set becomes empty after removal, optionally delete the key from Map

**Files**:
- `src/shared/lib/event-bus.ts` (modify, ~25 lines)

**Validation**:
- [ ] Calling subscribe returns a function
- [ ] The returned function removes the handler
- [ ] Multiple calls for same event type work

---

### Subtask T003: Implement publish() Method with Async Dispatch

**Purpose**: Dispatch events to all registered handlers asynchronously.

**Steps**:
1. Implement `publish<T extends DomainEvent>(event: T): void`
2. On publish:
   - Look up handlers Set for `event.type`
   - If no handlers, return immediately
   - Use `Promise.resolve().then()` to schedule async dispatch
   - Inside the promise callback, iterate handlers and call each with the event

**Files**:
- `src/shared/lib/event-bus.ts` (modify, ~15 lines)

**Validation**:
- [ ] `publish()` returns immediately (before handlers execute)
- [ ] All handlers for the event type receive the event
- [ ] Event payload is preserved

---

### Subtask T004: Implement Error Isolation

**Purpose**: One handler error should not prevent other handlers from executing.

**Steps**:
1. In the publish handler loop, wrap each `handler(event)` call in try/catch
2. Catch errors silently (console.error is acceptable for debugging)
3. Continue to next handler after catching

**Files**:
- `src/shared/lib/event-bus.ts` (modify, ~10 lines)

**Validation**:
- [ ] Handler A throws → Handler B still executes
- [ ] publish() returns even if handlers throw

---

### Subtask T005: Add Strict TypeScript Types

**Purpose**: Ensure full type safety without `any` types.

**Steps**:
1. Use generic `<T extends DomainEvent>` on both methods
2. `eventType` parameter should be `T['type']` (string literal union)
3. Handler parameter should be `(event: T) => void`
4. Verify no `any` types in the file
5. Confirm strict mode compatibility

**Files**:
- `src/shared/lib/event-bus.ts` (modify, type refinements)

**Validation**:
- [ ] TypeScript compiles with `tsc --noEmit` in strict mode
- [ ] No `any` types in file
- [ ] Consumer code gets proper autocomplete for event types

---

## Definition of Done

- [ ] `src/shared/lib/event-bus.ts` created with complete EventBus class
- [ ] `subscribe()` returns unsubscribe function that removes handler
- [ ] `publish()` dispatches asynchronously without blocking
- [ ] Multiple handlers per event type supported
- [ ] Error in one handler doesn't block others
- [ ] TypeScript compiles with strict mode, no `any` types
- [ ] Browser-compatible (no Node.js APIs)

## Files Modified

| File | Action |
|------|--------|
| `src/shared/lib/event-bus.ts` | Create |

## Risks

- **Low**: This is a well-understood pattern with clear spec.
- No external dependencies to manage.
- No complex edge cases beyond async timing.

## Reviewer Guidance

- Verify the async dispatch uses `Promise.resolve().then()` (not `setTimeout`)
- Verify no `any` types in the file
- Verify unsubscribe actually removes the handler from the Map
- Verify try/catch is inside the loop (not wrapping the entire loop)

## Next Command

After WP01 completes, run:
```bash
spec-kitty implement WP02
```

## Activity Log

- 2026-04-09T12:53:15Z – kilo:kilo-auto/balanced:implementer:implementer – shell_pid=83516 – Started implementation via action command
- 2026-04-09T12:56:54Z – kilo:kilo-auto/balanced:implementer:implementer – shell_pid=83516 – Ready for review: EventBus implementation complete
