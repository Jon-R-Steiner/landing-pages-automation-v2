# Salesforce Integration Strategy
## Form Submission → Make.com → Salesforce Custom Org

**Date:** 2025-01-08
**Decision:** ADR-026 Revision
**Status:** APPROVED
**Last Updated:** 2025-01-08 (Enhanced Parameters v2.0)

---

## Executive Summary

**Decision:** Use **Make.com webhook** as the intermediary layer for form submission → Salesforce integration.

**Rationale:** Maintains static-only architecture (no serverless functions), leverages existing proven Make.com → Salesforce workflow, centralizes OAuth 2 management, and provides multi-client scalability.

**Architecture:**
```
Landing Page (Static Next.js)
  ↓ (3-Stage Form Submit via AJAX)
Make.com Webhook
  ↓ (reCAPTCHA Verification + OAuth 2 + Field Mapping)
Salesforce Custom Org
  ↓ (Lead Created + Assignment Rules)
Sales Rep Notification
  ↓
User Success Message + GTM Conversion Event
```

**Separation of Concerns:**
- **Landing Page:** Collect data + POST to Make.com
- **Make.com:** reCAPTCHA verification, lead quality scoring, Salesforce OAuth, field mapping, notifications
- **Salesforce:** Lead management, assignment rules, automation

---

## Landing Page Responsibilities

### What the Landing Page Does:
1. ✅ Collect form data (3-stage progressive form)
2. ✅ Capture UTM parameters and session data
3. ✅ Generate reCAPTCHA v3 token (client-side)
4. ✅ POST JSON payload to Make.com webhook
5. ✅ Handle response (success/error UI)
6. ✅ Fire GTM conversion events

### What the Landing Page Does NOT Do:
- ❌ Verify reCAPTCHA (Make.com does this server-side)
- ❌ Calculate lead quality scores (Make.com does this)
- ❌ Map fields to Salesforce (Make.com does this)
- ❌ Authenticate with Salesforce (Make.com handles OAuth 2)
- ❌ Create Salesforce leads (Make.com does this)

---

## Enhanced Form Payload Parameters

### Current Parameters (Already Implemented)

```javascript
{
  // ===== LEAD DATA =====
  "fullName": "Victoria",
  "phoneNumber": "46654767492",
  "email": "victoria@gmail.com",
  "zipCode": "28202",
  "jobType": "Full bathroom remodel",
  "howDidYouHear": "Online Search",
  "commentsOrQuestions": "",

  // ===== UTM PARAMETERS =====
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "remodel-charlotte",
  "utm_term": "bathroom remodeling charlotte",
  "utm_content": "ad-variant-a",

  // ===== CLICK IDs =====
  "gclid": "EAIaIQobChMI...",
  "fbclid": null,

  // ===== SESSION =====
  "referrer": "https://www.google.com/",
  "page_url": "https://bathsrus.com/bathroom-remodeling/charlotte",

  // ===== ANTI-SPAM =====
  "recaptcha_token": "03AGdBq27X...", // Generated client-side, verified server-side in Make.com

  // ===== METADATA =====
  "__amp_source_origin": "https://bathsrus.com"
}
```

---

### NEW Parameters to Add (Recommended)

```javascript
{
  // ===== CLICK ID TIMING (for attribution window) =====
  "gclid_timestamp": 1704729600000, // Timestamp when gclid was first captured

  // ===== GA4 TRACKING (cross-device attribution) =====
  "client_id": "GA1.1.123456789.1704729600", // GA4 client ID
  "session_id": "1704729600", // GA4 session ID

  // ===== LANDING PAGE TRACKING (first page in session) =====
  "landing_page_url": "https://bathsrus.com/bathroom-remodeling/charlotte",

  // ===== TIMING METRICS (engagement signals for quality scoring) =====
  "form_start_time": 1704729650000, // Timestamp when Stage 1 rendered
  "form_submit_time": 1704729720000, // Timestamp when form submitted
  "time_on_page": 120, // Seconds on page before submit
  "form_duration": 70, // Seconds to complete form (from Stage 1 to submit)

  // ===== DEVICE DETECTION (for quality scoring) =====
  "device_type": "mobile", // mobile | tablet | desktop
  "browser": "Chrome",
  "viewport_width": 375,

  // ===== CALLRAIL TRACKING (if using dynamic number insertion) =====
  "callrail_swap_id": null, // CallRail session ID (if applicable)

  // ===== METADATA =====
  "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)",
  "timestamp": "2025-01-08T15:30:00Z",
  "form_version": "3-stage-v1"
}
```

---

## Landing Page Code Implementation

### Add to Component State

```javascript
// Track page load time for time_on_page calculation
const [pageLoadTime] = useState(Date.now());
const [formStartTime] = useState(Date.now());
```

---

### Add Session Tracking (useEffect)

```javascript
useEffect(() => {
  // 1. Capture landing page URL (first page in session)
  if (!sessionStorage.getItem('landing_page')) {
    sessionStorage.setItem('landing_page', window.location.href);
  }

  // 2. Capture gclid timestamp when first detected
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  if (gclid && !sessionStorage.getItem('gclid_timestamp')) {
    sessionStorage.setItem('gclid_timestamp', Date.now().toString());
  }
}, []);
```

---

### Build Enhanced Payload

```javascript
const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Calculate time metrics
  const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
  const formDuration = Math.floor((Date.now() - formStartTime) / 1000);

  // Get GA4 data (if gtag available)
  const clientId = typeof gtag !== 'undefined' ? gtag('get', 'client_id') : null;
  const sessionId = typeof gtag !== 'undefined' ? gtag('get', 'session_id') : null;

  // Detect device type
  const deviceType = navigator.userAgentData?.mobile ? 'mobile' :
                    (window.innerWidth > 768 ? 'desktop' : 'tablet');
  const browser = navigator.userAgentData?.brands?.[0]?.brand || 'Unknown';

  // Generate reCAPTCHA token (you already do this)
  const recaptchaToken = await window.grecaptcha.execute(
    RECAPTCHA_SITE_KEY,
    { action: 'submit_lead_form' }
  );

  // Build payload
  const payload = {
    // ===== LEAD DATA (existing) =====
    fullName: formData.name,
    phoneNumber: formData.phone,
    email: formData.email || '',
    zipCode: formData.location,
    jobType: formData.service,
    howDidYouHear: formData.howDidYouHear || 'Online Form',
    commentsOrQuestions: formData.projectDetails || '',

    // ===== UTM PARAMETERS (existing) =====
    utm_source: getUTMParam('utm_source'),
    utm_medium: getUTMParam('utm_medium'),
    utm_campaign: getUTMParam('utm_campaign'),
    utm_term: getUTMParam('utm_term'),
    utm_content: getUTMParam('utm_content'),

    // ===== CLICK IDs (existing + NEW timestamp) =====
    gclid: getUTMParam('gclid'),
    gclid_timestamp: sessionStorage.getItem('gclid_timestamp'), // NEW
    fbclid: getUTMParam('fbclid'),

    // ===== SESSION TRACKING (existing + NEW GA4 + landing page) =====
    client_id: clientId, // NEW - GA4 client ID
    session_id: sessionId, // NEW - GA4 session ID
    landing_page_url: sessionStorage.getItem('landing_page'), // NEW
    page_url: window.location.href,
    referrer: document.referrer,

    // ===== TIMING METRICS (NEW) =====
    form_start_time: formStartTime,
    form_submit_time: Date.now(),
    time_on_page: timeOnPage,
    form_duration: formDuration,

    // ===== DEVICE & BROWSER (NEW) =====
    device_type: deviceType,
    browser: browser,
    viewport_width: window.innerWidth,

    // ===== ANTI-SPAM (existing) =====
    recaptcha_token: recaptchaToken,

    // ===== CALLRAIL (NEW - if applicable) =====
    callrail_swap_id: window.swap_values?.value || null,

    // ===== METADATA (existing + NEW) =====
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    form_version: '3-stage-v1',
    __amp_source_origin: window.location.origin
  };

  // POST to Make.com webhook (you already do this)
  const response = await fetch(makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  // Handle response (you already do this)
  if (result.success) {
    // Show success message
    // Fire GTM conversion event
  } else {
    // Show error message
  }
};
```

---

## What Make.com Does (Not Landing Page Concern)

**Make.com Workflow (10 Steps):**

1. **Webhook Received** - Parse JSON payload
2. **Verify reCAPTCHA** - POST to Google API, filter score < 0.5
3. **Calculate Lead Quality Score** - Use timing, device, engagement signals
4. **Enrich Data** - Lookup client config from Airtable
5. **Map to Salesforce** - Transform to Salesforce Lead object (30+ fields)
6. **Authenticate** - OAuth 2 with Salesforce (handled by Make.com)
7. **Create Lead** - POST to Salesforce API
8. **Send Notifications** - Email, Slack, Airtable backup
9. **Return Response** - Success/error JSON to landing page
10. **Error Handling** - Retry logic, failed leads backup

**You handle all of this in Make.com, not in landing page code.**

---

## Parameter Summary: What Changed

| Category | What You Have | What to Add |
|----------|---------------|-------------|
| **Lead Data** | ✅ fullName, phoneNumber, email, zipCode, jobType, howDidYouHear, comments | None needed |
| **UTM** | ✅ All 5 params | None needed |
| **Click IDs** | ✅ gclid, fbclid | **➕ gclid_timestamp** |
| **Session** | ✅ referrer, page_url | **➕ landing_page_url, client_id, session_id** |
| **Timing** | ❌ None | **➕ time_on_page, form_duration, form_start_time, form_submit_time** |
| **Device** | ❌ None | **➕ device_type, browser, viewport_width** |
| **CallRail** | ❌ None | **➕ callrail_swap_id** (if using dynamic numbers) |
| **reCAPTCHA** | ✅ recaptcha_token | None needed (you verify in Make.com) |
| **Metadata** | ✅ __amp_source_origin | **➕ user_agent, timestamp, form_version** |

---

## Benefits of Enhanced Parameters

### For Attribution & Tracking:
- **gclid_timestamp** - Measure time from ad click to conversion (attribution window)
- **client_id / session_id** - Cross-device attribution in GA4
- **landing_page_url** - Track first page in journey (not just current page)

### For Lead Quality Scoring (Make.com calculates):
- **time_on_page** - Engagement signal (>60s = higher intent)
- **form_duration** - Sweet spot: 20-300s (too fast = bot, too slow = distracted)
- **device_type** - Desktop often shows higher intent for home services
- **browser** - Identify automated submissions (unusual user agents)

### For Conversion Optimization:
- **form_start_time / form_submit_time** - Identify abandonment patterns
- **viewport_width** - Responsive design debugging (did mobile users struggle?)
- **callrail_swap_id** - Correlate form fills with phone calls

---

## Environment Configuration

### `.env.local` (Development)
```bash
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/abc123xyz
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Netlify Environment Variables (Production)
```
NEXT_PUBLIC_MAKE_WEBHOOK_URL = https://hook.us1.make.com/abc123xyz
NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 6Lc...
NEXT_PUBLIC_GTM_ID = GTM-XXXXXXX
```

**Security Note:**
- Make.com webhook URL is public (exposed in client-side code)
- This is acceptable because:
  - Webhook URL is obscure (not guessable)
  - No sensitive data in frontend code
  - Salesforce credentials NEVER exposed to frontend
  - Make.com verifies reCAPTCHA server-side
  - Make.com can rate-limit per webhook URL

---

## Error Handling & User Experience

### Success Response from Make.com:
```json
{
  "success": true,
  "lead_id": "00Q5e000001AbCdEFG",
  "message": "Thank you! We'll contact you within 24 hours."
}
```

**Landing Page Action:**
- Show success message
- Fire GTM conversion event: `form_submit`
- Clear localStorage form state

---

### Error Responses from Make.com:

**reCAPTCHA Failed (score < 0.5):**
```json
{
  "success": false,
  "error": "spam_detected",
  "message": "We couldn't verify your submission. Please try again or call us directly."
}
```

**Salesforce API Error:**
```json
{
  "success": false,
  "error": "salesforce_error",
  "message": "We're experiencing technical difficulties. Please call us at 555-123-4567."
}
```

**Duplicate Lead:**
```json
{
  "success": false,
  "error": "duplicate_lead",
  "message": "We already have your information. A team member will contact you soon!"
}
```

**Landing Page Action:**
- Show error message (user-friendly, not technical details)
- Fire GTM error event: `form_submit_error`
- Keep form data in localStorage (allow retry)
- Provide phone number fallback

---

## Cost Analysis

### Make.com Operations per Form Submission:
- Webhook received: 1 operation
- reCAPTCHA verification: 1 operation (HTTP request)
- Airtable lookup (optional): 1 operation
- Salesforce create Lead: 1 operation
- SendGrid email (optional): 1 operation
- Slack notification (optional): 1 operation
- Airtable backup (optional): 1 operation

**Total: 3-7 operations per form submission** (depending on optional features)

### Make.com Pricing Tiers:
- **Free:** 1,000 operations/month (~200 form submits with all features)
- **Core ($9/mo):** 10,000 operations/month (~2,000 form submits)
- **Pro ($16/mo):** 40,000 operations/month (~8,000 form submits)

**Recommendation:** Start with Free tier for testing, upgrade to Core ($9/mo) for production.

---

## Implementation Checklist

**Landing Page Updates:**
- [ ] Add `pageLoadTime` and `formStartTime` state
- [ ] Add session tracking useEffect (landing_page_url, gclid_timestamp)
- [ ] Add GA4 data capture (client_id, session_id)
- [ ] Add device detection (device_type, browser, viewport_width)
- [ ] Add timing calculations (time_on_page, form_duration)
- [ ] Add CallRail tracking (if using dynamic numbers)
- [ ] Update payload with all new parameters
- [ ] Test reCAPTCHA token generation
- [ ] Test error handling (show user-friendly messages)
- [ ] Test GTM conversion events (success + error)

**Make.com Configuration (Your Responsibility):**
- [ ] Create Make.com scenario (10-step workflow)
- [ ] Configure reCAPTCHA verification (score threshold)
- [ ] Set up Salesforce OAuth 2 connection
- [ ] Map all form parameters to Salesforce custom fields
- [ ] Configure lead quality scoring algorithm
- [ ] Set up error handling and retry logic
- [ ] Configure notifications (email, Slack)
- [ ] Test end-to-end flow (sandbox Salesforce first)

---

**Document Version:** 2.0 (Simplified - Landing Page Focus)
**Last Updated:** 2025-01-08
**Author:** Winston (Architect)
**Status:** APPROVED - Ready for Implementation
