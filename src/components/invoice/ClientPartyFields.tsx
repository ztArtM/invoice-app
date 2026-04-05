import type { ChangeEvent } from 'react'
import { CompanyCvrLookup } from '../CompanyCvrLookup'
import type { TranslationMessages } from '../../constants/translations'
import type { ClientParty, InvoiceDocument, PartyContact, SetInvoiceDocument } from '../../types/invoiceDocument'
import { COUNTRY_OPTIONS } from '../../constants/countries'
import { formatVatNumber } from '../../services/invoicing/invoiceRules'
import { formLabelClassName, formSelectClassName } from './formFieldClassNames'
import { FormTextArea } from './FormTextArea'
import { FormTextField } from './FormTextField'

interface ClientPartyFieldsProps {
  t: TranslationMessages
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

export function ClientPartyFields({ t, invoiceDocument, setInvoiceDocument }: ClientPartyFieldsProps) {
  const client = invoiceDocument.client
  const fm = t.form

  const handleContactChange =
    (field: keyof PartyContact) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setInvoiceDocument((previous) => ({
        ...previous,
        client: { ...previous.client, [field]: value },
      }))
    }

  const handleClientTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const clientType = event.target.value as ClientParty['clientType']
    setInvoiceDocument((previous) => ({
      ...previous,
      client: {
        ...previous.client,
        clientType,
        clientCvrNumber: clientType === 'privatePerson' ? '' : previous.client.clientCvrNumber,
      },
    }))
  }

  const handleClientCvrDigitsChange = (digits: string) => {
    setInvoiceDocument((previous) => ({
      ...previous,
      client: {
        ...previous.client,
        clientCvrNumber: digits,
        vatNumber: formatVatNumber(previous.client.countryCode, previous.client.vatNumber, digits),
      },
    }))
  }

  const handleLookupSuccess = (fields: { name: string; address: string; cvrNumber: string }) => {
    setInvoiceDocument((previous) => ({
      ...previous,
      client: {
        ...previous.client,
        name: fields.name || previous.client.name,
        address: fields.address || previous.client.address,
        clientCvrNumber: fields.cvrNumber || previous.client.clientCvrNumber,
        vatNumber: formatVatNumber(
          previous.client.countryCode,
          previous.client.vatNumber,
          fields.cvrNumber || previous.client.clientCvrNumber,
        ),
      },
    }))
  }

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value.trim().toUpperCase()
    setInvoiceDocument((previous) => ({
      ...previous,
      client: {
        ...previous.client,
        countryCode,
        countryCodeOverride: countryCode === 'OTHER' ? previous.client.countryCodeOverride : '',
        vatNumber: formatVatNumber(countryCode, previous.client.vatNumber, previous.client.clientCvrNumber),
      },
    }))
  }

  const handleCountryOverrideChange = (event: ChangeEvent<HTMLInputElement>) => {
    const countryCodeOverride = event.target.value.trim().toUpperCase()
    setInvoiceDocument((previous) => ({
      ...previous,
      client: { ...previous.client, countryCodeOverride },
    }))
  }

  const handleVatNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const vatNumber = event.target.value
    setInvoiceDocument((previous) => ({
      ...previous,
      client: { ...previous.client, vatNumber },
    }))
  }

  const isCompany = client.clientType === 'company'
  const isDanish = client.countryCode.trim().toUpperCase() === 'DK'
  const isOther = client.countryCode.trim().toUpperCase() === 'OTHER'

  return (
    <>
      <div>
        <label htmlFor="client-country" className={formLabelClassName}>
          {fm.country}
        </label>
        <select
          id="client-country"
          className={formSelectClassName}
          value={client.countryCode}
          onChange={handleCountryChange}
        >
          {COUNTRY_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.labelEn} ({o.code})
            </option>
          ))}
        </select>
      </div>

      {isOther ? (
        <FormTextField
          id="client-country-override"
          label={fm.country}
          type="text"
          value={client.countryCodeOverride}
          onChange={handleCountryOverrideChange}
          autoComplete="off"
        />
      ) : null}
      <div>
        <label htmlFor="client-type" className={formLabelClassName}>
          {fm.clientTypeLabel}
        </label>
        <select
          id="client-type"
          className={formSelectClassName}
          value={client.clientType}
          onChange={handleClientTypeChange}
        >
          <option value="privatePerson">{fm.clientTypePrivate}</option>
          <option value="company">{fm.clientTypeCompany}</option>
        </select>
      </div>

      {isCompany && isDanish ? (
        <CompanyCvrLookup
          formMessages={fm}
          cvrNumber={client.clientCvrNumber}
          onCvrDigitsChange={handleClientCvrDigitsChange}
          onLookupSuccess={handleLookupSuccess}
          idPrefix="client"
        />
      ) : null}

      {isCompany && !isDanish ? (
        <FormTextField
          id="client-vat-number"
          label={fm.vatNumber}
          type="text"
          value={client.vatNumber}
          onChange={handleVatNumberChange}
          autoComplete="off"
        />
      ) : null}

      <FormTextField
        id="client-name"
        label={fm.clientName}
        type="text"
        value={client.name}
        onChange={handleContactChange('name')}
      />
      <FormTextArea
        id="client-address"
        label={fm.address}
        rows={3}
        value={client.address}
        onChange={handleContactChange('address')}
      />
    </>
  )
}
