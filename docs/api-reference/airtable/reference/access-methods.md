# Airtable Access Methods: Choosing the Right API

**Purpose:** Decision guide for selecting the correct Airtable API for your task
**Last Updated:** 2025-10-17
**For:** Landing Pages Automation v2 Project

---

## Table of Contents

1. [Overview](#overview)
2. [Method 1: Airtable Scripting API](#method-1-airtable-scripting-api)
3. [Method 2: Airtable REST API (Direct HTTP)](#method-2-airtable-rest-api-direct-http)
4. [Method 3: Airtable.js (Official Node.js Library)](#method-3-airtablejs-official-nodejs-library)
5. [Decision Flow Chart](#decision-flow-chart)
6. [Practical Examples](#practical-examples)
7. [Quick Reference Table](#quick-reference-table)
8. [Summary](#summary)

---

## Overview

There are **three distinct ways** to access Airtable data, each designed for different use cases:

1. **Airtable Scripting API** - JavaScript that runs INSIDE Airtable automations
2. **Airtable REST API** - Direct HTTP calls (curl, fetch) for metadata/schema
3. **Airtable.js** - Official Node.js library for record operations

**The Golden Rule:** If it runs in Airtable → Scripting API. If it needs schema → REST API. If it's a Node.js record script → Airtable.js.

---

## Method 1: Airtable Scripting API

### What is it?

JavaScript code that runs inside Airtable's automation engine on Airtable's servers.

### Syntax Example

```javascript
// Runs INSIDE Airtable automations
let table = base.getTable("Services");
let query = await table.selectRecordsAsync();
let record = query.records[0];
let value = record.getCellValue("Field Name");
```

### ✅ WHEN to use

- ONLY when creating Airtable automations that run inside Airtable itself
- When you need to respond to triggers (record created, field updated, etc.)
- When you want zero external infrastructure (no servers, no cron jobs)

### 📍 WHERE to use

- **Location:** Inside Airtable's web UI → Automations → "Run script" action
- **Files:** `scripts/Airtable/automation-*.js` (stored locally for version control, but copy/pasted into Airtable)

### Current Usage in Your Project

✅ `scripts/Airtable/automation-9-new-keyword.js`
✅ `scripts/Airtable/automation-10-new-location.js`
✅ `scripts/Airtable/automation-11-new-offer.js`
✅ `scripts/Airtable/automation-11b-offer-updated.js`
✅ `scripts/Airtable/automation-airtable-match-branch.js`

### Key Features

- ✅ Access to `input.config()` for trigger data
- ✅ Access to `output.set()` for automation results
- ✅ No authentication needed (already logged in)
- ❌ Cannot access Metadata API (schema inspection)
- ❌ Cannot run outside Airtable

### Decision Rule

**"Is this code triggered by an Airtable event and needs to modify records in response?"**
- YES → Use Scripting API
- NO → Use one of the other methods

---

## Method 2: Airtable REST API (Direct HTTP)

### What is it?

Direct HTTP requests to Airtable's REST API endpoints using curl, fetch, or any HTTP client.

### Syntax Example

```bash
# Via curl
curl -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  https://api.airtable.com/v0/meta/bases/appATvatPtaoJ8MmS/tables

# Via Node.js fetch
const response = await fetch(
  'https://api.airtable.com/v0/meta/bases/appATvatPtaoJ8MmS/tables',
  { headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}` } }
);
const schema = await response.json();
```

### ✅ WHEN to use

- When you need to access the Metadata API (get schema, field types, formulas)
- One-off schema inspection scripts
- When you want zero dependencies (no npm packages)
- Quick debugging or exploration

### 📍 WHERE to use

- **Terminal/Command Line:** Direct curl commands for quick checks
- **Node.js scripts:** When you specifically need metadata or want minimal dependencies

### Current Usage in Your Project

✅ Schema inspection (curl commands to fetch schema)
✅ `scripts/compare-airtable-schema.js` (reads `airtable-schema-live.json`)
✅ `scripts/extract-offers-status.js` (reads schema JSON)
✅ `scripts/extract-locations-formulas.js` (reads schema JSON)

### Key Features

- ✅ **ONLY method that can access Metadata API**
- ✅ No dependencies required
- ✅ Full control over HTTP requests
- ❌ Verbose for complex operations (manual pagination)
- ❌ No automatic retry logic
- ❌ Manual error handling

### Decision Rule

**"Do I need to inspect the schema (field types, formulas, table structure)?"**
- YES → Must use REST API (only option)
- NO → Consider airtable.js instead

---

## Method 3: Airtable.js (Official Node.js Library)

### What is it?

Official JavaScript library that wraps the REST API with a clean object-oriented interface.

### Syntax Example

```javascript
const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
  .base('appATvatPtaoJ8MmS');

// Query records
const pages = await base('Pages')
  .select({
    filterByFormula: '{Published} = TRUE()',
    maxRecords: 100,
    sort: [{field: 'Created Date', direction: 'desc'}]
  })
  .all(); // Automatically handles pagination!

// Create records
await base('Pages').create([
  {fields: {/* ... */}},
  {fields: {/* ... */}}
]);
```

### ✅ WHEN to use

- Querying or modifying records (not schema) from Node.js
- When you need to iterate through many records (automatic pagination)
- When you want built-in error handling and retry logic
- Building export/import scripts
- Building data synchronization tools
- Any script that needs to read/write large amounts of data

### 📍 WHERE to use

- Node.js scripts in your project that query/modify records
- Build scripts that need to export data
- Utility scripts for data management
- **NOT** in Airtable automations (use Scripting API instead)

### Recommended Usage in Your Project

✅ `scripts/export-airtable-to-json.ts` (already set up!)
✅ Any future scripts that query/modify records in bulk
✅ Data migration scripts
✅ Backup/restore scripts
✅ Content validation scripts

### Key Features

- ✅ Automatic pagination (`.all()` method)
- ✅ Built-in rate limit retry logic
- ✅ Clean, chainable API
- ✅ Promise-based (async/await)
- ✅ Official library (maintained by Airtable)
- ❌ Cannot access Metadata API (schema)
- ❌ Adds dependency (already installed in your project)

### Decision Rule

**"Am I building a Node.js script that needs to read/write many records?"**
- YES → Use airtable.js
- NO → Use REST API for simple one-offs

---

## Decision Flow Chart

```
START: Need to access Airtable?
│
├─ Where will this code run?
│  │
│  ├─ INSIDE Airtable (automation triggered by events)
│  │  └─ ✅ USE: Airtable Scripting API
│  │     Files: scripts/Airtable/automation-*.js
│  │
│  └─ OUTSIDE Airtable (Node.js, terminal, CI/CD)
│     │
│     ├─ Do you need SCHEMA information (field types, formulas)?
│     │  │
│     │  ├─ YES → ✅ USE: REST API (curl or fetch)
│     │  │         Example: Fetch metadata, inspect field types
│     │  │
│     │  └─ NO → Are you working with MANY RECORDS?
│     │           │
│     │           ├─ YES → ✅ USE: Airtable.js
│     │           │         Example: Export 500 pages, bulk create
│     │           │
│     │           └─ NO → ✅ USE: Either REST API or Airtable.js
│     │                    (Choose REST for zero dependencies)
```

---

## Practical Examples

### Example 1: Add new automation for "Page Approved"

**Scenario:** When Pages.Status changes to "Approved", send webhook to Netlify

**Method:** ✅ Airtable Scripting API

**Why:** Triggered by field update, runs inside Airtable

**File:** `scripts/Airtable/automation-12-page-approved.js`

---

### Example 2: Export all published pages to content.json

**Scenario:** Nightly script that exports 500+ pages for Next.js build

**Method:** ✅ Airtable.js

**Why:**
- Runs in Node.js (not in Airtable)
- Needs to query 100s of records across multiple tables
- Automatic pagination (no manual offset handling)
- Built-in retry for rate limits

**File:** `scripts/export-airtable-to-json.ts` (already exists!)

---

### Example 3: Check if Offers table has "Active" field

**Scenario:** Verify schema before updating automation script

**Method:** ✅ REST API

**Why:** Need to inspect field types (Metadata API)

**Command:**
```bash
curl -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  https://api.airtable.com/v0/meta/bases/appATvatPtaoJ8MmS/tables \
  | jq '.tables[] | select(.name == "Offers") | .fields'
```

---

### Example 4: Validate all page URLs are unique

**Scenario:** One-time check to ensure no duplicate Page URLs exist

**Method:** ✅ Airtable.js (preferred) or REST API

**Why:**
- Runs in Node.js
- Needs to query all Pages records (could be 1000s)
- Airtable.js handles pagination automatically

**File:** `scripts/validate-page-urls.js` (future)

```javascript
const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
  .base('appATvatPtaoJ8MmS');

const pages = await base('Pages').select({fields: ['Page URL']}).all();
// Check for duplicates...
```

---

## Quick Reference Table

| Task                                        | Method        | File Location                                                      |
|---------------------------------------------|---------------|--------------------------------------------------------------------|
| Automation: Create pages when keyword added | Scripting API | `scripts/Airtable/automation-9-new-keyword.js` → Copy to Airtable UI |
| Automation: Match branch when page created  | Scripting API | `scripts/Airtable/automation-match-branch.js` → Copy to Airtable UI  |
| Check if field is formula vs select         | REST API      | Terminal: `curl ...` or create script                                |
| Export all pages for Next.js build          | Airtable.js   | `scripts/export-airtable-to-json.ts`                                 |
| Bulk update 100 records                     | Airtable.js   | Create new script in `scripts/`                                      |
| Inspect field types before coding           | REST API      | Terminal or save as `airtable-schema-live.json`                      |
| One-off query to find records               | Either        | Airtable.js if complex, REST if simple                             |

---

## Summary

### Quick Decision Rules

- **Airtable Scripting API** = Inside Airtable automations only
- **REST API** = Schema inspection, minimal dependencies
- **Airtable.js** = Node.js scripts that work with many records

### Golden Rule

**If it runs in Airtable → Scripting API. If it needs schema → REST API. If it's a Node.js record script → Airtable.js.**

---

## Next Steps

Now that you understand which API to use:

1. **For Scripting API:** Read [fundamentals.md](./fundamentals.md) for detailed Scripting API documentation
2. **For REST API:** Visit [Airtable REST API Documentation](https://airtable.com/developers/web/api/introduction)
3. **For Airtable.js:** Visit [Airtable.js GitHub Repository](https://github.com/Airtable/airtable.js)

---

## External Resources

- [Airtable Scripting API](https://airtable.com/developers/scripting/api)
- [Airtable REST API (Web API)](https://airtable.com/developers/web/api/introduction)
- [Airtable.js GitHub](https://github.com/Airtable/airtable.js)
- [Airtable Metadata API](https://airtable.com/developers/web/api/get-base-schema)

---

**Navigation:**
- [← Back to Airtable Reference Index](../README.md)
- [Scripting API Fundamentals →](./fundamentals.md)
- [View Examples →](../examples/README.md)
