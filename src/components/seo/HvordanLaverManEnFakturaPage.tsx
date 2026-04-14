import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface HvordanLaverManEnFakturaPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function HvordanLaverManEnFakturaPage({ t, locale, onBack, onStartApp }: HvordanLaverManEnFakturaPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Hvordan laver man en faktura?' : 'How do you make an invoice?'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Hvis du er freelancer eller driver en mindre virksomhed, er det vigtigt at kunne lave en professionel
            faktura til dine kunder. En faktura skal være tydelig, korrekt og indeholde de relevante
            oplysninger, så kunden nemt kan betale dig.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvad skal en faktura indeholde?</h2>
          <p>
            En faktura bør typisk indeholde fakturanummer, fakturadato, dine virksomhedsoplysninger, kundens
            oplysninger, en beskrivelse af varer eller ydelser samt pris, moms og samlet beløb.
          </p>
          <h2>Trin for trin: sådan laver du en faktura</h2>
          <h3>1. Tilføj dine virksomhedsoplysninger</h3>
          <p>
            Start med at skrive navn på din virksomhed, adresse og eventuelt CVR-nummer. Det gør det tydeligt,
            hvem fakturaen kommer fra.
          </p>
          <h3>2. Tilføj kundens oplysninger</h3>
          <p>
            Skriv kundens navn og adresse, så fakturaen er tydeligt adresseret til den rigtige modtager.
          </p>
          <h3>3. Beskriv dine varer eller ydelser</h3>
          <p>
            Forklar kort og præcist, hvad kunden bliver faktureret for. Det gør fakturaen lettere at forstå og
            reducerer risikoen for misforståelser.
          </p>
          <h3>4. Angiv pris og moms</h3>
          <p>
            Tilføj pris på de enkelte ydelser eller produkter, og angiv moms og samlet beløb, så kunden tydeligt
            kan se det endelige beløb.
          </p>
          <h3>5. Send fakturaen til kunden</h3>
          <p>
            Når fakturaen er færdig, kan du sende den som PDF til kunden. En tydelig og professionel faktura
            giver et bedre indtryk og gør betalingsprocessen nemmere.
          </p>
          <h2>Lav faktura online i stedet for manuelt</h2>
          <p>
            Mange vælger at bruge et digitalt værktøj i stedet for manuelle dokumenter eller regneark. Med
            FakturaLyn kan du lave faktura online hurtigt og nemt, så du sparer tid og får et mere professionelt
            resultat.
          </p>
          <h2>Faktura som freelancer</h2>
          <p>
            Som freelancer er det vigtigt, at dine fakturaer er enkle at oprette og nemme at sende. Derfor vælger
            mange et faktura program, som gør det hurtigt at lave en korrekt faktura til kunden.
          </p>
          <h2>Klar til at lave din første faktura?</h2>
          <p>
            Du kan bruge FakturaLyn til at lave fakturaer og tilbud online på en hurtig og overskuelig måde.
          </p>
          <p>
            Vil du vide mere om, hvad en faktura bør indeholde ud over denne guide, hvordan du nemmest sender
            en faktura til kunde, eller hvordan du strukturerer en faktura som freelancer, understøtter de
            relaterede sider nedenfor dit arbejde — med links til blandt andet en faktura skabelon og muligheden
            for at lave faktura online.
          </p>
          <RelatedGuidesSection pageId="hvordanLaverManEnFaktura" locale={locale} />
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
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
            If you are a freelancer or run a small business, you need invoices that are clear, correct, and easy
            for clients to pay. This guide walks through the essentials in plain language.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>What should an invoice include?</h2>
          <p>
            Typically: invoice number, invoice date, your business details, client details, a description of goods
            or services, and price, VAT, and total.
          </p>
          <h2>Step by step: how to create an invoice</h2>
          <h3>1. Add your business details</h3>
          <p>
            Start with your name or business name, address, and any registration number (for example a CVR in
            Denmark). This makes it obvious who is billing.
          </p>
          <h3>2. Add the client’s details</h3>
          <p>
            Include the client name and address so the invoice is clearly addressed to the right recipient.
          </p>
          <h3>3. Describe the goods or services</h3>
          <p>
            Write a short, precise description of what you are charging for. Clear descriptions reduce confusion
            and delays.
          </p>
          <h3>4. Add price and VAT</h3>
          <p>
            Show line prices, VAT, and the total amount due so the client can see exactly what to pay.
          </p>
          <h3>5. Send the invoice</h3>
          <p>
            When you are ready, export a PDF and send it to your client. A clean invoice makes payment easier.
          </p>
          <h2>Create invoices online instead of manually</h2>
          <p>
            Many people prefer a simple tool over spreadsheets. FakturaLyn helps you create invoices online
            quickly with a consistent layout.
          </p>
          <h2>Invoices for freelancers</h2>
          <p>
            As a freelancer, speed matters. The faster you can issue a correct invoice, the faster you can get
            paid.
          </p>
          <h2>Ready for your first invoice?</h2>
          <p>
            You can use FakturaLyn to create invoices and quotes online in one straightforward workflow.
          </p>
          <p>
            For more detail on required fields, invoice templates, and sending PDFs, see the related pages below.
          </p>
          <RelatedGuidesSection pageId="hvordanLaverManEnFaktura" locale={locale} />
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
