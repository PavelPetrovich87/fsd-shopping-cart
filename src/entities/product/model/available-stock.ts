import type { ProductVariant } from './types'

export function availableStock(variant: ProductVariant): number {
  const sumReserved = variant.reservations.reduce(
    (sum, r) => sum + r.quantity,
    0,
  )
  return variant.totalOnHand - sumReserved
}
