# ProductVariant Aggregate

## 1. Overview

**Feature:** ProductVariant Aggregate  
**Mission Type:** software-dev  
**Ticket:** T-005 (Tier 2 — Domain Entities)  
**Depends On:** T-001 (Money Value Object)

Implement the `ProductVariant` aggregate that tracks inventory stock levels and manages stock reservations for e-commerce shopping cart operations. This aggregate ensures inventory accuracy during concurrent checkout scenarios by enforcing stock availability and providing reservation lifecycle management.

---

## 2. User Scenarios & Testing

### Primary User Flows

| # | Scenario | Actor | Trigger | Expected Outcome |
|---|----------|-------|---------|------------------|
| 1 | Check stock availability | System | Product page load | `availableStock` computed as `totalOnHand - sumReserved` |
| 2 | Reserve stock for checkout | Checkout Feature | `reserve(orderId, qty)` | If `qty <= availableStock` → reservation created; partial reservation created if `qty > availableStock`; event emitted |
| 3 | Release reservation on cart abandonment | Checkout Feature | `releaseReservation(orderId)` | Reservation removed; event emitted |
| 4 | Confirm depletion after payment | Checkout Feature | `confirmDepletion(orderId)` | `totalOnHand` reduced; reservation removed; `StockDepleted` event if threshold reached |
| 5 | Low stock warning | Inventory Monitor | `totalOnHand` drops below threshold | `StockDepleted` event fired |

### Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| E1 | Reserve more than available stock | Partial reservation created for available amount; operation succeeds |
| E2 | Release non-existent reservation | Silent success (no-op) |
| E3 | `totalOnHand` drops below 0 | Invariant violation prevented |
| E4 | Confirm depletion with non-existent orderId | Silent success (no-op) |

---

## 3. Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | `availableStock` must compute as `totalOnHand - sumReserved` | Pending |
| FR-002 | `reserve(orderId, qty)` creates a `StockReservation` if stock available; if `qty > availableStock`, reserve the available amount | Pending |
| FR-003 | `releaseReservation(orderId)` removes reservation and emits `StockReleased` event | Pending |
| FR-004 | `confirmDepletion(orderId)` reduces `totalOnHand` by reserved quantity, removes reservation | Pending |
| FR-005 | `totalOnHand` invariant: `totalOnHand >= 0` must always hold | Pending |
| FR-006 | All reservation operations emit appropriate domain events | Pending |

---

## 4. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|------------|--------|
| NFR-001 | Stock calculations must use integer arithmetic (cents) | No floating-point errors | Pending |
| NFR-002 | `availableStock` computation must be O(1) | < 1ms | Pending |

---

## 5. Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | `totalOnHand` cannot be negative | Enforced |
| C-002 | Reservation quantity must be positive | Enforced |
| C-003 | Aggregate is immutable — operations return new instances | Enforced |

---

## 6. Key Entities

### ProductVariant (Aggregate Root)

| Field | Type | Description |
|-------|------|-------------|
| `skuId` | string | Unique product variant identifier |
| `totalOnHand` | integer | Total inventory count |
| `sold` | integer | Total units sold |
| `reservations` | StockReservation[] | Active stock reservations |
| `availableStock` | integer (derived) | `totalOnHand - sum(reservations.quantity)` |

### StockReservation (Value Object)

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | string | Associated order identifier |
| `quantity` | integer | Reserved quantity |
| `timestamp` | Date | When reservation was created |

---

## 7. Domain Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `StockReserved` | Successful reservation | `{ skuId, orderId, quantity, timestamp }` |
| `StockReleased` | Reservation released | `{ skuId, orderId, quantity }` |
| `StockDepleted` | `totalOnHand` below threshold | `{ skuId, totalOnHand, threshold }` |

---

## 8. Success Criteria

| # | Criterion | Metric |
|---|-----------|--------|
| SC-001 | Available stock computed correctly | `availableStock = totalOnHand - sumReserved` for all test cases |
| SC-002 | Partial reservations work | When `qty > availableStock`, reservation succeeds for `availableStock` |
| SC-003 | Stock invariants protected | `totalOnHand >= 0` after all operations |
| SC-004 | Domain events emitted | All mutations publish appropriate events |
| SC-005 | Unit tests pass | 100% coverage for stock math and reservation lifecycle |

---

## 9. Assumptions

- Low-stock threshold for `StockDepleted` event defaults to 5 units (configurable in future)
- `orderId` format follows UUID v4 standard
- Stock reservations are time-bound (TTL not in scope for this ticket)
