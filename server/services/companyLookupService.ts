/**
 * Application service: `findCompanyByCvrNumber`.
 * The HTTP route calls only this — it does not know how CVRAPI.dk is queried.
 */

import { type CompanyLookupRow, findCompanyUsingCvrapiRest } from './cvrApiProvider.js'
import { findDemoCompanyByCvrNumber } from './demoCompanyProvider.js'

function isDemoLookupEnabled(): boolean {
  const v = process.env.CVRAPI_DEMO?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

export async function findCompanyByCvrNumber(eightDigits: string): Promise<CompanyLookupRow | null> {
  if (isDemoLookupEnabled()) {
    const demoRow = findDemoCompanyByCvrNumber(eightDigits)
    if (demoRow) {
      return demoRow
    }
  }

  try {
    const row = await findCompanyUsingCvrapiRest(eightDigits)
    if (row) {
      return row
    }
  } catch {
    /* treat as not found */
  }

  return null
}
