/**
 * Shared POST /api/company-lookup logic — used by the local dev server and Vercel serverless.
 */

import { findCompanyByCvrNumber } from '../services/companyLookupService.js'
import type { CompanyLookupRow } from '../services/cvrApiProvider.js'

export function normaliseCvrDigits(raw: unknown): string {
  return String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, 8)
}

export function parseJsonBodyToPayload(
  body: string,
  maxBytes = 4096,
): { ok: true; payload: unknown } | { ok: false; reason: 'invalid_json' | 'too_large' } {
  if (body.length > maxBytes) {
    return { ok: false, reason: 'too_large' }
  }
  try {
    return { ok: true, payload: JSON.parse(body || '{}') }
  } catch {
    return { ok: false, reason: 'invalid_json' }
  }
}

export type CompanyLookupPostResult =
  | { status: 200; body: CompanyLookupRow }
  | { status: 400; body: { error: string; message: string } }
  | { status: 404; body: { error: string; message: string } }
  | { status: 500; body: { error: string; message: string } }

export async function runCompanyLookupFromPayload(payload: unknown): Promise<CompanyLookupPostResult> {
  const record = payload as { cvr?: unknown }
  const digits = normaliseCvrDigits(record.cvr)
  if (digits.length !== 8) {
    return {
      status: 400,
      body: { error: 'invalid_cvr', message: 'CVR must be exactly 8 digits.' },
    }
  }

  try {
    const company = await findCompanyByCvrNumber(digits)
    if (!company) {
      return {
        status: 404,
        body: { error: 'not_found', message: 'No company found for this CVR.' },
      }
    }
    return { status: 200, body: company }
  } catch (err) {
    console.error('[company-lookup]', err)
    return { status: 500, body: { error: 'server_error', message: 'Lookup failed.' } }
  }
}
