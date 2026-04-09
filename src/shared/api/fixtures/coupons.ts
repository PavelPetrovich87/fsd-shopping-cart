export interface Coupon {
  code: string
  description: string
  discountType: 'flat' | 'percentage'
  discountValue: number
  minPurchaseCents: number
  maxUses: number
  expiresAt: string | null
}

export const couponsData: Coupon[] = [
  {
    code: 'WELCOME10',
    description: '10% off your first order',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseCents: 0,
    maxUses: 1,
    expiresAt: null,
  },
  {
    code: 'FLAT20',
    description: '$20 off orders over $100',
    discountType: 'flat',
    discountValue: 2000,
    minPurchaseCents: 10000,
    maxUses: 100,
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    code: 'SUMMER25',
    description: '25% off summer collection',
    discountType: 'percentage',
    discountValue: 25,
    minPurchaseCents: 5000,
    maxUses: 50,
    expiresAt: '2026-08-31T23:59:59Z',
  },
]
