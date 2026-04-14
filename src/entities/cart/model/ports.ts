import type { Cart } from '@/entities/cart'

export interface ICartRepository {
  getCart(): Promise<Cart>
  saveCart(cart: Cart): Promise<void>
}
