/**
 * Application service: `findCompanyByCvrNumber`.
 * The HTTP route calls only this — it does not know how CVRAPI.dk is queried.
 */

import { type CompanyLookupRow, findCompanyUsingCvrapiRest } from './cvrApiProvider.js'
import { findDemoCompanyByCvrNumber } from './demoCompanyProvider.js'

export async function findCompanyByCvrNumber(eightDigits: string): Promise<CompanyLookupRow | null> {
  const demoRow = findDemoCompanyByCvrNumber(eightDigits)
  if (demoRow) {
    return demoRow
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
