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
  const siteUrl = (env.VITE_SITE_URL || 'https://yourdomain.com').replace(/\/$/, '')

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
