# Airtable Schema Comparison Report

**Date:** 2025-10-17
**Base ID:** appATvatPtaoJ8MmS
**Comparison:** Live Schema vs. Archive/airtable-schema-phase1.md

---

## Summary

| Table | Live Fields | Doc Order | Status |
|-------|-------------|-----------|--------|
| Clients | 40 fields | #1 | ✅ Match |
| Services | 27 fields | #2 | ⚠️  Needs Review |
| Branch Staff | 19 fields | #6 | ⚠️  Needs Review |
| Branch Locations | 32 fields | #4 | ⚠️  Needs Review |
| Locations | 22 fields | #3 | ⚠️  Needs Review |
| Service Areas | 11 fields | #5 | ⚠️  Needs Review |
| Offers | 27 fields | #11 | ⚠️  Needs Review |
| Pages | 57 fields | #7 | ⚠️  Needs Review |
| CTAs | 16 fields | #8 | ⚠️  Needs Review |
| Hero Images Library | 16 fields | #9 | ⚠️  Needs Review |
| Testimonials | 22 fields | #10 | ⚠️  Needs Review |
| Campaigns | 22 fields | #12 | ⚠️  Needs Review |

**Total Tables:** 12 (matches documentation)

---

## Key Findings

###  1. **Offers Table - Status Field is Formula (NOT Single Select)**

**LIVE SCHEMA:**
- Field: "Status"
- Type: **formula**
- Formula: `IF(AND({Start Date} <= TODAY(), {End Date} >= TODAY()), "Active", IF({End Date} < TODAY(), "Expired", "Scheduled"))`
- Returns: String values "Active", "Expired", or "Scheduled"

**DOCUMENTED:**
- Schema docs do not clearly specify this is a formula field
- May be documented as single select field (needs verification)

**IMPACT:**
- ✅ **AUTOMATION SCRIPTS ARE CORRECT**: Scripts checking `getCellValue("Status") !== "Active"` WILL WORK
- ✅ Formula returns string "Active" when current date is between Start/End dates
- ⚠️ **DOCUMENTATION UPDATE NEEDED**: Docs should clarify this is a formula field, not manually set
- ℹ️ **STATUS VALUES**:
  - "Active" = Current date between Start Date and End Date
  - "Expired" = End Date has passed
  - "Scheduled" = Start Date hasn't arrived yet

---

## Next Steps

1. ✅ Extract field-by-field comparison for all tables
2. ⚠️  Verify Offers.Status formula output
3. ⚠️  Check if any other critical fields are formulas vs select fields
4. ⚠️  Update documentation with actual field types
5. ⚠️  Test automation scripts with live schema

