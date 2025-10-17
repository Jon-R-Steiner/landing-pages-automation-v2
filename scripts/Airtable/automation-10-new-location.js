/**
 * Airtable Automation 10: Create Pages When Location Added
 *
 * PURPOSE: Automatically create Pages records when a new Location is created
 *
 * TRIGGER: When record created in Locations table
 *
 * BEHAVIOR:
 * - Gets all existing Services with their Primary Keywords
 * - Gets all active offers and filters by Target Locations
 * - Validates keywords (minimum 3 characters, must contain letters)
 * - Checks for duplicates before queueing (Service + Location + Keyword + Offer)
 * - Builds array of pages to create: 1 Page per Service × Keyword × matching offer for this Location
 * - Creates pages in batches of 50 using createRecordsAsync (fast!)
 * - Sets Published = false, Status = Draft (via Airtable default)
 *
 * EXAMPLE 1 (With Matching Offers):
 * - New Location: "San Antonio TX"
 * - Existing Services:
 *   - Bathroom Remodeling (keywords: "bathroom remodel, shower replacement, bathtub installation")
 *   - Kitchen Remodeling (keywords: "kitchen remodel, cabinet installation")
 * - Active Offers: "Spring Sale" (all locations), "San Antonio Launch" (San Antonio only)
 * - CREATES: 10 new Pages (5 keywords × 2 matching offers)
 *
 * EXAMPLE 2 (No Matching Offers):
 * - New Location: "Denver CO"
 * - No active offers target "Denver CO"
 * - CREATES: 0 pages (offers are required for all pages)
 * - WARNING: Logs that no offers match this location
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Airtable > Automations
 * 2. Create new automation: "Create Pages When Location Added"
 * 3. Trigger: "When record created"
 *    - Table: Locations
 * 4. Action: "Run script"
 *    - Copy/paste this entire script
 *    - Input Variables:
 *      - Name: recordId
 *      - Value: Select "Record ID" from trigger dropdown
 * 5. Test with a dummy location first
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

// Fetch the location record using the ID
let locationsTable = base.getTable("Locations");
let locationQuery = await locationsTable.selectRecordsAsync();
let locationRecord = locationQuery.records.find(r => r.id === recordId);

// Validate record exists
if (!locationRecord) {
    console.error(`❌ ERROR: Could not find location record with ID ${recordId}`);
    output.set("result", "error");
    output.set("message", "Could not find location record. The record may have been deleted.");
    throw new Error("Location record not found");
}

console.log(`=== Automation 10: Processing Location "${locationRecord.name}" ===`);

// Get all active services with their keywords
let servicesTable = base.getTable("Services");
let servicesQuery = await servicesTable.selectRecordsAsync({
    fields: ["Service Name", "Primary Keywords", "Client", "Active"]
});

// Filter to only active services
let allServices = servicesQuery.records;
let activeServices = allServices.filter(service => service.getCellValue("Active"));

console.log(`📦 Found ${allServices.length} total services, ${activeServices.length} active`);

// Get all active offers
let offersTable = base.getTable("Offers");
let offersQuery = await offersTable.selectRecordsAsync({
    fields: ["Offer Name", "Status", "Target Locations"]
});

// Filter offers that apply to this location
let matchingOffers = offersQuery.records.filter(offer => {
    // Must be active
    if (offer.getCellValue("Status") !== "Active") return false;

    let targetLocations = offer.getCellValue("Target Locations") || [];

    // If Target Locations is empty, offer applies to ALL locations
    if (targetLocations.length === 0) return true;

    // Otherwise, check if this location is in the target list
    return targetLocations.some(l => l.id === locationRecord.id);
});

console.log(`\n🎯 Found ${matchingOffers.length} offers that match this location:`);
matchingOffers.forEach((offer, i) => {
    let targetLocations = offer.getCellValue("Target Locations") || [];
    let targeting = targetLocations.length === 0 ? "ALL locations" : "specific locations";
    console.log(`   ${i + 1}. "${offer.name}" (${targeting})`);
});

if (matchingOffers.length === 0) {
    console.log(`\n⚠️  WARNING: No active offers target this location!`);
    console.log(`   Pages cannot be created without offers.`);
    console.log(`   Please create an offer that targets "${locationRecord.name}" or all locations.`);
    output.set("result", "warning");
    output.set("message", "No matching offers - pages not created");
    output.set("location", locationRecord.name);
    output.set("servicesProcessed", activeServices.length);
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

    if (serviceIds.length > 0 && locationIds.length > 0 && targetKeyword && offerIds.length > 0) {
        let key = `${serviceIds[0].id}-${locationIds[0].id}-${targetKeyword}-${offerIds[0].id}`;
        existingPagesMap[key] = true;
    }
}

// Build array of pages to create (for batch creation)
let recordsToCreate = [];
let skippedCount = 0;
let servicesWithoutKeywords = 0;

for (let service of activeServices) {
    let keywords = service.getCellValue("Primary Keywords");

    if (!keywords) {
        console.log(`⏭️  Service "${service.name}" has no keywords - skipping`);
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
        for (let offer of matchingOffers) {
            // Check if page already exists for this service+location+keyword+offer
            let checkKey = `${service.id}-${locationRecord.id}-${keyword}-${offer.id}`;

            if (existingPagesMap[checkKey]) {
                console.log(`   ⏭️  SKIP: "${keyword}" + "${offer.name}" (duplicate)`);
                skippedCount++;
                continue;
            }

            // Add page to batch
            recordsToCreate.push({
                fields: {
                    "Client Name": clientRecords ? clientRecords.map(c => ({id: c.id})) : null,
                    "Service ID": [{id: service.id}],
                    "Location ID": [{id: locationRecord.id}],
                    "Target Keyword": keyword,
                    "Offer ID": [{id: offer.id}],
                    "Published": false
                }
            });
            console.log(`   ✅ QUEUED: "${keyword}" + "${offer.name}"`);
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
output.set("location", locationRecord.name);
output.set("servicesProcessed", activeServices.length);
output.set("servicesWithoutKeywords", servicesWithoutKeywords);
output.set("matchingOffers", matchingOffers.length);
output.set("created", createdCount);
output.set("skipped", skippedCount);
output.set("errors", errorCount);
output.set("message", `Created ${createdCount} pages (${matchingOffers.length} offers), skipped ${skippedCount} duplicates, ${errorCount} errors`);
