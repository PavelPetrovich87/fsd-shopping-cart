import type { CartItem } from '@/entities/cart'
import { Money } from '@/shared/lib/money'

export interface CheckoutInitiated {
  eventType: 'CheckoutInitiated'
  cartId: string
  userId: string
  items: readonly CartItem[]
  subtotal: Money
  timestamp: Date
}
