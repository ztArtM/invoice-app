import type { SupportedCurrencyCode } from '../../constants/localization'
import type { LineItem } from '../../types/invoiceDocument'
import { formatCurrencyAmount } from '../../utils/formatCurrency'
import { calculateLineItemTotal } from '../../utils/invoiceCalculations'
import { PreviewText } from './PreviewDisplay'

export interface PreviewLineItemsProps {
  lineItems: LineItem[]
  thDescription: string
  thQty: string
  thUnitPrice: string
  thAmount: string
  activeCurrencyCode: SupportedCurrencyCode
  localeForFormatting: string
}

/**
 * Line items for the live preview: same table layout on all breakpoints (matches desktop + print).
 * Narrow viewports scroll horizontally via the wrapper. Row amounts use `calculateLineItemTotal` only.
 */
export function PreviewLineItems({
  lineItems,
  thDescription,
  thQty,
  thUnitPrice,
  thAmount,
  activeCurrencyCode,
  localeForFormatting,
}: PreviewLineItemsProps) {
  return (
    <div className="min-w-0 overflow-x-auto print:overflow-visible">
      <table className="invoice-table-print w-full border-collapse text-sm">
        <colgroup>
          <col style={{ width: '46%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '21%' }} />
          <col style={{ width: '22%' }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-900/20 bg-zinc-100/90 text-left print:border-zinc-400 print:bg-zinc-100">
            <th
              scope="col"
              className="min-w-0 py-2.5 pl-2 pr-2 align-middle text-[0.7rem] font-semibold tracking-wide text-zinc-600"
            >
              {thDescription}
            </th>
            <th
              scope="col"
              className="invoice-table-print-col-num py-2.5 pr-2 text-center align-middle text-[0.7rem] font-semibold tracking-wide text-zinc-600"
            >
              {thQty}
            </th>
            <th
              scope="col"
              className="invoice-table-print-col-num py-2.5 pr-2 text-right align-middle text-[0.7rem] font-semibold tracking-wide text-zinc-600"
            >
              {thUnitPrice}
            </th>
            <th
              scope="col"
              className="invoice-table-print-col-num py-2.5 pl-1 pr-2 text-right align-middle text-[0.7rem] font-semibold tracking-wide text-zinc-600"
            >
              {thAmount}
            </th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((lineItem) => {
            const lineAmount = calculateLineItemTotal(lineItem)
            const unitStr = formatCurrencyAmount(
              lineItem.unitPrice,
              activeCurrencyCode,
              localeForFormatting,
            )
            const lineStr = formatCurrencyAmount(lineAmount, activeCurrencyCode, localeForFormatting)
            return (
              <tr key={lineItem.id}>
                <td className="min-w-0 py-2.5 pl-2 pr-2 align-top text-sm leading-normal text-zinc-800 [overflow-wrap:anywhere] [word-break:break-word]">
                  <PreviewText value={lineItem.description} />
                </td>
                <td className="invoice-table-print-col-num py-2.5 pr-2 text-center text-sm tabular-nums text-zinc-800">
                  {lineItem.quantity}
                </td>
                <td className="invoice-table-print-col-num py-2.5 pr-2 text-right text-sm tabular-nums text-zinc-800">
                  {unitStr}
                </td>
                <td className="invoice-table-print-col-num py-2.5 pl-1 pr-2 text-right text-sm tabular-nums font-semibold text-zinc-900">
                  {lineStr}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
