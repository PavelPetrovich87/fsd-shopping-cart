import type { Meta, StoryObj } from '@storybook/react'
import { Package } from 'lucide-react'

import { EmptyState } from './empty-state'

const meta = {
  title: 'entities/cart/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  title: 'Your cart is empty',
  description:
    'Looks like you have not added anything to your cart yet. Browse our products and find something you like.',
  primaryAction: {
    label: 'Explore products',
    onClick: () => console.log('explore'),
  },
}

export const Default: Story = {
  args: {
    ...baseArgs,
  },
}

export const WithSecondaryAction: Story = {
  args: {
    ...baseArgs,
    secondaryAction: {
      label: 'Sign in',
      onClick: () => console.log('signin'),
    },
  },
}

export const CustomIcon: Story = {
  args: {
    ...baseArgs,
    icon: <Package className="size-5 text-neutral-600" />,
  },
}

export const LongDescription: Story = {
  args: {
    ...baseArgs,
    description:
      'It looks like your cart is completely empty. Why not take a moment to browse our extensive collection of products? We have everything from everyday essentials to unique finds. Start exploring now and discover something you will love. Happy shopping!',
  },
}
