import type { Cart } from '@/entities/cart';
import { CartState } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { EventBus } from '@/shared/lib/event-bus';
import type { CartActionsError } from './errors';
import type { RemoveFromCartResult } from './results';
import type { ItemRemovedFromCart } from '@/entities/cart';

export async function RemoveFromCart(
  skuId: string,
  cartRepo: ICartRepository,
  eventBus: EventBus
): Promise<RemoveFromCartResult> {
  const cart = await cartRepo.getCart();

  if (cart.state !== CartState.Active) {
    const error: CartActionsError = {
      type: 'CartNotModifiableError',
      currentState: cart.state
    };
    return { success: false, error };
  }

  if (!cart.items.has(skuId)) {
    const error: CartActionsError = {
      type: 'ItemNotFoundError',
      skuId
    };
    return { success: false, error };
  }

  const existingItem = cart.items.get(skuId)!;
  const previousQuantity = existingItem.quantity;

  const newItems = new Map(cart.items);
  newItems.delete(skuId);

  const updatedCart: Cart = {
    ...cart,
    items: newItems,
    updatedAt: new Date()
  };

  await cartRepo.saveCart(updatedCart);

  const event: ItemRemovedFromCart = {
    occurredAt: new Date(),
    eventType: 'ItemRemovedFromCart',
    skuId,
    previousQuantity
  };

  eventBus.publish(event as unknown as { type: string });

  return { success: true, cart: updatedCart, event };
}