import { ShoppingCart } from 'lucide-react'

import { Button } from '@/shared/ui'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  primaryAction: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const iconNode = icon ?? <ShoppingCart className="size-5 text-neutral-600" />

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center sm:p-8">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100"
        aria-hidden="true"
      >
        {iconNode}
      </div>
      <h2 className="mt-6 max-w-md text-xl font-semibold text-neutral-900">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">{description}</p>
      <div className="mt-8 flex flex-row gap-3">
        <Button variant="default" onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
