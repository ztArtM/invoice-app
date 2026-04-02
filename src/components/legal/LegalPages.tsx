import type { TranslationMessages } from '../../constants/translations'
import { appMeta } from '../../constants/appMeta'
import { INVOICE_DRAFT_STORAGE_KEY } from '../../constants/storageKeys'

export function PrivacyPolicyContent({ t }: { t: TranslationMessages }) {
  const p = t.legal.privacy
  return (
    <>
      <h2>{p.summaryTitle}</h2>
      <p>{p.summaryBody}</p>

      <h2>{p.dataWeStoreTitle}</h2>
      <ul>
        <li>
          <strong>{p.localDraftsLabel}</strong> {p.localDraftsBody}
        </li>
        <li>
          <strong>{p.printPdfLabel}</strong> {p.printPdfBody}
        </li>
        <li>
          <strong>{p.feedbackLabel}</strong> {p.feedbackBody}
        </li>
      </ul>

      <h2>{p.localStorageTitle}</h2>
      <p>{p.localStorageBody}</p>
      <p>
        <strong>{p.localStorageKeyLabel}</strong> <code>{INVOICE_DRAFT_STORAGE_KEY}</code>
      </p>

      <h2>{p.thirdPartiesTitle}</h2>
      <p>{p.thirdPartiesBody}</p>
      <ul>
        <li>
          <strong>Tally</strong> — {p.tallyBody}
        </li>
      </ul>

      <h2>{p.cookiesTitle}</h2>
      <p>
        {appMeta.usesAnalyticsOrTracking ? p.cookiesWithTracking : p.cookiesNoTracking}
      </p>

      <h2>{p.yourChoicesTitle}</h2>
      <ul>
        <li>{p.choiceClearStorage}</li>
        <li>{p.choiceDisableThirdParty}</li>
      </ul>

      <h2>{p.contactTitle}</h2>
      <p>
        {p.contactBody} <a href={`mailto:${appMeta.supportEmail}`}>{appMeta.supportEmail}</a>.
      </p>
    </>
  )
}

export function TermsContent({ t }: { t: TranslationMessages }) {
  const p = t.legal.terms
  return (
    <>
      <h2>{p.asIsTitle}</h2>
      <p>{p.asIsBody}</p>

      <h2>{p.userResponsibilityTitle}</h2>
      <p>{p.userResponsibilityBody}</p>

      <h2>{p.acceptableUseTitle}</h2>
      <ul>
        <li>{p.acceptableUse1}</li>
        <li>{p.acceptableUse2}</li>
      </ul>

      <h2>{p.liabilityTitle}</h2>
      <p>{p.liabilityBody}</p>

      <h2>{p.changesTitle}</h2>
      <p>{p.changesBody}</p>

      <h2>{p.contactTitle}</h2>
      <p>
        {p.contactBody} <a href={`mailto:${appMeta.supportEmail}`}>{appMeta.supportEmail}</a>.
      </p>
    </>
  )
}

export function ContactContent({
  t,
  onClearLocalData,
}: {
  t: TranslationMessages
  onClearLocalData: () => void
}) {
  const p = t.legal.contact
  return (
    <>
      <h2>{p.supportTitle}</h2>
      <p>
        {p.supportBody} <a href={`mailto:${appMeta.supportEmail}`}>{appMeta.supportEmail}</a>.
      </p>
      <p>{p.feedbackHint}</p>

      <h2>{p.troubleshootingTitle}</h2>
      <ul>
        <li>{p.troubleshooting1}</li>
        <li>{p.troubleshooting2}</li>
      </ul>

      <h2>{p.clearLocalTitle}</h2>
      <p>{p.clearLocalBody}</p>
      <button
        type="button"
        onClick={onClearLocalData}
        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        {p.clearLocalButton}
      </button>
    </>
  )
}

export function CookiesContent({ t }: { t: TranslationMessages }) {
  const p = t.legal.cookies
  return (
    <>
      <h2>{p.title}</h2>
      <p>{p.body1}</p>
      <p>{p.body2}</p>
    </>
  )
}

