# Phase 3: Runtime (User Interaction)

**Location:** User's Browser
**Trigger:** User clicks Google Ads
**Frequency:** Every page view

## Step 7: User Arrives from Google Ads

```
┌─────────────────────────────────────────────────────────┐
│  GOOGLE ADS CLICK                                        │
│                                                          │
│  Ad Click URL:                                           │
│  https://bathsrus.com/bathroom-remodeling/charlotte?    │
│    utm_source=google&                                    │
│    utm_medium=cpc&                                       │
│    utm_campaign=remodel-charlotte&                       │
│    utm_term=bathroom+remodeling+charlotte&               │
│    utm_content=ad-variant-a&                             │
│    gclid=EAIaIQobChMI...                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
              [DNS Resolution + CDN Routing]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  NETLIFY EDGE (Nearest to User)                          │
│                                                          │
│  Request: GET /bathroom-remodeling/charlotte/            │
│  Response: index.html (pre-rendered)                     │
│                                                          │
│  Performance:                                            │
│  - TTFB: <50ms (CDN edge)                                │
│  - HTML Size: ~15-25KB (gzipped with Brotli)             │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Browser Receives HTML]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  HTML CONTENT (Critical Rendering Path)                  │
│                                                          │
│  <head>                                                  │
│    <style> /* Inline critical CSS (5-10KB) */ </style>  │
│    <link rel="preload" as="font" ... />                 │
│    <link rel="preload" as="image" ... /> (LCP image)    │
│  </head>                                                 │
│  <body>                                                  │
│    <!-- Above-the-fold HTML rendered -->                 │
│    <picture>                                             │
│      <source srcset="hero.avif" type="image/avif" />    │
│      <source srcset="hero.webp" type="image/webp" />    │
│      <img src="hero.jpg" /> <!-- LCP element -->        │
│    </picture>                                            │
│    <!-- 3-Stage Form (hydrated) -->                      │
│    <!-- Below-fold content (lazy loaded) -->             │
│  </body>                                                 │
└─────────────────────────────────────────────────────────┘
```

**Performance Targets:**
- **TTFB:** <50ms (CDN edge)
- **FCP:** <1.0s (critical CSS inline)
- **LCP:** 0.8-2.0s (target: <2.5s for Google Ads Quality Score)

---

## Step 8: Client-Side Hydration

```
┌─────────────────────────────────────────────────────────┐
│  REACT 19.2 HYDRATION                                    │
│                                                          │
│  1. Load JavaScript Bundle (code-split per route)        │
│     - Main bundle: ~50-100KB (gzipped)                   │
│     - Route-specific: ~20-40KB (gzipped)                 │
│                                                          │
│  2. Hydrate Interactive Components                       │
│     - ThreeStageForm (client component)                  │
│     - LazySection wrappers (Intersection Observer)       │
│                                                          │
│  3. Initialize Client-Side State                         │
│     - localStorage for form persistence                  │
│     - sessionStorage for UTM parameters                  │
│     - Page load time tracking                            │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Interactive Components Ready]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE TRACKING INITIALIZATION                     │
│                                                          │
│  1. Capture UTM Parameters                               │
│     - Read from URL query string                         │
│     - Store in sessionStorage                            │
│     - Persist across form stages                         │
│                                                          │
│  2. Capture Session Data                                 │
│     - referrer: document.referrer                        │
│     - page_url: window.location.href                     │
│     - landing_page_url: sessionStorage                   │
│     - gclid + timestamp                                  │
│                                                          │
│  3. Capture Device Data                                  │
│     - device_type: mobile/tablet/desktop                 │
│     - browser: navigator.userAgentData                   │
│     - viewport_width: window.innerWidth                  │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- React 19.2 (client-side hydration)
- Next.js 15.5 (client router)
- localStorage API
- sessionStorage API

**Performance:**
- **TTI:** <3.5s (target)
- **FID:** <100ms

---

## Step 9: Third-Party Scripts (Deferred - Post-LCP)

```
┌─────────────────────────────────────────────────────────┐
│  DEFERRED SCRIPT LOADING (strategy="lazyOnload")         │
│                                                          │
│  Trigger: After LCP (Largest Contentful Paint)           │
│  Method: Next.js Script component with lazyOnload        │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┬─────────────────┐
        ↓                               ↓                 ↓
┌──────────────────┐       ┌──────────────────┐   ┌──────────────────┐
│ Google Tag       │       │ CallRail Dynamic │   │ reCAPTCHA v3     │
│ Manager (GTM)    │       │ Number Insertion │   │ (Invisible)      │
│                  │       │                  │   │                  │
│ - Loads GTM      │       │ - Swaps phone    │   │ - Loads in       │
│   container      │       │   numbers with   │   │   background     │
│ - Initializes    │       │   tracking nums  │   │ - Ready for      │
│   dataLayer      │       │ - Tracks calls   │   │   form submit    │
│ - Loads GA4      │       │   from landing   │   │                  │
│   via GTM        │       │   pages          │   │                  │
│                  │       │                  │   │                  │
│ Size: ~60-80KB   │       │ Size: ~40-60KB   │   │ Size: ~20-30KB   │
└──────────────────┘       └──────────────────┘   └──────────────────┘
        │                               │                 │
        └───────────────┬───────────────┴─────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  TRACKING READY (Total: ~120-170KB deferred)             │
│                                                          │
│  Impact on LCP: NONE (loaded after LCP)                  │
│  Impact on TTI: Minimal (non-blocking)                   │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Google Tag Manager (GTM)
- Google Analytics 4 (GA4) via GTM
- CallRail (dynamic number insertion)
- reCAPTCHA v3 (invisible)

**Implementation:**
```tsx
// src/app/layout.tsx
<Script
  id="gtm"
  strategy="lazyOnload" // Load AFTER LCP
  src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
/>

<Script
  src={`https://cdn.callrail.com/companies/${process.env.NEXT_PUBLIC_CALLRAIL_COMPANY_ID}/.../swap.js`}
  strategy="lazyOnload"
/>

<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="lazyOnload"
/>
```

**Performance Impact:**
- Scripts load **after** LCP (no impact on Core Web Vitals)
- Total deferred size: ~120-170KB (gzipped)

---

## Step 10: User Fills 3-Stage Form

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: Name + Phone                                   │
│                                                          │
│  User Actions:                                           │
│  1. User clicks into form (triggers GTM event)           │
│     → GTM Event: form_start                              │
│                                                          │
│  2. User enters name and phone                           │
│  3. Click "Continue" button                              │
│                                                          │
│  Client-Side Logic:                                      │
│  - Validate phone format (US: xxx-xxx-xxxx)              │
│  - Save to localStorage (persistence)                    │
│  - Transition to Stage 2                                 │
│     → GTM Event: form_stage_2                            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: Service + Location                             │
│                                                          │
│  User Actions:                                           │
│  1. Select service from dropdown                         │
│  2. Enter ZIP code                                       │
│  3. Click "Continue" button                              │
│                                                          │
│  Client-Side Logic:                                      │
│  - Validate ZIP code format (5 digits)                   │
│  - Save to localStorage (persistence)                    │
│  - Transition to Stage 3                                 │
│     → GTM Event: form_stage_3                            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: Details + Submit                               │
│                                                          │
│  User Actions:                                           │
│  1. Enter project details (optional)                     │
│  2. Enter email (optional)                               │
│  3. Click "Get Free Quote" button                        │
│                                                          │
│  Client-Side Logic:                                      │
│  1. Generate reCAPTCHA v3 token                          │
│     - window.grecaptcha.execute()                        │
│     - Returns token (invisible to user)                  │
│                                                          │
│  2. Build form payload (see Step 11)                     │
│                                                          │
│  3. Calculate timing metrics                             │
│     - time_on_page: Date.now() - pageLoadTime            │
│     - form_duration: Date.now() - formStartTime          │
│                                                          │
│  4. Submit to Make.com webhook                           │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- React 19.2 (client component)
- localStorage API (form persistence)
- reCAPTCHA v3 API (token generation)
- GTM dataLayer (event tracking)

**GTM Events Tracked:**
- `form_start` - User begins Stage 1
- `form_stage_2` - User advances to Stage 2
- `form_stage_3` - User advances to Stage 3
- `form_submit` - Form submitted (see Step 11)
- `form_error` - Form submission failed

---

## Step 11: Form Submission to Make.com

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE: Build Form Payload                         │
│                                                          │
│  const payload = {                                       │
│    // Lead Data                                          │
│    fullName: formData.name,                              │
│    phoneNumber: formData.phone,                          │
│    email: formData.email || '',                          │
│    zipCode: formData.location,                           │
│    jobType: formData.service,                            │
│    howDidYouHear: 'Online Form',                         │
│    commentsOrQuestions: formData.details || '',          │
│                                                          │
│    // UTM Parameters (from sessionStorage)               │
│    utm_source: sessionStorage.getItem('utm_source'),     │
│    utm_medium: sessionStorage.getItem('utm_medium'),     │
│    utm_campaign: sessionStorage.getItem('utm_campaign'), │
│    utm_term: sessionStorage.getItem('utm_term'),         │
│    utm_content: sessionStorage.getItem('utm_content'),   │
│                                                          │
│    // Click IDs                                          │
│    gclid: sessionStorage.getItem('gclid'),               │
│    gclid_timestamp: sessionStorage.getItem('gclid_ts'),  │
│    fbclid: sessionStorage.getItem('fbclid'),             │
│                                                          │
│    // Session Data                                       │
│    client_id: gtag('get', 'client_id'),                  │
│    session_id: gtag('get', 'session_id'),                │
│    landing_page_url: sessionStorage.getItem('landing'), │
│    page_url: window.location.href,                       │
│    referrer: document.referrer,                          │
│                                                          │
│    // Timing Metrics                                     │
│    time_on_page: 120, // seconds                         │
│    form_duration: 70, // seconds                         │
│    form_start_time: formStartTime,                       │
│    form_submit_time: Date.now(),                         │
│                                                          │
│    // Device Data                                        │
│    device_type: 'mobile',                                │
│    browser: 'Chrome',                                    │
│    viewport_width: 375,                                  │
│                                                          │
│    // Anti-Spam                                          │
│    recaptcha_token: recaptchaToken, // Generated         │
│                                                          │
│    // Metadata                                           │
│    user_agent: navigator.userAgent,                      │
│    timestamp: new Date().toISOString(),                  │
│    form_version: '3-stage-v1'                            │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              [fetch() POST to Make.com Webhook]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  MAKE.COM WEBHOOK (External Service)                     │
│                                                          │
│  URL: process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL          │
│  Method: POST                                            │
│  Content-Type: application/json                          │
│                                                          │
│  Make.com Workflow (10 Steps - NOT our concern):         │
│  1. Receive webhook payload                              │
│  2. Verify reCAPTCHA (score >= 0.5)                      │
│  3. Calculate lead quality score                         │
│  4. Enrich data (Airtable client config lookup)          │
│  5. Map to Salesforce Lead object                        │
│  6. OAuth 2 authenticate with Salesforce                 │
│  7. Create Salesforce lead (POST to SF API)              │
│  8. Send notifications (email, Slack, Airtable backup)   │
│  9. Return response to landing page                      │
│  10. Error handling & retry logic                        │
│                                                          │
│  Response Format:                                        │
│  Success: { "success": true, "lead_id": "00Q..." }       │
│  Error: { "success": false, "error": "...", "msg": "..." }│
└─────────────────────────────────────────────────────────┘
                        ↓
              [Response Received]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  CLIENT-SIDE: Handle Response                            │
│                                                          │
│  SUCCESS RESPONSE:                                       │
│  1. Show success message to user                         │
│     "Thank you! We'll contact you within 24 hours."      │
│                                                          │
│  2. Fire GTM conversion event                            │
│     dataLayer.push({                                     │
│       event: 'form_submit',                              │
│       lead_id: response.lead_id                          │
│     })                                                   │
│                                                          │
│  3. Clear localStorage form state                        │
│                                                          │
│  ERROR RESPONSE:                                         │
│  1. Show error message (user-friendly)                   │
│     - spam_detected: "Please try again or call us"       │
│     - salesforce_error: "Call us at 555-123-4567"        │
│     - duplicate_lead: "We already have your info!"       │
│                                                          │
│  2. Fire GTM error event                                 │
│     dataLayer.push({                                     │
│       event: 'form_error',                               │
│       error_type: response.error                         │
│     })                                                   │
│                                                          │
│  3. Keep form data in localStorage (allow retry)         │
│                                                          │
│  4. Provide phone number fallback                        │
└─────────────────────────────────────────────────────────┘
```

**Technologies:**
- Fetch API (browser native)
- Make.com webhook
- GTM dataLayer
- localStorage API

**Performance:**
- Request time: 500-1500ms (Make.com processing)
- User sees spinner during submission

---
