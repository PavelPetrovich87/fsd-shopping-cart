export interface CartListItem {
  skuId: string
  name: string
  description: string
  imageUrl: string
  specs?: Record<string, string>
  price: string
  quantity: number
  minQuantity?: number
  maxQuantity?: number
}

export interface CartListProps {
  items: CartListItem[]
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
  onIncrement: (skuId: string) => void
  onDecrement: (skuId: string) => void
  onRemove: (skuId: string) => void
  disabled?: boolean
}

export interface AppliedCoupon {
  code: string
  discountLabel: string
}

export interface OrderSummaryProps {
  subtotal: string
  discount?: string
  shipping?: string
  total: string
  appliedCoupon?: AppliedCoupon
  couponError?: string
  isCouponLoading?: boolean
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  onCheckout: () => void
  isCheckoutDisabled?: boolean
}
