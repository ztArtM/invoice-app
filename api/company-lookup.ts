/**
 * Vercel Serverless Function: POST /api/company-lookup
 * Set CVRAPI_USER_AGENT (and optionally CVRAPI_TOKEN) in the Vercel project env.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  parseJsonBodyToPayload,
  runCompanyLookupFromPayload,
} from '../server/lib/companyLookupPostHandler.js'

function setCors(res: VercelResponse): void {
  const allow = process.env.CORS_ALLOW_ORIGIN?.trim() || '*'
  res.setHeader('Access-Control-Allow-Origin', allow)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function resolvePayload(req: VercelRequest): { ok: true; payload: unknown } | { ok: false; status: number; body: object } {
  const raw = req.body

  if (raw === undefined || raw === null) {
    return { ok: true, payload: {} }
  }

  if (typeof raw === 'string') {
    const parsed = parseJsonBodyToPayload(raw, 4096)
    if (!parsed.ok) {
      if (parsed.reason === 'too_large') {
        return {
          ok: false,
          status: 413,
          body: { error: 'payload_too_large', message: 'Request body too large.' },
        }
      }
      return {
        ok: false,
        status: 400,
        body: { error: 'bad_request', message: 'Invalid JSON body.' },
      }
    }
    return { ok: true, payload: parsed.payload }
  }

  if (typeof raw === 'object') {
    return { ok: true, payload: raw }
  }

  return { ok: true, payload: {} }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(404).json({ error: 'not_found', message: 'Not found.' })
    return
  }

  const resolved = resolvePayload(req)
  if (!resolved.ok) {
    res.status(resolved.status).json(resolved.body)
    return
  }

  const result = await runCompanyLookupFromPayload(resolved.payload)
  res.status(result.status).json(result.body)
}
