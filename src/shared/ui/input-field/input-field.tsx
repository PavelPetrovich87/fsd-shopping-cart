import { useId } from 'react'
import { CircleHelp, AlertCircle } from 'lucide-react'
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

  const Icon = error ? AlertCircle : CircleHelp
  const iconColorClass = error ? 'text-error-600' : 'text-neutral-500'

  const hasValue = !!value && value !== ''
  const hasError = !!error
  const isDisabled = !!disabled

  const showInlineBorder =
    !isDisabled && (!hasValue || hasError)

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
            !isDisabled && 'border',
            !isDisabled && hasValue && !hasError && 'border-neutral-200',
            !isDisabled && '!focus-within:border-transparent',
            isDisabled && 'border-0',
          ),
        }}
        style={{
          borderColor: showInlineBorder ? '#e5e5e5' : undefined,
        }}
      >
        <Icon
          {...{
            className: cn('size-4 shrink-0', iconColorClass),
          }}
          aria-hidden="true"
        />

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
              'text-neutral-950',
              hasValue && !isDisabled && 'text-neutral-500',
              !isDisabled && 'focus:text-neutral-950',
              isDisabled && 'cursor-not-allowed',
            ),
          }}
        />
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
