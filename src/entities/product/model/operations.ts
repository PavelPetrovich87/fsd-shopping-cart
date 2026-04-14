import type { ProductVariant } from './types'
import type { StockReserved, StockReleased, StockDepleted } from './events'
import { LOW_STOCK_THRESHOLD } from './factory'
import { createStockReservation } from './stock-reservation'
import { availableStock } from './available-stock'

export function reserve(params: {
  variant: ProductVariant
  orderId: string
  quantity: number
}): {
  variant: ProductVariant
  event?: StockReserved
  depletedEvent?: StockDepleted
} {
  const currentAvailable = availableStock(params.variant)
  const reserveQty = Math.min(params.quantity, currentAvailable)

  if (reserveQty === 0) {
    return { variant: params.variant }
  }

  const reservation = createStockReservation(params.orderId, reserveQty)
  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    reservations: [...params.variant.reservations, reservation],
  })

  const event: StockReserved = {
    eventType: 'StockReserved',
    skuId: params.variant.skuId,
    orderId: params.orderId,
    quantity: reserveQty,
    occurredAt: reservation.timestamp,
  }

  let depletedEvent: StockDepleted | undefined
  if (params.variant.totalOnHand < LOW_STOCK_THRESHOLD) {
    depletedEvent = {
      eventType: 'StockDepleted',
      skuId: params.variant.skuId,
      totalOnHand: params.variant.totalOnHand,
      threshold: LOW_STOCK_THRESHOLD,
      occurredAt: new Date(),
    }
  }

  return { variant: newVariant, event, depletedEvent }
}

export function releaseReservation(params: {
  variant: ProductVariant
  orderId: string
}): {
  variant: ProductVariant
  event?: StockReleased
} {
  const reservation = params.variant.reservations.find(
    (r) => r.orderId === params.orderId,
  )

  if (!reservation) {
    return { variant: params.variant }
  }

  const releasedQty = reservation.quantity
  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    reservations: params.variant.reservations.filter(
      (r) => r.orderId !== params.orderId,
    ),
  })

  const event: StockReleased = {
    eventType: 'StockReleased',
    skuId: params.variant.skuId,
    orderId: params.orderId,
    quantity: releasedQty,
    occurredAt: new Date(),
  }

  return { variant: newVariant, event }
}

export function confirmDepletion(params: {
  variant: ProductVariant
  orderId: string
}): {
  variant: ProductVariant
  event?: StockDepleted
} {
  const reservation = params.variant.reservations.find(
    (r) => r.orderId === params.orderId,
  )

  if (!reservation) {
    return { variant: params.variant }
  }

  const newTotalOnHand = Math.max(
    0,
    params.variant.totalOnHand - reservation.quantity,
  )

  const newVariant: ProductVariant = Object.freeze({
    ...params.variant,
    totalOnHand: newTotalOnHand,
    sold: params.variant.sold + reservation.quantity,
    reservations: params.variant.reservations.filter(
      (r) => r.orderId !== params.orderId,
    ),
  })

  let event: StockDepleted | undefined
  if (newTotalOnHand < LOW_STOCK_THRESHOLD) {
    event = {
      eventType: 'StockDepleted',
      skuId: params.variant.skuId,
      totalOnHand: newTotalOnHand,
      threshold: LOW_STOCK_THRESHOLD,
      occurredAt: new Date(),
    }
  }

  return { variant: newVariant, event }
}
