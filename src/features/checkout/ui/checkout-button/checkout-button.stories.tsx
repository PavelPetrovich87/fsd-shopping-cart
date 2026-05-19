import type { Meta, StoryObj } from '@storybook/react'

import { CheckoutButton } from './checkout-button'

const meta = {
  title: 'Features/Checkout/CheckoutButton',
  component: CheckoutButton,
  tags: ['autodocs'],
} satisfies Meta<typeof CheckoutButton>

export default meta
type Story = StoryObj<typeof meta>

export const Enabled: Story = {
  args: {
    disabled: false,
    onCheckout: () => {},
  },
}

export const DisabledEmptyCart: Story = {
  args: {
    disabled: true,
    onCheckout: () => {},
  },
}

export const DisabledInactive: Story = {
  args: {
    disabled: true,
    onCheckout: () => {},
  },
}
