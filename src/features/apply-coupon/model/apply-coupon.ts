import type { ICartRepository } from '@/entities/cart/model/ports';
import type { ICouponRepository } from '@/entities/coupon/model/ports';
import type { EventBus } from '@/shared/lib/event-bus';
import { Money } from '@/shared/lib/money';
import type { ApplyCouponError } from './errors';
import type { ApplyCouponResult } from './results';
import type { CouponApplied } from './events';
import { applyCoupon, getSubtotalCents } from '@/entities/cart';

export async function ApplyCoupon(
  code: string,
  cartRepo: ICartRepository,
  couponRepo: ICouponRepository,
  eventBus: EventBus
): Promise<ApplyCouponResult> {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    const error: ApplyCouponError = {
      type: 'EMPTY_CODE',
      message: 'Please enter a valid code'
    };
    return { success: false, error };
  }

  const coupon = await couponRepo.findByCode(normalizedCode);
  if (!coupon) {
    const error: ApplyCouponError = {
      type: 'INVALID_CODE',
      message: 'Sorry, but this coupon doesn\'t exist'
    };
    return { success: false, error };
  }

  const now = new Date();
  if (!coupon.isValid(now)) {
    const error: ApplyCouponError = {
      type: 'COUPON_EXPIRED',
      message: 'This coupon has expired'
    };
    return { success: false, error };
  }

  const cart = await cartRepo.getCart();
  const subtotalCents = getSubtotalCents(cart);
  const subtotalMoney = Money.fromCents(subtotalCents);

  const discount = coupon.calculateDiscount(subtotalMoney, now, eventBus);

  const { cart: updatedCart } = applyCoupon(cart, normalizedCode);
  await cartRepo.saveCart(updatedCart);

  const event: CouponApplied = {
    eventType: 'CouponApplied',
    couponCode: normalizedCode,
    discountAmountCents: discount.cents,
    occurredAt: now
  };

  eventBus.publish(event);

  return { success: true, cart: updatedCart, event };
}