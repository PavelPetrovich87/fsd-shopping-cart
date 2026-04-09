export interface StockReservation {
  readonly orderId: string
  readonly quantity: number
  readonly timestamp: Date
}

export function createStockReservation(
  orderId: string,
  quantity: number,
  timestamp?: Date,
): StockReservation {
  if (quantity <= 0) {
    throw new Error('Reservation quantity must be positive')
  }
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('orderId must be a non-empty string')
  }
  return Object.freeze({
    orderId: orderId.trim(),
    quantity,
    timestamp: timestamp ?? new Date(),
  })
}
