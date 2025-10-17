<!-- Powered by BMAD™ Core -->

# Update Airtable Table Descriptions Task

## Purpose

Intelligently update field descriptions for any Airtable table by analyzing codebase usage, TypeScript types, component integration, and Schema.org mappings.

## Prerequisites

- Airtable credentials configured (`.env.local` or `.env` with `AIRTABLE_PAT` and `AIRTABLE_BASE_ID`)
- Dynamic schema scripts exist:
  - `scripts/get-table-schema.ts`
  - `scripts/update-table-descriptions.ts`

## Instructions

### Step 1: Present Available Tables

Show the user the list of available tables:

**Available Tables:**

1. Clients
2. Services
3. Branch Staff
4. Branch Locations
5. Locations
6. Service Areas
7. Offers
8. Pages
9. CTAs
10. Hero Images Library
11. Testimonials
12. Campaigns

### Step 2: Elicit Table Selection

**Prompt**: "Which table would you like to update descriptions for?"

- Accept table name (case-insensitive)
- Accept number from list (1-12)
- Validate input against available tables

### Step 3: Fetch Current Schema

Run the schema script to see existing fields:

```bash
npx tsx scripts/get-table-schema.ts [TableName]
```

**Review Output:**
- Note all field names and their current descriptions
- Identify fields missing descriptions
- Understand field types and options

### Step 4: Analyze Codebase Context

**Systematically research how each field is used:**

1. **Search TypeScript Types:**
   - Look for interface definitions matching the table name
   - Example: Search for `interface PageData`, `type Service`, etc.
   - Note field types, comments, and JSDoc annotations

2. **Search Component Usage:**
   - Find React components that use this table's data
   - Look for field references in JSX/TSX files
   - Note how fields are displayed, transformed, or validated

3. **Search Data Processing:**
   - Find extraction scripts in `scripts/` directory
   - Look for field mappings and transformations
   - Note any computed or derived fields

4. **Check Schema.org Integration:**
   - Search for Schema.org structured data usage
   - Look for JSON-LD generation using these fields
   - Note semantic mappings (e.g., `name` → `schema:name`)

5. **Review API/Data Layer:**
   - Check how fields are fetched from Airtable API
   - Look for field validation or sanitization logic
   - Note required vs optional fields

### Step 5: Generate Descriptions JSON

**Create intelligent, context-aware descriptions:**

**Guidelines:**
- Be concise but informative (1-2 sentences max)
- Mention data type if relevant
- Note if field is required or optional
- Reference Schema.org mapping if applicable
- Explain computed/derived values
- Note validation rules or constraints

**Format:**
```json
{
  "fld1234567890": "Primary identifier for the page. Maps to Schema.org 'name' property.",
  "fld0987654321": "SEO-optimized meta description (max 160 chars). Used in <meta> tags and Schema.org.",
  "fldABCDEFGHIJ": "Optional hero image URL. Fallback to default if not provided."
}
```

**Create temp file:**
```bash
# Save as scripts/.temp-descriptions.json
```

### Step 6: Execute Update Script

Run the update script with the generated descriptions:

```bash
npx tsx scripts/update-table-descriptions.ts [TableName] scripts/.temp-descriptions.json
```

**Monitor Output:**
- ✅ markers indicate successful updates
- Note any errors or skipped fields
- Verify field count matches expectations

### Step 7: Cleanup and Verify

**Remove temp file:**
```bash
rm scripts/.temp-descriptions.json
```

**Verify updates:**
- Optionally re-run `get-table-schema.ts` to confirm descriptions were applied
- Show summary of updated fields

### Step 8: Report Results

**Provide summary:**
```
✅ Updated [N] field descriptions for [TableName]:
- Field 1 Name: [Description]
- Field 2 Name: [Description]
...

Total fields updated: [N]
```

## Context Sources Priority

When analyzing fields, prioritize information from:

1. **TypeScript interfaces** - Most authoritative for data structure
2. **Component usage** - Shows real-world field purpose
3. **Schema.org mappings** - Semantic meaning and SEO context
4. **Extraction scripts** - Data transformation and validation logic
5. **Existing Airtable descriptions** - Historical context (if available)

## Success Criteria

- ✅ All fields have meaningful, context-aware descriptions
- ✅ Descriptions reference Schema.org mappings where applicable
- ✅ Descriptions note validation rules or constraints
- ✅ Update script executed successfully with no errors
- ✅ Temp file cleaned up

## Example Output

**For "Pages" Table:**

```json
{
  "fldPageName": "Primary page identifier used in URL slug generation. Maps to Schema.org 'name'.",
  "fldMetaDescription": "SEO meta description (max 160 chars). Used in <meta> tags and Schema.org WebPage description.",
  "fldHeroImageUrl": "Optional hero image URL. Falls back to default hero if null. Must be valid HTTPS URL.",
  "fldServiceIds": "Array of linked Service record IDs. Used to display service offerings on location pages.",
  "fldPublishDate": "ISO 8601 publish date. Controls page visibility (null = unpublished).",
  "fldSchema": "JSON object containing Schema.org LocalBusiness or Service markup for this page."
}
```

## Related Tasks

- `get-airtable-table-schema.md` - Fetch schema before updating descriptions
- `new-airtable-script.md` - Create new extraction scripts using updated schemas
- `document-airtable-script.md` - Document scripts with field descriptions

## Notes

- This is a safe, read-then-write operation
- Field descriptions are metadata and don't affect data integrity
- Descriptions improve developer experience and documentation
- Re-run anytime codebase changes to keep descriptions current
- Use AI analysis to avoid manual description writing

## Error Handling

**If field ID not found:**
- Script will skip that field with a warning
- Double-check field IDs from `get-table-schema.ts`

**If table not found:**
- Script lists all available tables
- Correct table name and retry

**If JSON malformed:**
- Validate JSON structure before running update script
- Use a JSON validator if needed
