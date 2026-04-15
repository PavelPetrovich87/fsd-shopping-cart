export type ApplyCouponError =
  | { type: 'EMPTY_CODE'; message: string }
  | { type: 'INVALID_CODE'; message: string }
  | { type: 'COUPON_EXPIRED'; message: string };