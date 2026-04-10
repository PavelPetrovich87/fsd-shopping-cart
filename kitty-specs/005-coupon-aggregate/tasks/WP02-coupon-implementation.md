---
work_package_id: WP02
title: Implementation — Coupon Aggregate, Tests, Public API
dependencies: [WP01]
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: [T003, T004, T005]
authoritative_surface: src/entities/coupon/
execution_mode: code_change
owned_files: [src/entities/coupon/model/coupon.ts, src/entities/coupon/model/coupon.test.ts, src/entities/coupon/index.ts]
agent: "kilocode:o3:implementer:implementer"
shell_pid: "19423"
---

# Work Package: WP02 — Coupon Aggregate, Tests, Public API

## Objective

Implement the Coupon aggregate root with full discount calculation logic, comprehensive unit tests, and public API exports. This work package delivers the complete, testable Coupon entity.

## Context

**Feature**: Coupon Aggregate (005-coupon-aggregate)
**Spec**: [spec.md](../../spec.md)
**Plan**: [plan.md](../../plan.md)
**Prerequisite**: WP01 (types.ts and events.ts must exist)

### Key Implementation Details

1. **Immutability**: All Coupon methods return new Coupon instances
2. **Code normalization**: Codes stored in uppercase
3. **Validation order**: `isActive` → `validFrom` → `expiresAt`
4. **Discount formula**: `mode === 'flat' ? discountAmount : subtotal.multiply(percentageValue / 100)`
5. **Floor enforcement**: `Math.max(0, calculatedDiscount)` ensures no negative totals

---

## T003: Create coupon.ts

**Purpose**: Implement the Coupon aggregate root with validation and discount calculation.

### Implementation Steps

1. **Create file**: `src/entities/coupon/model/coupon.ts`

2. **Imports**:
   ```typescript
   import { Money } from '@/shared/lib';
   import { EventBus } from '@/shared/lib';
   import type { CouponProps, CouponMode } from './types';
   import type { CouponValidated, CouponValidationFailed, DiscountCalculated } from './events';
   ```

3. **Coupon class with private constructor**:
   ```typescript
   export class Coupon {
     private constructor(private readonly props: CouponProps) {}
   ```

4. **Static factory methods**:
   ```typescript
   // For flat discount coupons
   static createFlat(params: {
     code: string;
     amount: Money;
     validFrom?: Date;
     expiresAt?: Date;
     isActive?: boolean;
   }): Coupon

   // For percentage discount coupons
   static createPercentage(params: {
     code: string;
     percentageValue: number;  // Must be 0-100
     validFrom?: Date;
     expiresAt?: Date;
     isActive?: boolean;
   }): Coupon
   ```

5. **Private helpers**:
   - `_normalizeCode(code: string): string` — converts to uppercase
   - `_validatePercentage(value: number): void` — throws if not 0-100

6. **Validation method** (`isValid(now: Date): boolean`):
   ```typescript
   isValid(now: Date): boolean {
     if (!this.props.isActive) return false;
     if (this.props.validFrom && now < this.props.validFrom) return false;
     if (this.props.expiresAt && now > this.props.expiresAt) return false;
     return true;
   }
   ```

7. **Discount calculation** (`calculateDiscount(subtotal: Money, now: Date, eventBus?: EventBus): Money`):
   ```typescript
   calculateDiscount(subtotal: Money, now: Date, eventBus?: EventBus): Money {
     const code = this.props.code;
     const timestamp = new Date();
     
     if (!this.isValid(now)) {
       // Emit CouponValidationFailed
       return Money.fromCents(0);
     }
     
     // Emit CouponValidated
     
     let discount: Money;
     if (this.props.discountMode === 'flat') {
       discount = this.props.discountAmount!;
     } else {
       const percentage = this.props.percentageValue! / 100;
       discount = subtotal.multiply(percentage);
     }
     
     // Floor enforcement — never exceed subtotal
     discount = Money.fromCents(Math.min(discount.cents, subtotal.cents));
     
     const resultingTotal = subtotal.subtract(discount);
     
     // Emit DiscountCalculated
     
     return discount;
   }
   ```

8. **Getters for readonly access**:
   - `get code(): string`
   - `get discountMode(): CouponMode`
   - `get discountAmount(): Money | undefined`
   - `get percentageValue(): number | undefined`
   - `get validFrom(): Date | null`
   - `get expiresAt(): Date | null`
   - `get isActive(): boolean`

9. **Immutability helper** (for future extension patterns):
   ```typescript
   with(props: Partial<CouponProps>): Coupon {
     return new Coupon({ ...this.props, ...props });
   }
   ```

### Files
- `src/entities/coupon/model/coupon.ts` (new file, ~150 lines)

### Validation Checklist
- [ ] Constructor is private, use factory methods
- [ ] Factory methods normalize code to uppercase
- [ ] Percentage factory validates 0-100 range
- [ ] `isValid()` checks isActive → validFrom → expiresAt
- [ ] `calculateDiscount()` handles both modes
- [ ] Floor enforcement: discount ≤ subtotal
- [ ] Events emitted at correct points
- [ ] All getters return correct types

---

## T004: Create coupon.test.ts

**Purpose**: Comprehensive unit tests covering happy paths, edge cases, and boundary conditions.

### Implementation Steps

1. **Create file**: `src/entities/coupon/model/coupon.test.ts`

2. **Imports and setup**:
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { Coupon } from './coupon';
   import { Money } from '@/shared/lib';
   ```

3. **Test suite structure**:
   ```typescript
   describe('Coupon', () => {
     describe('Factory Methods', () => {
       // T004a: createFlat tests
       // T004b: createPercentage tests
     });
     
     describe('isValid', () => {
       // T004c: active/inactive tests
       // T004d: validFrom tests
       // T004e: expiresAt tests
     });
     
     describe('calculateDiscount', () => {
       // T004f: flat discount calculation
       // T004g: percentage discount calculation
       // T004h: 100% discount floor protection
       // T004i: discount exceeds subtotal
     });
     
     describe('Immutability', () => {
       // T004j: with() returns new instance
     });
   });
   ```

4. **Required test cases**:

   **Flat Discount Tests**:
   ```typescript
   it('calculates flat $5 discount', () => {
     const coupon = Coupon.createFlat({ code: 'SAVE5', amount: Money.fromPrice(5) });
     const subtotal = Money.fromPrice(100);
     const discount = coupon.calculateDiscount(subtotal, new Date());
     expect(discount.format()).toBe('$5.00');
   });
   ```

   **Percentage Discount Tests**:
   ```typescript
   it('calculates 10% discount', () => {
     const coupon = Coupon.createPercentage({ code: 'SAVE10PCT', percentageValue: 10 });
     const subtotal = Money.fromPrice(100);
     const discount = coupon.calculateDiscount(subtotal, new Date());
     expect(discount.format()).toBe('$10.00');
   });
   ```

   **Validity Period Tests**:
   ```typescript
   it('rejects expired coupon', () => {
     const yesterday = new Date(Date.now() - 86400000);
     const coupon = Coupon.createFlat({
       code: 'EXPIRED',
       amount: Money.fromPrice(5),
       expiresAt: yesterday
     });
     expect(coupon.isValid(new Date())).toBe(false);
   });
   ```

   **Floor Protection Tests**:
   ```typescript
   it('caps discount at subtotal amount', () => {
     const coupon = Coupon.createPercentage({ code: '100PCT', percentageValue: 100 });
     const subtotal = Money.fromPrice(25);  // Less than $5 flat
     const discount = coupon.calculateDiscount(subtotal, new Date());
     expect(discount.cents).toBe(2500);  // $25, not $25 + $5
   });
   ```

5. **Edge cases to cover**:
   - Zero percentage (0% discount = $0)
   - Zero flat amount ($0 discount)
   - Large subtotals with percentage (integer math handling)
   - Coupons with null validFrom (no start restriction)
   - Coupons with null expiresAt (never expires)

### Files
- `src/entities/coupon/model/coupon.test.ts` (new file, ~200 lines)

### Validation Checklist
- [ ] All factory methods tested
- [ ] Both discount modes tested
- [ ] Validity period scenarios covered
- [ ] Floor protection verified
- [ ] Tests use `Money` for comparison (not raw numbers)
- [ ] Edge cases for zero/null values

---

## T005: Create index.ts

**Purpose**: Define the public API exports for the coupon entity slice.

### Implementation Steps

1. **Create file**: `src/entities/coupon/index.ts`

2. **Re-export from model**:
   ```typescript
   // Aggregate root
   export { Coupon } from './model/coupon';
   
   // Types
   export type { CouponProps, CouponMode, CouponValidationReason } from './model/types';
   
   // Events
   export type {
     CouponValidated,
     CouponValidationFailed,
     DiscountCalculated,
     CouponDomainEvent
   } from './model/events';
   ```

3. **Public API should allow**:
   - Importing `Coupon` for use in features
   - Importing event types for EventBus subscriptions
   - Importing `CouponProps` for repository patterns

### Files
- `src/entities/coupon/index.ts` (new file, ~15 lines)

### Validation Checklist
- [ ] All public types exported
- [ ] Coupon class exported
- [ ] No internal details leaked (no `model/` subpath exports)

---

## Integration Points

- **From shared/lib**: `Money`, `EventBus`
- **From this feature**: Types from WP01
- **Used by**: T-007 (ports), T-008 (mock repository), T-011 (apply-coupon feature)

## Definition of Done

- [ ] `coupon.ts` implements all aggregate behavior per spec
- [ ] `coupon.test.ts` passes all tests (`npm test src/entities/coupon`)
- [ ] `index.ts` exports complete public API
- [ ] TypeScript compiles without errors
- [ ] `npm run lint` passes for affected files
- [ ] `npm run build` succeeds

## Risks

| Risk | Mitigation |
|---|---|
| Integer arithmetic edge cases | Comprehensive test coverage for percentage calculations |
| Date comparison edge cases | Test with boundary dates (start/end of day) |
| Floor protection logic | Explicit tests for 100% discount scenario |

## Reviewer Guidance

When reviewing this work package, verify:

1. **Immutability**: No mutating methods, all operations return new instances
2. **Floor protection**: Discount cannot exceed subtotal (line: `Math.min(discount.cents, subtotal.cents)`)
3. **Validation order**: isActive → validFrom → expiresAt (not reversed)
4. **Code normalization**: Uppercase conversion in factory methods
5. **Percentage validation**: 0-100 range enforced
6. **Test coverage**: All spec acceptance criteria have corresponding tests
7. **No floating-point**: All currency uses `Money` (integer cents internally)

## Activity Log

- 2026-04-10T12:15:20Z – kilocode:o3:implementer:implementer – shell_pid=19423 – Started implementation via action command
