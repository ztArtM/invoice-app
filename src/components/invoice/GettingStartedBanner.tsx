interface GettingStartedBannerProps {
  title: string
  tips: string[]
}

/**
 * Non-blocking checklist when the draft is still missing common fields.
 */
export function GettingStartedBanner({ title, tips }: GettingStartedBannerProps) {
  if (tips.length === 0) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50/90 to-white px-5 py-4 text-sm text-brand-950 shadow-sm shadow-brand-900/5 print:hidden"
    >
      <p className="font-semibold text-brand-900">{title}</p>
      <ul className="mt-3 list-inside list-disc space-y-1.5 leading-relaxed text-brand-900/85">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  )
}
