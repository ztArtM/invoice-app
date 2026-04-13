/**
 * Opens Danish CVR (datacvr.virk.dk) in a new tab.
 * With a non-empty CVR string, opens the company page with search query params.
 */
export function openCvrSearch(cvr?: string): void {
  const baseUrl = 'https://datacvr.virk.dk/'
  const trimmed = typeof cvr === 'string' ? cvr.trim() : ''

  const url = trimmed
    ? `${baseUrl}enhed/virksomhed/${encodeURIComponent(trimmed)}?fritekst=${encodeURIComponent(trimmed)}&sideIndex=0&size=10`
    : baseUrl

  window.open(url, '_blank', 'noopener,noreferrer')
}
