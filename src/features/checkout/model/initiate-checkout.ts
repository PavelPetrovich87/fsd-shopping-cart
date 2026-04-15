import type { CartItem } from '@/entities/cart'
import type { ICartRepository } from '@/entities/cart'
import { CartState, initiateCheckout } from '@/entities/cart'
import type { IStockRepository } from '@/entities/product'
import { availableStock } from '@/entities/product'
import type { EventBus } from '@/shared/lib/event-bus'
import { Money } from '@/shared/lib/money'
import type { CheckoutInitiated } from './events'
import type { InitiateCheckoutResult, StockConflict } from './result-types'

export async function InitiateCheckout(
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
  eventBus: EventBus,
): Promise<InitiateCheckoutResult> {
  const cart = await cartRepo.getCart()

  if (cart.state !== CartState.Active) {
    return { success: false, reason: 'invalid_state' }
  }

  if (cart.items.size === 0) {
    return { success: false, reason: 'empty_cart' }
  }

  const conflicts: StockConflict[] = []
  for (const item of cart.items.values()) {
    const variant = await stockRepo.findBySku(item.skuId)
    if (!variant) continue
    const currentAvailable = availableStock(variant)
    if (item.quantity > currentAvailable) {
      conflicts.push({
        skuId: item.skuId,
        productName: item.name,
        requestedQuantity: item.quantity,
        availableQuantity: currentAvailable,
      })
    }
  }

  if (conflicts.length > 0) {
    return { success: false, reason: 'stock_conflict', conflicts }
  }

  const { cart: updatedCart } = initiateCheckout(cart)
  await cartRepo.saveCart(updatedCart)

  const itemsArray: readonly CartItem[] = Array.from(cart.items.values())
  const subtotalCents = itemsArray.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  )

  const event: CheckoutInitiated = {
    eventType: 'CheckoutInitiated',
    cartId: cart.id,
    userId: cart.id,
    items: itemsArray,
    subtotal: Money.fromCents(subtotalCents),
    timestamp: new Date(),
  }

  eventBus.publish(event)

  return { success: true, cart: updatedCart }
}
