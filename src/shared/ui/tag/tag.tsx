import * as React from 'react'

import { cn } from '@/shared/lib/utils'

export interface TagProps {
  children: React.ReactNode
  onDismiss?: () => void
}

export function Tag({ children, onDismiss }: TagProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onDismiss?.()
    }
  }

  const ariaLabel =
    typeof children === 'string' ? `Remove ${children}` : 'Remove tag'

  return (
    <span
      {...{
        className: cn(
          'inline-flex h-7 items-center gap-1 rounded-sm bg-neutral-200 px-2.5 text-sm font-medium text-neutral-900',
        ),
      }}
    >
      {children}
      {onDismiss && (
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={onDismiss}
          onKeyDown={handleKeyDown}
          {...{
            className: cn(
              'inline-flex h-5 w-5 items-center justify-center rounded-sm text-neutral-900',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            ),
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
