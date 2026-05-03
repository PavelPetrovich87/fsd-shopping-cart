import { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface InputFieldProps {
  label?: string
  hint?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  error?: string
  id?: string
  name?: string
  autoFocus?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export function InputField({
  label,
  hint,
  placeholder,
  defaultValue,
  value,
  disabled = false,
  error,
  id,
  name,
  autoFocus,
  onChange,
  onFocus,
  onBlur,
}: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`

  const hasValue = !!value && value !== ''
  const hasError = !!error
  const isDisabled = !!disabled

  return (
    <div {...{ className: cn('flex flex-col gap-1.5') }}>
      {label && (
        <label
          htmlFor={inputId}
          {...{ className: cn('text-sm font-medium text-neutral-800') }}
        >
          {label}
        </label>
      )}

      <div
        {...{
          className: cn(
            'relative flex h-10 w-80 items-center gap-2 rounded bg-neutral-100 px-3',
            'border',
            isDisabled && 'border-neutral-100',
            !isDisabled && 'border-[#e5e5e5]',
            !isDisabled && 'focus-within:!border-transparent',
          ),
        }}
      >
        <input
          id={inputId}
          name={name}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hint || error ? hintId : undefined}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...{
            className: cn(
              'flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600',
              !hasValue && !isDisabled && 'text-neutral-600',
              hasValue && !isDisabled && 'text-neutral-950',
              isDisabled && 'cursor-not-allowed text-neutral-500',
            ),
          }}
        />

        {hasError && (
          <AlertCircle
            {...{
              className: cn('size-4 shrink-0 text-error-600'),
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {(hint || error) && (
        <span
          id={hintId}
          {...{
            className: cn(
              'text-sm',
              error ? 'text-error-600' : 'text-neutral-600',
            ),
          }}
          role={error ? 'alert' : undefined}
        >
          {error || hint}
        </span>
      )}
    </div>
  )
}
