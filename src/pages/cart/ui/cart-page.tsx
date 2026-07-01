import { CartList, OrderSummary } from '@/widgets/cart'

import type { AppliedCoupon, CartListItem } from '@/widgets/cart'

export interface CartPageProps {
  items: CartListItem[]
  subtotal: string
  discount?: string
  shipping?: string
  total: string
  appliedCoupon?: AppliedCoupon
  couponError?: string
  isCouponLoading?: boolean
  onIncrement: (skuId: string) => void
  onDecrement: (skuId: string) => void
  onRemove: (skuId: string) => void
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  onCheckout: () => void
  onEmptyStateAction?: () => void
  isCheckoutDisabled?: boolean
}

export function CartPage({
  items,
  subtotal,
  discount,
  shipping,
  total,
  appliedCoupon,
  couponError,
  isCouponLoading,
  onIncrement,
  onDecrement,
  onRemove,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  onEmptyStateAction,
  isCheckoutDisabled,
}: CartPageProps) {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
      <div className="order-2 lg:order-1 lg:col-span-2">
        <CartList
          items={items}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
          onEmptyStateAction={onEmptyStateAction}
        />
      </div>
      <div className="order-1 lg:order-2">
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          total={total}
          appliedCoupon={appliedCoupon}
          couponError={couponError}
          isCouponLoading={isCouponLoading}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          onCheckout={onCheckout}
          isCheckoutDisabled={isCheckoutDisabled}
        />
      </div>
    </main>
  )
}
