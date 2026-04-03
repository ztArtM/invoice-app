import logoUrl from '../assets/logo.svg'

export interface AppHeaderProps {
  /**
   * Return to the landing page (same tab, no router).
   * When omitted, the logo is a normal link to `/` for a full reload fallback.
   */
  onBackToHome?: () => void
  /** Visible label for the text control and `aria-label` on the logo button. */
  backToHomeLabel?: string
  /** Optional feedback trigger (builder app). */
  feedback?: {
    label: string
    ariaLabel: string
    onClick: () => void
  }
}

/**
 * Sticky top bar: brand (from `logo.svg`). Aligned with the main content max width.
 * Hidden when printing so only the invoice appears on paper/PDF.
 */
export function AppHeader({ onBackToHome, backToHomeLabel, feedback }: AppHeaderProps) {
  const label = backToHomeLabel ?? 'Home'

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/90 shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_4px_24px_-8px_rgba(15,23,42,0.08)] backdrop-blur-lg backdrop-saturate-150 print:hidden">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[3.75rem] sm:px-6">
        {onBackToHome ? (
          <button
            type="button"
            onClick={onBackToHome}
            aria-label={label}
            className="flex items-center rounded-md outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-800"
          >
            <img
              src={logoUrl}
              alt=""
              width={200}
              height={50}
              className="h-8 w-auto max-w-full object-left object-contain sm:h-9"
            />
          </button>
        ) : (
          <a
            href="/"
            className="flex items-center rounded-md outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-800"
          >
            <img
              src={logoUrl}
              alt="FakturaLyn"
              width={200}
              height={50}
              className="h-8 w-auto max-w-full object-left object-contain sm:h-9"
            />
          </a>
        )}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {feedback ? (
            <button
              type="button"
              onClick={feedback.onClick}
              aria-label={feedback.ariaLabel}
              className="rounded-lg border border-zinc-200/90 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {feedback.label}
            </button>
          ) : null}
          {onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              className="rounded-md text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
            >
              {label}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
