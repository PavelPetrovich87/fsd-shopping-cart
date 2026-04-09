---
work_package_id: WP02
title: Unit Tests
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- NFR-001
- NFR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-09T12:09:29Z'
subtasks:
- T006
- T007
- T008
- T009
agent: "kilo:kilo-auto/balanced:implementer:implementer"
shell_pid: "83516"
history:
- date: '2026-04-09T12:09:29Z'
  action: created
  note: Unit tests for EventBus covering all user scenarios
authoritative_surface: src/shared/lib/event-bus.test.ts
execution_mode: code_change
owned_files:
- src/shared/lib/event-bus.test.ts
---

# WP02: Unit Tests

## Objective

Write comprehensive unit tests for the EventBus in `src/shared/lib/event-bus.test.ts` using vitest.

## Context

**Dependencies**: Requires WP01 (EventBus implementation) to be complete.

**Spec Reference**: User Scenarios in `kitty-specs/002-async-domain-event-bus/spec.md`:
- Scenario: Single Handler Subscription
- Scenario: Multiple Handlers Per Event
- Scenario: Unsubscribe
- Scenario: Async Execution

**Testing Pattern**: Use `vi.fn()` from vitest for mocks and `await Promise.resolve()` for async flush.

## Implementation

### Subtask T006: Single Handler Subscription

**Purpose**: Verify that subscribing and publishing works for a single handler.

**Steps**:
1. Create `src/shared/lib/event-bus.test.ts`
2. Import `EventBus` and vitest utilities
3. Define test interface `ItemAddedToCart`
4. Write test:
   - Create `new EventBus()`
   - Create `vi.fn()` mock handler
   - Call `subscribe('ItemAddedToCart', handler)`
   - Call `publish({ type: 'ItemAddedToCart', payload: { skuId: 'SKU-1', quantity: 2 } })`
   - `await Promise.resolve()` to flush microtask queue
   - Assert handler was called with correct event

**Files**:
- `src/shared/lib/event-bus.test.ts` (create, ~30 lines)

**Validation**:
- [ ] Handler is called after publish
- [ ] Event payload matches what was published

---

### Subtask T007: Multiple Handlers Per Event

**Purpose**: Verify that multiple handlers receive events for the same type.

**Steps**:
1. Write test:
   - Create `new EventBus()`
   - Create two `vi.fn()` handlers (handlerA, handlerB)
   - Subscribe both to `'CheckoutInitiated'`
   - Publish `{ type: 'CheckoutInitiated', payload: { orderId: 'ORD-123' } }`
   - `await Promise.resolve()`
   - Assert both handlers were called
   - Assert both received the same event

**Files**:
- `src/shared/lib/event-bus.test.ts` (modify, ~25 lines)

**Validation**:
- [ ] handlerA was called
- [ ] handlerB was called
- [ ] Both received the correct payload

---

### Subtask T008: Unsubscribe Cleanup

**Purpose**: Verify that calling unsubscribe prevents the handler from receiving future events.

**Steps**:
1. Write test:
   - Create `new EventBus()`
   - Create `vi.fn()` handler
   - Call `subscribe('ItemAddedToCart', handler)` and capture unsubscribe
   - Call `unsubscribe()`
   - Publish `{ type: 'ItemAddedToCart', payload: { skuId: 'SKU-1', quantity: 1 } }`
   - `await Promise.resolve()`
   - Assert handler was NOT called

2. Write additional test for memory safety:
   - Subscribe handler
   - Unsubscribe
   - Publish to same event type
   - Verify no errors (handler not in Set)

**Files**:
- `src/shared/lib/event-bus.test.ts` (modify, ~30 lines)

**Validation**:
- [ ] Unsubscribed handler is not called
- [ ] No errors after unsubscribe
- [ ] Other handlers still work after unsubscribe

---

### Subtask T009: Async Non-Blocking Dispatch

**Purpose**: Verify that publish() returns immediately and handlers execute asynchronously.

**Steps**:
1. Write test for non-blocking:
   - Create `new EventBus()`
   - Create `vi.fn()` handler
   - Track call time
   - Call `publish()` synchronously
   - Assert handler was NOT called immediately after publish
   - `await Promise.resolve()`
   - Assert handler WAS called after microtask

2. Write test for async ordering:
   - Publish multiple events
   - Verify handlers execute in order after await

**Files**:
- `src/shared/lib/event-bus.test.ts` (modify, ~30 lines)

**Validation**:
- [ ] Handler not called before await Promise.resolve()
- [ ] Handler called after await Promise.resolve()
- [ ] publish() returns synchronously

---

## Definition of Done

- [ ] All four user scenarios covered by tests
- [ ] All tests pass with `vitest`
- [ ] Tests use `await Promise.resolve()` for async timing
- [ ] Tests use `vi.fn()` for handler mocks
- [ ] No test TODOs or skipped tests

## Files Modified

| File | Action |
|------|--------|
| `src/shared/lib/event-bus.test.ts` | Create |

## Async Timing Note

Use `await Promise.resolve()` to flush the microtask queue:

```typescript
// Good
bus.publish(event);
await Promise.resolve();
expect(handler).toHaveBeenCalled();

// Bad - race condition
bus.publish(event);
expect(handler).toHaveBeenCalled(); // May pass or fail!
```

## Reviewer Guidance

- Verify each user scenario has at least one test
- Verify `await Promise.resolve()` is used before assertions on handler calls
- Verify unsubscribe test actually calls unsubscribe before second publish

## Next Command

After WP02 completes, run:
```bash
spec-kitty implement WP03
```

## Activity Log

- 2026-04-09T12:58:11Z – kilo:kilo-auto/balanced:implementer:implementer – shell_pid=83516 – Started implementation via action command
- 2026-04-09T13:03:13Z – kilo:kilo-auto/balanced:implementer:implementer – shell_pid=83516 – Ready for review: 12 tests passing
