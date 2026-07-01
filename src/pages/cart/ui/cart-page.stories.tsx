import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import type { CartListItem } from '@/widgets/cart'

import { CartPage } from './cart-page'

const meta = {
  title: 'Pages/CartPage',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function createCartItems(): CartListItem[] {
  return [
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
}

function parsePrice(price: string): number {
  const numericTokens = price.replace(/[^0-9.\s]/g, '').trim().split(/\s+/)
  const lastToken = numericTokens.at(-1)
  return Number.parseFloat(lastToken ?? '0')
}

interface CartPageStoryProps {
  initialItems: CartListItem[]
}

function CartPageStory({ initialItems }: CartPageStoryProps) {
  const [items, setItems] = useState<CartListItem[]>(initialItems)
  const [appliedCoupon, setAppliedCoupon] = useState<
    { code: string; discountLabel: string } | undefined
  >(undefined)
  const [couponError, setCouponError] = useState<string | undefined>(undefined)

  const handleIncrement = (skuId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.skuId === skuId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.maxQuantity ?? 99),
            }
          : item,
      ),
    )
  }

  const handleDecrement = (skuId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.skuId === skuId
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, item.minQuantity ?? 1),
            }
          : item,
      ),
    )
  }

  const handleRemove = (skuId: string) => {
    setItems((prev) => prev.filter((item) => item.skuId !== skuId))
  }

  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === 'SAVE20') {
      setAppliedCoupon({ code: code.toUpperCase(), discountLabel: '-$20.00' })
      setCouponError(undefined)
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined)
    setCouponError(undefined)
  }

  const subtotalValue = items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity
  }, 0)
  const subtotal = `$${subtotalValue.toFixed(2)}`

  const discount = appliedCoupon ? '-$20.00' : undefined
  const shipping = items.length > 0 ? '$12.00' : undefined

  const totalValue = subtotalValue - (discount ? 20 : 0) + (shipping ? 12 : 0)
  const total = `$${totalValue.toFixed(2)}`

  return (
    <CartPage
      items={items}
      subtotal={subtotal}
      discount={discount}
      shipping={shipping}
      total={total}
      appliedCoupon={appliedCoupon}
      couponError={couponError}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onRemove={handleRemove}
      onApplyCoupon={handleApplyCoupon}
      onRemoveCoupon={handleRemoveCoupon}
      onCheckout={() => {}}
      onEmptyStateAction={() => {}}
    />
  )
}

export const Default: Story = {
  render: () => <CartPageStory initialItems={createCartItems()} />,
}

export const Empty: Story = {
  render: () => <CartPageStory initialItems={[]} />,
}
