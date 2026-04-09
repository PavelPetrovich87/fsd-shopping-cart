# Tasks: ProductVariant Aggregate

**Mission**: 004-product-variant-aggregate  
**Spec**: [spec.md](../spec.md)  
**Plan**: [plan.md](../plan.md)  
**Generated**: 2026-04-09

## Subtask Index

| ID | Description | WP | Parallel |
|----|------------|----|--------|
| T001 | Create directory structure for entities/product | WP01 | | [D] | [D] |
| T002 | Implement StockReservation VO (types + factory) | WP01 | [D] |
| T003 | Implement domain event types (StockReserved, StockReleased, StockDepleted) | WP01 | [D] |
| T004 | Implement ProductVariant types | WP01 | [D] |
| T005 | Implement createProductVariant factory | WP01 | | [D] |
| T006 | Implement availableStock function | WP01 | | [D] |
| T007 | Implement reserve operation with partial reservation logic | WP02 | | [D] |
| T008 | Implement releaseReservation operation | WP02 | | [D] |
| T009 | Implement confirmDepletion operation | WP02 | | [D] |
| T010 | Implement StockReservation validation | WP01 | | [D] |
| T011 | Write unit tests for all functions | WP02 | | [D] |
| T012 | Export public API from index.ts | WP02 | |

## Work Packages

---

### WP01: ProductVariant Foundation

**Goal**: Implement type definitions, value objects, factory, and basic derived function

**Priority**: P0 (Foundation - all other work depends on this)

**File Ownership**:
```
src/entities/product/
├── model/
│   ├── types.ts              # T004: ProductVariant interface
│   ├── events.ts             # T003: Domain event types
│   ├── stock-reservation.ts  # T002, T010: StockReservation VO + validation
│   ├── factory.ts            # T005: createProductVariant factory
│   ├── available-stock.ts    # T006: availableStock function
│   └── index.ts              # T012: Public API exports (stub only)
└── __tests__/
    └── product-variant.test.ts  # T011: Unit tests (shared between WPs)
```

**Subtasks**:
- [ ] T001 Create directory structure for entities/product
- [ ] T002 Implement StockReservation VO (types + factory)
- [ ] T003 Implement domain event types (StockReserved, StockReleased, StockDepleted)
- [ ] T004 Implement ProductVariant types
- [ ] T005 Implement createProductVariant factory
- [ ] T006 Implement availableStock function
- [ ] T010 Implement StockReservation validation
- [ ] T012 Export public API from index.ts (stub)

**Parallel Opportunities**: T002, T003, T004 can be implemented in parallel (independent type definitions)

**Dependencies**: None

**Estimated Prompt Size**: ~350 lines

---

### WP02: Reservation Operations

**Goal**: Implement reserve, releaseReservation, confirmDepletion operations and tests

**File Ownership**:
```
src/entities/product/
├── model/
│   └── operations.ts         # T007, T008, T009: reserve, releaseReservation, confirmDepletion
└── __tests__/
    └── product-variant.test.ts  # T011: Unit tests (extends WP01 tests)
```

**Priority**: P1 (depends on WP01)

**Subtasks**:
- [ ] T007 Implement reserve operation with partial reservation logic
- [ ] T008 Implement releaseReservation operation
- [ ] T009 Implement confirmDepletion operation
- [ ] T011 Write unit tests for all functions

**Dependencies**: WP01

**Estimated Prompt Size**: ~400 lines

---

## Implementation Notes

### Functional Approach
- All functions are pure/impure-hybrid: accept state, return new state + optional events
- Immutable operations: never mutate input objects
- Use `Object.freeze()` for runtime immutability

### Event Emission Pattern
```typescript
// Operations return both new state and optional events
const result = reserve({ variant, orderId, quantity });
if (result.event) {
  eventBus.publish(result.event);
}
```

### Edge Cases to Test
- E1: Reserve more than available (partial reservation)
- E2: Release non-existent reservation (silent no-op)
- E3: totalOnHand negative guard
- E4: Confirm depletion with non-existent orderId

### File Locations
```
src/entities/product/
├── model/
│   ├── product-variant.ts     # Main aggregate + operations
│   ├── stock-reservation.ts   # StockReservation VO
│   ├── types.ts               # ProductVariant interface
│   ├── events.ts              # Domain event types
│   └── product-variant.test.ts # Unit tests
└── index.ts                   # Public API exports
```

## Validation Commands

After implementation, run:
```bash
npm run lint
npm run lint:arch
npm run build
```
