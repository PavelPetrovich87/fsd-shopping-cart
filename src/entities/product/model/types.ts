import type { StockReservation } from './stock-reservation'

export interface ProductVariant {
  readonly skuId: string
  readonly totalOnHand: number
  readonly sold: number
  readonly reservations: readonly StockReservation[]
}
