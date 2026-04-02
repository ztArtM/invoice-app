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
      className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-sky-50/50 px-5 py-4 text-sm text-blue-950 shadow-sm shadow-blue-900/5 print:hidden"
    >
      <p className="font-semibold text-blue-900">{title}</p>
      <ul className="mt-3 list-inside list-disc space-y-1.5 leading-relaxed text-blue-900/85">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  )
}
