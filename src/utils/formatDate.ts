/**
 * Formats values from `<input type="date">` (YYYY-MM-DD) for preview / PDF only.
 * Raw strings stay in React state unchanged — call this only when displaying.
 *
 * @param rawIsoDate — Value from state, e.g. "2026-03-15" or ""
 * @param locale — BCP 47 tag from `getLocaleForLanguage`
 */
export function formatDateForDisplay(rawIsoDate: string, locale: string): string {
  const trimmed = rawIsoDate.trim()
  if (!trimmed) {
    return ''
  }

  const normalized = trimmed.includes('T') ? trimmed : `${trimmed}T12:00:00`
  const parsed = new Date(normalized)
  if (Number.isNaN(parsed.getTime())) {
    return trimmed
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}
