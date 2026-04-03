import type { TranslationMessages } from '../../constants/translations'

export interface HowItWorksSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

const steps = [
  { titleKey: 'howStep1Title' as const, bodyKey: 'howStep1Body' as const },
  { titleKey: 'howStep2Title' as const, bodyKey: 'howStep2Body' as const },
  { titleKey: 'howStep3Title' as const, bodyKey: 'howStep3Body' as const },
] as const

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
  const l = t.landing

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-zinc-100 bg-white py-16 sm:py-20"
      aria-labelledby="how-heading"
    >
      <div className={shell}>
        <h2 id="how-heading" className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {l.howTitle}
        </h2>
        <ol className="mx-auto mt-12 max-w-3xl space-y-10">
          {steps.map(({ titleKey, bodyKey }, index) => (
            <li key={titleKey} className="flex gap-5 sm:gap-8">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white shadow-md shadow-brand-950/20"
                aria-hidden
              >
                {index + 1}
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-lg font-semibold text-zinc-900">{l[titleKey]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{l[bodyKey]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
