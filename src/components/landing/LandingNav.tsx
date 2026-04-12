import { Link } from 'react-router-dom'
import logoUrl from '../../assets/logo.svg'
import type { Language, TranslationMessages } from '../../constants/translations'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { toolbarSelectClassName } from '../invoice/formFieldClassNames'

export interface LandingNavProps {
  language: Language
  onLanguageChange: (language: Language) => void
  onStartApp: () => void
  t: TranslationMessages
}

export function LandingNav({ language, onLanguageChange, onStartApp, t }: LandingNavProps) {
  const w = t.workspace

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/90 backdrop-blur-lg backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[3.75rem] sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-md outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-800"
        >
          <img
            src={logoUrl}
            alt="FakturaLyn"
            width={200}
            height={50}
            decoding="async"
            fetchPriority="high"
            className="h-8 w-auto max-w-[160px] object-left object-contain sm:h-9 sm:max-w-none"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="landing-language">
            {w.languageLabel}
          </label>
          <select
            id="landing-language"
            className={`${toolbarSelectClassName} max-w-[8.5rem] sm:max-w-none`}
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as Language)}
          >
            <option value="en">{w.languageEnglish}</option>
            <option value="da">{w.languageDanish}</option>
          </select>
          <button type="button" className={primaryButtonClassName} onClick={onStartApp}>
            {t.landing.navStart}
          </button>
        </div>
      </div>
    </header>
  )
}
