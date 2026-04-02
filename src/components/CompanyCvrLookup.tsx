import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { TranslationMessages } from '../constants/translations'
import {
  CompanyLookupError,
  findCompanyByCvrNumber,
  formatAddressForInvoice,
} from '../services/companyLookup'
import { isValidCvrForLookup, normalizeCvrInput } from '../utils/cvrInput'
import { secondaryButtonClassName } from './invoice/buttonStyles'
import { formInputClassName, formLabelClassName } from './invoice/formFieldClassNames'

type LookupUiState = 'idle' | 'loading' | 'success' | 'not_found' | 'error'

type FormCopy = TranslationMessages['form']

function InlineSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`-ml-0.5 mr-2 size-4 shrink-0 animate-spin text-current ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export interface CompanyCvrLookupProps {
  formMessages: FormCopy
  cvrNumber: string
  onCvrDigitsChange: (digits: string) => void
  /** Merges lookup result into the party (name, address, CVR). */
  onLookupSuccess: (fields: { name: string; address: string; cvrNumber: string }) => void
  /** Used for stable `id` / `aria-describedby`, e.g. `client` → `client-cvr`. */
  idPrefix: 'client' | 'seller'
  hintText: string
}

export function CompanyCvrLookup({
  formMessages: fm,
  cvrNumber,
  onCvrDigitsChange,
  onLookupSuccess,
  idPrefix,
  hintText,
}: CompanyCvrLookupProps) {
  const [lookupState, setLookupState] = useState<LookupUiState>('idle')
  const [lookupMessage, setLookupMessage] = useState('')

  const inputId = `${idPrefix}-cvr`
  const hintId = `${idPrefix}-cvr-hint`

  const resetFeedback = () => {
    setLookupState('idle')
    setLookupMessage('')
  }

  const handleCvrChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = normalizeCvrInput(event.target.value)
    onCvrDigitsChange(digits)
    resetFeedback()
  }

  const handleFindCompany = async () => {
    if (!isValidCvrForLookup(cvrNumber)) {
      setLookupState('error')
      setLookupMessage(fm.cvrInvalidForLookup)
      return
    }
    setLookupState('loading')
    setLookupMessage('')
    try {
      const company = await findCompanyByCvrNumber(cvrNumber)
      const address = formatAddressForInvoice(company)
      onLookupSuccess({
        name: company.companyName,
        address,
        cvrNumber: company.cvrNumber || cvrNumber,
      })
      setLookupState('success')
      setLookupMessage(fm.cvrLookupSuccess)
    } catch (error) {
      if (error instanceof CompanyLookupError && error.code === 'not_found') {
        setLookupState('not_found')
        setLookupMessage(fm.cvrLookupNotFound)
        return
      }
      setLookupState('error')
      if (error instanceof CompanyLookupError && error.code === 'network') {
        setLookupMessage(`${error.message} ${fm.cvrNetworkHint}`)
      } else if (error instanceof CompanyLookupError) {
        setLookupMessage(error.message)
      } else {
        setLookupMessage(fm.cvrLookupFailed)
      }
    }
  }

  const canLookup = isValidCvrForLookup(cvrNumber) && lookupState !== 'loading'

  const showAlert =
    lookupState === 'error' || lookupState === 'not_found' ? Boolean(lookupMessage) : false
  const showSuccess = lookupState === 'success' && Boolean(lookupMessage)

  return (
    <div>
      <label htmlFor={inputId} className={formLabelClassName}>
        {fm.cvrLabel}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          placeholder="12345678"
          className={`${formInputClassName} flex-1 tabular-nums`}
          value={cvrNumber}
          onChange={handleCvrChange}
          aria-describedby={hintId}
          aria-invalid={lookupState === 'error'}
        />
        <button
          type="button"
          className={`${secondaryButtonClassName} inline-flex w-full shrink-0 items-center justify-center sm:w-auto`}
          disabled={!canLookup}
          aria-busy={lookupState === 'loading'}
          onClick={handleFindCompany}
        >
          {lookupState === 'loading' ? (
            <>
              <InlineSpinner />
              {fm.cvrLookupLoading}
            </>
          ) : (
            fm.findCompanyCvr
          )}
        </button>
      </div>
      <p id={hintId} className="mt-2 text-xs leading-relaxed text-zinc-500">
        {hintText}
      </p>
      {showSuccess ? (
        <p className="mt-2 text-sm text-emerald-800" role="status" aria-live="polite">
          {lookupMessage}
        </p>
      ) : null}
      {showAlert && lookupMessage ? (
        <p
          className={
            lookupState === 'not_found' ? 'mt-2 text-sm text-amber-900' : 'mt-2 text-sm text-red-800'
          }
          role="alert"
        >
          {lookupMessage}
        </p>
      ) : null}
    </div>
  )
}
