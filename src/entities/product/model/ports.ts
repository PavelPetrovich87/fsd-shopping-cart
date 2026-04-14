import type { ProductVariant } from '../index'

export interface IStockRepository {
  findBySku(skuId: string): Promise<ProductVariant | null>
  save(variant: ProductVariant): Promise<void>
}
