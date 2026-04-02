/** Danish CVR for lookup: exactly eight digits, no spaces. */
export const EIGHT_DIGIT_CVR_REGEX = /^\d{8}$/

/** Strip non-digits; keep at most 8 (Danish CVR length). */
export function normalizeCvrInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 8)
}

/** True when exactly 8 digits (valid before lookup). */
export function isValidCvrForLookup(digits: string): boolean {
  return EIGHT_DIGIT_CVR_REGEX.test(digits)
}
