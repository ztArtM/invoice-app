import { useEffect, useId, useRef } from 'react'

export interface FeedbackModalCopy {
  dialogTitle: string
  close: string
  iframeTitle: string
  notConfigured: string
  openInNewTab: string
}

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  /** Full embed URL including query context, or `null` if env is not configured */
  embedUrl: string | null
  /** Optional share URL when embed is available (open in new tab) */
  shareUrl: string | null
  t: FeedbackModalCopy
}

/**
 * Full-screen overlay + dialog with embedded Tally form. Closes on Escape and backdrop click.
 */
export function FeedbackModal({ open, onClose, embedUrl, shareUrl, t }: FeedbackModalProps) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 print:hidden"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[1px]"
        aria-label={t.close}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[100dvh] w-full max-w-lg flex-col rounded-t-2xl border border-zinc-200 bg-white shadow-2xl sm:max-h-[min(90dvh,820px)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="text-base font-semibold text-zinc-900">
            {t.dialogTitle}
          </h2>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {embedUrl && shareUrl ? (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                {t.openInNewTab}
              </a>
            ) : null}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {t.close}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {embedUrl ? (
            <iframe
              key={embedUrl}
              title={t.iframeTitle}
              src={embedUrl}
              className="h-[min(78dvh,720px)] w-full border-0 bg-white sm:h-[min(72dvh,680px)]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="px-4 py-8 text-center text-sm leading-relaxed text-zinc-600 sm:px-6">
              {t.notConfigured}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
