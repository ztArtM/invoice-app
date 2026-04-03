import { useEffect, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { FeedbackModal } from './components/feedback/FeedbackModal'
import { LandingPage } from './components/landing/LandingPage'
import { InvoiceWorkspace } from './components/invoice/InvoiceWorkspace'
import { createDefaultInvoiceDocument } from './constants/defaultInvoiceDocument'
import {
  getLocaleForLanguage,
  normalizeInvoiceCurrency,
  normalizeToSupportedCurrencyCode,
} from './constants/localization'
import { translations, type Language } from './constants/translations'
import type { InvoiceDocument } from './types/invoiceDocument'
import {
  loadInvoiceDraftFromLocalStorage,
  saveInvoiceDraftToLocalStorage,
} from './utils/invoiceDraftStorage'
import { buildTallyFeedbackEmbedUrl, buildTallyFeedbackShareUrl } from './utils/tallyFeedback'
import { getInfoRouteFromHash, setInfoRouteHash, type InfoRoute } from './utils/infoRoutes'
import { LegalPageShell } from './components/legal/LegalPageShell'
import { ContactContent, CookiesContent, PrivacyPolicyContent, TermsContent } from './components/legal/LegalPages'
import { SeoManager } from './components/seo/SeoManager'
import { INVOICE_DRAFT_STORAGE_KEY } from './constants/storageKeys'

/** Wait this many ms after the last edit before writing (reduces localStorage writes while typing). */
const SAVE_DEBOUNCE_MS = 400

const APP_PHASE_STORAGE_KEY = 'invoice_app_phase'

function readInitialAppPhase(): 'landing' | 'app' {
  try {
    return sessionStorage.getItem(APP_PHASE_STORAGE_KEY) === 'app' ? 'app' : 'landing'
  } catch {
    return 'landing'
  }
}

/**
 * Single source of truth: the whole invoice lives in `useState` here.
 * Draft load/save also lives here because this is the only place that owns the full document state.
 */
function App() {
  const [language, setLanguage] = useState<Language>('da')
  const [phase, setPhase] = useState<'landing' | 'app'>(readInitialAppPhase)
  const t = translations[language]
  const [infoRoute, setInfoRoute] = useState<InfoRoute | null>(() =>
    getInfoRouteFromHash(window.location.hash),
  )

  const openBuilder = () => {
    try {
      sessionStorage.setItem(APP_PHASE_STORAGE_KEY, 'app')
    } catch {
      /* ignore quota / private mode */
    }
    setPhase('app')
  }

  const goToLanding = () => {
    try {
      sessionStorage.removeItem(APP_PHASE_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setPhase('landing')
    window.scrollTo(0, 0)
  }

  /**
   * `language` picks UI strings (`t`) and a **locale** for `Intl` (dates + money).
   * `invoiceDocument.currency.code` picks **which currency** those amounts are in (DKK / EUR).
   * They are independent: e.g. Danish UI with Euro amounts is valid.
   */
  const localeForFormatting = getLocaleForLanguage(language)
  const [invoiceDocument, setInvoiceDocument] = useState<InvoiceDocument>(() =>
    normalizeInvoiceCurrency(
      loadInvoiceDraftFromLocalStorage() ?? createDefaultInvoiceDocument(),
    ),
  )
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackUrls, setFeedbackUrls] = useState<{
    embed: string | null
    share: string | null
  } | null>(null)
  const activeCurrencyCode = normalizeToSupportedCurrencyCode(invoiceDocument.currency.code)

  const openFeedback = () => {
    setFeedbackUrls({
      embed: buildTallyFeedbackEmbedUrl(language, invoiceDocument),
      share: buildTallyFeedbackShareUrl(language, invoiceDocument),
    })
    setFeedbackOpen(true)
  }

  const closeFeedback = () => {
    setFeedbackOpen(false)
    setFeedbackUrls(null)
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const onHashChange = () => setInfoRoute(getInfoRouteFromHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (phase !== 'app') return
    const timeoutId = window.setTimeout(() => {
      saveInvoiceDraftToLocalStorage(invoiceDocument)
    }, SAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [invoiceDocument, phase])

  const seo = (
    <SeoManager phase={phase} infoRoute={infoRoute} language={language} t={t} />
  )

  const clearLocalData = () => {
    if (
      !window.confirm(
        language === 'da'
          ? 'Ryd lokale data for denne app på denne enhed? Din kladde bliver slettet.'
          : 'Clear local data for this app on this device? Your draft will be removed.',
      )
    ) {
      return
    }
    try {
      localStorage.removeItem(INVOICE_DRAFT_STORAGE_KEY)
      sessionStorage.removeItem(APP_PHASE_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setInvoiceDocument(normalizeInvoiceCurrency(createDefaultInvoiceDocument()))
    setInfoRouteHash(null)
  }

  if (infoRoute) {
    const onBack = () => setInfoRouteHash(null)
    if (infoRoute === 'privacy') {
      return (
        <>
          {seo}
          <LegalPageShell
            t={t}
            title={t.legal.privacy.pageTitle}
            subtitle={t.legal.privacy.pageSubtitle}
            onBack={onBack}
          >
            <PrivacyPolicyContent t={t} />
          </LegalPageShell>
        </>
      )
    }
    if (infoRoute === 'terms') {
      return (
        <>
          {seo}
          <LegalPageShell
            t={t}
            title={t.legal.terms.pageTitle}
            subtitle={t.legal.terms.pageSubtitle}
            onBack={onBack}
          >
            <TermsContent t={t} />
          </LegalPageShell>
        </>
      )
    }
    if (infoRoute === 'contact') {
      return (
        <>
          {seo}
          <LegalPageShell
            t={t}
            title={t.legal.contact.pageTitle}
            subtitle={t.legal.contact.pageSubtitle}
            onBack={onBack}
          >
            <ContactContent t={t} onClearLocalData={clearLocalData} />
          </LegalPageShell>
        </>
      )
    }
    return (
      <>
        {seo}
        <LegalPageShell
          t={t}
          title={t.legal.cookies.pageTitle}
          subtitle={t.legal.cookies.pageSubtitle}
          onBack={onBack}
        >
          <CookiesContent t={t} />
        </LegalPageShell>
      </>
    )
  }

  if (phase === 'landing') {
    return (
      <>
        {seo}
        <LandingPage
          language={language}
          onLanguageChange={setLanguage}
          onStartApp={openBuilder}
          t={t}
        />
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-100/90 via-zinc-50 to-zinc-100 font-sans text-zinc-900 antialiased">
      {seo}
      <a
        href="#invoice-app-main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-3 focus:text-sm focus:text-white focus:shadow-lg"
      >
        {t.app.skipToMain}
      </a>
      <AppHeader
        onBackToHome={goToLanding}
        backToHomeLabel={t.app.backToHome}
        feedback={{
          label: t.feedback.openButton,
          ariaLabel: t.feedback.openButtonAria,
          onClick: openFeedback,
        }}
      />
      <FeedbackModal
        open={feedbackOpen}
        onClose={closeFeedback}
        embedUrl={feedbackUrls?.embed ?? null}
        shareUrl={feedbackUrls?.share ?? null}
        t={t.feedback}
      />
      <main className="relative flex-1 print:flex-none">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_100%_100%_at_50%_-10%,rgba(22,62,151,0.08),transparent_58%)] print:hidden"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 print:mx-0 print:max-w-none print:px-6 print:pb-4 print:pt-4">
          <InvoiceWorkspace
            language={language}
            onLanguageChange={setLanguage}
            localeForFormatting={localeForFormatting}
            activeCurrencyCode={activeCurrencyCode}
            t={t}
            onFeedbackClick={openFeedback}
            invoiceDocument={invoiceDocument}
            setInvoiceDocument={setInvoiceDocument}
          />
        </div>
      </main>
    </div>
  )
}

export default App
