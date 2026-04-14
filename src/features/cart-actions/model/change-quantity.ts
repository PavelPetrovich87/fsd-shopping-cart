import type { Cart } from '@/entities/cart';
import { CartState } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { IStockRepository } from '@/entities/product';
import type { EventBus } from '@/shared/lib/event-bus';
import { availableStock } from '@/entities/product';
import type { CartActionsError } from './errors';
import type { ChangeCartItemQuantityResult } from './results';
import type { CartItemQuantityChanged } from '@/entities/cart';

export async function ChangeCartItemQuantity(
  skuId: string,
  newQuantity: number,
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
  eventBus: EventBus
): Promise<ChangeCartItemQuantityResult> {
  if (newQuantity < 1) {
    const error: CartActionsError = {
      type: 'ItemNotFoundError',
      skuId
    };
    return { success: false, error };
  }

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

  const variant = await stockRepo.findBySku(skuId);
  if (!variant) {
    const error: CartActionsError = {
      type: 'ItemNotFoundError',
      skuId
    };
    return { success: false, error };
  }

  const currentAvailable = availableStock(variant);
  if (newQuantity > currentAvailable) {
    const error: CartActionsError = {
      type: 'InsufficientStockError',
      skuId,
      requested: newQuantity,
      available: currentAvailable
    };
    return { success: false, error };
  }

  const recheckVariant = await stockRepo.findBySku(skuId);
  const recheckAvailable = recheckVariant ? availableStock(recheckVariant) : 0;
  if (!recheckVariant || newQuantity > recheckAvailable) {
    const error: CartActionsError = {
      type: 'StockConflictError',
      skuId,
      requested: newQuantity,
      currentAvailable: recheckAvailable
    };
    return { success: false, error };
  }

  const newItems = new Map(cart.items);
  newItems.set(skuId, {
    ...existingItem,
    quantity: newQuantity
  });

  const updatedCart: Cart = {
    ...cart,
    items: newItems,
    updatedAt: new Date()
  };

  await cartRepo.saveCart(updatedCart);

  const event: CartItemQuantityChanged = {
    occurredAt: new Date(),
    eventType: 'CartItemQuantityChanged',
    skuId,
    previousQuantity,
    newQuantity
  };

  eventBus.publish(event);

  return { success: true, cart: updatedCart, event };
}