---
work_package_id: WP02
title: Reservation Operations
dependencies: [WP01]
requirement_refs:
- FR-002
- FR-003
- FR-004
- FR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: [T007, T008, T009, T011]
authoritative_surface: src/entities/product/
execution_mode: code_change
owned_files: [src/entities/product/model/operations.ts, src/entities/product/model/product-variant.test.ts]
agent: "kilo:kilo-auto/balanced:typescript-implementer:implementer"
shell_pid: "19846"
---

# WP02: Reservation Operations

## Objective

Implement the three core reservation lifecycle operations: `reserve`, `releaseReservation`, and `confirmDepletion`. These operations are the heart of the ProductVariant aggregate, managing stock state transitions and emitting domain events.

## Context

**Mission**: 004-product-variant-aggregate  
**Branch Strategy**: main → main  
**Depends On**: WP01 (types, factories, availableStock)  
**Files Modified**: `operations.ts`, `product-variant.test.ts`

### Design Principles

1. **Immutable Operations**: All functions accept current state and return new state
2. **Event Emission**: Operations return optional events for EventBus publishing
3. **Partial Reservations**: When requested qty > available, reserve what's available
4. **Silent No-Ops**: Invalid operations (non-existent reservations) succeed without error

## Implementation

### T007: reserve Operation

**Purpose**: Reserve stock for an order, creating partial reservations when stock is insufficient.

**Algorithm**:
1. Compute `available = availableStock(variant)`
2. Determine `reserveQty = min(requestedQty, available)`
3. If `reserveQty === 0`, return `{ variant }` (no event, no-op)
4. Create new `StockReservation` with `reserveQty`
5. Return new variant with reservation appended
6. Emit `StockReserved` event
7. Emit `StockDepleted` event if `variant.totalOnHand < LOW_STOCK_THRESHOLD`

**Steps**:
1. Create `src/entities/product/model/operations.ts` with the reserve function:

```typescript
import { createStockReservation } from './stock-reservation';
import type { ProductVariant } from './types';
import type { StockReserved, StockDepleted } from './events';
import { LOW_STOCK_THRESHOLD } from './factory';
import { availableStock } from './available-stock';

export function reserve(params: {
  variant: ProductVariant;
  orderId: string;
  quantity: number;
}): {
  variant: ProductVariant;
  event?: StockReserved;
  depletedEvent?: StockDepleted;
} {
  const currentAvailable = availableStock(params.variant);
  const reserveQty = Math.min(params.quantity, currentAvailable);

  if (reserveQty === 0) {
    return { variant: params.variant };
  }

  const reservation = createStockReservation(params.orderId, reserveQty);
  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    reservations: [...params.variant.reservations, reservation],
  });

  const event: StockReserved = {
    type: 'StockReserved',
    payload: {
      skuId: params.variant.skuId,
      orderId: params.orderId,
      quantity: reserveQty,
      timestamp: reservation.timestamp,
    },
  };

  let depletedEvent: StockDepleted | undefined;
  if (params.variant.totalOnHand < LOW_STOCK_THRESHOLD) {
    depletedEvent = {
      type: 'StockDepleted',
      payload: {
        skuId: params.variant.skuId,
        totalOnHand: params.variant.totalOnHand,
        threshold: LOW_STOCK_THRESHOLD,
      },
    };
  }

  return { variant: newVariant, event, depletedEvent };
}
```

**Validation**:
- [ ] Reserve exact amount when available >= requested
- [ ] Reserve partial amount when available < requested
- [ ] Return no event when reserveQty = 0
- [ ] StockReserved event contains correct quantity (reserved, not requested)
- [ ] StockDepleted event fires when totalOnHand < threshold
- [ ] Original variant not mutated
- [ ] New variant includes reservation

**Edge Cases**:
- `quantity = 0` → reserveQty = 0, return no event (no-op)
- `quantity > availableStock` → partial reservation created
- `availableStock = 0` → reserveQty = 0, no reservation

---

### T008: releaseReservation Operation

**Purpose**: Release a stock reservation by orderId. Silent no-op if not found.

**Algorithm**:
1. Find reservation with matching orderId
2. If not found, return `{ variant }` (no event, no-op)
3. Filter out the reservation
4. Emit `StockReleased` event with released quantity
5. Return new variant without the reservation

**Steps**:
1. Add to `src/entities/product/model/operations.ts`:

```typescript
import type { ProductVariant } from './types';
import type { StockReleased } from './events';

export function releaseReservation(params: {
  variant: ProductVariant;
  orderId: string;
}): {
  variant: ProductVariant;
  event?: StockReleased;
} {
  const reservation = params.variant.reservations.find(
    (r) => r.orderId === params.orderId,
  );

  if (!reservation) {
    return { variant: params.variant };
  }

  const releasedQty = reservation.quantity;
  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    reservations: params.variant.reservations.filter(
      (r) => r.orderId !== params.orderId,
    ),
  });

  const event: StockReleased = {
    type: 'StockReleased',
    payload: {
      skuId: params.variant.skuId,
      orderId: params.orderId,
      quantity: releasedQty,
    },
  };

  return { variant: newVariant, event };
}
```

**Validation**:
- [ ] Reservation removed from array
- [ ] StockReleased event emitted with correct quantity
- [ ] Original variant not mutated
- [ ] Non-existent orderId → silent no-op (returns original)
- [ ] Multiple reservations with same orderId → only first released (edge case)

**Edge Cases**:
- Non-existent orderId → silent success, no event
- Already released reservation → no-op

---

### T009: confirmDepletion Operation

**Purpose**: Confirm stock depletion after order payment, reducing totalOnHand and removing reservation.

**Algorithm**:
1. Find reservation with matching orderId
2. If not found, return `{ variant }` (no event, no-op)
3. Compute new `totalOnHand = totalOnHand - reservedQuantity`
4. Remove reservation from array
5. Emit `StockDepleted` event if `newTotalOnHand < LOW_STOCK_THRESHOLD`
6. Return new variant

**Steps**:
1. Add to `src/entities/product/model/operations.ts`:

```typescript
import type { ProductVariant } from './types';
import type { StockDepleted } from './events';
import { LOW_STOCK_THRESHOLD } from './factory';

export function confirmDepletion(params: {
  variant: ProductVariant;
  orderId: string;
}): {
  variant: ProductVariant;
  event?: StockDepleted;
} {
  const reservation = params.variant.reservations.find(
    (r) => r.orderId === params.orderId,
  );

  if (!reservation) {
    return { variant: params.variant };
  }

  const newTotalOnHand = Math.max(0, params.variant.totalOnHand - reservation.quantity);
  
  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    totalOnHand: newTotalOnHand,
    sold: params.variant.sold + reservation.quantity,
    reservations: params.variant.reservations.filter(
      (r) => r.orderId !== params.orderId,
    ),
  });

  let event: StockDepleted | undefined;
  if (newTotalOnHand < LOW_STOCK_THRESHOLD) {
    event = {
      type: 'StockDepleted',
      payload: {
        skuId: params.variant.skuId,
        totalOnHand: newTotalOnHand,
        threshold: LOW_STOCK_THRESHOLD,
      },
    };
  }

  return { variant: newVariant, event };
}
```

**Validation**:
- [ ] totalOnHand reduced by reserved quantity
- [ ] sold incremented by reserved quantity
- [ ] Reservation removed from array
- [ ] StockDepleted event if threshold reached after reduction
- [ ] totalOnHand never goes negative (capped at 0)
- [ ] Non-existent orderId → silent no-op

**Edge Cases**:
- Confirming same order twice → second call is no-op (reservation already removed)
- Reservation quantity > current totalOnHand → totalOnHand becomes 0

---

### T011: Unit Tests

**Purpose**: Comprehensive test coverage for all functions and edge cases.

**Test File**: `src/entities/product/model/product-variant.test.ts`

**Tests to Write**:

```typescript
import { describe, it, expect } from 'vitest';
import { createProductVariant, LOW_STOCK_THRESHOLD } from './factory';
import { availableStock } from './available-stock';
import { createStockReservation } from './stock-reservation';
import { reserve, releaseReservation, confirmDepletion } from './operations';

describe('ProductVariant', () => {
  describe('createProductVariant', () => {
    it('creates variant with default values', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      expect(variant.sold).toBe(0);
      expect(variant.reservations).toEqual([]);
    });

    it('throws for negative totalOnHand', () => {
      expect(() => createProductVariant({ skuId: 'SKU-001', totalOnHand: -1 }))
        .toThrow('totalOnHand cannot be negative');
    });
  });

  describe('availableStock', () => {
    it('returns totalOnHand when no reservations', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      expect(availableStock(variant)).toBe(10);
    });

    it('subtracts reserved quantities', () => {
      const variant = createProductVariant({ 
        skuId: 'SKU-001', 
        totalOnHand: 10,
        reservations: [createStockReservation('order-1', 3)]
      });
      expect(availableStock(variant)).toBe(7);
    });

    it('handles multiple reservations', () => {
      const variant = createProductVariant({ 
        skuId: 'SKU-001', 
        totalOnHand: 10,
        reservations: [
          createStockReservation('order-1', 3),
          createStockReservation('order-2', 2)
        ]
      });
      expect(availableStock(variant)).toBe(5);
    });
  });

  describe('reserve', () => {
    it('reserves exact amount when available', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 });
      
      expect(result.event?.payload.quantity).toBe(5);
      expect(availableStock(result.variant)).toBe(5);
    });

    it('creates partial reservation when insufficient stock', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 3 });
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 });
      
      expect(result.event?.payload.quantity).toBe(3); // partial
      expect(availableStock(result.variant)).toBe(0);
    });

    it('emits StockDepleted when below threshold', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: LOW_STOCK_THRESHOLD });
      const result = reserve({ variant, orderId: 'order-1', quantity: 1 });
      
      expect(result.depletedEvent?.type).toBe('StockDepleted');
    });

    it('does not emit event when reserveQty is 0', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 0 });
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 });
      
      expect(result.event).toBeUndefined();
    });
  });

  describe('releaseReservation', () => {
    it('releases existing reservation', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 5 });
      variant = reserved.variant;
      
      const result = releaseReservation({ variant, orderId: 'order-1' });
      
      expect(result.event?.payload.quantity).toBe(5);
      expect(availableStock(result.variant)).toBe(10);
    });

    it('silent no-op for non-existent orderId', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      const result = releaseReservation({ variant, orderId: 'non-existent' });
      
      expect(result.event).toBeUndefined();
      expect(result.variant).toBe(variant); // same reference
    });
  });

  describe('confirmDepletion', () => {
    it('reduces totalOnHand and removes reservation', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 3 });
      variant = reserved.variant;
      
      const result = confirmDepletion({ variant, orderId: 'order-1' });
      
      expect(result.variant.totalOnHand).toBe(7);
      expect(result.variant.sold).toBe(3);
      expect(result.variant.reservations.length).toBe(0);
    });

    it('caps totalOnHand at 0', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 2 });
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 5 });
      variant = reserved.variant;
      
      const result = confirmDepletion({ variant, orderId: 'order-1' });
      
      expect(result.variant.totalOnHand).toBe(0);
    });

    it('emits StockDepleted when below threshold after reduction', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 6 });
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 2 });
      variant = reserved.variant; // totalOnHand now 6, reserved 2
      
      const result = confirmDepletion({ variant, orderId: 'order-1' });
      
      expect(result.variant.totalOnHand).toBe(4); // 6 - 2 = 4 < 5
      expect(result.event?.type).toBe('StockDepleted');
    });

    it('silent no-op for non-existent orderId', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 });
      const result = confirmDepletion({ variant, orderId: 'non-existent' });
      
      expect(result.event).toBeUndefined();
    });
  });
});
```

**Validation**:
- [ ] All tests pass
- [ ] Coverage includes happy paths and edge cases
- [ ] Edge cases E1-E4 covered

---

### T012: Public API Export (COMPLETED IN WP01)

**Purpose**: Export all public types and functions from index.ts.

**Steps**:
1. Update `src/entities/product/index.ts`:

```typescript
// Factory + constants
export { createProductVariant, LOW_STOCK_THRESHOLD } from './model/factory';

// Derived functions
export { availableStock } from './model/available-stock';

// Operations
export { reserve, releaseReservation, confirmDepletion } from './model/operations';

// Value Object
export { createStockReservation } from './model/stock-reservation';

// Types
export type { ProductVariant } from './model/types';
export type { StockReservation } from './model/stock-reservation';
export type { ProductDomainEvent, StockReserved, StockReleased, StockDepleted } from './model/events';
```

**Validation**:
- [ ] All exports can be imported from `@/entities/product`
- [ ] No circular dependencies
- [ ] Types are properly exported (not just values)

**Note**: WP01 creates the initial index.ts stub. WP02 extends it with operations exports.

---

## Definition of Done

- [ ] reserve() creates partial reservations correctly
- [ ] releaseReservation() is silent no-op for non-existent orders
- [ ] confirmDepletion() reduces totalOnHand and increments sold
- [ ] StockDepleted events fire when threshold crossed
- [ ] All unit tests pass
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

## Dependencies

**Depends On**: WP01 (must be completed first)

```
WP01 (types, factories) → WP02 (operations)
```

## Risks

**Risk**: Missing edge case in partial reservation calculation
**Mitigation**: Unit tests cover quantity > availableStock scenario

**Risk**: Event emission timing (StockDepleted after reserve vs after confirm)
**Mitigation**: Specified clearly: StockDepleted fires when totalOnHand < threshold

## Reviewer Guidance

1. **reserve**: Verify partial reservation uses `min(requested, available)`
2. **releaseReservation**: Verify `StockReleased` event includes released quantity
3. **confirmDepletion**: Verify `totalOnHand` cannot go negative
4. **Events**: Verify all events are properly discriminated unions
5. **Immutability**: Verify no mutations of input objects

## Activity Log

- 2026-04-09T16:13:21Z – kilo:kilo-auto/balanced:typescript-implementer:implementer – shell_pid=19846 – Started implementation via action command
- 2026-04-09T16:13:35Z – kilo:kilo-auto/balanced:typescript-implementer:implementer – shell_pid=19846 – Ready for review: WP02 code already implemented with WP01
