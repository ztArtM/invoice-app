/**
 * Local dev API: `POST /api/company-lookup` → CVRAPI (via `findCompanyByCvrNumber`).
 * Run: npm run dev:api  (port 8787; Vite proxies `/api` here.)
 * Production: same route is served by `api/company-lookup.ts` on Vercel.
 */

import http from 'node:http'
import {
  parseJsonBodyToPayload,
  runCompanyLookupFromPayload,
} from '../lib/companyLookupPostHandler.js'

const PORT = parseInt(process.env.CVR_DEV_API_PORT ?? '8787', 10)

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST' || req.url !== '/api/company-lookup') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'not_found', message: 'Not found.' }))
    return
  }

  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > 4096) break
  }

  const parsed = parseJsonBodyToPayload(body, 4096)
  if (!parsed.ok) {
    if (parsed.reason === 'too_large') {
      res.writeHead(413, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'payload_too_large', message: 'Request body too large.' }))
      return
    }
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'bad_request', message: 'Invalid JSON body.' }))
    return
  }

  const result = await runCompanyLookupFromPayload(parsed.payload)
  res.writeHead(result.status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result.body))
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use (another dev:api may be running). Stop that process, or pick another port, e.g.:\n` +
        `  PowerShell: $env:CVR_DEV_API_PORT=8788; npm run dev:api\n` +
        `  bash:       CVR_DEV_API_PORT=8788 npm run dev:api`,
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Company lookup API at http://127.0.0.1:${PORT}/api/company-lookup`)
  console.log('')
  console.log('CVR lookup checklist (dev):')
  console.log('  1. Run Vite with proxy to this port (npm run dev:with-api) or match vite.config.ts /api target.')
  console.log('  2. Restart this server after code or env changes.')
  console.log('  3. Set CVRAPI_USER_AGENT (ASCII) — see .env.example and cvrapi.dk documentation.')
  console.log('  4. If lookups fail with no data, check quota (QUOTA_EXCEEDED); set DEBUG_CVRAPI=1 for logs.')
  console.log('  5. URL shape: search + country=dk + format=json (do not combine search with vat param).')
  console.log('')
  console.log('Optional: DEBUG_CVRAPI=1  Optional: CVRAPI_TOKEN, CVRAPI_VERSION')
})
