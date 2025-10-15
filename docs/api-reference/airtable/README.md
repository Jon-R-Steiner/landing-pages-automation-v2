# Airtable API Reference

**Purpose:** Comprehensive Airtable automation scripting documentation and examples
**Last Updated:** 2025-10-14
**For:** Landing Pages Automation v2 Project

---

## 🎯 When to Load This Context

Load this entire folder when the dev agent needs to:
- Write Airtable automation scripts
- Work with Airtable API
- Create database integrations
- Implement record matching/linking logic

**Load command:**
```
@dev load docs/api-reference/airtable/ and [task instruction]
```

---

## 📚 What's Included

### Reference Documentation (`reference/`)

Complete Airtable scripting knowledge base:

1. **[fundamentals.md](./reference/fundamentals.md)** 📖
   - Script structure (automation vs extension)
   - Core APIs (base, table, record)
   - Input/output patterns
   - Async/await handling
   - Limitations & constraints

2. **[patterns.md](./reference/patterns.md)** 🔧
   - Record lookup patterns
   - Update patterns
   - Batch processing (50 record limit)
   - Validation patterns
   - Comparison & matching

3. **[best-practices.md](./reference/best-practices.md)** ⭐
   - Script organization
   - Performance optimization
   - Error handling strategies
   - Code quality guidelines
   - Testing approaches

4. **[field-types.md](./reference/field-types.md)** 🔢
   - Cell value formats by field type
   - Data structure reference
   - Type handling patterns

5. **[api-reference.md](./reference/api-reference.md)** 📘
   - Quick API method reference
   - Links to official documentation

### Examples (`examples/`)

Curated code examples organized by type:

- **[examples/README.md](./examples/README.md)** - Examples index with use cases
- **snippets/** - Small reusable patterns (5-20 lines)
- **complete/** - Full working examples (50-200 lines)
- **found/** - Curated third-party examples with source attribution

---

## 🚀 Quick Start Guide

### For Beginners

1. Read [fundamentals.md](./reference/fundamentals.md) sections 1-3
2. Study patterns in [patterns.md](./reference/patterns.md)
3. Review [examples/README.md](./examples/README.md) for use cases
4. Follow [best-practices.md](./reference/best-practices.md) checklist

### For Experienced Developers

1. Scan [fundamentals.md](./reference/fundamentals.md) for Airtable quirks
2. Use [patterns.md](./reference/patterns.md) as a recipe book
3. Check [examples/](./examples/) for similar implementations
4. Apply [best-practices.md](./reference/best-practices.md) performance tips

---

## 📋 Common Use Cases

### Use Case 1: Auto-Match Related Records

**Goal:** Match Page to Branch based on Location field

**Resources:**
- Pattern: [patterns.md - Find Record by Field Value](./reference/patterns.md)
- Example: `examples/complete/` (production script pattern)

**Dev instruction:**
```
@dev load docs/api-reference/airtable/ and create automation to match
     records in Table A to Table B based on field X
```

---

### Use Case 2: Validate & Enrich Data

**Goal:** Check required fields, add calculated values

**Resources:**
- Pattern: [patterns.md - Required Field Validation](./reference/patterns.md)
- Best Practice: [best-practices.md - Early Returns](./reference/best-practices.md)

**Dev instruction:**
```
@dev load docs/api-reference/airtable/ and create validation automation
     for required fields with enrichment logic
```

---

### Use Case 3: Batch Update Records

**Goal:** Update 100+ records based on criteria

**Resources:**
- Pattern: [patterns.md - Process in Batches of 50](./reference/patterns.md)
- Limitation: [fundamentals.md - Record Limits](./reference/fundamentals.md)

**Dev instruction:**
```
@dev load docs/api-reference/airtable/ and create batch update automation
     handling the 50 record limit
```

---

### Use Case 4: Self-Healing Automation

**Goal:** Compare current vs correct, only update if mismatch

**Resources:**
- Pattern: [patterns.md - Conditional Update](./reference/patterns.md)
- Example: `examples/complete/` (self-healing pattern)

**Dev instruction:**
```
@dev load docs/api-reference/airtable/ and create self-healing automation
     that only updates when values don't match
```

---

## ⚠️ Critical Reminders

### 1. Always `await` Async Operations
```javascript
// ❌ Wrong
let records = table.selectRecordsAsync();

// ✅ Correct
let records = await table.selectRecordsAsync();
```

### 2. Respect 50 Record Limit
```javascript
// ❌ Wrong
await table.updateRecordsAsync(allRecords); // Could be >50

// ✅ Correct - See patterns.md for batch processing pattern
```

### 3. Handle Missing/Null Fields
```javascript
// ❌ Wrong
let value = record.getCellValue("Field")[0].id; // Crashes if null

// ✅ Correct - See patterns.md for validation patterns
```

### 4. Never Overwrite User Data
```javascript
// ❌ Wrong - Deletes existing notes!
await table.updateRecordAsync(recordId, {"Notes": "New note"});

// ✅ Correct - See best-practices.md for data safety
```

---

## 🛠️ Development Workflow

### Writing a New Automation Script

1. **Plan:**
   - What's the trigger?
   - Which tables/fields involved?
   - What edge cases exist?

2. **Load Context:**
   ```
   @dev load docs/api-reference/airtable/ and create automation for [goal]
   ```

3. **Dev agent will:**
   - Reference fundamentals for API usage
   - Apply patterns for common operations
   - Follow best practices for structure
   - Use examples as implementation guides

4. **Test:**
   - Normal data cases
   - Edge cases (empty fields, no matches)
   - Batch limits (>50 records)
   - Error scenarios

5. **Deploy:**
   - Create automation in Airtable
   - Configure input variables
   - Test with real data
   - Monitor run history

---

## 📊 Script Template

Use this template for new scripts (also in best-practices.md):

```javascript
/**
 * Airtable Automation Script: [Script Name]
 *
 * Purpose: [What this script does]
 * Trigger: [When it runs]
 *
 * Logic:
 * 1. [Step 1]
 * 2. [Step 2]
 * 3. [Step 3]
 */

// === INPUT ===
let config = input.config();
let recordId = config.recordId;

console.log("=== Script Started ===");
console.log(`Record ID: ${recordId}`);

// === TABLE REFERENCES ===
let mainTable = base.getTable("Your Table");

// === MAIN LOGIC ===
try {
  // Your implementation using patterns from reference docs

  console.log("✅ Success");
  output.set("result", "success");

} catch (error) {
  console.error(`❌ ERROR: ${error.message}`);
  output.set("result", "error");
  output.set("message", error.message);
}

console.log("\n=== Script Complete ===");
```

---

## 🔗 External Resources

### Official Airtable Documentation
- [Airtable Scripting API](https://airtable.com/developers/scripting/api)
- [Run Script Action Guide](https://support.airtable.com/docs/run-a-script-action)
- [Input API](https://airtable.com/developers/scripting/api/input)
- [Output API](https://airtable.com/developers/scripting/api/output)

### Community
- [Airtable Community Forum](https://community.airtable.com/)
- [Scripting Examples](https://airtable.com/developers/scripting/examples)

---

## 💡 Contributing

When adding new Airtable reference material:

1. **Reference docs** → `reference/` folder
2. **Small snippets** → `examples/snippets/`
3. **Working examples** → `examples/complete/`
4. **Found examples** → `examples/found/` (with source attribution)
5. **Update** → `examples/README.md` index

---

**Navigation:**
- [← Back to API Reference Index](../README.md)
- [View Examples →](./examples/README.md)
- [Reference Documentation →](./reference/)

---

**Questions?** Load this entire folder with the dev agent and reference specific sections as needed.
