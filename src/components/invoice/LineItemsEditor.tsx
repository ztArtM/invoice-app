import type { ChangeEvent, FocusEvent } from 'react'
import { createEmptyLineItem } from '../../constants/defaultInvoiceDocument'
import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, LineItem, SetInvoiceDocument } from '../../types/invoiceDocument'
import { formatCurrencyAmount } from '../../utils/formatCurrency'
import { calculateLineItemTotal } from '../../utils/invoiceCalculations'
import { formAddLineButtonClassName } from './buttonStyles'
import { formLabelClassName } from './formFieldClassNames'

/**
 * Line items only: no padding, centered text; line-height matches height for vertical centering.
 * Rest of the form keeps standard `formInputClassName` from `formFieldClassNames`.
 */
const lineItemFieldBaseClassName =
  'mt-1.5 h-11 w-full rounded-lg border border-zinc-200 bg-white px-0 py-0 text-center text-sm leading-[2.75rem] text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 hover:border-zinc-300 focus:border-blue-700 focus:ring-[3px] focus:ring-blue-700/12'

const lineItemTextFieldClassName = lineItemFieldBaseClassName

/** Hides browser steppers so unit price is typed, not nudged with arrows. */
const lineItemUnitPriceFieldClassName = `${lineItemFieldBaseClassName} tabular-nums [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`

const lineItemQtyFieldClassName = `${lineItemFieldBaseClassName} tabular-nums`

function TrashIcon() {
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

interface LineItemsEditorProps {
  t: TranslationMessages
  localeForFormatting: string
  activeCurrencyCode: SupportedCurrencyCode
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

type LineItemEditableField = 'description' | 'quantity' | 'unitPrice'

/** Parses a number from an input; empty or invalid becomes 0 (simple default for beginners). */
function parsePositiveNumber(rawValue: string): number {
  const parsed = parseFloat(rawValue)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }
  return parsed
}

/** When the field shows 0, select all on focus so typing replaces it. */
function selectAllIfZero(event: FocusEvent<HTMLInputElement>) {
  const raw = event.target.value.trim()
  if (raw === '' || raw === '0' || Number.parseFloat(raw) === 0) {
    event.target.select()
  }
}

export function LineItemsEditor({
  t,
  localeForFormatting,
  activeCurrencyCode,
  invoiceDocument,
  setInvoiceDocument,
}: LineItemsEditorProps) {
  const li = t.lineItems

  const updateLineItemById = (
    lineItemId: string,
    fieldUpdates: Partial<Pick<LineItem, LineItemEditableField>>,
  ) => {
    setInvoiceDocument((previousInvoice) => ({
      ...previousInvoice,
      lineItems: previousInvoice.lineItems.map((lineItem) =>
        lineItem.id === lineItemId ? { ...lineItem, ...fieldUpdates } : lineItem,
      ),
    }))
  }

  const handleLineDescriptionChange =
    (lineItemId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateLineItemById(lineItemId, { description: event.target.value })
    }

  const handleLineQuantityChange =
    (lineItemId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateLineItemById(lineItemId, { quantity: parsePositiveNumber(event.target.value) })
    }

  const handleLineUnitPriceChange =
    (lineItemId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateLineItemById(lineItemId, { unitPrice: parsePositiveNumber(event.target.value) })
    }

  const handleAddLineItemClick = () => {
    const newLineItem = createEmptyLineItem()
    setInvoiceDocument((previousInvoice) => ({
      ...previousInvoice,
      lineItems: [...previousInvoice.lineItems, newLineItem],
    }))
  }

  const handleRemoveLineItemClick = (lineItemId: string) => {
    setInvoiceDocument((previousInvoice) => {
      if (previousInvoice.lineItems.length <= 1) {
        return previousInvoice
      }
      return {
        ...previousInvoice,
        lineItems: previousInvoice.lineItems.filter((lineItem) => lineItem.id !== lineItemId),
      }
    })
  }

  const canRemoveRows = invoiceDocument.lineItems.length > 1

  return (
    <section aria-label={li.sectionAriaLabel} className="space-y-4">
      <div className="space-y-4">
        {invoiceDocument.lineItems.map((lineItem, index) => {
          const lineTotal = calculateLineItemTotal(lineItem)
          const removeButtonTitle = canRemoveRows ? li.removeTitle : li.removeDisabledTitle
          const rowLabel = li.rowLabel.replace('{{n}}', String(index + 1))

          return (
            <article
              key={lineItem.id}
              className="rounded-lg border border-zinc-200/90 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <span className="text-xs font-semibold tracking-wide text-zinc-500">{rowLabel}</span>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200/90 bg-white px-2.5 py-2 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 disabled:shadow-none disabled:hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:px-3"
                  onClick={() => handleRemoveLineItemClick(lineItem.id)}
                  disabled={!canRemoveRows}
                  title={removeButtonTitle}
                  aria-label={removeButtonTitle}
                >
                  <TrashIcon />
                  <span className="hidden sm:inline">{li.remove}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={formLabelClassName} htmlFor={`line-desc-${lineItem.id}`}>
                    {li.thDescription}
                  </label>
                  <input
                    id={`line-desc-${lineItem.id}`}
                    type="text"
                    className={lineItemTextFieldClassName}
                    value={lineItem.description}
                    onChange={handleLineDescriptionChange(lineItem.id)}
                    placeholder={li.placeholder}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2.5fr_2.5fr] sm:gap-4">
                  <div className="max-w-15 sm:max-w-full">
                    <label className={formLabelClassName} htmlFor={`line-qty-${lineItem.id}`}>
                      {li.thQty}
                    </label>
                    <input
                      id={`line-qty-${lineItem.id}`}
                      type="number"
                      min={0}
                      step={1}
                      className={lineItemQtyFieldClassName}
                      value={lineItem.quantity}
                      onChange={handleLineQuantityChange(lineItem.id)}
                      onFocus={selectAllIfZero}
                    />
                  </div>
                  <div className="min-w-0">
                    <label className={formLabelClassName} htmlFor={`line-price-${lineItem.id}`}>
                      {li.thUnitPrice}
                    </label>
                    <input
                      id={`line-price-${lineItem.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      inputMode="decimal"
                      className={lineItemUnitPriceFieldClassName}
                      value={lineItem.unitPrice}
                      onChange={handleLineUnitPriceChange(lineItem.id)}
                      onFocus={selectAllIfZero}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className={formLabelClassName}>{li.thLineTotal}</span>
                    <div className="mt-1.5 flex min-h-11 w-full items-center justify-end rounded-lg bg-zinc-50/80 px-3.5 py-2.5 text-sm tabular-nums text-zinc-800">
                      {formatCurrencyAmount(lineTotal, activeCurrencyCode, localeForFormatting)}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        className={formAddLineButtonClassName}
        onClick={handleAddLineItemClick}
      >
        <PlusIcon />
        {li.addLine}
      </button>
    </section>
  )
}
