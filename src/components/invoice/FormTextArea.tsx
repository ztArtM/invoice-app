import type { ComponentProps } from 'react'
import { formLabelClassName, formTextAreaClassName } from './formFieldClassNames'

export type FormTextAreaProps = Omit<ComponentProps<'textarea'>, 'className'> & {
  label: string
}

/** Multi-line field: label + textarea with the same look as text inputs. */
export function FormTextArea({ label, id, ...textareaProps }: FormTextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className={formLabelClassName}>
        {label}
      </label>
      <textarea id={id} className={formTextAreaClassName} {...textareaProps} />
    </div>
  )
}
