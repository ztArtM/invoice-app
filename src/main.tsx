import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/invoicePreview.css'
import App from './App.tsx'

/**
 * Static SEO block in index.html is for non-JS crawlers and the raw HTML response.
 * Remove once JS runs so we do not duplicate the same section next to the React-rendered landing page.
 */
document.getElementById('seo-homepage-prerender')?.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
