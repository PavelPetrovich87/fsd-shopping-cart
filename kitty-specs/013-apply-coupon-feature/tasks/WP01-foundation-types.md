---
work_package_id: WP01
title: Foundation — Types & Events
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-005
- FR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: main → main (single lane)
subtasks:
- T001
- T002
- T003
history:
- date: '2026-04-15'
  action: created
  details: Initial WP01 prompt
authoritative_surface: src/features/apply-coupon/
execution_mode: code_change
owned_files:
- src/features/apply-coupon/model/errors.ts
- src/features/apply-coupon/model/events.ts
- src/features/apply-coupon/model/results.ts
tags: []
---

# WP01: Foundation — Types & Events

## Objective

Create the foundational type files for the Apply Coupon feature. These files define the error discriminated union, feature event interfaces, and result types that the use cases (`ApplyCoupon`, `RemoveCoupon`) will depend on.

## Context

This work package creates the type layer that mirrors T-011 (Cart Actions) patterns:
- Same file structure: `errors.ts`, `events.ts`, `results.ts` in `model/` directory
- Same discriminated union pattern for errors
- Same result shape with `success: true/false` discrimination

### Dependencies

None — this is the foundation layer with no dependencies on other code.

### Reference Files

- T-011 Cart Actions errors: `src/features/cart-actions/model/errors.ts`
- T-011 Cart Actions results: `src/features/cart-actions/model/results.ts`
- Apply Coupon spec: `kitty-specs/013-apply-coupon-feature/spec.md`
- Apply Coupon plan: `kitty-specs/013-apply-coupon-feature/plan.md`

---

## Subtasks

### T001: Create `model/errors.ts` — ApplyCouponError Discriminated Union

**Purpose**: Define the error type that `ApplyCoupon` can return. Follow the T-011 pattern of discriminated unions.

**Steps**:

1. Create `src/features/apply-coupon/model/errors.ts`
2. Define `ApplyCouponError` type as a discriminated union with three variants:
   ```typescript
   export type ApplyCouponError =
     | { type: 'EMPTY_CODE'; message: string }
     | { type: 'INVALID_CODE'; message: string }
     | { type: 'COUPON_EXPIRED'; message: string };
   ```
3. Each error variant MUST have:
   - `type`: The error discriminant ('EMPTY_CODE' | 'INVALID_CODE' | 'COUPON_EXPIRED')
   - `message`: Human-readable error message for UI display

**Files**:
- Create: `src/features/apply-coupon/model/errors.ts`

**Validation**:
- [ ] File exports `ApplyCouponError` type
- [ ] Type has exactly 3 variants: EMPTY_CODE, INVALID_CODE, COUPON_EXPIRED
- [ ] Each variant has `type` and `message` fields
- [ ] TypeScript compiles without errors

---

### T002: Create `model/events.ts` — Feature Event Interfaces

**Purpose**: Define the feature-specific domain events that `ApplyCoupon` and `RemoveCoupon` will publish via EventBus.

**Steps**:

1. Create `src/features/apply-coupon/model/events.ts`
2. Define two event interfaces:
   ```typescript
   export interface CouponApplied {
     eventType: 'CouponApplied';
     couponCode: string;
     discountAmountCents: number;
     occurredAt: Date;
   }

   export interface CouponRemoved {
     eventType: 'CouponRemoved';
     couponCode: string;
     occurredAt: Date;
   }
   ```

**Important**: The `eventType` field uses `'CouponApplied'` and `'CouponRemoved'` (not `'type'`). This is the pattern established by T-012 EventBus fix where cart actions use `eventType`. These are **feature-specific events** separate from Coupon entity events (`CouponValidated`, `CouponValidationFailed`, `DiscountCalculated` from T-006).

**Files**:
- Create: `src/features/apply-coupon/model/events.ts`

**Validation**:
- [ ] File exports `CouponApplied` and `CouponRemoved` interfaces
- [ ] Both have `eventType` field (not `type`)
- [ ] `CouponApplied` has: `eventType`, `couponCode`, `discountAmountCents`, `occurredAt`
- [ ] `CouponRemoved` has: `eventType`, `couponCode`, `occurredAt`
- [ ] TypeScript compiles without errors

---

### T003: Create `model/results.ts` — Use Case Result Types

**Purpose**: Define the result types returned by `ApplyCoupon` and `RemoveCoupon` use cases. Follow the T-011 pattern with `success` discriminant.

**Steps**:

1. Create `src/features/apply-coupon/model/results.ts`
2. Import types from:
   - `@/entities/cart` for `Cart`
   - `@/entities/coupon` for `Coupon` (the entity, for type reference)
   - `./errors` for `ApplyCouponError`
   - `./events` for `CouponApplied`, `CouponRemoved`
3. Define result types:
   ```typescript
   import type { Cart } from '@/entities/cart';
   import type { ApplyCouponError } from './errors';
   import type { CouponApplied, CouponRemoved } from './events';

   export type ApplyCouponResult =
     | { success: true; cart: Cart; event: CouponApplied }
     | { success: false; error: ApplyCouponError };

   export type RemoveCouponResult =
     | { success: true; cart: Cart; event: CouponRemoved }
     | { success: false; error: never };  // RemoveCoupon has no failure path
   ```

**Note**: `RemoveCouponResult` success path includes `CouponRemoved` event — even though the spec says it's a no-op when no coupon is applied, we still emit the event (with empty couponCode or similar). Verify the spec behavior — if no coupon is applied, return `{ success: true; cart: Cart }` without an event. The spec says "Cart has no active coupon, RemoveCoupon called → No-op, no error", so the event should only fire when something was actually removed.

**Files**:
- Create: `src/features/apply-coupon/model/results.ts`

**Validation**:
- [ ] File exports `ApplyCouponResult` and `RemoveCouponResult` types
- [ ] `ApplyCouponResult` discriminated by `success: true/false`
- [ ] Success case has `cart: Cart` and `event: CouponApplied`
- [ ] Failure case has `error: ApplyCouponError`
- [ ] `RemoveCouponResult` has no failure path (error is `never`)
- [ ] TypeScript compiles without errors

---

## Implementation Notes

### File Structure

```
src/features/apply-coupon/
└── model/
    ├── errors.ts      # T001: ApplyCouponError discriminated union
    ├── events.ts     # T002: CouponApplied, CouponRemoved interfaces
    ├── results.ts    # T003: ApplyCouponResult, RemoveCouponResult
    ├── apply-coupon.ts   # WP02
    ├── remove-coupon.ts  # WP02
    ├── index.ts          # WP02
    └── apply-coupon.test.ts  # WP03
└── index.ts               # WP02
```

### TypeScript Patterns

- Use `import type` for type-only imports
- Discriminated unions use string literal types for the discriminant
- No implementation logic in these files — pure type definitions

### Error Messages (from spec)

- Empty code: "Please enter a valid code"
- Invalid code: "Sorry, but this coupon doesn't exist"
- Expired: (spec doesn't define a message — use "This coupon has expired" or similar)

---

## Definition of Done

- [ ] T001: `errors.ts` created with `ApplyCouponError` type
- [ ] T002: `events.ts` created with `CouponApplied` and `CouponRemoved` interfaces
- [ ] T003: `results.ts` created with `ApplyCouponResult` and `RemoveCouponResult` types
- [ ] All files compile without TypeScript errors
- [ ] All files follow T-011 patterns exactly

## Risks & Reviewer Guidance

**Risks**:
- Type conflicts with existing Cart/Coupon entities (unlikely since these are feature-specific)
- Event interface field naming must match EventBus expectations (`eventType`, not `type`)

**Reviewer Checklist**:
- [ ] Errors match spec error messages exactly
- [ ] Events use `eventType` field (not `type`)
- [ ] Results follow discriminated union pattern from T-011
- [ ] No runtime logic in these files (pure types only)
- [ ] TypeScript compilation succeeds