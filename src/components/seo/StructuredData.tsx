/**
 * JSON-LD for search engines. Renders in the React tree (body); keep payloads truthful.
 */
export function StructuredData({ id, data }: { id: string; data: unknown }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      data-app-seo="jsonld"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
