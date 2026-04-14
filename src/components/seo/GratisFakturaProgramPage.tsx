import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export interface GratisFakturaProgramPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

/**
 * SEO landing: “gratis faktura program” / “free invoicing software”.
 */
export function GratisFakturaProgramPage({ t, locale, onBack, onStartApp }: GratisFakturaProgramPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Gratis faktura program til freelancere' : 'Free invoicing software for freelancers'}
      onBack={onBack}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Leder du efter et gratis faktura program? FakturaLyn gør det nemt for freelancere og små
            virksomheder i Danmark at lave professionelle fakturaer online.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Lav faktura online uden besvær</h2>
          <p>
            Med FakturaLyn kan du hurtigt oprette fakturaer direkte i din browser. Du behøver ikke installere
            noget, og du kan komme i gang med det samme.
          </p>
          <h2>Fordele ved et gratis faktura program</h2>
          <ul>
            <li>Spar tid på fakturering</li>
            <li>Lav professionelle PDF-fakturaer</li>
            <li>Ingen installation nødvendig</li>
            <li>Perfekt til freelancere og små virksomheder</li>
          </ul>
          <h2>Kom i gang med FakturaLyn</h2>
          <p>
            Du kan begynde at lave din første faktura med det samme. FakturaLyn er designet til at være
            hurtigt, simpelt og effektivt.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                Se hvordan du kan lave faktura online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaUdenCvr', L)} className={linkClass}>
                Faktura uden CVR
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('home', L)} className={linkClass}>
                Tilbage til forsiden
              </Link>
            </p>
          </nav>
        </>
      ) : (
        <>
          <p>
            Looking for free invoicing software? FakturaLyn helps freelancers and small businesses create
            professional invoices online—right in your browser.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Create invoices online without friction</h2>
          <p>
            With FakturaLyn you can issue invoices quickly with no installation. Open the app, fill in your
            details, and download a PDF when you are ready.
          </p>
          <h2>Why use free invoicing software?</h2>
          <ul>
            <li>Save time on billing</li>
            <li>Professional PDF invoices</li>
            <li>No install required</li>
            <li>Built for freelancers and small teams</li>
          </ul>
          <h2>Get started with FakturaLyn</h2>
          <p>
            You can create your first invoice in minutes. The workflow is intentionally simple so you can
            focus on your work—not paperwork.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                Create an invoice online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaUdenCvr', L)} className={linkClass}>
                Invoice without a CVR number
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('home', L)} className={linkClass}>
                Back to the homepage
              </Link>
            </p>
          </nav>
        </>
      )}
    </LegalPageShell>
  )
}
