/**
 * Maps UI language choices to BCP 47 locale tags used by `Intl` (dates + currency).
 * Language (UI copy) and locale (formatting) are related but not the same thing:
 * you can add a language later without changing how numbers look, by editing this file.
 */
import type { InvoiceDocument } from '../types/invoiceDocument'
import type { Language } from './translations'

/** Invoice amounts can be shown in one of these ISO 4217 codes (dropdown + Intl). */
export type SupportedCurrencyCode = 'DKK' | 'EUR'

/** All supported codes in display order (e.g. for a `<select>`). */
export const SUPPORTED_CURRENCY_CODES: readonly SupportedCurrencyCode[] = ['DKK', 'EUR']

/** Which locale `Intl` should use for each app language. */
export const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: 'en-GB',
  da: 'da-DK',
}

/** Looks up the locale string for the current UI language. */
export function getLocaleForLanguage(language: Language): string {
  return LOCALE_BY_LANGUAGE[language]
}

export function isSupportedCurrencyCode(value: string): value is SupportedCurrencyCode {
  const upper = value.trim().toUpperCase()
  return (SUPPORTED_CURRENCY_CODES as readonly string[]).includes(upper)
}

/**
 * If the stored invoice has an old/unknown code (e.g. "GBP"), we fall back to EUR
 * so `Intl` always receives a supported currency.
 */
export function normalizeToSupportedCurrencyCode(code: string): SupportedCurrencyCode {
  const upper = code.trim().toUpperCase()
  if (isSupportedCurrencyCode(upper)) {
    return upper
  }
  return 'EUR'
}

/**
 * Short symbol stored on the document for backwards compatibility and drafts.
 * Real formatting uses `formatCurrencyAmount` + `SupportedCurrencyCode`.
 */
export function defaultSymbolForCurrencyCode(code: SupportedCurrencyCode): string {
  const symbols: Record<SupportedCurrencyCode, string> = {
    DKK: 'kr.',
    EUR: '€',
  }
  return symbols[code]
}

/** After loading a draft, force currency to one of the supported codes (safe for Intl + dropdown). */
export function normalizeInvoiceCurrency(invoice: InvoiceDocument): InvoiceDocument {
  const code = normalizeToSupportedCurrencyCode(invoice.currency.code)
  return {
    ...invoice,
    currency: { code, symbol: defaultSymbolForCurrencyCode(code) },
  }
}
