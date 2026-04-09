export interface StockReserved {
  readonly type: 'StockReserved'
  readonly payload: {
    readonly skuId: string
    readonly orderId: string
    readonly quantity: number
    readonly timestamp: Date
  }
}

export interface StockReleased {
  readonly type: 'StockReleased'
  readonly payload: {
    readonly skuId: string
    readonly orderId: string
    readonly quantity: number
  }
}

export interface StockDepleted {
  readonly type: 'StockDepleted'
  readonly payload: {
    readonly skuId: string
    readonly totalOnHand: number
    readonly threshold: number
  }
}

export type ProductDomainEvent = StockReserved | StockReleased | StockDepleted
