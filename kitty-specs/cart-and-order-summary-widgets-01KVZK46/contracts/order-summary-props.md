# OrderSummary Props Contract

Source of truth for the public API of `src/widgets/cart/order-summary/order-summary.tsx`.

```ts
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
```
