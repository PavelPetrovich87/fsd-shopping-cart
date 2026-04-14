# 012-eventbus-publish-fix

## 1. Overview

### Name
EventBus Publish Fix

### Type
Bug Fix (software-dev)

### Summary
Fix a critical bug where cart domain events are silently dropped at runtime. The `EventBus` interface uses `type: string` for handler lookup, but cart domain events use `eventType: string`. Additionally, align all domain event definitions (cart, product, coupon) to use a consistent `eventType` property so the EventBus can dispatch events correctly across all entity domains.

### Root Cause
The `EventBus` class (`shared/lib/event-bus.ts`) looks up handlers via `this.handlers.get(event.type)` (line 29), but cart events (`entities/cart/model/events.ts`) define `eventType` (not `type`). TypeScript type casts (`as unknown as { type: string }`) silence compile-time errors, leaving `event.type` as `undefined` at runtime. The handler lookup always returns `undefined` and no subscribers are ever called.

### Resolution
Adopt Option 1 from the ticket: fix `EventBus` to use `eventType`, and update all domain event definitions (product, coupon) to use the same `eventType` field for consistency. This creates a uniform event contract across all entity domains.

---

## 2. User Scenarios & Testing

### Scenario: Cart event delivery verification
**Given** a subscriber has registered for `ItemAddedToCart` events on the EventBus  
**When** `AddToCart` use case publishes an `ItemAddedToCart` event  
**Then** the subscriber's handler is invoked with the correct event payload

### Scenario: All three cart actions emit deliverable events
**Given** the EventBus has subscribers for `ItemAddedToCart`, `ItemRemovedFromCart`, and `CartItemQuantityChanged`  
**When** the `AddToCart`, `RemoveFromCart`, and `ChangeCartItemQuantity` use cases each publish their respective events  
**Then** all three subscribers are invoked with correct payloads

### Scenario: Product and coupon events are also deliverable
**Given** future subscribers will register for `StockReserved` and `CouponApplied` events  
**When** those events are published through the EventBus  
**Then** the correct subscribers are invoked (no regressions as no subscribers currently exist)

### Scenario: Existing EventBus tests still pass
**Given** the EventBus has existing unit tests  
**When** the `DomainEvent` interface is changed from `type` to `eventType`  
**Then** all existing EventBus tests continue to pass (after updating event fixtures to use `eventType`)

---

## 3. Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-001 | `EventBus.DomainEvent` interface uses `eventType: string` instead of `type: string` | pending |
| FR-002 | `EventBus.subscribe()` uses `eventType` for handler registration | pending |
| FR-003 | `EventBus.publish()` uses `event.eventType` for handler lookup | pending |
| FR-004 | Cart domain events (`ItemAddedToCart`, `ItemRemovedFromCart`, `CartItemQuantityChanged`, `CartCleared`) — no structural changes needed (already use `eventType`) | pending |
| FR-005 | Product domain events (`StockReserved`, `StockReleased`, `StockDepleted`) updated to use `eventType` field | pending |
| FR-006 | Coupon domain events (`CouponValidated`, `CouponValidationFailed`, `DiscountCalculated`) updated to use `eventType` field | pending |
| FR-007 | All `eventBus.publish()` calls in `features/cart-actions/` removed of unsafe type casts | pending |
| FR-008 | Unit tests for cart-actions use cases verify `eventBus.publish` is called with correct event structure | pending |
| FR-009 | All `npm run lint`, `npm run lint:arch`, `npm run build` pass | pending |

---

## 4. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | Zero type casts that defeat TypeScript's type checking | 0 casts of form `as unknown as` | pending |

---

## 5. Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | All domain event definitions must use `eventType` (not `type`) for EventBus compatibility | pending |
| C-002 | No breaking changes to event payload structure (fields remain the same, only the discriminant key changes) | pending |
| C-003 | Product event payload structure should be flattened for consistency with cart events (no nested `payload` object) | pending |

---

## 6. Success Criteria

1. **Events are delivered**: Events published by `AddToCart`, `RemoveFromCart`, and `ChangeCartItemQuantity` are actually delivered to their respective subscribers — verified by unit tests that assert `eventBus.publish` is called with correct arguments
2. **No silent failures**: Handler lookup never returns `undefined` due to a missing property
3. **Consistent event contract**: All entity domains (cart, product, coupon) use `eventType` as the EventBus discriminant
4. **Zero unsafe casts**: No `as unknown as` type casts remain in the codebase
5. **All quality gates pass**: `lint`, `lint:arch`, and `build` all exit 0

---

## 7. Key Entities

### EventBus
- **File**: `src/shared/lib/event-bus.ts`
- **Change**: `DomainEvent.type` → `DomainEvent.eventType`
- **Impact**: All publish/subscribe calls updated

### Cart Domain Events
- **Files**: `src/entities/cart/model/events.ts`
- **Change**: Already uses `eventType` — no structural change needed
- **Impact**: Casts in `features/cart-actions/` must be removed

### Product Domain Events
- **File**: `src/entities/product/model/events.ts`
- **Change**: `type` → `eventType`, flatten `payload` into top-level fields, add `occurredAt`
- **Events**: `StockReserved`, `StockReleased`, `StockDepleted`

### Coupon Domain Events
- **File**: `src/entities/coupon/model/events.ts`
- **Change**: `type` → `eventType`, rename `timestamp` → `occurredAt` for consistency
- **Events**: `CouponValidated`, `CouponValidationFailed`, `DiscountCalculated`

### Cart Actions
- **Files**: `src/features/cart-actions/model/add-to-cart.ts`, `remove-from-cart.ts`, `change-quantity.ts`
- **Change**: Remove `as unknown as { type: string }` casts

---

## 8. Files to Modify

### `src/shared/lib/event-bus.ts`
- Change `DomainEvent.type` to `DomainEvent.eventType`
- Update `subscribe` and `publish` to use `eventType`
- Update error log message

### `src/entities/product/model/events.ts`
- Change `type` to `eventType` on all events
- Flatten `payload` into top-level fields
- Add `occurredAt: Date` field

### `src/entities/coupon/model/events.ts`
- Change `type` to `eventType` on all events
- Rename `timestamp` to `occurredAt`

### `src/features/cart-actions/model/add-to-cart.ts`
- Remove `as unknown as { type: string }` cast on line 89

### `src/features/cart-actions/model/remove-from-cart.ts`
- Remove `as unknown as { type: string }` cast on line 53

### `src/features/cart-actions/model/change-quantity.ts`
- Remove `as unknown as { type: string }` cast on line 101

### `src/shared/lib/event-bus.test.ts`
- Update test fixtures to use `eventType` instead of `type`

### `src/features/cart-actions/model/add-to-cart.test.ts`
- Update to verify `eventBus.publish` is called with correct event structure

### `src/features/cart-actions/model/remove-from-cart.test.ts`
- Update to verify `eventBus.publish` is called with correct event structure

### `src/features/cart-actions/model/change-quantity.test.ts`
- Update to verify `eventBus.publish` is called with correct event structure

---

## 9. Assumptions

- No subscribers currently exist for any domain events (confirmed by grep search) — safe to change `type` to `eventType` without breaking existing handler registrations
- Product events intentionally use a nested `payload` structure different from cart events — flattening is a non-breaking structural improvement for consistency
- The `EventBus.test.ts` file exists and needs its test fixtures updated (standard for this project)

---

## 10. Dependencies

- **Depends on**: T-011 (Cart Actions Feature) — must be fully merged before this work begins
- **Blocking**: T-013 (Apply Coupon), T-014 (Checkout) — both depend on EventBus.publish working correctly
