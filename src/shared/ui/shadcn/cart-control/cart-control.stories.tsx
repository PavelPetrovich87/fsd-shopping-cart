import type { Meta, StoryObj } from '@storybook/react'

import { CartControl } from './cart-control'

type Story = StoryObj<typeof CartControl>

const meta = {
  title: 'UI/CartControl',
  component: CartControl,
  tags: ['autodocs'],
  argTypes: {
    quantity: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CartControl>

export default meta

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
