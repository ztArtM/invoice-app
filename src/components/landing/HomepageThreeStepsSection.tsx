import type { TranslationMessages } from '../../constants/translations'

export interface HomepageThreeStepsSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

const steps = [
  { titleKey: 'homepageSteps1Title' as const, bodyKey: 'homepageSteps1Body' as const, icon: StepIconPencil },
  { titleKey: 'homepageSteps2Title' as const, bodyKey: 'homepageSteps2Body' as const, icon: StepIconEye },
  { titleKey: 'homepageSteps3Title' as const, bodyKey: 'homepageSteps3Body' as const, icon: StepIconDownload },
] as const

export function HomepageThreeStepsSection({ t }: HomepageThreeStepsSectionProps) {
  const l = t.landing

  return (
    <section className="border-b border-zinc-100 bg-white py-14 sm:py-18" aria-labelledby="homepage-steps-heading">
      <div className={shell}>
        <header className="mx-auto max-w-3xl text-center">
          <h2 id="homepage-steps-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {l.homepageStepsHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">{l.homepageStepsSubheading}</p>
        </header>

        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
          {/* subtle connector line (desktop only) */}
          <div className="pointer-events-none absolute left-6 right-6 top-12 hidden h-px bg-zinc-200/80 lg:block" aria-hidden />

          <ol className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {steps.map(({ titleKey, bodyKey, icon: Icon }, index) => (
              <li
                key={titleKey}
                className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 shadow-sm shadow-zinc-900/[0.04] ring-1 ring-zinc-950/[0.02] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white shadow-md shadow-brand-950/20"
                      aria-hidden
                    >
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{l[titleKey]}</h3>
                  </div>
                  <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-brand-800 shadow-sm sm:flex">
                    <Icon />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">{l[bodyKey]}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function StepIconPencil() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a1 1 0 0 1-.464.263l-3 1a1 1 0 0 1-1.265-1.265l1-3a1 1 0 0 1 .263-.464l8.5-8.5Z" />
      <path d="M11.379 5.793 14.207 8.62" />
    </svg>
  )
}

function StepIconEye() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 4c4.278 0 7.084 3.185 8.153 5.01a1.75 1.75 0 0 1 0 1.98C17.084 12.815 14.278 16 10 16c-4.278 0-7.084-3.185-8.153-5.01a1.75 1.75 0 0 1 0-1.98C2.916 7.185 5.722 4 10 4Zm0 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function StepIconDownload() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1 1 0 0 1-1.414 0L5.279 9.707a1 1 0 1 1 1.414-1.414L9 10.586V3a1 1 0 0 1 1-1ZM4 15a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

