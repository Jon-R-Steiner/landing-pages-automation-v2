# Airtable Schema Changes: Add Offer Slug Support

## Purpose
Add Offer Slug to page URLs to ensure unique URLs for offer-specific pages. **Every page MUST have an offer** - there are no generic/standard pages.

## Example
- Offer 1: "Spring Sale 20%" → `/walk-in-showers/austin/installation/spring-sale-20`
- Offer 2: "Senior Discount" → `/walk-in-showers/austin/installation/senior-discount`

---

## Implementation Steps

### Step 1: Add "Offer Slug" to Offers Table

1. Open **Offers** table in Airtable
2. Add new field:
   - **Field Name**: `Offer Slug`
   - **Field Type**: Formula
   - **Formula**:
   ```
   LOWER(REGEX_REPLACE(REGEX_REPLACE(REGEX_REPLACE({Offer Name}, '[^a-zA-Z0-9\\s]', ''), '\\s+', '-'), '-+', '-'))
   ```
   - **Description**: URL-friendly slug generated from Offer Name (e.g., "Spring Sale 20%" → "spring-sale-20")

3. **Test**: Verify existing offers now show slug values
   - Example: "Spring Sale 20%" → "spring-sale-20"
   - Example: "Senior Discount 15% Off" → "senior-discount-15-off"

---

### Step 2: Add "Offer Slug" Lookup to Pages Table

1. Open **Pages** table in Airtable
2. Add new field:
   - **Field Name**: `Offer Slug`
   - **Field Type**: Lookup
   - **Lookup Configuration**:
     - From: `Offer ID` (linked record field)
     - Select: `Offer Slug`
   - **Description**: Pulls Offer Slug from linked Offer

3. **Test**: All pages should show offer slug from linked offer

---

### Step 3: Make "Offer ID" Required in Pages Table

1. Open **Pages** table in Airtable
2. Find **Offer ID** field (linked record field)
3. Edit field settings:
   - Check "Limit record selection to one record" if not already set
   - Mark as required (*Required) in field description

---

### Step 4: Update "Unique Key" Formula in Pages Table

1. Open **Pages** table in Airtable
2. Find existing **Unique Key** field (should be a Formula field)
3. Update formula to **always include offer slug**:

**NEW FORMULA**:
```
{Service Slug} & "-" & {Location Slug} & "-" & LOWER(SUBSTITUTE({Target Keyword}, " ", "-")) & "-" & {Offer Slug}
```

**Example Results**:
- `bathroom-remodeling-austin-installation-spring-sale-20`
- `kitchen-remodeling-houston-renovation-senior-discount`

4. **Test**: Verify all pages show unique keys with offer slugs

---

### Step 5: Update "URL Slug" Formula in Pages Table

1. Open **Pages** table in Airtable
2. Find existing **URL Slug** field (should be a Formula field)
3. Update formula to **always include offer slug**:

**NEW FORMULA**:
```
"/" & {Service Slug} & "/" & {Location Slug} & "/" & LOWER(SUBSTITUTE({Target Keyword}, " ", "-")) & "/" & {Offer Slug}
```

**Example Results**:
- `/bathroom-remodeling/austin/installation/spring-sale-20`
- `/kitchen-remodeling/houston/renovation/senior-discount`

4. **Test**: Verify all pages show URL slugs with offer slugs

---

### Step 6: Verify "Page URL" Field (No Changes Needed!)

1. Open **Pages** table in Airtable
2. Find existing **Page URL** field (should be a Formula field)
3. **DO NOT CHANGE** - this field already uses `URL Slug`

**Current Formula** (should be something like):
```
"https://yourdomain.com" & {URL Slug}
```

**Example Results**:
- `https://bathsrus.com/bathroom-remodeling/austin/installation/spring-sale-20`
- `https://bathsrus.com/kitchen-remodeling/houston/renovation/senior-discount`

---

## Testing Checklist

### ✅ Test 1: Offer Slug Generation
- [ ] Create test offer: "Test Offer 50%"
- [ ] Verify Offer Slug: `test-offer-50`

### ✅ Test 2: Page with Offer
- [ ] Link offer to existing page
- [ ] Verify Unique Key: `service-location-keyword-offer-slug`
- [ ] Verify URL Slug: `/service/location/keyword/offer-slug`
- [ ] Verify Page URL: `https://domain.com/service/location/keyword/offer-slug`

### ✅ Test 3: Multiple Offers Same Service+Location+Keyword
- [ ] Create 2 offers: "Spring Sale 20%", "Senior Discount"
- [ ] Use automation-11 to create pages for both offers
- [ ] Verify UNIQUE URLs:
  - Offer 1: `/walk-in-showers/austin/installation/spring-sale-20`
  - Offer 2: `/walk-in-showers/austin/installation/senior-discount`

### ✅ Test 4: Automation Scripts Create Offer Pages
- [ ] Add new keyword to Service → automation-9 creates pages for each matching offer
- [ ] Add new Location → automation-10 creates pages for each matching offer
- [ ] Add new Offer → automation-11 creates offer pages
- [ ] All duplicate detection works correctly

---

## Rollback Instructions (If Needed)

If something goes wrong, reverse in this order:

1. **Revert URL Slug formula** to original (without offer slug)
2. **Revert Unique Key formula** to original (without offer slug)
3. **Remove required constraint** from Offer ID field in Pages table
4. **Delete "Offer Slug" lookup field** from Pages table
5. **Delete "Offer Slug" formula field** from Offers table

---

## Notes

- **Every Page Requires an Offer**: No generic/standard pages allowed
- **No Code Changes Required**: Next.js just reads URLs from Airtable
- **Automation Scripts Updated**: All three automations (9, 10, 11) create pages per matching offer
- **Duplicate Detection**: Unique Key formula includes offer slug to prevent duplicates
- **SEO Structure**: Clean hierarchical URLs with offer at the end

---

## Expected Results Summary

| Scenario | Unique Key | URL Slug | Page URL |
|----------|-----------|----------|----------|
| Offer Page | `service-location-keyword-offer-slug` | `/service/location/keyword/offer-slug` | `domain.com/service/location/keyword/offer-slug` |

**Architecture**: Offer-first approach - every page is tied to a specific promotional offer
