import type { TranslationMessages } from '../../constants/translations'

export interface TrustSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

export function TrustSection({ t }: TrustSectionProps) {
  const l = t.landing

  return (
    <section className="border-b border-zinc-100 bg-zinc-50/60 py-16 sm:py-20" aria-labelledby="trust-heading">
      <div className={`${shell} max-w-3xl text-center`}>
        <h2 id="trust-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {l.trustTitle}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">{l.trustBody}</p>
      </div>
    </section>
  )
}
