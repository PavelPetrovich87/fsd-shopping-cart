# Implementation Plan: Async Domain Event Bus

**Mission**: 002-async-domain-event-bus  
**Layer**: `shared/lib`  
**Generated**: 2026-04-09

---

## Branch Contract

- Current branch at workflow start: `main`
- Planning/base branch for this feature: `main`
- Completed changes must merge into: `main`

---

## Technical Context

### Feature Overview

Typed, async Pub/Sub event bus implemented as a dependency-injectable class. Domain entities emit events; consumers subscribe to react to them.

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Instance model | Dependency Injection (DI) | Consumers create own instances; better testability than singleton |
| Async execution | `Promise` microtask queue | Browser-compatible, non-blocking dispatch |
| Type safety | Generics with `DomainEvent` base | Compile-time enforcement of event types |
| Unsubscribe | Function reference | Closure-based cleanup; no memory leaks |
| Handler isolation | Best-effort dispatch | One handler error does not block others |

### Event Bus API

```typescript
class EventBus {
  subscribe<T extends DomainEvent>(
    eventType: T['type'],
    handler: (event: T) => void
  ): () => void;

  publish<T extends DomainEvent>(event: T): void;
}
```

### Usage Pattern (DI)

```typescript
// Feature creates its own bus instance
const eventBus = new EventBus();

// Subscribe
const unsubscribe = eventBus.subscribe('ItemAddedToCart', (event) => {
  // event is typed as ItemAddedToCart
});

// Unsubscribe when done
unsubscribe();

// Publish
eventBus.publish({ type: 'ItemAddedToCart', payload: { skuId: 'SKU-1', quantity: 2 } });
```

---

## Charter Check

**Status**: No charter file found (`.kittify/charter/charter.md` does not exist).  
**Decision**: Proceed without charter governance for this Tier 1 infrastructure ticket.

---

## GATES

| Gate | Status | Notes |
|------|--------|-------|
| Spec exists | PASS | `kitty-specs/002-async-domain-event-bus/spec.md` |
| Branch matches target | PASS | Both `main` |
| Dependencies resolved | PASS | No dependencies |
| User intent confirmed | PASS | DI approach selected |
| Clarifications resolved | PASS | All NFRs/constraints satisfied by spec |

---

## Phase 0: Research

**Output**: `research.md`

No external research required. The event bus pattern is well-understood, browser-compatible APIs are specified, and no third-party libraries are involved.

---

## Phase 1: Design & Contracts

### Generated Artifacts

| Artifact | Path |
|----------|------|
| Data Model | `kitty-specs/002-async-domain-event-bus/data-model.md` |
| Quickstart | `kitty-specs/002-async-domain-event-bus/quickstart.md` |
| Agent Context | Skipped (`.kilo/agent/` does not exist) |

### Implementation Tasks

1. **Implement EventBus class** (`src/shared/lib/event-bus.ts`)
   - Generic `subscribe<T>` method with unsubscribe function
   - `publish<T>` method with async dispatch via `Promise.resolve().then()`
   - Internal `Map<string, Set<Handler>>` for subscription storage
   - Error-safe handler invocation (try/catch per handler)

2. **Export EventBus** (`src/shared/lib/index.ts`)
   - Re-export `EventBus` as public API

3. **Write unit tests** (`src/shared/lib/event-bus.test.ts`)
   - Single handler subscription
   - Multiple handlers per event
   - Unsubscribe cleanup
   - Async non-blocking dispatch
   - Type safety verification (compile-time)

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/shared/lib/event-bus.ts` | Create |
| `src/shared/lib/event-bus.test.ts` | Create |
| `src/shared/lib/index.ts` | Modify (add re-export) |

---

## Success Criteria

1. `EventBus.subscribe()` returns a function that removes the handler
2. `EventBus.publish()` dispatches asynchronously without blocking
3. Multiple handlers receive events for the same type
4. Unsubscribed handlers are not invoked on subsequent publishes
5. TypeScript compiles without errors in strict mode
6. All unit tests pass

---

## Next Step

Run `/spec-kitty.tasks` to generate work packages.
