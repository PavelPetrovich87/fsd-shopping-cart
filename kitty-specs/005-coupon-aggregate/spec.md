# Specification: Coupon Aggregate

## 1. Concept & Vision

A `Coupon` aggregate that encapsulates all coupon business logic, including discount calculation, validity period enforcement, and domain events. The aggregate supports both flat-amount and percentage-based discount modes, applies cart-wide to the entire subtotal, and ensures discounts never reduce the total below zero.

## 2. Feature Summary

Implement a `Coupon` aggregate root that validates coupon codes and calculates discounts against a cart subtotal. Coupons are cart-wide (apply to entire subtotal), have optional validity periods (`validFrom` / `expiresAt`), and support unlimited redemptions. The aggregate emits typed domain events for validation and discount calculation.

## 3. User Scenarios & Testing

### Primary User Flows

1. **Apply Valid Flat Coupon**
   - User enters coupon code "SAVE5" (flat $5 off)
   - Cart subtotal is $100
   - Coupon calculates $5 discount → new total $95

2. **Apply Valid Percentage Coupon**
   - User enters coupon code "SAVE10PCT" (10% off)
   - Cart subtotal is $100
   - Coupon calculates $10 discount → new total $90

3. **Apply Coupon with Validity Period**
   - Coupon has `validFrom` = tomorrow, `expiresAt` = next week
   - Attempting to apply today → rejected with "Coupon not yet active"
   - Attempting to apply after expiry → rejected with "Coupon has expired"

4. **100% Discount Capping**
   - User enters 100% coupon with $25 subtotal
   - Discount capped at $25 → total becomes $0.00 (not negative)

5. **Invalid Coupon Code**
   - User enters non-existent code → validation fails, domain event emitted

## 4. Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-001 | Coupon aggregate must support two discount modes: `flat` and `percentage` | Pending |
| FR-002 | Flat discount: subtracts fixed amount (e.g., $5 off) | Pending |
| FR-003 | Percentage discount: calculates percentage of subtotal (e.g., 10% off) | Pending |
| FR-004 | Discount calculation must never result in negative totals (minimum $0.00) | Pending |
| FR-005 | Coupon must support optional `validFrom` date — reject if current date is before | Pending |
| FR-006 | Coupon must support optional `expiresAt` date — reject if current date is after | Pending |
| FR-007 | Coupon must emit `CouponValidated` event when code is valid | Pending |
| FR-008 | Coupon must emit `CouponValidationFailed` event when code is invalid or expired | Pending |
| FR-009 | Coupon must emit `DiscountCalculated` event after discount computation | Pending |
| FR-010 | All Coupon operations must be immutable — methods return new instances | Pending |

## 5. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | Discount calculation must use integer arithmetic (cents) to avoid floating-point errors | Exact | Pending |

## 6. Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Discount modes limited to: `flat` and `percentage` | Pending |
| C-002 | Discount amount must be ≥ 0 | Pending |
| C-003 | Percentage discount must be between 0% and 100% | Pending |

## 7. Success Criteria

1. **Discount Accuracy**: Flat and percentage discounts calculate correctly to the cent
2. **Floor Protection**: Applying any coupon never results in a total below $0.00
3. **Validity Enforcement**: Expired or not-yet-active coupons are rejected
4. **Event Emission**: All state changes emit corresponding typed domain events
5. **Immutability**: All operations return new Coupon instances without mutation
6. **Test Coverage**: Unit tests cover happy paths, edge cases, and boundary conditions

## 8. Key Entities

### Coupon (Aggregate Root)

| Field | Type | Description |
|---|---|---|
| `code` | `string` | Unique coupon identifier |
| `discountMode` | `flat \| percentage` | Type of discount |
| `discountValue` | `Money` | Discount amount or percentage value |
| `validFrom` | `Date \| null` | Optional start date |
| `expiresAt` | `Date \| null` | Optional expiration date |
| `isActive` | `boolean` | Whether coupon can be applied |

### Domain Events

| Event | Trigger |
|---|---|
| `CouponValidated` | Coupon code is valid and within validity period |
| `CouponValidationFailed` | Code invalid, expired, or not yet active |
| `DiscountCalculated` | Discount amount computed against subtotal |

## 9. Assumptions

- Coupon codes are case-insensitive for lookup (normalized to uppercase)
- `validFrom` being `null` means coupon has no start restriction
- `expiresAt` being `null` means coupon never expires
- Currency is determined by the context (assumed USD for this implementation)
