import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangeCartItemQuantity } from './change-quantity';
import type { Cart } from '@/entities/cart';
import { CartState } from '@/entities/cart';
import type { ICartRepository } from '@/entities/cart/model/ports';
import type { ProductVariant, IStockRepository } from '@/entities/product';
import { EventBus } from '@/shared/lib/event-bus';

function createMockCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    state: CartState.Active,
    items: new Map(),
    couponCode: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  } as Cart;
}

function createMockVariant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    skuId: 'SKU001',
    totalOnHand: 10,
    sold: 0,
    reservations: [],
    ...overrides
  } as ProductVariant;
}

describe('ChangeCartItemQuantity', () => {
  let mockCartRepo: ICartRepository;
  let mockStockRepo: IStockRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockCartRepo = {
      getCart: vi.fn(),
      saveCart: vi.fn().mockResolvedValue(undefined)
    };
    mockStockRepo = {
      findBySku: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined)
    };
    mockEventBus = new EventBus();
  });

  describe('happy path', () => {
    it('should increase quantity within stock limits', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 2,
        createdAt: new Date()
      };
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]])
      });
      const variant = createMockVariant({ totalOnHand: 10, reservations: [] });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant);

      const result = await ChangeCartItemQuantity(
        'SKU001', 5,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.skuId).toBe('SKU001');
        expect(result.event.previousQuantity).toBe(2);
        expect(result.event.newQuantity).toBe(5);
      }
      expect(mockCartRepo.saveCart).toHaveBeenCalled();
    });

    it('should decrease quantity', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 5,
        createdAt: new Date()
      };
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]])
      });
      const variant = createMockVariant({ totalOnHand: 10, reservations: [] });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant);

      const result = await ChangeCartItemQuantity(
        'SKU001', 3,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.newQuantity).toBe(3);
      }
    });
  });

  describe('quantity < 1', () => {
    it('should return ItemNotFoundError for quantity 0', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 2,
        createdAt: new Date()
      };
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]])
      });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await ChangeCartItemQuantity(
        'SKU001', 0,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success && result.error.type === 'ItemNotFoundError') {
        expect(result.error.skuId).toBe('SKU001');
      }
    });
  });

  describe('insufficient stock', () => {
    it('should return InsufficientStockError when quantity > available', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 2,
        createdAt: new Date()
      };
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]])
      });
      const variant = createMockVariant({ totalOnHand: 3, reservations: [] });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      vi.mocked(mockStockRepo.findBySku).mockResolvedValue(variant);

      const result = await ChangeCartItemQuantity(
        'SKU001', 5,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success && result.error.type === 'InsufficientStockError') {
        expect(result.error.requested).toBe(5);
        expect(result.error.available).toBe(3);
      }
    });
  });

  describe('cart not modifiable', () => {
    it('should return CartNotModifiableError when cart is Checkout_Pending', async () => {
      const cart = createMockCart({ state: CartState.Checkout_Pending });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);

      const result = await ChangeCartItemQuantity(
        'SKU001', 5,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success && result.error.type === 'CartNotModifiableError') {
        expect(result.error.currentState).toBe(CartState.Checkout_Pending);
      }
    });
  });

  describe('stock conflict (race)', () => {
    it('should return StockConflictError when stock drops between check and save', async () => {
      const existingItem = {
        skuId: 'SKU001',
        name: 'Test Item',
        unitPriceCents: 1000,
        quantity: 2,
        createdAt: new Date()
      };
      const cart = createMockCart({
        items: new Map([['SKU001', existingItem]])
      });
      vi.mocked(mockCartRepo.getCart).mockResolvedValue(cart);
      const variantHigh = createMockVariant({ totalOnHand: 10, reservations: [] });
      const variantLow = createMockVariant({ totalOnHand: 2, reservations: [] });

      vi.mocked(mockStockRepo.findBySku)
        .mockResolvedValueOnce(variantHigh)
        .mockResolvedValueOnce(variantLow);

      const result = await ChangeCartItemQuantity(
        'SKU001', 5,
        mockCartRepo,
        mockStockRepo,
        mockEventBus
      );

      expect(result.success).toBe(false);
      if (!result.success && result.error.type === 'StockConflictError') {
        expect(result.error.currentAvailable).toBe(2);
      }
    });
  });
});