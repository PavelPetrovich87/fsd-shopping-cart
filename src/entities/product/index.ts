export { createProductVariant, LOW_STOCK_THRESHOLD } from './model/factory'
export { availableStock } from './model/available-stock'
export { createStockReservation } from './model/stock-reservation'
export {
  reserve,
  releaseReservation,
  confirmDepletion,
} from './model/operations'
export type { ProductVariant } from './model/types'
export type { StockReservation } from './model/stock-reservation'
export type {
  ProductDomainEvent,
  StockReserved,
  StockReleased,
  StockDepleted,
} from './model/events'
export type { IStockRepository } from './model/ports'
export { MockInventoryRepository } from './api/mock-inventory-repository'
