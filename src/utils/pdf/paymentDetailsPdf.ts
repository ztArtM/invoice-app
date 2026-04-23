import type jsPDF from 'jspdf'
import type { InvoiceDocument } from '../../types/invoiceDocument'
import { PAGE_MARGIN_MM, PAYMENT_FIELD_GAP_MM, PAYMENT_FIELD_LINE_STEP_MM, PT } from './invoicePdfConstants'

export function hasPaymentDetails(payment: InvoiceDocument['paymentDetails']): boolean {
  return (
    payment.bankName.trim() !== '' ||
    payment.registrationNumber.trim() !== '' ||
    payment.accountNumber.trim() !== '' ||
    payment.accountHolder.trim() !== '' ||
    payment.iban.trim() !== '' ||
    payment.bicOrSwift.trim() !== '' ||
    payment.paymentReference.trim() !== ''
  )
}

export type PaymentPdfPair = { label: string; value: string; mono?: boolean }

/**
 * Payment details: label column + value column, aligned row-by-row; handles page breaks.
 */
export function writePaymentTwoColumnRows(
  pdfDoc: jsPDF,
  startYMm: number,
  pageHeightMm: number,
  marginLeftMm: number,
  contentWidthMm: number,
  pairs: PaymentPdfPair[],
): number {
  /** Match preview `minmax(8.5rem,12rem)` + `gap-x-6` */
  const labelColWMm = Math.min(48, contentWidthMm * 0.32)
  const colGapMm = 5
  const valueXMm = marginLeftMm + labelColWMm + colGapMm
  const valueMaxWMm = Math.max(24, marginLeftMm + contentWidthMm - valueXMm)

  let yMm = startYMm
  if (pairs.length === 0) return yMm

  function ensureRoomForPaymentBlock(blockHeightMm: number) {
    if (yMm + blockHeightMm > pageHeightMm - PAGE_MARGIN_MM) {
      pdfDoc.addPage()
      yMm = PAGE_MARGIN_MM
    }
  }

  for (const { label, value, mono } of pairs) {
    const v = value.trim()
    if (!v) continue

    pdfDoc.setFont('helvetica', 'normal')
    pdfDoc.setFontSize(PT.body)
    const labelLines = pdfDoc.splitTextToSize(label.trim(), labelColWMm)
    if (mono) {
      pdfDoc.setFont('courier', 'normal')
      pdfDoc.setFontSize(PT.mono)
    } else {
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(PT.body)
    }
    const valueLines = pdfDoc.splitTextToSize(v, valueMaxWMm)
    const lineCount = Math.max(labelLines.length, valueLines.length, 1)
    const blockHeightMm = lineCount * PAYMENT_FIELD_LINE_STEP_MM + PAYMENT_FIELD_GAP_MM

    ensureRoomForPaymentBlock(blockHeightMm)

    const blockTop = yMm
    for (let i = 0; i < lineCount; i++) {
      const lineY = blockTop + i * PAYMENT_FIELD_LINE_STEP_MM
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(PT.body)
      pdfDoc.setTextColor(82, 82, 91)
      const l = labelLines[i]
      if (l) {
        pdfDoc.text(l, marginLeftMm, lineY)
      }
      if (mono) {
        pdfDoc.setFont('courier', 'normal')
        pdfDoc.setFontSize(PT.mono)
      } else {
        pdfDoc.setFont('helvetica', 'normal')
        pdfDoc.setFontSize(PT.body)
      }
      pdfDoc.setTextColor(39, 39, 42)
      const val = valueLines[i]
      if (val) {
        pdfDoc.text(val, valueXMm, lineY)
      }
    }
    yMm = blockTop + lineCount * PAYMENT_FIELD_LINE_STEP_MM + PAYMENT_FIELD_GAP_MM
  }

  pdfDoc.setTextColor(0, 0, 0)
  return yMm + 0.25
}
