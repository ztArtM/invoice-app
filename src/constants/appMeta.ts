export const appMeta = {
  /** Public-facing app name (footer, legal pages). */
  appName: 'FakturaApp',
  /**
   * Legal entity/person responsible for the service.
   * TODO: Replace before launch.
   */
  publisherName: 'Artem Barabash',
  /**
   * Support / privacy email used on Contact + Privacy pages.
   * TODO: Replace before launch.
   */
  supportEmail: 'infofakturadk@gmail.com',
  /** Last updated / effective date shown on legal pages. TODO: Update before launch. */
  effectiveDate: '2026-04-01',
  /** This app stores drafts locally in the browser (localStorage). */
  usesLocalStorage: true,
  /** Feedback is sent via embedded Tally forms (third-party). */
  usesTallyForFeedback: true,
  /** This app does not include analytics/tracking in the current codebase. */
  usesAnalyticsOrTracking: false,
} as const

