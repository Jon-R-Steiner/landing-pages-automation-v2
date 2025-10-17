<!-- Powered by BMAD™ Core -->

# Get Airtable Table Schema Task

## Purpose

Fetch and display the complete schema for any Airtable table in the project base, including field IDs, types, and descriptions.

## Prerequisites

- Airtable credentials configured (`.env.local` or `.env` with `AIRTABLE_PAT` and `AIRTABLE_BASE_ID`)
- Dynamic schema script exists: `scripts/get-table-schema.ts`

## Instructions

### Step 1: Present Available Tables

Show the user the list of available tables in the Airtable base:

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

**Prompt**: "Which table would you like to fetch the schema for?"

- Accept table name (case-insensitive)
- Accept number from list (1-12)
- Validate input against available tables

### Step 3: Execute Schema Fetch

Run the dynamic schema script with the selected table name:

```bash
npx tsx scripts/get-table-schema.ts [TableName]
```

**Example**:
```bash
npx tsx scripts/get-table-schema.ts Pages
npx tsx scripts/get-table-schema.ts Offers
```

### Step 4: Display Results

The script will output:
- Table name and ID
- Complete list of fields with:
  - Field name
  - Field ID
  - Field type
  - Description (if available)

### Step 5: Handle Errors

**If table not found**:
- Script automatically lists all available tables
- Ask user to select from the displayed list
- Re-run with corrected table name

**If credentials missing**:
- Check for `.env.local` or `.env` file
- Verify `AIRTABLE_PAT` and `AIRTABLE_BASE_ID` are set
- Provide guidance on setting up credentials

## Output

The schema information can be used for:
- Understanding table structure
- Writing data extraction scripts
- Mapping fields for automation
- Documentation and reference

## Success Criteria

- ✅ Schema displayed successfully
- ✅ All field IDs, types, and descriptions visible
- ✅ User has the information needed for their next task

## Related Tasks

- `export-airtable-data.md` (if it exists) - Using schema to extract data
- `create-extraction-script.md` (if it exists) - Building new extraction workflows

## Notes

- The script is dynamic and works with ANY table in the base
- Table names are case-sensitive in the script
- No need to create separate scripts per table anymore
- Schema fetch is read-only and safe to run anytime
