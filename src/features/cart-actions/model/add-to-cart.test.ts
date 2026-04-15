import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AddToCart } from './add-to-cart'
import type { Cart } from '@/entities/cart'
import { CartState } from '@/entities/cart'
import type { ICartRepository } from '@/entities/cart'
import type { ItemAddedToCart } from '@/entities/cart'
import type { ProductVariant } from '@/entities/product'
import type { IStockRepository } from '@/entities/product'
import { EventBus } from '@/shared/lib/event-bus'

function createMockCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    state: CartState.Active,
    items: new Map(),
    couponCode: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Cart
}

function createMockVariant(
  overrides: Partial<ProductVariant> = {},
): ProductVariant {
  return {
    skuId: 'SKU001',
    totalOnHand: 10,
    sold: 0,
    reservations: [],
    ...overrides,
  } as ProductVariant
}

describe('AddToCart', () => {
  let mockCartRepo: ICartRepository
  let mockStockRepo: IStockRepository
  let mockEventBus: EventBus

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined),
    }
    mockStockRepo = {
      findBySku: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    }
    mockEventBus = new EventBus()
  })

  describe('happy path', () => {
    it('should add new item to cart', async () => {
      const cart = createMockCart()
      const variant = createMockVariant()
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await AddToCart(
        'SKU001',
        2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.cart.items.has('SKU001')).toBe(true)
        expect(result.event.skuId).toBe('SKU001')
        expect(result.event.quantity).toBe(2)
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled()
      expect(publishSpy).toHaveBeenCalledTimes(1)
      const publishedEvent = publishSpy.mock.calls[0][0] as ItemAddedToCart
      expect(publishedEvent.eventType).toBe('ItemAddedToCart')
      expect(publishedEvent.skuId).toBe('SKU001')
      expect(publishedEvent.quantity).toBe(2)
    })

    it('should increment quantity if item already in cart', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Existing Item',
        unitPriceCents: 1000,
        quantity: 3,
        createdAt: new Date(),
      }
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]]),
      })
      const variant = createMockVariant()
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await AddToCart(
        'SKU001',
        2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.event.quantity).toBe(5)
      }
      expect(publishSpy).toHaveBeenCalledTimes(1)
      const publishedEvent = publishSpy.mock.calls[0][0] as ItemAddedToCart
      expect(publishedEvent.eventType).toBe('ItemAddedToCart')
      expect(publishedEvent.quantity).toBe(5)
    })
  })

  describe('insufficient stock', () => {
    it('should return InsufficientStockError when requested > available', async () => {
      const cart = createMockCart()
      const variant = createMockVariant({ totalOnHand: 5, reservations: [] })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant)

      const result = await AddToCart(
        'SKU001',
        10,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.type).toBe('InsufficientStockError')
        if (result.error.type === 'InsufficientStockError') {
          expect(result.error.requested).toBe(10)
          expect(result.error.available).toBe(5)
        }
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled()
    })
  })

  describe('cart not modifiable', () => {
    it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
      const cart = createMockCart({ state: CartState.Checkout_Pending })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)

      const result = await AddToCart(
        'SKU001',
        2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'CartNotModifiableError') {
        expect(result.error.currentState).toBe(CartState.Checkout_Pending)
      }
    })

    it('should return CartNotModifiableError when cart is Checked_Out', async () => {
      const cart = createMockCart({ state: CartState.Checked_Out })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)

      const result = await AddToCart(
        'SKU001',
        2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'CartNotModifiableError') {
        expect(result.error.currentState).toBe(CartState.Checked_Out)
      }
    })
  })

  describe('item not found', () => {
    it('should return ItemNotFoundError when variant is null', async () => {
      const cart = createMockCart()
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(null)

      const result = await AddToCart(
        'INVALID_SKU',
        2,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'ItemNotFoundError') {
        expect(result.error.skuId).toBe('INVALID_SKU')
      }
    })
  })

  describe('stock conflict (race)', () => {
    it('should return StockConflictError when stock drops between check and save', async () => {
      const cart = createMockCart()
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      const variantHigh = createMockVariant({
        totalOnHand: 10,
        reservations: [],
      })
      const variantLow = createMockVariant({ totalOnHand: 3, reservations: [] })

      vi.mocked(mockStockRepo.findBySku)
        .mockResolvedValueOnce(variantHigh)
        .mockResolvedValueOnce(variantLow)

      const result = await AddToCart(
        'SKU001',
        5,
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'StockConflictError') {
        expect(result.error.currentAvailable).toBe(3)
      }
    })
  })
})
