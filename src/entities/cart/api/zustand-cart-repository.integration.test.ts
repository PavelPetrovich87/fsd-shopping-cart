import { describe, it, expect, beforeEach } from 'vitest'
import { createCart, addItem } from '@/entities/cart'
import { zustandCartRepository } from './zustand-cart-repository'
import { useCartStore } from './cart-store'

function getStoreState() {
  return useCartStore.getState()
}

describe('ZustandCartRepository Integration', () => {
  beforeEach(() => {
    useCartStore.setState({
      cart: createCart(),
      lastUpdatedAt: new Date(),
    })
  })

  it('T009 - save->get round-trip returns equivalent cart state', async () => {
    const original = createCart()
    const result = addItem(original, {
      skuId: 'SKU-001',
      name: 'Test Product',
      unitPriceCents: 1000,
      quantity: 2,
    })
    const cartWithItem = result.cart

    await zustandCartRepository.saveCart(cartWithItem)
    const retrieved = await zustandCartRepository.getCart()

    expect(retrieved).toBeDefined()
    expect(retrieved.id).toBe(cartWithItem.id)
    expect(retrieved.items.size).toBe(cartWithItem.items.size)
    expect(retrieved.items.has('SKU-001')).toBe(true)
  })

  it('T009 - round-trip preserves item quantity and price', async () => {
    const original = createCart()
    const result = addItem(original, {
      skuId: 'SKU-002',
      name: 'Another Product',
      unitPriceCents: 2500,
      quantity: 3,
    })
    const cartWithItem = result.cart

    await zustandCartRepository.saveCart(cartWithItem)
    const retrieved = await zustandCartRepository.getCart()

    const retrievedItem = retrieved.items.get('SKU-002')
    expect(retrievedItem).toBeDefined()
    expect(retrievedItem!.quantity).toBe(3)
    expect(retrievedItem!.unitPriceCents).toBe(2500)
  })

  it('T010 - sequential saves produce non-stale observable results', async () => {
    const cart1 = createCart()
    await zustandCartRepository.saveCart(cart1)
    const read1 = await zustandCartRepository.getCart()

    const cart2 = createCart()
    const result2 = addItem(cart2, {
      skuId: 'SKU-003',
      name: 'Product Three',
      unitPriceCents: 500,
      quantity: 1,
    })
    await zustandCartRepository.saveCart(result2.cart)
    const read2 = await zustandCartRepository.getCart()

    expect(read2.id).not.toBe(read1.id)
    expect(read2.items.has('SKU-003')).toBe(true)
    expect(read1.items.has('SKU-003')).toBe(false)
  })

  it('T010 - empty-cart save path remains valid', async () => {
    const emptyCart = createCart()
    await zustandCartRepository.saveCart(emptyCart)
    const retrieved = await zustandCartRepository.getCart()

    expect(retrieved).toBeDefined()
    expect(retrieved.items.size).toBe(0)
    expect(retrieved.id).toBe(emptyCart.id)
  })

  it('T010 - repeated empty-cart saves remain stable', async () => {
    const emptyCart = createCart()
    await zustandCartRepository.saveCart(emptyCart)
    const first = await zustandCartRepository.getCart()

    await zustandCartRepository.saveCart(emptyCart)
    const second = await zustandCartRepository.getCart()

    expect(second.id).toBe(first.id)
    expect(second.items.size).toBe(0)
  })

  it('T011 - save-to-update completes within latency threshold', async () => {
    const cart = createCart()
    const result = addItem(cart, {
      skuId: 'SKU-LATENCY',
      name: 'Latency Test Product',
      unitPriceCents: 100,
      quantity: 1,
    })
    const cartWithItem = result.cart

    const latencyThreshold = 100
    const observations: number[] = []
    const sampleCount = 10

    for (let i = 0; i < sampleCount; i++) {
      const before = Date.now()
      await zustandCartRepository.saveCart(cartWithItem)
      await zustandCartRepository.getCart()
      const after = Date.now()
      observations.push(after - before)
    }

    const p95Index = Math.floor(sampleCount * 0.95)
    const sorted = [...observations].sort((a, b) => a - b)
    const p95Latency = sorted[p95Index]

    expect(p95Latency).toBeLessThan(latencyThreshold)
  })

  it('T009 - repository adapter returns cart via reactive store state', async () => {
    const cart = createCart()
    const result = addItem(cart, {
      skuId: 'SKU-REACTIVE',
      name: 'Reactive Test',
      unitPriceCents: 750,
      quantity: 4,
    })
    const cartWithItem = result.cart

    await zustandCartRepository.saveCart(cartWithItem)

    const storeState = getStoreState()
    expect(storeState.cart.id).toBe(cartWithItem.id)

    const fromRepo = await zustandCartRepository.getCart()
    expect(fromRepo.id).toBe(cartWithItem.id)
  })
})
