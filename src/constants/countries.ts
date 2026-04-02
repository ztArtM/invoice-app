export type CountryCode = string

export const DEFAULT_COUNTRY_CODE: CountryCode = 'DK'

export const EU_COUNTRY_CODES: readonly CountryCode[] = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
]

export const COUNTRY_OPTIONS: readonly { code: CountryCode; labelEn: string; labelDa: string }[] = [
  { code: 'DK', labelEn: 'Denmark', labelDa: 'Danmark' },
  { code: 'DE', labelEn: 'Germany', labelDa: 'Tyskland' },
  { code: 'SE', labelEn: 'Sweden', labelDa: 'Sverige' },
  { code: 'NL', labelEn: 'Netherlands', labelDa: 'Nederlandene' },
  { code: 'FR', labelEn: 'France', labelDa: 'Frankrig' },
  { code: 'ES', labelEn: 'Spain', labelDa: 'Spanien' },
  { code: 'IT', labelEn: 'Italy', labelDa: 'Italien' },
  { code: 'PL', labelEn: 'Poland', labelDa: 'Polen' },
  { code: 'FI', labelEn: 'Finland', labelDa: 'Finland' },
  { code: 'NO', labelEn: 'Norway (non‑EU)', labelDa: 'Norge (ikke EU)' },
  { code: 'GB', labelEn: 'United Kingdom (non‑EU)', labelDa: 'Storbritannien (ikke EU)' },
  { code: 'US', labelEn: 'United States (non‑EU)', labelDa: 'USA (ikke EU)' },
  { code: 'OTHER', labelEn: 'Your option', labelDa: 'Din mulighed' },
]

