import type { ReactNode } from 'react'

interface FormSubsectionProps {
  /** Short heading inside a larger form card (e.g. MobilePay vs bank). */
  title: string
  description?: string
  children: ReactNode
}

/**
 * Groups fields under a smaller heading inside a `FormSection` card.
 * Use for payment (MobilePay + bank) or any multi-block section.
 */
export function FormSubsection({ title, description, children }: FormSubsectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-prose text-xs leading-relaxed text-zinc-500">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
