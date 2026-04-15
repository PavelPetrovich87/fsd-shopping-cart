import type { Cart } from '@/entities/cart'

export interface StockConflict {
  skuId: string
  productName: string
  requestedQuantity: number
  availableQuantity: number
}

export type InitiateCheckoutResult =
  | { success: true; cart: Cart }
  | { success: false; reason: 'empty_cart' }
  | { success: false; reason: 'invalid_state' }
  | { success: false; reason: 'stock_conflict'; conflicts: StockConflict[] }
