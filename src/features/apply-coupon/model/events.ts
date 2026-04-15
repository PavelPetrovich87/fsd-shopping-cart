export interface CouponApplied {
  eventType: 'CouponApplied';
  couponCode: string;
  discountAmountCents: number;
  occurredAt: Date;
}

export interface CouponRemoved {
  eventType: 'CouponRemoved';
  couponCode: string;
  occurredAt: Date;
}