import type { Language, TranslationMessages } from '../../constants/translations'
import { BenefitsSection } from './BenefitsSection'
import { FeaturesSection } from './FeaturesSection'
import { FinalCtaSection } from './FinalCtaSection'
import { HeroSection } from './HeroSection'
import { HomepageThreeStepsSection } from './HomepageThreeStepsSection'
import { HomepageTrustLayerSection } from './HomepageTrustLayerSection'
import { HowItWorksSection } from './HowItWorksSection'
import { LandingFooter } from './LandingFooter'
import { LandingNav } from './LandingNav'
import { HomepageFaqSection } from './HomepageFaqSection'
import { HomepagePopularGuidesSection } from './HomepagePopularGuidesSection'
import { SeoHomepageContentSection } from './SeoHomepageContentSection'
import { TrustSection } from './TrustSection'

export interface LandingPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
  /** Opens the invoice builder (same session; optional persistence handled by parent). */
  onStartApp: () => void
  onStartExample?: () => void
  t: TranslationMessages
}

/**
 * Marketing landing: navigation + ordered sections + footer.
 * Copy lives in `translations[language].landing`; subcomponents only handle layout.
 */
export function LandingPage({ language, onLanguageChange, onStartApp, onStartExample, t }: LandingPageProps) {
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
        <HeroSection onStartApp={onStartApp} onStartExample={onStartExample} t={t} />
        <HomepageThreeStepsSection t={t} />
        <HomepageTrustLayerSection t={t} />
        <SeoHomepageContentSection t={t} />
        {language === 'da' ? <HomepageFaqSection /> : null}
        <BenefitsSection t={t} />
        <FeaturesSection t={t} />
        <HowItWorksSection t={t} />
        <TrustSection t={t} />
        <FinalCtaSection onStartApp={onStartApp} t={t} />
        <HomepagePopularGuidesSection t={t} language={language} />
      </main>
      <LandingFooter language={language} t={t} />
    </div>
  )
}
