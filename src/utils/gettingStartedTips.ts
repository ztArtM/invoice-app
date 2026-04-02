import type { TranslationMessages } from '../constants/translations'
import type { InvoiceDocument } from '../types/invoiceDocument'

/**
 * Friendly reminders when important fields are still empty (no blocking — just guidance).
 * Used for the getting-started banner and the preview hint.
 */
export function getGettingStartedTips(
  invoiceDocument: InvoiceDocument,
  messages: TranslationMessages['gettingStarted'],
): string[] {
  const tips: string[] = []

  if (!invoiceDocument.seller.name.trim()) {
    tips.push(messages.tipSeller)
  }
  if (!invoiceDocument.client.name.trim()) {
    tips.push(messages.tipClient)
  }
  if (!invoiceDocument.invoiceNumber.trim()) {
    tips.push(messages.tipNumber)
  }

  const everyLineDescriptionEmpty = invoiceDocument.lineItems.every(
    (line) => line.description.trim() === '',
  )
  if (everyLineDescriptionEmpty) {
    tips.push(messages.tipLines)
  }

  return tips
}
