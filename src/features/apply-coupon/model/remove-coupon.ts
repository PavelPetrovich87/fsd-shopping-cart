import type { ICartRepository } from '@/entities/cart'
import type { EventBus } from '@/shared/lib/event-bus'
import type { RemoveCouponResult } from './results'
import type { CouponRemoved } from './events'
import { removeCoupon } from '@/entities/cart'

export async function RemoveCoupon(
  cartRepo: ICartRepository,
  eventBus: EventBus,
): Promise<RemoveCouponResult> {
  const cart = await cartRepo.getCart()

  if (!cart.couponCode) {
    return { success: true, cart }
  }

  const removedCode = cart.couponCode
  const { cart: updatedCart } = removeCoupon(cart)
  await cartRepo.saveCart(updatedCart)

  const event: CouponRemoved = {
    eventType: 'CouponRemoved',
    couponCode: removedCode,
    occurredAt: new Date(),
  }

  eventBus.publish(event)

  return { success: true, cart: updatedCart, event }
}
