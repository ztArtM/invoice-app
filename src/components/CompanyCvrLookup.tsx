import type { ChangeEvent } from 'react'
import type { TranslationMessages } from '../constants/translations'
import { normalizeCvrInput } from '../utils/cvrInput'
import { openCvrSearch } from '../utils/openCvrSearch'
import { secondaryButtonClassName } from './invoice/buttonStyles'
import { formInputClassName, formLabelClassName } from './invoice/formFieldClassNames'

type FormCopy = TranslationMessages['form']

export interface CompanyCvrLookupProps {
  formMessages: FormCopy
  cvrNumber: string
  onCvrDigitsChange: (digits: string) => void
  /** Used for stable `id`, e.g. `client` → `client-cvr`. */
  idPrefix: 'client' | 'seller'
}

export function CompanyCvrLookup({
  formMessages: fm,
  cvrNumber,
  onCvrDigitsChange,
  idPrefix,
}: CompanyCvrLookupProps) {
  const inputId = `${idPrefix}-cvr`

  const handleCvrChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = normalizeCvrInput(event.target.value)
    onCvrDigitsChange(digits)
  }

  const handleOpenCvrSearch = () => {
    openCvrSearch(cvrNumber)
  }

  return (
    <div>
      <label htmlFor={inputId} className={formLabelClassName}>
        {fm.cvrLabel}
      </label>
      <p className="mt-1.5 max-w-prose text-sm leading-snug text-zinc-600">{fm.cvrRegisterHelperText}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          className={`${formInputClassName} w-[min(100%,11rem)] max-w-[11rem] shrink-0 tabular-nums`}
          value={cvrNumber}
          onChange={handleCvrChange}
        />
        <button
          type="button"
          className={`${secondaryButtonClassName} inline-flex w-full shrink-0 items-center justify-center text-center sm:w-auto`}
          onClick={handleOpenCvrSearch}
        >
          {fm.findCompanyCvr}
        </button>
      </div>
    </div>
  )
}
