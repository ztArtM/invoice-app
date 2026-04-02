import { useEffect, type ChangeEvent } from 'react'
import {
  defaultSymbolForCurrencyCode,
  SUPPORTED_CURRENCY_CODES,
  type SupportedCurrencyCode,
} from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { DocumentKind, InvoiceDocument, PaymentDetails, SetInvoiceDocument } from '../../types/invoiceDocument'
import {
  normalizeAccountNumberDigits,
  normalizeRegistrationNumberDigits,
} from '../../utils/bankPaymentInput'
import { calculateInvoiceTotalsSummary } from '../../utils/invoiceCalculations'
import {
  determineInvoiceType,
  determineTaxNote,
  determineVatRatePercent,
  formatVatNumber,
} from '../../services/invoicing/invoiceRules'
import { ClientPartyFields } from './ClientPartyFields'
import { formInputClassName, formLabelClassName, formSelectClassName } from './formFieldClassNames'
import { FormSection } from './FormSection'
import { FormSubsection } from './FormSubsection'
import { FormTextArea } from './FormTextArea'
import { FormTextField } from './FormTextField'
import { LineItemsEditor } from './LineItemsEditor'
import { SellerPartyFields } from './SellerPartyFields'
import { tertiaryButtonClassName } from './buttonStyles'
import { TotalsSummary } from './TotalsSummary'

interface InvoiceFormProps {
  t: TranslationMessages
  localeForFormatting: string
  activeCurrencyCode: SupportedCurrencyCode
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

export function InvoiceForm({
  t,
  localeForFormatting,
  activeCurrencyCode,
  invoiceDocument,
  setInvoiceDocument,
}: InvoiceFormProps) {
  const showInternationalBankDetails =
    invoiceDocument.paymentDetails.iban.trim() !== '' ||
    invoiceDocument.paymentDetails.bicOrSwift.trim() !== ''

  // EU invoice rules (DK → EU/non‑EU): auto-classify and force VAT/tax note.
  useEffect(() => {
    setInvoiceDocument((previous) => {
      const invoiceType = determineInvoiceType({
        sellerCountryCode: previous.seller.countryCode,
        buyerCountryCode:
          previous.client.countryCode === 'OTHER'
            ? previous.client.countryCodeOverride
            : previous.client.countryCode,
        buyerIsBusiness: previous.client.clientType === 'company',
      })

      const sellerVatNumber = formatVatNumber(
        previous.seller.countryCode,
        previous.seller.vatNumber,
        previous.seller.sellerCvrNumber,
      )
      const clientVatNumber = formatVatNumber(
        previous.client.countryCode,
        previous.client.vatNumber,
        previous.client.clientCvrNumber,
      )

      const effectiveVatRatePercent = determineVatRatePercent({
        invoiceType,
        domesticVatRatePercent: 25,
      })

      const taxNote = determineTaxNote(invoiceType, {
        reverseCharge: t.form.taxNoteReverseCharge,
        exportOutsideScope: t.form.taxNoteExportOutsideScope,
      })
      const nextVatRate = effectiveVatRatePercent
      const changed =
        previous.invoiceType !== invoiceType ||
        previous.taxNote !== taxNote ||
        previous.vat.ratePercent !== nextVatRate ||
        previous.seller.vatNumber !== sellerVatNumber ||
        previous.client.vatNumber !== clientVatNumber

      if (!changed) return previous

      return {
        ...previous,
        invoiceType,
        taxNote,
        vat: { ratePercent: nextVatRate },
        seller: { ...previous.seller, vatNumber: sellerVatNumber },
        client: { ...previous.client, vatNumber: clientVatNumber },
      }
    })
  }, [
    setInvoiceDocument,
    t.form.taxNoteReverseCharge,
    t.form.taxNoteExportOutsideScope,
    invoiceDocument.seller.countryCode,
    invoiceDocument.seller.sellerCvrNumber,
    invoiceDocument.seller.vatNumber,
    invoiceDocument.client.countryCode,
    invoiceDocument.client.clientType,
    invoiceDocument.client.clientCvrNumber,
    invoiceDocument.client.vatNumber,
    invoiceDocument.client.countryCodeOverride,
  ])

  const invoiceTotalsSummary = calculateInvoiceTotalsSummary(
    invoiceDocument.lineItems,
    invoiceDocument.vat.ratePercent,
  )

  const handleDocumentKindChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const documentKind = event.target.value as DocumentKind
    setInvoiceDocument((previous) => ({ ...previous, documentKind }))
  }

  const handleInvoiceNumberChange = createRootTextFieldHandler(setInvoiceDocument, 'invoiceNumber')
  const handleIssueDateChange = createRootTextFieldHandler(setInvoiceDocument, 'issueDate')
  const handleDueDateChange = createRootTextFieldHandler(setInvoiceDocument, 'dueDate')
  const handleNotesChange = createRootTextFieldHandler(setInvoiceDocument, 'notes')

  const handleCurrencyCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value as SupportedCurrencyCode
    setInvoiceDocument((previous) => ({
      ...previous,
      currency: { code, symbol: defaultSymbolForCurrencyCode(code) },
    }))
  }

  const handleMobilePayChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvoiceDocument((previous) => ({ ...previous, mobilePayNumberOrBox: event.target.value }))
  }

  const handleVatRatePercentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(event.target.value)
    const safePercent = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0
    setInvoiceDocument((previous) => ({
      ...previous,
      vat: {
        ...previous.vat,
        ratePercent: safePercent,
      },
    }))
  }

  const handlePaymentFieldChange =
    (field: keyof PaymentDetails) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setInvoiceDocument((previous) => ({
        ...previous,
        paymentDetails: { ...previous.paymentDetails, [field]: value },
      }))
    }

  const handleRegistrationNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = normalizeRegistrationNumberDigits(event.target.value)
    setInvoiceDocument((previous) => ({
      ...previous,
      paymentDetails: { ...previous.paymentDetails, registrationNumber: value },
    }))
  }

  const handleAccountNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = normalizeAccountNumberDigits(event.target.value)
    setInvoiceDocument((previous) => ({
      ...previous,
      paymentDetails: { ...previous.paymentDetails, accountNumber: value },
    }))
  }

  const numberFieldLabel =
    invoiceDocument.documentKind === 'quote' ? t.form.quoteNumber : t.form.invoiceNumber
  const dueDateFieldLabel =
    invoiceDocument.documentKind === 'quote' ? t.form.validUntil : t.form.dueDate

  return (
    <div className="space-y-6">
      <FormSection title={t.form.documentSettings} description={t.form.documentSettingsDescription}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="document-kind" className={formLabelClassName}>
              {t.form.documentType}
            </label>
            <select
              id="document-kind"
              className={formSelectClassName}
              value={invoiceDocument.documentKind}
              onChange={handleDocumentKindChange}
            >
              <option value="invoice">{t.form.optionInvoice}</option>
              <option value="quote">{t.form.optionQuote}</option>
            </select>
          </div>
          <div>
            <label htmlFor="document-currency" className={formLabelClassName}>
              {t.form.currency}
            </label>
            <select
              id="document-currency"
              className={formSelectClassName}
              value={activeCurrencyCode}
              onChange={handleCurrencyCodeChange}
              aria-label={t.form.currency}
            >
              {SUPPORTED_CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection title={t.form.sellerDetails} description={t.form.sellerDetailsDescription}>
        <SellerPartyFields
          t={t}
          invoiceDocument={invoiceDocument}
          setInvoiceDocument={setInvoiceDocument}
        />
      </FormSection>

      <FormSection title={t.form.clientDetails} description={t.form.clientDetailsDescription}>
        <ClientPartyFields
          t={t}
          invoiceDocument={invoiceDocument}
          setInvoiceDocument={setInvoiceDocument}
        />
      </FormSection>

      <FormSection title={t.form.referenceAndDates} description={t.form.referenceAndDatesDescription}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormTextField
            id="invoice-number"
            label={numberFieldLabel}
            type="text"
            value={invoiceDocument.invoiceNumber}
            onChange={handleInvoiceNumberChange}
          />
          <FormTextField
            id="issue-date"
            label={t.form.issueDate}
            type="date"
            value={invoiceDocument.issueDate}
            onChange={handleIssueDateChange}
          />
          <div className="sm:col-span-2">
            <FormTextField
              id="due-date"
              label={dueDateFieldLabel}
              type="date"
              value={invoiceDocument.dueDate}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title={t.form.taxSection} description={t.form.taxSectionDescription}>
        <div>
          <FormTextField
            id="vat-rate"
            label={t.form.vatRate}
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={invoiceDocument.vat.ratePercent}
            onChange={handleVatRatePercentChange}
            aria-describedby="vat-rate-hint"
          />
          <p id="vat-rate-hint" className="mt-2 text-xs leading-relaxed text-zinc-500">
            {t.form.vatRateHint}
          </p>
        </div>
      </FormSection>

      <FormSection  title={t.lineItems.heading} description={t.lineItems.hint}>
        <LineItemsEditor
          t={t}
          localeForFormatting={localeForFormatting}
          activeCurrencyCode={activeCurrencyCode}
          invoiceDocument={invoiceDocument}
          setInvoiceDocument={setInvoiceDocument}
        />
        <div className="pt-1">
          <TotalsSummary
            t={t}
            localeForFormatting={localeForFormatting}
            activeCurrencyCode={activeCurrencyCode}
            totals={invoiceTotalsSummary}
            vatRatePercent={invoiceDocument.vat.ratePercent}
            variant="nested"
          />
        </div>
      </FormSection>

      <FormSection title={t.form.paymentDetails} description={t.form.paymentDetailsDescription}>
        <FormSubsection title={t.form.mobilePayTitle} description={t.form.mobilePaySubtitle}>
          <div>
            <label htmlFor="mobile-pay" className={formLabelClassName}>
              {t.form.mobilePayLabel}
            </label>
            <input
              id="mobile-pay"
              type="text"
              className={formInputClassName}
              value={invoiceDocument.mobilePayNumberOrBox}
              onChange={handleMobilePayChange}
              autoComplete="off"
            />
          </div>
        </FormSubsection>

        <div className="border-t border-zinc-200/80 pt-6">
          <FormSubsection title={t.form.bankTransferTitle}>
            <FormTextField
              id="bank-name"
              label={t.form.bankName}
              type="text"
              value={invoiceDocument.paymentDetails.bankName}
              onChange={handlePaymentFieldChange('bankName')}
            />
           
            <FormTextField
              id="registration-number"
              label={t.form.registrationNumber}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="1234"
              className="tabular-nums max-w-20"
              value={invoiceDocument.paymentDetails.registrationNumber}
              onChange={handleRegistrationNumberChange}
            />
            
            <div className="max-w-30">
            <FormTextField
              id="account-number"
              label={t.form.accountNumber}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              placeholder="1234567890"
              className="tabular-nums"
              value={invoiceDocument.paymentDetails.accountNumber}
              onChange={handleAccountNumberChange}
            />
            </div>
            <FormTextField
              id="account-holder"
              label={t.form.accountHolder}
              type="text"
              value={invoiceDocument.paymentDetails.accountHolder}
              onChange={handlePaymentFieldChange('accountHolder')}
            />
            <details
              className="group"
              open={showInternationalBankDetails || undefined}
            >
              <summary
                className={`${tertiaryButtonClassName} -ml-1 inline-flex cursor-pointer items-center justify-start list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden`}
                aria-controls="international-bank-fields"
                aria-expanded={showInternationalBankDetails}
              >
                {showInternationalBankDetails
                  ? t.form.hideInternationalBankDetails
                  : t.form.showInternationalBankDetails}
              </summary>

              <div id="international-bank-fields" className="space-y-4">
                <FormTextField
                  id="iban"
                  label={t.form.iban}
                  type="text"
                  value={invoiceDocument.paymentDetails.iban}
                  onChange={handlePaymentFieldChange('iban')}
                  autoComplete="off"
                />
                <FormTextField
                  id="bic-swift"
                  label={t.form.bicSwift}
                  type="text"
                  value={invoiceDocument.paymentDetails.bicOrSwift}
                  onChange={handlePaymentFieldChange('bicOrSwift')}
                />
              </div>
            </details>
            <FormTextField
              id="payment-reference"
              label={t.form.paymentReference}
              type="text"
              value={invoiceDocument.paymentDetails.paymentReference}
              onChange={handlePaymentFieldChange('paymentReference')}
            />
          </FormSubsection>
        </div>
      </FormSection>

      <FormSection title={t.form.notesSection} description={t.form.notesDescription}>
        <FormTextArea
          id="notes"
          label={t.form.notesLabel}
          rows={4}
          value={invoiceDocument.notes}
          onChange={handleNotesChange}
          placeholder={t.form.notesPlaceholder}
        />
      </FormSection>
    </div>
  )
}

/** Names of invoice string fields that live at the top level of InvoiceDocument (not nested). */
type RootTextFieldName = 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes'

/** Shared logic for invoice #, dates, and notes — same update pattern, less copy-paste. */
function createRootTextFieldHandler(
  setInvoiceDocument: SetInvoiceDocument,
  fieldName: RootTextFieldName,
) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInvoiceDocument((previous) => ({ ...previous, [fieldName]: event.target.value }))
  }
}
