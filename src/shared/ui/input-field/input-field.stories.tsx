import type { Meta, StoryObj } from '@storybook/react'

import { InputField } from './input-field'

const meta = {
  title: 'UI/InputField',
  component: InputField,
  tags: ['autodocs'],
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Coupon code',
    hint: 'This is a hint text to help user.',
    placeholder: 'Enter coupon code',
  },
}

export const Filled: Story = {
  args: {
    label: 'Coupon code',
    hint: 'This is a hint text to help user.',
    value: 'Add coupon code',
  },
}

export const Focused: Story = {
  args: {
    label: 'Coupon code',
    hint: 'This is a hint text to help user.',
    value: 'OFFSPRING',
    autoFocus: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Coupon code',
    error: 'Please enter a valid code.',
    placeholder: 'Enter coupon code',
  },
}

export const ErrorFilled: Story = {
  args: {
    label: 'Coupon code',
    value: 'NOSUCHCODE',
    error: "Sorry, this coupon doesn't exist.",
  },
}

export const ErrorFocused: Story = {
  args: {
    label: 'Coupon code',
    error: 'Please enter a valid code.',
    placeholder: 'Enter coupon code',
    autoFocus: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Coupon code',
    value: 'Add coupon code',
    disabled: true,
    hint: 'This is a hint text to help user.',
  },
}
