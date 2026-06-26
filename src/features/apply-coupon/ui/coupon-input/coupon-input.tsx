import { useState } from 'react'

import { Button, InputField, Tag } from '@/shared/ui'

export interface CouponInputProps {
  appliedCoupon?: {
    code: string
    discountLabel: string
  }
  error?: string
  isLoading?: boolean
  onApply: (code: string) => void
  onRemove: () => void
}

export function CouponInput({
  appliedCoupon,
  error,
  isLoading = false,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleRevealInput = () => {
    setIsInputVisible(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply(inputValue.trim())
  }

  const handleRemove = () => {
    setIsInputVisible(false)
    setInputValue('')
    onRemove()
  }

  // Tag mode: coupon is applied
  if (appliedCoupon) {
    return (
      <Tag onDismiss={handleRemove}>
        {appliedCoupon.code} {appliedCoupon.discountLabel}
      </Tag>
    )
  }

  // Input mode: input is visible, no coupon applied yet
  if (isInputVisible) {
    return (
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <InputField
          placeholder="Enter coupon code"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          error={error}
          disabled={isLoading}
          autoFocus
        />
        <Button type="submit" disabled={isLoading}>
          Apply
        </Button>
      </form>
    )
  }

  // Button mode: initial state
  return (
    <Button variant="outline" onClick={handleRevealInput}>
      Apply coupon
    </Button>
  )
}
