import type { Cart } from '@/entities/cart'
import { useCartStore } from './cart-store'
import type { ICartRepository } from '../model/ports'

export const zustandCartRepository: ICartRepository = {
  getCart(): Cart {
    return useCartStore.getState().cart
  },
  saveCart(cart: Cart): void {
    useCartStore.getState().replaceCart(cart)
  },
}
