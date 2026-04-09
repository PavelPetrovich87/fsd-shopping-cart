# Task Breakdown: Cart Aggregate & CartItem Entity

**Mission**: `006-cart-aggregate-entity`  
**Feature**: T-004 — Cart Aggregate + CartItem Entity  
**Created**: 2026-04-09

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create types.ts with CartState enum and CartItem type | WP01 | Yes | [D] |
| T002 | Create events.ts with all domain event interfaces | WP01 | Yes | [D] |
| T003 | Create cart-item.ts with CartItem entity class | WP01 | Yes | [D] |
| T004 | Create cart.ts foundation (constructor, factory, items map) | WP02 | No |
| T005 | Implement addItem operation with event emission | WP02 | No |
| T006 | Implement removeItem operation with event emission | WP02 | No |
| T007 | Implement changeQuantity with qty ≥ 1 enforcement | WP02 | No |
| T008 | Implement clearCart operation with event emission | WP02 | No |
| T009 | Implement coupon operations (applyCoupon, removeCoupon) | WP02 | No |
| T010 | Implement state transitions (initiateCheckout, markCheckedOut) | WP02 | No |
| T011 | Implement subtotal computation using Money | WP02 | No |
| T012 | Create index.ts with public API exports | WP03 | No |
| T013 | Create cart.test.ts with comprehensive unit tests | WP03 | No |

---

## Work Package 1: Foundation - Types, Events, CartItem Entity

**Priority**: P0 (Foundation - blocks all other WPs)  
**Goal**: Create foundational types and CartItem entity  
**Independent Test**: None (pure definitions)

**Included Subtasks**:
- [ ] T001: Create types.ts with CartState enum and CartItem type
- [ ] T002: Create events.ts with all domain event interfaces
- [ ] T003: Create cart-item.ts with CartItem entity class

**Implementation Sketch**:
1. Define `CartState` enum with `Active`, `Checkout_Pending`, `Checked_Out`
2. Define `CartItemData` interface with `skuId`, `name`, `unitPriceCents`, `quantity`, `createdAt`
3. Define all domain event interfaces (`ItemAddedToCart`, `CartItemQuantityChanged`, etc.)
4. Create immutable `CartItem` class with factory method
5. Add `totalPriceCents` getter (quantity × unitPriceCents)

**Risks**: Low — pure definitions, no business logic

---

## Work Package 2: Cart - Full Implementation

**Priority**: P1 (Core functionality)  
**Goal**: Implement complete Cart aggregate with all operations  
**Independent Test**: WP01 complete

**Included Subtasks**:
- [ ] T004: Create cart.ts foundation (constructor, factory, items map)
- [ ] T005: Implement addItem operation with event emission
- [ ] T006: Implement removeItem operation with event emission
- [ ] T007: Implement changeQuantity with qty ≥ 1 enforcement
- [ ] T008: Implement clearCart operation with event emission
- [ ] T009: Implement coupon operations (applyCoupon, removeCoupon)
- [ ] T010: Implement state transitions (initiateCheckout, markCheckedOut)
- [ ] T011: Implement subtotal computation using Money

**Implementation Sketch**:
1. Create immutable `Cart` class with private constructor
2. Store items as `ReadonlyMap<skuId, CartItem>`
3. Item operations: addItem, removeItem, changeQuantity, clearCart
4. Coupon operations: applyCoupon, removeCoupon
5. State transitions: initiateCheckout, markCheckedOut
6. Computed: subtotalCents, itemCount, uniqueItemCount

**Parallel Opportunities**: None — all operations in same file

**Dependencies**: WP01

**Risks**: Medium — need to ensure immutable pattern is consistent

---

## Work Package 3: Polish - Public API and Tests

**Priority**: P2 (Polish)  
**Goal**: Export public API and verify with unit tests  
**Independent Test**: WP01, WP02 complete

**Included Subtasks**:
- [ ] T012: Create index.ts with public API exports
- [ ] T013: Create cart.test.ts with comprehensive unit tests

**Implementation Sketch**:
1. `index.ts`: Re-export `Cart`, `CartItem`, `CartState`, all events, types
2. Test file covers all 10 scenarios from spec:
   - CartItem creation and totalPrice
   - addItem (new + increment existing)
   - removeItem
   - changeQuantity (qty ≥ 1 enforcement)
   - clearCart
   - applyCoupon / removeCoupon
   - state transitions
   - subtotal computation
   - Event emission verification

**Parallel Opportunities**: None — depends on all previous WPs

**Dependencies**: WP01, WP02

**Risks**: Low — well-defined tests against spec scenarios

---

## Summary

| WP | Subtasks | Est. Prompt Size | Dependencies |
|----|----------|------------------|--------------|
| WP01 | T001, T002, T003 (3) | ~250 lines | None |
| WP02 | T004-T011 (8) | ~600 lines | WP01 |
| WP03 | T012, T013 (2) | ~350 lines | WP01, WP02 |

**Total**: 13 subtasks across 3 work packages

**MVP Scope**: WP01 + WP02 (Foundation + Full Implementation)
