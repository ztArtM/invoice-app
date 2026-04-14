import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface HvadSkalEnFakturaIndeholdePageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function HvadSkalEnFakturaIndeholdePage({ t, locale, onBack, onStartApp }: HvadSkalEnFakturaIndeholdePageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Hvad skal en faktura indeholde?' : 'What should an invoice include?'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Når du laver en faktura til en kunde, er det vigtigt, at den er tydelig og indeholder de relevante
            oplysninger. En professionel faktura gør det lettere for kunden at forstå, hvad der bliver
            faktureret for, og hjælper dig med at fremstå mere seriøs.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>De vigtigste oplysninger på en faktura</h2>
          <p>
            En faktura bør typisk indeholde fakturanummer, fakturadato, dine virksomhedsoplysninger, kundens
            oplysninger, en beskrivelse af varer eller ydelser samt pris, moms og samlet beløb.
          </p>
          <h2>Typiske elementer i en faktura</h2>
          <ul>
            <li>Fakturanummer</li>
            <li>Fakturadato</li>
            <li>Virksomhedsnavn og adresse</li>
            <li>Eventuelt CVR-nummer</li>
            <li>Kundens navn og adresse</li>
            <li>Beskrivelse af produkter eller ydelser</li>
            <li>Pris pr. linje</li>
            <li>Moms</li>
            <li>Samlet beløb</li>
          </ul>
          <h2>Hvorfor er det vigtigt?</h2>
          <p>
            Når en faktura er tydelig og korrekt opbygget, bliver det lettere for kunden at betale hurtigt.
            Samtidig hjælper det dig med at holde styr på din fakturering og fremstå professionel over for
            kunderne.
          </p>
          <h2>Faktura som freelancer eller mindre virksomhed</h2>
          <p>
            Hvis du er freelancer eller driver en mindre virksomhed, er det en fordel at bruge et enkelt
            faktura program, så du hurtigt kan oprette fakturaer uden at arbejde i manuelle dokumenter.
          </p>
          <h2>Lav faktura online med FakturaLyn</h2>
          <p>
            Med FakturaLyn kan du lave faktura online hurtigt og nemt. Det gør det lettere at sikre, at dine
            fakturaer indeholder de vigtigste oplysninger og er klar til at sende som PDF.
          </p>
          <h2>Klar til at lave en faktura?</h2>
          <p>
            FakturaLyn hjælper dig med at oprette professionelle fakturaer og tilbud på en enkel måde.
          </p>
          <p>
            Uanset om du har fokus på typiske faktura krav, en faktura som freelancer, eller vil lav faktura
            online med en faktura skabelon som udgangspunkt, giver de relaterede sider nedenfor mere at bygge
            videre på — mod en professionel faktura.
          </p>
          <nav className="not-prose mt-8 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                gratis faktura program
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                lav faktura online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                faktura skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                hvordan laver man en faktura
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
            When you invoice a client, clarity matters. A professional invoice explains what the client is
            paying for and helps you look credible—especially as a freelancer or small business.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>The essentials</h2>
          <p>
            Typically include invoice number, invoice date, your business details, client details, a description
            of goods or services, and price, VAT, and total.
          </p>
          <h2>Common building blocks</h2>
          <ul>
            <li>Invoice number</li>
            <li>Invoice date</li>
            <li>Business name and address</li>
            <li>Registration number (e.g. CVR when relevant)</li>
            <li>Client name and address</li>
            <li>Line items describing products or services</li>
            <li>Price per line</li>
            <li>VAT</li>
            <li>Total amount due</li>
          </ul>
          <h2>Why it matters</h2>
          <p>
            Clear invoices get paid faster. They also help you stay organized and keep a consistent record of
            what you billed.
          </p>
          <h2>Freelancers and small businesses</h2>
          <p>
            A lightweight invoicing tool helps you avoid manual documents and reduces formatting mistakes.
          </p>
          <h2>Create invoices online with FakturaLyn</h2>
          <p>
            FakturaLyn makes it easier to cover the essentials and export a PDF you can send straight to your
            client.
          </p>
          <h2>Ready to create an invoice?</h2>
          <p>FakturaLyn supports invoices and quotes in one simple workflow.</p>
          <p>
            Explore the related guides below for templates, step-by-step invoicing, and tips for freelancers.
          </p>
          <RelatedGuidesSection pageId="hvadSkalEnFakturaIndeholde" locale={locale} />
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                free invoicing software
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                create an invoice online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                invoice template
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                how to make an invoice
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
