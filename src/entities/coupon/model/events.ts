import { Money } from '@/shared/lib';

import type { CouponValidationReason } from './types';

export interface CouponValidated {
  type: 'CouponValidated';
  couponCode: string;
  timestamp: Date;
}

export interface CouponValidationFailed {
  type: 'CouponValidationFailed';
  couponCode: string;
  reason: CouponValidationReason;
  timestamp: Date;
}

export interface DiscountCalculated {
  type: 'DiscountCalculated';
  couponCode: string;
  subtotal: Money;
  discount: Money;
  resultingTotal: Money;
  timestamp: Date;
}

export type CouponDomainEvent =
  | CouponValidated
  | CouponValidationFailed
  | DiscountCalculated;
