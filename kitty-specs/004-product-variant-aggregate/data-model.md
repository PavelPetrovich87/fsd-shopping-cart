# Data Model: ProductVariant Aggregate

## Type Definitions

### StockReservation (Value Object)

```typescript
// src/entities/product/model/stock-reservation.ts
export interface StockReservation {
  readonly orderId: string;
  readonly quantity: number;
  readonly timestamp: Date;
}

export function createStockReservation(orderId: string, quantity: number): StockReservation {
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

### ProductVariant (Aggregate Root)

```typescript
// src/entities/product/model/product-variant.ts
import type { StockReservation } from './stock-reservation';

export interface ProductVariant {
  readonly skuId: string;
  readonly totalOnHand: number;
  readonly sold: number;
  readonly reservations: readonly StockReservation[];
}

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

export function availableStock(variant: ProductVariant): number {
  const sumReserved = variant.reservations.reduce((sum, r) => sum + r.quantity, 0);
  return variant.totalOnHand - sumReserved;
}
```

### Domain Events

```typescript
// src/entities/product/model/events.ts
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

## Operation Signatures

### Reserve

```typescript
// Reserve stock for an order. Creates partial reservation if qty > available.
export function reserve(params: {
  variant: ProductVariant;
  orderId: string;
  quantity: number;
}): {
  variant: ProductVariant;
  event?: StockReserved;
  depletedEvent?: StockDepleted;
};

// Implementation logic:
// 1. Compute availableStock(variant)
// 2. Determine reserveQty = min(quantity, availableStock)
// 3. If reserveQty === 0, return { variant } (no event)
// 4. Create StockReservation with reserveQty
// 5. Return new variant with reservation appended
// 6. Emit StockReserved if reserveQty > 0
// 7. Emit StockDepleted if totalOnHand < LOW_STOCK_THRESHOLD
```

### Release Reservation

```typescript
// Release a reservation by orderId. Silent no-op if not found.
export function releaseReservation(params: {
  variant: ProductVariant;
  orderId: string;
}): {
  variant: ProductVariant;
  event?: StockReleased;
};

// Implementation logic:
// 1. Find reservation by orderId
// 2. If not found, return { variant } (no event)
// 3. Remove reservation from array
// 4. Emit StockReleased with released quantity
```

### Confirm Depletion

```typescript
// Confirm stock depletion after order completion.
export function confirmDepletion(params: {
  variant: ProductVariant;
  orderId: string;
}): {
  variant: ProductVariant;
  event?: StockDepleted;
};

// Implementation logic:
// 1. Find reservation by orderId
// 2. If not found, return { variant } (no event)
// 3. Reduce totalOnHand by reserved quantity
// 4. Remove reservation from array
// 5. Emit StockDepleted if totalOnHand < LOW_STOCK_THRESHOLD after reduction
```

## Public API (index.ts)

```typescript
// src/entities/product/index.ts
export { createProductVariant, availableStock, reserve, releaseReservation, confirmDepletion } from './model/product-variant';
export { createStockReservation } from './model/stock-reservation';
export type { ProductVariant, StockReservation } from './model/types';
export type { ProductDomainEvent, StockReserved, StockReleased, StockDepleted } from './model/events';
```
