export interface InventoryRecord {
  skuId: string
  totalOnHand: number
  reserved: number
}

export const inventoryData: InventoryRecord[] = [
  { skuId: 'SHIRT-001', totalOnHand: 150, reserved: 0 },
  { skuId: 'JEANS-001', totalOnHand: 75, reserved: 0 },
  { skuId: 'SHOE-001', totalOnHand: 40, reserved: 0 },
  { skuId: 'WATCH-001', totalOnHand: 25, reserved: 0 },
  { skuId: 'BAG-001', totalOnHand: 60, reserved: 0 },
  { skuId: 'HAT-001', totalOnHand: 100, reserved: 0 },
]
