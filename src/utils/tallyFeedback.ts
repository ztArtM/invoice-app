import type { Language } from '../constants/translations'
import type { InvoiceDocument } from '../types/invoiceDocument'

const APP_VERSION = import.meta.env.VITE_APP_VERSION?.trim() || '0.0.0'

const TALLY_EMBED_BASE = 'https://tally.so/embed'
const TALLY_SHARE_BASE = 'https://tally.so/r'

/** Default Tally form ids — override via `VITE_TALLY_*` env vars (`parseTallyFormRef`). */
const TALLY_FORM_DEFAULTS = {
  feedback: { en: 'XxY4d4', da: 'ODY7qK' },
  pdfDownload: { en: 'ODYy1g', da: '818515' },
} as const

/**
 * Extracts the Tally form id from a full URL (`.../r/xyz`, `.../embed/xyz`) or returns a bare id.
 * Returns `null` if the value cannot be parsed.
 */
export function parseTallyFormRef(raw: string | undefined): string | null {
  const t = raw?.trim()
  if (!t) return null
  const fromUrl = t.match(/tally\.so\/(?:r|embed|forms)\/([^/?#]+)/i)
  if (fromUrl?.[1]) return fromUrl[1]
  if (/^[a-zA-Z0-9_-]+$/.test(t)) return t
  return null
}

/**
 * Picks the form id for the active UI language. Danish uses the DA form when set; otherwise falls back to EN.
 * Unknown language defaults to English-style resolution (EN first, then DA).
 */
export function getTallyFormIdForLanguage(lang: Language): string | null {
  const idEn =
    parseTallyFormRef(import.meta.env.VITE_TALLY_FEEDBACK_FORM_EN) ?? TALLY_FORM_DEFAULTS.feedback.en
  const idDa =
    parseTallyFormRef(import.meta.env.VITE_TALLY_FEEDBACK_FORM_DA) ?? TALLY_FORM_DEFAULTS.feedback.da
  if (lang === 'da') {
    return idDa ?? idEn ?? null
  }
  return idEn ?? idDa ?? null
}

export function isTallyFeedbackConfigured(lang: Language): boolean {
  return getTallyFormIdForLanguage(lang) !== null
}

/** Context passed as Tally URL query parameters (hidden / prefill fields — names must match the Tally form). */
export function buildFeedbackContext(
  invoice: InvoiceDocument,
  language: Language,
): Record<string, string> {
  const w = typeof window !== 'undefined' ? window : null
  const notes = invoice.notes ?? ''
  const invoiceNo = invoice.invoiceNumber?.trim() ?? ''
  const printMode =
    w && typeof w.matchMedia === 'function' && w.matchMedia('print').matches ? 'print' : 'screen'

  return {
    lang: language,
    route: w ? `${w.location.pathname}${w.location.hash || ''}` : '',
    invoiceId: invoiceNo,
    itemCount: String(invoice.lineItems?.length ?? 0),
    notesLength: String(notes.length),
    printMode,
    screenWidth: w ? String(w.innerWidth) : '',
    screenHeight: w ? String(w.innerHeight) : '',
    appVersion: APP_VERSION,
  }
}

function appendFeedbackParams(baseUrl: string, invoice: InvoiceDocument, language: Language): string {
  const ctx = buildFeedbackContext(invoice, language)
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(ctx)) {
    if (value !== undefined && value !== null) {
      params.append(key, value)
    }
  }
  const q = params.toString()
  return q ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${q}` : baseUrl
}

/** Embeddable form URL (iframe). */
export function buildTallyFeedbackEmbedUrl(lang: Language, invoice: InvoiceDocument): string | null {
  const id = getTallyFormIdForLanguage(lang)
  if (!id) return null
  return appendFeedbackParams(`${TALLY_EMBED_BASE}/${encodeURIComponent(id)}`, invoice, lang)
}

/** Same form in “share” form (e.g. new tab fallback). */
export function buildTallyFeedbackShareUrl(lang: Language, invoice: InvoiceDocument): string | null {
  const id = getTallyFormIdForLanguage(lang)
  if (!id) return null
  return appendFeedbackParams(`${TALLY_SHARE_BASE}/${encodeURIComponent(id)}`, invoice, lang)
}

function getTallyPdfDownloadFormIdForLanguage(lang: Language): string {
  return lang === 'da' ? TALLY_FORM_DEFAULTS.pdfDownload.da : TALLY_FORM_DEFAULTS.pdfDownload.en
}

/** Post–PDF-download survey (embed). */
export function buildTallyPdfDownloadEmbedUrl(lang: Language, invoice: InvoiceDocument): string {
  const id = getTallyPdfDownloadFormIdForLanguage(lang)
  return appendFeedbackParams(`${TALLY_EMBED_BASE}/${encodeURIComponent(id)}`, invoice, lang)
}

/** Post–PDF-download survey (share / new tab). */
export function buildTallyPdfDownloadShareUrl(lang: Language, invoice: InvoiceDocument): string {
  const id = getTallyPdfDownloadFormIdForLanguage(lang)
  return appendFeedbackParams(`${TALLY_SHARE_BASE}/${encodeURIComponent(id)}`, invoice, lang)
}

/** True when `url` is a safe https Tally origin (embed / share). */
export function isAllowedTallyUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && (u.hostname === 'tally.so' || u.hostname === 'www.tally.so')
  } catch {
    return false
  }
}
