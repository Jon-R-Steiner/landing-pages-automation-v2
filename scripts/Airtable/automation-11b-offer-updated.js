/**
 * Airtable Automation 11b: Create Offer-Specific Pages When Offer Updated
 *
 * PURPOSE: Automatically create NEW Pages records when an Offer's targeting is updated
 *
 * TRIGGER: When record updated in Offers table
 *           (Specifically when Target Services, Target Locations, or Target Branches fields change)
 *
 * BEHAVIOR:
 * - Gets all existing Services and filters by offer's Target Services
 * - Gets all existing Locations and filters by offer's Target Locations
 * - Validates keywords (minimum 3 characters, must contain letters)
 * - Checks for duplicates before queueing (Service + Location + Keyword + Offer)
 * - Builds array of pages to create (1 per matching Service × matching Location × Keyword)
 * - Creates pages in batches of 50 using createRecordsAsync (fast!)
 * - Sets Published = false, Status = Draft (via Airtable default)
 *
 * TARGETING LOGIC:
 * - Target Services:
 *   - If empty: applies to ALL services
 *   - If has values: applies ONLY to those specific services
 * - Target Locations:
 *   - If empty: applies to ALL locations
 *   - If has values: applies ONLY to those specific locations
 * - Target Branches (filters locations indirectly via Service Areas):
 *   - If empty: no additional filtering (uses Target Locations result)
 *   - If has values: ONLY creates pages for locations served by those branches
 *   - Example: Offer targets "Medina Office" → only creates pages for
 *     Strongsville, Brunswick, Medina (locations that Medina Office serves)
 *
 * EXAMPLE 1 (Targeted Offer):
 * - New Offer: "Bathroom Spring Sale"
 * - Target Services: [Bathroom Remodeling]
 * - Target Locations: [ALL]
 * - Existing data: Bathroom has 6 keywords, 10 Locations total
 * - CREATES: 60 new Pages (6 keywords × 10 locations × 1 offer)
 * - SKIPS: Kitchen and other services
 *
 * EXAMPLE 2 (Location-Specific Offer):
 * - New Offer: "Austin Launch"
 * - Target Services: [ALL]
 * - Target Locations: [Austin]
 * - Target Branches: [ALL]
 * - Existing data: 3 Services with 20 keywords total, 1 matching location
 * - CREATES: 20 new Pages (20 keywords × 1 location × 1 offer)
 * - SKIPS: Other locations
 *
 * EXAMPLE 3 (Branch-Specific Offer):
 * - New Offer: "Medina Office Grand Opening"
 * - Target Services: [ALL]
 * - Target Locations: [ALL]
 * - Target Branches: [Medina Office]
 * - Service Areas: Medina Office serves [Strongsville, Brunswick, Medina]
 * - Existing data: 3 Services with 20 keywords total, 10 locations total
 * - CREATES: 60 new Pages (20 keywords × 3 locations served by Medina Office × 1 offer)
 * - SKIPS: Other 7 locations not served by Medina Office
 *
 * ⚠️ WARNING: This can create MANY pages (100+) depending on your data!
 * - Test with small data set first
 * - Consider disabling this automation if not needed
 * - Alternative: Manually link offers to existing pages instead
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Airtable > Automations
 * 2. Create new automation: "Create Offer Pages When Offer Updated"
 * 3. Trigger: "When record updated"
 *    - Table: Offers
 *    - Watch specific fields (recommended):
 *      - Target Services
 *      - Target Locations
 *      - Target Branches
 * 4. Action: "Run script"
 *    - Copy/paste this entire script
 *    - Input Variables:
 *      - Name: recordId
 *      - Value: Select "Record ID" from trigger dropdown
 * 5. Test by updating offer targeting on a test offer
 * 6. Activate automation when ready
 *
 * WHY THIS AUTOMATION:
 * When you update an offer's targeting (e.g., add more services or locations),
 * this automation creates the missing pages. Duplicate detection ensures existing
 * pages aren't recreated. This makes targeting updates "additive" - you only add
 * new pages without affecting existing ones.
 *
 * PERFORMANCE:
 * - Uses batch creation (createRecordsAsync) for 10-50x faster performance
 * - Creates up to 50 records per batch
 * - Can handle 750+ pages in 30 seconds
 * - Timeout is extremely unlikely with batch operations
 * - If timeout occurs, simply re-run with "Test" button (duplicate detection prevents duplicates)
 */

// Get the record ID that triggered this automation
let config = input.config();
let recordId = config.recordId;

// Fetch the offer record using the ID
let offersTable = base.getTable("Offers");
let offerQuery = await offersTable.selectRecordsAsync();
let offerRecord = offerQuery.records.find(r => r.id === recordId);

// Validate record exists
if (!offerRecord) {
    console.error(`❌ ERROR: Could not find offer record with ID ${recordId}`);
    output.set("result", "error");
    output.set("message", "Could not find offer record. The record may have been deleted.");
    throw new Error("Offer record not found");
}

console.log(`=== Automation 11b: Processing Offer UPDATE "${offerRecord.name}" ===`);

// Check if offer is active
let offerStatus = offerRecord.getCellValue("Status");
if (offerStatus !== "Active") {
    console.log(`\n⚠️  Offer "${offerRecord.name}" has Status="${offerStatus}" (not Active) - skipping page creation`);
    output.set("result", "skipped");
    output.set("message", "Offer status is not Active - pages not created");
    output.set("offer", offerRecord.name);
    output.set("offerStatus", offerStatus);
    return;
}

// Get all services with their keywords
let servicesTable = base.getTable("Services");
let servicesQuery = await servicesTable.selectRecordsAsync({
    fields: ["Service Name", "Primary Keywords", "Client", "Active"]
});

// Filter services by offer targeting AND active status
let targetServices = offerRecord.getCellValue("Target Services") || [];
let matchingServices = servicesQuery.records.filter(service => {
    // Must be active
    if (!service.getCellValue("Active")) return false;

    // If Target Services is empty, offer applies to ALL services
    if (targetServices.length === 0) return true;
    // Otherwise, check if this service is in the target list
    return targetServices.some(s => s.id === service.id);
});

let activeServicesCount = servicesQuery.records.filter(s => s.getCellValue("Active")).length;
console.log(`📦 Found ${servicesQuery.records.length} total services, ${activeServicesCount} active`);
console.log(`🎯 ${matchingServices.length} active services match this offer's targeting`);

if (matchingServices.length === 0) {
    console.log(`\n⚠️  WARNING: No services match this offer's targeting!`);
    console.log(`   Target Services: ${targetServices.length === 0 ? "ALL" : targetServices.map(s => s.name || s.id).join(", ")}`);
    output.set("result", "warning");
    output.set("message", "No matching services - pages not created");
    output.set("offer", offerRecord.name);
    return;
}

// Get all locations
let locationsTable = base.getTable("Locations");
let locationsQuery = await locationsTable.selectRecordsAsync();

// Filter locations by offer targeting (Target Locations)
let targetLocations = offerRecord.getCellValue("Target Locations") || [];
let matchingLocations = locationsQuery.records.filter(location => {
    // If Target Locations is empty, offer applies to ALL locations
    if (targetLocations.length === 0) return true;
    // Otherwise, check if this location is in the target list
    return targetLocations.some(l => l.id === location.id);
});

console.log(`🗺️  Found ${locationsQuery.records.length} total locations`);
console.log(`🎯 ${matchingLocations.length} locations match Target Locations`);

if (matchingLocations.length === 0) {
    console.log(`\n⚠️  WARNING: No locations match this offer's Target Locations!`);
    console.log(`   Target Locations: ${targetLocations.length === 0 ? "ALL" : targetLocations.map(l => l.name || l.id).join(", ")}`);
    output.set("result", "warning");
    output.set("message", "No matching locations - pages not created");
    output.set("offer", offerRecord.name);
    return;
}

// Further filter locations by Target Branches (via Service Areas)
let targetBranches = offerRecord.getCellValue("Target Branches") || [];
if (targetBranches.length > 0) {
    console.log(`\n🏢 Filtering by Target Branches...`);

    // Get Service Areas to find which locations the target branches serve
    let serviceAreasTable = base.getTable("Service Areas");
    let serviceAreasQuery = await serviceAreasTable.selectRecordsAsync({
        fields: ["Branch ID", "Location ID", "Active"]
    });

    // Build set of location IDs served by target branches
    let branchLocationIds = new Set();
    for (let serviceArea of serviceAreasQuery.records) {
        let branchIds = serviceArea.getCellValue("Branch ID") || [];
        let locationIds = serviceArea.getCellValue("Location ID") || [];
        let isActive = serviceArea.getCellValue("Active");

        // Only include active service areas
        if (!isActive) continue;

        // Check if this service area's branch is in target branches
        if (branchIds.length > 0 && targetBranches.some(b => b.id === branchIds[0].id)) {
            // Add this location to the set
            if (locationIds.length > 0) {
                branchLocationIds.add(locationIds[0].id);
            }
        }
    }

    console.log(`   Found ${branchLocationIds.size} locations served by target branches`);

    // Filter matching locations to only include those served by target branches
    let beforeCount = matchingLocations.length;
    matchingLocations = matchingLocations.filter(location => branchLocationIds.has(location.id));

    console.log(`🎯 ${matchingLocations.length} locations after branch filtering (was ${beforeCount})`);

    if (matchingLocations.length === 0) {
        console.log(`\n⚠️  WARNING: No locations are served by the target branches!`);
        console.log(`   Target Branches: ${targetBranches.map(b => b.name || b.id).join(", ")}`);
        console.log(`   This likely means the Service Areas table isn't configured for these branches.`);
        output.set("result", "warning");
        output.set("message", "No locations served by target branches - pages not created");
        output.set("offer", offerRecord.name);
        return;
    }
}

// Get existing pages to check for duplicates (Service + Location + Keyword + Offer)
let pagesTable = base.getTable("Pages");
let pagesQuery = await pagesTable.selectRecordsAsync({
    fields: ["Service ID", "Location ID", "Target Keyword", "Offer ID"]
});

console.log(`📄 Checking against ${pagesQuery.records.length} existing pages...\n`);

// Build duplicate check map: "serviceId-locationId-keyword-offerId" => true
// CRITICAL: Offer ID must be included in the key to allow multiple offers for same service+location+keyword
let existingPagesMap = {};
for (let page of pagesQuery.records) {
    let serviceIds = page.getCellValue("Service ID") || [];
    let locationIds = page.getCellValue("Location ID") || [];
    let targetKeyword = page.getCellValue("Target Keyword");
    let offerIds = page.getCellValue("Offer ID") || [];

    if (serviceIds.length > 0 && locationIds.length > 0 && targetKeyword && offerIds.length > 0) {
        let key = `${serviceIds[0].id}-${locationIds[0].id}-${targetKeyword}-${offerIds[0].id}`;
        existingPagesMap[key] = true;
    }
}

// Build array of pages to create (for batch creation)
let recordsToCreate = [];
let skippedCount = 0;
let servicesWithoutKeywords = 0;

// Calculate estimated total (for validation)
let totalValidKeywords = 0;
for (let service of matchingServices) {
    let keywords = service.getCellValue("Primary Keywords");
    if (keywords) {
        let keywordArray = keywords
            .split(",")
            .map(k => k.trim())
            .filter(k => k.length > 0)
            .filter(k => k.length >= 3 && /[a-zA-Z]/.test(k));
        totalValidKeywords += keywordArray.length;
    }
}
let estimatedTotal = totalValidKeywords * matchingLocations.length;

console.log(`📊 Estimated pages to create: ${estimatedTotal} (${totalValidKeywords} keywords × ${matchingLocations.length} locations)`);

if (estimatedTotal > 500) {
    console.log(`⚠️  WARNING: This will create ${estimatedTotal} pages. May take 20-30 seconds...`);
}

for (let service of matchingServices) {
    let keywords = service.getCellValue("Primary Keywords");

    if (!keywords) {
        servicesWithoutKeywords++;
        continue;
    }

    // Parse keywords and validate
    let keywordArray = keywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .filter(k => {
            // Skip keywords that are too short (likely typos or mid-edit)
            if (k.length < 3) {
                console.log(`   ⚠️  SKIPPING invalid keyword (too short): "${k}"`);
                return false;
            }
            // Skip keywords with only numbers or special characters
            if (!/[a-zA-Z]/.test(k)) {
                console.log(`   ⚠️  SKIPPING invalid keyword (no letters): "${k}"`);
                return false;
            }
            return true;
        });

    if (keywordArray.length === 0) {
        console.log(`⏭️  Service "${service.name}" has no valid keywords - skipping`);
        servicesWithoutKeywords++;
        continue;
    }

    console.log(`\n📦 Service: "${service.name}" (${keywordArray.length} valid keywords)`);

    // Get client records once per service
    let clientRecords = service.getCellValue("Client");

    for (let keyword of keywordArray) {
        for (let location of matchingLocations) {
            // Check duplicate - MUST include offer ID to allow multiple offers per service+location+keyword
            let checkKey = `${service.id}-${location.id}-${keyword}-${offerRecord.id}`;

            if (existingPagesMap[checkKey]) {
                skippedCount++;
                continue;
            }

            // Add offer-specific page to batch
            recordsToCreate.push({
                fields: {
                    "Client Name": clientRecords ? clientRecords.map(c => ({id: c.id})) : null,
                    "Service ID": [{id: service.id}],
                    "Location ID": [{id: location.id}],
                    "Target Keyword": keyword,
                    "Offer ID": [{id: offerRecord.id}], // Link to offer
                    "Published": false
                }
            });

            // Log every 50 pages queued
            if (recordsToCreate.length % 50 === 0) {
                console.log(`   📋 Queued ${recordsToCreate.length} pages so far...`);
            }
        }
    }
}

// Create pages in batches of 50
console.log(`\n📦 Creating ${recordsToCreate.length} pages in batches of 50...`);
let createdCount = 0;
let errorCount = 0;

while (recordsToCreate.length > 0) {
    let batch = recordsToCreate.slice(0, 50);
    recordsToCreate = recordsToCreate.slice(50);

    try {
        await pagesTable.createRecordsAsync(batch);
        createdCount += batch.length;
        console.log(`   ✅ Created batch of ${batch.length} pages (${createdCount} total)`);
    } catch (error) {
        console.error(`   ❌ ERROR: Batch creation failed - ${error.message}`);
        errorCount += batch.length;
    }
}

// Output summary
console.log(`\n${"=".repeat(50)}`);
console.log(`AUTOMATION COMPLETE`);
console.log(`${"=".repeat(50)}`);

output.set("result", "success");
output.set("offer", offerRecord.name);
output.set("servicesProcessed", matchingServices.length);
output.set("locationsProcessed", matchingLocations.length);
output.set("estimatedTotal", estimatedTotal);
output.set("servicesWithoutKeywords", servicesWithoutKeywords);
output.set("created", createdCount);
output.set("skipped", skippedCount);
output.set("errors", errorCount);
output.set("message", `Created ${createdCount} offer pages (${matchingServices.length} services × ${matchingLocations.length} locations), skipped ${skippedCount} duplicates, ${errorCount} errors`);
