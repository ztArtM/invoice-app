import { HOMEPAGE_FAQ_HEADING, HOMEPAGE_FAQ_ITEMS } from '../../constants/homepageFaqDa'

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

/**
 * Danish FAQ for the marketing homepage (crawlable; no accordion).
 * Shown when UI language is Danish so copy matches FAQ JSON-LD.
 */
export function HomepageFaqSection() {
  return (
    <section className="border-b border-zinc-100 bg-white py-16 sm:py-20" aria-labelledby="homepage-faq">
      <div className={`${shell} max-w-3xl`}>
        <h2 id="homepage-faq" className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {HOMEPAGE_FAQ_HEADING}
        </h2>

        {HOMEPAGE_FAQ_ITEMS.map((item, index) => (
          <div key={item.question}>
            <h3
              className={`text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl ${index === 0 ? 'mt-6' : 'mt-8'}`}
            >
              {item.question}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
