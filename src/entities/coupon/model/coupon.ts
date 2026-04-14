import { Money } from '@/shared/lib'
import type { EventBus } from '@/shared/lib/event-bus'

import type {
  CouponValidationFailed,
  CouponValidated,
  DiscountCalculated,
} from './events'
import type { CouponMode, CouponProps, CouponValidationReason } from './types'

export class Coupon {
  private readonly props: CouponProps

  private constructor(props: CouponProps) {
    this.props = props
  }

  static createFlat(params: {
    code: string
    amount: Money
    validFrom?: Date
    expiresAt?: Date
    isActive?: boolean
  }): Coupon {
    return new Coupon({
      code: Coupon.normalizeCode(params.code),
      discountMode: 'flat',
      discountAmount: params.amount,
      validFrom: params.validFrom ?? null,
      expiresAt: params.expiresAt ?? null,
      isActive: params.isActive ?? true,
    })
  }

  static createPercentage(params: {
    code: string
    percentageValue: number
    validFrom?: Date
    expiresAt?: Date
    isActive?: boolean
  }): Coupon {
    Coupon.validatePercentage(params.percentageValue)

    return new Coupon({
      code: Coupon.normalizeCode(params.code),
      discountMode: 'percentage',
      percentageValue: params.percentageValue,
      validFrom: params.validFrom ?? null,
      expiresAt: params.expiresAt ?? null,
      isActive: params.isActive ?? true,
    })
  }

  get code(): string {
    return this.props.code
  }

  get discountMode(): CouponMode {
    return this.props.discountMode
  }

  get discountAmount(): Money | undefined {
    return this.props.discountAmount
  }

  get percentageValue(): number | undefined {
    return this.props.percentageValue
  }

  get validFrom(): Date | null {
    return this.props.validFrom ?? null
  }

  get expiresAt(): Date | null {
    return this.props.expiresAt ?? null
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  isValid(now: Date): boolean {
    if (!this.props.isActive) return false
    if (this.props.validFrom && now < this.props.validFrom) return false
    if (this.props.expiresAt && now > this.props.expiresAt) return false
    return true
  }

  calculateDiscount(subtotal: Money, now: Date, eventBus?: EventBus): Money {
    const occurredAt = new Date()

    if (!this.isValid(now)) {
      const failedEvent: CouponValidationFailed = {
        eventType: 'CouponValidationFailed',
        couponCode: this.props.code,
        reason: this.getValidationFailureReason(now),
        occurredAt,
      }
      eventBus?.publish(failedEvent)

      return Money.fromCents(0)
    }

    const validatedEvent: CouponValidated = {
      eventType: 'CouponValidated',
      couponCode: this.props.code,
      occurredAt,
    }
    eventBus?.publish(validatedEvent)

    const rawDiscount =
      this.props.discountMode === 'flat'
        ? (this.props.discountAmount ?? Money.fromCents(0))
        : subtotal.multiply((this.props.percentageValue ?? 0) / 100)

    const cappedDiscount = Money.fromCents(
      Math.max(0, Math.min(rawDiscount.cents, subtotal.cents)),
    )

    const calculatedEvent: DiscountCalculated = {
      eventType: 'DiscountCalculated',
      couponCode: this.props.code,
      subtotal,
      discount: cappedDiscount,
      resultingTotal: subtotal.subtract(cappedDiscount),
      occurredAt,
    }
    eventBus?.publish(calculatedEvent)

    return cappedDiscount
  }

  with(props: Partial<CouponProps>): Coupon {
    return new Coupon({ ...this.props, ...props })
  }

  private getValidationFailureReason(now: Date): CouponValidationReason {
    if (!this.props.isActive) {
      return 'inactive'
    }

    if (this.props.validFrom && now < this.props.validFrom) {
      return 'not_yet_active'
    }

    if (this.props.expiresAt && now > this.props.expiresAt) {
      return 'expired'
    }

    return 'not_found'
  }

  private static normalizeCode(code: string): string {
    return code.toUpperCase()
  }

  private static validatePercentage(value: number): void {
    if (value < 0 || value > 100) {
      throw new Error('Percentage value must be between 0 and 100')
    }
  }
}
