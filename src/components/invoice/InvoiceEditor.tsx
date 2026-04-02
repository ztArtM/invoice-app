import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, SetInvoiceDocument } from '../../types/invoiceDocument'
import { InvoiceForm } from './InvoiceForm'

interface InvoiceEditorProps {
  t: TranslationMessages
  localeForFormatting: string
  activeCurrencyCode: SupportedCurrencyCode
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

/** Form column wrapper — layout shell around the full invoice form. */
export function InvoiceEditor({
  t,
  localeForFormatting,
  activeCurrencyCode,
  invoiceDocument,
  setInvoiceDocument,
}: InvoiceEditorProps) {
  return (
    <div
      className="min-w-0 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/[0.04] print:hidden sm:p-6"
      role="region"
      aria-label={t.editor.formAriaLabel}
    >
      <InvoiceForm
        t={t}
        localeForFormatting={localeForFormatting}
        activeCurrencyCode={activeCurrencyCode}
        invoiceDocument={invoiceDocument}
        setInvoiceDocument={setInvoiceDocument}
      />
    </div>
  )
}
