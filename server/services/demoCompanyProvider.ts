import type { CompanyLookupRow } from './cvrApiProvider.js'

const DEMO_CVR = '12345678'

/** Local demo row — works without CVRAPI credentials. */
export function findDemoCompanyByCvrNumber(eightDigits: string): CompanyLookupRow | null {
  if (eightDigits !== DEMO_CVR) {
    return null
  }
  return {
    companyName: 'Demo ApS (test CVR)',
    addressLine: 'Eksempelvej 1',
    postalCode: '2100',
    city: 'København Ø',
    cvrNumber: eightDigits,
  }
}
