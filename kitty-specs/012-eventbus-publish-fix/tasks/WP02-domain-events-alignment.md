---
work_package_id: WP02
title: Domain Events Alignment
dependencies:
- WP01
requirement_refs:
- FR-004
- FR-005
- FR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T006
- T007
history: []
authoritative_surface: src/entities/
execution_mode: code_change
owned_files:
- src/entities/product/model/events.ts
- src/entities/coupon/model/events.ts
tags: []
agent: "kilo:minimax-m2::reviewer"
shell_pid: "11961"
---

# WP02: Domain Events Alignment

## Objective

Update product and coupon domain events to use `eventType` (instead of `type`) and `occurredAt` (instead of `timestamp`) for consistency with the EventBus contract and cart domain events. Product events also flatten their `payload` structure into top-level fields.

## Context

**Files to modify**:
- `src/entities/product/model/events.ts` — currently uses `type` + nested `payload`
- `src/entities/coupon/model/events.ts` — currently uses `type` + `timestamp`

**Dependency**: WP01 (EventBus must be fixed first so the interface accepts `eventType`)

## Detailed Guidance

### T006: Update Product Domain Events

**File**: `src/entities/product/model/events.ts`

**Current structure** (uses `type` + nested `payload`):
```typescript
export interface StockReserved {
  readonly type: 'StockReserved'
  readonly payload: {
    readonly skuId: string
    readonly orderId: string
    readonly quantity: number
    readonly timestamp: Date
  }
}
```

**Target structure** (uses `eventType`, flattened, `occurredAt`):
```typescript
export interface StockReserved {
  readonly eventType: 'StockReserved'
  readonly skuId: string
  readonly orderId: string
  readonly quantity: number
  readonly occurredAt: Date
}
```

**Steps**:
1. Open `src/entities/product/model/events.ts`
2. For `StockReserved`:
   - Change `type` → `eventType`
   - Flatten `payload.skuId` → `skuId` (top level)
   - Flatten `payload.orderId` → `orderId` (top level)
   - Flatten `payload.quantity` → `quantity` (top level)
   - Change `payload.timestamp` → `occurredAt: Date`
   - Remove the `payload` wrapper entirely
3. Apply the same transformation to `StockReleased` and `StockDepleted`
4. Verify TypeScript compiles correctly

**Important constraint**: The event discriminant (`eventType`) keeps its literal type (`'StockReserved'`, `'StockReleased'`, `'StockDepleted'`). Only the key name changes from `type` to `eventType`.

**For `StockReleased`** (similar structure to `StockReserved`):
```typescript
export interface StockReleased {
  readonly eventType: 'StockReleased'
  readonly skuId: string
  readonly orderId: string
  readonly quantity: number
  readonly occurredAt: Date
}
```

**For `StockDepleted`** (has `totalOnHand` and `threshold` instead of `orderId` and `quantity`):
```typescript
export interface StockDepleted {
  readonly eventType: 'StockDepleted'
  readonly skuId: string
  readonly totalOnHand: number
  readonly threshold: number
  readonly occurredAt: Date
}
```

**Validation**:
- [ ] `StockReserved` uses `eventType: 'StockReserved'`, `skuId`, `orderId`, `quantity`, `occurredAt` at top level
- [ ] `StockReleased` uses `eventType: 'StockReleased'`, `skuId`, `orderId`, `quantity`, `occurredAt` at top level
- [ ] `StockDepleted` uses `eventType: 'StockDepleted'`, `skuId`, `totalOnHand`, `threshold`, `occurredAt` at top level
- [ ] No nested `payload` object remains
- [ ] `npm run build` passes (TypeScript compilation)

---

### T007: Update Coupon Domain Events

**File**: `src/entities/coupon/model/events.ts`

**Current structure** (uses `type` + `timestamp`):
```typescript
export interface CouponValidated {
  type: 'CouponValidated';
  couponCode: string;
  timestamp: Date;
}
```

**Target structure** (uses `eventType` + `occurredAt`):
```typescript
export interface CouponValidated {
  readonly eventType: 'CouponValidated';
  readonly couponCode: string;
  readonly occurredAt: Date;
}
```

**Steps**:
1. Open `src/entities/coupon/model/events.ts`
2. For `CouponValidated`:
   - Change `type` → `eventType`
   - Change `timestamp` → `occurredAt`
   - Ensure `readonly` on all fields for consistency
3. For `CouponValidationFailed`:
   ```typescript
   // Before
   type: 'CouponValidationFailed';
   couponCode: string;
   reason: CouponValidationReason;
   timestamp: Date;
   
   // After
   readonly eventType: 'CouponValidationFailed';
   readonly couponCode: string;
   readonly reason: CouponValidationReason;
   readonly occurredAt: Date;
   ```
4. For `DiscountCalculated`:
   ```typescript
   // Before
   type: 'DiscountCalculated';
   couponCode: string;
   subtotal: Money;
   discount: Money;
   resultingTotal: Money;
   timestamp: Date;
   
   // After
   readonly eventType: 'DiscountCalculated';
   readonly couponCode: string;
   readonly subtotal: Money;
   readonly discount: Money;
   readonly resultingTotal: Money;
   readonly occurredAt: Date;
   ```
5. Verify TypeScript compiles correctly

**Validation**:
- [ ] `CouponValidated` uses `eventType` + `occurredAt`
- [ ] `CouponValidationFailed` uses `eventType` + `occurredAt`
- [ ] `DiscountCalculated` uses `eventType` + `occurredAt`
- [ ] `npm run build` passes

---

## Definition of Done

1. Product events use `eventType` (not `type`), flattened structure, `occurredAt`
2. Coupon events use `eventType` (not `type`), `occurredAt` (not `timestamp`)
3. `npm run build` passes (no TypeScript errors from the structural changes)
4. `npm run lint` passes with 0 errors

## Risks & Notes

- **No existing subscribers** for product or coupon events (confirmed by grep search) — safe to change structure without breaking handlers
- Product event flattening removes the `payload` wrapper — any future code subscribing to these events will receive flat event objects, which is more ergonomic and consistent with cart events
- These changes don't break anything now since no subscribers exist, but they establish the correct contract for WP03 and future work

## Branch Strategy

- Planning/base branch: `main`
- Merge target: `main`
- Depends on WP01 (EventBus must be fixed first)
- Execution worktree will be allocated from `lanes.json` after `finalize_tasks`

## Activity Log

- 2026-04-14T14:06:01Z – kilo:minimax-m2::implementer – shell_pid=11961 – Started implementation via action command
- 2026-04-14T14:11:10Z – kilo:minimax-m2::implementer – shell_pid=11961 – WP02 complete: product and coupon events aligned. Build fails only in cart-actions (WP03 scope).
- 2026-04-14T14:11:36Z – kilo:minimax-m2::reviewer – shell_pid=11961 – Started review via action command
