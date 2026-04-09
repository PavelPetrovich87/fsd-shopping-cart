# Specification: Async Domain Event Bus

**Mission**: 002-async-domain-event-bus  
**Type**: software-dev  
**Layer**: shared/lib  
**Created**: 2026-04-09

---

## Overview

Implement a typed, async Pub/Sub event bus for the shopping cart application. This infrastructure component enables domain entities to emit events that other parts of the system can react to, promoting loose coupling between features and entities.

---

## Purpose & Motivation

The shopping cart domain generates events like `ItemAddedToCart`, `CartCleared`, `CheckoutInitiated`, and `StockReserved`. Rather than coupling producers directly to consumers, an event bus allows any subscriber to react to these events independently.

Benefits:
- **Decoupling**: Entities emit events without knowing who consumes them
- **Extensibility**: New handlers can subscribe without modifying event producers
- **Testability**: Handlers can be tested in isolation or mocked for integration tests

---

## Key Entities

### Event Bus

The central dispatcher that manages subscriptions and routes events to matching handlers.

| Responsibility | Behavior |
|----------------|----------|
| Register handlers | `subscribe<T>(eventType, handler)` returns an unsubscribe function |
| Dispatch events | `publish(event)` invokes all handlers for the event's type asynchronously |
| Type safety | Generic typing ensures handlers receive correctly typed events |

### Event Types

Domain events are plain objects with at least a `type` string identifying the event kind:

```typescript
interface DomainEvent {
  type: string;
}
```

Domain-specific events extend this interface:

```typescript
interface ItemAddedToCart extends DomainEvent {
  type: 'ItemAddedToCart';
  payload: {
    skuId: string;
    quantity: number;
  };
}
```

---

## User Scenarios & Testing

### Scenario: Single Handler Subscription

1. A feature registers a handler for `ItemAddedToCart` events
2. The handler receives the event payload when items are added
3. Handler is invoked asynchronously (non-blocking)

### Scenario: Multiple Handlers Per Event

1. Two separate features subscribe to the same `CheckoutInitiated` event
2. When checkout is initiated, both handlers execute (order not guaranteed)
3. Both handlers receive the same event payload

### Scenario: Unsubscribe

1. A handler registers for an event
2. The unsubscribe function is called
3. Subsequent `publish` calls no longer invoke the unsubscribed handler
4. Memory is cleaned up properly

### Scenario: Async Execution

1. A handler registers for an event
2. `publish` returns immediately (non-blocking)
3. Handler executes after current call stack clears (via `Promise` or `setTimeout(0)`)

---

## Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | `eventBus.subscribe<T>(eventType, handler)` registers a typed handler for the given event type and returns an unsubscribe function | pending |
| FR-002 | `eventBus.publish(event)` invokes all handlers registered for the event's type asynchronously | pending |
| FR-003 | Multiple handlers can be registered for the same event type | pending |
| FR-004 | Calling the unsubscribe function removes that handler from future dispatches | pending |
| FR-005 | Handlers receive events matching their subscribed type | pending |

---

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | Memory safety | No handlers retained after unsubscribe | pending |
| NFR-002 | Async dispatch | `publish()` returns before handlers execute | pending |
| NFR-003 | Type safety | TypeScript compilation with strict mode, no `any` types | pending |

---

## Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | No external dependencies beyond TypeScript | pending |
| C-002 | Must work in browser environment (no Node.js APIs) | pending |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/shared/lib/event-bus.ts` | EventBus class implementation |
| `src/shared/lib/event-bus.test.ts` | Unit tests |
| `src/shared/lib/index.ts` | Re-export EventBus |

---

## Success Criteria

1. **Typed subscriptions**: TypeScript enforces correct event types at compile time
2. **Async dispatch**: Publishing never blocks the caller
3. **Clean unsubscription**: Calling unsubscribe prevents future handler invocations
4. **Multi-handler support**: Multiple subscribers receive events for the same type
5. **Unit test coverage**: All scenarios tested with passing assertions

---

## Dependencies

None. This is a Tier 1 shared utility with no dependencies on other tickets.

---

## Assumptions

- Events are fire-and-forget; handlers do not return values to the publisher
- Handler errors do not prevent other handlers from executing (best-effort)
- Event bus is a singleton or dependency-injected instance (not specified)
