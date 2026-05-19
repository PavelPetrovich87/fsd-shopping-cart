# Component Interface Contracts

These TypeScript interfaces define the public API for each feature UI component.
They serve as the contract between the feature layer (UI components) and the
widget/page layer (consumers that wire components to use cases).

## QuantitySelector (features/cart-actions)

```typescript
import type { StockConflict } from '@/features/checkout'

export interface QuantitySelectorProps {
  /** Stock-keeping unit identifier for the cart item */
  skuId: string

  /** Current quantity displayed */
  quantity: number

  /** Minimum allowed quantity (default: 1) */
  minQuantity?: number

  /** Maximum allowed quantity (typically derived from available stock) */
  maxQuantity?: number

  /** Disables all controls */
  disabled?: boolean

  /** Called when user increments or decrements quantity */
  onChangeQuantity: (skuId: string, newQuantity: number) => void
}
```

## RemoveButton (features/cart-actions)

```typescript
export interface RemoveButtonProps {
  /** Stock-keeping unit identifier for the item to remove */
  skuId: string

  /** Disables the remove link */
  disabled?: boolean

  /** Called when user confirms removal via the modal */
  onRemove: (skuId: string) => void
}
```

## CouponInput (features/apply-coupon)

```typescript
export interface AppliedCoupon {
  /** Normalized coupon code */
  code: string

  /** Formatted discount amount for display (e.g., "$5.00") */
  discountAmount: string
}

export interface CouponInputProps {
  /** Currently applied coupon (undefined when no coupon is active) */
  appliedCoupon?: AppliedCoupon

  /** Validation error message to display (undefined when no error) */
  error?: string

  /** Disables the input/tag controls */
  disabled?: boolean

  /** Called when user submits a coupon code */
  onApply: (code: string) => void

  /** Called when user dismisses the applied coupon tag */
  onRemove: () => void
}
```

## CheckoutButton (features/checkout)

```typescript
export interface CheckoutButtonProps {
  /** Disables the button (parent computes from cart state) */
  disabled?: boolean

  /** Called when user clicks the checkout button */
  onCheckout: () => void
}
```

## StockConflictModal (features/checkout)

```typescript
export interface StockConflictModalProps {
  /** Controls modal visibility */
  open: boolean

  /** List of stock conflicts from InitiateCheckout */
  conflicts: StockConflict[]

  /** Called when user acknowledges the modal (Ok button or close) */
  onClose: () => void

  /** Called when user clicks "Go back to cart" in empty-cart variant */
  onGoBackToCart?: () => void
}
```
