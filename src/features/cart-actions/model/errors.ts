import { CartState } from '@/entities/cart';

export type CartActionsError =
  | { type: 'InsufficientStockError'; skuId: string; requested: number; available: number }
  | { type: 'StockConflictError'; skuId: string; requested: number; currentAvailable: number }
  | { type: 'CartNotModifiableError'; currentState: CartState }
  | { type: 'ItemNotFoundError'; skuId: string };