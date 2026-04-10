import { describe, it, expect } from 'vitest'
import {
  CartState,
  createCartItem,
  createCart,
  getCartItems,
  getTotalPriceCents,
  getSubtotalCents,
  getItemCount,
  getUniqueItemCount,
  hasItem,
  getItem,
  withQuantity,
  addItem,
  removeItem,
  changeQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  initiateCheckout,
  markCheckedOut,
  canTransitionTo,
  toCartData,
  toCartItemData,
} from '../index'

describe('Cart', () => {
  const createItem = (overrides = {}) => ({
    skuId: 'SKU-001',
    name: 'Test Product',
    unitPriceCents: 2500,
    quantity: 1,
    createdAt: new Date(),
    ...overrides,
  })

  describe('CartItem', () => {
    it('creates with valid data', () => {
      const item = createCartItem(createItem())
      expect(item.skuId).toBe('SKU-001')
      expect(item.name).toBe('Test Product')
      expect(item.unitPriceCents).toBe(2500)
      expect(item.quantity).toBe(1)
    })

    it('calculates totalPriceCents correctly', () => {
      const item = createCartItem(createItem({ quantity: 3 }))
      expect(getTotalPriceCents(item)).toBe(7500)
    })

    it('throws for zero quantity', () => {
      expect(() => createCartItem(createItem({ quantity: 0 }))).toThrow(
        'Quantity must be at least 1',
      )
    })

    it('throws for negative quantity', () => {
      expect(() => createCartItem(createItem({ quantity: -1 }))).toThrow(
        'Quantity must be at least 1',
      )
    })

    it('throws for negative unit price', () => {
      expect(() =>
        createCartItem(createItem({ unitPriceCents: -100 })),
      ).toThrow('Unit price cannot be negative')
    })

    it('withQuantity creates new instance', () => {
      const item = createCartItem(createItem())
      const updated = withQuantity(item, 5)
      expect(updated.quantity).toBe(5)
      expect(item.quantity).toBe(1)
    })

    it('withQuantity throws for zero quantity', () => {
      const item = createCartItem(createItem())
      expect(() => withQuantity(item, 0)).toThrow('Quantity must be at least 1')
    })

    it('withQuantity throws for negative quantity', () => {
      const item = createCartItem(createItem())
      expect(() => withQuantity(item, -1)).toThrow(
        'Quantity must be at least 1',
      )
    })

    it('toData returns plain object', () => {
      const item = createCartItem(createItem())
      const data = toCartItemData(item)
      expect(data.skuId).toBe('SKU-001')
      expect(data.name).toBe('Test Product')
      expect(data.unitPriceCents).toBe(2500)
      expect(data.quantity).toBe(1)
      expect(data.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('createCart', () => {
    it('creates empty active cart', () => {
      const cart = createCart()
      expect(cart.state).toBe(CartState.Active)
      expect(getCartItems(cart)).toHaveLength(0)
      expect(cart.couponCode).toBe('')
    })

    it('creates with custom id', () => {
      const cart = createCart('custom-id')
      expect(cart.id).toBe('custom-id')
    })
  })

  describe('addItem', () => {
    it('adds new item to empty cart', () => {
      const cart = createCart()
      const { cart: newCart, events } = addItem(cart, createItem())

      expect(getCartItems(newCart)).toHaveLength(1)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('ItemAddedToCart')
    })

    it('increments quantity for existing SKU', () => {
      const cart = createCart()
      const { cart: cart1 } = addItem(cart, createItem())
      const { cart: newCart, events } = addItem(cart1, createItem())

      expect(getItem(newCart, 'SKU-001')?.quantity).toBe(2)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CartItemQuantityChanged')
    })

    it('adds different SKU alongside existing', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem({ skuId: 'SKU-001' })).cart
      const cart2 = addItem(cart1, createItem({ skuId: 'SKU-002' })).cart

      expect(getCartItems(cart2)).toHaveLength(2)
    })

    it('event contains correct payload', () => {
      const cart = createCart()
      const { events } = addItem(cart, createItem())

      expect(events[0]).toMatchObject({
        eventType: 'ItemAddedToCart',
        skuId: 'SKU-001',
        name: 'Test Product',
        unitPriceCents: 2500,
        quantity: 1,
      })
    })
  })

  describe('removeItem', () => {
    it('removes existing item', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { cart: newCart, events } = removeItem(cart1, 'SKU-001')

      expect(getCartItems(newCart)).toHaveLength(0)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('ItemRemovedFromCart')
    })

    it('handles non-existent item gracefully', () => {
      const cart = createCart()
      const { cart: resultCart, events } = removeItem(cart, 'NON-EXISTENT')

      expect(resultCart).toBe(cart)
      expect(events).toHaveLength(0)
    })

    it('event contains correct payload', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { events } = removeItem(cart1, 'SKU-001')

      expect(events[0]).toMatchObject({
        eventType: 'ItemRemovedFromCart',
        skuId: 'SKU-001',
        previousQuantity: 1,
      })
    })
  })

  describe('changeQuantity', () => {
    it('changes quantity', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { cart: newCart } = changeQuantity(cart1, 'SKU-001', 5)
      expect(getItem(newCart, 'SKU-001')?.quantity).toBe(5)
    })

    it('throws for quantity < 1', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      expect(() => changeQuantity(cart1, 'SKU-001', 0)).toThrow(
        'Quantity must be at least 1',
      )
    })

    it('throws for non-existent item', () => {
      const cart = createCart()
      expect(() => changeQuantity(cart, 'NON-EXISTENT', 5)).toThrow(
        "Item with skuId 'NON-EXISTENT' not found in cart",
      )
    })

    it('returns unchanged cart for same quantity', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { cart: newCart, events } = changeQuantity(cart1, 'SKU-001', 1)
      expect(newCart).toBe(cart1)
      expect(events).toHaveLength(0)
    })

    it('event contains correct payload', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { events } = changeQuantity(cart1, 'SKU-001', 5)

      expect(events[0]).toMatchObject({
        eventType: 'CartItemQuantityChanged',
        skuId: 'SKU-001',
        previousQuantity: 1,
        newQuantity: 5,
      })
    })
  })

  describe('clearCart', () => {
    it('clears all items', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem({ skuId: 'SKU-001' })).cart
      const cart2 = addItem(cart1, createItem({ skuId: 'SKU-002' })).cart

      const { cart: newCart, events } = clearCart(cart2)
      expect(getCartItems(newCart)).toHaveLength(0)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CartCleared')
    })

    it('handles empty cart gracefully', () => {
      const cart = createCart()
      const { cart: newCart, events } = clearCart(cart)
      expect(newCart).toBe(cart)
      expect(events).toHaveLength(0)
    })

    it('event contains correct item count', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem({ skuId: 'SKU-001' })).cart
      const cart2 = addItem(cart1, createItem({ skuId: 'SKU-002' })).cart
      const cart3 = addItem(cart2, createItem({ skuId: 'SKU-003' })).cart

      const { events } = clearCart(cart3)
      expect(events[0]).toMatchObject({
        eventType: 'CartCleared',
        itemCount: 3,
      })
    })
  })

  describe('Cart coupon operations', () => {
    it('applies coupon', () => {
      const cart = createCart()
      const { cart: newCart, events } = applyCoupon(cart, 'SAVE10')

      expect(newCart.couponCode).toBe('SAVE10')
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CouponApplied')
    })

    it('normalizes coupon code to uppercase', () => {
      const cart = createCart()
      const { cart: newCart } = applyCoupon(cart, 'save10')
      expect(newCart.couponCode).toBe('SAVE10')
    })

    it('trims whitespace from coupon code', () => {
      const cart = createCart()
      const { cart: newCart } = applyCoupon(cart, '  SAVE10  ')
      expect(newCart.couponCode).toBe('SAVE10')
    })

    it('replaces existing coupon', () => {
      const cart = createCart()
      const cart1 = applyCoupon(cart, 'SAVE10').cart
      const { cart: newCart } = applyCoupon(cart1, 'FLAT20')
      expect(newCart.couponCode).toBe('FLAT20')
    })

    it('throws for empty coupon', () => {
      const cart = createCart()
      expect(() => applyCoupon(cart, '')).toThrow('Coupon code cannot be empty')
    })

    it('throws for whitespace-only coupon', () => {
      const cart = createCart()
      expect(() => applyCoupon(cart, '   ')).toThrow(
        'Coupon code cannot be empty',
      )
    })

    it('removes coupon', () => {
      const cart = createCart()
      const cart1 = applyCoupon(cart, 'SAVE10').cart
      const { cart: newCart, events } = removeCoupon(cart1)
      expect(newCart.couponCode).toBe('')
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CouponRemoved')
    })

    it('handles removing non-existent coupon gracefully', () => {
      const cart = createCart()
      const { cart: newCart, events } = removeCoupon(cart)
      expect(newCart).toBe(cart)
      expect(events).toHaveLength(0)
    })
  })

  describe('Cart state transitions', () => {
    it('initiates checkout from Active', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const { cart: newCart, events } = initiateCheckout(cart1)

      expect(newCart.state).toBe(CartState.Checkout_Pending)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CheckoutInitiated')
    })

    it('throws for empty cart checkout', () => {
      const cart = createCart()
      expect(() => initiateCheckout(cart)).toThrow(
        'Cannot initiate checkout with empty cart',
      )
    })

    it('throws for non-Active state', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const cart2 = initiateCheckout(cart1).cart

      expect(() => initiateCheckout(cart2)).toThrow(
        "Cannot initiate checkout from state 'Checkout_Pending'",
      )
    })

    it('marks checked out from Checkout_Pending', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const cart2 = initiateCheckout(cart1).cart
      const { cart: newCart, events } = markCheckedOut(cart2)

      expect(newCart.state).toBe(CartState.Checked_Out)
      expect(events).toHaveLength(1)
      expect(events[0].eventType).toBe('CheckoutCompleted')
    })

    it('throws for invalid transition (markCheckedOut from Active)', () => {
      const cart = createCart()
      expect(() => markCheckedOut(cart)).toThrow(
        "Cannot complete checkout from state 'Active'",
      )
    })

    it('throws for invalid transition (markCheckedOut from Checked_Out)', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const cart2 = initiateCheckout(cart1).cart
      const cart3 = markCheckedOut(cart2).cart

      expect(() => markCheckedOut(cart3)).toThrow(
        "Cannot complete checkout from state 'Checked_Out'",
      )
    })

    it('full checkout flow works correctly', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const cart2 = initiateCheckout(cart1).cart
      const cart3 = markCheckedOut(cart2).cart
      expect(cart3.state).toBe(CartState.Checked_Out)
    })

    it('canTransitionTo returns correct values', () => {
      const activeCart = createCart()
      expect(canTransitionTo(activeCart, CartState.Checkout_Pending)).toBe(true)
      expect(canTransitionTo(activeCart, CartState.Checked_Out)).toBe(false)

      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const pendingCart = initiateCheckout(cart1).cart
      expect(canTransitionTo(pendingCart, CartState.Checkout_Pending)).toBe(
        false,
      )
      expect(canTransitionTo(pendingCart, CartState.Checked_Out)).toBe(true)
    })
  })

  describe('Cart.getSubtotalCents', () => {
    it('calculates correctly for single item', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem({ quantity: 2 })).cart
      expect(getSubtotalCents(cart1)).toBe(5000)
    })

    it('calculates correctly for multiple items', () => {
      const cart = createCart()
      const cart1 = addItem(
        cart,
        createItem({ skuId: 'SKU-001', quantity: 2 }),
      ).cart
      const cart2 = addItem(
        cart1,
        createItem({ skuId: 'SKU-002', quantity: 3, unitPriceCents: 1000 }),
      ).cart

      expect(getSubtotalCents(cart2)).toBe(8000)
    })

    it('returns 0 for empty cart', () => {
      const cart = createCart()
      expect(getSubtotalCents(cart)).toBe(0)
    })

    it('updates after item removal', () => {
      const cart = createCart()
      const cart1 = addItem(
        cart,
        createItem({ skuId: 'SKU-001', quantity: 2 }),
      ).cart
      const cart2 = addItem(
        cart1,
        createItem({ skuId: 'SKU-002', quantity: 1, unitPriceCents: 1000 }),
      ).cart
      const cart3 = removeItem(cart2, 'SKU-001').cart

      expect(getSubtotalCents(cart3)).toBe(1000)
    })
  })

  describe('Cart.getItemCount', () => {
    it('counts total quantity across items', () => {
      const cart = createCart()
      const cart1 = addItem(
        cart,
        createItem({ skuId: 'SKU-001', quantity: 2 }),
      ).cart
      const cart2 = addItem(
        cart1,
        createItem({ skuId: 'SKU-002', quantity: 3 }),
      ).cart

      expect(getItemCount(cart2)).toBe(5)
    })

    it('returns 0 for empty cart', () => {
      const cart = createCart()
      expect(getItemCount(cart)).toBe(0)
    })
  })

  describe('Cart.getUniqueItemCount', () => {
    it('returns count of unique SKUs', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem({ skuId: 'SKU-001' })).cart
      const cart2 = addItem(cart1, createItem({ skuId: 'SKU-002' })).cart
      const cart3 = addItem(cart2, createItem({ skuId: 'SKU-003' })).cart

      expect(getUniqueItemCount(cart3)).toBe(3)
    })
  })

  describe('Immutability', () => {
    it('operations return new cart instance', () => {
      const original = createCart()
      const { cart: modified } = addItem(original, createItem())

      expect(original).not.toBe(modified)
      expect(getCartItems(original)).toHaveLength(0)
      expect(getCartItems(modified)).toHaveLength(1)
    })

    it('original cart unchanged after multiple operations', () => {
      const original = createCart()

      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      const cart2 = addItem(cart1, createItem({ skuId: 'SKU-002' })).cart
      applyCoupon(cart2, 'SAVE10')

      expect(getCartItems(original)).toHaveLength(0)
      expect(original.couponCode).toBe('')
    })
  })

  describe('Cart.toCartData', () => {
    it('returns complete cart data', () => {
      const cart = createCart('cart-1')
      const cart1 = addItem(cart, createItem({ quantity: 2 })).cart
      const cart2 = applyCoupon(cart1, 'SAVE10').cart

      const data = toCartData(cart2)

      expect(data.id).toBe('cart-1')
      expect(data.state).toBe(CartState.Active)
      expect(data.items).toHaveLength(1)
      expect(data.couponCode).toBe('SAVE10')
      expect(data.subtotalCents).toBe(5000)
      expect(data.createdAt).toBeInstanceOf(Date)
      expect(data.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('Cart getters', () => {
    it('hasItem returns correct boolean', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      expect(hasItem(cart1, 'SKU-001')).toBe(true)
      expect(hasItem(cart1, 'SKU-999')).toBe(false)
    })

    it('getItem returns item or undefined', () => {
      const cart = createCart()
      const cart1 = addItem(cart, createItem()).cart
      expect(getItem(cart1, 'SKU-001')).toBeDefined()
      expect(getItem(cart1, 'SKU-999')).toBeUndefined()
    })
  })
})
