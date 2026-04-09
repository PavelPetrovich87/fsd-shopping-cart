import { describe, it, expect } from 'vitest'
import { createProductVariant, LOW_STOCK_THRESHOLD } from './factory'
import { availableStock } from './available-stock'
import { createStockReservation } from './stock-reservation'
import { reserve, releaseReservation, confirmDepletion } from './operations'

describe('ProductVariant', () => {
  describe('createProductVariant', () => {
    it('creates variant with default values', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
      })
      expect(variant.sold).toBe(0)
      expect(variant.reservations).toEqual([])
    })

    it('throws for negative totalOnHand', () => {
      expect(() =>
        createProductVariant({ skuId: 'SKU-001', totalOnHand: -1 }),
      ).toThrow('totalOnHand cannot be negative')
    })
  })

  describe('availableStock', () => {
    it('returns totalOnHand when no reservations', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
      })
      expect(availableStock(variant)).toBe(10)
    })

    it('subtracts reserved quantities', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
        reservations: [createStockReservation('order-1', 3)],
      })
      expect(availableStock(variant)).toBe(7)
    })

    it('handles multiple reservations', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
        reservations: [
          createStockReservation('order-1', 3),
          createStockReservation('order-2', 2),
        ],
      })
      expect(availableStock(variant)).toBe(5)
    })
  })

  describe('reserve', () => {
    it('reserves exact amount when available', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
      })
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 })

      expect(result.event?.payload.quantity).toBe(5)
      expect(availableStock(result.variant)).toBe(5)
    })

    it('creates partial reservation when insufficient stock', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 3 })
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 })

      expect(result.event?.payload.quantity).toBe(3)
      expect(availableStock(result.variant)).toBe(0)
    })

    it('emits StockDepleted when below threshold', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: LOW_STOCK_THRESHOLD - 1 })
      const result = reserve({ variant, orderId: 'order-1', quantity: 1 })
      
      expect(result.depletedEvent?.type).toBe('StockDepleted')
    })

    it('does not emit event when reserveQty is 0', () => {
      const variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 0 })
      const result = reserve({ variant, orderId: 'order-1', quantity: 5 })

      expect(result.event).toBeUndefined()
    })
  })

  describe('releaseReservation', () => {
    it('releases existing reservation', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 })
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 5 })
      variant = reserved.variant

      const result = releaseReservation({ variant, orderId: 'order-1' })

      expect(result.event?.payload.quantity).toBe(5)
      expect(availableStock(result.variant)).toBe(10)
    })

    it('silent no-op for non-existent orderId', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
      })
      const result = releaseReservation({ variant, orderId: 'non-existent' })

      expect(result.event).toBeUndefined()
      expect(result.variant).toBe(variant)
    })
  })

  describe('confirmDepletion', () => {
    it('reduces totalOnHand and removes reservation', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 10 })
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 3 })
      variant = reserved.variant

      const result = confirmDepletion({ variant, orderId: 'order-1' })

      expect(result.variant.totalOnHand).toBe(7)
      expect(result.variant.sold).toBe(3)
      expect(result.variant.reservations.length).toBe(0)
    })

    it('caps totalOnHand at 0', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 2 })
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 5 })
      variant = reserved.variant

      const result = confirmDepletion({ variant, orderId: 'order-1' })

      expect(result.variant.totalOnHand).toBe(0)
    })

    it('emits StockDepleted when below threshold after reduction', () => {
      let variant = createProductVariant({ skuId: 'SKU-001', totalOnHand: 6 })
      const reserved = reserve({ variant, orderId: 'order-1', quantity: 2 })
      variant = reserved.variant

      const result = confirmDepletion({ variant, orderId: 'order-1' })

      expect(result.variant.totalOnHand).toBe(4)
      expect(result.event?.type).toBe('StockDepleted')
    })

    it('silent no-op for non-existent orderId', () => {
      const variant = createProductVariant({
        skuId: 'SKU-001',
        totalOnHand: 10,
      })
      const result = confirmDepletion({ variant, orderId: 'non-existent' })

      expect(result.event).toBeUndefined()
    })
  })

  describe('createStockReservation', () => {
    it('throws for zero quantity', () => {
      expect(() => createStockReservation('order-1', 0)).toThrow(
        'Reservation quantity must be positive',
      )
    })

    it('throws for negative quantity', () => {
      expect(() => createStockReservation('order-1', -1)).toThrow(
        'Reservation quantity must be positive',
      )
    })

    it('throws for empty orderId', () => {
      expect(() => createStockReservation('', 5)).toThrow(
        'orderId must be a non-empty string',
      )
    })

    it('trims whitespace from orderId', () => {
      const reservation = createStockReservation('  order-1  ', 5)
      expect(reservation.orderId).toBe('order-1')
    })

    it('uses custom timestamp when provided', () => {
      const timestamp = new Date('2024-01-01')
      const reservation = createStockReservation('order-1', 5, timestamp)
      expect(reservation.timestamp).toBe(timestamp)
    })
  })
})
