import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartQuote, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface TilbudSkabelonPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function TilbudSkabelonPage({ t, locale, onBack, onStartApp }: TilbudSkabelonPageProps) {
  const L = locale
  const cta = ctaStartQuote(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Tilbud skabelon til freelancere' : 'Quote template for freelancers'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Leder du efter en tilbud skabelon? Med FakturaLyn kan du lave tilbud online med samme enkle flow
            som til fakturaer — uden tunge Word-skabeloner.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvad bør en tilbud skabelon indeholde?</h2>
          <ul>
            <li>Tilbudsnummer og dato</li>
            <li>Dine oplysninger og kundens oplysninger</li>
            <li>Beskrivelse af opgaven og levering</li>
            <li>Pris, eventuel moms og gyldighed</li>
          </ul>
          <h2>Tilbud vs faktura</h2>
          <p>
            Et tilbud er et prisoverslag før opgaven; en faktura er betalingsanmodningen bagefter. Læs mere om{' '}
            <Link to={seoPath('tilbudVsFaktura', L)} className={linkClass}>
              tilbud vs faktura
            </Link>
            .
          </p>
          <nav className="not-prose mt-8 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                faktura skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                lav faktura online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('home', L)} className={linkClass}>
                forsiden
              </Link>
            </p>
          </nav>
        </>
      ) : (
        <>
          <p>
            Looking for a quote template? With FakturaLyn you can create quotes online using the same simple
            flow as invoices—without clunky Word templates.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>What should a quote template include?</h2>
          <ul>
            <li>Quote number and date</li>
            <li>Your details and the client’s details</li>
            <li>Scope of work and delivery</li>
            <li>Price, VAT if applicable, and validity</li>
          </ul>
          <h2>Quote vs invoice</h2>
          <p>
            A quote is a price proposal before work starts; an invoice is the payment request afterwards. Read
            more in our guide to{' '}
            <Link to={seoPath('tilbudVsFaktura', L)} className={linkClass}>
              quote vs invoice
            </Link>
            .
          </p>
          <nav className="not-prose mt-8 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                invoice template
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                create an invoice online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('home', L)} className={linkClass}>
                homepage
              </Link>
            </p>
          </nav>
        </>
      )}
    </LegalPageShell>
  )
}
