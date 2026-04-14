import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface FakturaTilFreelancerPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function FakturaTilFreelancerPage({ t, locale, onBack, onStartApp }: FakturaTilFreelancerPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Faktura til freelancer – sådan laver du den' : 'Invoicing for freelancers — how to do it'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Som freelancer er det vigtigt at kunne sende en professionel faktura til dine kunder. En tydelig og
            korrekt faktura gør det nemmere at få betaling og giver et bedre indtryk af dit arbejde.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvordan laver man en faktura som freelancer?</h2>
          <p>
            Når du laver en faktura som freelancer, skal du sikre dig, at den indeholder de nødvendige
            oplysninger og er let at forstå for kunden.
          </p>
          <h3>De vigtigste elementer</h3>
          <ul>
            <li>Fakturanummer</li>
            <li>Dato</li>
            <li>Dine oplysninger</li>
            <li>Kundens oplysninger</li>
            <li>Beskrivelse af arbejdet</li>
            <li>Pris og moms</li>
          </ul>
          <h2>Faktura som ny freelancer</h2>
          <p>
            Hvis du lige er startet som freelancer, kan det være svært at vide, hvordan du skal håndtere
            fakturering. Derfor vælger mange en enkel løsning, der gør det hurtigt at oprette en korrekt
            faktura.
          </p>
          <h2>Fordele ved at bruge et faktura program</h2>
          <ul>
            <li>Sparer tid</li>
            <li>Reducerer fejl</li>
            <li>Giver professionelle fakturaer</li>
            <li>Let at sende til kunder</li>
          </ul>
          <h2>Lav faktura online med FakturaLyn</h2>
          <p>
            Med FakturaLyn kan du lave faktura online hurtigt og nemt. Det gør det lettere at håndtere
            fakturering som freelancer og sikre, at dine fakturaer er klare og professionelle.
          </p>
          <h2>Klar til at sende din første faktura?</h2>
          <p>Du kan komme i gang med det samme og lave din første faktura online.</p>
          <p>
            Uanset om du søger svar på, hvordan fakturerer man som freelancer, vil have styr på typisk
            freelancer faktura og lav faktura som freelancer, eller leder efter et faktura program, du kan
            bruge som freelancer, samler de relaterede sider nedenfor mere hjælp.
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
              <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                hvordan laver man en faktura
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
            As a freelancer, you need invoices that look professional and are easy for clients to pay. Clear
            line items and correct totals build trust and speed up payment.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>How do you invoice as a freelancer?</h2>
          <p>
            Your invoice should include the essentials and be easy to scan: who is billing whom, what the work
            was, and how much is due.
          </p>
          <h3>The essentials</h3>
          <ul>
            <li>Invoice number</li>
            <li>Date</li>
            <li>Your details</li>
            <li>Client details</li>
            <li>Description of the work</li>
            <li>Price and VAT</li>
          </ul>
          <h2>Invoices when you are just starting out</h2>
          <p>
            If you are new to freelancing, billing can feel unclear at first. Many people choose a simple tool
            so they can issue a correct invoice quickly.
          </p>
          <h2>Why use invoicing software?</h2>
          <ul>
            <li>Saves time</li>
            <li>Reduces mistakes</li>
            <li>Keeps invoices consistent</li>
            <li>Easy to send to clients</li>
          </ul>
          <h2>Create invoices online with FakturaLyn</h2>
          <p>
            FakturaLyn helps you invoice online in a straightforward flow, so you can focus on delivery—not
            formatting.
          </p>
          <h2>Ready to send your first invoice?</h2>
          <p>You can get started right away and create your first invoice online.</p>
          <p>
            For more detail on line items, numbering, and sending PDFs, explore the related pages linked below.
          </p>
          <RelatedGuidesSection pageId="fakturaTilFreelancer" locale={locale} />
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
              <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                how to make an invoice
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
