# Implementation Plan: Apply Coupon Feature

**Branch**: `013-apply-coupon-feature` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)

## Summary

Implement `ApplyCoupon`, `RemoveCoupon`, and `CalculateDiscount` use cases in `features/apply-coupon` that validate coupon codes via `ICouponRepository` and apply/remove discounts from the cart. Follows T-011 (Cart Actions) patterns exactly: same file structure (`errors.ts`, `results.ts`, use case files), same discriminated union error shape, same EventBus publish pattern. Only one coupon active per cart (no stacking). Feature-specific events (`CouponApplied`, `CouponRemoved`) separate from Coupon entity events.

## Technical Context

| Field | Value |
|-------|-------|
| **Language/Version** | TypeScript 5.9 |
| **Primary Dependencies** | React 19, Zustand, EventBus, Money (from shared/lib) |
| **Storage** | N/A (in-memory mock repositories via ICouponRepository port) |
| **Testing** | Vitest (unit tests with mocked repositories) |
| **Target Platform** | Web (React SPA) |
| **Project Type** | Single - FSD React application |
| **Performance Goals** | Coupon validation < 200ms |
| **Scale/Scope** | Single feature; 3 use cases, ~5 files |

## Engineering Alignment

Follow T-011 (Cart Actions) patterns exactly:
- Same file structure: `model/errors.ts`, `model/results.ts`, `model/apply-coupon.ts`, `model/remove-coupon.ts`, `model/index.ts`, `model/apply-coupon.test.ts`
- Same discriminated union error pattern: `{ type: 'EMPTY_CODE' | 'INVALID_CODE' | 'COUPON_EXPIRED'; message: string }`
- Same result shape: `{ success: true; cart: Cart; event: CouponApplied } | { success: false; error: ApplyCouponError }`
- Same EventBus usage: `eventBus.publish(event)` with `eventType` field
- Same FSD import paths: `entities/cart`, `entities/coupon`, `shared/lib`

## Project Structure

### Documentation (this feature)

```
kitty-specs/013-apply-coupon-feature/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md           # N/A (no unknowns)
├── data-model.md         # N/A (no new entities)
├── quickstart.md         # N/A (internal use case)
└── contracts/           # N/A (no external API)
```

### Source Code (repository root)

```
src/features/apply-coupon/
├── model/
│   ├── errors.ts              # ApplyCouponError discriminated union
│   ├── results.ts             # ApplyCouponResult, RemoveCouponResult
│   ├── apply-coupon.ts       # ApplyCoupon use case
│   ├── remove-coupon.ts      # RemoveCoupon use case
│   ├── index.ts               # Re-exports
│   └── apply-coupon.test.ts   # Unit tests (ApplyCoupon + RemoveCoupon)
└── index.ts                   # Public API

src/entities/coupon/
├── model/
│   └── ports.ts               # ICouponRepository (already exists from T-007/T-010)
```

**Structure Decision**: Mirrors T-011 structure exactly as confirmed by user.

## Phase 0: Research

**Status**: Not required — no `[NEEDS CLARIFICATION]` markers in spec.

## Phase 1: Design

### Errors (`model/errors.ts`)

```typescript
export type ApplyCouponError =
  | { type: 'EMPTY_CODE'; message: string }
  | { type: 'INVALID_CODE'; message: string }
  | { type: 'COUPON_EXPIRED'; message: string };
```

### Results (`model/results.ts`)

```typescript
import type { Cart } from '@/entities/cart';
import type { CouponApplied, CouponRemoved } from './events';
import type { ApplyCouponError } from './errors';

export type ApplyCouponResult =
  | { success: true; cart: Cart; event: CouponApplied }
  | { success: false; error: ApplyCouponError };

export type RemoveCouponResult =
  | { success: true; cart: Cart; event: CouponRemoved }
  | { success: false; error: never };  // RemoveCoupon has no failure path
```

### Events (inline in use case files or `./events.ts`)

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

### ApplyCoupon Use Case (`model/apply-coupon.ts`)

```typescript
export async function ApplyCoupon(
  code: string,
  cartRepo: ICartRepository,
  couponRepo: ICouponRepository,
  eventBus: EventBus
): Promise<ApplyCouponResult> {
  // 1. Validate empty code → { type: 'EMPTY_CODE', message: 'Please enter a valid code' }
  // 2. Find coupon via couponRepo.findByCode(code)
  // 3. If not found → { type: 'INVALID_CODE', message: 'Sorry, but this coupon doesn't exist' }
  // 4. If expired (coupon.isValid() === false) → { type: 'COUPON_EXPIRED', ... }
  // 5. Calculate discount: coupon.calculateDiscount(cart.subtotal)
  // 6. Attach coupon to cart (replace any existing coupon — no stacking)
  // 7. cartRepo.saveCart(updatedCart)
  // 8. eventBus.publish(CouponApplied { eventType: 'CouponApplied', couponCode, discountAmountCents })
  // 9. Return { success: true, cart, event }
}
```

### RemoveCoupon Use Case (`model/remove-coupon.ts`)

```typescript
export async function RemoveCoupon(
  cartRepo: ICartRepository,
  eventBus: EventBus
): Promise<RemoveCouponResult> {
  // 1. cartRepo.getCart()
  // 2. If no coupon applied → return { success: true, cart } (no-op)
  // 3. Remove couponCode from cart
  // 4. cartRepo.saveCart(updatedCart)
  // 5. eventBus.publish(CouponRemoved { eventType: 'CouponRemoved', couponCode: removedCode })
  // 6. Return { success: true, cart, event }
}
```

## Acceptance Criteria

- [ ] `ApplyCoupon` validates code via `ICouponRepository`
- [ ] Empty code → "Please enter a valid code" error
- [ ] Invalid code → "Sorry, but this coupon doesn't exist" error
- [ ] Valid code → discount applied, `ICartRepository.saveCart()` called, `CouponApplied` event published
- [ ] `RemoveCoupon` removes and recalculates, publishes `CouponRemoved`
- [ ] Unit tests with mocked repositories (happy + error paths)
- [ ] All lint/build checks pass

## Notes

- No Phase 0 research needed — all unknowns resolved in spec
- No new data models needed beyond what exists in T-006 (Coupon) and T-004 (Cart)
- Feature events (`CouponApplied`, `CouponRemoved`) are separate from Coupon entity events (`CouponValidated`, `CouponValidationFailed`)
- Cart entity must support `couponCode` field — assumed from T-004 implementation
- Async ICartRepository (`getCart(): Promise<Cart>`, `saveCart(): Promise<void>`) — confirmed from T-010