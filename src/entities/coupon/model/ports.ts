import type { Coupon } from '../index'

export interface ICouponRepository {
  findByCode(code: string): Promise<Coupon | null>
}
