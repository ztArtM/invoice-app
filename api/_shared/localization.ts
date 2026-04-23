import type { Language, SupportedCurrencyCode } from './invoiceTypes.js'

export function getLocaleForLanguage(language: Language): string {
  return language === 'da' ? 'da-DK' : 'en-GB'
}

export function normalizeToSupportedCurrencyCode(code: string): SupportedCurrencyCode {
  const upper = code.trim().toUpperCase()
  if (upper === 'DKK' || upper === 'EUR') return upper
  return 'EUR'
}

