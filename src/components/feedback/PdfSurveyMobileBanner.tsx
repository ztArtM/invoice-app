import { primaryButtonClassName, tertiaryButtonClassName } from '../invoice/buttonStyles'

export interface PdfSurveyMobileBannerCopy {
  regionAriaLabel: string
  body: string
  openForm: string
  dismiss: string
}

interface PdfSurveyMobileBannerProps {
  shareUrl: string
  onDismiss: () => void
  t: PdfSurveyMobileBannerCopy
}

/**
 * After PDF on narrow / touch: centered card — user finishes save in the system UI, then opens Tally in a new tab.
 */
export function PdfSurveyMobileBanner({ shareUrl, onDismiss, t }: PdfSurveyMobileBannerProps) {
  const openSurvey = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
    onDismiss()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
        aria-hidden
        onClick={onDismiss}
      />
      <div
        role="region"
        aria-label={t.regionAriaLabel}
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xl shadow-zinc-900/15 ring-1 ring-zinc-950/[0.04]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm leading-snug text-zinc-700">{t.body}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button type="button" className={`${primaryButtonClassName} w-full sm:w-auto`} onClick={openSurvey}>
            {t.openForm}
          </button>
          <button type="button" className={`${tertiaryButtonClassName} w-full sm:w-auto`} onClick={onDismiss}>
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  )
}
