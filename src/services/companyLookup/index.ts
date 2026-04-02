/**
 * Company lookup (browser).
 *
 * Call `findCompanyByCvrNumber` — it only talks to `/api/company-lookup`.
 * Which CVR provider the server uses is opaque to this layer.
 */

export type {
  CompanyLookupErrorCode,
  CompanyLookupResponse,
  CompanyLookupResult,
} from './types'
export { CompanyLookupError } from './types'
export { findCompanyByCvrNumber } from './findCompanyByCvrNumber'
export { formatAddressForInvoice } from './formatAddressForInvoice'
export {
  isDanishCvrReadyForLookup,
  requireEightDigitDanishCvr,
  sanitizeDanishCvrInput,
} from './validateDanishCvr'
