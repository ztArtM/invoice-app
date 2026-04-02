/** Danish bank registration no. (reg.nr.): exactly four digits. */
export const REGISTRATION_NUMBER_MAX_DIGITS = 4

/** Domestic account number: exactly ten digits. */
export const ACCOUNT_NUMBER_MAX_DIGITS = 10

/** Strip non-digits; keep at most four (registration number). */
export function normalizeRegistrationNumberDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, REGISTRATION_NUMBER_MAX_DIGITS)
}

/** Strip non-digits; keep at most ten (account number). */
export function normalizeAccountNumberDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, ACCOUNT_NUMBER_MAX_DIGITS)
}
