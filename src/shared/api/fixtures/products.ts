export interface Product {
  skuId: string
  name: string
  description: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
  category: string
}

export const productsData: Product[] = [
  {
    skuId: 'SHIRT-001',
    name: 'Classic Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt for everyday wear',
    imageUrl: 'https://picsum.photos/seed/SHIRT-001/400/400',
    listPriceCents: 2999,
    salePriceCents: null,
    category: 'Apparel',
  },
  {
    skuId: 'JEANS-001',
    name: 'Slim Fit Denim Jeans',
    description: 'Classic denim jeans with modern slim fit',
    imageUrl: 'https://picsum.photos/seed/JEANS-001/400/400',
    listPriceCents: 5999,
    salePriceCents: 4499,
    category: 'Apparel',
  },
  {
    skuId: 'SHOE-001',
    name: 'Running Sneakers',
    description: 'Lightweight running shoes with cushioned sole',
    imageUrl: 'https://picsum.photos/seed/SHOE-001/400/400',
    listPriceCents: 8999,
    salePriceCents: 6999,
    category: 'Footwear',
  },
  {
    skuId: 'WATCH-001',
    name: 'Minimalist Wristwatch',
    description: 'Elegant minimalist watch with leather strap',
    imageUrl: 'https://picsum.photos/seed/WATCH-001/400/400',
    listPriceCents: 14999,
    salePriceCents: null,
    category: 'Accessories',
  },
  {
    skuId: 'BAG-001',
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with laptop compartment',
    imageUrl: 'https://picsum.photos/seed/BAG-001/400/400',
    listPriceCents: 4999,
    salePriceCents: 3999,
    category: 'Bags',
  },
  {
    skuId: 'HAT-001',
    name: 'Baseball Cap',
    description: 'Adjustable cotton baseball cap',
    imageUrl: 'https://picsum.photos/seed/HAT-001/400/400',
    listPriceCents: 1999,
    salePriceCents: null,
    category: 'Accessories',
  },
]
