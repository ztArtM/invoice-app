import type { Language, TranslationMessages } from '../../constants/translations'
import { AppFooter } from '../AppFooter'

export interface LandingFooterProps {
  language: Language
  t: TranslationMessages
}

export function LandingFooter({ language, t }: LandingFooterProps) {
  return <AppFooter t={t} linkLocale={language === 'en' ? 'en' : 'da'} />
}
