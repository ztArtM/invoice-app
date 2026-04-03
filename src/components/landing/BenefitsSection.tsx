import type { TranslationMessages } from '../../constants/translations'

export interface BenefitsSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

const benefits = [
  { titleKey: 'benefit1Title' as const, bodyKey: 'benefit1Body' as const },
  { titleKey: 'benefit2Title' as const, bodyKey: 'benefit2Body' as const },
  { titleKey: 'benefit3Title' as const, bodyKey: 'benefit3Body' as const },
] as const

export function BenefitsSection({ t }: BenefitsSectionProps) {
  const l = t.landing

  return (
    <section className="border-b border-zinc-100 bg-white py-16 sm:py-20" aria-labelledby="benefits-heading">
      <div className={shell}>
        <h2 id="benefits-heading" className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {l.benefitsTitle}
        </h2>
        <ul className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {benefits.map(({ titleKey, bodyKey }, index) => (
            <li
              key={titleKey}
              className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 text-center shadow-sm sm:p-8"
            >
              <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-800/10 text-sm font-bold text-brand-800">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">{l[titleKey]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{l[bodyKey]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
