/**
 * Airtable Automation Script: Smart Branch Matching
 *
 * Purpose: Auto-match branch to page based on Service Areas lookup
 * Trigger: When record updated (Pages table)
 *
 * Logic:
 * 1. Check if Location ID and Client Name are present
 * 2. Look up which branch SHOULD be matched (via Service Areas)
 * 3. Compare with current Matched Branch
 * 4. Only update if they don't match (efficient + self-healing!)
 *
 * Benefits:
 * - Self-healing: Automatically fixes mismatches
 * - Efficient: Only updates when needed
 * - No manual re-trigger needed
 * - Handles all edge cases
 */

// Get input from automation trigger
let config = input.config();
let recordId = config.recordId;

console.log("=== Branch Matching Script Started ===");
console.log(`Record ID: ${recordId}`);

// ============================================
// INPUT VALIDATION: Check recordId exists
// ============================================

if (!recordId) {
  console.error("❌ ERROR: recordId input variable not provided");
  console.error("📋 ACTION REQUIRED:");
  console.error("   1. Edit this automation");
  console.error("   2. Go to 'Run script' action");
  console.error("   3. Click '+ Add input variable'");
  console.error("   4. Variable name: recordId");
  console.error("   5. Value: Select 'Record ID' from trigger");

  output.set("result", "error");
  output.set("message", "Missing recordId input variable - check automation configuration");
  throw new Error("Missing recordId input variable");
}

// Get table references
let pagesTable = base.getTable("Pages");
let serviceAreasTable = base.getTable("Service Areas");
let branchLocationsTable = base.getTable("Branch Locations");

// Get the page record
let pageRecord = await pagesTable.selectRecordAsync(recordId, {
  fields: ["Client Name", "Location ID", "Matched Branch"]
});

if (!pageRecord) {
  console.log("❌ ERROR: Page record not found");
  output.set("result", "error");
  output.set("message", "Page record not found");
  return;
}

// Extract current values
let clientName = pageRecord.getCellValue("Client Name");
let locationId = pageRecord.getCellValue("Location ID");
let currentMatchedBranch = pageRecord.getCellValue("Matched Branch");

console.log("\n--- Current Page State ---");
console.log(`Client: ${clientName ? clientName[0].name : "(empty)"}`);
console.log(`Location: ${locationId ? locationId[0].name : "(empty)"}`);
console.log(`Current Matched Branch: ${currentMatchedBranch ? currentMatchedBranch[0].name : "(empty)"}`);

// ============================================
// VALIDATION: Check required fields
// ============================================

if (!clientName || clientName.length === 0) {
  console.log("\n⏭️  SKIP: Client Name is empty");
  output.set("result", "skipped");
  output.set("message", "Client Name is required");
  return;
}

if (!locationId || locationId.length === 0) {
  console.log("\n⏭️  SKIP: Location ID is empty (use Automation 1b for national pages)");
  output.set("result", "skipped");
  output.set("message", "Location ID is empty");
  return;
}

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

let correctBranchId = null;
let correctBranchName = null;
let matchSource = null;
let warningMessage = null;

if (matchingServiceArea) {
  // Found a Service Area match!
  let branchIdField = matchingServiceArea.getCellValue("Branch ID");
  if (branchIdField && branchIdField.length > 0) {
    correctBranchId = branchIdField[0].id;
    let branchNameField = matchingServiceArea.getCellValue("Branch Name");
    correctBranchName = branchNameField && branchNameField.length > 0 ? branchNameField[0] : null;
    matchSource = "service_area";
    console.log(`✅ Found Service Area match: ${correctBranchName}`);
  }
}

// ============================================
// STEP 2: Fallback - Use client's default branch
// ============================================

if (!correctBranchId) {
  console.log("⚠️  No Service Area found, looking for default branch...");

  let branchesQuery = await branchLocationsTable.selectRecordsAsync({
    fields: ["Client Name", "Branch Name", "Active"]
  });

  // Find first active branch for this client (alphabetically)
  let clientBranches = branchesQuery.records
    .filter(record => {
      let branchClient = record.getCellValue("Client Name");
      let isActive = record.getCellValue("Active");

      return branchClient &&
             branchClient.length > 0 &&
             branchClient[0].id === clientName[0].id &&
             isActive === true;
    })
    .sort((a, b) => {
      let nameA = a.getCellValue("Branch Name") || "";
      let nameB = b.getCellValue("Branch Name") || "";
      return nameA.localeCompare(nameB);
    });

  if (clientBranches.length > 0) {
    correctBranchId = clientBranches[0].id;
    correctBranchName = clientBranches[0].getCellValue("Branch Name");
    matchSource = "default_branch";
    warningMessage = `⚠️ No service area found for ${locationId[0].name}, using default branch: ${correctBranchName}`;
    console.log(`⚠️  Using default branch: ${correctBranchName}`);
  } else {
    // No branches exist at all!
    console.log("❌ ERROR: No active branches exist for this client!");

    // Update notes field with error
    await pagesTable.updateRecordAsync(recordId, {
      "Notes": "❌ ERROR: No active branches exist for this client! Create a branch in Branch Locations table first."
    });

    output.set("result", "error");
    output.set("message", "No branches exist for client");
    return;
  }
}

// ============================================
// STEP 3: Compare current vs correct branch
// ============================================

console.log("\n--- Comparison ---");
console.log(`Current Branch ID: ${currentMatchedBranch ? currentMatchedBranch[0].id : "(none)"}`);
console.log(`Correct Branch ID: ${correctBranchId}`);

let needsUpdate = false;

if (!currentMatchedBranch || currentMatchedBranch.length === 0) {
  console.log("✅ UPDATE NEEDED: Matched Branch is empty");
  needsUpdate = true;
} else if (currentMatchedBranch[0].id !== correctBranchId) {
  console.log("✅ UPDATE NEEDED: Matched Branch is incorrect");
  needsUpdate = true;
} else {
  console.log("⏭️  NO UPDATE NEEDED: Matched Branch is already correct");
  needsUpdate = false;
}

// ============================================
// STEP 4: Update if needed
// ============================================

if (needsUpdate) {
  console.log("\n--- Updating Page ---");

  let updates = {
    "Matched Branch": [{id: correctBranchId}]
  };

  // Add warning note if using default branch
  if (warningMessage) {
    updates["Notes"] = warningMessage;
  }

  await pagesTable.updateRecordAsync(recordId, updates);

  console.log(`✅ UPDATED: Matched Branch set to ${correctBranchName}`);
  if (warningMessage) {
    console.log(`   Added warning to Notes field`);
  }

  output.set("result", "updated");
  output.set("message", `Matched Branch set to ${correctBranchName}`);
  output.set("matchSource", matchSource);
} else {
  console.log("\n⏭️  SKIPPED: No update needed");
  output.set("result", "no_change");
  output.set("message", "Matched Branch already correct");
}

console.log("\n=== Branch Matching Script Complete ===");
