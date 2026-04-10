import { Money } from '@/shared/lib';

export type CouponMode = 'flat' | 'percentage';

export interface CouponProps {
  code: string;
  discountMode: CouponMode;
  discountAmount?: Money;
  percentageValue?: number;
  validFrom?: Date | null;
  expiresAt?: Date | null;
  isActive: boolean;
}

export type CouponValidationReason =
  | 'expired'
  | 'not_yet_active'
  | 'inactive'
  | 'not_found';
