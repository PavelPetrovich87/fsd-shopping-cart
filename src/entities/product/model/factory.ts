import type { StockReservation } from './stock-reservation'
import type { ProductVariant } from './types'

export const LOW_STOCK_THRESHOLD = 5

export function createProductVariant(params: {
  skuId: string
  totalOnHand: number
  sold?: number
  reservations?: StockReservation[]
}): ProductVariant {
  if (params.totalOnHand < 0) {
    throw new Error('totalOnHand cannot be negative')
  }
  return Object.freeze({
    skuId: params.skuId,
    totalOnHand: params.totalOnHand,
    sold: params.sold ?? 0,
    reservations: params.reservations ?? [],
  })
}
