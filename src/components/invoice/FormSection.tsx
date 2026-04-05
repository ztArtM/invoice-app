import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  /** Optional one-line context under the title (beginner-friendly). */
  description?: string
  /** Tighter padding and typography (e.g. single small field). */
  compact?: boolean
  children: ReactNode
}

/**
 * One logical block of the invoice form: card shell, strong title, consistent spacing.
 * Stacks as siblings inside `InvoiceEditor`; no outer borders between sections besides gap.
 */
export function FormSection({ title, description, children, compact }: FormSectionProps) {
  return (
    <section
      className={
        compact
          ? 'rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 shadow-sm shadow-zinc-900/[0.03] ring-1 ring-zinc-950/[0.02] sm:p-4'
          : 'rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 shadow-sm shadow-zinc-900/[0.03] ring-1 ring-zinc-950/[0.02] sm:p-6'
      }
    >
      <header className={`border-b border-zinc-200/70 ${compact ? 'pb-2.5' : 'pb-4'}`}>
        <h2
          className={
            compact
              ? 'text-base font-semibold tracking-tight text-zinc-900'
              : 'text-lg font-semibold tracking-tight text-zinc-900'
          }
        >
          {title}
        </h2>
        {description ? (
          <p
            className={
              compact
                ? 'mt-1 max-w-prose text-xs leading-relaxed text-zinc-600'
                : 'mt-1.5 max-w-prose text-sm leading-relaxed text-zinc-600'
            }
          >
            {description}
          </p>
        ) : null}
      </header>
      <div className={compact ? 'mt-3 space-y-3' : 'mt-5 space-y-5'}>{children}</div>
    </section>
  )
}
