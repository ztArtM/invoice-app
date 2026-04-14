import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { RelatedGuidesSection } from './RelatedGuidesSection'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface TilbudVsFakturaPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function TilbudVsFakturaPage({ t, locale, onBack, onStartApp }: TilbudVsFakturaPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Tilbud vs faktura – hvad er forskellen?' : 'Quote vs invoice — what is the difference?'}
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Mange freelancere og små virksomheder er i tvivl om forskellen mellem et tilbud og en faktura.
            Selvom de minder om hinanden, bruges de i forskellige situationer.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvad er et tilbud?</h2>
          <p>
            Et tilbud er en pris og beskrivelse af en opgave, som du sender til en kunde, før arbejdet
            udføres. Kunden kan derefter acceptere eller afvise tilbuddet.
          </p>
          <h2>Hvad er en faktura?</h2>
          <p>
            En faktura er en opkrævning, som du sender efter arbejdet er udført. Den fortæller kunden, hvad de
            skal betale, og hvornår betalingen skal ske.
          </p>
          <h2>De vigtigste forskelle</h2>
          <h3>Forskel på tilbud og faktura i praksis</h3>
          <ul>
            <li>Et tilbud sendes før arbejdet starter</li>
            <li>En faktura sendes efter arbejdet er udført</li>
            <li>Et tilbud er ikke en betalingsanmodning</li>
            <li>En faktura er en betalingsanmodning</li>
          </ul>
          <h2>Hvornår skal du bruge hvad?</h2>
          <p>
            Du bruger et tilbud, når du vil give kunden en pris på forhånd. Når arbejdet er udført og godkendt,
            sender du en faktura.
          </p>
          <h2>Lav tilbud og faktura samme sted</h2>
          <p>
            Med FakturaLyn kan du både oprette tilbud og fakturaer på en enkel måde. Det gør det nemt at holde
            styr på hele processen fra første kontakt til betaling.
          </p>
          <h2>Klar til at komme i gang?</h2>
          <p>Du kan hurtigt oprette både tilbud og fakturaer online med FakturaLyn.</p>
          <RelatedGuidesSection pageId="tilbudVsFaktura" locale={locale} />
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('tilbudSkabelon', L)} className={linkClass}>
                tilbud skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
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
            Many freelancers and small businesses wonder how a quote differs from an invoice. They look similar,
            but they are used at different stages of a project.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>What is a quote?</h2>
          <p>
            A quote is a price and description of the work you send before the work is done. The client can
            accept or decline it.
          </p>
          <h2>What is an invoice?</h2>
          <p>
            An invoice is a payment request you send after the work is completed. It tells the client what to
            pay and when.
          </p>
          <h2>Key differences</h2>
          <h3>Quotes vs invoices in practice</h3>
          <ul>
            <li>A quote is sent before work starts</li>
            <li>An invoice is sent after work is delivered</li>
            <li>A quote is not a payment demand</li>
            <li>An invoice is a payment request</li>
          </ul>
          <h2>When should you use which?</h2>
          <p>
            Use a quote when you want to agree a price up front. After the work is done and approved, send an
            invoice.
          </p>
          <h2>Create quotes and invoices in one place</h2>
          <p>
            FakturaLyn lets you create both quotes and invoices in a simple flow, so you can track the journey
            from first contact to payment.
          </p>
          <h2>Ready to get started?</h2>
          <p>You can create quotes and invoices online quickly with FakturaLyn.</p>
          <RelatedGuidesSection pageId="tilbudVsFaktura" locale={locale} />
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('tilbudSkabelon', L)} className={linkClass}>
                quote template
              </Link>
              <span className="text-zinc-400"> · </span>
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
