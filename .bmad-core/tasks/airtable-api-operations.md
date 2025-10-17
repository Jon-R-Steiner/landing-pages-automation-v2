<!-- Powered by BMAD™ Core -->

# Airtable API Operations

## Purpose

This task provides instructions for interacting with the Airtable API to read and write landing page content data. Used by the Content Writer agent to load context and save generated content.

---

## Prerequisites

**Environment Variables Required:**
- `AIRTABLE_API_KEY` - Personal access token from Airtable
- `AIRTABLE_BASE_ID` - Base ID for the landing pages database

**Authentication:**
All requests use Bearer token authentication:
```
Authorization: Bearer {AIRTABLE_API_KEY}
```

---

## Operation 1: Read Page Record

**Purpose:** Load all data for a specific landing page to provide context for content generation.

**Endpoint:**
```
GET https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Pages/{RECORD_ID}
```

**Headers:**
```
Authorization: Bearer {AIRTABLE_API_KEY}
Content-Type: application/json
```

**Response Structure:**
```json
{
  "id": "recXXXXXXXXXXXXXX",
  "fields": {
    "Page ID": 123,
    "Service Name": "Bathroom Remodeling",
    "City": "Austin",
    "State": "TX",
    "Client Name": ["recClientXXX"],
    "Primary Color": "#0ea5e9",
    "Years in Business": 25,
    "BBB Rating": "A+",
    "SEO Keywords": "bathroom remodel, bathroom renovation, shower replacement",
    // ... all other fields
  },
  "createdTime": "2025-01-10T12:00:00.000Z"
}
```

**Required Fields for Content Generation:**
- `Service Name` (or lookup) - What service is being offered
- `City` + `State` (or lookups) - Location for local SEO
- `SEO Keywords` (or lookup) - Target keywords for optimization
- Client branding fields - For voice consistency
- Trust signals - Years in business, ratings, certifications

**Example curl Command:**
```bash
curl "https://api.airtable.com/v0/{BASE_ID}/Pages/recXXXXXXXXXXXXXX" \
  -H "Authorization: Bearer {API_KEY}"
```

---

## Operation 2: Update Page Content

**Purpose:** Write generated content back to the Airtable record.

**Endpoint:**
```
PATCH https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Pages/{RECORD_ID}
```

**Headers:**
```
Authorization: Bearer {AIRTABLE_API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fields": {
    "SEO Title": "Bathroom Remodeling in Austin, TX | Free Quote",
    "SEO Description": "Transform your bathroom with Austin's #1 remodeling experts. 25+ years experience, A+ BBB rating. Free quotes. Call today!",
    "H1 Headline": "Expert Bathroom Remodeling in Austin, TX",
    "Hero Subheadline": "Transform your bathroom into the space you've always dreamed of",
    "FAQs": "[{\"question\":\"How long does a bathroom remodel take?\",\"answer\":\"Most bathroom remodels take 2-4 weeks...\"},{...}]",
    "Benefits": "[{\"title\":\"25+ Years Experience\",\"description\":\"Trusted by over 5,000 Austin homeowners\",\"icon\":\"star\"},{...}]"
  }
}
```

**Field Formats:**
- **Direct text fields:** `SEO Title`, `SEO Description`, `H1 Headline`, `Hero Subheadline`
- **JSON array fields:** `FAQs`, `Benefits` - Must be valid JSON strings

**Example curl Command:**
```bash
curl -X PATCH "https://api.airtable.com/v0/{BASE_ID}/Pages/recXXXXXXXXXXXXXX" \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "SEO Title": "Example Title",
      "FAQs": "[{\"question\":\"...\",\"answer\":\"...\"}]"
    }
  }'
```

---

## Operation 3: List Pages by Status

**Purpose:** Find all pages with status "AI Processing" that need content generation.

**Endpoint:**
```
GET https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Pages?filterByFormula={Status}='AI Processing'
```

**Headers:**
```
Authorization: Bearer {AIRTABLE_API_KEY}
```

**Response Structure:**
```json
{
  "records": [
    {
      "id": "recXXXXXXXXXXXXXX",
      "fields": { /* page fields */ },
      "createdTime": "2025-01-10T12:00:00.000Z"
    },
    // ... more records
  ],
  "offset": "itrXXXXXXXXXXXXXX" // For pagination if needed
}
```

**Common Filters:**
- `{Status}='AI Processing'` - Pages ready for AI content generation
- `{Status}='Draft'` - New pages not yet processed
- `{Published}=TRUE()` - Only published pages

**Example curl Command:**
```bash
curl "https://api.airtable.com/v0/{BASE_ID}/Pages?filterByFormula=%7BStatus%7D%3D%27AI%20Processing%27" \
  -H "Authorization: Bearer {API_KEY}"
```

---

## Rate Limits & Best Practices

**Airtable Rate Limits:**
- **5 requests per second per base**
- **429 error** if exceeded (includes Retry-After header)

**Best Practices:**
1. **Batch Updates:** Use PATCH to update multiple fields in one request
2. **Error Handling:** Check for 401 (auth), 404 (not found), 429 (rate limit)
3. **Retry Logic:** Implement exponential backoff for 429 errors
4. **Validate Before Write:** Ensure all content meets validation rules before updating

**Example Error Handling:**
```javascript
// Pseudocode for error handling
try {
  response = patchAirtableRecord(recordId, fields)
  if (response.status === 429) {
    retryAfter = response.headers['Retry-After']
    wait(retryAfter)
    retry()
  }
} catch (error) {
  if (error.status === 401) {
    // Invalid API key
  } else if (error.status === 404) {
    // Record not found
  }
}
```

---

## Common Workflows

### Workflow 1: Generate Content for Single Page

1. **User provides Record ID** (e.g., `recABC123` or page URL)
2. **Read page data:** GET /Pages/{RECORD_ID}
3. **Extract context:** Service, location, client data, keywords
4. **Generate content:** Run generation tasks
5. **Validate content:** Check format, length, quality
6. **Write back:** PATCH /Pages/{RECORD_ID} with all generated fields
7. **Confirm success:** Display summary of updated fields

### Workflow 2: Batch Process Multiple Pages

1. **List pages:** GET /Pages with filter `{Status}='AI Processing'`
2. **For each page:**
   - Read full record
   - Generate content
   - Validate
   - Write back
   - Mark complete (update Status to "Ready for Review")
3. **Report results:** Summary of successes/failures

---

## Task Execution Guidelines

When this task is referenced by the Content Writer agent:

1. **NEVER hardcode credentials** - Always read from environment variables
2. **ALWAYS validate** - Check that AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set
3. **PROVIDE clear feedback** - Show user which record is being processed
4. **HANDLE errors gracefully** - Don't fail silently, report issues
5. **RESPECT rate limits** - Don't hammer the API

**Example Task Flow:**
```
User: "Load context for record recABC123"

Agent:
1. Check env vars are set ✓
2. GET /Pages/recABC123
3. Parse response
4. Display summary:
   - Service: Bathroom Remodeling
   - Location: Austin, TX
   - Client: Home Pro Services
   - Keywords: bathroom remodel, renovation
5. Context ready for content generation ✓
```

---

## Related Files

- **Agent:** `.bmad-core/agents/copywriter.md`
- **Content Generation Tasks:** `.bmad-core/tasks/generate-*.md`
- **API Documentation:** `docs/api-reference/airtable-api.md`
- **Schema Types:** `src/types/airtable-schema.ts`

---

**END OF TASK**
