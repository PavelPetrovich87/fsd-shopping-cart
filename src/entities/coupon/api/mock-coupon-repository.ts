import { couponsData } from '@/shared/api'
import { Money } from '@/shared/lib'
import { Coupon } from '../model/coupon'
import type { ICouponRepository } from '../model/ports'

function createCouponMap(): Map<string, (typeof couponsData)[number]> {
  const map = new Map<string, (typeof couponsData)[number]>()
  for (const record of couponsData) {
    map.set(record.code.toUpperCase(), record)
  }
  return map
}

function createMockCouponRepository(): ICouponRepository {
  const couponMap = createCouponMap()

  return {
    async findByCode(code: string): Promise<Coupon | null> {
      if (!code || code.trim() === '') {
        return null
      }

      const normalizedCode = code.trim().toUpperCase()
      const fixtureRecord = couponMap.get(normalizedCode)

      if (!fixtureRecord) {
        return null
      }

      const expiresAt = fixtureRecord.expiresAt
        ? new Date(fixtureRecord.expiresAt)
        : undefined

      if (fixtureRecord.discountType === 'flat') {
        return Coupon.createFlat({
          code: normalizedCode,
          amount: Money.fromCents(fixtureRecord.discountValue),
          expiresAt,
          isActive: true,
        })
      }

      return Coupon.createPercentage({
        code: normalizedCode,
        percentageValue: fixtureRecord.discountValue,
        expiresAt,
        isActive: true,
      })
    },
  }
}

export const MockCouponRepository = createMockCouponRepository()
