import type { ProductVariant } from './types'

export interface IStockRepository {
  findBySku(skuId: string): ProductVariant | null
}
