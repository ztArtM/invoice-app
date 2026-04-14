import { getCanonicalUrlForPath } from './seo'

/**
 * Logical SEO article/landing keys with paired Danish (legacy) and English URL paths.
 * Danish URLs stay production-stable; English lives under `/en/...`.
 */
export type SeoLocale = 'da' | 'en'

export type SeoPageId =
  | 'home'
  | 'gratisFakturaProgram'
  | 'lavFakturaOnline'
  | 'fakturaSkabelon'
  | 'tilbudSkabelon'
  | 'hvordanLaverManEnFaktura'
  | 'hvadSkalEnFakturaIndeholde'
  | 'fakturaUdenCvr'
  | 'fakturaTilFreelancer'
  | 'gratisFakturaSkabelon'
  | 'tilbudVsFaktura'
  | 'fakturaSkabelonVsOnlineProgram'

export type SeoPageMeta = {
  title: string
  description: string
  /** Open Graph / JSON-LD article headline when applicable */
  headline?: string
  /** JSON-LD WebPage `name` when not using Article headline */
  pageName?: string
}

export type SeoPageDefinition = {
  paths: Record<SeoLocale, string>
  meta: Record<SeoLocale, SeoPageMeta>
  /** Matches existing SeoManager behaviour: landings use WebPage; guides use Article */
  schema: 'webPage' | 'article'
}

export const SEO_PAGE_DEFINITIONS: Record<SeoPageId, SeoPageDefinition> = {
  home: {
    paths: { da: '/', en: '/en/' },
    meta: {
      // Mirrors `translations[lang].seo` landing title/description (used by SeoManager for `/` and `/en/`).
      da: {
        title: 'Gratis faktura program til freelancere | FakturaLyn',
        description:
          'Lav professionelle fakturaer og tilbud online. FakturaLyn er et enkelt faktura program til freelancere og små virksomheder i Danmark.',
      },
      en: {
        title: 'Free invoicing for freelancers & small businesses | FakturaLyn',
        description:
          'Create professional invoices and quotes online. FakturaLyn is simple invoicing software for freelancers and small businesses in Denmark.',
      },
    },
    schema: 'webPage',
  },
  gratisFakturaProgram: {
    paths: { da: '/gratis-faktura-program', en: '/en/free-invoice-software' },
    meta: {
      da: {
        title: 'Gratis faktura program til freelancere | FakturaLyn',
        description:
          'Brug et gratis faktura program til at lave professionelle fakturaer online. Perfekt til freelancere og små virksomheder i Danmark.',
        pageName: 'Gratis faktura program til freelancere',
      },
      en: {
        title: 'Free invoicing software for freelancers | FakturaLyn',
        description:
          'Use free invoicing software to create professional invoices online. Ideal for freelancers and small businesses in Denmark.',
        pageName: 'Free invoicing software for freelancers',
      },
    },
    schema: 'webPage',
  },
  lavFakturaOnline: {
    paths: { da: '/lav-faktura-online', en: '/en/create-invoice-online' },
    meta: {
      da: {
        title: 'Lav faktura online hurtigt og nemt | FakturaLyn',
        description:
          'Lav faktura online på få minutter med FakturaLyn. En enkel løsning til freelancere og små virksomheder, der vil fakturere professionelt.',
        pageName: 'Lav faktura online hurtigt og nemt',
      },
      en: {
        title: 'Create an invoice online in minutes | FakturaLyn',
        description:
          'Create invoices online in minutes with FakturaLyn. A simple way for freelancers and small businesses to bill professionally.',
        pageName: 'Create an invoice online in minutes',
      },
    },
    schema: 'webPage',
  },
  fakturaSkabelon: {
    paths: { da: '/faktura-skabelon', en: '/en/invoice-template' },
    meta: {
      da: {
        title: 'Faktura skabelon til freelancere og små virksomheder | FakturaLyn',
        description:
          'Brug en enkel faktura skabelon til at lave professionelle fakturaer online. Hurtigt, overskueligt og velegnet til freelancere.',
        pageName: 'Faktura skabelon til freelancere og små virksomheder',
      },
      en: {
        title: 'Invoice template for freelancers & small businesses | FakturaLyn',
        description:
          'Use a simple invoice template to create professional invoices online—fast, clear, and built for freelancers.',
        pageName: 'Invoice template for freelancers and small businesses',
      },
    },
    schema: 'webPage',
  },
  tilbudSkabelon: {
    paths: { da: '/tilbud-skabelon', en: '/en/quote-template' },
    meta: {
      da: {
        title: 'Tilbud skabelon til freelancere og små virksomheder | FakturaLyn',
        description:
          'Lav professionelle tilbud online med en enkel tilbud skabelon. FakturaLyn gør det nemt at sende tilbud til kunder.',
        headline: 'Tilbud skabelon til freelancere og små virksomheder',
      },
      en: {
        title: 'Quote template for freelancers & small businesses | FakturaLyn',
        description:
          'Create professional quotes online with a simple quote template. FakturaLyn makes it easy to send quotes clients can accept.',
        headline: 'Quote template for freelancers and small businesses',
      },
    },
    schema: 'article',
  },
  hvordanLaverManEnFaktura: {
    paths: { da: '/hvordan-laver-man-en-faktura', en: '/en/how-to-make-an-invoice' },
    meta: {
      da: {
        title: 'Hvordan laver man en faktura? Enkel guide | FakturaLyn',
        description:
          'Lær hvordan du laver en faktura som freelancer eller i en mindre virksomhed. Se de vigtigste trin og lav faktura online nemt.',
        headline: 'Hvordan laver man en faktura?',
      },
      en: {
        title: 'How to make an invoice: simple guide | FakturaLyn',
        description:
          'Learn how to create an invoice as a freelancer or small business. See the key steps and invoice online the easy way.',
        headline: 'How to make an invoice?',
      },
    },
    schema: 'article',
  },
  hvadSkalEnFakturaIndeholde: {
    paths: { da: '/hvad-skal-en-faktura-indeholde', en: '/en/what-should-an-invoice-include' },
    meta: {
      da: {
        title: 'Hvad skal en faktura indeholde? Guide | FakturaLyn',
        description:
          'Få overblik over hvad en faktura bør indeholde. En enkel guide til freelancere og små virksomheder, der vil fakturere korrekt.',
        headline: 'Hvad skal en faktura indeholde?',
      },
      en: {
        title: 'What should an invoice include? Quick guide | FakturaLyn',
        description:
          'See what a proper invoice should include. A practical guide for freelancers and small businesses who want compliant billing.',
        headline: 'What should an invoice include?',
      },
    },
    schema: 'article',
  },
  fakturaUdenCvr: {
    paths: { da: '/faktura-uden-cvr', en: '/en/invoice-without-cvr' },
    meta: {
      da: {
        title: 'Faktura uden CVR? Det skal du vide | FakturaLyn',
        description:
          'Læs mere om faktura uden CVR og hvilke oplysninger der stadig bør fremgå. En praktisk guide til freelancere og nye selvstændige.',
        headline: 'Faktura uden CVR? Det skal du vide',
      },
      en: {
        title: 'Invoicing without a CVR number: what to know | FakturaLyn',
        description:
          'What to know about invoicing without a CVR and which details still belong on the invoice. Practical tips for freelancers and new self-employed.',
        headline: 'Invoicing without a CVR number: what to know',
      },
    },
    schema: 'article',
  },
  fakturaTilFreelancer: {
    paths: { da: '/faktura-til-freelancer', en: '/en/invoice-for-freelancers' },
    meta: {
      da: {
        title: 'Faktura til freelancer – sådan gør du | FakturaLyn',
        description:
          'Se hvordan du laver en professionel faktura som freelancer. Få overblik over indhold, struktur og nem online fakturering.',
        headline: 'Faktura til freelancer – sådan laver du den',
      },
      en: {
        title: 'Freelancer invoicing: how to do it right | FakturaLyn',
        description:
          'How to create a professional freelancer invoice: structure, content, and hassle-free online invoicing with FakturaLyn.',
        headline: 'Freelancer invoicing: how to do it right',
      },
    },
    schema: 'article',
  },
  gratisFakturaSkabelon: {
    paths: { da: '/gratis-faktura-skabelon', en: '/en/free-invoice-template' },
    meta: {
      da: {
        title: 'Gratis faktura skabelon til freelancere | FakturaLyn',
        description:
          'Brug en gratis faktura skabelon til at lave professionelle fakturaer online. En enkel løsning til freelancere og små virksomheder.',
        headline: 'Gratis faktura skabelon til freelancere',
      },
      en: {
        title: 'Free invoice template for freelancers | FakturaLyn',
        description:
          'Use a free invoice template to create professional invoices online. A simple option for freelancers and small businesses.',
        headline: 'Free invoice template for freelancers',
      },
    },
    schema: 'article',
  },
  tilbudVsFaktura: {
    paths: { da: '/tilbud-vs-faktura', en: '/en/quote-vs-invoice' },
    meta: {
      da: {
        title: 'Tilbud vs faktura – hvad er forskellen? | FakturaLyn',
        description:
          'Lær forskellen på tilbud og faktura, og hvornår du skal bruge hvad. En enkel guide til freelancere og små virksomheder.',
        headline: 'Tilbud vs faktura – hvad er forskellen?',
      },
      en: {
        title: 'Quote vs invoice: what is the difference? | FakturaLyn',
        description:
          'Understand the difference between quotes and invoices—and when to use each. A clear guide for freelancers and small businesses.',
        headline: 'Quote vs invoice: what is the difference?',
      },
    },
    schema: 'article',
  },
  fakturaSkabelonVsOnlineProgram: {
    paths: {
      da: '/faktura-skabelon-vs-online-faktura-program',
      en: '/en/invoice-template-vs-online-invoicing',
    },
    meta: {
      da: {
        title: 'Faktura skabelon eller online faktura program? | FakturaLyn',
        description:
          'Sammenlign faktura skabelon med et online faktura program. Se forskelle, fordele og hvornår det giver mening at bruge en digital løsning.',
        headline: 'Faktura skabelon eller online faktura program?',
      },
      en: {
        title: 'Invoice template or online invoicing software? | FakturaLyn',
        description:
          'Compare invoice templates with online invoicing software. See the differences, benefits, and when a digital tool makes sense.',
        headline: 'Invoice template or online invoicing software?',
      },
    },
    schema: 'article',
  },
}

/** Public pathname → page + locale (after normalization). */
export function normalizeSeoPathname(pathname: string): string {
  if (!pathname || pathname === '') return '/'
  if (pathname === '/en') return '/en/'
  const trimmed = pathname.replace(/\/+$/, '')
  if (trimmed === '') return '/'
  if (trimmed === '/en') return '/en/'
  return trimmed
}

export function isHomePath(pathname: string): boolean {
  const n = normalizeSeoPathname(pathname)
  return n === '/' || n === '/en/'
}

export function homeLocaleFromPath(pathname: string): SeoLocale {
  return normalizeSeoPathname(pathname) === '/en/' ? 'en' : 'da'
}

export function resolveSeoPageFromPathname(pathname: string): { pageId: SeoPageId; locale: SeoLocale } | null {
  const n = normalizeSeoPathname(pathname)
  for (const pageId of Object.keys(SEO_PAGE_DEFINITIONS) as SeoPageId[]) {
    const def = SEO_PAGE_DEFINITIONS[pageId]
    if (def.paths.da === n) return { pageId, locale: 'da' }
    if (def.paths.en === n) return { pageId, locale: 'en' }
  }
  return null
}

export function seoPath(pageId: SeoPageId, locale: SeoLocale): string {
  return SEO_PAGE_DEFINITIONS[pageId].paths[locale]
}

/** Other language URL for the same logical page, or null if not a bilingual SEO path. */
export function getAlternatePathname(pathname: string): string | null {
  const resolved = resolveSeoPageFromPathname(pathname)
  if (!resolved) return null
  const { pageId, locale } = resolved
  const other: SeoLocale = locale === 'da' ? 'en' : 'da'
  return SEO_PAGE_DEFINITIONS[pageId].paths[other]
}

export function buildHreflangAlternates(pageId: SeoPageId): { hreflang: string; href: string }[] {
  const def = SEO_PAGE_DEFINITIONS[pageId]
  const daUrl = getCanonicalUrlForPath(def.paths.da)
  const enUrl = getCanonicalUrlForPath(def.paths.en)
  return [
    { hreflang: 'da', href: daUrl },
    { hreflang: 'en', href: enUrl },
    { hreflang: 'x-default', href: daUrl },
  ]
}

export function hreflangAlternatesForPathname(pathname: string): { hreflang: string; href: string }[] | null {
  const resolved = resolveSeoPageFromPathname(pathname)
  if (!resolved) return null
  return buildHreflangAlternates(resolved.pageId)
}
