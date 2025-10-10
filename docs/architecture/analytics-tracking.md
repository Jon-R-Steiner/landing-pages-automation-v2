# Analytics & Tracking

## Google Tag Manager (GTM)

**Version:** N/A (Script tag)

**Purpose:** Tag management, conversion tracking, third-party script orchestration

**Implementation (`src/app/layout.tsx`):**
```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GTM - Deferred to preserve LCP */}
        <Script
          id="gtm"
          strategy="lazyOnload" // Load AFTER LCP
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Key Events Tracked:**
- `form_start` - User begins Stage 1
- `form_stage_2` - User advances to Stage 2
- `form_stage_3` - User advances to Stage 3
- `form_submit` - Form submitted successfully
- `form_error` - Form submission failed

---

## CallRail Dynamic Number Insertion

**Version:** N/A (Script tag)

**Purpose:** Track phone calls from landing pages with dynamic number swapping

**Implementation:**
```tsx
<Script
  src={`https://cdn.callrail.com/companies/${process.env.NEXT_PUBLIC_CALLRAIL_COMPANY_ID}/` +
       `${process.env.NEXT_PUBLIC_CALLRAIL_SCRIPT_ID}/12/swap.js`}
  strategy="lazyOnload" // Load AFTER LCP
/>
```

**Note:** Static sites + dynamic numbers = complex. See ADR-023 for implementation strategy.

---

## Google Analytics 4 (GA4)

**Version:** N/A (gtag.js via GTM)

**Purpose:** Page views, user behavior, conversion funnel tracking

**Implementation:** Managed via GTM (no direct script tag)

**Key Metrics Tracked:**
- Page views (service, location combinations)
- Form funnel (3-stage progression)
- Conversion events (form submissions)
- User demographics (age, location, device)

---
