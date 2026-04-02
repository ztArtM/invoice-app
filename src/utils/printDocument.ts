/**
 * Opens the browser print dialog (user can choose “Save as PDF”).
 * Print CSS in index.css can hide the editor and show only #invoice-preview.
 */
export function printInvoicePreview(): void {
  window.print()
}
