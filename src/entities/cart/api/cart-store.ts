import { create } from 'zustand'
import type { Cart } from '@/entities/cart'
import { createCart } from '@/entities/cart'

interface CartStoreState {
  cart: Cart
  lastUpdatedAt: Date
}

interface CartStoreActions {
  replaceCart: (cart: Cart) => void
}

type CartStore = CartStoreState & CartStoreActions

function createInitialState(): CartStoreState {
  return {
    cart: createCart(),
    lastUpdatedAt: new Date(),
  }
}

export const useCartStore = create<CartStore>((set) => ({
  ...createInitialState(),
  replaceCart: (cart: Cart) =>
    set({
      cart,
      lastUpdatedAt: new Date(),
    }),
}))

export function useCart(): Cart {
  return useCartStore((s) => s.cart)
}

export function useCartSnapshot(): Cart {
  return useCartStore((s) => s.cart)
}

export function getCartSelector(state: CartStore): Cart {
  return state.cart
}
