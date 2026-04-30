---
name: domain-modeling-plain-objects
description: Domain modeling with Plain Objects, Factory Functions, Immutable Transitions, and Event Tuples. Covers the EventBus pattern and Ports & Adapters repository pattern. Use when editing files in src/entities/ or src/features/**/model/.
---

# Domain Modeling with Plain Objects

## When to Use

- `src/entities/**/*.ts`
- `src/features/**/model/**/*.ts`
- `src/entities/**/api/**` (for Ports & Adapters reference)

## Pattern 1: Plain Objects + Factory Functions

Domain aggregates, entities, and value objects MUST use the **Factory Functions + Plain Objects** pattern. ES6 classes are forbidden in these locations.

```typescript
// 1. State — plain interface, all readonly
export interface Cart {
  readonly id: string
  readonly items: readonly CartItem[]
  readonly status: 'active' | 'checkout_pending' | 'checked_out'
}

// 2. Factory — pure function, validates invariants, returns plain object
export function createCart(id: string): Cart {
  return { id, items: [], status: 'active' }
}

// 3. Behavior — pure function, takes state, returns NEW state
export function addItem(cart: Cart, item: CartItem): Cart {
  return { ...cart, items: [...cart.items, item] }
}
```

**Why:** Plain objects are natively serializable (JSON, structuredClone), work with React state without wrapper hacks, and are transparent to devtools.

**Anti-patterns:**

```typescript
// ❌ class declaration in entities/
export class Cart { ... }

// ❌ this-mutation
this.items.push(item)

// ❌ method call on instance
cart.addItem(item)
```

**Scope:** `src/entities/**/*.ts`, `src/features/**/model/**/*.ts`

**Out of scope:** `shared/lib/` (Value Objects like `Money` may use classes — preferred plain, but not enforced by linter).

## Pattern 2: Immutable State Transitions

Behavioral functions MUST return a new object. Direct mutation of input state is forbidden.

```typescript
// ❌ Violation: mutating input
export function addItem(cart: Cart, item: CartItem): Cart {
  cart.items.push(item) // mutation!
  return cart
}

// ✅ Correct: new object
export function addItem(cart: Cart, item: CartItem): Cart {
  return { ...cart, items: [...cart.items, item] }
}
```

## Pattern 3: Events as Data, Not Effects

Domain functions must not produce side effects. No calling callbacks, emitting events, dispatching actions, or reaching for external systems.

Instead, a state-changing function returns a **tuple**: new state + an array of domain events (plain objects describing what happened).

```typescript
// ❌ Violation: domain function triggers side effects
export function addItem(cart: Cart, item: CartItem, onAdd: () => void): Cart {
  onAdd() // callback = side effect
  bus.emit('ItemAdded', item) // event emitter = side effect
  return { ...cart, items: [...cart.items, item] }
}

// ✅ Correct: domain function returns facts, caller decides what to do with them
export function addItem(cart: Cart, item: CartItem): [Cart, CartEvent[]] {
  const newCart = { ...cart, items: [...cart.items, item] }
  return [newCart, [{ type: 'ItemAddedToCart', payload: { itemId: item.id } }]]
}
```

**Banned patterns** (any of these in domain files = violation):

- `.emit()`, `.dispatch()`, `.publish()`, `.notify()`, `.fire()`, `.trigger()`
- `.subscribe()`, `.on()`, `.addEventListener()`
- `new EventEmitter()`, `new EventTarget()`
- Invoking callback parameters (`onSuccess()`, `onChange()`, etc.)
- Direct `fetch` / HTTP calls

**Why:** The domain layer is a pure calculator — it computes new state and records facts. The `features/` orchestrator layer saves state to the store and routes events to whoever cares.

**Scope:** `src/entities/**/*.ts`, `src/features/**/model/**/*.ts`

## References

- [Event Bus Pattern](./references/event-bus-pattern.md) — Async pub/sub for routing domain events
- [Ports & Adapters](./references/ports-and-adapters.md) — Repository pattern for domain boundaries
- [ESLint Domain Rules](./references/eslint-domain-rules.md) — Linter configuration for class ban
