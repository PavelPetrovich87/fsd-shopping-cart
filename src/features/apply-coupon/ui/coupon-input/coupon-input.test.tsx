import { useState } from 'react'
import { page, userEvent } from 'vitest/browser'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import '@/index.css'
import { CouponInput } from './coupon-input'

afterEach(() => {
  document.body.innerHTML = ''
})

function renderCouponInput() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  function Wrapper() {
    const [error, setError] = useState<string | undefined>(undefined)

    return (
      <CouponInput
        error={error}
        onApply={(code) => {
          if (code === '') {
            setError('Please enter a valid code')
          }
        }}
        onRemove={() => {}}
      />
    )
  }

  root.render(<Wrapper />)
  return { container, cleanup: () => root.unmount() }
}

describe('CouponInput', () => {
  it('does not shift the Apply button when an error appears', async () => {
    renderCouponInput()

    const revealButton = page.getByRole('button', { name: 'Apply coupon' })
    await userEvent.click(revealButton)

    const input = page.getByPlaceholder('Enter coupon code')
    const applyButton = page.getByRole('button', { name: 'Apply' })

    await userEvent.clear(input)

    const rectBefore = applyButton.element().getBoundingClientRect()

    await userEvent.click(applyButton)

    await expect.element(page.getByRole('alert')).toBeVisible()

    const rectAfter = applyButton.element().getBoundingClientRect()

    expect(rectAfter.top).toBe(rectBefore.top)
    expect(rectAfter.bottom).toBe(rectBefore.bottom)
  })
})
