# Quickstart: Async Domain Event Bus

## Installation

No installation required. This is a pure TypeScript library in `src/shared/lib/`.

## Basic Usage

```typescript
import { EventBus } from '@/shared/lib';

// Create an instance (DI pattern)
const eventBus = new EventBus();

// Define event types
interface ItemAddedToCart {
  type: 'ItemAddedToCart';
  payload: {
    skuId: string;
    quantity: number;
  };
}

// Subscribe
const unsubscribe = eventBus.subscribe<ItemAddedToCart>(
  'ItemAddedToCart',
  (event) => {
    console.log(`Added ${event.payload.quantity}x ${event.payload.skuId}`);
  }
);

// Publish an event
eventBus.publish<ItemAddedToCart>({
  type: 'ItemAddedToCart',
  payload: { skuId: 'SKU-001', quantity: 2 }
});

// Unsubscribe when done
unsubscribe();
```

## With Multiple Handlers

```typescript
const bus = new EventBus();

// Handler 1
const unsub1 = bus.subscribe('CheckoutInitiated', (event) => {
  console.log('Analytics: checkout started');
});

// Handler 2
const unsub2 = bus.subscribe('CheckoutInitiated', (event) => {
  console.log('Email: sending confirmation');
});

// Both handlers fire on publish
bus.publish({ type: 'CheckoutInitiated', payload: { orderId: 'ORD-123' } });
```

## Testing Pattern

```typescript
import { EventBus } from '@/shared/lib';
import { describe, it, expect, vi } from 'vitest';

describe('EventBus', () => {
  it('dispatches events to handlers', async () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.subscribe<ItemAddedToCart>('ItemAddedToCart', handler);
    bus.publish<ItemAddedToCart>({
      type: 'ItemAddedToCart',
      payload: { skuId: 'SKU-1', quantity: 1 },
    });

    // Wait for async dispatch
    await Promise.resolve();

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      })
    );
  });
});
```

## Export

```typescript
// src/shared/lib/index.ts
export { EventBus } from './event-bus';
export type { DomainEvent } from './event-bus';
```
