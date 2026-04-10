export { Coupon } from './model/coupon'

export type {
  CouponMode,
  CouponProps,
  CouponValidationReason,
} from './model/types'

export type {
  CouponValidated,
  CouponValidationFailed,
  DiscountCalculated,
  CouponDomainEvent,
} from './model/events'

export type { ICouponRepository } from './model/ports'
export { MockCouponRepository } from './api/mock-coupon-repository'
