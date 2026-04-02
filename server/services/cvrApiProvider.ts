/**
 * CVRAPI **Version 6** (public search API) — server-only.
 *
 * Base URL: `https://cvrapi.dk/api` (GET or POST)
 * Required query params: `search`, `country`
 * Optional: `version`, `format` (json/xml), `token` (default literal `YOUR_TOKEN` like the docs; override via `CVRAPI_TOKEN` when you have a real token)
 * Optional search modes (use at most one): `vat`, `name`, `produ`, `phone`
 *
 * For a lookup by Danish CVR number we set `search` to the 8 digits and `country=dk`.
 * Do **not** add `vat` **and** `search` together — the API returns `TOO_MANY_OPTIONS`
 * (“only one option at a time”).
 *
 * @see https://cvrapi.dk/documentation
 */

const VERSION_6_API = 'https://cvrapi.dk/api'

export type CompanyLookupRow = {
  companyName: string
  addressLine: string
  postalCode: string
  city: string
  cvrNumber: string
}

/**
 * Maps Version 6 JSON to our internal row.
 * On errors the API often returns `{ "error": "NOT_FOUND" | "QUOTA_EXCEEDED" | ... }`.
 */
export function mapExternalCompanyResponse(data: unknown, eightDigits: string): CompanyLookupRow | null {
  if (!data || typeof data !== 'object') {
    return null
  }
  const row = data as Record<string, unknown>
  if (typeof row.error === 'string' && row.error.length > 0) {
    return null
  }

  const companyName = typeof row.name === 'string' ? row.name.trim() : ''
  const addressLine = typeof row.address === 'string' ? row.address.trim() : ''
  const postalCode =
    row.zipcode === undefined || row.zipcode === null ? '' : String(row.zipcode).trim()
  const cityRaw = typeof row.city === 'string' ? row.city.trim() : ''
  const cityNameAlt = typeof row.cityname === 'string' ? row.cityname.trim() : ''
  const city = cityRaw || cityNameAlt

  if (!companyName && !addressLine && !postalCode && !city) {
    return null
  }

  return {
    companyName,
    addressLine,
    postalCode,
    city,
    cvrNumber: eightDigits,
  }
}

/**
 * Same shape as pasting in the browser:
 * `https://cvrapi.dk/api?search=<cvr>&country=dk&format=json&token=YOUR_TOKEN`
 * Only `search` comes from the user. Token defaults to the literal string `YOUR_TOKEN`;
 * set `CVRAPI_TOKEN` when CVRAPI gives you a real token.
 */
function buildVersion6LookupUrl(eightDigits: string): string {
  const params = new URLSearchParams()
  params.set('search', eightDigits)
  params.set('country', 'dk')
  params.set('format', 'json')
  params.set('token', /*process.env.CVRAPI_TOKEN?.trim() ||*/ 'YOUR_TOKEN')

  const version = process.env.CVRAPI_VERSION?.trim()
  if (version) {
    params.set('version', version)
  }

  return `${VERSION_6_API}?${params.toString()}`
}

function redactUrlForLog(url: string): string {
  return url.replace(/token=[^&]*/i, 'token=(redacted)')
}

function isDebugCvr(): boolean {
  const v = process.env.DEBUG_CVRAPI?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

/**
 * HTTP headers must be ISO-8859-1 / ByteString. Node's fetch throws if `User-Agent`
 * contains characters above U+00FF (e.g. em dash, smart quotes).
 */
function sanitizeHeaderByteString(value: string, fallback: string): string {
  let out = ''
  for (const ch of value) {
    const code = ch.charCodeAt(0)
    if (code <= 0xff) {
      out += ch
    }
  }
  const trimmed = out.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

/**
 * Live lookup via CVRAPI.dk Version 6.
 * Set `CVRAPI_USER_AGENT` to a descriptive ASCII string (company + project + contact).
 * Set `DEBUG_CVRAPI=1` to log URL (token redacted), HTTP status, and API `error` codes.
 */
export async function findCompanyUsingCvrapiRest(eightDigits: string): Promise<CompanyLookupRow | null> {
  const defaultUa =
    'invoice-app-dev/1.0 (set CVRAPI_USER_AGENT with your company, project, contact - see cvrapi.dk)'
  const userAgent = sanitizeHeaderByteString(
    process.env.CVRAPI_USER_AGENT?.trim() ?? '',
    defaultUa,
  )

  const url = buildVersion6LookupUrl(eightDigits)
  if (isDebugCvr()) {
    console.log('[CVRAPI] GET', redactUrlForLog(url))
  }

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
    })
  } catch (err) {
    if (isDebugCvr()) {
      console.warn('[CVRAPI] fetch failed:', err)
    }
    return null
  }

  if (isDebugCvr()) {
    console.log('[CVRAPI] HTTP status:', res.status)
  }

  if (!res.ok) {
    if (isDebugCvr()) {
      console.warn('[CVRAPI] Non-OK response; body not parsed as success JSON.')
    }
    return null
  }

  let raw: unknown
  try {
    raw = await res.json()
  } catch {
    if (isDebugCvr()) {
      console.warn('[CVRAPI] Response was not valid JSON.')
    }
    return null
  }

  const mapped = mapExternalCompanyResponse(raw, eightDigits)
  if (!mapped && isDebugCvr()) {
    if (raw && typeof raw === 'object' && 'error' in raw) {
      const err = (raw as Record<string, unknown>).error
      console.warn('[CVRAPI] API returned error field:', err)
    } else {
      console.warn(
        '[CVRAPI] Mapped empty row (missing name/address/zip/city?) — compare with browser GET for same search+country.',
      )
    }
  }

  return mapped
}
