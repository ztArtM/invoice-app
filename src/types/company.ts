/**
 * Normalised company row returned by `POST /api/company-lookup`.
 * Same shape no matter which CVR backend provider answered.
 */
export interface CompanyLookupResponse {
  companyName: string
  addressLine: string
  postalCode: string
  city: string
  /** Always 8 digits for Danish CVR. */
  cvrNumber: string
}

/** Alias used in older service files — same as `CompanyLookupResponse`. */
export type CompanyLookupResult = CompanyLookupResponse

export type CompanyLookupErrorCode =
  | 'invalid_cvr'
  | 'not_found'
  | 'bad_response'
  | 'network'

export class CompanyLookupError extends Error {
  code: CompanyLookupErrorCode

  constructor(message: string, code: CompanyLookupErrorCode) {
    super(message)
    this.name = 'CompanyLookupError'
    this.code = code
  }
}
