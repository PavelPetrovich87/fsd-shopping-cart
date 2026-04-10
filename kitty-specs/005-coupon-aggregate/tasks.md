# Tasks: Coupon Aggregate

**Feature**: 005-coupon-aggregate | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)
**Generated**: 2026-04-09 | **WP Count**: 2

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Create types.ts with CouponProps, CouponMode, and event payload interfaces | WP01 | ✓ | [D] |
| T002 | Create events.ts with domain event type definitions | WP01 | ✓ | [D] |
| T003 | Create coupon.ts aggregate root with validation and discount calculation | WP02 | | [D] |
| T004 | Create coupon.test.ts unit tests | WP02 | | [D] |
| T005 | Create index.ts public API exports | WP02 | | [D] |

## Work Packages

---

### WP01: Foundation — Types & Events

**Goal**: Create the type definitions and domain event structures that form the foundation of the Coupon aggregate.

**Priority**: High (foundation for WP02)

**Independent Test**: N/A (types file, not runnable)

**Included Subtasks**:
- [x] T001: Create types.ts with CouponProps, CouponMode, and event payload interfaces
- [x] T002: Create events.ts with domain event type definitions

**Implementation Sketch**:
1. Create `src/entities/coupon/model/types.ts`
2. Create `src/entities/coupon/model/events.ts`
3. Both files are independent (can be done in parallel)

**Parallel Opportunities**: T001 and T002 are independent

**Dependencies**: None

**Risks**: Low — straightforward type definitions

**Estimated Prompt Size**: ~250 lines

---

### WP02: Implementation — Coupon Aggregate, Tests, Public API

**Goal**: Implement the Coupon aggregate root with full discount calculation logic, unit tests, and public API exports.

**Priority**: High (core implementation)

**Independent Test**: `npm test src/entities/coupon/model/coupon.test.ts`

**Included Subtasks**:
- [x] T003: Create coupon.ts aggregate root with validation and discount calculation
- [x] T004: Create coupon.test.ts unit tests
- [x] T005: Create index.ts public API exports

**Implementation Sketch**:
1. Implement `coupon.ts` with:
   - Private constructor with full CouponProps
   - Static factory methods for flat and percentage coupons
   - `isValid(now: Date)` method checking isActive → validFrom → expiresAt
   - `calculateDiscount(subtotal: Money, now: Date)` method
   - Event emission via provided EventBus
2. Write comprehensive unit tests covering:
   - Flat discount calculation
   - Percentage discount calculation
   - Validity period enforcement (validFrom, expiresAt)
   - 100% discount floor protection
   - Immutable operations (no mutation)
   - Event emission
3. Create public API index.ts exporting all public types and the Coupon class

**Parallel Opportunities**: None (T003 is prerequisite for T004)

**Dependencies**: WP01 (types and events must exist first)

**Risks**: 
- Integer arithmetic edge cases for percentage calculations
- Date comparison edge cases (timezone handling)

**Estimated Prompt Size**: ~350 lines

---

## Summary

| WP | Subtasks | Size | Dependencies |
|---|---|---|---|
| WP01 | T001, T002 | ~250 lines | None |
| WP02 | T003, T004, T005 | ~350 lines | WP01 |

**Execution Order**: WP01 → WP02

**MVP Scope**: Both WPs are required for the feature to be functional.
