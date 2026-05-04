import { cn } from './utils'

export interface FormControlBorderOptions {
  disabled?: boolean
  hasError?: boolean
}

/**
 * Returns Tailwind border classes for form control containers.
 *
 * Usage:
 *   <div className={cn('relative flex h-10 items-center rounded bg-neutral-100 px-3', formControlBorder({ disabled, hasError }))}>
 *
 * States:
 *   - disabled          → border-neutral-100
 *   - default/focus     → border-[#e5e5e5] → transparent on focus-within
 *   - error (focused)   → border-[#e5e5e5] → error-600 on focus-within
 */
export function formControlBorder({
  disabled,
  hasError,
}: FormControlBorderOptions): string {
  return cn(
    'border',
    disabled && 'border-neutral-100',
    !disabled && 'border-[#e5e5e5]',
    !disabled && !hasError && 'focus-within:!border-transparent',
    !disabled && hasError && 'focus-within:border-error-600',
  )
}
