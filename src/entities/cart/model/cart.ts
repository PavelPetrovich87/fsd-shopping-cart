import type { CartItemData, CartData, CartState } from './types';
import { CartItem } from './cart-item';
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
} from './events';
import { CartState as CartStateEnum } from './types';

export interface CartOperationResult {
  cart: Cart;
  events: CartDomainEvent[];
}

export class Cart {
  private readonly _id: string;
  private readonly _state: CartState;
  private readonly _items: ReadonlyMap<string, CartItem>;
  private readonly _couponCode: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    id: string,
    state: CartState,
    items: ReadonlyMap<string, CartItem>,
    couponCode: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._state = state;
    this._items = items;
    this._couponCode = couponCode;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    Object.freeze(this);
  }

  static create(id?: string): Cart {
    const now = new Date();
    return new Cart(
      id ?? crypto.randomUUID(),
      CartStateEnum.Active,
      new Map(),
      '',
      now,
      now
    );
  }

  get id(): string {
    return this._id;
  }
  get state(): CartState {
    return this._state;
  }
  get couponCode(): string {
    return this._couponCode;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  get items(): CartItem[] {
    return Array.from(this._items.values());
  }

  hasItem(skuId: string): boolean {
    return this._items.has(skuId);
  }

  getItem(skuId: string): CartItem | undefined {
    return this._items.get(skuId);
  }

  get subtotalCents(): number {
    let total = 0;
    for (const item of this._items.values()) {
      total += item.totalPriceCents;
    }
    return total;
  }

  get itemCount(): number {
    let count = 0;
    for (const item of this._items.values()) {
      count += item.quantity;
    }
    return count;
  }

  get uniqueItemCount(): number {
    return this._items.size;
  }

  addItem(data: Omit<CartItemData, 'createdAt'>): CartOperationResult {
    const events: CartDomainEvent[] = [];
    const newItems = new Map(this._items);

    const existingItem = this._items.get(data.skuId);
    let newItem: CartItem;

    if (existingItem) {
      newItem = existingItem.withQuantity(existingItem.quantity + data.quantity);
      events.push({
        occurredAt: new Date(),
        eventType: 'CartItemQuantityChanged',
        skuId: data.skuId,
        previousQuantity: existingItem.quantity,
        newQuantity: newItem.quantity,
      } as CartItemQuantityChanged);
    } else {
      newItem = CartItem.create({
        ...data,
        createdAt: new Date(),
      });
      events.push({
        occurredAt: new Date(),
        eventType: 'ItemAddedToCart',
        skuId: data.skuId,
        name: data.name,
        unitPriceCents: data.unitPriceCents,
        quantity: data.quantity,
      } as ItemAddedToCart);
    }

    newItems.set(data.skuId, newItem);

    return {
      cart: this._with({ items: newItems }),
      events,
    };
  }

  removeItem(skuId: string): CartOperationResult {
    const events: CartDomainEvent[] = [];

    const existingItem = this._items.get(skuId);
    if (!existingItem) {
      return { cart: this, events: [] };
    }

    const newItems = new Map(this._items);
    newItems.delete(skuId);

    events.push({
      occurredAt: new Date(),
      eventType: 'ItemRemovedFromCart',
      skuId,
      previousQuantity: existingItem.quantity,
    } as ItemRemovedFromCart);

    return {
      cart: this._with({ items: newItems }),
      events,
    };
  }

  changeQuantity(skuId: string, newQuantity: number): CartOperationResult {
    const existingItem = this._items.get(skuId);

    if (!existingItem) {
      throw new Error(`Item with skuId '${skuId}' not found in cart`);
    }

    if (newQuantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (newQuantity === existingItem.quantity) {
      return { cart: this, events: [] };
    }

    const newItem = existingItem.withQuantity(newQuantity);
    const newItems = new Map(this._items);
    newItems.set(skuId, newItem);

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CartItemQuantityChanged',
        skuId,
        previousQuantity: existingItem.quantity,
        newQuantity,
      } as CartItemQuantityChanged,
    ];

    return {
      cart: this._with({ items: newItems }),
      events,
    };
  }

  clearCart(): CartOperationResult {
    const itemCount = this._items.size;

    if (itemCount === 0) {
      return { cart: this, events: [] };
    }

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CartCleared',
        itemCount,
      } as CartCleared,
    ];

    return {
      cart: this._with({ items: new Map() }),
      events,
    };
  }

  applyCoupon(code: string): CartOperationResult {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      throw new Error('Coupon code cannot be empty');
    }

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CouponApplied',
        couponCode: normalizedCode,
      } as CouponApplied,
    ];

    return {
      cart: this._with({ couponCode: normalizedCode }),
      events,
    };
  }

  removeCoupon(): CartOperationResult {
    if (!this._couponCode) {
      return { cart: this, events: [] };
    }

    const previousCode = this._couponCode;

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CouponRemoved',
        previousCouponCode: previousCode,
      } as CouponRemoved,
    ];

    return {
      cart: this._with({ couponCode: '' }),
      events,
    };
  }

  initiateCheckout(): CartOperationResult {
    if (this._state !== CartStateEnum.Active) {
      throw new Error(
        `Cannot initiate checkout from state '${this._state}'. Cart must be in 'Active' state.`
      );
    }

    if (this._items.size === 0) {
      throw new Error('Cannot initiate checkout with empty cart');
    }

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CheckoutInitiated',
        cartId: this._id,
      } as CheckoutInitiated,
    ];

    return {
      cart: this._with({ state: CartStateEnum.Checkout_Pending }),
      events,
    };
  }

  markCheckedOut(): CartOperationResult {
    if (this._state !== CartStateEnum.Checkout_Pending) {
      throw new Error(
        `Cannot complete checkout from state '${this._state}'. Cart must be in 'Checkout_Pending' state.`
      );
    }

    const events: CartDomainEvent[] = [
      {
        occurredAt: new Date(),
        eventType: 'CheckoutCompleted',
        cartId: this._id,
      } as CheckoutCompleted,
    ];

    return {
      cart: this._with({ state: CartStateEnum.Checked_Out }),
      events,
    };
  }

  canTransitionTo(targetState: CartState): boolean {
    const validTransitions: Record<CartState, CartState[]> = {
      [CartStateEnum.Active]: [CartStateEnum.Checkout_Pending],
      [CartStateEnum.Checkout_Pending]: [CartStateEnum.Checked_Out],
      [CartStateEnum.Checked_Out]: [],
    };
    return validTransitions[this._state].includes(targetState);
  }

  protected _with(partial: {
    state?: CartState;
    items?: ReadonlyMap<string, CartItem>;
    couponCode?: string;
    updatedAt?: Date;
  }): Cart {
    return new Cart(
      this._id,
      partial.state ?? this._state,
      partial.items ?? this._items,
      partial.couponCode ?? this._couponCode,
      this._createdAt,
      partial.updatedAt ?? new Date()
    );
  }

  toData(): CartData & { subtotalCents: number } {
    return {
      id: this._id,
      state: this._state,
      items: this.items.map((item) => item.toData()),
      couponCode: this._couponCode,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      subtotalCents: this.subtotalCents,
    };
  }
}
