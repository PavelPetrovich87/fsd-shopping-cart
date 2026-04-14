import { Money } from '@/shared/lib';

import type { CouponValidationReason } from './types';

export interface CouponValidated {
  readonly eventType: 'CouponValidated';
  readonly couponCode: string;
  readonly occurredAt: Date;
}

export interface CouponValidationFailed {
  readonly eventType: 'CouponValidationFailed';
  readonly couponCode: string;
  readonly reason: CouponValidationReason;
  readonly occurredAt: Date;
}

export interface DiscountCalculated {
  readonly eventType: 'DiscountCalculated';
  readonly couponCode: string;
  readonly subtotal: Money;
  readonly discount: Money;
  readonly resultingTotal: Money;
  readonly occurredAt: Date;
}

export type CouponDomainEvent =
  | CouponValidated
  | CouponValidationFailed
  | DiscountCalculated;