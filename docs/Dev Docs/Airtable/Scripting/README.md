# Airtable Scripting Documentation

**Purpose:** Comprehensive dev docs for writing Airtable automation scripts
**Last Updated:** 2025-10-11
**For:** Landing Pages Automation v2 Project

---

## 📚 Documentation Structure

This folder contains everything you need to write effective Airtable automation scripts:

### 1. **[Fundamentals](./01-airtable-scripting-fundamentals.md)** 📖

Start here if you're new to Airtable scripting or need a reference.

**Contents:**
- Script structure (automation vs extension)
- Core APIs (base, table, record)
- Input/output (`input.config()`, `output.set()`)
- Async/await patterns
- Error handling basics
- Limitations & constraints (50 record limit, timeouts)

**Use when:**
- Writing your first Airtable script
- Need API method reference
- Forgot field type return values
- Need to understand limitations

---

### 2. **[Common Patterns](./02-airtable-scripting-patterns.md)** 🔧

Reusable code patterns for common tasks.

**Contents:**
- Record lookup patterns (find, filter, sort)
- Update patterns (conditional, multi-field)
- Batch processing (50 record limit handling)
- Validation patterns (required fields, types)
- Comparison & matching (linked records)
- Error handling patterns (graceful degradation)

**Use when:**
- Need to find a record by field value
- Want to update only if changed (efficiency)
- Processing >50 records (batch loop)
- Comparing linked record IDs
- Handling edge cases

---

### 3. **[Best Practices](./03-airtable-scripting-best-practices.md)** ⭐

Guidelines for maintainable, efficient, reliable scripts.

**Contents:**
- Script organization (structure, separation of concerns)
- Performance optimization (parallel fetching, early returns)
- Error handling (try/catch, actionable messages)
- Code quality (naming, comments, logging)
- Testing & debugging strategies
- Security & data safety

**Use when:**
- Starting a new complex script
- Optimizing slow scripts
- Preparing for production deployment
- Code review
- Debugging failures

---

## 🚀 Quick Start

### For Beginners

1. Read [Fundamentals](./01-airtable-scripting-fundamentals.md) sections 1-3
2. Study our [production branch matching script](../airtable-automation-match-branch.js)
3. Copy a pattern from [Common Patterns](./02-airtable-scripting-patterns.md)
4. Follow [Best Practices](./03-airtable-scripting-best-practices.md) checklist

### For Experienced Developers

1. Scan [Fundamentals](./01-airtable-scripting-fundamentals.md) for Airtable-specific quirks
2. Use [Common Patterns](./02-airtable-scripting-patterns.md) as a recipe book
3. Follow [Best Practices](./03-airtable-scripting-best-practices.md) performance tips

---

## 🔗 Related Resources

### In This Project

- **Production Scripts:**
  - [`../airtable-automation-match-branch.js`](../airtable-automation-match-branch.js) - Smart branch matching (self-healing)
  - More scripts as we build them...

- **Workflow Docs:**
  - [`docs/workflows/build/airtable-setup/`](../../../docs/workflows/build/airtable-setup/) - Automation setup guides
  - [`docs/workflows/ongoing/`](../../../docs/workflows/ongoing/) - Operational workflows

### External Resources

- **Official Docs:**
  - [Airtable Scripting API](https://airtable.com/developers/scripting/api)
  - [Run Script Action Guide](https://support.airtable.com/docs/run-a-script-action)
  - [Input API](https://airtable.com/developers/scripting/api/input)
  - [Output API](https://airtable.com/developers/scripting/api/output)

- **Community:**
  - [Airtable Community Forum](https://community.airtable.com/)
  - [Scripting Examples](https://airtable.com/developers/scripting/examples)

---

## 📋 Common Use Cases

### Use Case 1: Auto-Match Related Records

**Example:** Match Page to Branch based on Location

**Pattern:** [Record Lookup Pattern 1](./02-airtable-scripting-patterns.md#pattern-1-find-record-by-field-value)

**Our Script:** [`../airtable-automation-match-branch.js`](../airtable-automation-match-branch.js)

---

### Use Case 2: Validate & Enrich Data

**Example:** Check required fields, add calculated values

**Pattern:** [Validation Pattern 10](./02-airtable-scripting-patterns.md#pattern-10-required-field-validation)

**Best Practice:** [Early Returns](./03-airtable-scripting-best-practices.md#-early-returns-to-avoid-unnecessary-work)

---

### Use Case 3: Batch Update Records

**Example:** Update 100+ records based on criteria

**Pattern:** [Batch Processing Pattern 8](./02-airtable-scripting-patterns.md#pattern-8-process-in-batches-of-50)

**Limitation:** [50 record limit](./01-airtable-scripting-fundamentals.md#record-limits)

---

### Use Case 4: Self-Healing Automation

**Example:** Compare current vs correct, only update if mismatch

**Pattern:** [Conditional Update Pattern 5](./02-airtable-scripting-patterns.md#pattern-5-conditional-update-only-if-changed)

**Our Script:** [`../airtable-automation-match-branch.js`](../airtable-automation-match-branch.js) (lines 165-184)

---

## 🛠️ Development Workflow

### Writing a New Script

1. **Plan:**
   - What's the trigger?
   - Which tables/fields involved?
   - What edge cases exist?

2. **Structure:**
   - Follow [Script Organization](./03-airtable-scripting-best-practices.md#-use-clear-script-structure)
   - Use sections: Input → Validation → Logic → Output

3. **Implement:**
   - Copy patterns from [Common Patterns](./02-airtable-scripting-patterns.md)
   - Add error handling (try/catch)
   - Log important decisions

4. **Test:**
   - Test with normal data
   - Test edge cases (empty fields, no matches)
   - Test with >50 records (batch limit)

5. **Deploy:**
   - Create automation in Airtable
   - Add input variables
   - Test with real data
   - Monitor run history

---

## ⚠️ Common Pitfalls

### 1. Forgetting `await`

```javascript
// ❌ Wrong
let records = table.selectRecordsAsync();

// ✅ Correct
let records = await table.selectRecordsAsync();
```

**See:** [Async/Await Patterns](./01-airtable-scripting-fundamentals.md#asyncawait-patterns)

---

### 2. Exceeding 50 Record Limit

```javascript
// ❌ Wrong
await table.updateRecordsAsync(allRecords); // Could be >50

// ✅ Correct
while (allRecords.length > 0) {
  let batch = allRecords.slice(0, 50);
  await table.updateRecordsAsync(batch);
  allRecords = allRecords.slice(50);
}
```

**See:** [Batch Processing Pattern 8](./02-airtable-scripting-patterns.md#pattern-8-process-in-batches-of-50)

---

### 3. Not Handling Missing Fields

```javascript
// ❌ Wrong
let value = record.getCellValue("Field")[0].id; // Crashes if null

// ✅ Correct
let field = record.getCellValue("Field");
if (field && field.length > 0) {
  let value = field[0].id;
}
```

**See:** [Validation Pattern 10](./02-airtable-scripting-patterns.md#pattern-10-required-field-validation)

---

### 4. Overwriting User Data

```javascript
// ❌ Wrong
await table.updateRecordAsync(recordId, {
  "Notes": "New note" // Deletes existing notes!
});

// ✅ Correct
let existing = record.getCellValue("Notes") || "";
let updated = existing ? `${existing}\nNew note` : "New note";
await table.updateRecordAsync(recordId, {
  "Notes": updated
});
```

**See:** [Data Safety](./03-airtable-scripting-best-practices.md#-avoid-overwriting-user-data)

---

## 📊 Script Template

Use this template as a starting point:

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
  // 1. Get record
  let record = await mainTable.selectRecordAsync(recordId, {
    fields: ["Field1", "Field2"]
  });

  if (!record) {
    throw new Error("Record not found");
  }

  // 2. Validation
  let field1 = record.getCellValue("Field1");
  if (!field1) {
    console.log("⏭️  SKIP: Field1 is empty");
    output.set("result", "skipped");
    return;
  }

  // 3. Your logic here
  console.log("\n--- Processing ---");
  // ...

  // 4. Update if needed
  await mainTable.updateRecordAsync(recordId, {
    "Field2": "Updated value"
  });

  console.log("✅ Success");
  output.set("result", "success");

} catch (error) {
  console.error(`❌ ERROR: ${error.message}`);
  console.error(error.stack);

  output.set("result", "error");
  output.set("message", error.message);
}

console.log("\n=== Script Complete ===");
```

---

## 🤝 Contributing

When adding new scripts or patterns:

1. **Document in this folder:**
   - Add pattern to [Common Patterns](./02-airtable-scripting-patterns.md)
   - Update [Best Practices](./03-airtable-scripting-best-practices.md) if needed
   - Add example to this README

2. **Follow conventions:**
   - Use our [script template](#-script-template)
   - Follow [naming conventions](./03-airtable-scripting-best-practices.md#-use-consistent-naming-conventions)
   - Add comprehensive logging

3. **Test thoroughly:**
   - Normal cases
   - Edge cases
   - Batch limits
   - Timeouts

---

## 📝 Version History

- **v1.0** (2025-10-11) - Initial documentation
  - Fundamentals guide
  - Common patterns (16 patterns)
  - Best practices
  - README index

---

**Questions?** Check the docs or review our production script: [`../airtable-automation-match-branch.js`](../airtable-automation-match-branch.js)
