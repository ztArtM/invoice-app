import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface LavFakturaOnlinePageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function LavFakturaOnlinePage({ t, locale, onBack, onStartApp }: LavFakturaOnlinePageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={L === 'da' ? 'Lav faktura online hurtigt og nemt' : 'Create an invoice online quickly'}
      onBack={onBack}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Med FakturaLyn kan du lave en faktura online på få minutter. Det er en enkel løsning til
            freelancere og små virksomheder, som vil sende professionelle fakturaer uden besvær.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Hvorfor lave faktura online?</h2>
          <p>
            Når du laver faktura online, sparer du tid og undgår fejl i manuelle skabeloner. Du kan hurtigt
            indtaste dine oplysninger, tilføje varer eller ydelser og generere en færdig faktura klar til at
            sende.
          </p>
          <h2>Fordele ved FakturaLyn</h2>
          <ul>
            <li>Hurtig og enkel fakturering</li>
            <li>Professionelle fakturaer på få minutter</li>
            <li>Velegnet til freelancere og små virksomheder</li>
            <li>Ingen unødig kompleksitet</li>
          </ul>
          <h2>Klar til at lave din første faktura?</h2>
          <p>
            FakturaLyn gør det nemt at komme i gang. Du kan oprette en faktura online med det samme og sende
            den direkte til din kunde som PDF.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                Gratis faktura program til freelancere
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
            With FakturaLyn you can create an invoice online in minutes. It is a simple option for freelancers
            and small businesses that want professional invoices without friction.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Why create invoices online?</h2>
          <p>
            Online invoicing saves time and reduces mistakes compared to editing static templates. Enter your
            details, add line items, and export a PDF you can send straight to your client.
          </p>
          <h2>Why FakturaLyn</h2>
          <ul>
            <li>Fast, straightforward workflow</li>
            <li>Professional invoices in minutes</li>
            <li>Great for freelancers and small businesses</li>
            <li>No unnecessary complexity</li>
          </ul>
          <h2>Ready for your first invoice?</h2>
          <p>
            Get started right away: create an invoice online and send it as a PDF when you are ready.
          </p>
          <nav className="not-prose mt-10 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                Free invoicing software
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
