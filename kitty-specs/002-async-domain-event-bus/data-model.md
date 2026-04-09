# Data Model: Async Domain Event Bus

## Entities

### DomainEvent (Interface)

Base interface for all domain events.

```typescript
interface DomainEvent {
  type: string;
}
```

### ItemAddedToCart (Example Event)

Domain event emitted when an item is added to the cart.

```typescript
interface ItemAddedToCart extends DomainEvent {
  type: 'ItemAddedToCart';
  payload: {
    skuId: string;
    quantity: number;
  };
}
```

### EventBus (Class)

Central dispatcher managing subscriptions and routing events.

```typescript
class EventBus {
  subscribe<T extends DomainEvent>(
    eventType: T['type'],
    handler: (event: T) => void
  ): () => void;

  publish<T extends DomainEvent>(event: T): void;
}
```

### Subscription (Internal)

```typescript
type Handler<T extends DomainEvent = DomainEvent> = (event: T) => void;
type Unsubscribe = () => void;
```

## Relationships

- `EventBus` manages zero-to-many `Handler` registrations per event `type`
- Each `subscribe()` call returns an `Unsubscribe` function
- `publish()` reads handlers from internal storage and invokes them asynchronously

## State

| State | Type | Description |
|-------|------|-------------|
| `handlers` | `Map<string, Set<Handler>>` | Event type → Set of handlers |
| `subscriptions` | `Set<Handler>` | All registered handlers (for iteration) |

## Constraints

- Browser-compatible (no Node.js APIs)
- No external dependencies (pure TypeScript)
- Strict mode TypeScript, no `any` types
