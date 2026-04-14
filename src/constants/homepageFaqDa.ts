/**
 * Danish homepage FAQ — shared by visible markup and FAQPage JSON-LD (must stay in sync).
 */
export type HomepageFaqItem = {
  question: string
  answer: string
}

export const HOMEPAGE_FAQ_HEADING = 'Ofte stillede spørgsmål om fakturaer'

export const HOMEPAGE_FAQ_ITEMS: HomepageFaqItem[] = [
  {
    question: 'Hvad skal en faktura indeholde?',
    answer:
      'En faktura bør typisk indeholde fakturanummer, dato, virksomhedsoplysninger, kundens oplysninger, beskrivelse af varer eller ydelser, pris, moms og samlet beløb.',
  },
  {
    question: 'Kan jeg lave en faktura online?',
    answer: 'Ja, med FakturaLyn kan du lave en faktura online hurtigt og nemt direkte i browseren.',
  },
  {
    question: 'Er FakturaLyn velegnet til freelancere?',
    answer:
      'Ja, FakturaLyn er udviklet til freelancere og små virksomheder, der ønsker en enkel løsning til fakturaer og tilbud.',
  },
  {
    question: 'Kan jeg lave tilbud og fakturaer samme sted?',
    answer:
      'Ja, med FakturaLyn kan du både oprette tilbud og fakturaer online på en enkel og overskuelig måde.',
  },
]
