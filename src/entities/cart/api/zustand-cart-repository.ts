import type { Cart } from '@/entities/cart'
import { useCartStore } from './cart-store'
import type { ICartRepository } from '../model/ports'

export const zustandCartRepository: ICartRepository = {
  getCart(): Promise<Cart> {
    return Promise.resolve(useCartStore.getState().cart)
  },
  saveCart(cart: Cart): Promise<void> {
    useCartStore.getState().replaceCart(cart)
    return Promise.resolve(undefined)
  },
}
