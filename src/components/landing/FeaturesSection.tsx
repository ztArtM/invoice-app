import type { TranslationMessages } from '../../constants/translations'

export interface FeaturesSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

const features = [
  { titleKey: 'feature1Title' as const, bodyKey: 'feature1Body' as const },
  { titleKey: 'feature2Title' as const, bodyKey: 'feature2Body' as const },
  { titleKey: 'feature3Title' as const, bodyKey: 'feature3Body' as const },
  { titleKey: 'feature4Title' as const, bodyKey: 'feature4Body' as const },
] as const

export function FeaturesSection({ t }: FeaturesSectionProps) {
  const l = t.landing

  return (
    <section className="border-b border-zinc-100 bg-zinc-50/60 py-16 sm:py-20" aria-labelledby="features-heading">
      <div className={shell}>
        <h2 id="features-heading" className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {l.featuresTitle}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map(({ titleKey, bodyKey }) => (
            <li
              key={titleKey}
              className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7"
            >
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-brand-800" aria-hidden />
              <div>
                <h3 className="font-semibold text-zinc-900">{l[titleKey]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{l[bodyKey]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
