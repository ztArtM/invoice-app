## Release checklist (GitHub + production)

### 1) Safety / secrets

- [ ] Confirm **no `.env`** files are committed (only `.env.example`).
- [ ] Confirm no API keys/tokens are hardcoded in `src/` or `server/`.
- [ ] Verify `src/constants/appMeta.ts` has **public-safe** values:
  - [ ] `publisherName`
  - [ ] `supportEmail`
  - [ ] `effectiveDate`

### 2) Environment config (production)

- [ ] Set **`VITE_SITE_URL`** in your hosting environment (no trailing slash).
- [ ] (Optional) Set **`VITE_OG_IMAGE_URL`** to an absolute `https://...` image URL (~1200×630).
- [ ] (Optional) Set **`VITE_TWITTER_SITE`** (handle without `@`).
- [ ] (Optional) Configure Tally:
  - [ ] `VITE_TALLY_FEEDBACK_FORM_EN`
  - [ ] `VITE_TALLY_FEEDBACK_FORM_DA`
- [ ] **Vercel / CVR lookup:** set `CVRAPI_USER_AGENT` (required by CVRAPI); optional `CVRAPI_TOKEN`, `CVRAPI_VERSION`, `CORS_ALLOW_ORIGIN`.

### 3) SEO / crawlability sanity checks

- [ ] Landing page: correct title/description, indexable.
- [ ] Legal pages (`#privacy`, `#terms`, `#contact`, `#cookies`): indexable, correct titles.
- [ ] Invoice editor: `noindex, follow`.
- [ ] Verify `robots.txt` and `sitemap.xml` in the built output:
  - [ ] `dist/robots.txt` contains the correct sitemap URL.
  - [ ] `dist/sitemap.xml` contains your real production URL (not the placeholder `https://yourdomain.com`).

### 4) Build verification

- [ ] `npm ci` (or `npm install`) succeeds on a clean machine.
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run preview` and smoke-test:
  - [ ] Open landing page.
  - [ ] Open editor and export PDF.
  - [ ] Open legal pages from footer.

### 5) Hosting / deploy configuration

- [ ] Configure static hosting to serve `index.html` for unknown paths (SPA fallback).
- [ ] Enable gzip/brotli compression on the CDN/host if available.
- [ ] Verify `site.webmanifest` and `/icon.svg` (favicon) load in production.

