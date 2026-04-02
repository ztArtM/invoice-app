/** Shared Tailwind classes — one place to tweak form look (inputs, labels, selects). */

export const formInputClassName =
  'mt-1.5 min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 hover:border-zinc-300 focus:border-blue-700 focus:ring-[3px] focus:ring-blue-700/12'

export const formTextAreaClassName = `${formInputClassName} min-h-[5.5rem] resize-y py-3 leading-relaxed`

/** Sentence-style labels — easier to read than all-caps. */
export const formLabelClassName = 'block text-sm font-medium text-zinc-700'

/** Matches inputs so dropdowns feel like one system. */
export const formSelectClassName = formInputClassName

/** Compact select for the workspace toolbar (secondary to main actions). */
export const toolbarSelectClassName =
  'min-h-10 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm outline-none transition-[border-color,box-shadow] hover:border-zinc-300 focus:border-blue-700 focus:ring-[3px] focus:ring-blue-700/12'
