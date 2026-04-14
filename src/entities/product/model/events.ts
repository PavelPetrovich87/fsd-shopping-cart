export interface StockReserved {
  readonly eventType: 'StockReserved';
  readonly skuId: string;
  readonly orderId: string;
  readonly quantity: number;
  readonly occurredAt: Date;
}

export interface StockReleased {
  readonly eventType: 'StockReleased';
  readonly skuId: string;
  readonly orderId: string;
  readonly quantity: number;
  readonly occurredAt: Date;
}

export interface StockDepleted {
  readonly eventType: 'StockDepleted';
  readonly skuId: string;
  readonly totalOnHand: number;
  readonly threshold: number;
  readonly occurredAt: Date;
}

export type ProductDomainEvent = StockReserved | StockReleased | StockDepleted;