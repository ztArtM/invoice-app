import type { ComponentProps } from 'react'
import { formInputClassName, formLabelClassName } from './formFieldClassNames'

export type FormTextFieldProps = Omit<ComponentProps<'input'>, 'className'> & {
  label: string
  /** Appended to the default form input styles (e.g. `tabular-nums`). */
  className?: string
}

/**
 * Single-line field: label + input with shared form styles.
 * Pass normal input props (value, onChange, type, placeholder, …).
 */
export function FormTextField({ label, id, className, ...inputProps }: FormTextFieldProps) {
  const inputClassName = className ? `${formInputClassName} ${className}` : formInputClassName
  return (
    <div>
      <label htmlFor={id} className={formLabelClassName}>
        {label}
      </label>
      <input id={id} className={inputClassName} {...inputProps} />
    </div>
  )
}
