import { describe, expect, it, vi } from 'vitest';

import { Money } from '@/shared/lib';
import { EventBus } from '@/shared/lib/event-bus';

import { Coupon } from './coupon';

describe('Coupon', () => {
  describe('Factory methods', () => {
    it('creates flat coupon with uppercase code', () => {
      const coupon = Coupon.createFlat({
        code: 'save5',
        amount: Money.fromPrice(5),
      });

      expect(coupon.code).toBe('SAVE5');
      expect(coupon.discountMode).toBe('flat');
      expect(coupon.discountAmount?.equals(Money.fromPrice(5))).toBe(true);
      expect(coupon.isActive).toBe(true);
    });

    it('creates percentage coupon with uppercase code', () => {
      const coupon = Coupon.createPercentage({
        code: 'save10pct',
        percentageValue: 10,
      });

      expect(coupon.code).toBe('SAVE10PCT');
      expect(coupon.discountMode).toBe('percentage');
      expect(coupon.percentageValue).toBe(10);
      expect(coupon.isActive).toBe(true);
    });

    it('throws for invalid percentage value', () => {
      expect(() =>
        Coupon.createPercentage({ code: 'INVALID', percentageValue: 101 }),
      ).toThrow('Percentage value must be between 0 and 100');
    });
  });

  describe('isValid', () => {
    it('returns false when coupon is inactive', () => {
      const coupon = Coupon.createFlat({
        code: 'OFF',
        amount: Money.fromPrice(5),
        isActive: false,
      });

      expect(coupon.isValid(new Date())).toBe(false);
    });

    it('returns false when coupon is not yet active', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const coupon = Coupon.createFlat({
        code: 'FUTURE',
        amount: Money.fromPrice(5),
        validFrom: tomorrow,
      });

      expect(coupon.isValid(new Date())).toBe(false);
    });

    it('returns false when coupon is expired', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const coupon = Coupon.createFlat({
        code: 'EXPIRED',
        amount: Money.fromPrice(5),
        expiresAt: yesterday,
      });

      expect(coupon.isValid(new Date())).toBe(false);
    });

    it('returns true when no validity dates are provided', () => {
      const coupon = Coupon.createFlat({
        code: 'OPEN',
        amount: Money.fromPrice(5),
      });

      expect(coupon.isValid(new Date())).toBe(true);
    });
  });

  describe('calculateDiscount', () => {
    it('calculates flat discount', () => {
      const coupon = Coupon.createFlat({
        code: 'SAVE5',
        amount: Money.fromPrice(5),
      });
      const subtotal = Money.fromPrice(100);

      const discount = coupon.calculateDiscount(subtotal, new Date());

      expect(discount.equals(Money.fromPrice(5))).toBe(true);
    });

    it('calculates percentage discount', () => {
      const coupon = Coupon.createPercentage({
        code: 'SAVE10',
        percentageValue: 10,
      });
      const subtotal = Money.fromPrice(100);

      const discount = coupon.calculateDiscount(subtotal, new Date());

      expect(discount.equals(Money.fromPrice(10))).toBe(true);
    });

    it('returns zero for invalid coupon', () => {
      const coupon = Coupon.createFlat({
        code: 'OFF',
        amount: Money.fromPrice(5),
        isActive: false,
      });

      const discount = coupon.calculateDiscount(Money.fromPrice(100), new Date());

      expect(discount.equals(Money.fromPrice(0))).toBe(true);
    });

    it('caps flat discount at subtotal', () => {
      const coupon = Coupon.createFlat({
        code: 'SAVE50',
        amount: Money.fromPrice(50),
      });
      const subtotal = Money.fromPrice(25);

      const discount = coupon.calculateDiscount(subtotal, new Date());

      expect(discount.equals(subtotal)).toBe(true);
    });

    it('handles 100 percentage discount', () => {
      const coupon = Coupon.createPercentage({
        code: 'FREE',
        percentageValue: 100,
      });
      const subtotal = Money.fromPrice(25);

      const discount = coupon.calculateDiscount(subtotal, new Date());

      expect(discount.equals(subtotal)).toBe(true);
    });

    it('handles zero percentage discount', () => {
      const coupon = Coupon.createPercentage({
        code: 'ZERO',
        percentageValue: 0,
      });

      const discount = coupon.calculateDiscount(Money.fromPrice(100), new Date());

      expect(discount.equals(Money.fromPrice(0))).toBe(true);
    });

    it('publishes validation and discount events for valid coupon', async () => {
      const bus = new EventBus();
      const publishSpy = vi.spyOn(bus, 'publish');
      const coupon = Coupon.createFlat({
        code: 'SAVE5',
        amount: Money.fromPrice(5),
      });

      coupon.calculateDiscount(Money.fromPrice(100), new Date(), bus);

      expect(publishSpy).toHaveBeenCalledTimes(2);
      expect(publishSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ eventType: 'CouponValidated', couponCode: 'SAVE5' }),
      );
      expect(publishSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ eventType: 'DiscountCalculated', couponCode: 'SAVE5' }),
      );
    });

    it('publishes validation failure event for invalid coupon', () => {
      const bus = new EventBus();
      const publishSpy = vi.spyOn(bus, 'publish');
      const coupon = Coupon.createFlat({
        code: 'OFF',
        amount: Money.fromPrice(5),
        isActive: false,
      });

      coupon.calculateDiscount(Money.fromPrice(100), new Date(), bus);

      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'CouponValidationFailed',
          couponCode: 'OFF',
          reason: 'inactive',
        }),
      );
    });
  });

  describe('immutability', () => {
    it('with returns a new instance', () => {
      const coupon = Coupon.createFlat({
        code: 'SAVE5',
        amount: Money.fromPrice(5),
      });

      const updated = coupon.with({ isActive: false });

      expect(updated).not.toBe(coupon);
      expect(coupon.isActive).toBe(true);
      expect(updated.isActive).toBe(false);
    });
  });
});
