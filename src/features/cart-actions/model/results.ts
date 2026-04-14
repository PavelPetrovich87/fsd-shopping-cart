import type { Cart } from '@/entities/cart';
import type { CartActionsError } from './errors';
import type {
  ItemAddedToCart,
  ItemRemovedFromCart,
  CartItemQuantityChanged,
} from '@/entities/cart';

export type AddToCartResult =
  | { success: true; cart: Cart; event: ItemAddedToCart }
  | { success: false; error: CartActionsError };

export type RemoveFromCartResult =
  | { success: true; cart: Cart; event: ItemRemovedFromCart }
  | { success: false; error: CartActionsError };

export type ChangeCartItemQuantityResult =
  | { success: true; cart: Cart; event: CartItemQuantityChanged }
  | { success: false; error: CartActionsError };