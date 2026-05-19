import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { CouponInput } from './coupon-input'

const meta = {
  title: 'Features/ApplyCoupon/CouponInput',
  component: CouponInput,
  tags: ['autodocs'],
} satisfies Meta<typeof CouponInput>

export default meta
type Story = StoryObj<typeof meta>

function CouponInputWrapper(props: {
  initialAppliedCoupon?: { code: string; discountLabel: string }
  initialError?: string
  initialLoading?: boolean
}) {
  const [appliedCoupon, setAppliedCoupon] = useState(props.initialAppliedCoupon)
  const [error, setError] = useState(props.initialError)
  const [isLoading, setIsLoading] = useState(props.initialLoading)

  const handleApply = (code: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (code === '') {
        setError('Please enter a valid code')
      } else if (code === 'INVALID') {
        setError("Sorry, but this coupon doesn't exist")
      } else {
        setError(undefined)
        setAppliedCoupon({ code, discountLabel: '-$10.00' })
      }
    }, 500)
  }

  const handleRemove = () => {
    setAppliedCoupon(undefined)
    setError(undefined)
  }

  return (
    <CouponInput
      appliedCoupon={appliedCoupon}
      error={error}
      isLoading={isLoading}
      onApply={handleApply}
      onRemove={handleRemove}
    />
  )
}

export const ButtonState: Story = {
  args: {
    onApply: () => {},
    onRemove: () => {},
  },
  render: () => <CouponInputWrapper />,
}

export const InputVisible: Story = {
  args: {
    onApply: () => {},
    onRemove: () => {},
  },
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="flex items-end gap-2">
        <input
          placeholder="Enter coupon code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex h-10 w-80 items-center rounded bg-neutral-100 px-3 text-sm outline-none"
          autoFocus
        />
        <button className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground">
          Apply
        </button>
      </div>
    )
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    onApply: () => {},
    onRemove: () => {},
  },
  render: () => <CouponInputWrapper initialLoading={true} />,
}

export const ErrorEmpty: Story = {
  args: {
    error: 'Please enter a valid code',
    onApply: () => {},
    onRemove: () => {},
  },
  render: () => (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <div className="relative flex h-10 w-80 items-center gap-2 rounded bg-neutral-100 px-3 border border-[#e5e5e5]">
          <input
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>
        <span className="text-sm text-error-600" role="alert">
          Please enter a valid code
        </span>
      </div>
      <button className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground">
        Apply
      </button>
    </div>
  ),
}

export const ErrorInvalid: Story = {
  args: {
    error: "Sorry, but this coupon doesn't exist",
    onApply: () => {},
    onRemove: () => {},
  },
  render: () => (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <div className="relative flex h-10 w-80 items-center gap-2 rounded bg-neutral-100 px-3 border border-[#e5e5e5]">
          <input
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>
        <span className="text-sm text-error-600" role="alert">
          Sorry, but this coupon doesn&apos;t exist
        </span>
      </div>
      <button className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground">
        Apply
      </button>
    </div>
  ),
}

export const Success: Story = {
  args: {
    appliedCoupon: { code: 'SAVE10', discountLabel: '-$10.00' },
    onApply: () => {},
    onRemove: () => {},
  },
}

export const SuccessPercentage: Story = {
  args: {
    appliedCoupon: { code: 'SUMMER15', discountLabel: '-15%' },
    onApply: () => {},
    onRemove: () => {},
  },
}
