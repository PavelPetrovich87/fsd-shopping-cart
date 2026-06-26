import type { Meta, StoryObj } from '@storybook/react'

import { OrderSummary } from './order-summary'

const meta = {
  title: 'Widgets/Cart/OrderSummary',
  component: OrderSummary,
  tags: ['autodocs'],
} satisfies Meta<typeof OrderSummary>

export default meta
type Story = StoryObj<typeof meta>

const noop = () => {}

export const Default: Story = {
  args: {
    subtotal: '$348.00',
    shipping: '$12.00',
    total: '$360.00',
    onApplyCoupon: noop,
    onRemoveCoupon: noop,
    onCheckout: noop,
  },
}

export const WithDiscount: Story = {
  args: {
    subtotal: '$348.00',
    discount: '-$20.00',
    shipping: '$12.00',
    total: '$340.00',
    appliedCoupon: {
      code: 'SAVE20',
      discountLabel: '-$20.00',
    },
    onApplyCoupon: noop,
    onRemoveCoupon: noop,
    onCheckout: noop,
  },
}

export const DisabledCheckout: Story = {
  args: {
    subtotal: '$348.00',
    shipping: '$12.00',
    total: '$360.00',
    isCheckoutDisabled: true,
    onApplyCoupon: noop,
    onRemoveCoupon: noop,
    onCheckout: noop,
  },
}

export const CouponError: Story = {
  args: {
    subtotal: '$348.00',
    shipping: '$12.00',
    total: '$360.00',
    couponError: 'Invalid coupon code',
    onApplyCoupon: noop,
    onRemoveCoupon: noop,
    onCheckout: noop,
  },
}
