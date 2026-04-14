import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { FeedbackModal } from './components/feedback/FeedbackModal'
import { PdfSurveyMobileBanner } from './components/feedback/PdfSurveyMobileBanner'
import { LandingPage } from './components/landing/LandingPage'
import { InvoiceWorkspace } from './components/invoice/InvoiceWorkspace'
import { HashToPathRedirect } from './components/routing/HashToPathRedirect'
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
import {
  buildTallyFeedbackEmbedUrl,
  buildTallyFeedbackShareUrl,
  buildTallyPdfDownloadEmbedUrl,
  buildTallyPdfDownloadShareUrl,
} from './utils/tallyFeedback'
import type { InfoRoute } from './utils/infoRoutes'
import { LegalPageShell } from './components/legal/LegalPageShell'
import { ContactContent, CookiesContent, PrivacyPolicyContent, TermsContent } from './components/legal/LegalPages'
import { FakturaSkabelonPage } from './components/seo/FakturaSkabelonPage'
import { FakturaTilFreelancerPage } from './components/seo/FakturaTilFreelancerPage'
import { GratisFakturaSkabelonPage } from './components/seo/GratisFakturaSkabelonPage'
import { FakturaUdenCvrPage } from './components/seo/FakturaUdenCvrPage'
import { HvadSkalEnFakturaIndeholdePage } from './components/seo/HvadSkalEnFakturaIndeholdePage'
import { HvordanLaverManEnFakturaPage } from './components/seo/HvordanLaverManEnFakturaPage'
import { GratisFakturaProgramPage } from './components/seo/GratisFakturaProgramPage'
import { LavFakturaOnlinePage } from './components/seo/LavFakturaOnlinePage'
import { SeoManager } from './components/seo/SeoManager'
import { TilbudSkabelonPage } from './components/seo/TilbudSkabelonPage'
import { TilbudVsFakturaPage } from './components/seo/TilbudVsFakturaPage'
import { FakturaSkabelonVsOnlineProgramPage } from './components/seo/FakturaSkabelonVsOnlineProgramPage'
import { INVOICE_DRAFT_STORAGE_KEY } from './constants/storageKeys'
import {
  homeLocaleFromPath,
  isHomePath,
  normalizeSeoPathname,
  resolveSeoPageFromPathname,
} from './constants/seoLocaleRoutes'

/** Wait this many ms after the last edit before writing (reduces localStorage writes while typing). */
const SAVE_DEBOUNCE_MS = 400

const APP_PHASE_STORAGE_KEY = 'invoice_app_phase'

/** ~1s after PDF save so the browser can finish the download before the modal opens. */
const PDF_SURVEY_DESKTOP_DEFER_MS = 900

function prefersPdfSurveyMobileUi(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 640px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

function LegalRouteView({
  route,
  t,
  onClearLocalData,
}: {
  route: InfoRoute
  t: (typeof translations)[Language]
  onClearLocalData: () => void
}) {
  const navigate = useNavigate()
  const onBack = () => navigate('/')

  if (route === 'privacy') {
    return (
      <LegalPageShell
        t={t}
        title={t.legal.privacy.pageTitle}
        subtitle={t.legal.privacy.pageSubtitle}
        onBack={onBack}
      >
        <PrivacyPolicyContent t={t} />
      </LegalPageShell>
    )
  }
  if (route === 'terms') {
    return (
      <LegalPageShell
        t={t}
        title={t.legal.terms.pageTitle}
        subtitle={t.legal.terms.pageSubtitle}
        onBack={onBack}
      >
        <TermsContent t={t} />
      </LegalPageShell>
    )
  }
  if (route === 'contact') {
    return (
      <LegalPageShell
        t={t}
        title={t.legal.contact.pageTitle}
        subtitle={t.legal.contact.pageSubtitle}
        onBack={onBack}
      >
        <ContactContent t={t} onClearLocalData={onClearLocalData} />
      </LegalPageShell>
    )
  }
  return (
    <LegalPageShell
      t={t}
      title={t.legal.cookies.pageTitle}
      subtitle={t.legal.cookies.pageSubtitle}
      onBack={onBack}
    >
      <CookiesContent t={t} />
    </LegalPageShell>
  )
}

/**
 * Single source of truth: invoice state + global UI (language, feedback).
 */
function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [language, setLanguage] = useState<Language>('da')
  const t = translations[language]

  useEffect(() => {
    const p = normalizeSeoPathname(location.pathname)
    if (p === '/builder') return
    if (['/privacy', '/terms', '/contact', '/cookies'].includes(p)) return

    const resolved = resolveSeoPageFromPathname(p)
    if (resolved) {
      setLanguage(resolved.locale === 'da' ? 'da' : 'en')
      return
    }
    if (isHomePath(p)) {
      setLanguage(homeLocaleFromPath(p) === 'en' ? 'en' : 'da')
      return
    }
    if (p.startsWith('/en')) {
      setLanguage('en')
    }
  }, [location.pathname])

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setPdfSurveyBannerShareUrl(null)
      setLanguage(lang)
      const p = normalizeSeoPathname(location.pathname)
      if (isHomePath(p)) {
        navigate(lang === 'en' ? '/en/' : '/')
      }
    },
    [location.pathname, navigate],
  )

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
  const [pdfSurveyBannerShareUrl, setPdfSurveyBannerShareUrl] = useState<string | null>(null)
  const pdfSurveyDesktopTimeoutRef = useRef<number | null>(null)
  const activeCurrencyCode = normalizeToSupportedCurrencyCode(invoiceDocument.currency.code)

  const clearPendingPdfSurveyDesktopModal = () => {
    if (pdfSurveyDesktopTimeoutRef.current !== null) {
      window.clearTimeout(pdfSurveyDesktopTimeoutRef.current)
      pdfSurveyDesktopTimeoutRef.current = null
    }
  }

  const openFeedback = () => {
    clearPendingPdfSurveyDesktopModal()
    setPdfSurveyBannerShareUrl(null)
    setFeedbackUrls({
      embed: buildTallyFeedbackEmbedUrl(language, invoiceDocument),
      share: buildTallyFeedbackShareUrl(language, invoiceDocument),
    })
    setFeedbackOpen(true)
  }

  const openPdfDownloadFeedback = () => {
    clearPendingPdfSurveyDesktopModal()
    const shareUrl = buildTallyPdfDownloadShareUrl(language, invoiceDocument)
    const embedUrl = buildTallyPdfDownloadEmbedUrl(language, invoiceDocument)

    if (prefersPdfSurveyMobileUi()) {
      setPdfSurveyBannerShareUrl(shareUrl)
      return
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const timeoutId = window.setTimeout(() => {
          pdfSurveyDesktopTimeoutRef.current = null
          setFeedbackUrls({ embed: embedUrl, share: shareUrl })
          setFeedbackOpen(true)
        }, PDF_SURVEY_DESKTOP_DEFER_MS)
        pdfSurveyDesktopTimeoutRef.current = timeoutId
      })
    })
  }

  const closeFeedback = () => {
    setFeedbackOpen(false)
    setFeedbackUrls(null)
  }

  const dismissPdfSurveyBanner = () => {
    setPdfSurveyBannerShareUrl(null)
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    return () => {
      if (pdfSurveyDesktopTimeoutRef.current !== null) {
        window.clearTimeout(pdfSurveyDesktopTimeoutRef.current)
        pdfSurveyDesktopTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname !== '/builder') return
    const timeoutId = window.setTimeout(() => {
      saveInvoiceDraftToLocalStorage(invoiceDocument)
    }, SAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [invoiceDocument])

  const openBuilder = () => {
    try {
      sessionStorage.setItem(APP_PHASE_STORAGE_KEY, 'app')
    } catch {
      /* ignore */
    }
    navigate('/builder')
  }

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
  }

  return (
    <>
      <HashToPathRedirect />
      <SeoManager language={language} t={t} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              language={language}
              onLanguageChange={handleLanguageChange}
              onStartApp={openBuilder}
              t={t}
            />
          }
        />
        <Route path="/en" element={<Navigate to="/en/" replace />} />
        <Route
          path="/en/"
          element={
            <LandingPage
              language={language}
              onLanguageChange={handleLanguageChange}
              onStartApp={openBuilder}
              t={t}
            />
          }
        />
        <Route
          path="/builder"
          element={
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-100/90 via-zinc-50 to-zinc-100 font-sans text-zinc-900 antialiased">
              <a
                href="#invoice-app-main"
                className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-3 focus:text-sm focus:text-white focus:shadow-lg"
              >
                {t.app.skipToMain}
              </a>
              <AppHeader
                homeTo={language === 'en' ? '/en/' : '/'}
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
              {pdfSurveyBannerShareUrl ? (
                <PdfSurveyMobileBanner
                  shareUrl={pdfSurveyBannerShareUrl}
                  onDismiss={dismissPdfSurveyBanner}
                  t={{
                    regionAriaLabel: t.feedback.pdfSurveyRegionAria,
                    body: t.feedback.pdfSurveyBannerBody,
                    openForm: t.feedback.pdfSurveyOpenForm,
                    dismiss: t.feedback.pdfSurveyDismiss,
                  }}
                />
              ) : null}
              <main className="relative flex-1 print:flex-none">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_100%_100%_at_50%_-10%,rgba(22,62,151,0.08),transparent_58%)] print:hidden"
                  aria-hidden
                />
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 print:mx-0 print:max-w-none print:px-6 print:pb-4 print:pt-4">
                  <InvoiceWorkspace
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    localeForFormatting={localeForFormatting}
                    activeCurrencyCode={activeCurrencyCode}
                    t={t}
                    onFeedbackClick={openPdfDownloadFeedback}
                    invoiceDocument={invoiceDocument}
                    setInvoiceDocument={setInvoiceDocument}
                  />
                </div>
              </main>
            </div>
          }
        />
        <Route
          path="/privacy"
          element={<LegalRouteView route="privacy" t={t} onClearLocalData={clearLocalData} />}
        />
        <Route
          path="/terms"
          element={<LegalRouteView route="terms" t={t} onClearLocalData={clearLocalData} />}
        />
        <Route
          path="/contact"
          element={<LegalRouteView route="contact" t={t} onClearLocalData={clearLocalData} />}
        />
        <Route
          path="/cookies"
          element={<LegalRouteView route="cookies" t={t} onClearLocalData={clearLocalData} />}
        />
        <Route
          path="/gratis-faktura-program"
          element={
            <GratisFakturaProgramPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/free-invoice-software"
          element={
            <GratisFakturaProgramPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/lav-faktura-online"
          element={
            <LavFakturaOnlinePage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/create-invoice-online"
          element={
            <LavFakturaOnlinePage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/faktura-skabelon"
          element={
            <FakturaSkabelonPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/invoice-template"
          element={
            <FakturaSkabelonPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/hvordan-laver-man-en-faktura"
          element={
            <HvordanLaverManEnFakturaPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/how-to-make-an-invoice"
          element={
            <HvordanLaverManEnFakturaPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/hvad-skal-en-faktura-indeholde"
          element={
            <HvadSkalEnFakturaIndeholdePage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/what-should-an-invoice-include"
          element={
            <HvadSkalEnFakturaIndeholdePage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/faktura-uden-cvr"
          element={
            <FakturaUdenCvrPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/invoice-without-cvr"
          element={
            <FakturaUdenCvrPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/faktura-til-freelancer"
          element={
            <FakturaTilFreelancerPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/invoice-for-freelancers"
          element={
            <FakturaTilFreelancerPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/gratis-faktura-skabelon"
          element={
            <GratisFakturaSkabelonPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/free-invoice-template"
          element={
            <GratisFakturaSkabelonPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/tilbud-skabelon"
          element={
            <TilbudSkabelonPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/quote-template"
          element={
            <TilbudSkabelonPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/tilbud-vs-faktura"
          element={
            <TilbudVsFakturaPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/quote-vs-invoice"
          element={
            <TilbudVsFakturaPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/faktura-skabelon-vs-online-faktura-program"
          element={
            <FakturaSkabelonVsOnlineProgramPage
              locale="da"
              t={t}
              onBack={() => navigate('/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route
          path="/en/invoice-template-vs-online-invoicing"
          element={
            <FakturaSkabelonVsOnlineProgramPage
              locale="en"
              t={t}
              onBack={() => navigate('/en/')}
              onStartApp={openBuilder}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
