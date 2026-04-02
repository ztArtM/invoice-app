import type { TranslationMessages } from '../../constants/translations'
import { AppFooter } from '../AppFooter'

export interface LandingFooterProps {
  t: TranslationMessages
}

export function LandingFooter({ t }: LandingFooterProps) {
  return <AppFooter t={t} />
}
