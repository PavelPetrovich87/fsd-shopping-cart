---
work_package_id: WP03
title: Testing & Validation
dependencies:
- WP02
requirement_refs:
- FR-004
- FR-009
planning_base_branch: main
merge_target_branch: main
branch_strategy: main → main (single lane)
subtasks:
- T008
- T009
history:
- date: '2026-04-15'
  action: created
  details: Initial WP03 prompt
authoritative_surface: src/features/apply-coupon/
execution_mode: code_change
owned_files:
- src/features/apply-coupon/model/apply-coupon.test.ts
tags: []
---

# WP03: Testing & Validation

## Objective

Write unit tests covering all use case paths for `ApplyCoupon` and `RemoveCoupon`, then verify the implementation passes all quality gates (lint, lint:arch, build).

## Context

This work package depends on WP02 (use cases implemented). Tests use mocked repositories and EventBus, following the T-011 test patterns exactly.

### Dependencies

- **Requires**: WP02 (T004: apply-coupon.ts, T005: remove-coupon.ts)

### Reference Files

- T-011 AddToCart tests: `src/features/cart-actions/model/add-to-cart.test.ts`
- Apply Coupon spec: `kitty-specs/013-apply-coupon-feature/spec.md`
- Apply Coupon plan: `kitty-specs/013-apply-coupon-feature/plan.md`
- WP01 foundation: `src/features/apply-coupon/model/errors.ts`, `events.ts`, `results.ts`
- WP02 use cases: `src/features/apply-coupon/model/apply-coupon.ts`, `remove-coupon.ts`

---

## Subtasks

### T008: Create `model/apply-coupon.test.ts` — Unit Tests

**Purpose**: Write comprehensive unit tests for ApplyCoupon and RemoveCoupon use cases, covering all scenarios from the spec.

**Test Structure** (follow T-011 pattern):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApplyCoupon } from './apply-coupon';
import { RemoveCoupon } from './remove-coupon';
import type { Cart } from '@/entities/cart';
import { CartState } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { ICouponRepository } from '@/entities/coupon';
import type { Coupon } from '@/entities/coupon';
import { EventBus } from '@/shared/lib/event-bus';
import { Money } from '@/shared/lib/money';

// Mock data helpers
function createMockCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    state: CartState.Active,
    items: new Map(),
    couponCode: '',
    subtotal: Money.fromCents(10000), // $100.00
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  } as Cart;
}

function createMockCoupon(code: string, discountCents: number, isValid: boolean = true): Coupon {
  return {
    code,
    discountType: 'flat' as const,
    discountAmount: discountCents,
    isValid: () => isValid,
    calculateDiscount: (subtotal: Money) => Money.fromCents(discountCents)
  } as unknown as Coupon;
}

// Mock repository helpers
function createMockCartRepo(cart: Cart): ICartRepository {
  return {
    getCart: vi.fn().mockResolvedValue(cart),
    saveCart: vi.fn().mockResolvedValue(undefined)
  };
}

function createMockCouponRepo(coupons: Map<string, Coupon | null>): ICouponRepository {
  return {
    findByCode: vi.fn((code: string) => Promise.resolve(coupons.get(code) ?? null))
  };
}
```

**Test Cases to Implement**:

#### ApplyCoupon Tests

1. **Happy Path: Valid coupon applied**
   - Mock cart with no coupon, valid coupon in repo
   - Call ApplyCoupon
   - Expect: success=true, cart.couponCode updated, event published with correct data

2. **Empty code error**
   - Call ApplyCoupon with empty string ''
   - Call ApplyCoupon with whitespace '   '
   - Expect: success=false, error.type='EMPTY_CODE', error.message='Please enter a valid code'

3. **Invalid code error**
   - Mock couponRepo.findByCode returns null
   - Call ApplyCoupon with 'INVALID_CODE'
   - Expect: success=false, error.type='INVALID_CODE', error.message='Sorry, but this coupon doesn't exist'

4. **Expired coupon error**
   - Mock coupon with isValid() returns false
   - Call ApplyCoupon
   - Expect: success=false, error.type='COUPON_EXPIRED'

5. **Re-apply valid coupon (idempotent)**
   - Cart already has this coupon applied
   - Call ApplyCoupon with same code
   - Expect: success=true, event published again

6. **New coupon replaces existing (no stacking)**
   - Cart has 'OLDCODE' applied
   - Apply 'NEWCODE'
   - Expect: cart.couponCode='NEWCODE', event published with new code

#### RemoveCoupon Tests

1. **Happy Path: Remove applied coupon**
   - Cart has couponCode='MYCODE'
   - Call RemoveCoupon
   - Expect: success=true, cart.couponCode cleared, CouponRemoved event published

2. **No-op: No coupon to remove**
   - Cart has couponCode=''
   - Call RemoveCoupon
   - Expect: success=true, cart unchanged, NO event published (no-op)

**Mock Setup Pattern** (from T-011):

```typescript
describe('ApplyCoupon', () => {
  let mockCartRepo: ICartRepository;
  let mockCouponRepo: ICouponRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined)
    };
    mockCouponRepo = {
      findBySku: vi.fn()  // Note: ICouponRepository uses findByCode
    };
    mockEventBus = {
      publish: vi.fn()  // Real EventBus has publish method
    };
  });
});
```

**Important**: EventBus.publish is synchronous in the current implementation. Spy on it using `vi.spyOn(mockEventBus, 'publish')`.

**Files**:
- Create: `src/features/apply-coupon/model/apply-coupon.test.ts`

**Validation**:
- [ ] Tests cover all ApplyCoupon scenarios (happy path, empty code, invalid code, expired, idempotent, no stacking)
- [ ] Tests cover all RemoveCoupon scenarios (remove coupon, no-op)
- [ ] Mock repositories use vi.fn() with correct return types (Promise for async)
- [ ] EventBus.publish is verified (called with correct event structure)
- [ ] All tests pass with `npm run test`
- [ ] Tests follow T-011 patterns exactly

---

### T009: Run Quality Gates — lint, lint:arch, build

**Purpose**: Verify the implementation passes all project quality gates before considering the feature complete.

**Steps**:

1. Run `npm run lint` — ESLint code quality
2. Run `npm run lint:arch` — FSD architecture lint
3. Run `npm run build` — TypeScript compilation + Vite build

**Commands**:
```bash
npm run lint
npm run lint:arch
npm run build
```

**Validation**:
- [ ] `npm run lint` exits with code 0
- [ ] `npm run lint:arch` exits with code 0
- [ ] `npm run build` exits with code 0

**If any gate fails**:
- Read the error message
- Fix the issue
- Re-run the gate
- Do NOT proceed until all three pass

---

## Implementation Notes

### Test Pattern (from T-011)

```typescript
describe('AddToCart', () => {
  let mockCartRepo: ICartRepository;
  let mockStockRepo: IStockRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined)
    };
    mockStockRepo = {
      findBySku: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined)
    };
    mockEventBus = new EventBus();
  });

  describe('happy path', () => {
    it('should add new item to cart', async () => {
      const cart = createMockCart();
      const variant = createMockVariant();
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant);
      const publishSpy = vi.spyOn(mockEventBus, 'publish');

      const result = await AddToCart(
        'SKU001', 2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.cart.items.has('SKU001')).toBe(true);
        expect(result.event.skuId).toBe('SKU001');
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled();
      expect(publishSpy).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Important Test Verifications

1. **Verify EventBus.publish is called**:
   ```typescript
   const publishSpy = vi.spyOn(mockEventBus, 'publish');
   // ... call use case
   expect(publishSpy).toHaveBeenCalledTimes(1);
   const publishedEvent = publishSpy.mock.calls[0][0];
   expect(publishedEvent.eventType).toBe('CouponApplied');
   expect(publishedEvent.couponCode).toBe('VALIDCODE');
   ```

2. **Verify repository saveCart is called**:
   ```typescript
   expect(mockCartRepo.saveCart).toHaveBeenCalled();
   ```

3. **Verify error discrimination**:
   ```typescript
   expect(result.success).toBe(false);
   if (!result.success) {
     expect(result.error.type).toBe('EMPTY_CODE');
   }
   ```

### Mock Repository Interfaces

**ICartRepository**:
```typescript
interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
}
```

**ICouponRepository**:
```typescript
interface ICouponRepository {
  findByCode(code: string): Promise<Coupon | null>;
}
```

---

## Definition of Done

- [ ] T008: Test file created with all scenarios from spec
- [ ] T008: All tests pass (`npm run test`)
- [ ] T009: `npm run lint` passes
- [ ] T009: `npm run lint:arch` passes
- [ ] T009: `npm run build` passes

## Risks & Reviewer Guidance

**Risks**:
- Mock implementations may not match actual repository interfaces (check ICartRepository, ICouponRepository from T-007/T-010)
- EventBus spy may not work if EventBus is instantiated differently

**Reviewer Checklist**:
- [ ] All ApplyCoupon scenarios tested
- [ ] All RemoveCoupon scenarios tested
- [ ] EventBus.publish verified with correct event structure
- [ ] saveCart called on success
- [ ] saveCart NOT called on error
- [ ] All lint/arch/build gates pass
- [ ] Tests follow T-011 pattern exactly