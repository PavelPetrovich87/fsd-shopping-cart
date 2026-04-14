export interface DomainEvent {
  eventType: string;
}

export type Handler<T extends DomainEvent = DomainEvent> = (event: T) => void;

export type Unsubscribe = () => void;

export class EventBus {
  private handlers = new Map<string, Set<Handler>>();

  subscribe<T extends DomainEvent>(eventType: T['eventType'], handler: Handler<T>): Unsubscribe {
    const handlers = this.handlers.get(eventType) ?? new Set();
    handlers.add(handler as Handler);
    this.handlers.set(eventType, handlers);

    return () => {
      const set = this.handlers.get(eventType);
      if (set) {
        set.delete(handler as Handler);
        if (set.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  publish<T extends DomainEvent>(event: T): void {
    const handlers = this.handlers.get(event.eventType);
    if (!handlers || handlers.size === 0) {
      return;
    }

    Promise.resolve().then(() => {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventBus] Handler error for event "${event.eventType}":`, error);
        }
      }
    });
  }
}
