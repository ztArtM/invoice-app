import type { ChangeEvent } from 'react'
import { CompanyCvrLookup } from '../CompanyCvrLookup'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, PartyContact, SetInvoiceDocument, SellerParty } from '../../types/invoiceDocument'
import { formatVatNumber } from '../../services/invoicing/invoiceRules'
import { formLabelClassName, formSelectClassName } from './formFieldClassNames'
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

  const handleSellerTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const sellerType = event.target.value as SellerParty['sellerType']
    setInvoiceDocument((previous) => ({
      ...previous,
      seller: {
        ...previous.seller,
        sellerType,
        sellerCvrNumber: sellerType === 'privatePerson' ? '' : previous.seller.sellerCvrNumber,
        vatNumber: sellerType === 'privatePerson' ? '' : previous.seller.vatNumber,
      },
      // Requirement: private seller → VAT set to 0%
      vat: {
        ...previous.vat,
        ratePercent: sellerType === 'privatePerson' ? 0 : previous.vat.ratePercent,
      },
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

  const isCompany = seller.sellerType === 'company'

  return (
    <>
      <div>
        <label htmlFor="seller-type" className={formLabelClassName}>
          {fm.sellerTypeLabel}
        </label>
        <select
          id="seller-type"
          className={formSelectClassName}
          value={seller.sellerType}
          onChange={handleSellerTypeChange}
        >
          <option value="privatePerson">{fm.sellerTypePrivate}</option>
          <option value="company">{fm.sellerTypeCompany}</option>
        </select>
      </div>

      {isCompany ? (
        <CompanyCvrLookup
          formMessages={fm}
          cvrNumber={seller.sellerCvrNumber}
          onCvrDigitsChange={handleSellerCvrDigitsChange}
          idPrefix="seller"
        />
      ) : null}
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
