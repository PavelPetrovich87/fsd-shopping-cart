import type { Cart } from '@/entities/cart';
import { CartState } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { IStockRepository } from '@/entities/product';
import type { EventBus } from '@/shared/lib/event-bus';
import { availableStock } from '@/entities/product';
import type { CartActionsError } from './errors';
import type { AddToCartResult } from './results';
import type { ItemAddedToCart } from '@/entities/cart';

export async function AddToCart(
  skuId: string,
  quantity: number,
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
  eventBus: EventBus
): Promise<AddToCartResult> {
  const cart = await cartRepo.getCart();

  if (cart.state !== CartState.Active) {
    const error: CartActionsError = {
      type: 'CartNotModifiableError',
      currentState: cart.state
    };
    return { success: false, error };
  }

  const variant = await stockRepo.findBySku(skuId);
  if (!variant) {
    const error: CartActionsError = {
      type: 'ItemNotFoundError',
      skuId
    };
    return { success: false, error };
  }

  const currentAvailable = availableStock(variant);
  if (quantity > currentAvailable) {
    const error: CartActionsError = {
      type: 'InsufficientStockError',
      skuId,
      requested: quantity,
      available: currentAvailable
    };
    return { success: false, error };
  }

  const recheckVariant = await stockRepo.findBySku(skuId);
  const recheckAvailable = recheckVariant ? availableStock(recheckVariant) : 0;
  if (!recheckVariant || quantity > recheckAvailable) {
    const error: CartActionsError = {
      type: 'StockConflictError',
      skuId,
      requested: quantity,
      currentAvailable: recheckAvailable
    };
    return { success: false, error };
  }

  const existingItem = cart.items.get(skuId);
  const newQuantity = (existingItem?.quantity ?? 0) + quantity;

  const newItems = new Map(cart.items);
  newItems.set(skuId, {
    skuId,
    name: skuId,
    unitPriceCents: 0,
    quantity: newQuantity,
    createdAt: existingItem?.createdAt ?? new Date()
  });

  const updatedCart: Cart = {
    ...cart,
    items: newItems,
    updatedAt: new Date()
  };

  await cartRepo.saveCart(updatedCart);

  const event: ItemAddedToCart = {
    occurredAt: new Date(),
    eventType: 'ItemAddedToCart',
    skuId,
    name: skuId,
    unitPriceCents: 0,
    quantity: newQuantity
  };

  eventBus.publish(event);

  return { success: true, cart: updatedCart, event };
}