/**
 * Workspace & form buttons — shared heights and focus rings for a consistent hierarchy:
 * - Primary: main task (e.g. Download PDF)
 * - Secondary: supporting actions (Print, outline)
 * - Tertiary: low-emphasis (Duplicate, Reset, language-adjacent controls)
 * - Form add-line: dashed, distinct from toolbar
 */

const focusRingBrand =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800'

const focusRingZinc =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400'

const disabledOpacity = 'disabled:pointer-events-none disabled:opacity-45'

/** Base shell: same min height and padding scale everywhere. */
const buttonShell = `inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm transition-colors ${disabledOpacity}`

/** Main call to action — solid brand blue. */
export const primaryButtonClassName = `${buttonShell} bg-brand-800 px-4 py-2.5 font-semibold text-white shadow-sm shadow-brand-950/15 hover:bg-brand-700 active:bg-brand-950 ${focusRingBrand}`

/** Stronger emphasis for the top toolbar PDF action (full width on small screens). */
export const toolbarPrimaryButtonClassName = `${buttonShell} w-full bg-brand-800 px-5 py-2.5 font-semibold text-white shadow-md shadow-brand-950/20 ring-1 ring-white/15 hover:bg-brand-700 active:bg-brand-950 sm:w-auto sm:px-5 ${focusRingBrand}`

/** Outline — Print, secondary exports. Softer label color than primary; same weight to avoid layout shift on hover. */
export const secondaryButtonClassName = `${buttonShell} border border-zinc-200/90 bg-white py-2.5 font-medium text-zinc-500 shadow-none hover:border-zinc-300 hover:bg-white hover:text-zinc-800 active:bg-zinc-100 ${focusRingZinc}`

/**
 * Wraps Print + Download PDF so they scan as one “export” cluster (tinted tray, subtle ring).
 */
export const toolbarExportGroupClassName =
  'flex w-full flex-col gap-2 rounded-xl bg-zinc-100/80 p-2 ring-1 ring-zinc-200/80 sm:w-auto sm:flex-row sm:items-stretch sm:gap-2 sm:p-1.5'

/** Text-first — Duplicate, Reset; stays tappable (min-h-11). */
export const tertiaryButtonClassName = `${buttonShell} border border-transparent bg-transparent px-3 py-2 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200/80 ${focusRingZinc}`

/** @deprecated Use secondaryButtonClassName — kept for minimal import churn. */
export const toolbarButtonClassName = secondaryButtonClassName

export const formSecondaryButtonClassName = secondaryButtonClassName

/** Full-width on small screens; dashed so it does not compete with toolbar primary. */
export const formAddLineButtonClassName = `${buttonShell} w-full border-2 border-dashed border-zinc-300 bg-white py-2.5 font-semibold text-zinc-700 shadow-sm hover:border-accent-500 hover:bg-accent-400/10 hover:text-brand-900 sm:w-auto ${focusRingBrand}`
