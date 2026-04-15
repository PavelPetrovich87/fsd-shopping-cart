import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApplyCoupon } from './apply-coupon';
import { RemoveCoupon } from './remove-coupon';
import type { Cart } from '@/entities/cart';
import { createCart } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { ICouponRepository } from '@/entities/coupon';
import type { Coupon } from '@/entities/coupon';
import { Money } from '@/shared/lib/money';
import { EventBus } from '@/shared/lib/event-bus';

function createMockCart(overrides: Partial<Cart> = {}): Cart {
  const cart = createCart('cart-1');
  return {
    ...cart,
    ...overrides
  } as Cart;
}

function createMockCoupon(code: string, discountCents: number, isValid: boolean = true): Coupon {
  return {
    code,
    isValid: () => isValid,
    calculateDiscount: () => Money.fromCents(discountCents)
  } as unknown as Coupon;
}

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
      findByCode: vi.fn()
    };
    mockEventBus = {
      publish: vi.fn()
    } as unknown as EventBus;
  });

  describe('happy path', () => {
    it('should apply valid coupon to cart', async () => {
      const cart = createMockCart();
      const coupon = createMockCoupon('SAVE10', 1000);
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockCouponRepo.findByCode).mockResolvedValue(coupon);

      const result = await ApplyCoupon(
        'SAVE10',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.cart.couponCode).toBe('SAVE10');
        expect(result.event.eventType).toBe('CouponApplied');
        expect(result.event.couponCode).toBe('SAVE10');
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled();
    });
  });

  describe('empty code error', () => {
    it('should return EMPTY_CODE error for empty string', async () => {
      const cart = createMockCart();
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await ApplyCoupon(
        '',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EMPTY_CODE');
        expect(result.error.message).toBe('Please enter a valid code');
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled();
    });

    it('should return EMPTY_CODE error for whitespace only', async () => {
      const cart = createMockCart();
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await ApplyCoupon(
        '   ',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EMPTY_CODE');
      }
    });
  });

  describe('invalid code error', () => {
    it('should return INVALID_CODE error when coupon not found', async () => {
      const cart = createMockCart();
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockCouponRepo.findByCode).mockResolvedValue(null);

      const result = await ApplyCoupon(
        'INVALID',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INVALID_CODE');
        expect(result.error.message).toBe('Sorry, but this coupon doesn\'t exist');
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled();
    });
  });

  describe('expired coupon error', () => {
    it('should return COUPON_EXPIRED error for invalid coupon', async () => {
      const cart = createMockCart();
      const coupon = createMockCoupon('EXPIRED', 1000, false);
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockCouponRepo.findByCode).mockResolvedValue(coupon);

      const result = await ApplyCoupon(
        'EXPIRED',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('COUPON_EXPIRED');
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled();
    });
  });

  describe('no stacking', () => {
    it('should replace existing coupon with new one', async () => {
      const cart = createMockCart({ couponCode: 'OLDCODE' });
      const newCoupon = createMockCoupon('NEWCODE', 1500);
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockCouponRepo.findByCode).mockResolvedValue(newCoupon);

      const result = await ApplyCoupon(
        'NEWCODE',
        mockCartRepo,
        mockCouponRepo,
        mockEventBus
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.cart.couponCode).toBe('NEWCODE');
      }
    });
  });
});

describe('RemoveCoupon', () => {
  let mockCartRepo: ICartRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined)
    };
    mockEventBus = {
      publish: vi.fn()
    } as unknown as EventBus;
  });

  describe('happy path', () => {
    it('should remove coupon from cart and publish event', async () => {
      const cart = createMockCart({ couponCode: 'MYCODE' });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await RemoveCoupon(mockCartRepo, mockEventBus);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.cart.couponCode).toBe('');
        expect(result.event.eventType).toBe('CouponRemoved');
        expect(result.event.couponCode).toBe('MYCODE');
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled();
    });
  });

  describe('no-op when no coupon', () => {
    it('should return success without event when no coupon applied', async () => {
      const cart = createMockCart({ couponCode: '' });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await RemoveCoupon(mockCartRepo, mockEventBus);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.cart.couponCode).toBe('');
        expect(result.event).toBeUndefined();
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled();
    });
  });
});