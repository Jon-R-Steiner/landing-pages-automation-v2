/**
 * Airtable Automation 9: Create Pages When Keyword Added to Service
 *
 * PURPOSE: Automatically create Pages records when new keywords are added to Services.Primary Keywords
 *
 * TRIGGER: When Services.Primary Keywords field is updated
 *
 * BEHAVIOR:
 * - Parses comma-separated keywords from Service
 * - Validates keywords (minimum 3 characters, must contain letters)
 * - Gets all active offers and filters by Target Services
 * - Checks for duplicates before queueing (Service + Location + Keyword + Offer)
 * - Builds array of pages to create: 1 Page per keyword × location × matching offer
 * - Creates pages in batches of 50 using createRecordsAsync (fast!)
 * - Sets Published = false, Status = Draft (via Airtable default)
 *
 * EXAMPLE 1 (With Matching Offers):
 * - Service: "Bathroom Remodeling" adds keyword "bathtub installation"
 * - Existing Locations: Austin TX, Dallas TX, Houston TX
 * - Active Offers: "Spring Sale 20%" (targets Bathroom), "Kitchen Promo" (targets Kitchen)
 * - CREATES: 3 new Pages (1 keyword × 3 locations × 1 matching offer "Spring Sale")
 * - SKIPS: "Kitchen Promo" (doesn't target Bathroom service)
 *
 * EXAMPLE 2 (No Matching Offers):
 * - Service: "Basement Finishing" adds keyword "basement remodel"
 * - No active offers target "Basement Finishing"
 * - CREATES: 0 pages (offers are required for all pages)
 * - WARNING: Logs that no offers match this service
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Airtable > Automations
 * 2. Create new automation: "Create Pages When Keyword Added"
 * 3. Trigger: "When record updated"
 *    - Table: Services
 *    - Field: Primary Keywords
 *    - Condition: Field is not empty
 * 4. Action: "Run script"
 *    - Copy/paste this entire script
 *    - Input Variables:
 *      - Name: recordId
 *      - Value: Select "Record ID" from trigger dropdown
 * 5. Test with a dummy service first
 * 6. Activate automation when ready
 *
 * PERFORMANCE:
 * - Uses batch creation (createRecordsAsync) for 10-50x faster performance
 * - Creates up to 50 records per batch
 * - Can handle 750+ pages in 30 seconds
 * - Timeout is extremely unlikely with batch operations
 */

// Get the record ID that triggered this automation
let config = input.config();
let recordId = config.recordId;

// Fetch the service record using the ID
let servicesTable = base.getTable("Services");
let serviceQuery = await servicesTable.selectRecordsAsync();
let serviceRecord = serviceQuery.records.find(r => r.id === recordId);

// Validate record exists
if (!serviceRecord) {
    console.error(`❌ ERROR: Could not find service record with ID ${recordId}`);
    output.set("result", "error");
    output.set("message", "Could not find service record. The record may have been deleted.");
    throw new Error("Service record not found");
}

console.log(`=== Automation 9: Processing Service "${serviceRecord.name}" ===`);

// Check if service is active
let serviceActive = serviceRecord.getCellValue("Active");
if (!serviceActive) {
    console.log("❌ Service is INACTIVE - automation skipped");
    output.set("result", "skipped");
    output.set("message", "Service is inactive - automation skipped");
    output.set("service", serviceRecord.name);
    return;
}

// Get the service's current keywords
let keywords = serviceRecord.getCellValue("Primary Keywords");
if (!keywords) {
    console.log("❌ No keywords to process - automation skipped");
    output.set("result", "skipped");
    output.set("message", "No keywords - automation skipped");
    return;
}

// Parse comma-separated keywords and clean them up
let keywordArray = keywords
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .filter(k => {
        // Skip keywords that are too short (likely typos or mid-edit)
        if (k.length < 3) {
            console.log(`⚠️  SKIPPING invalid keyword (too short): "${k}"`);
            return false;
        }
        // Skip keywords with only numbers or special characters
        if (!/[a-zA-Z]/.test(k)) {
            console.log(`⚠️  SKIPPING invalid keyword (no letters): "${k}"`);
            return false;
        }
        return true;
    });

console.log(`📋 Found ${keywordArray.length} valid keywords to process:`);
keywordArray.forEach((kw, i) => console.log(`   ${i + 1}. "${kw}"`));

// Get all locations
let locationsTable = base.getTable("Locations");
let locationsQuery = await locationsTable.selectRecordsAsync();
let locations = locationsQuery.records;

console.log(`\n🗺️  Found ${locations.length} locations`);

// Get all active offers
let offersTable = base.getTable("Offers");
let offersQuery = await offersTable.selectRecordsAsync({
    fields: ["Offer Name", "Status", "Target Services"]
});

// Filter offers that apply to this service
let matchingOffers = offersQuery.records.filter(offer => {
    // Must be active
    if (offer.getCellValue("Status") !== "Active") return false;

    let targetServices = offer.getCellValue("Target Services") || [];

    // If Target Services is empty, offer applies to ALL services
    if (targetServices.length === 0) return true;

    // Otherwise, check if this service is in the target list
    return targetServices.some(s => s.id === serviceRecord.id);
});

console.log(`\n🎯 Found ${matchingOffers.length} offers that match this service:`);
matchingOffers.forEach((offer, i) => {
    let targetServices = offer.getCellValue("Target Services") || [];
    let targeting = targetServices.length === 0 ? "ALL services" : "specific services";
    console.log(`   ${i + 1}. "${offer.name}" (${targeting})`);
});

if (matchingOffers.length === 0) {
    console.log(`\n⚠️  WARNING: No active offers target this service!`);
    console.log(`   Pages cannot be created without offers.`);
    console.log(`   Please create an offer that targets "${serviceRecord.name}" or all services.`);
    output.set("result", "warning");
    output.set("message", "No matching offers - pages not created");
    output.set("service", serviceRecord.name);
    output.set("keywordsProcessed", keywordArray.length);
    output.set("matchingOffers", 0);
    return;
}

// Get all existing pages to check for duplicates
let pagesTable = base.getTable("Pages");
let pagesQuery = await pagesTable.selectRecordsAsync({
    fields: ["Service ID", "Location ID", "Target Keyword", "Offer ID"]
});

console.log(`\n📄 Checking against ${pagesQuery.records.length} existing pages...\n`);

// Build duplicate check map: "serviceId-locationId-keyword-offerId" => true
// CRITICAL: Offer ID must be included to allow multiple offers for same service+location+keyword
let existingPagesMap = {};
for (let page of pagesQuery.records) {
    let serviceIds = page.getCellValue("Service ID") || [];
    let locationIds = page.getCellValue("Location ID") || [];
    let targetKeyword = page.getCellValue("Target Keyword");
    let offerIds = page.getCellValue("Offer ID") || [];

    if (serviceIds.length > 0 && targetKeyword && offerIds.length > 0) {
        // Handle both location-specific pages and national pages
        let locationKey = locationIds.length > 0 ? locationIds[0].id : "null";
        let key = `${serviceIds[0].id}-${locationKey}-${targetKeyword}-${offerIds[0].id}`;
        existingPagesMap[key] = true;
    }
}

// Get client records once (used for all pages)
let clientRecords = serviceRecord.getCellValue("Client");

// Build array of pages to create (for batch creation)
let recordsToCreate = [];
let skippedCount = 0;

for (let keyword of keywordArray) {
    console.log(`\n🔑 Processing keyword: "${keyword}"`);

    // If no locations exist, create national/generic pages for each matching offer
    if (locations.length === 0) {
        console.log(`   ℹ️  No locations - creating national pages`);

        for (let offer of matchingOffers) {
            let checkKey = `${serviceRecord.id}-null-${keyword}-${offer.id}`;

            if (existingPagesMap[checkKey]) {
                console.log(`   ⏭️  SKIP: National page with offer "${offer.name}" (duplicate)`);
                skippedCount++;
                continue;
            }

            // Add national page with offer to batch
            recordsToCreate.push({
                fields: {
                    "Client Name": clientRecords ? clientRecords.map(c => ({id: c.id})) : null,
                    "Service ID": [{id: serviceRecord.id}],
                    // Location ID omitted (national/generic page)
                    "Target Keyword": keyword,
                    "Offer ID": [{id: offer.id}],
                    "Published": false
                }
            });
            console.log(`   ✅ QUEUED: National page with offer "${offer.name}"`);
        }
        continue;
    }

    // Normal case: add pages for each location × matching offer to batch
    for (let location of locations) {
        for (let offer of matchingOffers) {
            // Check if page already exists for this service+location+keyword+offer
            let checkKey = `${serviceRecord.id}-${location.id}-${keyword}-${offer.id}`;

            if (existingPagesMap[checkKey]) {
                console.log(`   ⏭️  SKIP: ${location.name} + "${offer.name}" (duplicate)`);
                skippedCount++;
                continue;
            }

            // Add page to batch
            recordsToCreate.push({
                fields: {
                    "Client Name": clientRecords ? clientRecords.map(c => ({id: c.id})) : null,
                    "Service ID": [{id: serviceRecord.id}],
                    "Location ID": [{id: location.id}],
                    "Target Keyword": keyword,
                    "Offer ID": [{id: offer.id}],
                    "Published": false
                }
            });
            console.log(`   ✅ QUEUED: ${location.name} + "${offer.name}"`);
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
output.set("service", serviceRecord.name);
output.set("keywordsProcessed", keywordArray.length);
output.set("locationsScanned", locations.length);
output.set("matchingOffers", matchingOffers.length);
output.set("created", createdCount);
output.set("skipped", skippedCount);
output.set("errors", errorCount);
output.set("message", `Created ${createdCount} pages (${matchingOffers.length} offers), skipped ${skippedCount} duplicates, ${errorCount} errors`);
