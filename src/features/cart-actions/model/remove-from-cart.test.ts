import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RemoveFromCart } from './remove-from-cart'
import type { Cart } from '@/entities/cart'
import { CartState } from '@/entities/cart'
import type { ICartRepository } from '@/entities/cart'
import type { ItemRemovedFromCart } from '@/entities/cart'
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

describe('RemoveFromCart', () => {
  let mockCartRepo: ICartRepository
  let mockEventBus: EventBus

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined),
    }
    mockEventBus = new EventBus()
  })

  describe('happy path', () => {
    it('should remove item from cart', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 3,
        createdAt: new Date(),
      }
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]]),
      })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)
      const publishSpy = vi.spyOn(mockEventBus, 'publish')

      const result = await RemoveFromCart('SKU001', mockCartRepo, mockEventBus)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.cart.items.has('SKU001')).toBe(false)
        expect(result.event.skuId).toBe('SKU001')
        expect(result.event.previousQuantity).toBe(3)
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled()
      expect(publishSpy).toHaveBeenCalledTimes(1)
      const publishedEvent = publishSpy.mock.calls[0][0] as ItemRemovedFromCart
      expect(publishedEvent.eventType).toBe('ItemRemovedFromCart')
      expect(publishedEvent.skuId).toBe('SKU001')
      expect(publishedEvent.previousQuantity).toBe(3)
    })
  })

  describe('cart not modifiable', () => {
    it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
      const cart = createMockCart({ state: CartState.Checkout_Pending })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)

      const result = await RemoveFromCart('SKU001', mockCartRepo, mockEventBus)

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'CartNotModifiableError') {
        expect(result.error.currentState).toBe(CartState.Checkout_Pending)
      }
    })

    it('should return CartNotModifiableError when cart is Checked_Out', async () => {
      const cart = createMockCart({ state: CartState.Checked_Out })
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)

      const result = await RemoveFromCart('SKU001', mockCartRepo, mockEventBus)

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'CartNotModifiableError') {
        expect(result.error.currentState).toBe(CartState.Checked_Out)
      }
    })
  })

  describe('item not found', () => {
    it('should return ItemNotFoundError when item not in cart', async () => {
      const cart = createMockCart()
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart)

      const result = await RemoveFromCart(
        'NONEXISTENT_SKU',
        mockCartRepo,
        mockEventBus,
      )

      expect(result.success).toBe(false)
      if (!result.success && result.error.type === 'ItemNotFoundError') {
        expect(result.error.skuId).toBe('NONEXISTENT_SKU')
      }
    })
  })
})
