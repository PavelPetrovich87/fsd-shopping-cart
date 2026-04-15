import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InitiateCheckout } from './initiate-checkout'
import { CartState } from '@/entities/cart'
import type { Cart, CartItem } from '@/entities/cart'
import type { ICartRepository } from '@/entities/cart'
import type { ProductVariant } from '@/entities/product'
import type { IStockRepository } from '@/entities/product'
import { EventBus } from '@/shared/lib/event-bus'
import type { CheckoutInitiated } from './events'

function createMockCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    state: CartState.Active,
    items: new Map<string, CartItem>(),
    couponCode: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Cart
}

function createCartItem(
  skuId = 'SKU001',
  name = 'Test Product',
  quantity = 2,
  unitPriceCents = 2500,
): CartItem {
  return {
    skuId,
    name,
    unitPriceCents,
    quantity,
    createdAt: new Date(),
  }
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

describe('InitiateCheckout', () => {
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
    it('validates stock for all items, transitions cart, emits event', async () => {
      const items = new Map<string, CartItem>([
        ['SKU001', createCartItem('SKU001', 'Product A', 2)],
        ['SKU002', createCartItem('SKU002', 'Product B', 1, 1500)],
      ])
      const cart = createMockCart({ items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockImplementation((skuId: string) => {
        if (skuId === 'SKU001')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU001', totalOnHand: 10 }),
          )
        if (skuId === 'SKU002')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU002', totalOnHand: 5 }),
          )
        return Promise.resolve(null)
      })
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.cart.state).toBe(CartState.Checkout_Pending)
        expect(result.cart.id).toBe('cart-1')
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled()
      expect(publishSpy).toHaveBeenCalledTimes(1)
      const publishedEvent = publishSpy.mock.calls[0][0] as CheckoutInitiated
      expect(publishedEvent.eventType).toBe('CheckoutInitiated')
      expect(publishedEvent.cartId).toBe('cart-1')
    })
  })

  describe('empty cart', () => {
    it('returns empty_cart error', async () => {
      const cart = createMockCart({ items: new Map() })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.reason).toBe('empty_cart')
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled()
      expect(publishSpy).not.toHaveBeenCalled()
    })
  })

  describe('invalid cart state', () => {
    it('returns invalid_state error for Checkout_Pending', async () => {
      const items = new Map<string, CartItem>([['SKU001', createCartItem()]])
      const cart = createMockCart({ state: CartState.Checkout_Pending, items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.reason).toBe('invalid_state')
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled()
      expect(publishSpy).not.toHaveBeenCalled()
    })

    it('returns invalid_state error for Checked_Out', async () => {
      const items = new Map<string, CartItem>([['SKU001', createCartItem()]])
      const cart = createMockCart({ state: CartState.Checked_Out, items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.reason).toBe('invalid_state')
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled()
      expect(publishSpy).not.toHaveBeenCalled()
    })
  })

  describe('stock conflict', () => {
    it('returns stock_conflict with all conflicting items', async () => {
      const items = new Map<string, CartItem>([
        ['SKU001', createCartItem('SKU001', 'Product A', 2)],
        ['SKU002', createCartItem('SKU002', 'Product B', 10)],
      ])
      const cart = createMockCart({ items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockImplementation((skuId: string) => {
        if (skuId === 'SKU001')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU001', totalOnHand: 10 }),
          )
        if (skuId === 'SKU002')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU002', totalOnHand: 3 }),
          )
        return Promise.resolve(null)
      })
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.reason === 'stock_conflict') {
        expect(result.conflicts).toHaveLength(1)
        expect(result.conflicts[0]).toMatchObject({
          skuId: 'SKU002',
          productName: 'Product B',
          requestedQuantity: 10,
          availableQuantity: 3,
        })
      }
      expect(mockCartRepo.saveCart).not.toHaveBeenCalled()
      expect(publishSpy).not.toHaveBeenCalled()
    })

    it('returns all conflicts (not just first)', async () => {
      const items = new Map<string, CartItem>([
        ['SKU001', createCartItem('SKU001', 'Product A', 100)],
        ['SKU002', createCartItem('SKU002', 'Product B', 200)],
      ])
      const cart = createMockCart({ items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockImplementation((skuId: string) => {
        if (skuId === 'SKU001')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU001', totalOnHand: 1 }),
          )
        if (skuId === 'SKU002')
          return Promise.resolve(
            createMockVariant({ skuId: 'SKU002', totalOnHand: 2 }),
          )
        return Promise.resolve(null)
      })

      const result = await InitiateCheckout(
        mockCartRepo,
        mockStockRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.reason === 'stock_conflict') {
        expect(result.conflicts).toHaveLength(2)
      }
    })

    it('cart state unchanged after conflict', async () => {
      const items = new Map<string, CartItem>([
        ['SKU001', createCartItem('SKU001', 'Product A', 100)],
      ])
      const cart = createMockCart({ items })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(
        createMockVariant({ skuId: 'SKU001', totalOnHand: 1 }),
      )

      await InitiateCheckout(mockCartRepo, mockStockRepo, mockEventBus)

      expect(cart.state).toBe(CartState.Active)
    })
  })
})
