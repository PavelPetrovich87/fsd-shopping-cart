import { Button } from '@/shared/ui'

export interface CheckoutButtonProps {
  disabled?: boolean
  onCheckout: () => void
}

export function CheckoutButton({ disabled = false, onCheckout }: CheckoutButtonProps) {
  return (
    <Button variant="default" size="lg" disabled={disabled} onClick={onCheckout}>
      Checkout
    </Button>
  )
}
