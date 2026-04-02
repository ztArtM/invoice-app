import type { InvoiceDocument } from '../types/invoiceDocument'
import { createId } from './createId'

/** Deep-enough copy for React state: new line-item ids so keys stay stable if you edit after duplicating. */
export function duplicateInvoiceDocument(document: InvoiceDocument): InvoiceDocument {
  return {
    ...document,
    lineItems: document.lineItems.map((line) => ({
      ...line,
      id: createId(),
    })),
  }
}
