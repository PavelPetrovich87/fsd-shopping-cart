import { Money } from '@/shared/lib'

export interface ProductCardProps {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
  isLoading?: boolean
}

function formatPrice(cents: number): string {
  return Money.fromCents(cents).format()
}

function PriceBlock({
  listPriceCents,
  salePriceCents,
}: {
  listPriceCents: number
  salePriceCents: number | null
}) {
  if (salePriceCents !== null) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-error-600">
          {formatPrice(salePriceCents)}
        </span>
        <span className="text-sm text-neutral-500 line-through">
          {formatPrice(listPriceCents)}
        </span>
      </div>
    )
  }

  return (
    <span className="text-base font-semibold text-neutral-900">
      {formatPrice(listPriceCents)}
    </span>
  )
}

export function ProductCard({
  skuId,
  name,
  imageUrl,
  listPriceCents,
  salePriceCents,
  isLoading = false,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <article
        aria-busy="true"
        aria-label="Product card loading"
        className="flex w-full flex-col gap-3 overflow-hidden rounded-lg bg-card p-3 shadow-subtle"
      >
        <div className="aspect-square w-full animate-pulse rounded-md bg-neutral-200" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
        </div>
      </article>
    )
  }

  return (
    <article
      data-skuid={skuId}
      className="flex w-full flex-col gap-3 overflow-hidden rounded-lg bg-card p-3 shadow-subtle"
    >
      <div className="aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
          {name}
        </h3>
        <PriceBlock
          listPriceCents={listPriceCents}
          salePriceCents={salePriceCents}
        />
      </div>
    </article>
  )
}
