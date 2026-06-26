import { CouponInput } from '@/features/apply-coupon'
import { CheckoutButton } from '@/features/checkout'

import type { OrderSummaryProps } from '../model/types'

interface MoneyRowProps {
  label: string
  value: string
  isTotal?: boolean
}

function MoneyRow({ label, value, isTotal = false }: MoneyRowProps) {
  return (
    <div
      className={`flex items-center justify-between ${isTotal ? 'border-t border-neutral-200 pt-4' : ''}`}
    >
      <span
        className={`${isTotal ? 'text-base font-semibold text-neutral-900' : 'text-sm text-neutral-600'}`}
      >
        {label}
      </span>
      <span
        className={`${isTotal ? 'text-base font-semibold text-neutral-900' : 'text-sm text-neutral-900'}`}
      >
        {value}
      </span>
    </div>
  )
}

export function OrderSummary({
  subtotal,
  discount,
  shipping,
  total,
  appliedCoupon,
  couponError,
  isCouponLoading = false,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  isCheckoutDisabled = false,
}: OrderSummaryProps) {
  return (
    <section
      aria-label="Order summary"
      className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>

      <div className="flex flex-col gap-3">
        <MoneyRow label="Subtotal" value={subtotal} />
        {discount && <MoneyRow label="Discount" value={discount} />}
        {shipping && <MoneyRow label="Shipping" value={shipping} />}
        <MoneyRow label="Total" value={total} isTotal />
      </div>

      <div className="flex flex-col gap-4">
        <CouponInput
          appliedCoupon={appliedCoupon}
          error={couponError}
          isLoading={isCouponLoading}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
        <CheckoutButton disabled={isCheckoutDisabled} onCheckout={onCheckout} />
      </div>
    </section>
  )
}
