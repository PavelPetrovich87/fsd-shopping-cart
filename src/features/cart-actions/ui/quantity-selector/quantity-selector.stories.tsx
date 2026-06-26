import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { QuantitySelector } from './quantity-selector'

const meta = {
  title: 'Features/CartActions/QuantitySelector',
  component: QuantitySelector,
  tags: ['autodocs'],
} satisfies Meta<typeof QuantitySelector>

export default meta
type Story = StoryObj<typeof meta>

function QuantitySelectorWrapper(props: {
  initialQuantity: number
  availableStock: number
  disabled?: boolean
}) {
  const [quantity, setQuantity] = useState(props.initialQuantity)

  return (
    <QuantitySelector
      quantity={quantity}
      availableStock={props.availableStock}
      disabled={props.disabled}
      onChangeQuantity={setQuantity}
    />
  )
}

export const Default: Story = {
  args: {
    quantity: 3,
    availableStock: 10,
    disabled: false,
    onChangeQuantity: () => {},
  },
  render: () => (
    <QuantitySelectorWrapper initialQuantity={3} availableStock={10} />
  ),
}

export const AtMinimum: Story = {
  args: {
    quantity: 1,
    availableStock: 10,
    disabled: false,
    onChangeQuantity: () => {},
  },
  render: () => (
    <QuantitySelectorWrapper initialQuantity={1} availableStock={10} />
  ),
}

export const AtMaximum: Story = {
  args: {
    quantity: 10,
    availableStock: 10,
    disabled: false,
    onChangeQuantity: () => {},
  },
  render: () => (
    <QuantitySelectorWrapper initialQuantity={10} availableStock={10} />
  ),
}

export const Disabled: Story = {
  args: {
    quantity: 3,
    availableStock: 10,
    disabled: true,
    onChangeQuantity: () => {},
  },
  render: () => (
    <QuantitySelectorWrapper initialQuantity={3} availableStock={10} disabled />
  ),
}

export const OutOfStock: Story = {
  args: {
    quantity: 3,
    availableStock: 0,
    disabled: false,
    onChangeQuantity: () => {},
  },
  render: () => (
    <QuantitySelectorWrapper initialQuantity={3} availableStock={0} />
  ),
}
