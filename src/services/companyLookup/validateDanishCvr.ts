import { CompanyLookupError } from '../../types/company'
import { EIGHT_DIGIT_CVR_REGEX, isValidCvrForLookup, normalizeCvrInput } from '../../utils/cvrInput'

/** Strips non-digits and caps length (for inputs). */
export function sanitizeDanishCvrInput(raw: string): string {
  return normalizeCvrInput(raw)
}

/** True when the string is exactly 8 digits (before calling the API). */
export function isDanishCvrReadyForLookup(digits: string): boolean {
  return isValidCvrForLookup(digits)
}

/**
 * Use before a network call: throws `CompanyLookupError` with code `invalid_cvr` if not 8 digits.
 */
export function requireEightDigitDanishCvr(rawOrDigits: string): string {
  const digits = normalizeCvrInput(rawOrDigits)
  if (!EIGHT_DIGIT_CVR_REGEX.test(digits)) {
    throw new CompanyLookupError('CVR must be exactly 8 digits.', 'invalid_cvr')
  }
  return digits
}
