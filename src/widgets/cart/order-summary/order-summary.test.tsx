import { page, userEvent } from 'vitest/browser'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OrderSummary } from './order-summary'

function renderOrderSummary(props: React.ComponentProps<typeof OrderSummary>) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  root.render(<OrderSummary {...props} />)
  return { container, cleanup: () => root.unmount() }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('OrderSummary', () => {
  it('calls onApplyCoupon with entered code', async () => {
    const onApplyCoupon = vi.fn()
    renderOrderSummary({
      subtotal: '$348.00',
      total: '$360.00',
      onApplyCoupon,
      onRemoveCoupon: vi.fn(),
      onCheckout: vi.fn(),
    })

    const revealButton = page.getByRole('button', { name: 'Apply coupon' })
    await userEvent.click(revealButton)

    const input = page.getByPlaceholder('Enter coupon code')
    await userEvent.fill(input, 'SAVE20')

    const applyButton = page.getByRole('button', { name: 'Apply' })
    await userEvent.click(applyButton)

    expect(onApplyCoupon).toHaveBeenCalledTimes(1)
    expect(onApplyCoupon).toHaveBeenCalledWith('SAVE20')
  })

  it('calls onRemoveCoupon when applied coupon is dismissed', async () => {
    const onRemoveCoupon = vi.fn()
    renderOrderSummary({
      subtotal: '$348.00',
      discount: '-$20.00',
      total: '$328.00',
      appliedCoupon: { code: 'SAVE20', discountLabel: '-$20.00' },
      onApplyCoupon: vi.fn(),
      onRemoveCoupon,
      onCheckout: vi.fn(),
    })

    const dismissButton = page.getByRole('button', { name: /Remove/i })
    await userEvent.click(dismissButton)

    expect(onRemoveCoupon).toHaveBeenCalledTimes(1)
  })

  it('calls onCheckout when checkout button is clicked', async () => {
    const onCheckout = vi.fn()
    renderOrderSummary({
      subtotal: '$348.00',
      total: '$360.00',
      onApplyCoupon: vi.fn(),
      onRemoveCoupon: vi.fn(),
      onCheckout,
    })

    const checkoutButton = page.getByRole('button', { name: 'Checkout' })
    await userEvent.click(checkoutButton)

    expect(onCheckout).toHaveBeenCalledTimes(1)
  })

  it('renders all money rows when discount and shipping are provided', async () => {
    renderOrderSummary({
      subtotal: '$348.00',
      discount: '-$20.00',
      shipping: '$12.00',
      total: '$340.00',
      onApplyCoupon: vi.fn(),
      onRemoveCoupon: vi.fn(),
      onCheckout: vi.fn(),
    })

    await expect
      .element(page.getByText('Subtotal', { exact: true }))
      .toBeVisible()
    await expect
      .element(page.getByText('Discount', { exact: true }))
      .toBeVisible()
    await expect
      .element(page.getByText('Shipping', { exact: true }))
      .toBeVisible()
    await expect.element(page.getByText('Total', { exact: true })).toBeVisible()
  })
})
