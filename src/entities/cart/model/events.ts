export interface DomainEvent {
  readonly occurredAt: Date;
  readonly eventType: string;
}

export interface ItemAddedToCart extends DomainEvent {
  readonly eventType: 'ItemAddedToCart';
  readonly skuId: string;
  readonly name: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
}

export interface CartItemQuantityChanged extends DomainEvent {
  readonly eventType: 'CartItemQuantityChanged';
  readonly skuId: string;
  readonly previousQuantity: number;
  readonly newQuantity: number;
}

export interface ItemRemovedFromCart extends DomainEvent {
  readonly eventType: 'ItemRemovedFromCart';
  readonly skuId: string;
  readonly previousQuantity: number;
}

export interface CartCleared extends DomainEvent {
  readonly eventType: 'CartCleared';
  readonly itemCount: number;
}

export interface CheckoutInitiated extends DomainEvent {
  readonly eventType: 'CheckoutInitiated';
  readonly cartId: string;
}

export interface CheckoutCompleted extends DomainEvent {
  readonly eventType: 'CheckoutCompleted';
  readonly cartId: string;
}

export interface CouponApplied extends DomainEvent {
  readonly eventType: 'CouponApplied';
  readonly couponCode: string;
}

export interface CouponRemoved extends DomainEvent {
  readonly eventType: 'CouponRemoved';
  readonly previousCouponCode: string;
}

export type CartDomainEvent =
  | ItemAddedToCart
  | CartItemQuantityChanged
  | ItemRemovedFromCart
  | CartCleared
  | CheckoutInitiated
  | CheckoutCompleted
  | CouponApplied
  | CouponRemoved;
