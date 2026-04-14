import type { SeoPageId } from '../../constants/seoLocaleRoutes'

/** Article-style SEO pages that show the “Relaterede guides” block. */
export type ArticleGuidePageId =
  | 'hvordanLaverManEnFaktura'
  | 'hvadSkalEnFakturaIndeholde'
  | 'fakturaUdenCvr'
  | 'fakturaTilFreelancer'
  | 'gratisFakturaSkabelon'
  | 'tilbudVsFaktura'

export const RELATED_GUIDES_FOR_PAGE: Record<ArticleGuidePageId, SeoPageId[]> = {
  hvordanLaverManEnFaktura: ['hvadSkalEnFakturaIndeholde', 'fakturaTilFreelancer', 'gratisFakturaSkabelon'],
  hvadSkalEnFakturaIndeholde: ['hvordanLaverManEnFaktura', 'fakturaUdenCvr', 'fakturaSkabelon'],
  fakturaUdenCvr: ['hvadSkalEnFakturaIndeholde', 'fakturaTilFreelancer', 'lavFakturaOnline'],
  fakturaTilFreelancer: ['hvordanLaverManEnFaktura', 'gratisFakturaProgram', 'gratisFakturaSkabelon'],
  gratisFakturaSkabelon: ['fakturaSkabelon', 'lavFakturaOnline', 'hvordanLaverManEnFaktura'],
  tilbudVsFaktura: ['tilbudSkabelon', 'fakturaSkabelon', 'lavFakturaOnline'],
}

type GuideLinkCopy = { da: { title: string; blurb: string }; en: { title: string; blurb: string } }

/** Titles and one-line blurbs for internal guide links (language-aware). */
export const RELATED_GUIDE_LINK_COPY: Record<SeoPageId, GuideLinkCopy | undefined> = {
  home: undefined,
  gratisFakturaProgram: {
    da: {
      title: 'Gratis faktura program',
      blurb: 'Et enkelt program til at lave fakturaer og tilbud uden unødigt bøvl.',
    },
    en: {
      title: 'Free invoicing software',
      blurb: 'Simple software for invoices and quotes without unnecessary hassle.',
    },
  },
  lavFakturaOnline: {
    da: {
      title: 'Lav faktura online',
      blurb: 'Opret og send fakturaer direkte i browseren, når du er klar.',
    },
    en: {
      title: 'Create an invoice online',
      blurb: 'Create and send invoices in your browser when you are ready.',
    },
  },
  fakturaSkabelon: {
    da: {
      title: 'Faktura skabelon',
      blurb: 'Struktur og layout, så dine fakturaer ser ens og professionelle ud.',
    },
    en: {
      title: 'Invoice template',
      blurb: 'Structure and layout so your invoices look consistent and professional.',
    },
  },
  tilbudSkabelon: {
    da: {
      title: 'Tilbud skabelon',
      blurb: 'Lav tydelige tilbud, før du sender den endelige faktura.',
    },
    en: {
      title: 'Quote template',
      blurb: 'Send clear quotes before you issue the final invoice.',
    },
  },
  hvordanLaverManEnFaktura: {
    da: {
      title: 'Hvordan laver man en faktura?',
      blurb: 'Trin-for-trin gennemgang af, hvad du skal udfylde og i hvilken rækkefølge.',
    },
    en: {
      title: 'How do you make an invoice?',
      blurb: 'A step-by-step walkthrough of what to fill in and in what order.',
    },
  },
  hvadSkalEnFakturaIndeholde: {
    da: {
      title: 'Hvad skal en faktura indeholde?',
      blurb: 'Krav til fakturaoplysninger, moms og betalingsbetingelser i korte træk.',
    },
    en: {
      title: 'What should an invoice include?',
      blurb: 'Required invoice details, VAT, and payment terms in plain language.',
    },
  },
  fakturaUdenCvr: {
    da: {
      title: 'Faktura uden CVR',
      blurb: 'Når du ikke har eller ikke skal bruge CVR på fakturaen.',
    },
    en: {
      title: 'Invoice without a CVR number',
      blurb: 'When you do not have or do not need a CVR on the invoice.',
    },
  },
  fakturaTilFreelancer: {
    da: {
      title: 'Faktura til freelancer',
      blurb: 'Sådan strukturerer du fakturering og priser som selvstændig.',
    },
    en: {
      title: 'Invoice for freelancers',
      blurb: 'How to structure invoicing and pricing as a freelancer.',
    },
  },
  gratisFakturaSkabelon: {
    da: {
      title: 'Gratis faktura skabelon',
      blurb: 'Kom hurtigt i gang med en klar skabelon til dine fakturaer.',
    },
    en: {
      title: 'Free invoice template',
      blurb: 'Get started quickly with a clear template for your invoices.',
    },
  },
  tilbudVsFaktura: {
    da: {
      title: 'Tilbud vs. faktura',
      blurb: 'Forskellen mellem tilbud og faktura, og hvornår du bruger hvad.',
    },
    en: {
      title: 'Quote vs. invoice',
      blurb: 'The difference between quotes and invoices, and when to use each.',
    },
  },
  fakturaSkabelonVsOnlineProgram: undefined,
}

/** Guides highlighted on the marketing homepage (routes exist under DA and `/en/...`). */
export const HOMEPAGE_POPULAR_GUIDE_IDS: readonly ArticleGuidePageId[] = [
  'hvordanLaverManEnFaktura',
  'hvadSkalEnFakturaIndeholde',
  'fakturaUdenCvr',
  'fakturaTilFreelancer',
  'gratisFakturaSkabelon',
  'tilbudVsFaktura',
] as const
