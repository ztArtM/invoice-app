import { jsPDF } from 'jspdf'
import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument } from '../../types/invoiceDocument'
import { formatCurrencyAmount } from '../formatCurrency'
import { formatDateForDisplay } from '../formatDate'
import {
  calculateInvoiceTotalsSummary,
  calculateLineItemTotal,
} from '../invoiceCalculations'
import {
  BODY_LINE_H_MM,
  buildPdfFileName,
  META_ROW_STEP_MM,
  PAGE_MARGIN_MM,
  PAYMENT_FIELD_GAP_MM,
  PAYMENT_FIELD_LINE_STEP_MM,
  PT,
  SECTION_TOP_MARGIN_MM,
  TABLE_AFTER_ROW_RULE_GAP_MM,
  TABLE_HEADER_BODY_GAP_MM,
  TABLE_ROW_BOTTOM_PAD_MM,
  TABLE_ROW_PAD_MM,
  pdfSplitLines,
} from './invoicePdfConstants'
import {
  buildClientPdfBlock,
  buildSellerPdfBlock,
  drawPartyPdfBlock,
  measurePartyPdfBlockHeight,
} from './partyPdfBlock'
import {
  hasPaymentDetails,
  type PaymentPdfPair,
  writePaymentTwoColumnRows,
} from './paymentDetailsPdf'

/** Line-items column geometry — must match `PreviewLineItems` colgroup: 46% | 11% | 21% | 22% */
const COL_FR_DESC = 0.46
const COL_FR_QTY = 0.11
const COL_FR_UNIT = 0.21

/**
 * Draws the invoice into the provided jsPDF document. Kept separate so the same layout can be used
 * in the browser (legacy) and in Vercel serverless functions (protected download endpoint).
 */
export function buildInvoicePdfIntoDoc(
  doc: jsPDF,
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): { fileName: string } {
  const pageWidthMm = doc.internal.pageSize.getWidth()
  const pageHeightMm = doc.internal.pageSize.getHeight()
  const contentRightMm = pageWidthMm - PAGE_MARGIN_MM
  const contentWidthMm = pageWidthMm - PAGE_MARGIN_MM * 2

  let cursorYMm = PAGE_MARGIN_MM

  const totals = calculateInvoiceTotalsSummary(
    invoiceDocument.lineItems,
    invoiceDocument.vat.ratePercent,
  )

  const p = t.preview
  const li = t.lineItems
  const tot = t.totals

  const isQuote = invoiceDocument.documentKind === 'quote'
  const documentLabel = isQuote ? p.documentQuote : p.documentInvoice
  const numberLabel = isQuote ? p.numberQuote : p.numberInvoice
  const dueDateLabel = isQuote ? p.validUntil : p.dueDate

  const colDescriptionLeftMm = PAGE_MARGIN_MM
  const colQtyCenterMm = PAGE_MARGIN_MM + contentWidthMm * (COL_FR_DESC + COL_FR_QTY / 2)
  const colUnitRightMm = PAGE_MARGIN_MM + contentWidthMm * (COL_FR_DESC + COL_FR_QTY + COL_FR_UNIT)
  const colAmountRightMm = contentRightMm
  const qtyColMaxMm = Math.max(10, contentWidthMm * COL_FR_QTY - 3)
  const unitColMaxMm = Math.max(14, contentWidthMm * COL_FR_UNIT - 3)
  const amountColMaxMm = Math.max(16, contentWidthMm * 0.22 - 3)

  function ensureRoomForBlock(blockHeightMm: number) {
    if (cursorYMm + blockHeightMm > pageHeightMm - PAGE_MARGIN_MM) {
      doc.addPage()
      cursorYMm = PAGE_MARGIN_MM
    }
  }

  function moveDown(mm: number) {
    cursorYMm += mm
  }

  // ----- Header: document title (left) + compact metadata (right) -----
  const metaBoxW = 72
  const metaLeft = contentRightMm - metaBoxW
  const headerTop = cursorYMm
  const invNum = invoiceDocument.invoiceNumber.trim()
  const issueDateStr = formatDateForDisplay(invoiceDocument.issueDate, localeForFormatting)
  const dueDateStr = formatDateForDisplay(invoiceDocument.dueDate, localeForFormatting)
  const currencyCode = invoiceDocument.currency.code.trim().toUpperCase()
  const metaPad = 2.6
  const metaLabelMaxW = 28
  const metaValueMaxW = Math.max(14, metaBoxW - metaPad * 2 - metaLabelMaxW - 2)

  let leftY = headerTop + 3
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(PT.docTitle)
  doc.setTextColor(24, 24, 27)
  doc.text(documentLabel.toUpperCase(), PAGE_MARGIN_MM, leftY)
  leftY += 5

  const metaTop = headerTop
  type MetaPdfRow = { labelLines: string[]; valueLines: string[] }
  const metaRows: MetaPdfRow[] = []

  function pushMetaRow(label: string, value: string, valueIsInvoiceNo = false) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.metaLabel)
    const labelLines = pdfSplitLines(doc, label, metaLabelMaxW)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(valueIsInvoiceNo ? PT.invoiceNo : PT.body)
    const valueLines = pdfSplitLines(doc, value, metaValueMaxW)
    doc.setFont('helvetica', 'normal')
    metaRows.push({ labelLines, valueLines })
  }

  pushMetaRow(numberLabel, invNum || '—', true)
  pushMetaRow(p.issueDate, issueDateStr)
  pushMetaRow(dueDateLabel, dueDateStr)
  if (currencyCode) {
    pushMetaRow(p.currency, currencyCode)
  }

  let metaContentH = metaPad + 0.5
  for (const row of metaRows) {
    const blockH = Math.max(row.labelLines.length, row.valueLines.length) * META_ROW_STEP_MM * 0.92 + 0.9
    metaContentH += blockH
  }
  metaContentH += metaPad
  const metaBoxH = Math.max(metaContentH, 17.5)

  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(212, 212, 216)
  doc.roundedRect(metaLeft, metaTop, metaBoxW, metaBoxH, 2, 2, 'FD')

  let innerY = metaTop + metaPad + 1.5
  metaRows.forEach((row, rowIdx) => {
    const blockTop = innerY
    doc.setTextColor(82, 82, 91)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.metaLabel)
    let yL = blockTop
    for (const part of row.labelLines) {
      doc.text(part, metaLeft + metaPad, yL)
      yL += META_ROW_STEP_MM * 0.92
    }
    doc.setTextColor(24, 24, 27)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(rowIdx === 0 ? PT.invoiceNo : PT.body)
    let yV = blockTop
    for (const part of row.valueLines) {
      doc.text(part, metaLeft + metaBoxW - metaPad, yV, { align: 'right' })
      yV += META_ROW_STEP_MM * 0.92
    }
    innerY = Math.max(yL, yV) + 1.1
  })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)

  cursorYMm = Math.max(leftY, metaTop + metaBoxH) + 3
  doc.setDrawColor(200, 200, 205)
  doc.setLineWidth(0.35)
  doc.line(PAGE_MARGIN_MM, cursorYMm, contentRightMm, cursorYMm)
  doc.setLineWidth(0.2)
  moveDown(SECTION_TOP_MARGIN_MM)

  // ----- Seller & client -----
  ensureRoomForBlock(40)
  const midX = pageWidthMm / 2
  const gapMm = 6
  const leftPanelX = PAGE_MARGIN_MM
  const leftPanelInnerX = leftPanelX + 5
  const leftColumnWidthMm = midX - leftPanelInnerX - gapMm / 2
  const rightPanelX = midX + gapMm / 2
  const rightColumnXMm = rightPanelX + 5
  const rightColumnWidthMm = contentRightMm - rightColumnXMm

  const sellerBlock = buildSellerPdfBlock(invoiceDocument.seller, invoiceDocument.invoiceType, p)
  const clientBlock = buildClientPdfBlock(invoiceDocument.client, invoiceDocument.invoiceType, p)

  const partyLabelLineMm = 3.0
  const gapLabelToBodyMm = 2.0
  const leftBodyH = measurePartyPdfBlockHeight(doc, sellerBlock, leftColumnWidthMm)
  const rightBodyH = measurePartyPdfBlockHeight(doc, clientBlock, rightColumnWidthMm)
  const leftHeight = partyLabelLineMm + gapLabelToBodyMm + Math.max(leftBodyH, 4.5)
  const rightHeight = partyLabelLineMm + gapLabelToBodyMm + Math.max(rightBodyH, 4.5)
  const panelInnerH = Math.max(leftHeight, rightHeight, 10)
  const panelH = panelInnerH + 3.5
  const panelContentTop = cursorYMm

  ensureRoomForBlock(panelH + 2)

  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(212, 212, 216)
  doc.roundedRect(leftPanelX, panelContentTop - 1, midX - leftPanelX - gapMm / 2, panelH, 2, 2, 'FD')
  doc.roundedRect(rightPanelX, panelContentTop - 1, contentRightMm - rightPanelX, panelH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(PT.metaLabel)
  doc.setTextColor(82, 82, 91)
  doc.text(p.from, leftPanelInnerX, panelContentTop + 3)
  doc.text(p.billTo, rightColumnXMm, panelContentTop + 3)

  const partyBodyStartY = panelContentTop + 3 + partyLabelLineMm + gapLabelToBodyMm
  drawPartyPdfBlock(doc, sellerBlock, leftColumnWidthMm, leftPanelInnerX, partyBodyStartY)
  drawPartyPdfBlock(doc, clientBlock, rightColumnWidthMm, rightColumnXMm, partyBodyStartY)

  cursorYMm = panelContentTop - 1 + panelH + SECTION_TOP_MARGIN_MM

  const taxNoteTrimmed = invoiceDocument.taxNote.trim()
  if (taxNoteTrimmed) {
    ensureRoomForBlock(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(PT.body)
    doc.setTextColor(120, 60, 0)
    const noteLines = doc.splitTextToSize(taxNoteTrimmed, contentWidthMm)
    for (const line of noteLines) {
      doc.text(line, PAGE_MARGIN_MM, cursorYMm)
      cursorYMm += BODY_LINE_H_MM * 0.95
    }
    doc.setTextColor(0, 0, 0)
    moveDown(SECTION_TOP_MARGIN_MM * 0.6)
  }

  // ----- Line items -----
  // Keep compact: table header provides context (matches preview).
  ensureRoomForBlock(15)

  const tablePadX = 2
  const tableLeft = PAGE_MARGIN_MM
  const tableRight = contentRightMm
  const headerRowH = 9
  const rowStepMm = BODY_LINE_H_MM + TABLE_ROW_PAD_MM

  const tableHeaderTop = cursorYMm
  doc.setFillColor(244, 244, 245)
  doc.rect(tableLeft, tableHeaderTop, tableRight - tableLeft, headerRowH, 'F')
  doc.setDrawColor(212, 212, 216)
  doc.line(tableLeft, tableHeaderTop + headerRowH, tableRight, tableHeaderTop + headerRowH)

  const headBaselineY = tableHeaderTop + headerRowH * 0.5 + 1.25
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(PT.tableHead)
  doc.setTextColor(63, 63, 70)
  doc.text(li.thDescription, tableLeft + tablePadX, headBaselineY)
  doc.text(li.thQty, colQtyCenterMm, headBaselineY, { align: 'center' })
  doc.text(li.thUnitPrice, colUnitRightMm, headBaselineY, { align: 'right' })
  doc.text(p.thAmount, colAmountRightMm - tablePadX, headBaselineY, { align: 'right' })

  cursorYMm = tableHeaderTop + headerRowH + TABLE_HEADER_BODY_GAP_MM
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(PT.body)
  doc.setTextColor(39, 39, 42)

  const descriptionMaxWidthMm = Math.max(24, contentWidthMm * COL_FR_DESC - tablePadX * 2)

  for (let i = 0; i < invoiceDocument.lineItems.length; i++) {
    const lineItem = invoiceDocument.lineItems[i]!
    const lineTotal = calculateLineItemTotal(lineItem)
    const description = lineItem.description.trim()
    const descLines = description ? pdfSplitLines(doc, description, descriptionMaxWidthMm) : []

    const qtyText = String(lineItem.quantity)
    const unitText = formatCurrencyAmount(lineItem.unitPrice, activeCurrencyCode, localeForFormatting)
    const amountText = formatCurrencyAmount(lineTotal, activeCurrencyCode, localeForFormatting)
    const qtyLines = pdfSplitLines(doc, qtyText, qtyColMaxMm)
    const unitLines = pdfSplitLines(doc, unitText, unitColMaxMm)
    const amountLines = pdfSplitLines(doc, amountText, amountColMaxMm)

    const rowLineCount = Math.max(
      descLines.length,
      qtyLines.length,
      unitLines.length,
      amountLines.length,
      1,
    )
    const rowBodyHeightMm = rowLineCount * rowStepMm
    ensureRoomForBlock(rowBodyHeightMm + 2.5)

    const rowStartYMm = cursorYMm
    descLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colDescriptionLeftMm + tablePadX, rowStartYMm + index * rowStepMm)
    })
    qtyLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colQtyCenterMm, rowStartYMm + index * rowStepMm, { align: 'center' })
    })
    unitLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colUnitRightMm, rowStartYMm + index * rowStepMm, { align: 'right' })
    })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(PT.body)
    amountLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colAmountRightMm - tablePadX, rowStartYMm + index * rowStepMm, { align: 'right' })
    })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.body)

    cursorYMm = rowStartYMm + rowBodyHeightMm + TABLE_ROW_BOTTOM_PAD_MM
    if (i < invoiceDocument.lineItems.length - 1) {
      cursorYMm += TABLE_AFTER_ROW_RULE_GAP_MM
    }
  }

  moveDown(Math.max(SECTION_TOP_MARGIN_MM, 5))

  // ----- Totals -----
  const totalsBlockW = Math.min(97, contentWidthMm * 0.54)
  const totalsBlockLeftMm = contentRightMm - totalsBlockW
  const totalsBlockRightMm = totalsBlockLeftMm + totalsBlockW
  const totPad = 3.5
  const amountMaxW = 40
  const labelMaxW = Math.max(28, totalsBlockW - totPad * 2 - amountMaxW - 3)

  const subtotalLabel = tot.subtotalExVat
  const vatLabel = tot.vatWithPercent.replace(
    '{{percent}}',
    String(invoiceDocument.vat.ratePercent),
  )
  const subtotalAmtStr = formatCurrencyAmount(
    totals.subtotalExcludingVat,
    activeCurrencyCode,
    localeForFormatting,
  )
  const vatAmtStr = formatCurrencyAmount(totals.vatAmount, activeCurrencyCode, localeForFormatting)
  const grandAmtStr = formatCurrencyAmount(
    totals.grandTotalIncludingVat,
    activeCurrencyCode,
    localeForFormatting,
  )

  doc.setFontSize(PT.body)
  doc.setFont('helvetica', 'normal')
  const subLabelLines = pdfSplitLines(doc, subtotalLabel, labelMaxW)
  const subAmountLines = pdfSplitLines(doc, subtotalAmtStr, amountMaxW)
  const vatLabelLines = pdfSplitLines(doc, vatLabel, labelMaxW)
  const vatAmountLines = pdfSplitLines(doc, vatAmtStr, amountMaxW)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(PT.body)
  const grandLabelLines = pdfSplitLines(doc, tot.totalDue, labelMaxW)
  const grandAmountLines = pdfSplitLines(doc, grandAmtStr, amountMaxW)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(PT.body)
  doc.setTextColor(0, 0, 0)

  const subRowH = Math.max(subLabelLines.length, subAmountLines.length) * BODY_LINE_H_MM
  const vatRowH = Math.max(vatLabelLines.length, vatAmountLines.length) * BODY_LINE_H_MM
  const grandRowH = Math.max(grandLabelLines.length, grandAmountLines.length) * BODY_LINE_H_MM
  let totalsBlockHeightMm = 5 + subRowH + 1.4 + vatRowH + 2.0 + grandRowH + 5
  totalsBlockHeightMm = Math.max(totalsBlockHeightMm, 26)

  ensureRoomForBlock(totalsBlockHeightMm)
  const totalsBoxTop = cursorYMm
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(212, 212, 216)
  doc.roundedRect(totalsBlockLeftMm, totalsBoxTop, totalsBlockW, totalsBlockHeightMm, 2, 2, 'FD')

  let totY = totalsBoxTop + 5.0

  function drawTotalsRowPair(
    labelLines: string[],
    amountLines: string[],
    labelGrey: boolean,
    lineStepMm: number,
  ) {
    const rowTop = totY
    if (labelGrey) {
      doc.setTextColor(90, 90, 90)
    } else {
      doc.setTextColor(0, 0, 0)
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.body)
    let yL = rowTop
    for (const part of labelLines) {
      doc.text(part, totalsBlockLeftMm + totPad, yL)
      yL += lineStepMm
    }
    doc.setTextColor(0, 0, 0)
    let yR = rowTop
    for (const part of amountLines) {
      doc.text(part, totalsBlockRightMm - totPad, yR, { align: 'right' })
      yR += lineStepMm
    }
    totY = Math.max(yL, yR)
  }

  drawTotalsRowPair(subLabelLines, subAmountLines, true, BODY_LINE_H_MM)
  totY += 0.2
  drawTotalsRowPair(vatLabelLines, vatAmountLines, true, BODY_LINE_H_MM)
  totY += 1.3

  doc.setDrawColor(228, 228, 231)
  doc.setLineWidth(0.35)
  doc.line(totalsBlockLeftMm + totPad, totY, totalsBlockRightMm - totPad, totY)
  doc.setLineWidth(0.2)
  totY += 2.0

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(PT.body)
  doc.setTextColor(24, 24, 27)
  drawTotalsRowPair(grandLabelLines, grandAmountLines, false, BODY_LINE_H_MM)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(PT.body)
  doc.setTextColor(0, 0, 0)
  cursorYMm = totalsBoxTop + totalsBlockHeightMm + SECTION_TOP_MARGIN_MM

  // ----- Footer band (notes + mobile pay + payment details) -----
  const notesTrimmed = invoiceDocument.notes.trim()
  const mobilePayTrimmed = invoiceDocument.mobilePayNumberOrBox.trim()
  const payment = invoiceDocument.paymentDetails
  const hasPayment = hasPaymentDetails(payment)

  if (notesTrimmed || mobilePayTrimmed || hasPayment) {
    const cardX = PAGE_MARGIN_MM
    const cardW = contentWidthMm
    const pad = 3.5
    const sectionGap = 3.0
    const headerGapTight = 1.6
    const headerGapPayment = 2.4

    const noteLines = notesTrimmed ? doc.splitTextToSize(notesTrimmed, cardW - pad * 2) : []
    const mobileLines = mobilePayTrimmed ? doc.splitTextToSize(mobilePayTrimmed, cardW - pad * 2) : []

    function shortPaymentLabel(fullLabel: string): string {
      // PDF-only short labels; preview keeps the full versions.
      if (fullLabel === p.registrationNumber) return 'Reg.nr.'
      if (fullLabel === p.accountNumber) return 'Acct.'
      if (fullLabel === p.accountHolder) return 'Holder'
      if (fullLabel === p.paymentRef) return 'Ref.'
      return fullLabel
    }

    const payPairs: PaymentPdfPair[] = []
    if (hasPayment) {
      if (payment.bankName.trim() !== '') {
        payPairs.push({ label: shortPaymentLabel(p.bank), value: payment.bankName.trim() })
      }
      if (payment.registrationNumber.trim() !== '') {
        payPairs.push({ label: shortPaymentLabel(p.registrationNumber), value: payment.registrationNumber.trim() })
      }
      if (payment.accountNumber.trim() !== '') {
        payPairs.push({ label: shortPaymentLabel(p.accountNumber), value: payment.accountNumber.trim() })
      }
      if (payment.accountHolder.trim() !== '') {
        payPairs.push({ label: shortPaymentLabel(p.accountHolder), value: payment.accountHolder.trim() })
      }
      if (payment.iban.trim() !== '') payPairs.push({ label: p.iban, value: payment.iban.trim(), mono: true })
      if (payment.bicOrSwift.trim() !== '') payPairs.push({ label: p.bicSwift, value: payment.bicOrSwift.trim(), mono: true })
      if (payment.paymentReference.trim() !== '') {
        payPairs.push({ label: shortPaymentLabel(p.paymentRef), value: payment.paymentReference.trim() })
      }
    }

    // Estimate payment block height (same rhythm as writePaymentTwoColumnRows).
    const labelColWMm = Math.min(48, (cardW - pad * 2) * 0.32)
    const colGapMm = 5
    const valueXMm = cardX + pad + labelColWMm + colGapMm
    const valueMaxWMm = Math.max(24, cardX + cardW - pad - valueXMm)
    let paymentH = 0
    if (payPairs.length > 0) {
      for (const { label, value } of payPairs) {
        const labelLines = doc.splitTextToSize(label.trim(), labelColWMm)
        const valueLines = doc.splitTextToSize(value.trim(), valueMaxWMm)
        const lineCount = Math.max(labelLines.length, valueLines.length, 1)
        paymentH += lineCount * PAYMENT_FIELD_LINE_STEP_MM + PAYMENT_FIELD_GAP_MM
      }
      paymentH += 0.25
    }

    let cardH = pad * 2
    let sections = 0
    if (noteLines.length > 0) {
      sections++
      cardH += headerGapTight + noteLines.length * (BODY_LINE_H_MM * 0.92)
    }
    if (mobileLines.length > 0) {
      if (sections > 0) cardH += sectionGap
      sections++
      cardH += headerGapTight + mobileLines.length * (BODY_LINE_H_MM * 0.92)
    }
    if (payPairs.length > 0) {
      if (sections > 0) cardH += sectionGap
      sections++
      cardH += headerGapPayment + paymentH
    }

    ensureRoomForBlock(cardH)
    const cardTop = cursorYMm
    doc.setFillColor(250, 250, 251)
    doc.setDrawColor(212, 212, 216)
    doc.roundedRect(cardX, cardTop, cardW, cardH, 2, 2, 'FD')

    let y = cardTop + pad

    if (noteLines.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(PT.caption)
      doc.setTextColor(161, 161, 170)
      doc.text(p.notes, cardX + pad, y)
      y += headerGapTight
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(PT.body)
      doc.setTextColor(63, 63, 70)
      for (const line of noteLines) {
        doc.text(line, cardX + pad, y)
        y += BODY_LINE_H_MM * 0.92
      }
      doc.setTextColor(0, 0, 0)
    }

    if (mobileLines.length > 0) {
      if (noteLines.length > 0) y += sectionGap
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(PT.caption)
      doc.setTextColor(161, 161, 170)
      doc.text(p.mobilePay, cardX + pad, y)
      y += headerGapTight
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(PT.body)
      doc.setTextColor(39, 39, 42)
      for (const line of mobileLines) {
        doc.text(line, cardX + pad, y)
        y += BODY_LINE_H_MM * 0.92
      }
      doc.setTextColor(0, 0, 0)
    }

    if (payPairs.length > 0) {
      if (noteLines.length > 0 || mobileLines.length > 0) y += sectionGap
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(PT.caption)
      doc.setTextColor(82, 82, 91)
      doc.text(p.paymentDetails, cardX + pad, y)
      y += headerGapPayment
      cursorYMm = writePaymentTwoColumnRows(doc, y, pageHeightMm, cardX + pad, cardW - pad * 2, payPairs)
      y = cursorYMm
    } else {
      cursorYMm = y
    }

    cursorYMm = cardTop + cardH + SECTION_TOP_MARGIN_MM * 0.5
  }

  return { fileName: buildPdfFileName(invoiceDocument) }
}

/**
 * Renders the invoice as PDF bytes (Uint8Array) and a suggested filename.
 * This is the preferred primitive for server-side downloads.
 */
export function renderInvoicePdfBytes(
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): { bytes: Uint8Array; fileName: string } {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const { fileName } = buildInvoicePdfIntoDoc(doc, invoiceDocument, t, localeForFormatting, activeCurrencyCode)
  const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer
  return { bytes: new Uint8Array(arrayBuffer), fileName }
}

/**
 * Browser-only legacy entry: renders and immediately downloads.
 * Prefer calling the protected Vercel endpoint instead.
 */
export function buildInvoicePdfDocument(
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const { fileName } = buildInvoicePdfIntoDoc(doc, invoiceDocument, t, localeForFormatting, activeCurrencyCode)
  doc.save(fileName)
}
