# Implementation Plan: Coupon Aggregate

**Branch**: `005-coupon-aggregate` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)

## Summary

Implement a `Coupon` aggregate root that validates coupon codes and calculates discounts against a cart subtotal. Supports flat-amount and percentage discount modes with optional validity periods. Emits typed domain events. Depends on existing `Money` VO and `EventBus` from shared/lib.

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: `Money` (shared/lib), `EventBus` (shared/lib)  
**Storage**: In-memory (mock repository via fixtures, real persistence in T-008)  
**Testing**: Vitest (matching project convention)  
**Target Platform**: Web (React 19 SPA)  
**Project Type**: FSD Feature-Sliced Design module  
**Performance Goals**: N/A (in-memory domain logic)  
**Constraints**: Integer arithmetic for all currency calculations  
**Scale/Scope**: Single domain aggregate, ~6 files

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Percentage storage | Separate `percentageValue: number` field | Cleaner than storing percentage as Money cents |
| Validity checking | Inline date comparison in aggregate | Simple business logic, no external service needed |
| Discount floor | Enforced at calculation time | Prevents negative totals at domain level |

## Project Structure

### Source Code

```
src/
└── entities/
    └── coupon/
        ├── model/
        │   ├── coupon.ts              # Aggregate root
        │   ├── types.ts               # CouponMode, CouponProps interfaces
        │   ├── events.ts              # Domain event types
        │   └── coupon.test.ts         # Unit tests
        └── index.ts                   # Public API (re-exports)
```

### Feature Scope (from T-006 ticket)

Files to create:
- `src/entities/coupon/model/coupon.ts` — Coupon aggregate
- `src/entities/coupon/model/types.ts` — CouponMode, CouponProps, CouponValidated, CouponValidationFailed, DiscountCalculated types
- `src/entities/coupon/model/events.ts` — Domain event definitions
- `src/entities/coupon/model/coupon.test.ts` — Unit tests
- `src/entities/coupon/index.ts` — Public API

## Data Model

### Coupon (Aggregate Root)

```typescript
interface CouponProps {
  code: string                    // Unique identifier (normalized to uppercase)
  discountMode: 'flat' | 'percentage'
  discountAmount?: Money          // For flat mode (e.g., $5 off)
  percentageValue?: number        // For percentage mode (e.g., 10 = 10%)
  validFrom?: Date | null         // Optional start date
  expiresAt?: Date | null         // Optional expiration date
  isActive: boolean               // Deactivation flag
}
```

### Domain Events

```typescript
interface CouponValidated {
  type: 'CouponValidated'
  couponCode: string
  timestamp: Date
}

interface CouponValidationFailed {
  type: 'CouponValidationFailed'
  couponCode: string
  reason: 'expired' | 'not_yet_active' | 'inactive' | 'not_found'
  timestamp: Date
}

interface DiscountCalculated {
  type: 'DiscountCalculated'
  couponCode: string
  subtotal: Money
  discount: Money
  resultingTotal: Money
  timestamp: Date
}
```

## Implementation Notes

1. **Immutability**: All operations return new Coupon instances
2. **Code normalization**: Codes normalized to uppercase on creation
3. **Validation order**: Check `isActive` → check `validFrom` → check `expiresAt`
4. **Discount calculation**: `discount = mode === 'flat' ? amount : subtotal * percentage / 100`
5. **Floor enforcement**: `Math.max(0, calculatedDiscount)`

## Charter Check

*No charter file present — skipped*

## Complexity Tracking

| Aspect | Decision | Justification |
|---|---|---|
| Two discount modes | Separate fields | Cleaner than encoding percentage as Money cents |
| Optional dates | Nullable fields | Supports both dated and undated coupons |

## Next Phase

Ready for `/spec-kitty.tasks` to generate work packages.
