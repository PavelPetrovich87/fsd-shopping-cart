import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { CartList } from './cart-list'
import type { CartListItem } from './model/types'
import { OrderSummary } from './order-summary'

const meta = {
  title: 'Widgets/Cart/CartPage',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const initialItems: CartListItem[] = [
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

function CartPageComposition() {
  const [items, setItems] = useState<CartListItem[]>(initialItems)
  const [appliedCoupon, setAppliedCoupon] = useState<
    | {
        code: string
        discountLabel: string
      }
    | undefined
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

  const subtotal = `$${items
    .reduce((sum, item) => {
      const numericPrice = Number.parseFloat(
        item.price
          .replace(/[^0-9.]/g, '')
          .split(' ')
          .pop() ?? '0',
      )
      return sum + numericPrice * item.quantity
    }, 0)
    .toFixed(2)}`

  const discount = appliedCoupon ? '-$20.00' : undefined
  const shipping = items.length > 0 ? '$12.00' : undefined
  const totalValue =
    Number.parseFloat(subtotal.replace(/[^0-9.]/g, '')) -
    (discount ? 20 : 0) +
    (shipping ? 12 : 0)
  const total = `$${totalValue.toFixed(2)}`

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
      <div className="order-2 lg:order-1 lg:col-span-2">
        <CartList
          items={items}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      </div>
      <div className="order-1 lg:order-2">
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          total={total}
          appliedCoupon={appliedCoupon}
          couponError={couponError}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          onCheckout={() => {}}
        />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <CartPageComposition />,
}
