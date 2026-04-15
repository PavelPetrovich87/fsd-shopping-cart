import type { Cart } from '@/entities/cart';
import type { ApplyCouponError } from './errors';
import type { CouponApplied, CouponRemoved } from './events';

export type ApplyCouponResult =
  | { success: true; cart: Cart; event: CouponApplied }
  | { success: false; error: ApplyCouponError };

export type RemoveCouponResult =
  | { success: true; cart: Cart; event: CouponRemoved }
  | { success: true; cart: Cart }
  | { success: false; error: never };