import { inventoryData, productsData } from '@/shared/api'
import { createProductVariant } from '../model/factory'
import type { IStockRepository } from '../model/ports'
import type { ProductVariant } from '../model/types'

function createInventoryMap(): Map<string, { totalOnHand: number; reserved: number }> {
  const map = new Map<string, { totalOnHand: number; reserved: number }>()
  for (const record of inventoryData) {
    map.set(record.skuId, {
      totalOnHand: record.totalOnHand,
      reserved: record.reserved,
    })
  }
  return map
}

function createMockInventoryRepository(): IStockRepository {
  const inventoryMap = createInventoryMap()

  return {
    findBySku(skuId: string): ProductVariant | null {
      if (!skuId || skuId.trim() === '') {
        return null
      }

      const normalizedSku = skuId.trim().toUpperCase()
      const inventoryRecord = inventoryMap.get(normalizedSku)

      if (!inventoryRecord) {
        return null
      }

      const productRecord = productsData.find((p) => p.skuId === normalizedSku)

      if (!productRecord) {
        return null
      }

      return createProductVariant({
        skuId: normalizedSku,
        totalOnHand: inventoryRecord.totalOnHand,
        sold: 0,
        reservations: [],
      })
    },
  }
}

export const MockInventoryRepository = createMockInventoryRepository()
