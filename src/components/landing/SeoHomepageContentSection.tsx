import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../../constants/translations'

export interface SeoHomepageContentSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

/**
 * Crawlable SEO copy for the marketing homepage (Danish/English via translations).
 * Placed below the hero; uses H2 only — the page H1 remains in HeroSection.
 */
export function SeoHomepageContentSection({ t }: SeoHomepageContentSectionProps) {
  const l = t.landing
  const invoiceContentsItems = [
    l.seoInvoiceContentsLi1,
    l.seoInvoiceContentsLi2,
    l.seoInvoiceContentsLi3,
    l.seoInvoiceContentsLi4,
    l.seoInvoiceContentsLi5,
    l.seoInvoiceContentsLi6,
  ]

  return (
    <section className="border-b border-zinc-100 bg-white py-16 sm:py-20" aria-labelledby="seo-homepage-content">
      <div className={`${shell} max-w-3xl`}>
        <h2 id="seo-homepage-content" className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {l.seoHomepageHeading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoHomepageIntro}</p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {l.seoH2OnlineTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoH2OnlineBody}</p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {l.seoH2InvoiceContentsTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoH2InvoiceContentsIntro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600">
          {invoiceContentsItems.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoH2InvoiceContentsOutro}</p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {l.seoH2FreelancerTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoFreelancerBody1}</p>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.seoFreelancerBody2}</p>

        <p className="mt-8 text-base leading-relaxed text-zinc-600">
          {l.seoInternalLinksBefore}
          <Link
            to="/gratis-faktura-program"
            className="font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700"
          >
            {l.seoInternalLinkAnchorGratis}
          </Link>
          {l.seoInternalLinksMiddle}
          <Link
            to="/lav-faktura-online"
            className="font-medium text-brand-800 underline underline-offset-4 transition-colors hover:text-brand-700"
          >
            {l.seoInternalLinkAnchorLav}
          </Link>
          {l.seoInternalLinksAfter}
        </p>
      </div>
    </section>
  )
}
