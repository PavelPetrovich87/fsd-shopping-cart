export { CartState } from './model/types';
export type { CartItemData, CartData } from './model/types';

export type { CartDomainEvent } from './model/events';
export type {
  ItemAddedToCart,
  CartItemQuantityChanged,
  ItemRemovedFromCart,
  CartCleared,
  CheckoutInitiated,
  CheckoutCompleted,
  CouponApplied,
  CouponRemoved,
} from './model/events';

export { CartItem } from './model/cart-item';

export { Cart } from './model/cart';
export type { CartOperationResult } from './model/cart';
