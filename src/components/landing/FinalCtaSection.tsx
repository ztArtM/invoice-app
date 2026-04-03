import type { TranslationMessages } from '../../constants/translations'

export interface FinalCtaSectionProps {
  onStartApp: () => void
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

/** Solid white CTA on brand gradient — avoids conflicting `bg-*` with shared primary styles. */
const finalCtaButtonClassName =
  'mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-lg border border-white/30 bg-white px-8 text-base font-semibold text-brand-900 shadow-lg shadow-brand-950/25 transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto'

export function FinalCtaSection({ onStartApp, t }: FinalCtaSectionProps) {
  const l = t.landing

  return (
    <section className="bg-gradient-to-b from-brand-800 to-brand-950 py-16 text-white sm:py-20" aria-labelledby="final-cta-heading">
      <div className={`${shell} max-w-2xl text-center`}>
        <h2 id="final-cta-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {l.finalTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brand-100 sm:text-lg">{l.finalSub}</p>
        <button type="button" className={finalCtaButtonClassName} onClick={onStartApp}>
          {l.finalCta}
        </button>
      </div>
    </section>
  )
}
