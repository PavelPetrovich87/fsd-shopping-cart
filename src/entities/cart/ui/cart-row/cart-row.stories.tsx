import type { Meta, StoryObj } from '@storybook/react'

import { CartRow } from './cart-row'

const meta = {
  title: 'entities/cart/CartRow',
  component: CartRow,
  tags: ['autodocs'],
} satisfies Meta<typeof CartRow>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  skuId: 'SHIRT-001',
  name: 'Classic Cotton T-Shirt',
  description: 'Soft, breathable cotton t-shirt for everyday wear',
  imageUrl: 'https://picsum.photos/seed/SHIRT-001/400/400',
  price: '$29.99',
  quantity: 2,
  minQuantity: 1,
  maxQuantity: 10,
  onIncrement: () => console.log('increment'),
  onDecrement: () => console.log('decrement'),
  onRemove: () => console.log('remove'),
}

export const Default: Story = {
  args: {
    ...baseArgs,
  },
}

export const MinQuantity: Story = {
  args: {
    ...baseArgs,
    quantity: 1,
  },
}

export const MaxQuantity: Story = {
  args: {
    ...baseArgs,
    quantity: 10,
  },
}

export const Disabled: Story = {
  args: {
    ...baseArgs,
    disabled: true,
  },
}

export const WithSpecs: Story = {
  args: {
    ...baseArgs,
    specs: { Color: 'Blue', Size: 'M' },
  },
}

export const SalePrice: Story = {
  args: {
    ...baseArgs,
    price: '$29.99 $44.99',
  },
}
