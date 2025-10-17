<!-- Powered by BMAD™ Core -->

# Generate SEO Meta (Title & Description)

## Purpose

Generate SEO-optimized title tag and meta description for a landing page, critical for:
- **Google Ads Quality Score** - Ad-to-landing page relevance
- **Organic Search Ranking** - Local SEO optimization
- **Click-Through Rate** - Compelling copy in search results
- **Message Match** - Consistency between ad and landing page

---

## Input Requirements

**Context needed before generation:**
- **Service Name** - Exact service offered (e.g., "Bathroom Remodeling")
- **Location** - City and State (e.g., "Austin, TX")
- **Primary Keywords** - Target search terms (from `SEO Keywords` field)
- **Client Differentiators** - Unique selling points
  - Years in business
  - Ratings (BBB, Google)
  - Special offers
  - Warranties/guarantees
- **CTA Type** - What action do we want (call, quote, consultation)

**Optional Context:**
- Existing Google Ads copy (for message match)
- Competitor title/descriptions
- Brand voice guidelines

---

## SEO Title Tag Guidelines

### Length Requirements
- **Optimal:** 50-60 characters (including spaces)
- **Maximum:** 60 characters (Google truncates beyond this)
- **Minimum:** 40 characters (too short misses opportunity)

### Required Components (Priority Order)

1. **Service + Location** (Must have)
   - Format: `[Service] in [City, State]`
   - Example: "Bathroom Remodeling in Austin, TX"

2. **Differentiator** (Strongly recommended)
   - Trust signal: "25+ Years" | "A+ BBB Rated" | "Licensed & Insured"
   - Offer: "Free Quote" | "0% Financing" | "Same-Day Service"

3. **CTA** (If space allows)
   - "Call Now" | "Get Quote" | "Free Consultation"

4. **Brand Name** (Optional - only if space + brand recognition)
   - Usually omitted for paid traffic pages
   - Google often appends automatically

### Title Formulas

**Formula 1: Service + Location + Differentiator + CTA**
```
Bathroom Remodeling in Austin, TX | Free Quote
```
*58 characters - optimal*

**Formula 2: Differentiator + Service + Location**
```
Licensed Bathroom Remodeling in Austin | Get Quote
```
*53 characters - good*

**Formula 3: Service + Location + Two Differentiators**
```
Bathroom Remodeling Austin, TX | 25+ Years | A+ BBB
```
*55 characters - strong trust*

### ✅ Good Examples

```
Bathroom Remodeling in Austin, TX | Free Quote
```
*Service, location, CTA - clear and direct*

```
Austin Bathroom Remodeling | 25+ Years | Call Today
```
*Location-first variation, trust signal, CTA*

```
Licensed Bathroom Remodeling Austin, TX | A+ Rated
```
*Trust qualifier, service, location, rating*

### ❌ Bad Examples

```
Bathroom Remodeling Services | Home Pro Services
```
*No location, brand name wasted*

```
The Best Bathroom Remodeling Company in Austin, Texas Area
```
*66 characters - truncated, generic claim*

```
Bathroom Remodel
```
*15 characters - way too short, misses opportunity*

---

## Meta Description Guidelines

### Length Requirements
- **Optimal:** 150-160 characters (including spaces)
- **Maximum:** 160 characters (Google truncates beyond this)
- **Minimum:** 120 characters (too short misses opportunity)

### Required Components

1. **Service + Location** (First sentence)
   - Reinforces relevance for local search
   - Example: "Transform your bathroom with Austin's most trusted remodeling experts."

2. **Value Proposition** (Second sentence)
   - Why choose this company
   - Include 2-3 differentiators
   - Example: "25+ years experience, A+ BBB rating, lifetime warranty."

3. **Call-to-Action** (Final sentence)
   - Clear action to take
   - Create urgency if possible
   - Example: "Free quotes available. Call today!"

### Description Formulas

**Formula 1: Problem-Solution-CTA**
```
Transform your bathroom with Austin's trusted remodeling experts. 25+ years experience, A+ BBB rated, lifetime warranty. Free quotes - call today!
```
*154 characters - optimal*

**Formula 2: Service-Benefits-CTA**
```
Professional bathroom remodeling in Austin, TX. Licensed, insured, and backed by 25 years of local expertise. Get your free quote today!
```
*145 characters - solid*

**Formula 3: Trust-First**
```
Austin's A+ rated bathroom remodeling company. Over 5,000 satisfied customers, lifetime warranty, flexible financing. Schedule your free consultation now!
```
*160 characters - maximum trust*

### ✅ Good Examples

```
Transform your Austin bathroom with licensed experts. 25+ years experience, A+ BBB rating, lifetime warranty guaranteed. Free quotes. Call today!
```
*160 characters - all elements, compelling*

```
Professional bathroom remodeling in Austin, TX. Trusted by 5,000+ homeowners. Licensed, insured, lifetime warranty. Get your free quote now!
```
*152 characters - strong social proof*

### ❌ Bad Examples

```
We offer bathroom remodeling services.
```
*42 characters - way too short, no compelling reason to click*

```
Looking for the best bathroom remodeling company in the Austin, Texas metropolitan area? We've been providing top-quality bathroom renovation services for over 25 years!
```
*187 characters - truncated, repeats "bathroom" too much*

```
Call us for a quote.
```
*20 characters - no information, no location, no value*

---

## Local SEO Optimization

### Location Variations
Include location in natural ways:
- "in Austin, TX"
- "Austin's most trusted"
- "serving Austin homeowners"
- "Austin bathroom experts"

### Service Variations
Use semantic variations:
- Primary: "Bathroom Remodeling"
- Variations: "bathroom renovation", "bath remodel", "bathroom experts"

### Keyword Density
- Service name: 1-2 times (title + description)
- Location: 1-2 times
- Keywords should read naturally (not stuffed)

---

## Google Ads Quality Score Optimization

**For Paid Traffic Landing Pages:**

### Message Match Requirements
If Google Ads copy says:
```
Ad Headline: "Bathroom Remodeling Austin | Free Quote"
```

Landing page title should match:
```
Title: "Bathroom Remodeling in Austin, TX | Free Quote"
```

### Quality Score Factors
1. **Keyword Relevance** - Exact match of ad keywords in title
2. **Location Match** - Ad location matches meta location
3. **CTA Match** - Ad CTA matches meta CTA
4. **Offer Match** - If ad mentions offer, meta should too

---

## Output Format

**Return two separate strings (NOT JSON):**

### SEO Title
```
Bathroom Remodeling in Austin, TX | Free Quote
```

### SEO Description
```
Transform your bathroom with Austin's trusted remodeling experts. 25+ years experience, A+ BBB rated, lifetime warranty. Free quotes - call today!
```

---

## Validation Checklist

Before finalizing, verify:

**Title Tag:**
- [ ] 50-60 characters (optimal) or 40-60 (acceptable)
- [ ] Includes service name
- [ ] Includes location (City, State or City)
- [ ] Includes differentiator or CTA
- [ ] No placeholder text
- [ ] Natural reading (not keyword-stuffed)
- [ ] Unique from other pages (not duplicate)

**Meta Description:**
- [ ] 150-160 characters (optimal) or 120-160 (acceptable)
- [ ] Includes service name
- [ ] Includes location
- [ ] Includes 2-3 trust signals/differentiators
- [ ] Ends with clear CTA
- [ ] Natural reading (not keyword-stuffed)
- [ ] Compelling reason to click
- [ ] Unique from other pages

**Both:**
- [ ] Matches Google Ads copy (if applicable)
- [ ] Matches brand voice
- [ ] No special characters that display incorrectly (use | not • or —)
- [ ] Proper capitalization (title case for major words)

---

## Character Counter

**Quick Reference:**
```
Title Target: 55 characters
Description Target: 155 characters

Use character counter tool to verify exact length.
```

**Counting Rules:**
- Spaces count as characters
- Punctuation counts as characters
- Special characters (|, •, —) count as 1-2 characters

---

## Task Execution Steps

When executing this task as Content Writer agent:

1. **Gather Context:**
   - Load page data from Airtable
   - Extract service, location, keywords
   - Extract client differentiators (years, ratings, etc.)
   - Check for existing Google Ads copy (message match)

2. **Generate Title:**
   - Start with service + location (foundation)
   - Add strongest differentiator
   - Add CTA if space allows
   - Count characters (aim for 50-60)
   - Ensure natural reading

3. **Generate Description:**
   - First sentence: Service + location value prop
   - Second sentence: 2-3 differentiators
   - Third sentence: CTA with urgency
   - Count characters (aim for 150-160)
   - Ensure compelling and complete

4. **Validate:**
   - Run through validation checklist
   - Check character counts
   - Verify message match (if applicable)
   - Ensure no keyword stuffing

5. **Output:**
   - Display title and description separately
   - Show character counts
   - Note any assumptions or recommendations

---

## Example Output

**Context:** Bathroom Remodeling | Austin, TX | 25 years | A+ BBB | Free quotes

**Generated SEO Meta:**

**SEO Title** (58 characters):
```
Bathroom Remodeling in Austin, TX | Free Quote
```

**SEO Description** (156 characters):
```
Transform your bathroom with Austin's trusted remodeling experts. 25+ years experience, A+ BBB rated, lifetime warranty. Free quotes. Call today!
```

**Analysis:**
- ✅ Title includes service, location, CTA
- ✅ Description includes service, location, 3 trust signals, CTA
- ✅ Both within optimal character ranges
- ✅ Natural reading, compelling copy
- ✅ Message match ready for Google Ads

---

## Related Files

- **Agent:** `.bmad-core/agents/copywriter.md`
- **Guidelines:** `.bmad-core/data/content-generation-guidelines.md`
- **Master Workflow:** `.bmad-core/tasks/generate-landing-page-content.md`

---

**END OF TASK**
