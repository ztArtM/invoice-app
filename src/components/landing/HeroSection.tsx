import type { TranslationMessages } from '../../constants/translations'
import { primaryButtonClassName, secondaryButtonClassName } from '../invoice/buttonStyles'

export interface HeroSectionProps {
  onStartApp: () => void
  t: TranslationMessages
}

const sectionShell = 'mx-auto max-w-6xl px-4 sm:px-6'

export function HeroSection({ onStartApp, t }: HeroSectionProps) {
  const l = t.landing

  return (
    <section className="relative border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/80 to-zinc-50 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className={`${sectionShell} max-w-3xl text-center`}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-800/90 sm:text-sm">
          {l.heroKicker}
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {l.heroHeadline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
          {l.heroSub}
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center">
          <button type="button" className={`${primaryButtonClassName} w-full min-h-12 px-6 text-base sm:w-auto`} onClick={onStartApp}>
            {l.heroCtaPrimary}
          </button>
          <a
            href="#how-it-works"
            className={`${secondaryButtonClassName} w-full min-h-12 justify-center text-base sm:w-auto`}
          >
            {l.heroCtaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
