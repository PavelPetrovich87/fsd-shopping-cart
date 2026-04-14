# Apply Coupon Feature — T-013

## Mission

**Mission Number**: 013
**Mission Type**: software-dev
**Friendly Name**: apply coupon feature
**Target Branch**: main

---

## 1. Overview & Context

### Purpose

Allow shoppers to apply a coupon code to their cart, receive a discount, and remove the coupon if needed. The feature validates the code via the Coupon repository, applies a discount to the cart subtotal, and emits feature-specific domain events.

### Scope

- Apply a single coupon to the active cart
- Remove the applied coupon
- Calculate and display discount before order completion
- Only one coupon can be active on a cart at a time (no stacking)

### Out of Scope

- Coupon creation/management (handled by Coupon entity, T-006)
- Automatic coupon suggestions
- Coupon usage limits per user
- Expiration enforcement (Coupon entity handles validity periods)

### Dependencies

- T-004: Cart Aggregate
- T-006: Coupon Aggregate
- T-007: ICartRepository, ICouponRepository ports
- T-008: Mock repositories (Coupon and Inventory)
- T-009: Zustand cart repository
- T-010: Cart repository contract fix (async ICartRepository)
- T-011: Cart Actions feature (event patterns)
- T-012: EventBus publish fix (eventType)

---

## 2. User Scenarios & Testing

### Primary Flow: Apply Coupon

1. User enters a coupon code in the CouponInput field
2. User clicks "Apply" or presses Enter
3. System validates the code via `ICouponRepository.findByCode(code)`
4. If code is empty → show error "Please enter a valid code"
5. If code not found → show error "Sorry, but this coupon doesn't exist"
6. If code found → apply discount to cart, save cart via `ICartRepository.saveCart()`, emit `CouponApplied` event
7. Show success state (applied coupon tag)

### Primary Flow: Remove Coupon

1. User clicks the "×" button on the applied coupon tag
2. System removes the coupon from the cart, recalculates subtotal
3. System saves the updated cart, emits `CouponRemoved` event
4. CouponInput returns to empty/default state

### Edge Cases

| Scenario | Expected Behavior |
| -------- | ----------------- |
| Empty code submitted | Error: "Please enter a valid code" |
| Whitespace-only code | Treated as empty, same error |
| Invalid code (not in repository) | Error: "Sorry, but this coupon doesn't exist" |
| Valid code applied, then re-applied | No change (idempotent), emit `CouponApplied` again |
| Cart has no active coupon, RemoveCoupon called | No-op, no error |
| Coupon applied to empty cart | Allowed (discount = $0.00) |
| Expired coupon code | Coupon entity (T-006) validates expiry; if invalid, return "Sorry, but this coupon doesn't exist" |

---

## 3. Requirements

### Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | `ApplyCoupon` use case validates code via `ICouponRepository.findByCode(code)` | pending |
| FR-002 | Empty code → error message: "Please enter a valid code" | pending |
| FR-003 | Invalid code → error message: "Sorry, but this coupon doesn't exist" | pending |
| FR-004 | Valid code → discount applied to cart, `ICartRepository.saveCart(cart)` called | pending |
| FR-005 | Only one coupon can be active on a cart at a time (replacing any existing coupon) | pending |
| FR-006 | `CouponApplied` event emitted after successful application | pending |
| FR-007 | `RemoveCoupon` use case removes coupon from cart, recalculates subtotal | pending |
| FR-008 | `CouponRemoved` event emitted after successful removal | pending |
| FR-009 | Cart transitions through `initiateCheckout()` after coupon applied are independent of checkout lifecycle | pending |

### Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | Coupon validation response time | < 200ms | pending |
| NFR-002 | Discount calculation precision | Exact (no floating-point errors; use Money type) | pending |

### Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Feature events (CouponApplied, CouponRemoved) are separate from Coupon entity events (CouponValidated, CouponValidationFailed, DiscountCalculated) | pending |
| C-002 | No coupon stacking — only one active coupon per cart | pending |
| C-003 | All imports must be FSD-compliant: entities/cart, entities/coupon, shared/lib | pending |

---

## 4. Success Criteria

| # | Criterion | Measurable Outcome |
|---|-----------|-------------------|
| SC-1 | User can apply a valid coupon | Coupon code accepted, discount reflected in cart total |
| SC-2 | User sees error for invalid code | Error message displayed within 500ms of submission |
| SC-3 | User can remove applied coupon | Coupon tag removed, original price restored |
| SC-4 | Only one coupon active at a time | Applying new coupon replaces existing one |
| SC-5 | Events are published on apply/remove | `CouponApplied` / `CouponRemoved` subscribers receive events |
| SC-6 | All lint and build checks pass | `npm run lint`, `npm run lint:arch`, `npm run build` exit 0 |

---

## 5. Key Entities & Data Shapes

### Feature Events

```typescript
interface CouponApplied {
  eventType: 'CouponApplied';
  couponCode: string;
  discountAmount: number; // cents
  timestamp: string;
}

interface CouponRemoved {
  eventType: 'CouponRemoved';
  couponCode: string;
  timestamp: string;
}
```

### Use Case Results

```typescript
interface ApplyCouponSuccess {
  success: true;
  couponCode: string;
  discount: Money;
  event: CouponApplied;
}

interface ApplyCouponError {
  success: false;
  error: 'EMPTY_CODE' | 'INVALID_CODE' | 'COUPON_EXPIRED';
  message: string;
}
```

---

## 6. Assumptions

- Cart entity (T-004) supports a `couponCode` field on the aggregate root
- Coupon entity (T-006) validates expiration; expired coupons are treated as invalid
- The EventBus is already fixed (T-012) to use `eventType` for handler lookup
- Async ICartRepository (T-010) is in place; `getCart()` returns `Promise<Cart>`

---

## 7. Files to Create

| File | Purpose |
| ---- | ------- |
| `src/features/apply-coupon/model/apply-coupon.ts` | ApplyCoupon use case |
| `src/features/apply-coupon/model/remove-coupon.ts` | RemoveCoupon use case |
| `src/features/apply-coupon/model/calculate-discount.ts` | CalculateDiscount use case (optional helper) |
| `src/features/apply-coupon/model/apply-coupon.test.ts` | Unit tests for ApplyCoupon, RemoveCoupon |
| `src/features/apply-coupon/index.ts` | Public API re-exports |

---

## 8. Acceptance Criteria Checklist

- [ ] `ApplyCoupon` validates code via `ICouponRepository`
- [ ] Empty code → "Please enter a valid code" error
- [ ] Invalid code → "Sorry, but this coupon doesn't exist" error
- [ ] Valid code → discount applied, events emitted
- [ ] `RemoveCoupon` removes and recalculates
- [ ] Unit tests with mock repositories
- [ ] Feature events: `CouponApplied`, `CouponRemoved` (separate from Coupon entity events)
- [ ] No coupon stacking
- [ ] All lint/build checks pass