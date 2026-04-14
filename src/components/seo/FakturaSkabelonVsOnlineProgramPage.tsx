import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'
import { ctaStartInvoice, getArticleFreshnessLine } from '../../constants/seoPageStrings'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { LegalPageShell } from '../legal/LegalPageShell'
import { primaryButtonClassName } from '../invoice/buttonStyles'
import { SeoLanguageSwitcher } from './SeoLanguageSwitcher'

export interface FakturaSkabelonVsOnlineProgramPageProps {
  t: TranslationMessages
  locale: SeoLocale
  onBack: () => void
  onStartApp: () => void
}

const linkClass =
  'font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700'

export function FakturaSkabelonVsOnlineProgramPage({
  t,
  locale,
  onBack,
  onStartApp,
}: FakturaSkabelonVsOnlineProgramPageProps) {
  const L = locale
  const cta = ctaStartInvoice(L)

  return (
    <LegalPageShell
      t={t}
      title={
        L === 'da'
          ? 'Faktura skabelon eller online faktura program?'
          : 'Invoice template or online invoicing software?'
      }
      onBack={onBack}
      articleFreshnessNote={getArticleFreshnessLine(L)}
      showLastUpdated={false}
      languageSwitcher={<SeoLanguageSwitcher />}
      footerLinkLocale={locale}
    >
      {L === 'da' ? (
        <>
          <p>
            Mange freelancere og små virksomheder starter med en manuel{' '}
            <Link to={seoPath('fakturaSkabelon', L)}>faktura skabelon</Link>. Det kan være en fin løsning i
            begyndelsen, men med tiden vælger mange et{' '}
            <Link to={seoPath('gratisFakturaProgram', L)}>online faktura program</Link> for at spare tid og gøre
            faktureringen mere overskuelig.
          </p>
          <p>
            Vil du sammenligne med en <Link to={seoPath('gratisFakturaSkabelon', L)}>gratis faktura skabelon</Link>,
            se mere om at <Link to={seoPath('lavFakturaOnline', L)}>lave faktura online</Link>, eller gå tilbage til{' '}
            <Link to={seoPath('home', L)}>forsiden</Link>, kan du bruge linkene her.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Fordele ved en faktura skabelon</h2>
          <ul>
            <li>Let at komme i gang med</li>
            <li>Kan bruges i et simpelt dokument eller regneark</li>
            <li>Passer til meget få fakturaer</li>
          </ul>
          <h2>Ulemper ved en manuel skabelon</h2>
          <ul>
            <li>Det tager ofte længere tid at oprette hver faktura</li>
            <li>Der er større risiko for manuelle fejl</li>
            <li>Det kan være sværere at holde layout og oplysninger ens</li>
          </ul>
          <h2>Fordele ved et online faktura program</h2>
          <ul>
            <li>Hurtigere oprettelse af fakturaer</li>
            <li>Mere ensartede og professionelle fakturaer</li>
            <li>Nemmere at lave både tilbud og fakturaer samme sted</li>
            <li>Bedre egnet når du sender fakturaer løbende</li>
          </ul>
          <h2>Hvornår giver det mening at skifte?</h2>
          <p>
            Hvis du kun sender meget få fakturaer, kan en simpel faktura skabelon være nok. Hvis du derimod
            fakturerer jævnligt, arbejder med flere kunder eller vil gøre processen hurtigere, kan et online
            faktura program være en bedre løsning.
          </p>
          <h2>Lav faktura online med FakturaLyn</h2>
          <p>
            FakturaLyn gør det nemt at lave professionelle fakturaer og tilbud online. Det er en enkel løsning til
            freelancere og små virksomheder, der vil spare tid og undgå unødig kompleksitet.
          </p>
          <h2>Klar til at gøre fakturering nemmere?</h2>
          <p>
            Du kan komme i gang med det samme og bruge FakturaLyn som en hurtig og enkel måde at lave fakturaer
            online.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Relaterede sider">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                faktura skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaSkabelon', L)} className={linkClass}>
                gratis faktura skabelon
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                lav faktura online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                gratis faktura program
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
            Many freelancers and small businesses start with a manual{' '}
            <Link to={seoPath('fakturaSkabelon', L)}>invoice template</Link>. That can work well at first, but over
            time many people choose <Link to={seoPath('gratisFakturaProgram', L)}>online invoicing software</Link> to
            save time and keep billing clearer.
          </p>
          <p>
            Compare with a <Link to={seoPath('gratisFakturaSkabelon', L)}>free invoice template</Link>, read more
            about <Link to={seoPath('lavFakturaOnline', L)}>creating invoices online</Link>, or return to the{' '}
            <Link to={seoPath('home', L)}>home page</Link> using the links here.
          </p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <h2>Benefits of an invoice template</h2>
          <ul>
            <li>Easy to get started</li>
            <li>Works in a simple document or spreadsheet</li>
            <li>Fine when you only send a few invoices</li>
          </ul>
          <h2>Drawbacks of a manual template</h2>
          <ul>
            <li>Each invoice often takes longer to create</li>
            <li>Higher risk of manual mistakes</li>
            <li>Harder to keep layout and details consistent</li>
          </ul>
          <h2>Benefits of online invoicing software</h2>
          <ul>
            <li>Faster invoice creation</li>
            <li>More consistent, professional invoices</li>
            <li>Easier to handle both quotes and invoices in one place</li>
            <li>Better when you invoice regularly</li>
          </ul>
          <h2>When does switching make sense?</h2>
          <p>
            If you only send very few invoices, a simple template may be enough. If you bill regularly, work with
            several clients, or want a faster workflow, online invoicing software is often the better fit.
          </p>
          <h2>Create invoices online with FakturaLyn</h2>
          <p>
            FakturaLyn makes it easy to create professional invoices and quotes online. It is a straightforward
            option for freelancers and small businesses who want to save time and avoid unnecessary complexity.
          </p>
          <h2>Ready to make invoicing easier?</h2>
          <p>You can get started right away and use FakturaLyn as a fast, simple way to create invoices online.</p>
          <div className="not-prose my-8">
            <button type="button" onClick={onStartApp} className={`${primaryButtonClassName} min-h-12 px-6 text-base`}>
              {cta}
            </button>
          </div>
          <nav className="not-prose mt-6 border-t border-zinc-200 pt-6" aria-label="Related pages">
            <p className="text-sm leading-relaxed text-zinc-600">
              <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                invoice template
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaSkabelon', L)} className={linkClass}>
                free invoice template
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                create an invoice online
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                free invoicing software
              </Link>
              <span className="text-zinc-400"> · </span>
              <Link to={seoPath('home', L)} className={linkClass}>
                home
              </Link>
            </p>
          </nav>
        </>
      )}
    </LegalPageShell>
  )
}
