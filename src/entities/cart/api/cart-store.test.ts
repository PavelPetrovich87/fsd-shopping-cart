import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore, getCartSelector } from './cart-store'
import { createCart, addItem } from '@/entities/cart'

function getStoreState(): ReturnType<typeof useCartStore.getState> {
  return useCartStore.getState()
}

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.setState({
      cart: createCart(),
      lastUpdatedAt: new Date(),
    })
  })

  it('initializes with valid cart state', () => {
    const state = getStoreState()
    expect(state.cart).toBeDefined()
    expect(state.cart.id).toBeDefined()
    expect(state.cart.state).toBe('Active')
    expect(state.cart.items.size).toBe(0)
  })

  it('replaces cart state atomically', () => {
    const { cart: initialCart } = getStoreState()
    const initialId = initialCart.id

    const nextCart = createCart()
    useCartStore.getState().replaceCart(nextCart)

    const state = getStoreState()
    expect(state.cart.id).not.toBe(initialId)
    expect(state.cart.id).toBe(nextCart.id)
  })

  it('updates lastUpdatedAt after replacement', () => {
    const { lastUpdatedAt: initialTime } = getStoreState()

    const nextCart = createCart()
    useCartStore.getState().replaceCart(nextCart)

    const state = getStoreState()
    expect(state.lastUpdatedAt.getTime()).toBeGreaterThanOrEqual(
      initialTime.getTime(),
    )
  })

  it('reflects cart with items after replacement', () => {
    const cartWithItems = createCart()
    const result = addItem(cartWithItems, {
      skuId: 'SKU-001',
      name: 'Test Product',
      unitPriceCents: 1000,
      quantity: 2,
    })
    const cartWithItems2 = result.cart

    useCartStore.getState().replaceCart(cartWithItems2)

    const state = getStoreState()
    expect(state.cart.items.size).toBe(1)
    expect(state.cart.items.has('SKU-001')).toBe(true)
  })

  it('returns stable state on repeated replacements with same cart', () => {
    const cart = createCart()
    useCartStore.getState().replaceCart(cart)
    const firstState = getStoreState()

    useCartStore.getState().replaceCart(cart)
    const secondState = getStoreState()

    expect(secondState.cart.id).toBe(firstState.cart.id)
  })

  it('getCartSelector returns cart from full state', () => {
    const cart = createCart()
    useCartStore.setState({ cart, lastUpdatedAt: new Date() })

    const fullState = getStoreState()
    const selected = getCartSelector(fullState)
    expect(selected).toBe(cart)
  })

  it('replaceCart action updates only cart and timestamp', () => {
    const original = getStoreState()
    const originalTimestamp = original.lastUpdatedAt.getTime()

    const newCart = createCart()
    useCartStore.getState().replaceCart(newCart)

    const updated = getStoreState()
    expect(updated.cart).toBe(newCart)
    expect(updated.lastUpdatedAt.getTime()).toBeGreaterThanOrEqual(
      originalTimestamp,
    )
    expect(updated.cart.id).not.toBe(original.cart.id)
  })
})
