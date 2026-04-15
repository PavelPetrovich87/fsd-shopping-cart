# WP02 Review Cycle 1 — Requested Changes

## Issue 1: Unused imports (ESLint errors — `npm run lint` fails)

**File**: `src/features/apply-coupon/model/apply-coupon.ts`
- Line 8: `removeCoupon` is imported from `@/entities/cart` but never used
- Fix: Remove `removeCoupon` from the import — only `applyCoupon` and `getSubtotalCents` are needed

**File**: `src/features/apply-coupon/model/remove-coupon.ts`
- Line 5: `applyCoupon` is imported from `@/entities/cart` but never used
- Fix: Remove `applyCoupon` from the import — only `removeCoupon` is needed

## Issue 2: Type mismatch — `RemoveCouponResult` doesn't handle the no-coupon no-event case

**Problem**: The `RemoveCouponResult` type (defined in WP01 `results.ts`) requires `event: CouponRemoved` on the success path:
```typescript
export type RemoveCouponResult =
  | { success: true; cart: Cart; event: CouponRemoved }
  | { success: false; error: never };
```

But `remove-coupon.ts` returns `{ success: true, cart }` (without `event`) when the cart has no coupon. This will cause a TypeScript error once all lanes are merged.

**Fix needed in WP01 `results.ts`** (already approved — needs rework): Split the success variant into two:
```typescript
export type RemoveCouponResult =
  | { success: true; cart: Cart; event: CouponRemoved }
  | { success: true; cart: Cart }
  | { success: false; error: never };
```

Or more simply, make event optional:
```typescript
export type RemoveCouponResult =
  | { success: true; cart: Cart; event?: CouponRemoved }
  | { success: false; error: never };
```

The spec says: "Cart has no active coupon, RemoveCoupon called → No-op, no error" — so the no-event success case must be represented in the type.

## Summary

| Issue | Severity | File(s) | Fix |
|-------|----------|---------|-----|
| Unused imports | Error (lint) | `apply-coupon.ts`, `remove-coupon.ts` | Remove unused imports |
| Type mismatch | Error (type) | `results.ts` (WP01) + `remove-coupon.ts` | Update `RemoveCouponResult` to allow success without event |
