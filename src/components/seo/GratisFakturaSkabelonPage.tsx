import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface GratisFakturaSkabelonPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function GratisFakturaSkabelonPage({ t, locale, onBack, onStartApp }: GratisFakturaSkabelonPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Gratis faktura skabelon til freelancere' : 'Free invoice template for freelancers'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Leder du efter en gratis faktura skabelon? Med FakturaLyn kan du hurtigt lave professionelle
            fakturaer online uden at starte fra bunden i et dokument eller regneark.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvornår er en gratis faktura skabelon nyttig?</h2>
          <p>
            En gratis faktura skabelon er nyttig, når du vil spare tid og sende en tydelig faktura til en
            kunde. Det er især relevant for freelancere og små virksomheder, som ønsker en enkel løsning.
          </p>
          <h2>Hvad bør en faktura skabelon indeholde?</h2>
          <ul>
            <li>Fakturanummer</li>
            <li>Fakturadato</li>
            <li>Dine oplysninger</li>
            <li>Kundens oplysninger</li>
            <li>Beskrivelse af varer eller ydelser</li>
            <li>Pris, moms og samlet beløb</li>
          </ul>
          <h2>Fordele ved en digital faktura skabelon</h2>
          <p>
            I stedet for at redigere en statisk skabelon hver gang kan du bruge en digital løsning, der gør
            det hurtigere at oprette og sende fakturaer. Det reducerer fejl og giver et mere professionelt
            resultat.
          </p>
          <h2>Lav faktura online med FakturaLyn</h2>
          <p>
            FakturaLyn gør det nemt at lave faktura online og sende den som PDF til kunden. Det er en enkel
            løsning til freelancere og små virksomheder, der ønsker hurtig og professionel fakturering.
          </p>
          <h2>Klar til at lave din næste faktura?</h2>
          <p>
            Du kan komme i gang med det samme og bruge FakturaLyn som din gratis faktura skabelon online.
          </p>
          <nav className="not-prose mt-8 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                faktura skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                gratis faktura program
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
            Looking for a free invoice template? FakturaLyn helps you create professional invoices online
            without rebuilding a document or spreadsheet from scratch every time.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>When is a free invoice template useful?</h2>
          <p>
            It is useful when you want to save time and send a clear invoice to a client—especially for
            freelancers and small businesses that prefer a simple workflow.
          </p>
          <h2>What should an invoice template include?</h2>
          <ul>
            <li>Invoice number</li>
            <li>Invoice date</li>
            <li>Your details</li>
            <li>Client details</li>
            <li>Description of goods or services</li>
            <li>Price, VAT, and total</li>
          </ul>
          <h2>Why use a digital template?</h2>
          <p>
            Instead of editing a static file each time, a digital tool helps you create and send invoices
            faster with fewer mistakes and a more professional result.
          </p>
          <h2>Create invoices online with FakturaLyn</h2>
          <p>
            FakturaLyn makes it easy to create invoices online and send them as PDFs—a simple option when you
            want fast, professional billing.
          </p>
          <h2>Ready for your next invoice?</h2>
          <p>You can start right away and use FakturaLyn as your free invoice template online.</p>
          <RelatedGuidesSection pageId="gratisFakturaSkabelon" locale={locale} />
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                invoice template
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                free invoicing software
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
