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
 * Line items for the live preview: stacked cards on small screens, table from `sm` and when printing.
 * Row amounts use `calculateLineItemTotal` only — no duplicated math.
 * Table uses fixed layout + column widths so long descriptions wrap without overlapping numeric cells.
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
    <>
      <ul className="space-y-2 sm:hidden print:hidden">
        {lineItems.map((lineItem) => {
          const lineAmount = calculateLineItemTotal(lineItem)
          const unitStr = formatCurrencyAmount(
            lineItem.unitPrice,
            activeCurrencyCode,
            localeForFormatting,
          )
          const lineStr = formatCurrencyAmount(lineAmount, activeCurrencyCode, localeForFormatting)
          return (
            <li
              key={lineItem.id}
              className="min-w-0 rounded-lg border border-zinc-200/90 bg-white p-3.5 shadow-sm"
            >
              <p className="min-w-0 text-sm font-medium leading-snug text-zinc-900 [overflow-wrap:anywhere] [word-break:break-word]">
                <PreviewText value={lineItem.description} />
              </p>
              <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600">
                <span>{thQty}</span>
                <span className="text-right tabular-nums text-zinc-800">{lineItem.quantity}</span>
                <span>{thUnitPrice}</span>
                <span className="break-all text-right tabular-nums text-zinc-800 [overflow-wrap:anywhere]">
                  {unitStr}
                </span>
                <span className="font-medium text-zinc-700">{thAmount}</span>
                <span className="break-all text-right text-sm font-semibold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
                  {lineStr}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="hidden min-w-0 sm:block print:block print:overflow-visible">
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
    </>
  )
}
