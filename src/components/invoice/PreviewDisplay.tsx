/**
 * Tiny read-only helpers for the invoice preview (empty values render nothing).
 * Kept separate so InvoicePreview stays focused on layout.
 */

/** Single-line value; nothing when empty. Wraps safely inside flex/grid (long IDs, URLs, etc.). */
export function PreviewText({ value }: { value: string }) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  return (
    <span className="min-w-0 [overflow-wrap:anywhere] [word-break:break-word]">{trimmed}</span>
  )
}

/** Multi-line address from the form textarea. */
export function PreviewAddress({ value }: { value: string }) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  return (
    <p className="whitespace-pre-line break-words text-sm leading-relaxed text-zinc-700 [overflow-wrap:anywhere]">
      {trimmed}
    </p>
  )
}
