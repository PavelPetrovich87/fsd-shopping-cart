import type { CartItemData } from './types'

export interface CartItem {
  readonly skuId: string
  readonly name: string
  readonly unitPriceCents: number
  readonly quantity: number
  readonly createdAt: Date
}

export function getTotalPriceCents(item: CartItem): number {
  return item.unitPriceCents * item.quantity
}

export function createCartItem(data: CartItemData): CartItem {
  if (data.quantity < 1) {
    throw new Error('Quantity must be at least 1')
  }
  if (data.unitPriceCents < 0) {
    throw new Error('Unit price cannot be negative')
  }
  return {
    skuId: data.skuId,
    name: data.name,
    unitPriceCents: data.unitPriceCents,
    quantity: data.quantity,
    createdAt: data.createdAt ?? new Date(),
  }
}

export function withQuantity(item: CartItem, newQuantity: number): CartItem {
  if (newQuantity < 1) {
    throw new Error('Quantity must be at least 1')
  }
  return { ...item, quantity: newQuantity }
}

export function toCartItemData(item: CartItem): CartItemData {
  return {
    skuId: item.skuId,
    name: item.name,
    unitPriceCents: item.unitPriceCents,
    quantity: item.quantity,
    createdAt: item.createdAt,
  }
}
