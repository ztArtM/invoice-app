# FakturaLyn

A small **frontend-only** app for freelancers. You fill out a form on the left and see a live **invoice or quote** on the right. You can **print** it or **save a PDF**. Your work is **autosaved in the browser** (no login, no server).

---

## What this project does

- Create an **invoice** or a **quote** (same form, different label).
- Enter **your details**, **client details**, **line items**, **VAT**, **payment info**, and **notes**.
- See **subtotal, VAT, and total** update automatically.
- **Print** or **Save as PDF**.
- **Draft autosave**: if you close the tab and come back, your last draft is still there (on the same browser and device).

---

## Tech stack (the tools we use)

| Tool | What it is for |
|------|----------------|
| **React** | Builds the user interface with reusable pieces called *components*. |
| **TypeScript** | Adds *types* to JavaScript so the editor can catch mistakes early. |
| **Vite** | Starts a fast dev server and bundles the app for production. |
| **Tailwind CSS** | Utility classes in HTML/JSX for layout and styling. |
| **jsPDF** | Creates the downloadable PDF file in the browser. |

There is **no backend**, **no database**, and **no login**—everything runs in your browser.

## Production / GitHub notes

- **Do not commit `.env` files.** Use `.env.example` as the template and set secrets in your hosting provider instead.
- **Update publisher/contact metadata before going public:** see `src/constants/appMeta.ts` (`publisherName`, `supportEmail`, `effectiveDate`).
- **Indexing policy:** landing, `/builder`, and legal routes are indexable (see `SeoManager`).

---

## URL routes (SPA)

| Path | Content |
|------|--------|
| `/` | Marketing landing |
| `/builder` | Invoice & quote editor + preview |
| `/privacy`, `/terms`, `/contact`, `/cookies` | Legal pages |

Old hash links (`/#privacy`, …) redirect once to the matching path (`HashToPathRedirect`). Internal links use `react-router-dom` (`Link`, `navigate`).

---

## Folder structure (what lives where)

```
src/
├── App.tsx                 # Top level: holds all invoice data in state + localStorage save
├── main.tsx                # Starts React and loads global CSS
├── index.css               # Tailwind + a few global styles (print, focus)
├── types/
│   └── invoiceDocument.ts  # TypeScript shapes: invoice, parties, line items, etc.
├── constants/
│   ├── defaultInvoiceDocument.ts  # Empty “starting” invoice
│   ├── localization.ts            # Language → locale; supported currencies (DKK, EUR, USD)
│   ├── sampleInvoiceDocument.ts   # Example filled invoice (for testing)
│   ├── storageKeys.ts             # localStorage key name
│   └── translations.ts            # UI strings (en / da)
├── utils/
│   ├── invoiceCalculations.ts    # Subtotal, VAT, totals (pure math)
│   ├── formatCurrency.ts         # Money display via Intl.NumberFormat
│   ├── formatDate.ts             # Date display via Intl.DateTimeFormat
│   ├── createId.ts               # IDs for new line items
│   ├── invoiceDraftStorage.ts    # Read/write/validate draft in localStorage
│   ├── exportInvoiceToPdf.ts     # Build and download the PDF
│   ├── printDocument.ts          # Opens the browser print dialog
│   └── gettingStartedTips.ts     # Friendly checklist when fields are empty
└── components/invoice/
    ├── InvoiceWorkspace.tsx      # Page layout, toolbar, tips banner
    ├── InvoiceEditor.tsx         # Wraps the form card
    ├── InvoiceForm.tsx           # All form sections and inputs
    ├── InvoicePreview.tsx        # Read-only preview (and print view)
    ├── LineItemsEditor.tsx       # Table of line items
    ├── TotalsSummary.tsx         # Subtotal / VAT / total block
    ├── FormSection, FormTextField, FormTextArea  # Reusable form bits
    └── …                         # Other small UI helpers
```

**Rule of thumb:**  
- **`types`** = data shape.  
- **`constants`** = starting values and fixed strings like storage keys.  
- **`utils`** = plain functions (math, formatting, PDF, storage).  
- **`components`** = what you see on screen (React).

---

## How invoice data flows (React basics)

Think of **one big JavaScript object** that holds the whole invoice. In React we keep that object in **state** so when it changes, the screen updates.

1. **`App.tsx`** creates the state:
   - `invoiceDocument` = the current data.
   - `setInvoiceDocument` = the function that updates that data.

2. **`App.tsx`** passes them down as **props** into **`InvoiceWorkspace`**, then into **`InvoiceEditor`** / **`InvoiceForm`** (to edit) and **`InvoicePreview`** (to display).

3. When you type in an input, the form calls **`setInvoiceDocument`** with a **new** object (we copy the old data and change one field). React re-renders, so the **preview** and **totals** stay in sync.

```text
App (state: invoiceDocument)
        │
        ├──► InvoiceWorkspace
        │         ├──► InvoiceEditor → InvoiceForm (edits state)
        │         └──► InvoicePreview (reads state)
        │
        └──► useEffect saves invoiceDocument to localStorage (debounced)
```

**Props** are just “arguments” you pass from a parent component to a child. **State** is data that can change over time; only the owner (here, `App`) should change it directly, usually through `setInvoiceDocument`.

---

## How to run the project

You need **Node.js** installed (LTS version is fine).

```bash
# Install dependencies (once)
npm install

# Start dev server — open the URL shown in the terminal (usually http://localhost:5173)
npm run dev

# Check types and build for production
npm run build

# Preview the production build locally
npm run preview

# Lint (code style checks)
npm run lint
```

---

## Environment variables

This app runs without any env vars by default, but some features and production SEO need configuration.

### Required for production

- **`VITE_SITE_URL`**: your production origin, no trailing slash (used for canonical URLs, JSON-LD, `robots.txt`, `sitemap.xml`).

Example:

```bash
VITE_SITE_URL=https://your-domain.com
```

### Optional (recommended)

- **`VITE_OG_IMAGE_URL`**: absolute URL to a social share image (PNG/JPG/WebP, ~1200×630).
- **`VITE_TWITTER_SITE`**: twitter handle without `@` for `twitter:site`.

### Optional (feedback)

- **`VITE_TALLY_FEEDBACK_FORM_EN`**
- **`VITE_TALLY_FEEDBACK_FORM_DA`**

### Optional (CVR company lookup — local dev API + Vercel)

**Local dev** (`npm run dev:api` / `npm run dev:with-api`):

- `CVR_DEV_API_PORT` (default `8787`)
- `CVRAPI_USER_AGENT` (recommended by CVRAPI)
- `CVRAPI_TOKEN`, `CVRAPI_VERSION` (optional)

**Vercel (production):** the repo includes `api/company-lookup.ts`, which Vercel deploys as `POST /api/company-lookup` (same path the UI calls). In the Vercel project **Environment Variables**, set at least:

- `CVRAPI_USER_AGENT` (ASCII — required by CVRAPI)
- `CVRAPI_TOKEN`, `CVRAPI_VERSION` (optional)

Optional: `CORS_ALLOW_ORIGIN` if you need a specific origin (defaults to `*`). See `.env.example`.

See `.env.example` for a ready template.

---

## Build & deploy

```bash
npm run build
```

**Vercel (recommended for this repo):** connect the GitHub repo; Vercel runs `npm run build`, serves the Vite app from `dist/`, and deploys **serverless** routes from the root `api/` folder (`vercel.json` includes an SPA rewrite that does not override `/api/*`). CVR lookup works in production once `CVRAPI_*` env vars are set (see above).

Deploy the `dist/` folder to any static host (Netlify, Cloudflare Pages, GitHub Pages) if you do not need the CVR API in production.

- **SPA routing:** configure your host to serve `index.html` for unknown paths (or use `vercel.json` on Vercel).
- **Sitemap/robots:** generated at build time from `scripts/buildSitemapXml.ts` using `VITE_SITE_URL`. If you forget to set it, output defaults to `https://yourdomain.com` and should be fixed before launch.

---

## Where calculations live

All **money math** is in **`src/utils/invoiceCalculations.ts`**.

Examples:

- **Line total** = quantity × unit price  
- **Subtotal** = sum of line totals  
- **VAT** = subtotal × (VAT rate ÷ 100)  
- **Grand total** = subtotal + VAT  

The **form** and **preview** (and **PDF**) should use these helpers so numbers always match. **Formatting** (currency and dates) uses **`formatCurrency.ts`** and **`formatDate.ts`** with the browser’s **`Intl`** APIs.

---

## Where PDF export lives

- **Main logic:** **`src/utils/exportInvoiceToPdf.ts`**  
  - Takes an **`InvoiceDocument`**.  
  - Uses **jsPDF** to draw the PDF (text, table, sections).  
  - Uses the same **calculation** and **formatting** helpers as the UI where possible.  
  - On failure, it throws an **`Error`** so the UI can show a message.

- **Button:** **`InvoiceWorkspace.tsx`** calls **`exportInvoiceToPdf`** (with the document, translations, locale, and currency) when you click **Save as PDF**.

---

## How localStorage works

**localStorage** is a simple key–value store in the **browser**. It survives page reloads but is **not** synced across devices or browsers.

1. **Key:** defined in **`src/constants/storageKeys.ts`** (`INVOICE_DRAFT_STORAGE_KEY`).

2. **Load on startup:** **`App.tsx`** runs **`loadInvoiceDraftFromLocalStorage()`** when the app first loads. If the saved JSON is missing or invalid, it falls back to **`createDefaultInvoiceDocument()`**.

3. **Save on change:** **`App.tsx`** uses **`useEffect`**. Whenever **`invoiceDocument`** changes, it waits a short moment (**debounce**, 400 ms), then calls **`saveInvoiceDraftToLocalStorage`**. That way we do not write to disk on every keystroke.

4. **Safety:** **`invoiceDraftStorage.ts`** checks the saved JSON shape before trusting it. Bad data is ignored so the app does not crash.

---

## Ideas for future improvements

- **Lazy-load PDF code** so the first page loads faster (`import()` when clicking Save as PDF).  
- **“Clear draft”** button to reset the form and storage.  
- **More currencies / locales** (formatting with `Intl`).  
- **Company logo** on the PDF and preview.  
- **Multiple saved invoices** (list + pick one)—needs a slightly bigger data model.  
- **Tests** for `invoiceCalculations` and storage validation.  
- **Export JSON** for backup, or import a saved file.

---

## License

Private project — adjust as you like.
