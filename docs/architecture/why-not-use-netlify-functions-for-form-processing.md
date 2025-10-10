# Why NOT Use Netlify Functions for Form Processing

## Decision: Keep Make.com for Form Submissions

**Evaluated Alternative:** Replace Make.com with Netlify Serverless Functions for form processing

**Decision:** ❌ Do NOT replace Make.com with Netlify Functions

**Rationale:**

### 1. Architecture Philosophy Alignment

**Current (Static-Only):**
```
Netlify CDN (Pure Static HTML/CSS/JS)
  ↓ (AJAX POST to external service)
Make.com (External webhook)
  ↓
Salesforce
```

**Alternative (Serverless):**
```
Netlify CDN + Functions (Serverless runtime required)
  ↓ (Function invocation)
Netlify Function (submit-lead.ts)
  ↓
Salesforce
```

**Problem:** PRD explicitly states "Static-only architecture (no serverless functions)". Netlify Functions would contradict this core principle.

---

### 2. OAuth 2 Complexity

**Make.com:**
- ✅ OAuth 2 connection managed visually (set once, auto-refresh forever)
- ✅ No token storage required
- ✅ No refresh token logic needed

**Netlify Functions:**
- ❌ Manual OAuth 2 implementation (100+ lines of code)
- ❌ Requires database for token storage (Netlify Blobs or Upstash Redis)
- ❌ Manual refresh token flow (error-prone)
- ❌ Token expiration handling (complex edge cases)

**Example Complexity:**

```typescript
// Manual OAuth 2 token management (NOT RECOMMENDED)
async function getSalesforceAccessToken() {
  // 1. Retrieve stored token from database
  let token = await netlifyBlobs.get('sf_access_token')

  // 2. Check if expired
  if (isTokenExpired(token)) {
    // 3. Refresh token flow
    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      body: `grant_type=refresh_token&client_id=${SF_CLIENT_ID}&client_secret=${SF_CLIENT_SECRET}&refresh_token=${SF_REFRESH_TOKEN}`
    })

    const data = await response.json()

    // 4. Store new token
    await netlifyBlobs.set('sf_access_token', data.access_token)
    token = data.access_token
  }

  return token
}

// Make.com: Zero lines of code (managed automatically)
```

---

### 3. Multi-Client Scalability

**Make.com:**
- ✅ Airtable lookup per webhook (visual configuration)
- ✅ Non-technical stakeholders can add new clients
- ✅ Client-specific Salesforce orgs supported (multiple OAuth connections)

**Netlify Functions:**
- ❌ Hard-coded client mapping OR database required
- ❌ Developer needed for every new client
- ❌ Complex multi-tenant OAuth management

---

### 4. Non-Technical Management

**Make.com:**
- ✅ Visual workflow editor (stakeholders can modify logic)
- ✅ Drag-and-drop field mapping
- ✅ Visual error handling (retry routes, fallback actions)
- ✅ Built-in integrations (Slack, email, Airtable backup)

**Netlify Functions:**
- ❌ Every workflow change requires developer + code deployment
- ❌ Field mapping hard-coded in JavaScript
- ❌ Custom error handling code
- ❌ Manual integration code for each service

---

### 5. Cost Comparison (at scale)

**Make.com:**
- 1,000 leads/mo: $9/mo (Core plan, 10K operations)
- 2,000 leads/mo: $16/mo (Pro plan, 40K operations)
- 5,000 leads/mo: $29/mo (Teams plan, 100K operations)

**Netlify Functions:**
- Free tier: 125K invocations/month (sufficient for most scenarios)
- BUT: Still need Netlify Pro ($19/mo) for build minutes
- AND: Need external database (Netlify Blobs or Upstash Redis $10-20/mo)

**Total Cost Comparison:**
- Make.com: $9-29/mo (all-in-one)
- Netlify Functions: $19-39/mo (Pro + database)

**Verdict:** Costs are comparable, but Make.com provides far more value (visual management, OAuth abstraction, integrations)

---

### 6. Development Time

**Make.com:**
- Already designed, approved (ADR-026), and documented
- Zero additional development time

**Netlify Functions:**
- Estimated: 20-40 hours development
- Testing: 10-20 hours (OAuth flows, error cases)
- Documentation: 5-10 hours
- Total: **35-70 hours developer time**

**Opportunity Cost:** $3,500-$7,000 (at $100/hr developer rate)

---

## When Netlify Functions WOULD Be Appropriate

**Future Use Cases (Epic 2+):**

1. **Edge Personalization** (A/B Testing)
   ```typescript
   // netlify/edge-functions/ab-test.ts
   export default async (request: Request, context: Context) => {
     const variant = Math.random() < 0.5 ? 'a' : 'b'
     context.cookies.set('ab_variant', variant)

     if (variant === 'b') {
       return context.rewrite('/variant-b')
     }

     return context.next()
   }
   ```

2. **Geo-Targeting** (Auto-redirect to local pages)
   ```typescript
   // netlify/edge-functions/geo-redirect.ts
   export default async (request: Request) => {
     const city = request.headers.get('x-nf-geo-city')
     return Response.redirect(`/bathroom-remodeling/${city.toLowerCase()}`)
   }
   ```

3. **Dynamic Pricing** (Personalized quotes)
   ```typescript
   // netlify/functions/calculate-quote.ts
   export async function handler(event) {
     const { zipCode, service } = JSON.parse(event.body)
     const pricing = await calculateRegionalPricing(zipCode, service)
     return { statusCode: 200, body: JSON.stringify(pricing) }
   }
   ```

**Status:** All deferred to future epics (not in MVP scope)

---

## Decision Summary

| Aspect | Make.com | Netlify Functions | Winner |
|--------|----------|-------------------|--------|
| **Architecture Alignment** | Static-only ✅ | Requires serverless ❌ | Make.com |
| **OAuth 2 Management** | Auto-managed ✅ | Manual + database ❌ | Make.com |
| **Non-Technical Usability** | Visual workflows ✅ | Code changes only ❌ | Make.com |
| **Multi-Client Scalability** | Airtable lookup ✅ | Hard-coded/DB ❌ | Make.com |
| **Development Time** | 0 hours (done) ✅ | 35-70 hours ❌ | Make.com |
| **Total Cost (2K leads/mo)** | $16/mo | $19-39/mo | Make.com |

**Final Recommendation:** ✅ **Keep Make.com for form submissions**, use Netlify Plugins + Build Hooks for build-time automation only.

---
