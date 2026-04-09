---
work_package_id: WP01
title: ProductVariant Foundation
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- FR-001
- FR-005
- FR-006
- NFR-001
- NFR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-004-product-variant-aggregate
base_commit: cfec0006433690b42cfc6ccf46aa13e245d68bfc
created_at: '2026-04-09T16:06:30.430739+00:00'
subtasks: [T001, T002, T003, T004, T005, T006, T010]
shell_pid: "19846"
authoritative_surface: src/entities/product/
execution_mode: code_change
owned_files: [src/entities/product/model/types.ts, src/entities/product/model/events.ts, src/entities/product/model/stock-reservation.ts, src/entities/product/model/factory.ts, src/entities/product/model/available-stock.ts, src/entities/product/index.ts]
agent: "kilo:kilo-auto/balanced:typescript-implementer:implementer"
---

# WP01: ProductVariant Foundation

## Objective

Implement type definitions, value objects, factory functions, and the basic derived function for the ProductVariant aggregate. This foundation enables all subsequent operations (reserve, release, confirmDepletion).

## Context

**Mission**: 004-product-variant-aggregate  
**Branch Strategy**: main → main  
**Files Created**: 5 files in `src/entities/product/model/`

This work package establishes the type system and immutable factory functions. All operations are pure/impure-hybrid: they accept an input state and return a new state along with optional domain events for the EventBus.

## Implementation

### T001: Create Directory Structure

**Purpose**: Establish FSD-compliant directory for the product entity.

**Steps**:
1. Create directory: `src/entities/product/model/`
2. Create placeholder files (empty exports for now):
   - `src/entities/product/model/types.ts`
   - `src/entities/product/model/events.ts`
   - `src/entities/product/model/stock-reservation.ts`
   - `src/entities/product/model/factory.ts`
   - `src/entities/product/model/available-stock.ts`
3. Create `src/entities/product/index.ts` with re-exports

**Files**:
- `src/entities/product/model/` (directory)
- `src/entities/product/model/*.ts` (5 placeholder files)
- `src/entities/product/index.ts` (public API entry)

**Validation**:
- [ ] Directory structure exists
- [ ] Files can be imported without errors

---

### T002: StockReservation Value Object

**Purpose**: Create the immutable StockReservation value object with validation.

**Steps**:
1. In `src/entities/product/model/stock-reservation.ts`:

```typescript
export interface StockReservation {
  readonly orderId: string;
  readonly quantity: number;
  readonly timestamp: Date;
}

export function createStockReservation(
  orderId: string,
  quantity: number,
): StockReservation {
  if (quantity <= 0) {
    throw new Error('Reservation quantity must be positive');
  }
  return Object.freeze({
    orderId,
    quantity,
    timestamp: new Date(),
  });
}
```

**Validation**:
- [ ] createStockReservation returns frozen object
- [ ] Throws for quantity <= 0
- [ ] Timestamp is set to current date
- [ ] Properties are readonly

**Edge Cases**:
- quantity = 0 → throws
- quantity = -1 → throws
- Empty orderId → allowed (validation happens at aggregate level)

---

### T003: Domain Event Types

**Purpose**: Define the discriminated union type for domain events.

**Steps**:
1. In `src/entities/product/model/events.ts`:

```typescript
export interface StockReserved {
  readonly type: 'StockReserved';
  readonly payload: {
    readonly skuId: string;
    readonly orderId: string;
    readonly quantity: number;
    readonly timestamp: Date;
  };
}

export interface StockReleased {
  readonly type: 'StockReleased';
  readonly payload: {
    readonly skuId: string;
    readonly orderId: string;
    readonly quantity: number;
  };
}

export interface StockDepleted {
  readonly type: 'StockDepleted';
  readonly payload: {
    readonly skuId: string;
    readonly totalOnHand: number;
    readonly threshold: number;
  };
}

export type ProductDomainEvent = StockReserved | StockReleased | StockDepleted;
```

**Validation**:
- [ ] All events are discriminated unions (shared `type` field)
- [ ] TypeScript narrows correctly when checking `event.type`
- [ ] All payload properties are readonly

---

### T004: ProductVariant Types

**Purpose**: Define the main ProductVariant interface.

**Steps**:
1. In `src/entities/product/model/types.ts`:

```typescript
import type { StockReservation } from './stock-reservation';

export interface ProductVariant {
  readonly skuId: string;
  readonly totalOnHand: number;
  readonly sold: number;
  readonly reservations: readonly StockReservation[];
}
```

**Validation**:
- [ ] Interface matches spec.md Key Entities section
- [ ] reservations is readonly array
- [ ] All properties are readonly

---

### T005: createProductVariant Factory

**Purpose**: Create immutable ProductVariant instances with validation.

**Steps**:
1. In `src/entities/product/model/factory.ts`:

```typescript
import type { StockReservation } from './stock-reservation';
import type { ProductVariant } from './types';

export const LOW_STOCK_THRESHOLD = 5;

export function createProductVariant(params: {
  skuId: string;
  totalOnHand: number;
  sold?: number;
  reservations?: StockReservation[];
}): ProductVariant {
  if (params.totalOnHand < 0) {
    throw new Error('totalOnHand cannot be negative');
  }
  return Object.freeze({
    skuId: params.skuId,
    totalOnHand: params.totalOnHand,
    sold: params.sold ?? 0,
    reservations: params.reservations ?? [],
  });
}
```

**Validation**:
- [ ] Returns Object.freeze'd instance
- [ ] Throws if totalOnHand < 0
- [ ] Defaults sold to 0
- [ ] Defaults reservations to empty array
- [ ] LOW_STOCK_THRESHOLD exported and equals 5

**Edge Cases**:
- totalOnHand = 0 → valid (empty stock)
- totalOnHand = -1 → throws

---

### T006: availableStock Function

**Purpose**: Derive available stock from totalOnHand minus all reserved quantities.

**Steps**:
1. Create `src/entities/product/model/available-stock.ts`:

```typescript
import type { ProductVariant } from './types';

export function availableStock(variant: ProductVariant): number {
  const sumReserved = variant.reservations.reduce(
    (sum, r) => sum + r.quantity,
    0,
  );
  return variant.totalOnHand - sumReserved;
}
```

**Validation**:
- [ ] Returns totalOnHand when no reservations
- [ ] Correctly subtracts all reserved quantities
- [ ] Handles empty reservations array
- [ ] O(1) computation (single reduce)

---

### T010: StockReservation Validation Enhancement

**Purpose**: Add factory function for creating reservations with orderId validation.

**Steps**:
1. Update `src/entities/product/model/stock-reservation.ts`:

```typescript
export function createStockReservation(
  orderId: string,
  quantity: number,
  timestamp?: Date,
): StockReservation {
  if (quantity <= 0) {
    throw new Error('Reservation quantity must be positive');
  }
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('orderId must be a non-empty string');
  }
  return Object.freeze({
    orderId: orderId.trim(),
    quantity,
    timestamp: timestamp ?? new Date(),
  });
}
```

**Validation**:
- [ ] orderId empty string → throws
- [ ] orderId with whitespace → trimmed
- [ ] Custom timestamp preserved
- [ ] Default timestamp when not provided

---

## Definition of Done

- [ ] All type definitions compile without errors
- [ ] All factories return frozen objects
- [ ] LOW_STOCK_THRESHOLD exported and equals 5
- [ ] availableStock returns correct values for all test cases
- [ ] Validation errors thrown with descriptive messages

## Dependencies

None — this is the foundation work package.

## Risks

**Risk**: TypeScript strict mode may flag readonly array assignability
**Mitigation**: Ensure `readonly StockReservation[]` is used consistently

**Risk**: Circular dependencies between modules
**Mitigation**: Import types only (use `import type`), not values

## Reviewer Guidance

1. Verify all functions return `Object.freeze()` instances
2. Check that LOW_STOCK_THRESHOLD is 5 (matches spec)
3. Ensure availableStock uses integer arithmetic (no floating point)
4. Confirm all validation errors have descriptive messages

## Activity Log

- 2026-04-09T16:06:51Z – kilo:kilo-auto/balanced:typescript-implementer:implementer – shell_pid=19846 – Started implementation via action command
