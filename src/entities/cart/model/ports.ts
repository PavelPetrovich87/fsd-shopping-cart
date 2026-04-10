import type { Cart } from '../index'

export interface ICartRepository {
  getCart(): Promise<Cart>
  saveCart(cart: Cart): Promise<void>
}
