import { describe, it, expect, vi } from 'vitest'
import { EventBus } from './event-bus'
import type { DomainEvent } from './event-bus'

export interface ItemAddedToCart extends DomainEvent {
  type: 'ItemAddedToCart';
  payload: {
    skuId: string;
    quantity: number;
  };
}

export interface CheckoutInitiated extends DomainEvent {
  type: 'CheckoutInitiated';
  payload: {
    orderId: string;
  };
}

describe('EventBus', () => {
  describe('subscribe and publish', () => {
    it('calls handler after publish', async () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.subscribe('ItemAddedToCart', handler);
      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 2 },
      });

      await Promise.resolve();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('passes correct event payload to handler', async () => {
      const bus = new EventBus();
      const handler = vi.fn();
      const event = {
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 2 },
      };

      bus.subscribe('ItemAddedToCart', handler);
      bus.publish(event);

      await Promise.resolve();

      expect(handler).toHaveBeenCalledWith(event);
    });
  });

  describe('multiple handlers', () => {
    it('calls all handlers subscribed to the same event', async () => {
      const bus = new EventBus();
      const handlerA = vi.fn();
      const handlerB = vi.fn();

      bus.subscribe('CheckoutInitiated', handlerA);
      bus.subscribe('CheckoutInitiated', handlerB);
      bus.publish({
        type: 'CheckoutInitiated',
        payload: { orderId: 'ORD-123' },
      });

      await Promise.resolve();

      expect(handlerA).toHaveBeenCalledTimes(1);
      expect(handlerB).toHaveBeenCalledTimes(1);
    });

    it('both handlers receive the same event', async () => {
      const bus = new EventBus();
      const handlerA = vi.fn();
      const handlerB = vi.fn();
      const event = {
        type: 'CheckoutInitiated',
        payload: { orderId: 'ORD-123' },
      };

      bus.subscribe('CheckoutInitiated', handlerA);
      bus.subscribe('CheckoutInitiated', handlerB);
      bus.publish(event);

      await Promise.resolve();

      expect(handlerA).toHaveBeenCalledWith(event);
      expect(handlerB).toHaveBeenCalledWith(event);
    });
  });

  describe('unsubscribe', () => {
    it('stops calling handler after unsubscribe', async () => {
      const bus = new EventBus();
      const handler = vi.fn();

      const unsubscribe = bus.subscribe('ItemAddedToCart', handler);
      unsubscribe();

      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      await Promise.resolve();

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not throw when publishing after unsubscribe', async () => {
      const bus = new EventBus();
      const handler = vi.fn();

      const unsubscribe = bus.subscribe('ItemAddedToCart', handler);
      unsubscribe();

      expect(() => {
        bus.publish({
          type: 'ItemAddedToCart',
          payload: { skuId: 'SKU-1', quantity: 1 },
        });
      }).not.toThrow();
    });

    it('other handlers still work after unsubscribe', async () => {
      const bus = new EventBus();
      const handlerA = vi.fn();
      const handlerB = vi.fn();

      const unsubscribeA = bus.subscribe('ItemAddedToCart', handlerA);
      bus.subscribe('ItemAddedToCart', handlerB);

      unsubscribeA();

      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      await Promise.resolve();

      expect(handlerA).not.toHaveBeenCalled();
      expect(handlerB).toHaveBeenCalledTimes(1);
    });
  });

  describe('async non-blocking dispatch', () => {
    it('handler is not called immediately after publish', () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.subscribe('ItemAddedToCart', handler);
      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it('handler is called after Promise.resolve()', async () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.subscribe('ItemAddedToCart', handler);
      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      await Promise.resolve();

      expect(handler).toHaveBeenCalled();
    });

    it('publish returns synchronously', () => {
      const bus = new EventBus();
      const handler = vi.fn();
      bus.subscribe('ItemAddedToCart', handler);

      const result = bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      expect(result).toBeUndefined();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('error isolation', () => {
    it('handler B executes when handler A throws', async () => {
      const bus = new EventBus();
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();

      bus.subscribe('ItemAddedToCart', errorHandler);
      bus.subscribe('ItemAddedToCart', normalHandler);
      bus.publish({
        type: 'ItemAddedToCart',
        payload: { skuId: 'SKU-1', quantity: 1 },
      });

      await Promise.resolve();

      expect(errorHandler).toHaveBeenCalled();
      expect(normalHandler).toHaveBeenCalled();
    });

    it('publish does not throw when handler throws', () => {
      const bus = new EventBus();
      bus.subscribe('ItemAddedToCart', () => {
        throw new Error('Handler error');
      });

      expect(() => {
        bus.publish({
          type: 'ItemAddedToCart',
          payload: { skuId: 'SKU-1', quantity: 1 },
        });
      }).not.toThrow();
    });
  });
});
