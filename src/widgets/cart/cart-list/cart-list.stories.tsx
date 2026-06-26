import type { Meta, StoryObj } from '@storybook/react'

import { CartList } from './cart-list'

const meta = {
  title: 'Widgets/Cart/CartList',
  component: CartList,
  tags: ['autodocs'],
} satisfies Meta<typeof CartList>

export default meta
type Story = StoryObj<typeof meta>

import type { CartListItem } from '../model/types'

const mockItems: CartListItem[] = [
  {
    skuId: 'sku-1',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery.',
    imageUrl: 'https://placehold.co/120x120?text=Headphones',
    specs: { Color: 'Black', Connectivity: 'Bluetooth 5.3' },
    price: '$199.00',
    quantity: 1,
    minQuantity: 1,
    maxQuantity: 5,
  },
  {
    skuId: 'sku-2',
    name: 'Mechanical Keyboard',
    description: 'Tactile switches with RGB backlight and USB-C cable.',
    imageUrl: 'https://placehold.co/120x120?text=Keyboard',
    specs: { Switch: 'Brown', Layout: 'ANSI' },
    price: '$149.00 $129.00',
    quantity: 2,
    minQuantity: 1,
    maxQuantity: 3,
  },
]

const noop = () => {}

export const Default: Story = {
  args: {
    items: mockItems,
    onIncrement: noop,
    onDecrement: noop,
    onRemove: noop,
  },
}

export const Empty: Story = {
  args: {
    items: [],
    emptyStateTitle: 'Your cart is empty',
    emptyStateDescription: 'Add something to get started.',
    emptyStateActionLabel: 'Browse products',
    onEmptyStateAction: noop,
    onIncrement: noop,
    onDecrement: noop,
    onRemove: noop,
  },
}

export const Disabled: Story = {
  args: {
    items: mockItems,
    disabled: true,
    onIncrement: noop,
    onDecrement: noop,
    onRemove: noop,
  },
}
