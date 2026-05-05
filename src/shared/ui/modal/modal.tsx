import { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId()
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)

  // Handle open/close animations and focus management
  useLayoutEffect(() => {
    const backdrop = backdropRef.current
    const card = cardRef.current
    if (!backdrop || !card) return

    if (open) {
      openRef.current = true
      previousFocusRef.current = document.activeElement as HTMLElement
      backdrop.style.display = 'flex'
      document.body.classList.add('overflow-hidden')

      requestAnimationFrame(() => {
        backdrop.classList.add('opacity-100')
        backdrop.classList.remove('opacity-0')
        card.classList.add('scale-100', 'opacity-100')
        card.classList.remove('scale-95', 'opacity-0')
      })
    } else {
      openRef.current = false
      backdrop.classList.remove('opacity-100')
      backdrop.classList.add('opacity-0')
      card.classList.remove('scale-100', 'opacity-100')
      card.classList.add('scale-95', 'opacity-0')

      const timer = setTimeout(() => {
        if (!openRef.current) {
          backdrop.style.display = 'none'
          document.body.classList.remove('overflow-hidden')
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Restore focus on close
  useEffect(() => {
    if (!open && previousFocusRef.current) {
      const timer = setTimeout(() => {
        previousFocusRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open) return

    const backdrop = backdropRef.current
    if (!backdrop) return

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements =
        backdrop.querySelectorAll<HTMLElement>(focusableSelector)
      const firstElement = focusableElements[0] ?? backdrop
      const lastElement =
        focusableElements[focusableElements.length - 1] ?? backdrop

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus first element on open
  useEffect(() => {
    if (!open) return

    const backdrop = backdropRef.current
    if (!backdrop) return

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements =
      backdrop.querySelectorAll<HTMLElement>(focusableSelector)
    const firstElement = focusableElements[0] ?? backdrop

    const timer = setTimeout(() => {
      firstElement.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [open])

  // ESC handler
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Backdrop click handler
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  const backdropClassName =
    'fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 transition-opacity duration-200 ease-out opacity-0'

  const cardClassName =
    'relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-out scale-95 opacity-0'

  const titleClassName = 'pr-8 text-lg font-semibold text-neutral-950'

  const closeButtonClassName =
    'absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded text-neutral-500 transition-colors hover:text-neutral-950'

  return createPortal(
    <div
      ref={backdropRef}
      style={{ display: 'none' }}
      {...{ className: backdropClassName }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={cardRef}
        {...{ className: cardClassName }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : 'Dialog'}
      >
        {title && (
          <h2 id={titleId} {...{ className: titleClassName }}>
            {title}
          </h2>
        )}
        <button
          type="button"
          onClick={onClose}
          {...{ className: closeButtonClassName }}
          aria-label="Close dialog"
        >
          <X {...{ className: 'size-4' }} aria-hidden="true" />
        </button>
        <div {...{ className: title ? 'mt-8' : undefined }}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
