# Implementation Plan: Cart Aggregate & CartItem Entity

**Branch**: `main → main` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)  
**Mission**: `006-cart-aggregate-entity`  
**Ticket**: T-004

## Summary

Implement the Cart aggregate root and CartItem entity following FSD architecture. Cart manages items keyed by SKU, enforces quantity ≥ 1 invariant, supports one coupon (extensible), and emits domain events via result tuples.

**Event Pattern**: Each mutation returns `{ cart: Cart, events: DomainEvent[] }` tuple.

---

## Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | TypeScript 5.9 |
| **Framework** | React 19 (used via imports only; pure domain logic) |
| **Money VO** | `src/shared/lib/money.ts` (T-001) |
| **Event Bus** | `src/shared/lib/event-bus.ts` (T-002) — used by calling code, not Cart itself |
| **Testing** | Vitest (project standard) |
| **Architecture** | Feature-Sliced Design (FSD) |
| **Target Platform** | Web (React SPA) |

---

## Project Structure

### Source Code (FSD)

```
src/
└── entities/
    └── cart/
        ├── model/
        │   ├── cart.ts           # Cart aggregate root
        │   ├── cart-item.ts      # CartItem entity
        │   ├── types.ts          # CartState enum, CartItem type
        │   ├── events.ts         # Domain event types
        │   └── cart.test.ts      # Unit tests
        ├── ui/                   # (future: T-013)
        ├── api/                  # (future: T-009 Zustand repo)
        └── index.ts              # Public API
```

### Test Fixtures

Tests use `Money` from `@/shared/lib` with mocked data for CartItem inputs.

---

## Implementation Approach

### Phase 1: Types & Events

1. **types.ts**: Define `CartState` enum (`Active`, `Checkout_Pending`, `Checked_Out`)
2. **events.ts**: Define domain event interfaces (`ItemAddedToCart`, `CartItemQuantityChanged`, etc.)

### Phase 2: CartItem Entity

1. Create `CartItem` class with immutable fields
2. Methods for quantity changes (return new instance)
3. `totalPrice` computed property using Money

### Phase 3: Cart Aggregate

1. **Immutable state**: Private constructor, factory methods
2. **Item operations**: `addItem`, `removeItem`, `changeQuantity`
3. **Coupon**: Single coupon code field
4. **Subtotal**: Computed from CartItem totals using Money
5. **State transitions**: `initiateCheckout`, `markCheckedOut`
6. **Event emission**: All mutations return `{ cart, events }` tuple

### Phase 4: Unit Tests

Cover all scenarios from spec:
- Happy path for each operation
- Quantity ≥ 1 enforcement
- State transition validation
- Duplicate SKU increment
- Event emission verification

---

## Design Decisions

| Decision | Rationale |
|----------|----------|
| Return `{ cart, events }` tuple | Explicit event handling; Cart stays pure without dependencies |
| Immutable Cart instances | Follows functional patterns; easier testing and debugging |
| Single coupon (extensible) | Simple now, designed for multi-coupon future |

---

## Success Criteria

- [ ] All 10 user scenarios have passing tests
- [ ] Quantity ≥ 1 invariant enforced
- [ ] State transitions validated
- [ ] Events returned with each mutation
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
