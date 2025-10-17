# Airtable Scripting Fundamentals

**Purpose:** Core concepts and API reference for writing Airtable automation scripts
**Last Updated:** 2025-10-11
**Airtable API Version:** 2025

---

**📌 Before You Start:**
This guide covers the **Airtable Scripting API** (for automations inside Airtable). If you're unsure which API to use (Scripting API vs REST API vs Airtable.js), read **[access-methods.md](./access-methods.md)** first to understand when to use each method.

---

## Table of Contents

1. [Script Structure](#script-structure)
2. [Core APIs](#core-apis)
3. [Input/Output](#inputoutput)
4. [Async/Await Patterns](#asyncawait-patterns)
5. [Error Handling](#error-handling)
6. [Limitations & Constraints](#limitations--constraints)

---

## Script Structure

### Automation Script vs Scripting Extension

**Automation Script (What We Use):**
- Runs in **background** as part of automation
- Triggered by automation conditions
- Uses `input.config()` for input variables
- Uses `output.set()` to pass data to next steps
- **Timeout:** 120 seconds
- **API Timeout:** 12 seconds per API call
- **Fetch Timeout:** 30 seconds

**Scripting Extension (Different):**
- Runs in **foreground** of base
- Manual execution
- Interactive UI for user input
- Not used in our automations

---

## Core APIs

### 1. Base API

The `base` object represents your entire Airtable base.

```javascript
// Get a table by name
let pagesTable = base.getTable("Pages");
let branchesTable = base.getTable("Branch Locations");

// Get current base ID (for debugging)
console.log(`Base ID: ${base.id}`);
```

**Key Methods:**
- `base.getTable(tableName)` - Returns Table object
- `base.id` - Returns base ID string

---

### 2. Table API

Table objects let you query and modify records.

#### selectRecordsAsync()

**Basic Usage:**
```javascript
// Get all records (no fields specified = all fields)
let allRecords = await table.selectRecordsAsync();

// Get specific fields only
let records = await table.selectRecordsAsync({
  fields: ["Name", "Email", "Active"]
});

// Access records
for (let record of records.records) {
  console.log(record.id);
  console.log(record.name);
}
```

**With Filtering (Client-Side):**
```javascript
// Note: Airtable scripts don't support server-side filterByFormula
// You must fetch all records and filter in JavaScript

let allRecords = await table.selectRecordsAsync({
  fields: ["Location ID", "Active"]
});

// Filter in JavaScript
let activeRecords = allRecords.records.filter(record => {
  let isActive = record.getCellValue("Active");
  return isActive === true;
});
```

**Important:** Unlike the REST API, scripting API does NOT support `filterByFormula`. You must fetch and filter client-side.

#### selectRecordAsync()

Get a single record by ID:

```javascript
let record = await table.selectRecordAsync(recordId, {
  fields: ["Name", "Email"]
});

if (record) {
  console.log(record.name);
}
```

---

### 3. Record API

#### Reading Data

```javascript
// Get raw cell value
let clientName = record.getCellValue("Client Name");

// Get human-readable string
let clientNameStr = record.getCellValueAsString("Client Name");

// Linked records return arrays
let locationId = record.getCellValue("Location ID");
if (locationId && locationId.length > 0) {
  console.log(locationId[0].id);   // Record ID
  console.log(locationId[0].name); // Display value
}

// Checkbox fields return boolean
let isActive = record.getCellValue("Active");
if (isActive === true) {
  // Do something
}
```

**Field Type Patterns:**

| Field Type | getCellValue() Returns | Example |
|------------|------------------------|---------|
| Single line text | String | `"John Doe"` |
| Long text | String | `"Description here"` |
| Number | Number | `42` |
| Checkbox | Boolean | `true` or `false` |
| Single select | Object | `{id: "sel123", name: "Option A"}` |
| Multiple select | Array of objects | `[{id: "sel1", name: "Tag1"}]` |
| Linked record | Array of objects | `[{id: "rec123", name: "Record Name"}]` |
| Attachment | Array of objects | `[{id: "att123", url: "...", filename: "..."}]` |
| Date | String (ISO 8601) | `"2025-10-11"` |
| Formula | Depends on output | Various |
| Lookup | Array | `["value1", "value2"]` |
| Rollup | Depends on aggregation | Various |

---

### 4. Update Operations

#### Update Single Record

```javascript
await table.updateRecordAsync(recordId, {
  "Field Name": "New Value",
  "Another Field": 123,
  "Active": true
});
```

**Updating Linked Records:**
```javascript
// Set single linked record
await table.updateRecordAsync(recordId, {
  "Matched Branch": [{id: "recBranchId123"}]
});

// Set multiple linked records
await table.updateRecordAsync(recordId, {
  "Tags": [
    {id: "recTag1"},
    {id: "recTag2"}
  ]
});

// Clear linked record (set to empty array)
await table.updateRecordAsync(recordId, {
  "Matched Branch": []
});
```

#### Update Multiple Records (Batch)

**⚠️ Limit: 50 records per batch**

```javascript
let updates = [];

for (let record of recordsToUpdate) {
  updates.push({
    id: record.id,
    fields: {
      "Status": "Processed",
      "Updated Date": new Date().toISOString()
    }
  });
}

// Process in batches of 50
while (updates.length > 0) {
  let batch = updates.slice(0, 50);
  await table.updateRecordsAsync(batch);
  updates = updates.slice(50);
}
```

---

### 5. Create Operations

#### Create Single Record

```javascript
let newRecordId = await table.createRecordAsync({
  "Name": "John Doe",
  "Email": "john@example.com",
  "Active": true
});

console.log(`Created record: ${newRecordId}`);
```

#### Create Multiple Records (Batch)

**⚠️ Limit: 50 records per batch**

```javascript
let recordsToCreate = [
  {
    fields: {
      "Name": "Record 1",
      "Status": "Draft"
    }
  },
  {
    fields: {
      "Name": "Record 2",
      "Status": "Draft"
    }
  }
];

// Process in batches of 50
while (recordsToCreate.length > 0) {
  let batch = recordsToCreate.slice(0, 50);
  await table.createRecordsAsync(batch);
  recordsToCreate = recordsToCreate.slice(50);
}
```

---

## Input/Output

### Input Variables (input.config())

Automation scripts receive input from the trigger or previous actions:

```javascript
// Get input configuration
let config = input.config();

// Access input variables (defined in automation UI)
let recordId = config.recordId;
let clientName = config.clientName;
let locationId = config.locationId;

console.log(`Processing record: ${recordId}`);
```

**Setting Up Input Variables in Airtable UI:**
1. In automation "Run script" action
2. Click "+ Add input variable"
3. Variable name: `recordId`
4. Value: Select from trigger (e.g., `[Trigger] Record ID`)

---

### Output Variables (output.set())

Pass data to subsequent automation steps:

```javascript
// Set output values
output.set("result", "success");
output.set("message", "Branch matched successfully");
output.set("matchedBranchId", branchId);
output.set("matchSource", "service_area");

// Output complex objects (will be JSON serialized)
output.set("recordData", {
  id: record.id,
  name: record.name,
  fields: {...}
});
```

**⚠️ Output Limit:** Maximum 6MB of data

**Using Output in Next Step:**
- Next action can reference: `[Run script] result`
- Conditional logic: `if [Run script] result equals "success"`

---

### Console Logging

```javascript
// Basic logging
console.log("Script started");

// Logging variables
console.log(`Record ID: ${recordId}`);

// Logging objects (will be JSON stringified)
console.log("Record data:", record);

// Logging arrays
console.log("Matched records:", matchedRecords);

// Section separators (useful for debugging)
console.log("=== Starting Main Logic ===");
console.log("--- Validation Complete ---");
console.log("\n⚠️  WARNING: No branches found");
```

**Where Logs Appear:**
- In automation run history
- Click "View details" → "View logs"
- Useful for debugging failures

---

## Async/Await Patterns

### Why Async/Await?

All Airtable API methods that interact with data are asynchronous and return Promises.

**❌ Wrong (missing await):**
```javascript
let records = table.selectRecordsAsync(); // Returns Promise, not records!
console.log(records.records); // ERROR: undefined
```

**✅ Correct (with await):**
```javascript
let records = await table.selectRecordsAsync();
console.log(records.records); // Works!
```

### Common Patterns

#### Sequential Operations

```javascript
// Do one thing, then another
let record = await table.selectRecordAsync(recordId);
let value = record.getCellValue("Field");
await table.updateRecordAsync(recordId, {"Status": "Processed"});
```

#### Parallel Operations (Faster!)

```javascript
// Fetch multiple tables at once
let [pagesRecords, branchRecords, serviceAreaRecords] = await Promise.all([
  pagesTable.selectRecordsAsync(),
  branchLocationsTable.selectRecordsAsync(),
  serviceAreasTable.selectRecordsAsync()
]);
```

#### Error Handling with Async

```javascript
try {
  let record = await table.selectRecordAsync(recordId);
  await table.updateRecordAsync(recordId, updates);
  console.log("✅ Success");
} catch (error) {
  console.error("❌ Error:", error.message);
  output.set("result", "error");
}
```

---

## Error Handling

### Try/Catch Pattern

```javascript
try {
  // Your logic here
  let record = await table.selectRecordAsync(recordId);

  if (!record) {
    throw new Error("Record not found");
  }

  // Process record...

  output.set("result", "success");

} catch (error) {
  console.error("❌ ERROR:", error.message);
  console.error("Stack trace:", error.stack);

  output.set("result", "error");
  output.set("message", error.message);

  // Optional: Update record with error
  await table.updateRecordAsync(recordId, {
    "Notes": `❌ Error: ${error.message}`
  });
}
```

### Common Errors

**1. Field Not Found**
```javascript
// Error: "Unknown field name: 'Typo Field'"
let value = record.getCellValue("Typo Field"); // Field name misspelled
```

**2. Table Not Found**
```javascript
// Error: "Unknown table name: 'Wrong Table'"
let table = base.getTable("Wrong Table"); // Table name wrong
```

**3. Invalid Field Value**
```javascript
// Error: "Invalid cell value for field 'Active'"
await table.updateRecordAsync(recordId, {
  "Active": "yes" // Should be boolean true, not string
});
```

**4. Batch Limit Exceeded**
```javascript
// Error: "Cannot update more than 50 records"
let tooMany = recordsArray.slice(0, 100);
await table.updateRecordsAsync(tooMany); // Exceeds 50 limit
```

---

## Limitations & Constraints

### Record Limits

| Operation | Limit | Workaround |
|-----------|-------|------------|
| Create records | 50 per batch | Use while loop to process in batches |
| Update records | 50 per batch | Use while loop to process in batches |
| Delete records | 50 per batch | Use while loop to process in batches |
| Select records | No hard limit | But large queries can timeout |

**Batch Processing Pattern:**
```javascript
while (records.length > 0) {
  let batch = records.slice(0, 50);
  await table.updateRecordsAsync(batch);
  records = records.slice(50);
}
```

---

### Timeout Limits

| Type | Limit | What Happens |
|------|-------|--------------|
| Script execution | 120 seconds | Script stops, automation fails |
| API call | 12 seconds | API call fails |
| Fetch (external API) | 30 seconds | Fetch fails |

**Optimization Tips:**
- Fetch only needed fields: `{fields: ["Field1", "Field2"]}`
- Process in smaller batches
- Avoid complex calculations in loops
- Use early returns to skip unnecessary work

---

### Output Size Limit

**Maximum:** 6MB of output data

```javascript
// ❌ Bad: Returning huge dataset
output.set("allRecords", allRecordsArray); // Could exceed 6MB

// ✅ Good: Returning summary
output.set("recordCount", allRecordsArray.length);
output.set("firstTenRecords", allRecordsArray.slice(0, 10));
```

---

### Field Type Constraints

**Cannot Update:**
- Computed fields (Formula, Rollup, Lookup, Count)
- Auto-increment fields
- Created time, Created by (system fields)
- Last modified time, Last modified by (system fields)

**Must Match Type:**
```javascript
// ❌ Wrong type
await table.updateRecordAsync(recordId, {
  "Active": "true" // String, should be boolean
});

// ✅ Correct type
await table.updateRecordAsync(recordId, {
  "Active": true // Boolean
});
```

---

## Quick Reference

### Most Common Methods

```javascript
// Tables
let table = base.getTable("Table Name");

// Read records
let allRecords = await table.selectRecordsAsync();
let record = await table.selectRecordAsync(recordId);

// Get cell values
let value = record.getCellValue("Field Name");
let linkedRecord = record.getCellValue("Linked Field");

// Update
await table.updateRecordAsync(recordId, {
  "Field": "Value"
});

await table.updateRecordsAsync([
  {id: "rec1", fields: {"Field": "Value1"}},
  {id: "rec2", fields: {"Field": "Value2"}}
]);

// Create
let newId = await table.createRecordAsync({
  "Field": "Value"
});

// Input/Output
let config = input.config();
output.set("key", "value");

// Logging
console.log("Message");
```

---

## Next Steps

- [Common Patterns & Examples](./02-airtable-scripting-patterns.md)
- [Best Practices](./03-airtable-scripting-best-practices.md)
- [Real-World Examples](./04-airtable-scripting-examples.md)

---

**Reference Links:**
- [Airtable Scripting API](https://airtable.com/developers/scripting/api)
- [Airtable Support: Run Script Action](https://support.airtable.com/docs/run-a-script-action)
- [Our Production Script](../airtable-automation-match-branch.js)
