# Vercel PDF download protection (invoice-app)

This project is a Vite SPA deployed on Vercel. The invoice builder stays public, but **PDF downloads** go through a serverless endpoint so you can rate-limit bot abuse.

## What changed

- **Protected route**: `POST /api/download-invoice`
- The browser sends the invoice JSON payload to this endpoint.
- The endpoint generates the PDF and responds with the file as an attachment.

## Firewall rule (starting point)

In **Vercel → Project → Security → Firewall**:

- **Protect path**: `/api/download-invoice`
- **Method**: `POST`
- **Suggested rate limit**: **5 requests / minute** per source (IP)
- **Action**: Block / Rate limit (should result in a **429-style** response)

This targets only PDF downloads and does not affect normal browsing or editing the builder.

## How to test

1. Deploy to Vercel.
2. Open the app and click **Download PDF** a few times quickly.
3. After crossing the limit, the download should fail and the UI should show:
   - **“Too many download attempts. Please try again shortly.”**

## Local development

Vercel Firewall does not apply locally. To test the endpoint locally you can still use:

```bash
npm run dev
```

The frontend calls `POST /api/download-invoice`. When running locally without Vercel functions, you can either:

- run via Vercel CLI (recommended for endpoint testing), or
- deploy to Vercel for real rate-limit validation.

## Notes

- The endpoint sets `Cache-Control: no-store` to avoid caching user invoice content.
- PDF generation uses the same layout code as the on-screen invoice preview/PDF export utilities.

