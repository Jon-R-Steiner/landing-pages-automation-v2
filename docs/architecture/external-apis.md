# External APIs

## Overview

The system integrates with 5 external APIs across two distinct phases:

1. **Build-Time APIs** (Pre-deployment) - Content generation and export
2. **Runtime APIs** (Post-deployment) - Form submission and tracking

**Security Model:** API keys stored in environment variables, never exposed to client-side code (except public keys like reCAPTCHA site key, GTM ID)

---

## 1. Airtable API

**Phase:** Build-Time (Pre-deployment)

**Purpose:** Export approved content from Airtable base to static JSON

**Authentication:** API Key (Bearer token)

**Rate Limits:** 5 requests/second per base

**Endpoint:** `https://api.airtable.com/v0/{baseId}/{tableName}`

### Configuration

```javascript
// src/lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID)

export async function fetchApprovedPages() {
  const records = await base('Pages')
    .select({
      view: 'Approved',
      fields: ['Service', 'Location', 'SEO Title', 'SEO Description', 'H1 Headline', 'Hero Subheadline', 'CTA Text', 'Hero Image URL', 'Client Name'],
      pageSize: 100
    })
    .all()

  return records.map(record => ({
    pageId: record.id,
    service: record.get('Service'),
    location: record.get('Location'),
    seo: {
      title: record.get('SEO Title'),
      description: record.get('SEO Description')
    },
    hero: {
      h1: record.get('H1 Headline'),
      subheadline: record.get('Hero Subheadline'),
      ctaText: record.get('CTA Text'),
      imageUrl: record.get('Hero Image URL')
    },
    clientName: record.get('Client Name')[0] // Linked record
  }))
}
```

### Error Handling

```javascript
try {
  const pages = await fetchApprovedPages()
} catch (error) {
  if (error.statusCode === 429) {
    // Rate limit exceeded - wait and retry
    await sleep(1000)
    return fetchApprovedPages()
  } else if (error.statusCode === 401) {
    // Invalid API key
    throw new Error('Airtable API key is invalid')
  } else {
    // Other errors
    throw error
  }
}
```

### Environment Variables

```bash
# .env.local
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

**Security:** API key is server-side only, never committed to Git (gitignored via `.env.local`)

---

## 2. Anthropic Claude API

**Phase:** Build-Time (Pre-deployment)

**Purpose:** Generate AI content (trust signals, features, FAQs) for landing pages

**Authentication:** API Key (x-api-key header)

**Rate Limits:** 50 requests/minute (Tier 1), 4000 requests/minute (Tier 4)

**Model:** `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5)

**Endpoint:** `https://api.anthropic.com/v1/messages`

### Configuration

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateTrustSignals(
  service: string,
  location: string,
  clientName: string
): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: 'You are a marketing expert specializing in home services. Generate trust signals that are specific, credible, and localized.',
    messages: [{
      role: 'user',
      content: `Generate 5 trust signals for a ${service} company called "${clientName}" in ${location}.

      Requirements:
      - Each signal must be 8-12 words
      - Must be specific (no generic claims)
      - Must be credible (realistic numbers)
      - Must be localized to ${location}

      Return ONLY a JSON array of strings, no other text.

      Example: ["Licensed & insured with $2M coverage in NC", "500+ bathroom remodels completed in Charlotte area"]`
    }]
  })

  const responseText = message.content[0].text
  return JSON.parse(responseText) // Parse JSON array
}
```

### Parallel Processing (Batch API)

```typescript
// Process 100 pages in parallel (batches of 10)
export async function generateAllTrustSignals(pages: Page[]) {
  const batchSize = 10
  const results = []

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize)
    const promises = batch.map(page =>
      generateTrustSignals(page.service, page.location, page.clientName)
    )

    const batchResults = await Promise.all(promises)
    results.push(...batchResults)

    // Rate limit protection: wait 1 second between batches
    if (i + batchSize < pages.length) {
      await sleep(1000)
    }
  }

  return results
}
```

### Error Handling

```typescript
try {
  const trustSignals = await generateTrustSignals(service, location, clientName)
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded - exponential backoff
    await sleep(2000)
    return generateTrustSignals(service, location, clientName)
  } else if (error.status === 401) {
    // Invalid API key
    throw new Error('Anthropic API key is invalid')
  } else if (error.status === 500) {
    // Server error - retry once
    await sleep(1000)
    return generateTrustSignals(service, location, clientName)
  } else {
    // Other errors - log and use fallback content
    console.error('Claude API error:', error)
    return getFallbackTrustSignals(service, location)
  }
}
```

### Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXX
```

**Cost Estimate:** ~$0.003 per page (500 pages = ~$1.50 per full regeneration)

**Security:** API key is server-side only, never committed to Git

---

## 3. Google reCAPTCHA v3 API

**Phase:** Runtime (Client-side token generation, Server-side verification)

**Purpose:** Prevent spam form submissions

**Authentication:** Site Key (public), Secret Key (server-side verification)

**Endpoint (Verification):** `https://www.google.com/recaptcha/api/siteverify`

### Client-Side Implementation

```typescript
// src/components/form/ContactForm.tsx
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ContactForm() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate reCAPTCHA token
    const token = await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action: 'submit_lead_form' }
    )

    // Include token in form payload
    const payload = {
      ...formData,
      antiSpam: { recaptchaToken: token }
    }

    // POST to Make.com webhook
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
        onLoad={() => setRecaptchaLoaded(true)}
      />
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </>
  )
}
```

### Server-Side Verification (Make.com Scenario)

**Make.com HTTP Module:**

```
POST https://www.google.com/recaptcha/api/siteverify
Content-Type: application/x-www-form-urlencoded

secret={{RECAPTCHA_SECRET_KEY}}
&response={{recaptchaToken}}
&remoteip={{userIP}}
```

**Response:**

```json
{
  "success": true,
  "score": 0.9,
  "action": "submit_lead_form",
  "challenge_ts": "2025-01-08T15:30:00Z",
  "hostname": "bathsrus.com"
}
```

**Filtering Rule (Make.com):**
```
IF score < 0.5 THEN
  Return error: "spam_detected"
  Log to Airtable "Failed Submissions" table
  Do NOT create Salesforce Lead
END IF
```

### Environment Variables

```bash
# .env.local (Client-side - public)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Make.com Environment Variables (Server-side - secret)
RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Security:** Site key is public (exposed in HTML), Secret key is server-side only (stored in Make.com)

---

## 4. Make.com Webhook API

**Phase:** Runtime (Form submission intermediary)

**Purpose:** Receive form submissions, verify reCAPTCHA, map to Salesforce, create Lead

**Authentication:** Obscure webhook URL (no API key required)

**Endpoint:** `https://hook.us1.make.com/{unique-webhook-id}`

### Client-Side POST Request

```typescript
// src/components/form/ContactForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const payload = {
    leadData: { fullName, phoneNumber, email, zipCode, jobType, howDidYouHear, commentsOrQuestions },
    utm: { source, medium, campaign, term, content },
    clickIds: { gclid, gclidTimestamp, fbclid },
    session: { clientId, sessionId, landingPageUrl, pageUrl, referrer },
    timing: { formStartTime, formSubmitTime, timeOnPage, formDuration },
    device: { deviceType, browser, viewportWidth, userAgent },
    antiSpam: { recaptchaToken },
    metadata: { timestamp, formVersion, __amp_source_origin }
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.success) {
      // Show success message
      setFormState('success')
      // Fire GTM conversion event
      window.dataLayer.push({ event: 'form_submit', leadId: result.lead_id })
    } else {
      // Show error message
      setFormState('error')
      setErrorMessage(result.message || 'Submission failed. Please try again.')
    }
  } catch (error) {
    // Network error
    setFormState('error')
    setErrorMessage('Connection error. Please try again or call us directly.')
  }
}
```

### Make.com Scenario (10-Step Workflow)

**See:** `docs/integrations/salesforce-integration-strategy.md` for complete workflow documentation.

**Summary:**
1. **Webhook Received** - Parse JSON payload
2. **Verify reCAPTCHA** - POST to Google API, filter score < 0.5
3. **Calculate Lead Quality Score** - Use timing, device, engagement signals (0-100)
4. **Enrich Data** - Lookup client config from Airtable
5. **Map to Salesforce** - Transform to Salesforce Lead object (30+ fields)
6. **Authenticate** - OAuth 2 with Salesforce (handled by Make.com connection)
7. **Create Lead** - POST to Salesforce API
8. **Send Notifications** - Email, Slack, Airtable backup
9. **Return Response** - Success/error JSON to landing page
10. **Error Handling** - Retry logic, failed leads backup to Airtable

### Response Format

**Success:**
```json
{
  "success": true,
  "lead_id": "00Q5e000001AbCdEFG",
  "message": "Thank you! We'll contact you within 24 hours."
}
```

**Error (Spam Detected):**
```json
{
  "success": false,
  "error": "spam_detected",
  "message": "We couldn't verify your submission. Please try again or call us directly."
}
```

**Error (Salesforce API Failure):**
```json
{
  "success": false,
  "error": "salesforce_error",
  "message": "We're experiencing technical difficulties. Please call us at (704) 555-1234."
}
```

### Environment Variables

```bash
# .env.local (Client-side - public, obscure URL is security measure)
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.us1.make.com/abc123xyz456
```

**Security:** Webhook URL is obscure (not guessable), rate-limited by Make.com, reCAPTCHA verification prevents spam

---

## 5. Salesforce API

**Phase:** Runtime (Make.com → Salesforce integration)

**Purpose:** Create Lead records in Salesforce CRM

**Authentication:** OAuth 2.0 (handled by Make.com Salesforce connection)

**Endpoint:** `https://[instance].salesforce.com/services/data/v60.0/sobjects/Lead`

### Make.com Salesforce Module Configuration

**Connection Type:** OAuth 2.0 (production Salesforce org)

**API Version:** v60.0 (Spring '25)

**Operation:** Create Lead

**Field Mapping:**

```json
{
  "FirstName": "{{parseFullName.firstName}}",
  "LastName": "{{parseFullName.lastName}}",
  "Phone": "{{formatPhoneNumber.formatted}}",
  "Email": "{{webhook.leadData.email}}",
  "PostalCode": "{{webhook.leadData.zipCode}}",
  "LeadSource": "{{webhook.utm.source}}",
  "Description": "{{webhook.leadData.commentsOrQuestions}}",
  "Campaign__c": "{{webhook.utm.campaign}}",
  "Ad_Group__c": "{{webhook.utm.content}}",
  "Keyword__c": "{{webhook.utm.term}}",
  "GCLID__c": "{{webhook.clickIds.gclid}}",
  "Landing_Page__c": "{{webhook.session.landingPageUrl}}",
  "Form_Duration__c": "{{webhook.timing.formDuration}}",
  "Time_On_Page__c": "{{webhook.timing.timeOnPage}}",
  "Device_Type__c": "{{webhook.device.deviceType}}",
  "Lead_Quality_Score__c": "{{calculateLeadScore.score}}",
  "reCAPTCHA_Score__c": "{{verifyRecaptcha.score}}"
}
```

**Assignment Rules:** Triggered by default Salesforce assignment rules after Lead creation

### Error Handling (Make.com)

**Duplicate Lead Detection:**
```
IF Salesforce returns "DUPLICATE_VALUE" error THEN
  Search for existing Lead by Email or Phone
  IF Lead found AND created < 30 days ago THEN
    Return success response (don't create duplicate)
  ELSE
    Override duplicate rule and create Lead
  END IF
END IF
```

**API Failure Retry Logic:**
```
TRY
  Create Salesforce Lead
CATCH error
  IF error = "timeout" OR error = "server_error" THEN
    Wait 2 seconds
    Retry (max 3 attempts)
  ELSE
    Log error to Airtable "Failed Submissions" table
    Send Slack alert to #dev-alerts channel
    Return error response to user
  END IF
END TRY
```

### Environment Variables (Make.com)

**Salesforce OAuth Connection:**
- **Client ID:** (Configured in Make.com Salesforce connection)
- **Client Secret:** (Configured in Make.com Salesforce connection)
- **Instance URL:** `https://customorg.my.salesforce.com`
- **API Version:** `v60.0`

**Security:** OAuth 2 credentials stored securely in Make.com, never exposed to client-side code

---

## API Security Summary

| API | Authentication | Key Storage | Exposure | Rate Limiting |
|-----|----------------|-------------|----------|---------------|
| Airtable API | API Key (Bearer) | `.env.local` (server) | Server-side only | 5 req/sec per base |
| Claude API | API Key (x-api-key) | `.env.local` (server) | Server-side only | 50 req/min (Tier 1) |
| reCAPTCHA (Client) | Site Key (public) | `.env.local` (client) | **Public** (exposed in HTML) | N/A |
| reCAPTCHA (Server) | Secret Key | Make.com env vars | Server-side only | 1000 req/sec |
| Make.com Webhook | Obscure URL | `.env.local` (client) | **Public** (obscure URL) | 10 req/min per IP |
| Salesforce API | OAuth 2.0 | Make.com connection | Server-side only | 15000 req/24hr |

**Critical Security Rules:**
1. ✅ NEVER commit `.env.local` to Git (in `.gitignore`)
2. ✅ NEVER expose `ANTHROPIC_API_KEY`, `AIRTABLE_API_KEY`, or `RECAPTCHA_SECRET_KEY` to client-side
3. ✅ ONLY public keys (`NEXT_PUBLIC_*`) allowed in client-side code
4. ✅ Make.com webhook URL is public but obscure (not guessable)
5. ✅ reCAPTCHA verification MUST happen server-side (Make.com), never trust client-side scores

---
