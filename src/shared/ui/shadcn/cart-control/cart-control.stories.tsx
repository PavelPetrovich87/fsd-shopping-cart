import type { Meta, StoryObj } from '@storybook/react'

import { CartControl } from './cart-control'

const meta = {
  title: 'UI/CartControl',
  component: CartControl,
  tags: ['autodocs'],
} satisfies Meta<typeof CartControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    quantity: 3,
    min: 1,
    max: 99,
    disabled: false,
    onIncrement: () => {},
    onDecrement: () => {},
  },
}

export const AtMinimum: Story = {
  args: {
    quantity: 1,
    min: 1,
    max: 99,
    disabled: false,
    onIncrement: () => {},
    onDecrement: () => {},
  },
}

export const AtMaximum: Story = {
  args: {
    quantity: 99,
    min: 1,
    max: 99,
    disabled: false,
    onIncrement: () => {},
    onDecrement: () => {},
  },
}

export const Disabled: Story = {
  args: {
    quantity: 3,
    min: 1,
    max: 99,
    disabled: true,
    onIncrement: () => {},
    onDecrement: () => {},
  },
}
