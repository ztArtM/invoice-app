/**
 * JSON-LD for search engines. Renders in the React tree (body); keep payloads truthful.
 *
 * Trust: `data` must be app-owned (e.g. built in SeoManager from routes/constants), not raw user input.
 * We serialize with JSON-LD-safe escaping for the HTML script context.
 */
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function StructuredData({ id, data }: { id: string; data: unknown }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      data-app-seo="jsonld"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
