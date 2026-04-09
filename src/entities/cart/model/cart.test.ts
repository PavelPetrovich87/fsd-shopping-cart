import { describe, it, expect } from 'vitest';
import { Cart, CartItem, CartState } from '../index';

describe('Cart', () => {
  const createItem = (overrides = {}) => ({
    skuId: 'SKU-001',
    name: 'Test Product',
    unitPriceCents: 2500,
    quantity: 1,
    createdAt: new Date(),
    ...overrides,
  });

  describe('CartItem', () => {
    it('creates with valid data', () => {
      const item = CartItem.create(createItem());
      expect(item.skuId).toBe('SKU-001');
      expect(item.name).toBe('Test Product');
      expect(item.unitPriceCents).toBe(2500);
      expect(item.quantity).toBe(1);
    });

    it('calculates totalPriceCents correctly', () => {
      const item = CartItem.create(createItem({ quantity: 3 }));
      expect(item.totalPriceCents).toBe(7500);
    });

    it('throws for zero quantity', () => {
      expect(() => CartItem.create(createItem({ quantity: 0 }))).toThrow(
        'Quantity must be at least 1'
      );
    });

    it('throws for negative quantity', () => {
      expect(() => CartItem.create(createItem({ quantity: -1 }))).toThrow(
        'Quantity must be at least 1'
      );
    });

    it('throws for negative unit price', () => {
      expect(() =>
        CartItem.create(createItem({ unitPriceCents: -100 }))
      ).toThrow('Unit price cannot be negative');
    });

    it('withQuantity creates new instance', () => {
      const item = CartItem.create(createItem());
      const updated = item.withQuantity(5);
      expect(updated.quantity).toBe(5);
      expect(item.quantity).toBe(1);
    });

    it('withQuantity throws for zero quantity', () => {
      const item = CartItem.create(createItem());
      expect(() => item.withQuantity(0)).toThrow('Quantity must be at least 1');
    });

    it('withQuantity throws for negative quantity', () => {
      const item = CartItem.create(createItem());
      expect(() => item.withQuantity(-1)).toThrow('Quantity must be at least 1');
    });

    it('toData returns plain object', () => {
      const item = CartItem.create(createItem());
      const data = item.toData();
      expect(data.skuId).toBe('SKU-001');
      expect(data.name).toBe('Test Product');
      expect(data.unitPriceCents).toBe(2500);
      expect(data.quantity).toBe(1);
      expect(data.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Cart.create', () => {
    it('creates empty active cart', () => {
      const cart = Cart.create();
      expect(cart.state).toBe(CartState.Active);
      expect(cart.items).toHaveLength(0);
      expect(cart.couponCode).toBe('');
    });

    it('creates with custom id', () => {
      const cart = Cart.create('custom-id');
      expect(cart.id).toBe('custom-id');
    });
  });

  describe('Cart.addItem', () => {
    it('adds new item to empty cart', () => {
      const cart = Cart.create();
      const { cart: newCart, events } = cart.addItem(createItem());

      expect(newCart.items).toHaveLength(1);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ItemAddedToCart');
    });

    it('increments quantity for existing SKU', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { cart: newCart, events } = cart.addItem(createItem());

      expect(newCart.getItem('SKU-001')?.quantity).toBe(2);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CartItemQuantityChanged');
    });

    it('adds different SKU alongside existing', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001' }))
        .cart.addItem(createItem({ skuId: 'SKU-002' })).cart;

      expect(cart.items).toHaveLength(2);
    });

    it('event contains correct payload', () => {
      const cart = Cart.create();
      const { events } = cart.addItem(createItem());

      expect(events[0]).toMatchObject({
        eventType: 'ItemAddedToCart',
        skuId: 'SKU-001',
        name: 'Test Product',
        unitPriceCents: 2500,
        quantity: 1,
      });
    });
  });

  describe('Cart.removeItem', () => {
    it('removes existing item', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { cart: newCart, events } = cart.removeItem('SKU-001');

      expect(newCart.items).toHaveLength(0);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ItemRemovedFromCart');
    });

    it('handles non-existent item gracefully', () => {
      const cart = Cart.create();
      const { cart: resultCart, events } = cart.removeItem('NON-EXISTENT');

      expect(resultCart).toBe(cart);
      expect(events).toHaveLength(0);
    });

    it('event contains correct payload', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { events } = cart.removeItem('SKU-001');

      expect(events[0]).toMatchObject({
        eventType: 'ItemRemovedFromCart',
        skuId: 'SKU-001',
        previousQuantity: 1,
      });
    });
  });

  describe('Cart.changeQuantity', () => {
    it('changes quantity', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { cart: newCart } = cart.changeQuantity('SKU-001', 5);
      expect(newCart.getItem('SKU-001')?.quantity).toBe(5);
    });

    it('throws for quantity < 1', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      expect(() => cart.changeQuantity('SKU-001', 0)).toThrow(
        'Quantity must be at least 1'
      );
    });

    it('throws for non-existent item', () => {
      const cart = Cart.create();
      expect(() => cart.changeQuantity('NON-EXISTENT', 5)).toThrow(
        "Item with skuId 'NON-EXISTENT' not found in cart"
      );
    });

    it('returns unchanged cart for same quantity', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { cart: newCart, events } = cart.changeQuantity('SKU-001', 1);
      expect(newCart).toBe(cart);
      expect(events).toHaveLength(0);
    });

    it('event contains correct payload', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { events } = cart.changeQuantity('SKU-001', 5);

      expect(events[0]).toMatchObject({
        eventType: 'CartItemQuantityChanged',
        skuId: 'SKU-001',
        previousQuantity: 1,
        newQuantity: 5,
      });
    });
  });

  describe('Cart.clearCart', () => {
    it('clears all items', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001' }))
        .cart.addItem(createItem({ skuId: 'SKU-002' })).cart;

      const { cart: newCart, events } = cart.clearCart();
      expect(newCart.items).toHaveLength(0);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CartCleared');
    });

    it('handles empty cart gracefully', () => {
      const cart = Cart.create();
      const { cart: newCart, events } = cart.clearCart();
      expect(newCart).toBe(cart);
      expect(events).toHaveLength(0);
    });

    it('event contains correct item count', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001' }))
        .cart.addItem(createItem({ skuId: 'SKU-002' }))
        .cart.addItem(createItem({ skuId: 'SKU-003' })).cart;

      const { events } = cart.clearCart();
      expect(events[0]).toMatchObject({
        eventType: 'CartCleared',
        itemCount: 3,
      });
    });
  });

  describe('Cart coupon operations', () => {
    it('applies coupon', () => {
      const cart = Cart.create();
      const { cart: newCart, events } = cart.applyCoupon('SAVE10');

      expect(newCart.couponCode).toBe('SAVE10');
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CouponApplied');
    });

    it('normalizes coupon code to uppercase', () => {
      const cart = Cart.create();
      const { cart: newCart } = cart.applyCoupon('save10');
      expect(newCart.couponCode).toBe('SAVE10');
    });

    it('trims whitespace from coupon code', () => {
      const cart = Cart.create();
      const { cart: newCart } = cart.applyCoupon('  SAVE10  ');
      expect(newCart.couponCode).toBe('SAVE10');
    });

    it('replaces existing coupon', () => {
      const cart = Cart.create().applyCoupon('SAVE10').cart;
      const { cart: newCart } = cart.applyCoupon('FLAT20');
      expect(newCart.couponCode).toBe('FLAT20');
    });

    it('throws for empty coupon', () => {
      const cart = Cart.create();
      expect(() => cart.applyCoupon('')).toThrow(
        'Coupon code cannot be empty'
      );
    });

    it('throws for whitespace-only coupon', () => {
      const cart = Cart.create();
      expect(() => cart.applyCoupon('   ')).toThrow(
        'Coupon code cannot be empty'
      );
    });

    it('removes coupon', () => {
      const cart = Cart.create().applyCoupon('SAVE10').cart;
      const { cart: newCart, events } = cart.removeCoupon();
      expect(newCart.couponCode).toBe('');
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CouponRemoved');
    });

    it('handles removing non-existent coupon gracefully', () => {
      const cart = Cart.create();
      const { cart: newCart, events } = cart.removeCoupon();
      expect(newCart).toBe(cart);
      expect(events).toHaveLength(0);
    });
  });

  describe('Cart state transitions', () => {
    it('initiates checkout from Active', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      const { cart: newCart, events } = cart.initiateCheckout();

      expect(newCart.state).toBe(CartState.Checkout_Pending);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CheckoutInitiated');
    });

    it('throws for empty cart checkout', () => {
      const cart = Cart.create();
      expect(() => cart.initiateCheckout()).toThrow(
        'Cannot initiate checkout with empty cart'
      );
    });

    it('throws for non-Active state', () => {
      const cart = Cart.create()
        .addItem(createItem())
        .cart.initiateCheckout().cart;

      expect(() => cart.initiateCheckout()).toThrow(
        "Cannot initiate checkout from state 'Checkout_Pending'"
      );
    });

    it('marks checked out from Checkout_Pending', () => {
      const cart = Cart.create()
        .addItem(createItem())
        .cart.initiateCheckout().cart;
      const { cart: newCart, events } = cart.markCheckedOut();

      expect(newCart.state).toBe(CartState.Checked_Out);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('CheckoutCompleted');
    });

    it('throws for invalid transition (markCheckedOut from Active)', () => {
      const cart = Cart.create();
      expect(() => cart.markCheckedOut()).toThrow(
        "Cannot complete checkout from state 'Active'"
      );
    });

    it('throws for invalid transition (markCheckedOut from Checked_Out)', () => {
      const cart = Cart.create()
        .addItem(createItem())
        .cart.initiateCheckout()
        .cart.markCheckedOut().cart;

      expect(() => cart.markCheckedOut()).toThrow(
        "Cannot complete checkout from state 'Checked_Out'"
      );
    });

    it('full checkout flow works correctly', () => {
      const cart = Cart.create()
        .addItem(createItem())
        .cart.initiateCheckout().cart.markCheckedOut().cart;
      expect(cart.state).toBe(CartState.Checked_Out);
    });

    it('canTransitionTo returns correct values', () => {
      const activeCart = Cart.create();
      expect(activeCart.canTransitionTo(CartState.Checkout_Pending)).toBe(true);
      expect(activeCart.canTransitionTo(CartState.Checked_Out)).toBe(false);

      const pendingCart = activeCart.addItem(createItem()).cart.initiateCheckout().cart;
      expect(pendingCart.canTransitionTo(CartState.Checkout_Pending)).toBe(false);
      expect(pendingCart.canTransitionTo(CartState.Checked_Out)).toBe(true);
    });
  });

  describe('Cart.subtotalCents', () => {
    it('calculates correctly for single item', () => {
      const cart = Cart.create().addItem(createItem({ quantity: 2 })).cart;
      expect(cart.subtotalCents).toBe(5000);
    });

    it('calculates correctly for multiple items', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001', quantity: 2 }))
        .cart.addItem(createItem({ skuId: 'SKU-002', quantity: 3, unitPriceCents: 1000 })).cart;

      expect(cart.subtotalCents).toBe(8000);
    });

    it('returns 0 for empty cart', () => {
      const cart = Cart.create();
      expect(cart.subtotalCents).toBe(0);
    });

    it('updates after item removal', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001', quantity: 2 }))
        .cart.addItem(createItem({ skuId: 'SKU-002', quantity: 1, unitPriceCents: 1000 }))
        .cart.removeItem('SKU-001').cart;

      expect(cart.subtotalCents).toBe(1000);
    });
  });

  describe('Cart.itemCount', () => {
    it('counts total quantity across items', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001', quantity: 2 }))
        .cart.addItem(createItem({ skuId: 'SKU-002', quantity: 3 })).cart;

      expect(cart.itemCount).toBe(5);
    });

    it('returns 0 for empty cart', () => {
      const cart = Cart.create();
      expect(cart.itemCount).toBe(0);
    });
  });

  describe('Cart.uniqueItemCount', () => {
    it('returns count of unique SKUs', () => {
      const cart = Cart.create()
        .addItem(createItem({ skuId: 'SKU-001' }))
        .cart.addItem(createItem({ skuId: 'SKU-002' }))
        .cart.addItem(createItem({ skuId: 'SKU-003' })).cart;

      expect(cart.uniqueItemCount).toBe(3);
    });
  });

  describe('Immutability', () => {
    it('operations return new cart instance', () => {
      const original = Cart.create();
      const { cart: modified } = original.addItem(createItem());

      expect(original).not.toBe(modified);
      expect(original.items).toHaveLength(0);
      expect(modified.items).toHaveLength(1);
    });

    it('original cart unchanged after multiple operations', () => {
      const original = Cart.create();

      Cart.create()
        .addItem(createItem())
        .cart.addItem(createItem({ skuId: 'SKU-002' }))
        .cart.applyCoupon('SAVE10');

      expect(original.items).toHaveLength(0);
      expect(original.couponCode).toBe('');
    });
  });

  describe('Cart.toData', () => {
    it('returns complete cart data', () => {
      const cart = Cart.create('cart-1')
        .addItem(createItem({ quantity: 2 }))
        .cart.applyCoupon('SAVE10').cart;

      const data = cart.toData();

      expect(data.id).toBe('cart-1');
      expect(data.state).toBe(CartState.Active);
      expect(data.items).toHaveLength(1);
      expect(data.couponCode).toBe('SAVE10');
      expect(data.subtotalCents).toBe(5000);
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Cart getters', () => {
    it('hasItem returns correct boolean', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      expect(cart.hasItem('SKU-001')).toBe(true);
      expect(cart.hasItem('SKU-999')).toBe(false);
    });

    it('getItem returns item or undefined', () => {
      const cart = Cart.create().addItem(createItem()).cart;
      expect(cart.getItem('SKU-001')).toBeDefined();
      expect(cart.getItem('SKU-999')).toBeUndefined();
    });
  });
});
