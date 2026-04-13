/** Strip non-digits; keep at most 8 (Danish CVR length). */
export function normalizeCvrInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 8)
}
