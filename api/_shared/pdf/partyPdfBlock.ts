import type jsPDF from 'jspdf'
import type { ClientParty, InvoiceDocument, PartyContact, SellerParty } from '../invoiceTypes'
import { BODY_LINE_H_MM, PARTY_BLOCK_GAP_MM, PARTY_NAME_LINE_H_MM, PT, pdfSplitLines } from './invoicePdfConstants'

function buildContactLines(party: PartyContact): string[] {
  const lines: string[] = []
  const name = party.name.trim()
  if (name) lines.push(name)
  const address = party.address.trim()
  if (address) {
    lines.push(...address.split('\n').map((part) => part.trim()).filter(Boolean))
  }
  return lines
}

export type PartyPdfBlock = {
  name: string
  addressLines: string[]
  idLine: string | null
}

export function buildSellerPdfBlock(
  seller: SellerParty,
  invoiceType: InvoiceDocument['invoiceType'],
  p: { cvrLabel: string; vatNoLabel: string },
): PartyPdfBlock {
  const contact = buildContactLines(seller)
  const hasName = seller.name.trim().length > 0
  const name = hasName ? (contact[0] ?? '') : ''
  const addressLines = hasName ? contact.slice(1) : [...contact]
  let idLine: string | null = null
  if (seller.sellerType === 'company') {
    if (invoiceType === 'domestic_dk') {
      const sellerCvr = seller.sellerCvrNumber.trim()
      if (sellerCvr) idLine = `${p.cvrLabel}: ${sellerCvr}`
    } else {
      const vat = seller.vatNumber.trim()
      if (vat) idLine = `${p.vatNoLabel}: ${vat}`
    }
  }
  return { name, addressLines, idLine }
}

export function buildClientPdfBlock(
  client: ClientParty,
  invoiceType: InvoiceDocument['invoiceType'],
  p: { cvrLabel: string; vatNoLabel: string },
): PartyPdfBlock {
  const contact = buildContactLines(client)
  const hasName = client.name.trim().length > 0
  const name = hasName ? (contact[0] ?? '') : ''
  const addressLines = hasName ? contact.slice(1) : [...contact]
  let idLine: string | null = null
  if (client.clientType === 'company') {
    if (invoiceType === 'domestic_dk') {
      const cvr = client.clientCvrNumber.trim()
      if (cvr) idLine = `${p.cvrLabel}: ${cvr}`
    } else {
      const vat = client.vatNumber.trim()
      if (vat) idLine = `${p.vatNoLabel}: ${vat}`
    }
  }
  return { name, addressLines, idLine }
}

export function measurePartyPdfBlockHeight(doc: jsPDF, block: PartyPdfBlock, colWidthMm: number): number {
  doc.setFont('helvetica', 'normal')
  let h = 0
  if (block.name.trim()) {
    doc.setFontSize(PT.partyName)
    const nameLines = pdfSplitLines(doc, block.name, colWidthMm)
    h += nameLines.length * PARTY_NAME_LINE_H_MM
  }
  const addrNonEmpty = block.addressLines.some((l) => l.trim())
  if (addrNonEmpty) {
    if (block.name.trim()) h += PARTY_BLOCK_GAP_MM
    doc.setFontSize(PT.body)
    for (const line of block.addressLines) {
      const wrapped = pdfSplitLines(doc, line, colWidthMm)
      h += wrapped.length * BODY_LINE_H_MM
    }
  }
  if (block.idLine && block.idLine.trim()) {
    h += PARTY_BLOCK_GAP_MM
    doc.setFontSize(PT.small)
    const wrapped = pdfSplitLines(doc, block.idLine, colWidthMm)
    h += wrapped.length * (BODY_LINE_H_MM * 0.92)
  }
  return h
}

export function drawPartyPdfBlock(
  doc: jsPDF,
  block: PartyPdfBlock,
  colWidthMm: number,
  startX: number,
  startY: number,
): void {
  let y = startY
  if (block.name.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(PT.partyName)
    doc.setTextColor(24, 24, 27)
    for (const tl of pdfSplitLines(doc, block.name, colWidthMm)) {
      doc.text(tl, startX, y)
      y += PARTY_NAME_LINE_H_MM
    }
  }
  if (block.addressLines.some((l) => l.trim())) {
    if (block.name.trim()) y += PARTY_BLOCK_GAP_MM
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.body)
    doc.setTextColor(63, 63, 70)
    for (const line of block.addressLines) {
      for (const tl of pdfSplitLines(doc, line, colWidthMm)) {
        doc.text(tl, startX, y)
        y += BODY_LINE_H_MM
      }
    }
  }
  if (block.idLine && block.idLine.trim()) {
    y += PARTY_BLOCK_GAP_MM
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(PT.small)
    doc.setTextColor(82, 82, 90)
    for (const tl of pdfSplitLines(doc, block.idLine, colWidthMm)) {
      doc.text(tl, startX, y)
      y += BODY_LINE_H_MM * 0.92
    }
  }
  doc.setTextColor(0, 0, 0)
}

