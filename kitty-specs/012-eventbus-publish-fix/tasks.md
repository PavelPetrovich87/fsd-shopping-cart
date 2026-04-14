# Tasks: 012-eventbus-publish-fix

**Mission**: 012-eventbus-publish-fix | **Feature dir**: `kitty-specs/012-eventbus-publish-fix`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Subtask Index

| ID | Description | WP | Parallel | Implementation |
|----|-------------|----|----------|----------------|
| T001 | Update `DomainEvent` interface: `type: string` → `eventType: string` | WP01 | [P] | |
| T002 | Update `EventBus.subscribe()`: use `eventType` for handler registration | WP01 | [P] | |
| T003 | Update `EventBus.publish()`: use `event.eventType` for handler lookup | WP01 | [P] | |
| T004 | Update error log message in `publish()`: use `event.eventType` | WP01 | [P] | |
| T005 | Update `event-bus.test.ts` fixtures: `type` → `eventType` | WP01 | [P] | |
| T006 | Update product domain events: `type` → `eventType`, flatten `payload`, add `occurredAt` | WP02 | [P] | |
| T007 | Update coupon domain events: `type` → `eventType`, `timestamp` → `occurredAt` | WP02 | [P] | |
| T008 | Remove `as unknown as { type: string }` casts from AddToCart, RemoveFromCart, ChangeQuantity | WP03 | [P] | |
| T009 | Update cart-action tests: assert `eventBus.publish` is called with correct event structure | WP03 | [P] | |
| T010 | Run quality gates: `npm run lint`, `npm run lint:arch`, `npm run build` — all must exit 0 | WP03 | | After all other tasks |

## Work Packages

---

### WP01: EventBus Core Fix

**Summary**: Fix the `DomainEvent` interface and `EventBus` implementation to use `eventType` instead of `type`. Update the subscribe/publish methods and error logging accordingly. Update test fixtures.

**Priority**: P0 (critical path — all other work depends on correct EventBus)

**Test criteria**: `npm run test:unit` passes for `event-bus.test.ts` after changes

**Included subtasks**:
- [ ] T001: Update `DomainEvent` interface: `type: string` → `eventType: string`
- [ ] T002: Update `EventBus.subscribe()`: use `eventType` for handler registration
- [ ] T003: Update `EventBus.publish()`: use `event.eventType` for handler lookup
- [ ] T004: Update error log message in `publish()`: use `event.eventType`
- [ ] T005: Update `event-bus.test.ts` fixtures: `type` → `eventType`

**Prompt**: `kitty-specs/012-eventbus-publish-fix/tasks/WP01-eventbus-core-fix.md`

**Parallel opportunities**: All 5 subtasks can be implemented in parallel since they touch different concerns of the same file

**Dependencies**: None

**Risks**: Changing the interface signature is the root cause fix — must be done first before domain events are updated

---

### WP02: Domain Events Alignment

**Summary**: Update product and coupon domain events to use `eventType` (consistent with EventBus contract) and `occurredAt` (consistent with cart events). Flatten product event payload structure.

**Priority**: P1 (depends on WP01 — EventBus must be fixed first)

**Test criteria**: TypeScript compiles without errors after product + coupon events updated

**Included subtasks**:
- [ ] T006: Update product domain events: `type` → `eventType`, flatten `payload`, add `occurredAt`
- [ ] T007: Update coupon domain events: `type` → `eventType`, `timestamp` → `occurredAt`

**Prompt**: `kitty-specs/012-eventbus-publish-fix/tasks/WP02-domain-events-alignment.md`

**Parallel opportunities**: T006 and T007 are independent (different files)

**Dependencies**: WP01 (EventBus must use `eventType` before domain events can use it correctly)

**Risks**: Product event flattening is a structural change — must ensure all consumers of `StockReserved`, `StockReleased`, `StockDepleted` are updated (currently none exist)

---

### WP03: Cart-Actions Fixes + Verification

**Summary**: Remove unsafe type casts from cart-actions use cases, update tests to verify `eventBus.publish` is called correctly, run all quality gates.

**Priority**: P1 (depends on WP01)

**Test criteria**: All tests pass including new event delivery assertions

**Included subtasks**:
- [ ] T008: Remove casts from AddToCart, RemoveFromCart, ChangeQuantity
- [ ] T009: Update cart-action tests: verify `eventBus.publish` is called with correct event structure
- [ ] T010: Run quality gates: `npm run lint`, `npm run lint:arch`, `npm run build`

**Prompt**: `kitty-specs/012-eventbus-publish-fix/tasks/WP03-cart-actions-fixes.md`

**Parallel opportunities**: T008 and T009 are independent (different files) but T010 must run last

**Dependencies**: WP01 (casts cannot be safely removed until EventBus uses `eventType`)

**Risks**: Tests currently only check `result.event` is populated — must be updated to verify the handler was actually called via `eventBus.publish`

---

## Size Distribution

| WP | Subtasks | Est. Lines |
|----|----------|------------|
| WP01 | 5 | ~350 |
| WP02 | 2 | ~250 |
| WP03 | 3 | ~300 |
| **Total** | **10** | **~900** |

✓ All WPs within ideal range (3-7 subtasks, <700 lines)
