import { CompanyLookupError, type CompanyLookupResponse } from '../../types/company'
import { requireEightDigitDanishCvr } from './validateDanishCvr'

const COMPANY_LOOKUP_PATH = '/api/company-lookup'

/**
 * Maps JSON from **your** backend route into `CompanyLookupResponse`.
 */
function mapCompanyLookupApiResponse(body: unknown): CompanyLookupResponse {
  if (!body || typeof body !== 'object') {
    throw new CompanyLookupError('Unexpected response from server.', 'bad_response')
  }
  const r = body as Record<string, unknown>
  const companyName = typeof r.companyName === 'string' ? r.companyName.trim() : ''
  const addressLine = typeof r.addressLine === 'string' ? r.addressLine.trim() : ''
  const postalCode = typeof r.postalCode === 'string' ? r.postalCode.trim() : ''
  const city = typeof r.city === 'string' ? r.city.trim() : ''
  const cvrNumber =
    typeof r.cvrNumber === 'string' ? r.cvrNumber.replace(/\D/g, '').slice(0, 8) : ''

  const hasAnything = Boolean(companyName || addressLine || postalCode || city || cvrNumber)
  if (!hasAnything) {
    throw new CompanyLookupError('No company data returned.', 'bad_response')
  }

  return { companyName, addressLine, postalCode, city, cvrNumber }
}

/**
 * Looks up a company by Danish CVR through your backend only.
 * The UI does not know which upstream CVR source the server used.
 */
export async function findCompanyByCvrNumber(rawOrEightDigits: string): Promise<CompanyLookupResponse> {
  const cvr = requireEightDigitDanishCvr(rawOrEightDigits)

  let response: Response
  try {
    response = await fetch(COMPANY_LOOKUP_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvr }),
    })
  } catch {
    throw new CompanyLookupError('Could not reach the server. Is the API running?', 'network')
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new CompanyLookupError('Unexpected response from server.', 'bad_response')
  }

  if (!response.ok) {
    const record = body as { message?: string; error?: string }
    const msg =
      typeof record.message === 'string'
        ? record.message
        : response.status === 404
          ? 'No company found for this CVR.'
          : 'Lookup failed.'
    throw new CompanyLookupError(
      msg,
      response.status === 404 ? 'not_found' : 'bad_response',
    )
  }

  const parsed = mapCompanyLookupApiResponse(body)
  return { ...parsed, cvrNumber: parsed.cvrNumber || cvr }
}
