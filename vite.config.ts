import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

  let outDir = 'dist'

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'seo-sitemap-and-robots',
        configResolved(config) {
          outDir = config.build.outDir
        },
        closeBundle() {
          const out = resolve(__dirname, outDir)
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
          const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
          writeFileSync(resolve(out, 'sitemap.xml'), sitemap, 'utf8')
          writeFileSync(resolve(out, 'robots.txt'), robots, 'utf8')
        },
      },
    ],
    server: {
      proxy: {
        // Proxies to `npm run dev:api` (see server/api/company-lookup.ts). Safe to leave on if API is off—lookups will fail until you start it.
        '/api': {
          target: 'http://127.0.0.1:8787',
          changeOrigin: true,
          configure(proxy) {
            proxy.on('error', (err: NodeJS.ErrnoException) => {
              if (err.code === 'ECONNREFUSED') {
                console.warn(
                  '\n[Vite] Nothing is listening on :8787 — CVR lookup will fail. In another terminal run: npm run dev:api\n' +
                    '   Or start both together: npm run dev:with-api\n',
                )
              }
            })
          },
        },
      },
    },
  }
})
