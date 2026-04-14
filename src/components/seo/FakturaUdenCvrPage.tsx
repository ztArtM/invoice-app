import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface FakturaUdenCvrPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function FakturaUdenCvrPage({ t, locale, onBack, onStartApp }: FakturaUdenCvrPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Kan man lave en faktura uden CVR?' : 'Can you invoice without a CVR number?'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Mange nye freelancere spørger, om det er muligt at sende en faktura uden CVR-nummer. Det afhænger af
            din situation, men det vigtigste er, at fakturaen stadig er tydelig og indeholder de relevante
            oplysninger for kunden.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvornår spørger man typisk om faktura uden CVR?</h2>
          <p>
            Spørgsmålet opstår ofte, når man er ny freelancer, tester en idé eller endnu ikke har oprettet
            virksomhed. I den situation vil mange gerne forstå, hvordan de kan sende en professionel faktura til
            en kunde.
          </p>
          <h2>Hvilke oplysninger bør stadig fremgå?</h2>
          <p>
            Selv hvis du ikke har et CVR-nummer, bør en faktura stadig være tydelig og professionel. Den bør
            typisk indeholde dato, dine kontaktoplysninger, kundens oplysninger, en beskrivelse af ydelsen og det
            samlede beløb.
          </p>
          <ul>
            <li>Dato</li>
            <li>Dine oplysninger</li>
            <li>Kundens oplysninger</li>
            <li>Beskrivelse af ydelsen</li>
            <li>Pris og samlet beløb</li>
          </ul>
          <h2>Faktura som freelancer</h2>
          <p>
            Som freelancer er det vigtigt at fremstå professionel, også når du er i opstartsfasen. En enkel og
            overskuelig faktura gør det lettere for kunden at forstå opgaven og gennemføre betalingen.
          </p>
          <h2>Lav faktura online på en enkel måde</h2>
          <p>
            Med FakturaLyn kan du lave faktura online hurtigt og nemt. Det gør det lettere at oprette en tydelig
            faktura og sende den som PDF til kunden.
          </p>
          <h2>Vigtigt at være opmærksom på</h2>
          <p>
            Regler kan afhænge af din virksomhedsform og situation. Derfor bør du altid sikre dig, at de
            oplysninger du sender til kunder, passer til din konkrete situation.
          </p>
          <h2>Klar til at lave en faktura?</h2>
          <p>
            FakturaLyn hjælper dig med at lave fakturaer og tilbud online på en hurtig og overskuelig måde.
          </p>
          <p>
            Uanset om du leder efter svar på, om man kan sende faktura uden CVR, vil have styr på typiske
            faktura krav, eller vil kombinere en faktura som freelancer med en praktisk faktura skabelon og
            muligheden for at lave faktura online, kan du supplere med siderne nedenfor.
          </p>
          <RelatedGuidesSection pageId="fakturaUdenCvr" locale={locale} />
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
              <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                hvordan laver man en faktura
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('hvadSkalEnFakturaIndeholde', L)} className={linkClass}>
                hvad skal en faktura indeholde
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
            Many new freelancers ask whether you can send an invoice without a Danish CVR number. The answer
            depends on your situation—but the invoice should still be clear and include the details your client
            needs to pay you.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>When does this question come up?</h2>
          <p>
            It often appears when you are testing an idea, working as a solo freelancer, or have not registered a
            company yet. The goal is still the same: a professional invoice your client can understand.
          </p>
          <h2>What should still be on the invoice?</h2>
          <p>
            Even without a CVR, your invoice should be easy to read. Typically include the date, your contact
            details, the client’s details, a description of the work, and the amount due.
          </p>
          <ul>
            <li>Date</li>
            <li>Your details</li>
            <li>Client details</li>
            <li>Description of the service</li>
            <li>Price and total</li>
          </ul>
          <h2>Invoices as a freelancer</h2>
          <p>
            Looking professional matters—especially early on. A simple, well-structured invoice makes payment
            easier and reduces back-and-forth.
          </p>
          <h2>Create invoices online the simple way</h2>
          <p>
            FakturaLyn helps you create invoices online and export a PDF you can send to your client in minutes.
          </p>
          <h2>Important note</h2>
          <p>
            Rules depend on your setup and jurisdiction. Always make sure the information you send matches your
            actual business situation.
          </p>
          <h2>Ready to create an invoice?</h2>
          <p>FakturaLyn supports invoices and quotes in one straightforward workflow.</p>
          <p>
            Explore the related guides below for templates, line items, and tips for invoicing online.
          </p>
          <RelatedGuidesSection pageId="fakturaUdenCvr" locale={locale} />
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
              <Link to={seoPath('hvadSkalEnFakturaIndeholde', L)} className={linkClass}>
                what should an invoice include
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
