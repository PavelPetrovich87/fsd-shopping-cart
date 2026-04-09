import type { CartItemData } from './types';

export class CartItem {
  readonly skuId: string;
  readonly name: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly createdAt: Date;

  private constructor(data: CartItemData) {
    this.skuId = data.skuId;
    this.name = data.name;
    this.unitPriceCents = data.unitPriceCents;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt;
    Object.freeze(this);
  }

  static create(data: CartItemData): CartItem {
    if (data.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (data.unitPriceCents < 0) {
      throw new Error('Unit price cannot be negative');
    }
    return new CartItem({
      ...data,
      createdAt: data.createdAt ?? new Date(),
    });
  }

  get totalPriceCents(): number {
    return this.unitPriceCents * this.quantity;
  }

  withQuantity(newQuantity: number): CartItem {
    if (newQuantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    return CartItem.create({
      skuId: this.skuId,
      name: this.name,
      unitPriceCents: this.unitPriceCents,
      quantity: newQuantity,
      createdAt: this.createdAt,
    });
  }

  toData(): CartItemData {
    return {
      skuId: this.skuId,
      name: this.name,
      unitPriceCents: this.unitPriceCents,
      quantity: this.quantity,
      createdAt: this.createdAt,
    };
  }
}
