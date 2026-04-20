import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import type { InfoRoute } from '../../utils/infoRoutes'
import { LegalPageShell } from './LegalPageShell'
import { ContactContent, CookiesContent, PrivacyPolicyContent, TermsContent } from './LegalPages'

type BodyProps = { t: TranslationMessages; onClearLocalData: () => void }

const LEGAL_CONFIG: Record<
  InfoRoute,
  {
    title: (t: TranslationMessages) => string
    subtitle: (t: TranslationMessages) => string
    renderBody: (props: BodyProps) => ReactNode
  }
> = {
  privacy: {
    title: (t) => t.legal.privacy.pageTitle,
    subtitle: (t) => t.legal.privacy.pageSubtitle,
    renderBody: ({ t }) => <PrivacyPolicyContent t={t} />,
  },
  terms: {
    title: (t) => t.legal.terms.pageTitle,
    subtitle: (t) => t.legal.terms.pageSubtitle,
    renderBody: ({ t }) => <TermsContent t={t} />,
  },
  contact: {
    title: (t) => t.legal.contact.pageTitle,
    subtitle: (t) => t.legal.contact.pageSubtitle,
    renderBody: ({ t, onClearLocalData }) => (
      <ContactContent t={t} onClearLocalData={onClearLocalData} />
    ),
  },
  cookies: {
    title: (t) => t.legal.cookies.pageTitle,
    subtitle: (t) => t.legal.cookies.pageSubtitle,
    renderBody: ({ t }) => <CookiesContent t={t} />,
  },
}

export function LegalRouteView({
  route,
  t,
  onClearLocalData,
}: {
  route: InfoRoute
  t: TranslationMessages
  onClearLocalData: () => void
}) {
  const navigate = useNavigate()
  const onBack = () => navigate('/')
  const cfg = LEGAL_CONFIG[route]

  return (
    <LegalPageShell
      t={t}
      title={cfg.title(t)}
      subtitle={cfg.subtitle(t)}
      onBack={onBack}
    >
      {cfg.renderBody({ t, onClearLocalData })}
    </LegalPageShell>
  )
}
