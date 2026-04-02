import type { Language, TranslationMessages } from '../../constants/translations'
import { BenefitsSection } from './BenefitsSection'
import { FeaturesSection } from './FeaturesSection'
import { FinalCtaSection } from './FinalCtaSection'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { LandingFooter } from './LandingFooter'
import { LandingNav } from './LandingNav'
import { TrustSection } from './TrustSection'

export interface LandingPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
  /** Opens the invoice builder (same session; optional persistence handled by parent). */
  onStartApp: () => void
  t: TranslationMessages
}

/**
 * Marketing landing: navigation + ordered sections + footer.
 * Copy lives in `translations[language].landing`; subcomponents only handle layout.
 */
export function LandingPage({ language, onLanguageChange, onStartApp, t }: LandingPageProps) {
  const skipLabel = t.landing.skipToContent

  return (
    <div id="top" className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
      <a
        href="#landing-main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-3 focus:text-sm focus:text-white focus:shadow-lg"
      >
        {skipLabel}
      </a>
      <LandingNav
        language={language}
        onLanguageChange={onLanguageChange}
        onStartApp={onStartApp}
        t={t}
      />
      <main id="landing-main">
        <HeroSection onStartApp={onStartApp} t={t} />
        <BenefitsSection t={t} />
        <FeaturesSection t={t} />
        <HowItWorksSection t={t} />
        <TrustSection t={t} />
        <FinalCtaSection onStartApp={onStartApp} t={t} />
      </main>
      <LandingFooter t={t} />
    </div>
  )
}
