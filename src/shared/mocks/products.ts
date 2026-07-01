export interface MockProduct {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
}

export const mockProducts: MockProduct[] = [
  {
    skuId: 'HEAD-001',
    name: 'Wireless Headphones',
    imageUrl: 'https://placehold.co/400x400?text=Wireless+Headphones',
    listPriceCents: 14999,
    salePriceCents: 12999,
  },
  {
    skuId: 'BAG-001',
    name: 'Travel Backpack',
    imageUrl: 'https://placehold.co/400x400?text=Travel+Backpack',
    listPriceCents: 7999,
    salePriceCents: null,
  },
  {
    skuId: 'SHOE-001',
    name: 'Running Sneakers',
    imageUrl: 'https://placehold.co/400x400?text=Running+Sneakers',
    listPriceCents: 11999,
    salePriceCents: 9999,
  },
  {
    skuId: 'WATCH-001',
    name: 'Smart Fitness Watch',
    imageUrl: 'https://placehold.co/400x400?text=Smart+Fitness+Watch',
    listPriceCents: 14999,
    salePriceCents: null,
  },
  {
    skuId: 'KEYB-001',
    name: 'Mechanical Keyboard',
    imageUrl: 'https://placehold.co/400x400?text=Mechanical+Keyboard',
    listPriceCents: 9999,
    salePriceCents: 8999,
  },
  {
    skuId: 'MOUSE-001',
    name: 'Ergonomic Mouse',
    imageUrl: 'https://placehold.co/400x400?text=Ergonomic+Mouse',
    listPriceCents: 1999,
    salePriceCents: null,
  },
  {
    skuId: 'LAMP-001',
    name: 'Desk Lamp LED',
    imageUrl: 'https://placehold.co/400x400?text=Desk+Lamp+LED',
    listPriceCents: 4999,
    salePriceCents: 3999,
  },
]
