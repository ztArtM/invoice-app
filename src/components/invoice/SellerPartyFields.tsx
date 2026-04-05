import type { ChangeEvent } from 'react'
import { CompanyCvrLookup } from '../CompanyCvrLookup'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, PartyContact, SetInvoiceDocument } from '../../types/invoiceDocument'
import { formatVatNumber } from '../../services/invoicing/invoiceRules'
import { FormTextArea } from './FormTextArea'
import { FormTextField } from './FormTextField'

interface SellerPartyFieldsProps {
  t: TranslationMessages
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

export function SellerPartyFields({ t, invoiceDocument, setInvoiceDocument }: SellerPartyFieldsProps) {
  const seller = invoiceDocument.seller
  const fm = t.form

  const handleContactChange =
    (field: keyof PartyContact) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setInvoiceDocument((previous) => ({
        ...previous,
        seller: { ...previous.seller, [field]: value },
      }))
    }

  const handleSellerCvrDigitsChange = (digits: string) => {
    setInvoiceDocument((previous) => ({
      ...previous,
      seller: {
        ...previous.seller,
        sellerCvrNumber: digits,
        vatNumber: formatVatNumber(previous.seller.countryCode, previous.seller.vatNumber, digits),
      },
    }))
  }

  const handleLookupSuccess = (fields: { name: string; address: string; cvrNumber: string }) => {
    setInvoiceDocument((previous) => ({
      ...previous,
      seller: {
        ...previous.seller,
        name: fields.name || previous.seller.name,
        address: fields.address || previous.seller.address,
        sellerCvrNumber: fields.cvrNumber || previous.seller.sellerCvrNumber,
        vatNumber: formatVatNumber(
          previous.seller.countryCode,
          previous.seller.vatNumber,
          fields.cvrNumber || previous.seller.sellerCvrNumber,
        ),
      },
    }))
  }

  return (
    <>
      <CompanyCvrLookup
        formMessages={fm}
        cvrNumber={seller.sellerCvrNumber}
        onCvrDigitsChange={handleSellerCvrDigitsChange}
        onLookupSuccess={handleLookupSuccess}
        idPrefix="seller"
      />
      <FormTextField
        id="seller-name"
        label={fm.businessOrYourName}
        type="text"
        value={seller.name}
        onChange={handleContactChange('name')}
        autoComplete="organization"
      />
      <FormTextArea
        id="seller-address"
        label={fm.address}
        rows={3}
        value={seller.address}
        onChange={handleContactChange('address')}
      />
    </>
  )
}
