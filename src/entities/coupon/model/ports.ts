import type { Coupon } from './coupon'

export interface ICouponRepository {
  findByCode(code: string): Coupon | null
}
