# Airtable API Reference

**Purpose:** Documentation for interacting with Airtable API for landing page content management.

**Use Case:** Content Writer agent (BMad copywriter) uses Airtable API to read page context and write generated content.

**Last Updated:** 2025-01-10

---

## Overview

The project uses **Airtable REST API** (not MCP) for content management operations. This provides:
- Direct API access with standard REST calls
- Simple authentication via Bearer token
- Full control over API requests and responses
- Standard error handling and rate limiting

**Key Operations:**
1. **Read** page data (service, location, client info)
2. **Write** generated content (FAQ, benefits, SEO, hero copy)
3. **List** pages by status (find pages ready for AI processing)

---

## Authentication

### API Token

**Environment Variable:**
```bash
AIRTABLE_API_KEY=pat1234567890abcdef  # Personal Access Token
```

**Header Format:**
```http
Authorization: Bearer {AIRTABLE_API_KEY}
```

### Creating an API Token

1. Go to [Airtable Account](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Name: "Landing Pages Content Writer"
4. Scopes:
   - `data.records:read` - Read records
   - `data.records:write` - Write/update records
5. Access: Select the landing pages base
6. Copy token and add to `.env.local`

---

## Base Configuration

### Environment Variables

```bash
# Required for all Airtable API operations
AIRTABLE_API_KEY=pat1234567890abcdef    # Personal access token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX      # Base ID (find in URL)
```

### Finding Base ID

**Method 1: From URL**
```
https://airtable.com/appABC123DEF456/tblXYZ789
                     ^^^^^^^^^^^^^^^^
                     This is the Base ID
```

**Method 2: From API Documentation**
1. Go to [Airtable API Docs](https://airtable.com/api)
2. Select your base
3. Base ID shown at top of documentation

---

## API Endpoints

### Base URL
```
https://api.airtable.com/v0/{BASE_ID}
```

### Tables
- `Pages` - Landing page records
- `Clients` - Client information
- `Services` - Service definitions
- `Locations` - Location data
- `Testimonials` - Customer testimonials
- `BranchStaff` - Staff information

---

## Common Operations

### 1. Get Single Page Record

**Endpoint:**
```
GET /v0/{BASE_ID}/Pages/{RECORD_ID}
```

**Headers:**
```http
Authorization: Bearer {AIRTABLE_API_KEY}
```

**Example Request:**
```bash
curl "https://api.airtable.com/v0/appABC123/Pages/recXYZ789" \
  -H "Authorization: Bearer pat1234567890abcdef"
```

**Example Response:**
```json
{
  "id": "recXYZ789",
  "fields": {
    "Page ID": 123,
    "Service Name": "Bathroom Remodeling",
    "City": "Austin",
    "State": "TX",
    "SEO Keywords": "bathroom remodel, renovation, shower replacement",
    "Years in Business": 25,
    "BBB Rating": "A+",
    "Primary Color": "#0ea5e9",
    "Branch Phone": "(512) 555-0100",
    "SEO Title": "",
    "SEO Description": "",
    "H1 Headline": "",
    "Hero Subheadline": "",
    "FAQs": "",
    "Benefits": ""
  },
  "createdTime": "2025-01-10T12:00:00.000Z"
}
```

**Key Fields for Content Generation:**
- `Service Name` - What service is offered
- `City`, `State` - Location for local SEO
- `SEO Keywords` - Target keywords
- `Years in Business`, `BBB Rating` - Trust signals
- `Primary Color` - Brand color

---

### 2. Update Page Content

**Endpoint:**
```
PATCH /v0/{BASE_ID}/Pages/{RECORD_ID}
```

**Headers:**
```http
Authorization: Bearer {AIRTABLE_API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fields": {
    "SEO Title": "Bathroom Remodeling in Austin, TX | Free Quote",
    "SEO Description": "Transform your bathroom with Austin's trusted experts. 25+ years experience, A+ BBB rated, lifetime warranty. Free quotes - call today!",
    "H1 Headline": "Expert Bathroom Remodeling in Austin, TX",
    "Hero Subheadline": "Transform your bathroom into the space you've always dreamed of. 25+ years of trusted Austin service. Free quotes available.",
    "FAQs": "[{\"question\":\"How much does bathroom remodeling cost in Austin, TX?\",\"answer\":\"Bathroom remodeling in Austin typically ranges from $8,000 to $25,000...\"}]",
    "Benefits": "[{\"title\":\"25+ Years of Austin Expertise\",\"description\":\"Trust a local company that's transformed over 5,000 bathrooms across Austin.\",\"icon\":\"award\"}]",
    "Status": "Ready for Review"
  }
}
```

**Important Notes:**
- FAQ and Benefits fields must be **JSON strings** (not objects)
- Use `JSON.stringify()` to convert arrays to strings
- Status field updated to signal content is ready for review

**Example Request:**
```bash
curl -X PATCH "https://api.airtable.com/v0/appABC123/Pages/recXYZ789" \
  -H "Authorization: Bearer pat1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "SEO Title": "Bathroom Remodeling in Austin, TX | Free Quote",
      "Status": "Ready for Review"
    }
  }'
```

**Example Response:**
```json
{
  "id": "recXYZ789",
  "fields": {
    "SEO Title": "Bathroom Remodeling in Austin, TX | Free Quote",
    "SEO Description": "Transform your bathroom with...",
    "Status": "Ready for Review",
    ...
  },
  "createdTime": "2025-01-10T12:00:00.000Z"
}
```

---

### 3. List Pages by Status

**Endpoint:**
```
GET /v0/{BASE_ID}/Pages?filterByFormula={Status}='AI Processing'
```

**Headers:**
```http
Authorization: Bearer {AIRTABLE_API_KEY}
```

**Common Filters:**

**Pages ready for AI generation:**
```
filterByFormula={Status}='AI Processing'
```

**Published pages only:**
```
filterByFormula={Published}=TRUE()
```

**Specific service pages:**
```
filterByFormula=AND({Service Name}='Bathroom Remodeling',{City}='Austin')
```

**Example Request:**
```bash
curl "https://api.airtable.com/v0/appABC123/Pages?filterByFormula=%7BStatus%7D%3D'AI%20Processing'" \
  -H "Authorization: Bearer pat1234567890abcdef"
```

**Example Response:**
```json
{
  "records": [
    {
      "id": "recXYZ789",
      "fields": {
        "Service Name": "Bathroom Remodeling",
        "City": "Austin",
        "Status": "AI Processing",
        ...
      },
      "createdTime": "2025-01-10T12:00:00.000Z"
    }
  ],
  "offset": "itrABC123"
}
```

**Pagination:**
- If `offset` is present in response, more records available
- Include `offset={value}` in next request to get next page
- Max 100 records per page

---

## Rate Limits

### Airtable Rate Limits

**Limit:** 5 requests per second per base

**Exceeded Response:**
```json
{
  "error": {
    "type": "RATE_LIMIT",
    "message": "You have exceeded the rate limit"
  }
}
```

**Response Headers:**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

### Best Practices

1. **Batch Updates:** Update multiple fields in one PATCH request
2. **Wait on 429:** Check `Retry-After` header and wait before retry
3. **Implement Backoff:** Use exponential backoff for retries
4. **Don't Poll:** Don't repeatedly query for status changes

**Example Retry Logic:**
```javascript
async function updateAirtableRecord(recordId, fields, retries = 3) {
  try {
    return await patchRecord(recordId, fields)
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      const waitTime = error.headers['retry-after'] || 30
      await sleep(waitTime * 1000)
      return updateAirtableRecord(recordId, fields, retries - 1)
    }
    throw error
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

**200 OK** - Request successful
```json
{
  "id": "recXYZ789",
  "fields": { ... }
}
```

**401 Unauthorized** - Invalid API key
```json
{
  "error": {
    "type": "UNAUTHORIZED",
    "message": "Invalid API key"
  }
}
```

**404 Not Found** - Record doesn't exist
```json
{
  "error": {
    "type": "NOT_FOUND",
    "message": "Could not find record recXYZ789"
  }
}
```

**422 Unprocessable Entity** - Invalid field value
```json
{
  "error": {
    "type": "INVALID_VALUE_FOR_COLUMN",
    "message": "Field 'Status' does not accept value 'InvalidStatus'"
  }
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": {
    "type": "RATE_LIMIT",
    "message": "You have exceeded the rate limit"
  }
}
```

### Error Handling Strategy

**For Content Writer Agent:**

1. **401 Unauthorized:**
   - Check `AIRTABLE_API_KEY` environment variable
   - Verify token has correct scopes
   - Regenerate token if expired

2. **404 Not Found:**
   - Verify record ID is correct
   - Check record exists in correct table
   - User may have provided wrong ID

3. **422 Invalid Value:**
   - Validate field values before sending
   - Check field types match Airtable schema
   - Ensure JSON strings are properly formatted

4. **429 Rate Limit:**
   - Implement exponential backoff
   - Wait for `Retry-After` seconds
   - Don't exceed 5 requests/second

---

## Data Type Reference

### Field Types in Airtable

**Single Line Text:**
```json
"SEO Title": "Bathroom Remodeling in Austin, TX"
```

**Long Text (Plain):**
```json
"SEO Description": "Transform your bathroom with..."
```

**Long Text (JSON):**
```json
"FAQs": "[{\"question\":\"...\",\"answer\":\"...\"}]"
```

**Number:**
```json
"Years in Business": 25
```

**Single Select:**
```json
"Status": "Ready for Review"
```

**Checkbox:**
```json
"Published": true
```

**Linked Record:**
```json
"Client Name": ["recClientABC123"]
```

---

## Content Writer Agent Integration

### Typical Workflow

**Step 1: Load Context**
```bash
GET /v0/{BASE_ID}/Pages/recXYZ789
```
→ Extract service, location, client data

**Step 2: Generate Content**
- Run FAQ generation task
- Run Benefits generation task
- Run SEO meta generation task
- Run Hero copy generation task

**Step 3: Validate Content**
- Check JSON syntax
- Verify character limits
- Ensure no placeholders

**Step 4: Write to Airtable**
```bash
PATCH /v0/{BASE_ID}/Pages/recXYZ789
{
  "fields": {
    "SEO Title": "...",
    "SEO Description": "...",
    "H1 Headline": "...",
    "Hero Subheadline": "...",
    "FAQs": "[...]",
    "Benefits": "[...]",
    "Status": "Ready for Review"
  }
}
```

---

## Security Best Practices

### Environment Variables

✅ **Do:**
- Store API key in `.env.local` (gitignored)
- Use environment variables in code
- Rotate tokens periodically
- Limit token scopes to minimum needed

❌ **Don't:**
- Hardcode API keys in code
- Commit API keys to git
- Share API keys via Slack/email
- Use overly broad token scopes

### Token Scopes

**Minimum Required Scopes:**
- `data.records:read` - Read page records
- `data.records:write` - Update page records

**Not Needed:**
- `schema.bases:write` - Don't need to modify base structure
- `data.records:delete` - Don't need to delete records

---

## Related Files

**BMad Agent & Tasks:**
- `.bmad-core/agents/copywriter.md` - Content Writer agent
- `.bmad-core/tasks/airtable-api-operations.md` - API operations helper
- `.bmad-core/tasks/generate-landing-page-content.md` - Master workflow

**Templates:**
- `.bmad-core/templates/airtable-content-output-tmpl.yaml` - Output format

**Type Definitions:**
- `src/types/airtable-schema.ts` - TypeScript interfaces for Airtable records

**Documentation:**
- `docs/workflows/ongoing/content-creation-workflow.md` - Content workflow

---

## External Resources

**Official Airtable API Documentation:**
- [API Overview](https://airtable.com/developers/web/api/introduction)
- [Authentication](https://airtable.com/developers/web/api/authentication)
- [Create API Token](https://airtable.com/create/tokens)
- [Rate Limits](https://airtable.com/developers/web/api/rate-limits)

**Tools:**
- [Postman](https://www.postman.com/) - Test API requests
- [cURL](https://curl.se/) - Command-line testing
- [JSONLint](https://jsonlint.com/) - Validate JSON syntax

---

**END OF DOCUMENTATION**
