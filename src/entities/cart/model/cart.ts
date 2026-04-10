import type { CartItemData } from './types'
import type {
  CartDomainEvent,
  ItemAddedToCart,
  CartItemQuantityChanged,
  ItemRemovedFromCart,
  CartCleared,
  CouponApplied,
  CouponRemoved,
  CheckoutInitiated,
  CheckoutCompleted,
} from './events'
import { CartState } from './types'
import {
  type CartItem,
  createCartItem,
  withQuantity as cartItemWithQuantity,
  getTotalPriceCents,
} from './cart-item'

export interface Cart {
  readonly id: string
  readonly state: CartState
  readonly items: ReadonlyMap<string, CartItem>
  readonly couponCode: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface CartOperationResult {
  readonly cart: Cart
  readonly events: readonly CartDomainEvent[]
}

export function createCart(id?: string): Cart {
  const now = new Date()
  return {
    id: id ?? crypto.randomUUID(),
    state: CartState.Active,
    items: new Map(),
    couponCode: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function getCartItems(cart: Cart): readonly CartItem[] {
  return Array.from(cart.items.values())
}

export function hasItem(cart: Cart, skuId: string): boolean {
  return cart.items.has(skuId)
}

export function getItem(cart: Cart, skuId: string): CartItem | undefined {
  return cart.items.get(skuId)
}

export function getSubtotalCents(cart: Cart): number {
  let total = 0
  for (const item of cart.items.values()) {
    total += getTotalPriceCents(item)
  }
  return total
}

export function getItemCount(cart: Cart): number {
  let count = 0
  for (const item of cart.items.values()) {
    count += item.quantity
  }
  return count
}

export function getUniqueItemCount(cart: Cart): number {
  return cart.items.size
}

export function addItem(
  cart: Cart,
  data: Omit<CartItemData, 'createdAt'>,
): CartOperationResult {
  const events: CartDomainEvent[] = []
  const newItems = new Map(cart.items)

  const existingItem = cart.items.get(data.skuId)
  let newItem: CartItem

  if (existingItem) {
    newItem = cartItemWithQuantity(
      existingItem,
      existingItem.quantity + data.quantity,
    )
    events.push({
      occurredAt: new Date(),
      eventType: 'CartItemQuantityChanged',
      skuId: data.skuId,
      previousQuantity: existingItem.quantity,
      newQuantity: newItem.quantity,
    } as CartItemQuantityChanged)
  } else {
    newItem = createCartItem({
      ...data,
      createdAt: new Date(),
    })
    events.push({
      occurredAt: new Date(),
      eventType: 'ItemAddedToCart',
      skuId: data.skuId,
      name: data.name,
      unitPriceCents: data.unitPriceCents,
      quantity: data.quantity,
    } as ItemAddedToCart)
  }

  newItems.set(data.skuId, newItem)

  return {
    cart: withCart(cart, { items: newItems }),
    events,
  }
}

export function removeItem(cart: Cart, skuId: string): CartOperationResult {
  const events: CartDomainEvent[] = []

  const existingItem = cart.items.get(skuId)
  if (!existingItem) {
    return { cart, events: [] }
  }

  const newItems = new Map(cart.items)
  newItems.delete(skuId)

  events.push({
    occurredAt: new Date(),
    eventType: 'ItemRemovedFromCart',
    skuId,
    previousQuantity: existingItem.quantity,
  } as ItemRemovedFromCart)

  return {
    cart: withCart(cart, { items: newItems }),
    events,
  }
}

export function changeQuantity(
  cart: Cart,
  skuId: string,
  newQuantity: number,
): CartOperationResult {
  const existingItem = cart.items.get(skuId)

  if (!existingItem) {
    throw new Error(`Item with skuId '${skuId}' not found in cart`)
  }

  if (newQuantity < 1) {
    throw new Error('Quantity must be at least 1')
  }

  if (newQuantity === existingItem.quantity) {
    return { cart, events: [] }
  }

  const newItem = cartItemWithQuantity(existingItem, newQuantity)
  const newItems = new Map(cart.items)
  newItems.set(skuId, newItem)

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CartItemQuantityChanged',
      skuId,
      previousQuantity: existingItem.quantity,
      newQuantity,
    } as CartItemQuantityChanged,
  ]

  return {
    cart: withCart(cart, { items: newItems }),
    events,
  }
}

export function clearCart(cart: Cart): CartOperationResult {
  const itemCount = cart.items.size

  if (itemCount === 0) {
    return { cart, events: [] }
  }

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CartCleared',
      itemCount,
    } as CartCleared,
  ]

  return {
    cart: withCart(cart, { items: new Map() }),
    events,
  }
}

export function applyCoupon(cart: Cart, code: string): CartOperationResult {
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    throw new Error('Coupon code cannot be empty')
  }

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CouponApplied',
      couponCode: normalizedCode,
    } as CouponApplied,
  ]

  return {
    cart: withCart(cart, { couponCode: normalizedCode }),
    events,
  }
}

export function removeCoupon(cart: Cart): CartOperationResult {
  if (!cart.couponCode) {
    return { cart, events: [] }
  }

  const previousCode = cart.couponCode

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CouponRemoved',
      previousCouponCode: previousCode,
    } as CouponRemoved,
  ]

  return {
    cart: withCart(cart, { couponCode: '' }),
    events,
  }
}

export function initiateCheckout(cart: Cart): CartOperationResult {
  if (cart.state !== CartState.Active) {
    throw new Error(
      `Cannot initiate checkout from state '${cart.state}'. Cart must be in 'Active' state.`,
    )
  }

  if (cart.items.size === 0) {
    throw new Error('Cannot initiate checkout with empty cart')
  }

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CheckoutInitiated',
      cartId: cart.id,
    } as CheckoutInitiated,
  ]

  return {
    cart: withCart(cart, { state: CartState.Checkout_Pending }),
    events,
  }
}

export function markCheckedOut(cart: Cart): CartOperationResult {
  if (cart.state !== CartState.Checkout_Pending) {
    throw new Error(
      `Cannot complete checkout from state '${cart.state}'. Cart must be in 'Checkout_Pending' state.`,
    )
  }

  const events: CartDomainEvent[] = [
    {
      occurredAt: new Date(),
      eventType: 'CheckoutCompleted',
      cartId: cart.id,
    } as CheckoutCompleted,
  ]

  return {
    cart: withCart(cart, { state: CartState.Checked_Out }),
    events,
  }
}

export function canTransitionTo(cart: Cart, targetState: CartState): boolean {
  const validTransitions: Record<CartState, readonly CartState[]> = {
    [CartState.Active]: [CartState.Checkout_Pending],
    [CartState.Checkout_Pending]: [CartState.Checked_Out],
    [CartState.Checked_Out]: [],
  }
  return validTransitions[cart.state].includes(targetState)
}

function withCart(
  cart: Cart,
  partial: {
    state?: CartState
    items?: ReadonlyMap<string, CartItem>
    couponCode?: string
    updatedAt?: Date
  },
): Cart {
  return {
    id: cart.id,
    state: partial.state ?? cart.state,
    items: partial.items ?? cart.items,
    couponCode: partial.couponCode ?? cart.couponCode,
    createdAt: cart.createdAt,
    updatedAt: partial.updatedAt ?? new Date(),
  }
}

export function toCartData(cart: Cart) {
  return {
    id: cart.id,
    state: cart.state,
    items: getCartItems(cart),
    couponCode: cart.couponCode,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    subtotalCents: getSubtotalCents(cart),
  }
}
