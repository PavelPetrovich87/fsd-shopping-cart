export const CartState = {
  Active: 'Active',
  Checkout_Pending: 'Checkout_Pending',
  Checked_Out: 'Checked_Out',
} as const;

export type CartState = (typeof CartState)[keyof typeof CartState];

export interface CartItemData {
  skuId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  createdAt: Date;
}

export interface CartData {
  id: string;
  state: CartState;
  items: CartItemData[];
  couponCode: string;
  createdAt: Date;
  updatedAt: Date;
}
