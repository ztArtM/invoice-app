import type { Language } from './invoiceTypes'

export type PdfMessages = {
  preview: {
    documentInvoice: string
    documentQuote: string
    numberInvoice: string
    numberQuote: string
    issueDate: string
    dueDate: string
    validUntil: string
    currency: string
    from: string
    billTo: string
    thDescription: string
    thQty: string
    thUnitPrice: string
    thAmount: string
    lineItemsHeading: string
    notes: string
    mobilePay: string
    paymentDetails: string
    bank: string
    registrationNumber: string
    accountNumber: string
    accountHolder: string
    iban: string
    bicSwift: string
    paymentRef: string
    cvrLabel: string
    vatNoLabel: string
  }
  lineItems: {
    heading: string
    thDescription: string
    thQty: string
    thUnitPrice: string
  }
  totals: {
    heading: string
    subtotalExVat: string
    vatWithPercent: string // contains {{percent}}
    totalDue: string
  }
  pdf: {
    couldNotCreate: string
  }
}

export function pdfMessagesForLanguage(lang: Language): PdfMessages {
  if (lang === 'da') {
    return {
      preview: {
        documentInvoice: 'Faktura',
        documentQuote: 'Tilbud',
        numberInvoice: 'Fakturanr.',
        numberQuote: 'Tilbudsnr.',
        issueDate: 'Dato',
        dueDate: 'Forfaldsdato',
        validUntil: 'Gyldig til',
        currency: 'Valuta',
        from: 'Fra',
        billTo: 'Fakturer til',
        thDescription: 'Beskrivelse',
        thQty: 'Antal',
        thUnitPrice: 'Stk. pris',
        thAmount: 'Beløb',
        lineItemsHeading: 'Linjer',
        notes: 'Noter',
        mobilePay: 'MobilePay',
        paymentDetails: 'Betalingsoplysninger',
        bank: 'Bank',
        registrationNumber: 'Reg.nr.',
        accountNumber: 'Konto',
        accountHolder: 'Kontohaver',
        iban: 'IBAN',
        bicSwift: 'BIC/SWIFT',
        paymentRef: 'Betalingsreference',
        cvrLabel: 'CVR',
        vatNoLabel: 'VAT-nr.',
      },
      lineItems: {
        heading: 'Linjer',
        thDescription: 'Beskrivelse',
        thQty: 'Antal',
        thUnitPrice: 'Stk. pris',
      },
      totals: {
        heading: 'Oversigt',
        subtotalExVat: 'Subtotal (ekskl. moms)',
        vatWithPercent: 'Moms ({{percent}}%)',
        totalDue: 'Total til betaling',
      },
      pdf: {
        couldNotCreate: 'Kunne ikke oprette PDF.',
      },
    }
  }

  return {
    preview: {
      documentInvoice: 'Invoice',
      documentQuote: 'Quote',
      numberInvoice: 'Invoice no.',
      numberQuote: 'Quote no.',
      issueDate: 'Issue date',
      dueDate: 'Due date',
      validUntil: 'Valid until',
      currency: 'Currency',
      from: 'From',
      billTo: 'Bill to',
      thDescription: 'Description',
      thQty: 'Qty',
      thUnitPrice: 'Unit price',
      thAmount: 'Amount',
      lineItemsHeading: 'Line items',
      notes: 'Notes',
      mobilePay: 'MobilePay',
      paymentDetails: 'Payment details',
      bank: 'Bank',
      registrationNumber: 'Registration no.',
      accountNumber: 'Account no.',
      accountHolder: 'Account holder',
      iban: 'IBAN',
      bicSwift: 'BIC/SWIFT',
      paymentRef: 'Payment reference',
      cvrLabel: 'CVR',
      vatNoLabel: 'VAT No.',
    },
    lineItems: {
      heading: 'Line items',
      thDescription: 'Description',
      thQty: 'Qty',
      thUnitPrice: 'Unit price',
    },
    totals: {
      heading: 'Summary',
      subtotalExVat: 'Subtotal (excl. VAT)',
      vatWithPercent: 'VAT ({{percent}}%)',
      totalDue: 'Total due',
    },
    pdf: {
      couldNotCreate: 'Could not create the PDF.',
    },
  }
}

