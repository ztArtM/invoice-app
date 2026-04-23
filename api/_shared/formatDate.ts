export function formatDateForDisplay(rawIsoDate: string, locale: string): string {
  const trimmed = rawIsoDate.trim()
  if (!trimmed) return ''

  const normalized = trimmed.includes('T') ? trimmed : `${trimmed}T12:00:00`
  const parsed = new Date(normalized)
  if (Number.isNaN(parsed.getTime())) return trimmed

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

