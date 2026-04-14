import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSitemapXml } from './scripts/buildSitemapXml.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const viteSiteUrl = env.VITE_SITE_URL?.trim()
  // Sitemap/robots are generated at build time; they must use your public origin when set.
  // Local `vite build` without .env falls back to the dev origin so artifacts remain buildable.
  const siteUrl = (viteSiteUrl || 'http://localhost:5173').replace(/\/$/, '')

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
          if (mode === 'production' && !viteSiteUrl) {
            const lines = [
              '[vite][seo] Production build: VITE_SITE_URL is not set.',
              '  dist/sitemap.xml and dist/robots.txt will use http://localhost:5173 as the site origin.',
              '  Set VITE_SITE_URL in your hosting env (e.g. Vercel) or .env.production — see .env.example.',
            ]
            console.warn(`\n${lines.join('\n')}\n`)
            const ci = process.env.CI === 'true' || process.env.CI === '1'
            if (ci) {
              throw new Error(
                '[vite][seo] Refusing to emit sitemap/robots with a localhost origin in CI. Set VITE_SITE_URL.',
              )
            }
          }
          const out = resolve(__dirname, outDir)
          const sitemap = buildSitemapXml({ siteUrl })
          const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
          writeFileSync(resolve(out, 'sitemap.xml'), sitemap, 'utf8')
          writeFileSync(resolve(out, 'robots.txt'), robots, 'utf8')
        },
      },
    ],
  }
})
