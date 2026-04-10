import type { Cart } from '@/entities/cart'

export interface ICartRepository {
  getCart(): Cart
  saveCart(cart: Cart): void
}
