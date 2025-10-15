# Airtable Scripting: Best Practices

**Purpose:** Guidelines for writing maintainable, efficient, and reliable Airtable automation scripts
**Last Updated:** 2025-10-11

---

## Table of Contents

1. [Script Organization](#script-organization)
2. [Performance Optimization](#performance-optimization)
3. [Error Handling](#error-handling)
4. [Code Quality](#code-quality)
5. [Testing & Debugging](#testing--debugging)
6. [Security & Data Safety](#security--data-safety)

---

## Script Organization

### ✅ Use Clear Script Structure

**Good:**
```javascript
/**
 * Airtable Automation Script: Smart Branch Matching
 *
 * Purpose: Auto-match branch to page based on Service Areas lookup
 * Trigger: When record updated (Pages table)
 *
 * Logic:
 * 1. Validate input
 * 2. Look up correct branch
 * 3. Compare with current
 * 4. Update if needed
 */

// === CONFIGURATION ===
const BATCH_SIZE = 50;
const MAX_RETRIES = 3;

// === INPUT ===
let config = input.config();
let recordId = config.recordId;

// === TABLE REFERENCES ===
let pagesTable = base.getTable("Pages");
let branchesTable = base.getTable("Branch Locations");

// === MAIN LOGIC ===
try {
  // 1. Validation
  // 2. Lookup
  // 3. Compare
  // 4. Update
} catch (error) {
  // Error handling
}
```

---

### ✅ Separate Concerns

**Good: Modular Functions**
```javascript
// Validation function
function validateInput(config) {
  if (!config.recordId) {
    throw new Error("recordId is required");
  }
  return true;
}

// Lookup function
async function findCorrectBranch(locationId, clientId) {
  // Lookup logic
  return branchId;
}

// Comparison function
function needsUpdate(current, correct) {
  if (!current) return true;
  if (current[0].id !== correct) return true;
  return false;
}

// Main execution
try {
  validateInput(config);
  let correctBranch = await findCorrectBranch(locationId, clientId);
  if (needsUpdate(currentBranch, correctBranch)) {
    await updateRecord(recordId, correctBranch);
  }
} catch (error) {
  handleError(error);
}
```

**Bad: Everything in one block**
```javascript
// ❌ Monolithic code - hard to test/debug
let config = input.config();
let table = base.getTable("Pages");
let record = await table.selectRecordAsync(config.recordId);
if (record) {
  let location = record.getCellValue("Location ID");
  if (location) {
    let branches = await base.getTable("Branches").selectRecordsAsync();
    // ... 100 more lines of nested logic
  }
}
```

---

### ✅ Use Descriptive Variable Names

**Good:**
```javascript
let matchingServiceArea = serviceAreasQuery.records.find(record => {
  let serviceAreaLocation = record.getCellValue("Location ID");
  let isActiveServiceArea = record.getCellValue("Active");

  return serviceAreaLocation &&
         serviceAreaLocation[0].id === targetLocationId &&
         isActiveServiceArea === true;
});
```

**Bad:**
```javascript
let x = q.records.find(r => {
  let l = r.getCellValue("Location ID");
  let a = r.getCellValue("Active");
  return l && l[0].id === tid && a === true;
});
```

---

## Performance Optimization

### ✅ Fetch Only Needed Fields

**Good:**
```javascript
// Only fetch fields you'll use
let records = await table.selectRecordsAsync({
  fields: ["Name", "Email", "Active"]
});
```

**Bad:**
```javascript
// Fetching all fields (slower, more data transfer)
let records = await table.selectRecordsAsync();
```

---

### ✅ Use Parallel Fetching

**Good: Parallel (Faster)**
```javascript
// Fetch all tables at once
let [pagesRecords, branchRecords, serviceAreaRecords] = await Promise.all([
  pagesTable.selectRecordsAsync({fields: ["Client Name", "Location ID"]}),
  branchTable.selectRecordsAsync({fields: ["Branch Name", "Active"]}),
  serviceAreaTable.selectRecordsAsync({fields: ["Location ID", "Branch ID"]})
]);

// All fetches happen simultaneously (~3-5 seconds total)
```

**Bad: Sequential (Slower)**
```javascript
// Fetch one at a time
let pagesRecords = await pagesTable.selectRecordsAsync(); // 3-5 seconds
let branchRecords = await branchTable.selectRecordsAsync(); // 3-5 seconds
let serviceAreaRecords = await serviceAreaTable.selectRecordsAsync(); // 3-5 seconds

// Total: 9-15 seconds (3x slower!)
```

---

### ✅ Early Returns to Avoid Unnecessary Work

**Good:**
```javascript
// Exit early if conditions not met
if (!clientName || clientName.length === 0) {
  console.log("⏭️  SKIP: Client Name is empty");
  output.set("result", "skipped");
  return; // Don't do any more work
}

if (!locationId || locationId.length === 0) {
  console.log("⏭️  SKIP: Location ID is empty");
  output.set("result", "skipped");
  return; // Exit immediately
}

// Only execute this if validations passed
let correctBranch = await findCorrectBranch();
```

**Bad:**
```javascript
// Nested conditions waste processing
if (clientName && clientName.length > 0) {
  if (locationId && locationId.length > 0) {
    let correctBranch = await findCorrectBranch();
    // Deeply nested logic
  }
}
```

---

### ✅ Avoid Nested Loops

**Good: Filter first, then process**
```javascript
// Filter to relevant records
let activeClients = allRecords.records.filter(r => {
  let active = r.getCellValue("Active");
  return active === true;
});

// Process filtered list (smaller dataset)
for (let client of activeClients) {
  await processClient(client);
}
```

**Bad: Nested loops**
```javascript
// O(n²) - very slow!
for (let client of clients.records) {
  for (let branch of branches.records) {
    if (client.id === branch.getCellValue("Client")[0].id) {
      // Process
    }
  }
}
```

---

## Error Handling

### ✅ Always Use Try/Catch

**Good:**
```javascript
try {
  let record = await table.selectRecordAsync(recordId);

  if (!record) {
    throw new Error(`Record not found: ${recordId}`);
  }

  await processRecord(record);

  output.set("result", "success");

} catch (error) {
  console.error(`❌ ERROR: ${error.message}`);
  console.error(error.stack);

  output.set("result", "error");
  output.set("message", error.message);
}
```

---

### ✅ Provide Actionable Error Messages

**Good:**
```javascript
if (!record) {
  console.error("❌ ERROR: Record not found");
  console.error(`📋 Record ID: ${recordId}`);
  console.error(`📋 Table: Pages`);
  console.error(`📋 Possible causes:`);
  console.error(`   - Record was deleted`);
  console.error(`   - Wrong table selected in automation`);
  console.error(`   - Automation passed incorrect ID`);

  output.set("result", "error");
  output.set("message", "Record not found");
  output.set("recordId", recordId);
  return;
}
```

**Bad:**
```javascript
if (!record) {
  console.log("not found");
  return;
}
```

---

### ✅ Handle Partial Failures in Batch Operations

**Good:**
```javascript
let updates = [...]; // 100 records
let failed = [];

while (updates.length > 0) {
  let batch = updates.slice(0, 50);

  try {
    await table.updateRecordsAsync(batch);
    console.log(`✅ Batch of ${batch.length} succeeded`);
  } catch (error) {
    console.error(`❌ Batch failed: ${error.message}`);
    // Track failed records
    failed.push(...batch.map(r => r.id));
  }

  updates = updates.slice(50);
}

// Report results
output.set("totalProcessed", allUpdates.length);
output.set("failedCount", failed.length);
output.set("failedRecordIds", failed);
```

---

## Code Quality

### ✅ Use Consistent Naming Conventions

**Good:**
```javascript
// Tables: camelCase with "Table" suffix
let pagesTable = base.getTable("Pages");
let branchLocationsTable = base.getTable("Branch Locations");

// Records: descriptive names
let pageRecord = await pagesTable.selectRecordAsync(recordId);
let matchingServiceArea = serviceAreas.records.find(...);

// IDs: always include "Id" suffix
let recordId = config.recordId;
let branchId = branch.id;
let correctBranchId = matchingServiceArea.getCellValue("Branch ID")[0].id;

// Booleans: use "is", "has", "should" prefix
let needsUpdate = false;
let isActive = record.getCellValue("Active");
let hasWarning = warningMessage !== null;
```

---

### ✅ Add Helpful Comments

**Good:**
```javascript
// ============================================
// STEP 1: Find the CORRECT branch via Service Areas
// ============================================

console.log("\n--- Looking up correct branch ---");

let serviceAreasQuery = await serviceAreasTable.selectRecordsAsync({
  fields: ["Branch ID", "Location ID", "Active", "Branch Name"]
});

// Find Service Area that matches this location and is active
let matchingServiceArea = serviceAreasQuery.records.find(record => {
  let saLocationId = record.getCellValue("Location ID");
  let saActive = record.getCellValue("Active");

  return saLocationId &&
         saLocationId.length > 0 &&
         saLocationId[0].id === locationId[0].id &&
         saActive === true;
});
```

**Bad:**
```javascript
// get service areas
let q = await t.selectRecordsAsync();
let m = q.records.find(r => {
  let l = r.getCellValue("Location ID");
  return l && l[0].id === lid;
});
```

---

### ✅ Use Console Logging Strategically

**Good: Structured Logging**
```javascript
console.log("=== Branch Matching Script Started ===");
console.log(`Record ID: ${recordId}`);

console.log("\n--- Current Page State ---");
console.log(`Client: ${clientName ? clientName[0].name : "(empty)"}`);
console.log(`Location: ${locationId ? locationId[0].name : "(empty)"}`);
console.log(`Current Matched Branch: ${currentBranch ? currentBranch[0].name : "(empty)"}`);

console.log("\n--- Looking up correct branch ---");
// Lookup logic

console.log("\n--- Comparison ---");
console.log(`Current Branch ID: ${currentBranch ? currentBranch[0].id : "(none)"}`);
console.log(`Correct Branch ID: ${correctBranchId}`);

if (needsUpdate) {
  console.log("\n--- Updating Page ---");
  console.log(`✅ UPDATED: Matched Branch set to ${correctBranchName}`);
} else {
  console.log("\n⏭️  SKIPPED: No update needed");
}

console.log("\n=== Branch Matching Script Complete ===");
```

**Result:** Easy to read automation logs with clear sections

---

## Testing & Debugging

### ✅ Test with Edge Cases

**Test Scenarios:**
1. **Happy path:** Normal record with all fields
2. **Empty fields:** Missing required fields
3. **Wrong data:** Invalid linked records
4. **No matches:** No Service Area found
5. **Multiple matches:** Multiple branches serve location
6. **Already correct:** Matched Branch already set correctly

**Example Test Data Setup:**
```javascript
// Test Case 1: Happy Path
// - Page with Client + Location
// - Service Area exists
// - Expected: Matched Branch set

// Test Case 2: Empty Location
// - Page with Client, NO Location
// - Expected: Skip with message

// Test Case 3: No Branches
// - Page with Client + Location
// - NO Branch Locations exist for client
// - Expected: Error note added
```

---

### ✅ Use Detailed Logging for Debugging

**Good:**
```javascript
console.log("=== DEBUGGING: Service Area Lookup ===");
console.log(`Target Location ID: ${locationId[0].id}`);
console.log(`Total Service Areas: ${serviceAreasQuery.records.length}`);

serviceAreasQuery.records.forEach((record, index) => {
  let saLocation = record.getCellValue("Location ID");
  let saActive = record.getCellValue("Active");

  console.log(`\nService Area ${index + 1}:`);
  console.log(`  Location ID: ${saLocation ? saLocation[0].id : "(empty)"}`);
  console.log(`  Active: ${saActive}`);
  console.log(`  Matches: ${saLocation && saLocation[0].id === locationId[0].id}`);
});
```

**Helps Debug:**
- Why no matches found
- Which Service Area should match
- Field value mismatches

---

### ✅ Validate Assumptions

**Good:**
```javascript
// Validate table exists
let pagesTable = base.getTable("Pages");
if (!pagesTable) {
  throw new Error("Pages table not found in base");
}

// Validate field exists (will throw error if not)
try {
  let value = record.getCellValue("Client Name");
} catch (error) {
  console.error(`❌ Field "Client Name" not found in Pages table`);
  throw error;
}

// Validate record type
if (!Array.isArray(locationId)) {
  console.error(`❌ Location ID is not an array: ${typeof locationId}`);
  throw new Error("Location ID field type mismatch");
}
```

---

## Security & Data Safety

### ✅ Never Delete Data Without Confirmation

**Good:**
```javascript
// Only delete if explicitly requested
if (config.confirmDelete === true) {
  await table.deleteRecordAsync(recordId);
  console.log(`🗑️  Deleted record: ${recordId}`);
} else {
  console.log(`⚠️  Delete skipped: confirmation required`);
}
```

---

### ✅ Validate Before Bulk Updates

**Good:**
```javascript
// Dry run mode
let dryRun = config.dryRun || false;

let updates = [...]; // Build updates array

if (dryRun) {
  console.log(`📋 DRY RUN: Would update ${updates.length} records`);
  output.set("dryRunResults", updates);
  return;
}

// Actually update
await table.updateRecordsAsync(updates);
console.log(`✅ Updated ${updates.length} records`);
```

---

### ✅ Avoid Overwriting User Data

**Good: Append to fields, don't replace**
```javascript
// Get existing notes
let existingNotes = record.getCellValue("Notes") || "";

// Append new note (don't replace)
let newNote = "⚠️ Warning: No service area found";
let updatedNotes = existingNotes
  ? `${existingNotes}\n${newNote}`
  : newNote;

await table.updateRecordAsync(recordId, {
  "Notes": updatedNotes
});
```

**Bad:**
```javascript
// Overwrites existing notes!
await table.updateRecordAsync(recordId, {
  "Notes": "⚠️ Warning: No service area found"
});
```

---

### ✅ Use Read-Only Mode for Analysis

**Good:**
```javascript
// Analysis script - NO writes
console.log("=== Analysis Mode (Read-Only) ===");

let records = await table.selectRecordsAsync();

let stats = {
  total: records.records.length,
  withBranch: 0,
  withoutBranch: 0,
  needsUpdate: 0
};

for (let record of records.records) {
  let branch = record.getCellValue("Matched Branch");
  if (branch) {
    stats.withBranch++;
  } else {
    stats.withoutBranch++;
  }
}

console.log(`\nStatistics:`);
console.log(`  Total Records: ${stats.total}`);
console.log(`  With Branch: ${stats.withBranch}`);
console.log(`  Without Branch: ${stats.withoutBranch}`);

output.set("stats", stats);
// No updates performed - safe!
```

---

## Quick Reference Checklist

### Before Writing Script
- [ ] Understand the trigger condition
- [ ] Know which fields you need to read/write
- [ ] Plan for edge cases
- [ ] Consider performance (fetch only needed fields)

### While Writing Script
- [ ] Use clear variable names
- [ ] Add section comments
- [ ] Implement error handling
- [ ] Use early returns for validation
- [ ] Log important decisions

### Before Deploying
- [ ] Test with normal data
- [ ] Test with edge cases (empty fields, no matches)
- [ ] Test with large datasets (batch limits)
- [ ] Review console logs for clarity
- [ ] Verify timeout won't occur

### After Deployment
- [ ] Monitor automation run history
- [ ] Check for errors in logs
- [ ] Verify expected behavior
- [ ] Document any issues found

---

## Next Steps

- [Fundamentals](./01-airtable-scripting-fundamentals.md)
- [Common Patterns](./02-airtable-scripting-patterns.md)
- [Real-World Examples](./04-airtable-scripting-examples.md)

---

**See Also:**
- [Production Script: Branch Matching](../airtable-automation-match-branch.js) - Real example following these practices
