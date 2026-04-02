/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** English feedback form: full `https://tally.so/r/...` URL or raw form id */
  readonly VITE_TALLY_FEEDBACK_FORM_EN?: string
  /** Danish feedback form: full URL or raw form id */
  readonly VITE_TALLY_FEEDBACK_FORM_DA?: string
  /** Optional; defaults to `0.0.0` in code if unset */
  readonly VITE_APP_VERSION?: string
  /**
   * Production site origin for canonical URLs, Open Graph, sitemap, and JSON-LD (no trailing slash).
   * Example: https://faktura.example.com
   */
  readonly VITE_SITE_URL?: string
  /** Optional absolute URL to a PNG/JPG/WebP (1200×630 recommended) for og:image and Twitter */
  readonly VITE_OG_IMAGE_URL?: string
  /** Optional Twitter @handle without @ for twitter:site */
  readonly VITE_TWITTER_SITE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
