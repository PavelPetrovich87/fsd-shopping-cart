import { ProductCard } from '@/entities/product'

import { mockProducts } from '@/shared/mocks'

export function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Products</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCard key={product.skuId} {...product} />
        ))}
      </div>
    </main>
  )
}
