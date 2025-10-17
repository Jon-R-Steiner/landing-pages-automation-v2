<!-- Powered by BMAD™ Core -->

# Generate Landing Page Content (Master Workflow)

## Purpose

Master workflow that orchestrates generation of all landing page content types:
- FAQ section (5 Q&As)
- Benefits list (5-7 items)
- SEO Meta (title + description)
- Hero Copy (H1 + subheadline)

This task coordinates the individual generation tasks and handles Airtable read/write operations.

---

## Prerequisites

**Environment Variables:**
- `AIRTABLE_API_KEY` - Must be set
- `AIRTABLE_BASE_ID` - Must be set

**Input Required:**
- Airtable Record ID (e.g., `recABC123`) OR
- Page URL or identifier to look up record

**Dependencies:**
- `airtable-api-operations.md` - API interaction helpers
- `generate-faq.md` - FAQ generation
- `generate-benefits.md` - Benefits generation
- `generate-seo-meta.md` - SEO meta generation
- `generate-hero-copy.md` - Hero copy generation

---

## Workflow Steps

### Step 1: Validate Environment

**Check:**
- [ ] `AIRTABLE_API_KEY` is set in environment
- [ ] `AIRTABLE_BASE_ID` is set in environment
- [ ] Agent has access to required task files

**If validation fails:**
- Display error message
- Provide instructions to set environment variables
- HALT workflow

---

### Step 2: Get Record ID

**Input Options:**

**Option A: User provides Record ID**
```
User: "Generate content for recABC123"
```
→ Use `recABC123` directly

**Option B: User provides Page URL or identifier**
```
User: "Generate content for bathroom-remodeling/austin-tx"
```
→ Query Airtable to find matching record
→ Use filter: `{URL Slug}='bathroom-remodeling/austin-tx'`

**Option C: User wants to process "AI Processing" status pages**
```
User: "Generate content for all pages ready for AI"
```
→ Query Airtable with filter: `{Status}='AI Processing'`
→ Process first record (or batch if requested)

---

### Step 3: Load Page Data from Airtable

**Execute:** `airtable-api-operations.md` (Read operation)

**API Call:**
```
GET https://api.airtable.com/v0/{BASE_ID}/Pages/{RECORD_ID}
```

**Extract Required Data:**
```javascript
// Service Information
serviceName = record.fields['Service Name']
serviceSlug = record.fields['Service Slug']

// Location Information
city = record.fields['City']
state = record.fields['State']
seoKeywords = record.fields['SEO Keywords']

// Client Branding & Differentiators
clientName = record.fields['Client Name']
primaryColor = record.fields['Primary Color']
yearsInBusiness = record.fields['Years in Business']
bbbRating = record.fields['BBB Rating']
warrantyYears = record.fields['Workmanship Warranty Years']

// Additional Context
branchPhone = record.fields['Branch Phone']
branchEmail = record.fields['Branch Email']
```

**Display Context Summary:**
```
✓ Page Data Loaded

Service: Bathroom Remodeling
Location: Austin, TX
Keywords: bathroom remodel, renovation, shower replacement
Client: Home Pro Services
Years in Business: 25
BBB Rating: A+
Warranty: Lifetime

Ready to generate content.
```

**If load fails:**
- Display error message
- Check record ID is valid
- Check API credentials
- HALT workflow

---

### Step 4: Generate FAQ Section

**Execute:** `generate-faq.md` task

**Input Context:**
- Service name: {serviceName}
- Location: {city}, {state}
- Client differentiators: {years}, {rating}, {warranty}
- Keywords: {seoKeywords}

**Output:**
- JSON array of 5 FAQ objects
- Validate JSON syntax
- Store in variable: `generatedFAQ`

**Display:**
```
✓ FAQ Generated

Sample Questions:
1. How much does bathroom remodeling cost in Austin, TX?
2. How long does a bathroom remodel take?
3. Are you licensed and insured for bathroom remodeling in Austin?
...
```

---

### Step 5: Generate Benefits List

**Execute:** `generate-benefits.md` task

**Input Context:**
- Service name: {serviceName}
- Location: {city}, {state}
- Client differentiators: {years}, {rating}, {warranty}
- Target audience: Homeowners seeking {service}

**Output:**
- JSON array of 5-7 benefit objects
- Validate JSON syntax
- Store in variable: `generatedBenefits`

**Display:**
```
✓ Benefits Generated

Sample Benefits:
1. 25+ Years of Austin Expertise
2. Lifetime Workmanship Warranty
3. 2-Week Average Completion
4. A+ BBB Rating You Can Trust
...
```

---

### Step 6: Generate SEO Meta

**Execute:** `generate-seo-meta.md` task

**Input Context:**
- Service name: {serviceName}
- Location: {city}, {state}
- Keywords: {seoKeywords}
- Client differentiators: {years}, {rating}

**Output:**
- SEO Title (50-60 characters)
- SEO Description (150-160 characters)
- Store in variables: `generatedTitle`, `generatedDescription`

**Display:**
```
✓ SEO Meta Generated

Title (58 chars): Bathroom Remodeling in Austin, TX | Free Quote
Description (156 chars): Transform your bathroom with Austin's trusted remodeling experts. 25+ years experience, A+ BBB rated...
```

---

### Step 7: Generate Hero Copy

**Execute:** `generate-hero-copy.md` task

**Input Context:**
- Service name: {serviceName}
- Location: {city}, {state}
- Client differentiators: {years}, {rating}
- Target audience pain point: Outdated/dysfunctional bathroom

**Output:**
- H1 Headline (40-70 characters)
- Hero Subheadline (80-120 characters)
- Store in variables: `generatedH1`, `generatedSubheadline`

**Display:**
```
✓ Hero Copy Generated

H1 (49 chars): Expert Bathroom Remodeling in Austin, TX
Subheadline (127 chars): Transform your bathroom into the space you've always dreamed of. 25+ years of trusted Austin service...
```

---

### Step 8: Validate All Generated Content

**Run Validation Checks:**

**FAQ Validation:**
- [ ] Valid JSON syntax
- [ ] Exactly 5 FAQ objects
- [ ] All questions end with "?"
- [ ] All answers 50-150 words

**Benefits Validation:**
- [ ] Valid JSON syntax
- [ ] 5-7 benefit objects
- [ ] All benefits have title, description, icon
- [ ] Benefits are customer-focused (not features)

**SEO Meta Validation:**
- [ ] Title 50-60 characters (or 40-60 acceptable)
- [ ] Description 150-160 characters (or 120-160 acceptable)
- [ ] Both include service name and location

**Hero Copy Validation:**
- [ ] H1 is 40-70 characters (or 30-80 acceptable)
- [ ] Subheadline is 80-120 characters (or 60-140 acceptable)
- [ ] H1 includes service name and location

**If validation fails:**
- Display specific validation error
- Re-generate failed content
- Re-validate

---

### Step 9: Preview Generated Content

**Display Complete Summary:**

```
========================================
GENERATED LANDING PAGE CONTENT
========================================

PAGE: Bathroom Remodeling in Austin, TX
RECORD ID: recABC123

--- SEO META ---
Title: Bathroom Remodeling in Austin, TX | Free Quote
Description: Transform your bathroom with Austin's trusted remodeling experts. 25+ years experience, A+ BBB rated, lifetime warranty. Free quotes - call today!

--- HERO SECTION ---
H1: Expert Bathroom Remodeling in Austin, TX
Subheadline: Transform your bathroom into the space you've always dreamed of. 25+ years of trusted Austin service. Free quotes available.

--- BENEFITS (6 items) ---
1. 25+ Years of Austin Expertise
2. Lifetime Workmanship Warranty
3. 2-Week Average Completion
4. A+ BBB Rating You Can Trust
5. Licensed & Fully Insured
6. No-Pressure Free Quotes

--- FAQ (5 items) ---
1. How much does bathroom remodeling cost in Austin, TX?
2. How long does a bathroom remodel take?
3. Are you licensed and insured for bathroom remodeling in Austin?
4. Do you offer warranties on bathroom remodeling work?
5. What areas of Austin do you serve for bathroom remodeling?

========================================
```

**Ask for Confirmation:**
```
Review the generated content above.

Options:
1. Write to Airtable (proceed to Step 10)
2. Regenerate specific section (FAQ, Benefits, SEO, or Hero)
3. Cancel (don't write to Airtable)

Select 1-3:
```

---

### Step 10: Write to Airtable

**Execute:** `airtable-api-operations.md` (Update operation)

**API Call:**
```
PATCH https://api.airtable.com/v0/{BASE_ID}/Pages/{RECORD_ID}
```

**Request Body:**
```json
{
  "fields": {
    "SEO Title": "{generatedTitle}",
    "SEO Description": "{generatedDescription}",
    "H1 Headline": "{generatedH1}",
    "Hero Subheadline": "{generatedSubheadline}",
    "FAQs": "{generatedFAQ as JSON string}",
    "Benefits": "{generatedBenefits as JSON string}",
    "Status": "Ready for Review"
  }
}
```

**Important:**
- FAQ and Benefits must be JSON strings (not objects)
- Use `JSON.stringify()` to convert arrays to strings
- Status updated to "Ready for Review" to signal completion

**Success Response:**
```
✓ Content Written to Airtable

Record ID: recABC123
URL: [Airtable record link]

Updated Fields:
- SEO Title ✓
- SEO Description ✓
- H1 Headline ✓
- Hero Subheadline ✓
- FAQs ✓
- Benefits ✓
- Status → Ready for Review ✓

Marketing team can now review in Airtable.
```

**If write fails:**
- Display error message
- Show API response error
- Suggest retry or manual update
- DON'T lose generated content - offer to save locally

---

### Step 11: Completion Summary

**Display Final Summary:**
```
========================================
WORKFLOW COMPLETE
========================================

✓ Page data loaded from Airtable
✓ FAQ section generated (5 Q&As)
✓ Benefits list generated (6 items)
✓ SEO meta generated (title + description)
✓ Hero copy generated (H1 + subheadline)
✓ All content validated
✓ Content written to Airtable
✓ Status updated to "Ready for Review"

Next Steps:
1. Marketing team reviews content in Airtable
2. Marketing team approves or requests changes
3. If approved → Airtable webhook triggers export
4. Export creates content.json
5. Netlify builds static site

========================================
```

---

## Error Handling

### Common Errors

**Missing Environment Variables:**
```
❌ ERROR: AIRTABLE_API_KEY not set

Fix: Add to .env.local:
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here

Then restart agent.
```

**Invalid Record ID:**
```
❌ ERROR: Record recABC123 not found

Check:
- Record ID is correct
- Record exists in Pages table
- API key has permission to read record
```

**Rate Limit Exceeded:**
```
❌ ERROR: 429 Too Many Requests

Airtable limit: 5 requests/second

Waiting 30 seconds before retry...
```

**Validation Failure:**
```
❌ ERROR: Generated FAQ failed validation
Issue: Only 4 FAQs generated (expected 5)

Re-generating FAQ section...
```

---

## Batch Processing (Optional)

**If user requests batch processing:**

```
User: "Generate content for all AI Processing pages"
```

**Workflow:**
1. Query Airtable for all records with `{Status}='AI Processing'`
2. For each record:
   - Run Steps 3-10
   - Display progress (e.g., "Processing 3 of 12...")
   - Rate limit: Max 4 records/second
3. Display batch summary:
   - X records processed successfully
   - Y records failed (with reasons)
   - Links to updated records

---

## Alternative Modes

### Mode 1: Individual Section Generation

**User:** "Generate only FAQ for recABC123"

**Workflow:**
1. Load context (Step 3)
2. Generate FAQ only (Step 4)
3. Validate FAQ
4. Write only FAQ field to Airtable
5. DON'T update Status

### Mode 2: Regenerate Existing Content

**User:** "Regenerate benefits for recABC123"

**Workflow:**
1. Load existing content from Airtable
2. Display current benefits
3. Generate new benefits
4. Show side-by-side comparison
5. Ask: Keep old or use new?
6. Write only if user confirms

### Mode 3: Review-Only (No Write)

**User:** "Generate content but don't write to Airtable"

**Workflow:**
1. Run Steps 3-8 (load, generate, validate)
2. Display preview (Step 9)
3. Skip Step 10 (write)
4. Offer to save locally as JSON

---

## Related Files

- **Agent:** `.bmad-core/agents/copywriter.md`
- **API Operations:** `.bmad-core/tasks/airtable-api-operations.md`
- **Individual Tasks:**
  - `.bmad-core/tasks/generate-faq.md`
  - `.bmad-core/tasks/generate-benefits.md`
  - `.bmad-core/tasks/generate-seo-meta.md`
  - `.bmad-core/tasks/generate-hero-copy.md`
- **Guidelines:** `.bmad-core/data/content-generation-guidelines.md`

---

**END OF TASK**
