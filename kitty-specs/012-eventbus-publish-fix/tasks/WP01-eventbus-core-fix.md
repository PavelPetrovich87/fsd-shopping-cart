---
work_package_id: WP01
title: EventBus Core Fix
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
history: []
authoritative_surface: src/shared/lib/
execution_mode: code_change
owned_files:
- src/shared/lib/event-bus.ts
- src/shared/lib/event-bus.test.ts
tags: []
---

# WP01: EventBus Core Fix

## Objective

Fix the `DomainEvent` interface and `EventBus` class to use `eventType` instead of `type` for handler registration and lookup. This is the root cause fix for the critical bug where cart domain events are silently dropped at runtime.

## Context

The `EventBus` class in `src/shared/lib/event-bus.ts` looks up handlers via `this.handlers.get(event.type)` but cart events use `eventType` (not `type`). TypeScript type casts silence compile-time errors but leave `event.type` as `undefined` at runtime, so handler lookup always returns `undefined` and no subscribers are ever called.

**Files to modify**:
- `src/shared/lib/event-bus.ts` — interface + implementation
- `src/shared/lib/event-bus.test.ts` — test fixtures

## Detailed Guidance

### T001: Update DomainEvent Interface

**File**: `src/shared/lib/event-bus.ts`

**Purpose**: Change the `DomainEvent` interface from `type: string` to `eventType: string`.

**Steps**:
1. Open `src/shared/lib/event-bus.ts`
2. Change line 2 from `type: string` to `eventType: string`
3. Verify the change compiles correctly with TypeScript

**Validation**:
- [ ] `DomainEvent` interface has `eventType: string` field

---

### T002: Update EventBus.subscribe()

**File**: `src/shared/lib/event-bus.ts`

**Purpose**: Update the `subscribe` method to use `eventType` for handler registration and unsubscription.

**Before**:
```typescript
subscribe<T extends DomainEvent>(eventType: T['type'], handler: Handler<T>): Unsubscribe
```

**After**:
```typescript
subscribe<T extends DomainEvent>(eventType: T['eventType'], handler: Handler<T>): Unsubscribe
```

**Key insight**: The `subscribe` method's first parameter receives the string discriminator value (e.g., `'ItemAddedToCart'`). What needs to change is the **generic constraint** from `T['type']` to `T['eventType']` to match the updated interface.

**Steps**:
1. Find `subscribe<T extends DomainEvent>(eventType: T['type'], handler: Handler<T>)`
2. Change `T['type']` to `T['eventType']` in the parameter type
3. The internal `handlers.get(eventType)` and `handlers.set(eventType, ...)` calls remain correct since `eventType` here is the value passed in (the string)

**Validation**:
- [ ] `subscribe` method uses `T['eventType']` as the generic constraint for the event type parameter
- [ ] All `handlers.get(eventType)` and `handlers.set(eventType, ...)` calls work correctly

---

### T003: Update EventBus.publish()

**File**: `src/shared/lib/event-bus.ts`

**Purpose**: Update the `publish` method to use `event.eventType` instead of `event.type` for handler lookup.

**Before**:
```typescript
publish<T extends DomainEvent>(event: T): void {
  const handlers = this.handlers.get(event.type);  // BUG: event.type is undefined
```

**After**:
```typescript
publish<T extends DomainEvent>(event: T): void {
  const handlers = this.handlers.get(event.eventType);  // FIXED: correct property
```

**Steps**:
1. Find the `publish` method
2. Change `event.type` to `event.eventType` in the `handlers.get()` call
3. This is the critical bug fix — changing from the wrong property name to the correct one

**Validation**:
- [ ] `publish` uses `event.eventType` for handler lookup
- [ ] Handler lookup returns the correct set of handlers (not undefined)

---

### T004: Update Error Log Message

**File**: `src/shared/lib/event-bus.ts`

**Purpose**: Update the error log message inside `publish` to reference `event.eventType` instead of `event.type`.

**Before**:
```typescript
console.error(`[EventBus] Handler error for event "${event.type}":`, error);
```

**After**:
```typescript
console.error(`[EventBus] Handler error for event "${event.eventType}":`, error);
```

**Steps**:
1. Find the `console.error` inside `publish`'s `Promise.resolve().then(...)` callback
2. Change the log message from `"${event.type}"` to `"${event.eventType}"`

**Validation**:
- [ ] Error log message uses `event.eventType`

---

### T005: Update event-bus.test.ts Fixtures

**File**: `src/shared/lib/event-bus.test.ts`

**Purpose**: Update all test fixtures that create domain events to use `eventType` instead of `type`.

**Example change**:
```typescript
// Before
{ type: 'ItemAddedToCart', skuId: 'SKU1', name: 'Product', unitPriceCents: 1000, quantity: 1, occurredAt: new Date() }

// After
{ eventType: 'ItemAddedToCart', skuId: 'SKU1', name: 'Product', unitPriceCents: 1000, quantity: 1, occurredAt: new Date() }
```

**Steps**:
1. Open `src/shared/lib/event-bus.test.ts`
2. Find all event objects that use `type: string` (or `type: 'SomeEventType'`)
3. Change `type` to `eventType` for each
4. If any test creates a mock event with `type`, it will now cause a TypeScript error — fix those

**Validation**:
- [ ] All event fixtures in test file use `eventType`
- [ ] `npm run test:unit` passes for event-bus tests

---

## Definition of Done

1. `DomainEvent` interface uses `eventType: string`
2. `subscribe()` uses `T['eventType']` as the generic constraint for the event type parameter
3. `publish()` uses `event.eventType` for handler lookup (the critical bug fix)
4. Error log message uses `event.eventType`
5. All test fixtures use `eventType`
6. `npm run test:unit` passes for `event-bus.test.ts`
7. `npm run lint` passes with 0 errors
8. `npm run build` passes

## Risks & Notes

- The `subscribe` generic constraint change (`T['type']` → `T['eventType']`) is the interface-level fix that enables type-safe event publishing
- After this WP, `eventBus.publish(event)` will correctly look up handlers by `event.eventType` — events will actually be delivered
- No domain events currently use `eventType` in their structure yet (product/coupon still use `type`) — that's WP02's job

## Branch Strategy

- Planning/base branch: `main`
- Merge target: `main`
- Execution worktree will be allocated from `lanes.json` after `finalize_tasks`
