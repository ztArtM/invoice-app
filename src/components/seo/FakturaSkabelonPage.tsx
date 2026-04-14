import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface FakturaSkabelonPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function FakturaSkabelonPage({ t, locale, onBack, onStartApp }: FakturaSkabelonPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={
        L === 'da'
          ? 'Faktura skabelon til freelancere og små virksomheder'
          : 'Invoice template for freelancers and small businesses'
      }
      onBack={onBack}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Leder du efter en enkel faktura skabelon? Med FakturaLyn kan du hurtigt lave professionelle
            fakturaer online uden at arbejde i manuelle dokumenter eller regneark.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvornår er en faktura skabelon nyttig?</h2>
          <p>
            En faktura skabelon er nyttig, når du vil spare tid og sikre, at dine fakturaer ser professionelle
            ud. Det er især relevant for freelancere og små virksomheder, der ønsker en enkel måde at
            fakturere kunder på.
          </p>
          <h2>Hvad bør en faktura skabelon indeholde?</h2>
          <ul>
            <li>Fakturanummer</li>
            <li>Fakturadato</li>
            <li>Virksomhedsoplysninger</li>
            <li>Kundens oplysninger</li>
            <li>Beskrivelse af varer eller ydelser</li>
            <li>Pris, moms og samlet beløb</li>
          </ul>
          <h2>Brug FakturaLyn som din digitale faktura skabelon</h2>
          <p>
            I stedet for at redigere en statisk skabelon hver gang kan du bruge FakturaLyn til at oprette
            fakturaer hurtigere og mere ensartet. Det gør det nemmere at sende en korrekt og professionel
            faktura til kunden.
          </p>
          <h2>Klar til at lave din næste faktura?</h2>
          <p>
            FakturaLyn hjælper dig med at lave fakturaer og tilbud online på en hurtig og enkel måde.
          </p>
          <p>
            FakturaLyn fungerer som et samlet faktura program: du kan lave en professionel faktura og faktura
            til freelancere og små virksomheder uden tunge skabeloner i Word eller Excel.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                gratis faktura program
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                lav faktura online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaUdenCvr', L)} className={linkClass}>
                faktura uden CVR
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
            Looking for a simple invoice template? With FakturaLyn you can create professional invoices online
            without juggling Word documents or spreadsheets.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>When is an invoice template useful?</h2>
          <p>
            A template helps when you want to save time and keep invoices consistent. It is especially helpful
            for freelancers and small businesses that need a straightforward billing workflow.
          </p>
          <h2>What should an invoice template include?</h2>
          <ul>
            <li>Invoice number</li>
            <li>Invoice date</li>
            <li>Your business details</li>
            <li>Client details</li>
            <li>Description of goods or services</li>
            <li>Price, VAT, and total</li>
          </ul>
          <h2>Use FakturaLyn as your digital invoice template</h2>
          <p>
            Instead of editing a static file every time, you can generate invoices faster and more consistently.
            That makes it easier to send a correct, professional invoice to your client.
          </p>
          <h2>Ready for your next invoice?</h2>
          <p>FakturaLyn helps you create invoices and quotes online in a fast, simple flow.</p>
          <p>
            Think of it as lightweight invoicing software: professional invoices for freelancers and small
            businesses—without heavy Word or Excel templates.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                free invoicing software
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                create an invoice online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaUdenCvr', L)} className={linkClass}>
                invoice without a CVR number
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
