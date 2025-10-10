# Analytics and Tracking

## Google Tag Manager (GTM)

**Purpose:** Centralized tag management for conversion tracking

**Setup:**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en">
      <head>
        {/* GTM Script */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `
            }}
          />
        )}
      </head>
      <body>
        {/* GTM noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
```

**Events tracked:**
- Page views (automatic)
- Form submissions (3-stage form progress)
- Phone clicks (CallRail integration)
- CTA button clicks
- Scroll depth (engagement metric)

## Google Analytics 4 (GA4)

**Metrics to track:**
- **Traffic:** Sessions, users, page views by source/medium
- **Engagement:** Bounce rate, time on page, scroll depth
- **Conversions:** Form submissions, phone calls (via CallRail)
- **Quality Score Proxies:** LCP, CLS, FID (via Web Vitals)

**Custom Events:**
```typescript
// Send custom event to GA4 (via GTM dataLayer)
declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function trackFormSubmission(stage: number) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'form_progress',
      form_stage: stage,
      form_name: 'three_stage_contact'
    })
  }
}

export function trackCTAClick(ctaText: string, location: string) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cta_click',
      cta_text: ctaText,
      cta_location: location
    })
  }
}
```

## CallRail Integration

**Dynamic number insertion:**
- CallRail swaps phone numbers based on ad source
- Tracks which ads drive phone calls
- Attribution preserved in GTM → GA4

**Setup:**
```tsx
// src/components/Header.tsx
export function Header({ clientPhone }: { clientPhone: string }) {
  return (
    <header>
      <a
        href={`tel:${clientPhone}`}
        className="callrail-phone-number" // CallRail targets this class
        data-callrail-swap={clientPhone}
      >
        {clientPhone}
      </a>
    </header>
  )
}
```
