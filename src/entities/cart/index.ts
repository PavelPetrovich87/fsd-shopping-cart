export { CartState } from './model/types'
export type { CartItemData, CartData } from './model/types'

export type { CartDomainEvent } from './model/events'
export type {
  ItemAddedToCart,
  CartItemQuantityChanged,
  ItemRemovedFromCart,
  CartCleared,
  CheckoutInitiated,
  CheckoutCompleted,
  CouponApplied,
  CouponRemoved,
} from './model/events'

export type { CartItem } from './model/cart-item'
export {
  createCartItem,
  getTotalPriceCents,
  withQuantity,
  toCartItemData,
} from './model/cart-item'

export type { Cart } from './model/cart'
export type { CartOperationResult } from './model/cart'
export {
  createCart,
  getCartItems,
  hasItem,
  getItem,
  getSubtotalCents,
  getItemCount,
  getUniqueItemCount,
  addItem,
  removeItem,
  changeQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  initiateCheckout,
  markCheckedOut,
  canTransitionTo,
  toCartData,
} from './model/cart'

export type { ICartRepository } from './model/ports'

export { zustandCartRepository } from './api/zustand-cart-repository'
export {
  useCartStore,
  useCart,
  useCartSnapshot,
  getCartSelector,
} from './api/cart-store'
