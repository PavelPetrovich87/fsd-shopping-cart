import type { Meta, StoryObj } from '@storybook/react'

import { productsData } from '@/shared/api'

import { ProductCard } from './ProductCard'

const meta = {
  title: 'entities/product/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    skuId: productsData[0].skuId,
    name: productsData[0].name,
    imageUrl: productsData[0].imageUrl,
    listPriceCents: productsData[0].listPriceCents,
    salePriceCents: productsData[0].salePriceCents,
  },
}

export const Sale: Story = {
  args: {
    skuId: productsData[1].skuId,
    name: productsData[1].name,
    imageUrl: productsData[1].imageUrl,
    listPriceCents: productsData[1].listPriceCents,
    salePriceCents: productsData[1].salePriceCents,
  },
}

export const Skeleton: Story = {
  args: {
    skuId: '',
    name: '',
    imageUrl: '',
    listPriceCents: 0,
    salePriceCents: null,
    isLoading: true,
  },
}
