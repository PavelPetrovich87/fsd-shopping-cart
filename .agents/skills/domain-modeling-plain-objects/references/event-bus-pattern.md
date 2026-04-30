# Event Bus Pattern

The EventBus provides asynchronous pub/sub for domain events without coupling the domain layer to side effects.

## DomainEvent Interface

```typescript
export interface DomainEvent {
  eventType: string
}
```

## EventBus API

```typescript
export type Handler<T extends DomainEvent = DomainEvent> = (event: T) => void
export type Unsubscribe = () => void

export class EventBus {
  subscribe<T extends DomainEvent>(
    eventType: T['eventType'],
    handler: Handler<T>,
  ): Unsubscribe
  publish<T extends DomainEvent>(event: T): void
}
```

- `subscribe` returns an `Unsubscribe` function
- `publish` schedules handlers via `Promise.resolve()` (microtask) so the domain function remains synchronous
- Handlers are grouped by `eventType`

## Usage in Orchestrator Layer

The `features/` layer subscribes to domain events and routes them to analytics, notifications, or dependent recalculations:

```typescript
const unsubscribe = eventBus.subscribe('ItemAddedToCart', (event) => {
  analytics.track('item_added', event.payload)
})
```

## Live Implementation

See `src/shared/lib/event-bus.ts` for the project's live implementation.
