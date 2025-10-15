# Airtable Scripting: Common Patterns & Examples

**Purpose:** Reusable code patterns for common Airtable automation tasks
**Last Updated:** 2025-10-11

---

## Table of Contents

1. [Record Lookup Patterns](#record-lookup-patterns)
2. [Update Patterns](#update-patterns)
3. [Batch Processing](#batch-processing)
4. [Validation Patterns](#validation-patterns)
5. [Comparison & Matching](#comparison--matching)
6. [Error Handling Patterns](#error-handling-patterns)

---

## Record Lookup Patterns

### Pattern 1: Find Record by Field Value

```javascript
/**
 * Find a record where a specific field equals a value
 */
let serviceAreasTable = base.getTable("Service Areas");

let allRecords = await serviceAreasTable.selectRecordsAsync({
  fields: ["Branch ID", "Location ID", "Active"]
});

// Find first matching record
let matchingRecord = allRecords.records.find(record => {
  let locationValue = record.getCellValue("Location ID");
  let isActive = record.getCellValue("Active");

  return locationValue &&
         locationValue.length > 0 &&
         locationValue[0].id === targetLocationId &&
         isActive === true;
});

if (matchingRecord) {
  console.log(`✅ Found: ${matchingRecord.id}`);
} else {
  console.log(`⏭️  No match found`);
}
```

---

### Pattern 2: Find All Matching Records

```javascript
/**
 * Find ALL records matching criteria (not just first)
 */
let allRecords = await table.selectRecordsAsync({
  fields: ["Client Name", "Active"]
});

// Filter to get all matches
let matchingRecords = allRecords.records.filter(record => {
  let client = record.getCellValue("Client Name");
  let isActive = record.getCellValue("Active");

  return client &&
         client.length > 0 &&
         client[0].id === targetClientId &&
         isActive === true;
});

console.log(`Found ${matchingRecords.length} matching records`);
```

---

### Pattern 3: Lookup with Linked Records

```javascript
/**
 * Find record by comparing linked record IDs
 */
let matchingRecord = allRecords.records.find(record => {
  let linkedField = record.getCellValue("Linked Field");

  // Check if linked field exists and has values
  if (!linkedField || linkedField.length === 0) {
    return false;
  }

  // Compare linked record ID
  return linkedField[0].id === targetRecordId;
});
```

---

### Pattern 4: Sort and Pick First

```javascript
/**
 * Find multiple matches, sort, and pick the best one
 */
let candidates = allRecords.records
  .filter(record => {
    // Filter criteria
    let client = record.getCellValue("Client Name");
    return client && client[0].id === targetClientId;
  })
  .sort((a, b) => {
    // Sort alphabetically by Branch Name
    let nameA = a.getCellValue("Branch Name") || "";
    let nameB = b.getCellValue("Branch Name") || "";
    return nameA.localeCompare(nameB);
  });

// Take first result (alphabetically first)
let bestMatch = candidates.length > 0 ? candidates[0] : null;
```

---

## Update Patterns

### Pattern 5: Conditional Update (Only If Changed)

```javascript
/**
 * Compare current value vs new value, only update if different
 * (Prevents unnecessary updates and infinite loops)
 */
let currentValue = record.getCellValue("Matched Branch");
let newValue = [{id: correctBranchId}];

let needsUpdate = false;

if (!currentValue || currentValue.length === 0) {
  needsUpdate = true; // Field is empty
} else if (currentValue[0].id !== correctBranchId) {
  needsUpdate = true; // Field has wrong value
} else {
  needsUpdate = false; // Field already correct
}

if (needsUpdate) {
  await table.updateRecordAsync(recordId, {
    "Matched Branch": newValue
  });
  console.log("✅ Updated");
} else {
  console.log("⏭️  Skipped (already correct)");
}
```

---

### Pattern 6: Multi-Field Update

```javascript
/**
 * Update multiple fields in single operation
 */
let updates = {
  "Status": "Processed",
  "Matched Branch": [{id: branchId}],
  "Last Updated": new Date().toISOString(),
  "Active": true
};

// Optional: Add conditional fields
if (hasWarning) {
  updates["Notes"] = "⚠️ Warning message here";
}

await table.updateRecordAsync(recordId, updates);
```

---

### Pattern 7: Clear Field Values

```javascript
/**
 * Clear different field types
 */
await table.updateRecordAsync(recordId, {
  "Text Field": "",              // Empty string
  "Linked Record": [],           // Empty array
  "Checkbox": false,             // Boolean false
  "Number": 0,                   // Zero (or null if optional)
  "Multiple Select": []          // Empty array
});
```

---

## Batch Processing

### Pattern 8: Process in Batches of 50

```javascript
/**
 * Update many records in batches (50 record limit)
 */
let recordsToUpdate = [
  {id: "rec1", fields: {"Status": "Done"}},
  {id: "rec2", fields: {"Status": "Done"}},
  // ... 100+ records
];

console.log(`Processing ${recordsToUpdate.length} records in batches...`);

let processed = 0;

while (recordsToUpdate.length > 0) {
  // Take first 50 records
  let batch = recordsToUpdate.slice(0, 50);

  // Update batch
  await table.updateRecordsAsync(batch);

  // Remove processed records
  recordsToUpdate = recordsToUpdate.slice(50);

  processed += batch.length;
  console.log(`Processed ${processed} records...`);
}

console.log(`✅ All ${processed} records updated`);
```

---

### Pattern 9: Batch with Error Recovery

```javascript
/**
 * Batch processing with per-batch error handling
 */
let allUpdates = [...]; // Array of 100+ updates
let failedBatches = [];

while (allUpdates.length > 0) {
  let batch = allUpdates.slice(0, 50);

  try {
    await table.updateRecordsAsync(batch);
    console.log(`✅ Batch of ${batch.length} succeeded`);
  } catch (error) {
    console.error(`❌ Batch failed: ${error.message}`);
    failedBatches.push(batch);
  }

  allUpdates = allUpdates.slice(50);
}

// Report failures
if (failedBatches.length > 0) {
  console.log(`⚠️  ${failedBatches.length} batches failed`);
  output.set("failedBatches", failedBatches.flat().map(r => r.id));
}
```

---

## Validation Patterns

### Pattern 10: Required Field Validation

```javascript
/**
 * Validate that required fields are present
 */
let clientName = record.getCellValue("Client Name");
let locationId = record.getCellValue("Location ID");

// Early return pattern for validation
if (!clientName || clientName.length === 0) {
  console.log("⏭️  SKIP: Client Name is empty");
  output.set("result", "skipped");
  output.set("message", "Client Name is required");
  return;
}

if (!locationId || locationId.length === 0) {
  console.log("⏭️  SKIP: Location ID is empty");
  output.set("result", "skipped");
  output.set("message", "Location ID is required");
  return;
}

// Validation passed, continue with logic...
```

---

### Pattern 11: Type Validation

```javascript
/**
 * Validate field types before using
 */
function validateLinkedRecord(value, fieldName) {
  if (!value) {
    console.log(`⚠️  ${fieldName} is null/undefined`);
    return false;
  }

  if (!Array.isArray(value)) {
    console.log(`⚠️  ${fieldName} is not an array`);
    return false;
  }

  if (value.length === 0) {
    console.log(`⚠️  ${fieldName} is empty array`);
    return false;
  }

  if (!value[0].id) {
    console.log(`⚠️  ${fieldName} missing ID`);
    return false;
  }

  return true;
}

// Usage
let locationId = record.getCellValue("Location ID");
if (!validateLinkedRecord(locationId, "Location ID")) {
  return; // Exit early
}

// Safe to use
let locationRecordId = locationId[0].id;
```

---

## Comparison & Matching

### Pattern 12: Compare Linked Record IDs

```javascript
/**
 * Compare two linked records by ID (not name)
 */
let currentBranch = record.getCellValue("Matched Branch");
let correctBranchId = "recXYZ123";

function isSameBranch(currentBranch, correctBranchId) {
  if (!currentBranch || currentBranch.length === 0) {
    return false; // No current branch
  }

  return currentBranch[0].id === correctBranchId;
}

if (isSameBranch(currentBranch, correctBranchId)) {
  console.log("✅ Branch already correct");
} else {
  console.log("❌ Branch mismatch, updating...");
}
```

---

### Pattern 13: Find Best Match (Multiple Criteria)

```javascript
/**
 * Find best match based on multiple criteria with priority
 */
let allBranches = await branchesTable.selectRecordsAsync();

// Priority 1: Exact location match
let exactMatch = allBranches.records.find(record => {
  let location = record.getCellValue("Location ID");
  return location && location[0].id === targetLocationId;
});

if (exactMatch) {
  return exactMatch;
}

// Priority 2: Same county
let countyMatch = allBranches.records.find(record => {
  let county = record.getCellValue("County");
  return county === targetCounty;
});

if (countyMatch) {
  return countyMatch;
}

// Priority 3: Client's default (alphabetically first)
let defaultBranch = allBranches.records
  .filter(record => {
    let client = record.getCellValue("Client Name");
    return client && client[0].id === targetClientId;
  })
  .sort((a, b) => {
    let nameA = a.getCellValue("Branch Name") || "";
    let nameB = b.getCellValue("Branch Name") || "";
    return nameA.localeCompare(nameB);
  })[0];

return defaultBranch || null;
```

---

## Error Handling Patterns

### Pattern 14: Graceful Degradation

```javascript
/**
 * Try primary method, fall back to secondary, log issues
 */
let branchId = null;
let matchSource = null;
let warningMessage = null;

try {
  // Primary: Service Area lookup
  let serviceArea = await findServiceArea(locationId);

  if (serviceArea) {
    branchId = serviceArea.getCellValue("Branch ID")[0].id;
    matchSource = "service_area";
  } else {
    // Fallback: Client's default branch
    console.log("⚠️  No Service Area, using default branch");

    let defaultBranch = await findDefaultBranch(clientId);

    if (defaultBranch) {
      branchId = defaultBranch.id;
      matchSource = "default_branch";
      warningMessage = `⚠️ No service area found, using default: ${defaultBranch.name}`;
    } else {
      // No branches at all
      throw new Error("No branches exist for this client");
    }
  }

} catch (error) {
  console.error(`❌ Error: ${error.message}`);

  // Update record with error note
  await table.updateRecordAsync(recordId, {
    "Notes": `❌ ERROR: ${error.message}`
  });

  output.set("result", "error");
  output.set("message", error.message);
  return;
}
```

---

### Pattern 15: Detailed Error Logging

```javascript
/**
 * Log errors with context for debugging
 */
try {
  let record = await table.selectRecordAsync(recordId);

  // Log current state
  console.log("=== Current Record State ===");
  console.log(`Record ID: ${recordId}`);
  console.log(`Client: ${record.getCellValue("Client Name")}`);
  console.log(`Location: ${record.getCellValue("Location ID")}`);

  // Attempt update
  await table.updateRecordAsync(recordId, updates);

  console.log("✅ Update successful");

} catch (error) {
  console.error("=== ERROR DETAILS ===");
  console.error(`Error Type: ${error.name}`);
  console.error(`Error Message: ${error.message}`);
  console.error(`Record ID: ${recordId}`);
  console.error(`Stack Trace:`);
  console.error(error.stack);

  // Set error output
  output.set("result", "error");
  output.set("errorType", error.name);
  output.set("errorMessage", error.message);
  output.set("failedRecordId", recordId);
}
```

---

### Pattern 16: Input Validation with Helpful Messages

```javascript
/**
 * Validate input and provide actionable error messages
 */
let config = input.config();

// Validate recordId exists
if (!config.recordId) {
  console.error("❌ ERROR: recordId input variable not provided");
  console.error("📋 Action: Add recordId input variable in automation");
  output.set("result", "error");
  output.set("message", "Missing recordId input variable");
  return;
}

// Validate recordId format
if (!config.recordId.startsWith("rec")) {
  console.error(`❌ ERROR: Invalid record ID format: ${config.recordId}`);
  console.error("📋 Expected format: rec... (starts with 'rec')");
  output.set("result", "error");
  output.set("message", "Invalid record ID format");
  return;
}

// Validate record exists
let record = await table.selectRecordAsync(config.recordId);

if (!record) {
  console.error(`❌ ERROR: Record not found: ${config.recordId}`);
  console.error("📋 Possible causes:");
  console.error("   - Record was deleted");
  console.error("   - Record ID is from different table");
  console.error("   - Automation trigger passed wrong ID");
  output.set("result", "error");
  output.set("message", "Record not found");
  return;
}

console.log("✅ Validation passed");
```

---

## Quick Reference

### Most Useful Patterns

1. **Find Record:** Pattern 1 (find by field value)
2. **Conditional Update:** Pattern 5 (only if changed)
3. **Batch Processing:** Pattern 8 (50 record limit)
4. **Validation:** Pattern 10 (required fields)
5. **Error Handling:** Pattern 14 (graceful degradation)

---

## Next Steps

- [Best Practices](./03-airtable-scripting-best-practices.md)
- [Real-World Examples](./04-airtable-scripting-examples.md)
- [Our Production Scripts](../)

---

**See Also:**
- [Fundamentals](./01-airtable-scripting-fundamentals.md)
- [Production Script: Branch Matching](../airtable-automation-match-branch.js)
