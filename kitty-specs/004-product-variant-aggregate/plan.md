# Implementation Plan: ProductVariant Aggregate

**Branch**: `004-product-variant-aggregate` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/kitty-specs/004-product-variant-aggregate/spec.md`

## Summary

Implement `ProductVariant` aggregate with functional approach (factory functions + plain objects). Manages inventory stock levels with reservation lifecycle: `availableStock` derived from `totalOnHand - sumReserved`, `reserve()` creates partial reservations when stock insufficient, `releaseReservation()` and `confirmDepletion()` manage reservation lifecycle. Domain events (`StockReserved`, `StockReleased`, `StockDepleted`) emitted for all mutations.

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4  
**Storage**: N/A (in-memory domain model, persisted via repository port)  
**Testing**: Vitest (project standard)  
**Target Platform**: Web browser (SPA)  
**Performance Goals**: O(1) availableStock computation  
**Constraints**: Integer arithmetic for stock, immutable operations  
**Scale/Scope**: Single aggregate, 2 entity types, 3 domain events

## Charter Check

No charter file present. Skipped.

## Project Structure

### Documentation (this feature)

```
kitty-specs/004-product-variant-aggregate/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # N/A (no unknowns)
├── data-model.md        # Type definitions and function signatures
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```
src/
├── entities/product/
│   ├── model/
│   │   ├── product-variant.ts    # ProductVariant factory + functions
│   │   ├── stock-reservation.ts   # StockReservation VO
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── events.ts             # Domain event types
│   │   └── product-variant.test.ts
│   └── index.ts                   # Public API re-exports
```

**Structure Decision**: FSD-compliant `entities/product/model/` with functional exports. Follows existing patterns from T-001 (Money VO in `shared/lib/`).

## Complexity Tracking

N/A — no charter violations.

---

## Phase 0: Research

Not required. All clarifications resolved during specify phase.

## Phase 1: Design & Contracts

### Data Model

#### ProductVariant Types

```typescript
// src/entities/product/model/types.ts
export interface StockReservation {
  orderId: string;
  quantity: number;
  timestamp: Date;
}

export interface ProductVariant {
  readonly skuId: string;
  readonly totalOnHand: number;
  readonly sold: number;
  readonly reservations: readonly StockReservation[];
}

export interface StockReserved {
  type: 'StockReserved';
  payload: { skuId: string; orderId: string; quantity: number; timestamp: Date };
}

export interface StockReleased {
  type: 'StockReleased';
  payload: { skuId: string; orderId: string; quantity: number };
}

export interface StockDepleted {
  type: 'StockDepleted';
  payload: { skuId: string; totalOnHand: number; threshold: number };
}

export type ProductDomainEvent = StockReserved | StockReleased | StockDepleted;
```

#### Factory Functions

```typescript
// src/entities/product/model/product-variant.ts

export const LOW_STOCK_THRESHOLD = 5;

export function createProductVariant(params: {
  skuId: string;
  totalOnHand: number;
  sold?: number;
  reservations?: StockReservation[];
}): ProductVariant;

export function availableStock(variant: ProductVariant): number;

export function reserve(params: {
  variant: ProductVariant;
  orderId: string;
  quantity: number;
}): { variant: ProductVariant; event?: StockReserved; depletedEvent?: StockDepleted };

export function releaseReservation(params: {
  variant: ProductVariant;
  orderId: string;
}): { variant: ProductVariant; event?: StockReleased };

export function confirmDepletion(params: {
  variant: ProductVariant;
  orderId: string;
}): { variant: ProductVariant; event?: StockDepleted };
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Aggregate type | Functional (factory + ops) | User requirement for frontend functional style |
| Reservations storage | `readonly StockReservation[]` | Ensures immutability |
| Event return | Tuple `{ variant, event? }` | Enables event bus publishing |
| Partial reservation | Clamp to `availableStock` | User clarification: option B |
| Threshold | Constant `LOW_STOCK_THRESHOLD = 5` | User assumption, configurable later |
