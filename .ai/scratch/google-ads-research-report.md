# Google Ads Performance Max & AI-Powered Search Campaign Strategy
## Comprehensive Research Report for Home Services Businesses (2024-2025)

**Prepared:** October 2025
**Focus:** Bathroom/Kitchen Remodeling & Home Services
**Campaign Types:** Performance Max, AI-Powered Search with Broad Match + Smart Bidding

---

## Executive Summary

This report provides actionable guidance for structuring Google Ads campaigns for multi-location home services businesses. Based on 2024-2025 best practices, the recommendations focus on Performance Max (PMax) campaigns, AI-powered Search campaigns using broad match + Smart Bidding, and service-specific strategies for the home remodeling industry.

**Key Finding:** Google's data shows advertisers who adopt Performance Max see an average **27% increase in conversions** at similar CPA/ROAS. Additionally, upgrading from exact match to broad match with Smart Bidding delivers up to **35% more conversions**.

---

## Table of Contents

1. [Performance Max Campaign Structure](#1-performance-max-campaign-structure)
2. [AI-Powered Search with Broad Match + Smart Bidding](#2-ai-powered-search-with-broad-match--smart-bidding)
3. [Home Services Industry-Specific Strategies](#3-home-services-industry-specific-strategies)
4. [Keyword-to-Service Metadata Alignment](#4-keyword-to-service-metadata-alignment)
5. [Campaign Measurement & Optimization](#5-campaign-measurement--optimization)
6. [Recommended Campaign Architecture](#6-recommended-campaign-architecture)
7. [Asset Group Templates](#7-asset-group-templates)
8. [Top 10 Actionable Insights](#8-top-10-actionable-insights)

---

## 1. Performance Max Campaign Structure

### 1.1 Campaign Organization: Single vs. Multiple Campaigns

**SINGLE CAMPAIGN WITH MULTIPLE ASSET GROUPS** (Recommended for most home services)

**When to Use:**
- Budget constraints require consolidated spending ($50-100/day minimum)
- Similar average CPC across service offerings
- Single geographic market or similar cost-of-living areas
- Need to overcome learning periods faster with data-rich campaigns

**Advantages:**
- One budget to manage
- Faster learning period (consolidated conversion data)
- Easier to maintain and optimize

**Key Limitation:** Asset groups must have similar auction prices. DO NOT mix asset groups with $20 CPC (custom home remodeling) with $2 CPC (handyman services) - this creates budget imbalance.

---

**MULTIPLE CAMPAIGNS** (Recommended for larger businesses)

**When to Use:**
- Different countries or languages
- Distinct service categories with different ROAS targets
- Multiple geographic markets with varying cost structures
- Sufficient budget to fund each campaign independently

**Examples:**
- Campaign 1: High-Value Services (Kitchen Remodeling) - $5,000/month budget, 300% ROAS target
- Campaign 2: Medium-Value Services (Bathroom Remodeling) - $3,000/month budget, 250% ROAS target
- Campaign 3: Maintenance Services - $2,000/month budget, 200% ROAS target

---

### 1.2 Asset Group Organization Best Practices

**KEY PRINCIPLE:** Performance Max campaigns should be divided into thematically different asset groups based on service type, NOT products.

**Recommended Structure for Home Services:**

**Option A: Service-Based Asset Groups** (Recommended)
```
Campaign: "Home Remodeling Services"
├── Asset Group 1: Kitchen Remodeling
├── Asset Group 2: Bathroom Remodeling
├── Asset Group 3: Basement Finishing
├── Asset Group 4: Whole Home Renovation
└── Asset Group 5: Custom Cabinets & Countertops
```

**Option B: Value Proposition-Based Asset Groups**
```
Campaign: "Home Remodeling Services"
├── Asset Group 1: Luxury/High-End Projects
├── Asset Group 2: Budget-Friendly Solutions
├── Asset Group 3: Quick Turnaround Projects
└── Asset Group 4: Energy-Efficient Upgrades
```

**Option C: Geographic Asset Groups** (For multi-location with distinct markets)
```
Campaign: "Metro Area Remodeling"
├── Asset Group 1: Downtown/Urban
├── Asset Group 2: Suburban West
├── Asset Group 3: Suburban North
└── Asset Group 4: Suburban South
```

**Optimal Number:** Research shows 3-15 asset groups is ideal. Start with 2-3 focused on distinct value propositions, then expand based on performance data.

---

### 1.3 Audience Signals Strategy (2024 Updates)

**CRITICAL UNDERSTANDING:** Audience signals are NOT targeting - they guide Google's AI in the right direction. Performance Max may show ads outside your signals if conversion likelihood is high.

**Best Practices:**

1. **Start Specific, Then Expand**
   - Begin with first-party data (your customer lists, website visitors)
   - Gradually add behavioral and interest-based segments
   - Avoid broad interests/demographics initially

2. **Create Individual Asset Groups Per Audience** (Advanced Strategy)
   - Google recommends combining all audiences in one asset group - DON'T
   - Instead, create separate asset groups for each primary audience type
   - Enables granular performance analysis
   - Better creative alignment with audience intent

3. **Prioritize High-Value Audiences**
   - Start with customers who completed projects (remarketing lists)
   - Add in-market audiences (e.g., "Home Improvement Services")
   - Layer custom segments (people searching for specific remodeling terms)
   - Combine remarketing, in-market, and custom segments

**Example Audience Signal Strategy:**
```
Asset Group: Kitchen Remodeling
├── First-Party: Website visitors who viewed kitchen pages (past 90 days)
├── In-Market: Home Improvement Services > Kitchen Remodeling
├── Custom Segment: Searched "kitchen renovation," "kitchen remodel cost"
└── Similar Audiences: Lookalike of past kitchen customers
```

---

### 1.4 Geographic Targeting for Multi-Location Businesses

**Strategy Options:**

**1. Location-Based Campaigns** (Best for distinct markets)
```
- Campaign: Boston Metro Services
- Campaign: Providence Services
- Campaign: Worcester Services
```

**2. Location Groups with Single Campaign**
- Use LocationGroupInfo to target multiple regions from one campaign
- Center on physical business locations using location extensions
- Ideal for businesses with 3-10 locations in similar markets

**3. Radius Targeting**
- Define service radius (e.g., 25-mile radius from office location)
- Prevents wasted ad spend on out-of-area leads
- Critical for businesses with limited service areas

**Targeting Settings:**
- **"Presence"** (Recommended): Show ads only to people physically in your target area or who regularly spend time there. Best for local services.
- **"Presence or Interest"**: Reaches users interested in your area even if not physically there. Use only if you serve customers planning moves or renovations from afar.

---

### 1.5 Product Feed Optimization for Service Offerings

While traditional product feeds are for physical products, service businesses can use **Business Data Feeds** for dynamic ads:

**Feed Structure:**
- Rows = Individual services
- Columns = Service attributes

**Key Service Attributes:**
- Service Name
- Service Description
- Image URL
- Service Category
- Price Range
- Service Duration/Timeline
- Service Area
- Custom Labels (e.g., "High Value," "Quick Jobs," "Seasonal")

---

### 1.6 Negative Keywords (2024-2025 Major Update)

**BREAKTHROUGH:** Google expanded negative keywords in Performance Max:
- January 2025: 100 negative keywords allowed
- March 2025: Increased to 10,000 negative keywords
- August 2025: Full rollout completed

**Strategy:**

1. **Account-Level Negatives** (Broad Exclusions)
   - DIY terms: "DIY bathroom remodel," "how to renovate kitchen"
   - Job seekers: "remodeling jobs," "contractor jobs near me"
   - Wrong services: "bathroom cleaning," "kitchen appliances"

2. **Campaign-Level Negatives** (Service-Specific)
   - Exclude competitive services (e.g., kitchen campaign excludes "bathroom")
   - Geographic negatives (cities you don't serve)
   - Budget/quality mismatches ("cheap," "free," "discount")

3. **Regular Maintenance**
   - Review search terms report weekly
   - Build negative keyword list proactively
   - Update quarterly based on new irrelevant queries

**Important Limitation:** Negatives work well for Search and Shopping but don't apply consistently across YouTube, Display, and Discover.

---

### 1.7 Budget Recommendations

**Minimum Daily Budget:** $50-100/day per campaign
- Provides sufficient data for AI learning
- Allows for meaningful performance analysis
- Enables testing and optimization

**Budget Allocation by Service Value:**
```
High-Value Services (Kitchen, Whole Home): 50-60% of budget
Medium-Value (Bathroom, Basement): 25-35% of budget
Quick Jobs (Countertops, Tile): 10-20% of budget
```

---

### 1.8 Brand Exclusions

**BEST PRACTICE:** Exclude branded terms from generic Performance Max campaigns.

**Reasoning:**
- Brand traffic requires different ROAS targets
- Performance Max prioritizes best-performing terms (typically branded)
- Generic campaigns should focus on new customer acquisition
- Create separate branded campaign if needed

**Implementation:** Add brand name, common misspellings, and branded service terms to negative keyword list.

---

## 2. AI-Powered Search with Broad Match + Smart Bidding

### 2.1 Core Strategy

**CRITICAL PAIRING:** Broad match MUST be used with Smart Bidding for optimal results.

**Why This Works:**
- AI analyzes search intent, not just literal keywords
- Smart Bidding optimizes bids auction-by-auction using contextual signals
- Broad match gives Google flexibility to reach high-intent searches you didn't anticipate

**Recommended Combination:**
```
Broad Match Keywords
+ Smart Bidding (Target CPA or Target ROAS)
+ Responsive Search Ads
```

### 2.2 Smart Bidding Strategies for Service Businesses

**Option 1: Maximize Conversion Value with Target ROAS** (Recommended)
- Best for businesses with different service values
- Assign conversion values based on average project value:
  - Kitchen remodeling lead = $5,000
  - Bathroom remodeling lead = $2,000
  - Consultation booking = $500
- Start without ROAS target during learning (30-50 conversions)
- Add ROAS target once performance stabilizes

**Performance Impact:** Switching from Target CPA to Target ROAS yields average **14% more conversion value** at similar ROAS.

---

**Option 2: Maximize Conversions with Target CPA**
- Best for businesses where all leads have similar value
- Set target CPA based on acceptable cost-per-lead
- Example: If you close 20% of leads with $10,000 average project value, you can afford $400 CPA

---

**Option 3: Maximize Conversions (No Target)**
- Use during initial learning phase
- Transition to tCPA or tROAS after 2-3 weeks
- Good for small budgets with inconsistent conversion volume

---

### 2.3 How AI Interprets Search Intent for Services

**Google's AI Evolution:**
- Analyzes intent BEHIND searches, not just keyword matching
- Understands synonyms and related concepts
- Considers user context: location, device, time of day, past behavior

**Example of AI Interpretation:**
```
Broad Match Keyword: "bathroom remodeling"

AI May Match To:
✓ "bathroom renovation contractors near me"
✓ "update master bathroom"
✓ "bathroom makeover cost"
✓ "remodel my bathroom"
✓ "bathroom redesign services"

May Also Match (use negatives to prevent):
✗ "DIY bathroom remodel"
✗ "bathroom remodeling ideas"
✗ "bathroom cleaning services"
```

---

### 2.4 Match Type Strategy (2024 Guidance)

**Current Best Practice: Broad Match > Phrase Match > Exact Match**

**Performance Data:**
- Exact Match → Broad Match with Smart Bidding = **+35% conversions**
- Phrase Match → Broad Match with tCPA = **+25% conversions**

**When to Use Each:**

**Broad Match** (Primary Strategy)
- Use: High-value, intent-driven service keywords
- Example: `bathroom remodeling`
- Benefit: Maximum reach, AI-powered expansion
- Requirement: Must use Smart Bidding

**Phrase Match** (Secondary)
- Use: When you need moderate control
- Example: `"kitchen renovation contractor"`
- Benefit: Balance between reach and control
- Use case: Competitive terms where you want to limit reach

**Exact Match** (Minimal Use)
- Use: Highly specific, high-converting terms
- Example: `[emergency water damage restoration]`
- Benefit: Maximum control
- Limitation: Minimal reach, requires constant expansion

**Recommended Distribution:**
- 70-80% Broad Match
- 15-20% Phrase Match
- 5-10% Exact Match

---

### 2.5 Theme-Based Keyword Grouping

**Structure Ad Groups by Service Theme, NOT Match Type**

**Example Structure:**
```
Campaign: "Home Remodeling Services - Search"

Ad Group 1: Kitchen Remodeling
Keywords:
- kitchen remodeling (Broad)
- kitchen renovation (Broad)
- remodel kitchen (Broad)
- custom kitchen design (Broad)

Ad Group 2: Bathroom Remodeling
Keywords:
- bathroom remodeling (Broad)
- bathroom renovation (Broad)
- master bathroom remodel (Broad)
- shower remodel (Phrase)

Ad Group 3: Whole Home Renovation
Keywords:
- home renovation (Broad)
- house remodel (Broad)
- full home renovation (Phrase)
```

**Best Practice:** 5-10 keywords per ad group, focused on single service theme.

---

### 2.6 Negative Keyword Strategy in AI Campaigns

**Critical for Controlling Broad Match**

**Category 1: DIY Intent**
```
- DIY
- "do it yourself"
- tutorial
- "how to"
- steps to
- guide
```

**Category 2: Wrong Service Type**
```
- cleaning
- maid service
- "washing service"
- rental
- staging
```

**Category 3: Job Seekers**
```
- jobs
- hiring
- careers
- "work for"
- employment
- salary
```

**Category 4: Budget Mismatches**
```
- cheap
- free
- discount
- coupon
- deal
- "under $100"
```

**Category 5: Geographic Exclusions**
```
- [cities outside service area]
- [competing state names if local only]
```

**Maintenance:** Review Search Terms Report weekly, add 5-10 negatives per week initially.

---

### 2.7 Responsive Search Ads (RSA) Best Practices

**Required Elements:**
- Minimum: 5 headlines, 2 descriptions
- Recommended: 15 headlines, 5 descriptions
- Maximum variety helps AI find winning combinations

**Headline Strategy (15 Headlines):**
```
Headlines 1-3: Service + Location
"Bathroom Remodeling [City]"
"Kitchen Renovation Near You"
"[City] Home Remodeling Experts"

Headlines 4-6: Value Propositions
"Free In-Home Consultations"
"Licensed & Insured Contractors"
"Award-Winning Design Team"

Headlines 7-9: Benefits
"Transform Your Kitchen in 3 Weeks"
"Increase Home Value 20%"
"Custom Designs, Quality Craftsmanship"

Headlines 10-12: Offers/CTAs
"Request Free Quote Today"
"Book Free Design Consultation"
"Get Project Estimate in 24 Hours"

Headlines 13-15: Trust/Social Proof
"500+ 5-Star Reviews"
"Family-Owned Since 1985"
"BBB A+ Rated Company"
```

**Description Strategy (5 Descriptions):**
```
1. Full Service Description (90 chars)
2. Key Benefits + CTA (90 chars)
3. Trust Signals + Social Proof (90 chars)
4. Offer/Promotion + CTA (90 chars)
5. Geographic/Local Focus (90 chars)
```

**Pin Strategically:**
- Pin location-focused headline to position 1 (optional)
- Don't over-pin - let AI optimize
- Test performance with and without pinning

---

## 3. Home Services Industry-Specific Strategies

### 3.1 Understanding Sales Cycles

**SHORT SALES CYCLE** (Emergency Services)
- Examples: Plumbing repair, HVAC emergency, water damage
- Campaign Strategy: Search campaigns only
- Keywords: Bottom-of-funnel only ("emergency plumber near me")
- Bidding: Aggressive, high CPA acceptable
- Timeline: Decision within hours

**LONG SALES CYCLE** (Remodeling/Renovation)
- Examples: Kitchen remodel, bathroom renovation, home additions
- Campaign Strategy: Search + Performance Max + Display Remarketing
- Keywords: Full-funnel coverage
- Bidding: More conservative, track downstream metrics
- Timeline: 2-6 months from research to contract signing

---

### 3.2 Keyword Intent Mapping for Home Services Funnel

**TOP OF FUNNEL (Awareness Stage)**

**User Intent:** Informational, educational, exploring ideas
**Search Behavior:** "Issue or opportunity" terms

**Example Keywords:**
```
- "bathroom remodeling ideas"
- "kitchen renovation cost"
- "how much does bathroom remodel cost"
- "small bathroom design"
- "modern kitchen trends"
```

**Campaign Strategy:**
- Use only if budget allows (lower priority)
- YouTube, Display, Performance Max Discovery placements
- Target with educational content
- Track micro-conversions (video views, blog reads)

**Budget Allocation:** 10-15% if pursuing awareness campaigns

---

**MIDDLE OF FUNNEL (Consideration Stage)**

**User Intent:** Comparing options, looking for solutions
**Search Behavior:** "Tools," "suppliers," "services" + qualifiers

**Example Keywords:**
```
- "best bathroom remodeling contractors [city]"
- "kitchen renovation companies near me"
- "bathroom remodel reviews [city]"
- "compare kitchen remodeling services"
- "top rated remodeling contractors"
```

**Campaign Strategy:**
- Performance Max + Search campaigns
- Focus on differentiation, trust signals
- Target: consultation bookings, quote requests
- Remarketing to website visitors

**Budget Allocation:** 25-30%

---

**BOTTOM OF FUNNEL (Conversion Stage)**

**User Intent:** Ready to purchase, high purchase intent
**Search Behavior:** Specific action phrases, local modifiers

**Example Keywords:**
```
- "bathroom remodeling contractor [city]"
- "hire kitchen remodeler near me"
- "bathroom renovation services [zip code]"
- "kitchen remodel estimate"
- "book bathroom remodeling consultation"
```

**Campaign Strategy:**
- Primary focus for Search campaigns
- High-value asset groups in Performance Max
- Aggressive bidding, maximize impression share
- Conversion goal: Quote requests, consultation bookings, phone calls

**Budget Allocation:** 55-65% (priority)

---

### 3.3 Service-Specific Landing Pages

**CRITICAL SUCCESS FACTOR:** Tailored landing pages outperform generic pages for remodeling services.

**Required Landing Pages:**
- Separate page for each major service (Kitchen, Bathroom, Basement, etc.)
- Location-specific pages if multi-location ("Kitchen Remodeling [City]")
- Process/Timeline pages for consideration stage
- Portfolio/Gallery pages with project examples

**Landing Page Elements:**
```
1. Clear H1 matching ad copy
2. Strong hero image (completed project)
3. Brief service description (150-200 words)
4. Key benefits (3-5 bullet points)
5. Social proof (reviews, ratings, testimonials)
6. Before/after gallery (6-12 images)
7. Process/timeline overview
8. Multiple CTAs (form, phone, chat)
9. Trust badges (licenses, insurance, BBB, awards)
10. FAQ section (4-6 common questions)
```

---

### 3.4 Ad Extensions for Home Services

**ESSENTIAL EXTENSIONS:**

**1. Location Extensions**
- Display business address, phone, directions
- Integrate with Google Business Profile
- Shows on Maps placements
- Automatically includes in Performance Max

**2. Call Extensions**
- Mobile-optimized click-to-call
- Enable call tracking/recording
- Track calls as conversions
- Use different numbers for tracking

**3. Sitelink Extensions**
```
- "View Our Portfolio"
- "Free Consultation"
- "Customer Reviews"
- "About Our Process"
- "Financing Options"
- "Request Free Quote"
```

**4. Callout Extensions**
```
- "Free In-Home Estimates"
- "Licensed & Insured"
- "Family Owned & Operated"
- "Flexible Financing Available"
- "100% Satisfaction Guarantee"
- "Veteran Owned Business"
```

**5. Structured Snippets**
```
Type: Services
Values: Kitchen Renovations, Bathroom Remodels, Basement Finishing, Custom Cabinets, Tile Installation, Countertop Installation
```

**6. Image Extensions** (NEW - enable in Performance Max)
- Before/after photos
- Team photos
- Completed projects
- Equipment/facilities

---

### 3.5 Geographic Modifier Strategies

**LOCAL KEYWORD VARIATIONS:**

**City Level:**
```
- "bathroom remodeling [City]"
- "kitchen renovation in [City]"
- "[City] home remodeling contractors"
- "remodeling contractor near [City]"
```

**State Level** (broader awareness):
```
- "bathroom remodeling [State]"
- "best contractors in [State]"
```

**Neighborhood/Region Level** (highly targeted):
```
- "bathroom remodeling [Neighborhood]"
- "[Region] kitchen renovation"
- "contractors in [Neighborhood] area"
```

**"Near Me" Variants:**
```
- "bathroom remodeling near me"
- "kitchen contractors near me"
- "home remodeling services nearby"
```

**Best Practice:** Create comprehensive city list with variations:
- "local bathroom remodel in Boston"
- "bathroom contractor in Boston MA"
- "Boston bathroom renovation services"
- "remodel bathroom Boston"

**Dynamic Location Insertion:**
Enable in RSAs to automatically customize location in headlines/descriptions based on user's search location.

---

### 3.6 Seasonal & Promotional Strategies

**SEASONAL TRENDS FOR REMODELING:**

**Spring (March-May)** - PEAK SEASON
- Budget: Increase 20-30%
- Focus: Outdoor-adjacent projects (bathrooms, kitchens for summer entertaining)
- Messaging: "Get Ready for Summer," "Spring Home Makeover"

**Summer (June-August)** - HIGH SEASON
- Budget: Maximum spending
- Focus: Full home renovations, additions
- Messaging: "Transform Your Home This Summer"

**Fall (September-November)** - MODERATE SEASON
- Budget: Standard
- Focus: Interior projects before holidays
- Messaging: "Prepare for Holiday Entertaining," "Fall Home Updates"

**Winter (December-February)** - LOW SEASON
- Budget: Reduce 15-20% OR maintain for competitive advantage
- Focus: Interior projects, planning for spring
- Messaging: "Winter Planning, Spring Installation," "Beat the Spring Rush"

**PROMOTIONAL CAMPAIGN STRATEGY:**

Create separate campaigns/asset groups for promotions:
```
Asset Group: "Spring Special - Kitchen Remodeling"
- Time-limited offer (March 1 - May 31)
- Specific discount/incentive
- Dedicated landing page
- Urgency messaging in ad copy
```

---

### 3.7 Cost & ROI Benchmarks

**Industry Averages (Home Services):**
- Average CPC: $4.66 (varies widely by market and service)
- Recommended Monthly Budget: $1,000-$10,000
- Expected ROI: 3x-8x ad spend

**Service-Specific CPCs (Estimates):**
- Emergency services: $5-$15
- Bathroom remodeling: $6-$20
- Kitchen remodeling: $8-$25
- Whole home renovation: $10-$35

**Conversion Rates:**
- Click to lead: 5-15%
- Lead to consultation: 30-50%
- Consultation to project: 15-30%

**Example ROI Calculation:**
```
Monthly Ad Spend: $5,000
CPC: $10
Clicks: 500
Lead Conversion Rate: 10%
Leads Generated: 50
Consultation Booking Rate: 40%
Consultations: 20
Project Close Rate: 25%
Projects Won: 5
Average Project Value: $15,000
Revenue: $75,000
ROI: 15x (1,400% return)
```

---

### 3.8 Local Services Ads (LSA) Integration

**COMPLEMENTARY STRATEGY:** Use LSA alongside Performance Max and Search campaigns.

**LSA Benefits:**
- Top placement on Search results (above PMax and Search ads)
- Pay-per-lead pricing (not pay-per-click)
- Google Guaranteed badge (trust signal)
- Direct integration with Google Maps
- Booking directly through ads

**Integration Requirements (2024 Update):**
- Must have public Google Business Profile
- Background checks and licensing verification
- Customer reviews required
- CRM integration available

**Home Services Coverage:**
- HVAC contractors
- Plumbers
- Electricians
- Garage door services
- Appliance repair
- General contractors
- And 65+ other service categories

**Strategy:**
```
LSA (Top of page)
+ Performance Max (Search, Display, YouTube, Discovery, Shopping)
+ Search Campaigns (High-intent keywords)
+ Display Remarketing
= Full-funnel coverage
```

---

## 4. Keyword-to-Service Metadata Alignment

### 4.1 Service Catalog Structure

**PURPOSE:** Organize services with structured metadata for feed-based campaigns and better targeting.

**RECOMMENDED SCHEMA:**

```json
{
  "service_id": "SVC001",
  "service_name": "Kitchen Remodeling",
  "service_category": "Remodeling",
  "service_subcategory": "Kitchen",
  "description": "Complete kitchen renovation services including design, cabinets, countertops, flooring, and appliances",
  "price_range": {
    "min": 15000,
    "max": 75000,
    "currency": "USD",
    "display": "$15,000 - $75,000"
  },
  "timeline": {
    "min_weeks": 3,
    "max_weeks": 8,
    "display": "3-8 weeks"
  },
  "service_locations": [
    "Boston, MA",
    "Cambridge, MA",
    "Brookline, MA",
    "Newton, MA"
  ],
  "service_radius_miles": 25,
  "image_url": "https://example.com/images/kitchen-remodel.jpg",
  "gallery_urls": [
    "https://example.com/gallery/kitchen-1.jpg",
    "https://example.com/gallery/kitchen-2.jpg"
  ],
  "features": [
    "Custom Cabinet Design",
    "Countertop Installation",
    "Flooring",
    "Lighting Design",
    "Appliance Installation"
  ],
  "target_keywords": [
    "kitchen remodeling",
    "kitchen renovation",
    "custom kitchen design",
    "kitchen makeover"
  ],
  "custom_labels": {
    "label_1": "High Value",
    "label_2": "Long Lead Time",
    "label_3": "Design Service",
    "label_4": "Full Service"
  }
}
```

---

### 4.2 Metadata Fields That Improve Performance

**CRITICAL FIELDS:**

**1. Price Range**
- Sets expectations for lead quality
- Google can optimize for high-value leads
- Filters out unqualified searchers
- Display on ads when appropriate

**2. Service Area/Location**
- Critical for local businesses
- Prevents wasted ad spend outside service area
- Enables location-based bidding adjustments
- Required for Local Services Ads

**3. Timeline/Duration**
- Manages customer expectations
- Differentiates services (quick jobs vs. major projects)
- Helps match urgency of searcher

**4. Service Features/Inclusions**
- Enables detailed structured snippets
- Improves ad relevance
- Helps AI understand service scope

**5. Custom Labels**
- Segment services for reporting
- Enable campaign/asset group organization
- Examples:
  - Value Tier: "High Value," "Medium Value," "Quick Jobs"
  - Lead Time: "Emergency," "Same Week," "1-2 Weeks," "2+ Weeks"
  - Project Type: "Design Required," "Installation Only," "Full Service"
  - Seasonality: "Spring Priority," "Year-Round," "Winter Special"

---

### 4.3 Service-to-Keyword Mapping Strategy

**METHODOLOGY:**

**Step 1: Service Inventory**
List all services with clear hierarchy:
```
Home Remodeling Services
├── Kitchen Remodeling
│   ├── Full Kitchen Renovation
│   ├── Kitchen Cabinet Replacement
│   ├── Countertop Installation
│   └── Kitchen Island Installation
├── Bathroom Remodeling
│   ├── Full Bathroom Renovation
│   ├── Shower/Tub Replacement
│   ├── Vanity Installation
│   └── Tile Work
└── Other Services
```

**Step 2: Map Keywords by Funnel Stage**

For each service, identify keywords across all funnel stages:

**Example: Kitchen Remodeling**

```
AWARENESS (Informational):
- "kitchen remodeling ideas"
- "kitchen renovation cost"
- "modern kitchen designs"
- "kitchen remodel before and after"

CONSIDERATION (Comparison):
- "best kitchen remodeling contractors [city]"
- "kitchen renovation companies near me"
- "kitchen remodel reviews"
- "top rated kitchen contractors"

CONVERSION (Transactional):
- "kitchen remodeling contractor [city]"
- "hire kitchen remodeler"
- "kitchen renovation estimate"
- "book kitchen remodel consultation"
```

**Step 3: Create Keyword-to-Service Matrix**

| Service | Awareness Keywords (Info) | Consideration Keywords (Comparison) | Conversion Keywords (Transactional) | Asset Group | Campaign Priority |
|---------|--------------------------|-------------------------------------|-------------------------------------|-------------|-------------------|
| Kitchen Remodeling | kitchen ideas, kitchen costs | best kitchen contractors, reviews | kitchen contractor, hire kitchen remodeler | Kitchen - High Value | High |
| Bathroom Remodeling | bathroom ideas, bathroom costs | best bathroom contractors | bathroom contractor, hire bathroom remodeler | Bathroom - Medium Value | High |
| Cabinet Refacing | cabinet refacing ideas, refacing cost | best cabinet companies | cabinet refacing contractor, quote | Cabinets - Quick Jobs | Medium |

---

### 4.4 Geographic Modifier Strategy

**MULTI-LEVEL APPROACH:**

**Level 1: Primary Service Area (City)**
```
Service: Bathroom Remodeling
Primary Keywords:
- bathroom remodeling Boston
- Boston bathroom renovation
- bathroom contractor Boston MA
```

**Level 2: Secondary Markets (Nearby Cities)**
```
- bathroom remodeling Cambridge
- bathroom remodeling Brookline
- bathroom remodeling Newton
```

**Level 3: Neighborhood/Hyperlocal**
```
- bathroom remodeling Back Bay
- bathroom remodeling Beacon Hill
- bathroom remodeling South End
```

**Level 4: State (Broader Awareness)**
```
- bathroom remodeling Massachusetts
- Massachusetts bathroom contractors
```

**Level 5: "Near Me" / Generic**
```
- bathroom remodeling near me
- bathroom contractors nearby
- local bathroom renovation services
```

**IMPLEMENTATION:**

**Option A: Separate Ad Groups by Geography** (Better control)
```
Campaign: Bathroom Remodeling Services
├── Ad Group: Boston Core
├── Ad Group: Cambridge/Somerville
├── Ad Group: Brookline/Newton
└── Ad Group: Greater Metro Area
```

**Option B: Dynamic Location Insertion** (Scalability)
- Use location insertion in RSA headlines
- Single ad group with location-modified keywords
- Google automatically inserts user's location

---

### 4.5 Using Service Attributes for Better Targeting

**CUSTOM ATTRIBUTES FOR HOME SERVICES:**

**1. Project Size**
```
- Small: <$5,000 (Tile work, cabinet reface)
- Medium: $5,000-$25,000 (Single room remodel)
- Large: $25,000-$75,000 (Full kitchen/bathroom)
- Major: $75,000+ (Whole home, additions)
```

**Use:** Separate campaigns/asset groups, different ROAS targets

---

**2. Lead Time / Urgency**
```
- Emergency: Same day/24 hours
- Rush: 1 week
- Standard: 2-4 weeks
- Planning: 1-3 months out
```

**Use:** Bidding adjustments, messaging urgency

---

**3. License/Certification Required**
```
- General contractor
- Electrician
- Plumber
- HVAC
- Structural engineer
```

**Use:** Trust messaging in ads, filtering competitors

---

**4. Service Inclusion Level**
```
- Consultation Only
- Design Only
- Installation Only
- Design + Installation (Full Service)
- Design + Installation + Materials
```

**Use:** Ad messaging, price expectation setting

---

**5. Financing Available**
```
- Yes/No
- Minimum amount
- Interest rate/terms
```

**Use:** Call-out extensions, ad messaging for high-value projects

---

## 5. Campaign Measurement & Optimization

### 5.1 Key Metrics for Service-Based PMax Campaigns

**PRIMARY KPIS:**

**1. Conversions** (Most Important)
- Definition: Completed conversion actions (form fills, calls, bookings)
- Target: Service-dependent (aim for 30-50 per month minimum for optimization)
- Use: Primary optimization signal for Smart Bidding

**2. Conversion Value** (Critical for ROI)
- Definition: Total value of conversions based on assigned values
- Target: Matches business revenue goals
- Use: Target ROAS optimization, ROI calculation

**3. Return on Ad Spend (ROAS)**
- Formula: Conversion Value ÷ Ad Spend
- Target: 300-800% for home services (3x-8x)
- Use: Primary profitability metric

**4. Cost Per Conversion (CPA)**
- Formula: Ad Spend ÷ Conversions
- Target: <20% of average customer lifetime value
- Use: Efficiency metric, budget planning

---

**SECONDARY KPIS:**

**5. Click-Through Rate (CTR)**
- Indicates ad relevance and appeal
- Target: >3% for Search, >0.5% for Display
- Use: Creative effectiveness indicator

**6. Impression Share**
- Shows visibility opportunity capture
- Target: >70% for high-priority campaigns
- Use: Budget sufficiency indicator

**7. Conversion Rate**
- Formula: Conversions ÷ Clicks
- Target: 5-15% for service businesses
- Use: Landing page and offer effectiveness

---

**TERTIARY METRICS:**

**8. Cost Per Click (CPC)**
- Benchmark: $4.66 average for home services
- Use: Competitive landscape indicator

**9. Search Impression Share**
- Lost IS (Budget): Indicates need for budget increase
- Lost IS (Rank): Indicates need for bid increase or quality improvements

**10. Asset Performance Ratings**
- Google's "Good" to "Excellent" ratings
- Impact: Excellent ratings drive 6% more conversions vs. Good

---

### 5.2 Conversion Tracking Setup for Service Leads

**CRITICAL SUCCESS FACTOR:** Proper conversion tracking is the foundation of successful Performance Max campaigns.

**CONVERSION ACTIONS TO TRACK:**

**1. Primary Conversions (High Value)**
```
- Phone calls >60 seconds
- Contact form submissions (quote request)
- Consultation booking
- Live chat conversations (qualified)
```
**Assign Value:** Average project value or lifetime value

---

**2. Secondary Conversions (Medium Value)**
```
- Phone calls 30-60 seconds
- Newsletter signup
- Download guide/catalog
- View pricing page
```
**Assign Value:** Percentage of primary conversion value (20-30%)

---

**3. Micro-Conversions (Low Value - optional)**
```
- Time on site >3 minutes
- Pages per visit >5
- Video views >50%
- Portfolio page views
```
**Assign Value:** Small value (5-10% of primary) or don't include in bidding

---

**ENHANCED CONVERSIONS SETUP (Recommended):**

Enable Enhanced Conversions to send hashed customer data (email, phone, name) to Google for better tracking and optimization.

**Benefits:**
- Improves measurement accuracy (recovers lost conversions)
- Enables better optimization by Google's AI
- Bridges online-to-offline attribution

**Implementation:** Requires website tag modification or GTM setup

---

**OFFLINE CONVERSION TRACKING (Essential for Lead Gen):**

**THE CHALLENGE:** Google doesn't know if form fill or phone call became a qualified lead, consultation, or sale.

**THE SOLUTION:** Import offline conversion data from CRM.

**Process:**
1. Track initial conversion (form fill, call) with unique ID
2. CRM records lead status: Qualified, Disqualified, Meeting Set, Contract Signed
3. Upload offline conversions to Google Ads
4. Google uses this data to optimize for QUALITY leads, not just quantity

**CRM Integrations Available:**
- Salesforce
- HubSpot
- Zoho
- Custom API integration

**Configuration:**
```
Conversion Name: "Qualified Lead"
Conversion Value: $500
Upload Frequency: Daily or real-time
Matching: gclid (Google Click ID)
```

**Impact:** Dramatically improves lead quality by teaching Google what constitutes a valuable lead.

---

### 5.3 Asset Group Performance Analysis

**AVAILABLE METRICS (2024 Updates):**
- Asset-level conversion data
- Asset-level conversion value
- Asset performance ratings (Low, Good, Best)

**OPTIMIZATION PROCESS:**

**Step 1: Review Asset Ratings** (Monthly)
- Navigate to Asset Group > Assets tab
- Check performance ratings for headlines, descriptions, images, videos
- Replace "Low" rated assets
- Keep "Best" performers
- Test variations of "Good" performers

**Step 2: Analyze Conversion Data** (Bi-Weekly)
- Export asset-level performance data
- Identify assets with high conversion rates
- Identify assets with high conversion value
- Create variations of top performers

**Step 3: Refresh Creative** (Quarterly)
- Replace non-performing assets 4x per year
- Upload new images from recent projects
- Update headlines with current offers/messaging
- Create new video assets (or update auto-generated)

**Step 4: Ensure Asset Diversity**
- Maintain 15 headlines (minimum 5)
- Maintain 5 descriptions (minimum 2)
- Upload 15-20 images of various types
- Include at least 1 video (upload your own for brand consistency)

---

**ASSET GROUP COMPARISON:**

Compare performance across asset groups within same campaign:

| Asset Group | Conversions | Conv. Value | ROAS | CPA | Impression Share |
|-------------|-------------|-------------|------|-----|------------------|
| Kitchen High-End | 45 | $225,000 | 450% | $111 | 82% |
| Bathroom Full | 67 | $134,000 | 335% | $75 | 76% |
| Quick Jobs | 103 | $51,500 | 257% | $48 | 91% |

**Analysis:**
- Kitchen has highest ROAS but lowest volume - increase budget
- Quick Jobs has high volume but lower value - acceptable for scale
- Bathroom is performing well - maintain current strategy

---

### 5.4 A/B Testing Strategies

**TESTING METHODS IN 2024:**

**Method 1: Asset Testing for Retailers** (NEW - Feed-only campaigns)
- Control: Feed-only ads
- Treatment: Feed + additional creative assets
- Use: Limited to retail/product feed campaigns
- Benefit: In-campaign testing, no duplication

**Method 2: Campaign-Level Experiments**
- Create duplicate campaign with variations
- Google splits traffic automatically
- Test: Budget changes, bidding strategy, targeting
- Duration: Minimum 2 weeks, recommend 4-6 weeks

**Method 3: Multiple Asset Groups** (Most Practical)
- Create 2+ asset groups with different creative approaches
- Same audience signals, different messaging
- Example:
  - Asset Group A: Price/Value focused
  - Asset Group B: Quality/Experience focused
  - Asset Group C: Speed/Convenience focused
- Compare performance after 30 days

**Method 4: Sequential Testing**
- Swap assets every 2 weeks
- Compare pre/post performance
- Less scientific but practical for small accounts

---

**WHAT TO TEST:**

**Creative Variations:**
- Value propositions (price vs. quality vs. speed)
- Tone (professional vs. friendly vs. authoritative)
- Calls-to-action ("Free Quote" vs. "Free Consultation" vs. "Get Estimate")
- Imagery (people vs. before/after vs. product shots)

**Bidding Strategy:**
- tCPA vs. tROAS
- Different target values
- Maximize conversions vs. target strategies

**Audience Signals:**
- First-party only vs. first-party + in-market
- Different custom segment definitions
- Broad vs. narrow audience signals

**Geographic Targeting:**
- Radius sizes (15 miles vs. 25 miles vs. 50 miles)
- City-level vs. metro area
- Presence only vs. Presence or Interest

---

### 5.5 Optimization Checklist (Weekly/Monthly Tasks)

**WEEKLY TASKS:**

- [ ] Review Search Terms Report
- [ ] Add 5-10 negative keywords
- [ ] Check conversion tracking (verify fires correctly)
- [ ] Monitor daily spend vs. budget
- [ ] Review asset performance ratings
- [ ] Check for policy violations or disapprovals

**BI-WEEKLY TASKS:**

- [ ] Analyze asset group performance
- [ ] Compare actual ROAS vs. target
- [ ] Review geographic performance (add location bid adjustments)
- [ ] Check audience signal performance (limited data available)
- [ ] Update ad copy for any promotions/seasonality

**MONTHLY TASKS:**

- [ ] Comprehensive performance review (all KPIs)
- [ ] Replace low-performing assets
- [ ] Upload new creative (images from recent projects)
- [ ] Review and adjust budgets based on performance
- [ ] Check impression share and lost impression reasons
- [ ] Competitor analysis (auction insights)
- [ ] CRM data analysis (lead quality review)

**QUARTERLY TASKS:**

- [ ] Major creative refresh (new images, videos, headlines)
- [ ] Landing page updates
- [ ] Bidding strategy review (test alternative approaches)
- [ ] Campaign structure assessment (add/remove asset groups)
- [ ] Comprehensive negative keyword list audit
- [ ] Competitor landscape review
- [ ] Seasonal planning (next quarter budget and strategy)

---

### 5.6 Performance Max Reporting & Insights

**AVAILABLE REPORTS (2024):**

**1. Campaign Overview**
- Standard metrics: Impressions, Clicks, Conversions, Cost, ROAS

**2. Asset Group Report**
- Performance by asset group
- Compare asset groups within campaign

**3. Asset Performance Report** (NEW in 2024)
- Asset-level conversions and conversion value
- Performance ratings (Low, Good, Best)
- Most actionable report for optimization

**4. Search Terms Report** (LIMITED)
- Shows SOME search queries that triggered ads
- Not comprehensive like standard Search campaigns
- Still valuable for negative keyword identification

**5. Placement Report** (IMPROVED in 2024)
- Shows where ads appeared (Search, YouTube, Display, Discover, Gmail, Maps)
- Channel-level performance data
- Limited granularity compared to standard campaigns

**6. Audience Signals Report**
- Shows audience segments (very limited data)
- Cannot fully attribute performance to specific audiences
- Use as directional insight only

---

**KEY LIMITATIONS:**
- No Search Term-level bid adjustments
- No placement exclusions (except YouTube channels/videos)
- Limited audience performance visibility
- Cannot separate performance by network as granularly as standard campaigns

---

## 6. Recommended Campaign Architecture

### 6.1 Complete Campaign Structure for Multi-Service, Multi-Location Home Services Business

**SCENARIO:**
- Services: Kitchen Remodeling, Bathroom Remodeling, Basement Finishing, Custom Cabinets
- Locations: 3 cities in metro area
- Budget: $8,000/month
- Goals: Lead generation, emphasize high-value kitchen and bathroom projects

---

**RECOMMENDED STRUCTURE:**

### **CAMPAIGN 1: Performance Max - High Value Services**
**Budget:** $3,500/month ($115/day)
**Bidding:** Maximize Conversion Value with Target ROAS 350%
**Geographic Targeting:** 25-mile radius from all 3 office locations

**Asset Group 1: Kitchen Remodeling - Full Service**
- Focus: Complete kitchen renovations $25K-$75K
- Audience Signals:
  - Website visitors: Kitchen pages (90 days)
  - In-Market: Home Improvement Services > Kitchen Remodeling
  - Custom Segment: "kitchen renovation," "kitchen remodel," "new kitchen"
- Assets:
  - 15 headlines (mix of value props, location, CTAs)
  - 5 descriptions
  - 20 images (before/after, completed projects, design renderings)
  - 3-5 videos (project tours, customer testimonials)
- Assigned Conversion Value: $5,000 per lead

**Asset Group 2: Bathroom Remodeling - Full Service**
- Focus: Complete bathroom renovations $15K-$40K
- Audience Signals:
  - Website visitors: Bathroom pages (90 days)
  - In-Market: Home Improvement Services > Bathroom Remodeling
  - Custom Segment: "bathroom renovation," "bathroom remodel," "new bathroom"
- Assets: Similar structure to Kitchen (bathroom-specific content)
- Assigned Conversion Value: $2,500 per lead

**Asset Group 3: Basement Finishing**
- Focus: Basement remodeling $20K-$50K
- Audience Signals: Similar approach
- Assets: Basement-specific creative
- Assigned Conversion Value: $3,000 per lead

---

### **CAMPAIGN 2: Search - High Intent Keywords**
**Budget:** $2,500/month ($83/day)
**Bidding:** Maximize Conversion Value with Target ROAS 300%
**Geographic Targeting:** Same as PMax

**Ad Group 1: Kitchen Remodeling - Bottom Funnel**
Keywords (Broad Match):
- kitchen remodeling [city]
- kitchen renovation contractor
- hire kitchen remodeler
- kitchen remodel estimate
- custom kitchen design

RSA (3 ads):
- 15 headlines, 5 descriptions (kitchen-specific)
- Dynamic location insertion enabled
- Extensions: Sitelinks, callouts, structured snippets, location, call

**Ad Group 2: Bathroom Remodeling - Bottom Funnel**
Keywords (Broad Match):
- bathroom remodeling [city]
- bathroom renovation contractor
- hire bathroom remodeler
- bathroom remodel cost
- master bathroom renovation

RSA (3 ads): Similar structure, bathroom-specific

**Ad Group 3: General Home Remodeling**
Keywords (Broad Match):
- home remodeling [city]
- home renovation contractor
- house remodel
- home improvement contractor

RSA (3 ads): General remodeling messaging

**Ad Group 4: Emergency/Urgent (If applicable)**
Keywords (Phrase Match for control):
- "emergency home repair"
- "urgent renovation contractor"

RSA (2 ads): Emphasize fast response

---

### **CAMPAIGN 3: Performance Max - Quick Jobs & Smaller Projects**
**Budget:** $1,200/month ($40/day)
**Bidding:** Maximize Conversions with Target CPA $75
**Geographic Targeting:** Same

**Asset Group 1: Cabinet Services**
- Focus: Cabinet refacing, installation $3K-$15K
- Assigned Conversion Value: $500 per lead

**Asset Group 2: Countertops**
- Focus: Countertop installation $2K-$10K
- Assigned Conversion Value: $400 per lead

---

### **CAMPAIGN 4: Branded Search**
**Budget:** $300/month ($10/day)
**Bidding:** Maximize Clicks or Target Impression Share (top of page)
**Geographic Targeting:** Broader (state-wide)

**Ad Group 1: Brand Terms**
Keywords (Exact & Phrase):
- [company name]
- "[company name] remodeling"
- "[company name] reviews"
- "call [company name]"

RSA (2 ads):
- Focused on brand messaging, trust, reviews
- Direct response CTAs

---

### **CAMPAIGN 5: Display Remarketing** (Optional with remaining budget)
**Budget:** $500/month ($16/day)
**Type:** Standard Display (not Performance Max)
**Targeting:** Website visitors who didn't convert

**Ad Group 1: Recent Visitors**
- Audience: Website visitors past 30 days (exclude converters)
- Creative: Before/after images, special offers
- Frequency cap: 3 impressions per day

---

**TOTAL MONTHLY BUDGET:** $8,000

**Budget Allocation Summary:**
- Performance Max High Value: 44% ($3,500)
- Search High Intent: 31% ($2,500)
- Performance Max Quick Jobs: 15% ($1,200)
- Branded Search: 4% ($300)
- Display Remarketing: 6% ($500)

---

### 6.2 Alternative Structure: Location-Based Campaigns

**FOR:** Businesses with very distinct markets (different service areas, pricing, competition)

**STRUCTURE:**

### **CAMPAIGN 1: Boston Metro - All Services**
**Budget:** $3,000/month
**Asset Groups:** Kitchen, Bathroom, Basement (3 groups)
**Geographic:** Boston + immediate suburbs

### **CAMPAIGN 2: North Shore - All Services**
**Budget:** $2,500/month
**Asset Groups:** Kitchen, Bathroom, Basement (3 groups)
**Geographic:** North Shore region

### **CAMPAIGN 3: South Shore - All Services**
**Budget:** $2,500/month
**Asset Groups:** Kitchen, Bathroom, Basement (3 groups)
**Geographic:** South Shore region

**PROS:**
- Easier budget allocation by market
- Better geographic performance analysis
- Different ROAS targets by market
- Localized creative/messaging

**CONS:**
- More campaigns to manage
- Slower learning (split conversion data)
- Requires sufficient budget for each campaign

---

### 6.3 Simplified Structure for Smaller Budgets (<$2,000/month)

**FOR:** Businesses with limited budget needing maximum efficiency

**STRUCTURE:**

### **CAMPAIGN 1: Performance Max - All Services**
**Budget:** $1,200/month ($40/day)
**Bidding:** Maximize Conversions (no target initially)
**Asset Groups:** 2-3 focused on highest-value services only

### **CAMPAIGN 2: Search - High Intent Only**
**Budget:** $600/month ($20/day)
**Bidding:** Maximize Conversions
**Ad Groups:** 2-3 for highest-value services, bottom-funnel keywords only

### **CAMPAIGN 3: Branded Search**
**Budget:** $200/month ($7/day)
**Bidding:** Target Impression Share
**Ad Groups:** 1 ad group, brand terms only

**TOTAL:** $2,000/month

**STRATEGY:**
- Focus ONLY on bottom-funnel, high-intent
- Skip awareness/consideration stages
- Minimal asset groups to consolidate learning
- Emphasize highest-value services only
- Expand after proving ROI

---

## 7. Asset Group Templates

### 7.1 Kitchen Remodeling Asset Group Template

**ASSET GROUP NAME:** Kitchen Remodeling - Full Service

**TARGET AUDIENCE SIGNALS:**
- First-Party Data: Website visitors who viewed /kitchen-remodeling or /portfolio/kitchens (past 90 days)
- In-Market Audiences: Home Improvement Services > Kitchen Remodeling
- Custom Segments:
  - People who searched: "kitchen renovation," "kitchen remodel," "kitchen redesign," "new kitchen cabinets," "kitchen countertops"
  - People who browsed: houzz.com/photos/kitchen, pinterest.com/search/kitchen+ideas, homeadvisor.com/kitchen-remodeling
- Affinity Audiences: Home Improvement Enthusiasts

---

**HEADLINES (15):**

*Service + Location (3):*
1. Kitchen Remodeling in [City]
2. [City]'s Top Kitchen Renovation Experts
3. Transform Your [City] Kitchen Today

*Value Propositions (3):*
4. Free In-Home Design Consultation
5. Licensed & Insured Contractors
6. Award-Winning Kitchen Designs

*Benefits (3):*
7. Custom Kitchens in 4-6 Weeks
8. Increase Your Home Value 20%+
9. Quality Craftsmanship, Fair Prices

*Social Proof (3):*
10. 500+ Five-Star Reviews
11. Family Owned Since 1995
12. BBB A+ Rated Company

*CTAs (3):*
13. Get Free Quote Today
14. Book Your Free Design Consult
15. Request Project Estimate Now

---

**DESCRIPTIONS (5):**

1. **Full Service Description (90 chars)**
"Transform your kitchen with expert design, custom cabinets, countertops & more. Licensed contractors."

2. **Benefits + CTA (90 chars)**
"Free consultation. Quality materials. Fair pricing. Guaranteed satisfaction. Get your free quote today!"

3. **Trust + Social Proof (90 chars)**
"Family-owned since 1995. 500+ 5-star reviews. BBB A+ rated. Licensed & insured. Call us today!"

4. **Process + Timeline (90 chars)**
"Professional design. Expert installation. Projects completed in 4-6 weeks. Free in-home consultation."

5. **Local Focus (90 chars)**
"[City]'s trusted kitchen remodeling experts. Serving [Region] homeowners for 25+ years."

---

**IMAGES (15-20):**

*Before/After (4-6):*
- Kitchen transformations showing dramatic improvements
- Various styles (modern, traditional, transitional)
- Different budget levels

*Completed Projects (6-8):*
- Wide shots of finished kitchens
- Detail shots (cabinets, countertops, backsplash, islands)
- Various layouts (galley, L-shape, U-shape, open concept)

*Process/Team (2-3):*
- Team members measuring/consulting
- Installation work in progress (professional, clean job sites)
- Design consultation images

*Lifestyle/In-Use (2-3):*
- Families cooking/gathering in remodeled kitchens
- Dinner parties, morning coffee scenes
- Happy homeowners

**Image Specs:** 1200x628 minimum, 1.91:1 ratio preferred, high quality, no text overlay

---

**VIDEOS (3-5):**

1. **Project Tour Video (30-60 sec)**
   - Walkthrough of completed kitchen renovation
   - Highlight key features
   - Before glimpse at beginning

2. **Customer Testimonial (20-40 sec)**
   - Satisfied customer discussing experience
   - Show their finished kitchen
   - Emphasize quality, timeline, professionalism

3. **Process Overview (40-60 sec)**
   - Quick overview of steps: Consultation → Design → Build → Final Reveal
   - Time-lapse of project progress
   - Brand/contact info at end

4. **Before/After Transformation (15-30 sec)**
   - Side-by-side or transition effect
   - Multiple projects in quick succession
   - Upbeat music

5. **Brand/Company Video (30-45 sec)** (Optional)
   - Company introduction
   - Team, values, experience
   - Portfolio highlights

**Video Specs:** 16:9 landscape preferred, minimum 720p, upload high quality (Google may compress)

---

**FINAL URL:** https://example.com/kitchen-remodeling
**Display Path:** KitchenRemodeling, [City]Kitchen

---

### 7.2 Bathroom Remodeling Asset Group Template

**ASSET GROUP NAME:** Bathroom Remodeling - Full Service

**TARGET AUDIENCE SIGNALS:**
- First-Party Data: Website visitors who viewed /bathroom-remodeling or /portfolio/bathrooms (past 90 days)
- In-Market Audiences: Home Improvement Services > Bathroom Remodeling
- Custom Segments:
  - Searches: "bathroom renovation," "bathroom remodel," "master bathroom," "shower remodel," "tub replacement"
  - URLs: houzz.com/photos/bathroom, bathroomremodel.com, homeadvisor.com/bathroom
- Affinity: Home Improvement Enthusiasts

---

**HEADLINES (15):**

*Service + Location (3):*
1. Bathroom Remodeling in [City]
2. [City]'s Bathroom Renovation Experts
3. Beautiful New Bathrooms in [City]

*Value Propositions (3):*
4. Free Bathroom Design Consultation
5. Licensed Master Plumbers & Contractors
6. Custom Bathroom Designs

*Benefits (3):*
7. Bathrooms Completed in 2-4 Weeks
8. Quality Materials & Workmanship
9. Increase Home Value & Functionality

*Social Proof (3):*
10. 500+ Happy Homeowners
11. 25+ Years Bathroom Remodeling Experience
12. A+ BBB Rating, Fully Insured

*CTAs (3):*
13. Get Your Free Bathroom Quote
14. Book Free In-Home Consultation
15. Request Estimate in 24 Hours

---

**DESCRIPTIONS (5):**

1. "Expert bathroom remodeling: showers, tubs, vanities, tile & more. Professional design. Quality work. Free quote."

2. "Transform your bathroom in 2-4 weeks. Licensed contractors. Custom designs. Fair prices. Call today!"

3. "Family-owned. 25+ years experience. 500+ 5-star reviews. Licensed & insured. [City]'s trusted bathroom pros."

4. "Free design consultation. Expert installation. Quality materials. Guaranteed satisfaction. Get started today!"

5. "Master bathroom remodels, shower conversions, tub replacements & more. Serving [City] homeowners since 1995."

---

**IMAGES (15-20):**
- Before/After bathroom transformations (4-6)
- Completed bathrooms - various styles (6-8)
- Detail shots: tile work, vanities, showers, fixtures (4-6)
- Process/team images (2-3)

**VIDEOS (3-5):**
- Similar structure to kitchen template
- Bathroom-specific content

**FINAL URL:** https://example.com/bathroom-remodeling

---

### 7.3 Quick Jobs / Lower-Value Services Asset Group Template

**ASSET GROUP NAME:** Cabinet Refacing & Updates

**TARGET AUDIENCE SIGNALS:**
- Website visitors: /cabinet-refacing, /cabinet-painting (past 60 days)
- In-Market: Home Improvement
- Custom Segments: "cabinet refacing," "cabinet painting," "update kitchen cabinets," "refinish cabinets"

---

**HEADLINES (15):**

*Service + Location (3):*
1. Cabinet Refacing in [City]
2. Update Your Cabinets - [City]
3. [City] Cabinet Refinishing Experts

*Value Propositions (3):*
4. Fraction of Replacement Cost
5. Fast Installation - 1-2 Weeks
6. Free Cabinet Assessment

*Benefits (3):*
7. Transform Your Kitchen Affordably
8. Like-New Cabinets Without Replacement
9. Quality Materials, Expert Installation

*Social Proof (3):*
10. 1000+ Cabinets Refaced
11. Family Business Since 1995
12. Satisfaction Guaranteed

*CTAs (3):*
13. Get Free Cabinet Quote Today
14. Request Free In-Home Assessment
15. See Your New Cabinets in 2 Weeks

---

**DESCRIPTIONS (5):**

1. "Cabinet refacing & refinishing. Update your kitchen at a fraction of replacement cost. Quality materials. Fast install."

2. "Transform your cabinets in 1-2 weeks. Professional refacing. Custom colors & styles. Free quote today!"

3. "Expert cabinet refacing serving [City]. 1000+ satisfied customers. Licensed & insured. Free assessment!"

4. "Get the kitchen you want without major renovation. Cabinet refacing & updates. Call for free quote!"

5. "Custom cabinet refacing, painting & refinishing. Quality work. Fair prices. [City]'s cabinet experts!"

---

**IMAGES (15-20):**
- Before/After cabinets (6-8)
- Close-up detail shots of finishes (4-6)
- Color/style options (3-4)
- Process images (2-3)

**VIDEOS (2-3):**
- Quick transformation video (20-30 sec)
- Process overview (30-45 sec)
- Customer testimonial (20-30 sec)

**FINAL URL:** https://example.com/cabinet-refacing

---

### 7.4 Location-Specific Asset Group Template

**USE WHEN:** Running location-based asset groups within a campaign (vs. separate campaigns)

**ASSET GROUP NAME:** Kitchen Remodeling - Downtown Boston

**DIFFERENCE FROM SERVICE-BASED TEMPLATE:**
- More location-specific headlines and descriptions
- Images featuring projects from that specific area (if available)
- Audience signals include geographic custom segments
- May include neighborhood names in messaging

**HEADLINES - Location-Focused Examples:**
- "Kitchen Remodeling in Downtown Boston"
- "Serving Back Bay, Beacon Hill, South End"
- "Boston's Downtown Kitchen Experts"
- "Transform Your City Kitchen"
- "Urban Kitchen Renovation Specialists"

**DESCRIPTIONS:**
- "Expert kitchen remodeling for downtown Boston homes. Custom designs perfect for city living. Free consultation!"
- "Serving Back Bay, Beacon Hill, South End & downtown neighborhoods. Boston's trusted kitchen renovation experts!"

**Otherwise:** Use standard service-based template structure

---

## 8. Top 10 Actionable Insights

### **1. Always Run Performance Max + Search Together**
**DON'T:** Choose one or the other
**DO:** Run both simultaneously for full-funnel coverage

**Rationale:**
- PMax handles discovery, consideration, and broad reach across all Google channels
- Search captures high-intent, bottom-funnel traffic with precise keyword control
- Together they create complete funnel strategy
- 45% search term overlap is manageable with proper brand exclusions and negative keywords

**Action:** Allocate 40-50% budget to PMax, 30-40% to Search, 10-20% to branded/other

---

### **2. Broad Match + Smart Bidding Is Now the Default Strategy**
**DON'T:** Default to exact match or phrase match
**DO:** Use broad match keywords with Target CPA or Target ROAS bidding

**Rationale:**
- Google's data shows 35% more conversions vs. exact match
- AI understands search intent better than literal keyword matching
- Captures searches you didn't anticipate
- Required: Must use Smart Bidding (not Manual CPC)

**Action:**
- Audit current campaigns and upgrade 70-80% of keywords to broad match
- Ensure Smart Bidding is enabled (tCPA or tROAS)
- Monitor search terms weekly and add negatives aggressively

---

### **3. Create Service-Based Asset Groups, Not Generic Ones**
**DON'T:** Single asset group with all services combined
**DO:** Separate asset groups for each major service offering

**Rationale:**
- Different services require different creative and messaging
- Enables performance analysis by service
- Better audience-to-service alignment
- Google can optimize budget within campaign to best performers

**Action:**
- 3-6 asset groups per campaign (Kitchen, Bathroom, Basement, etc.)
- Each with service-specific creative and audience signals
- Start with 2-3 highest-value services, expand based on performance

---

### **4. Offline Conversion Tracking Is Non-Negotiable for Lead Gen**
**DON'T:** Only track form fills and calls
**DO:** Import CRM data showing qualified leads, consultations, and closed projects

**Rationale:**
- Google doesn't know difference between good and bad leads
- Without offline data, AI optimizes for quantity, not quality
- Teaching Google about lead quality dramatically improves results
- Lead-to-close data enables true ROI optimization

**Action:**
- Integrate CRM with Google Ads (Salesforce, HubSpot, or custom API)
- Create conversion action for "Qualified Lead" with appropriate value
- Upload daily or enable real-time sync
- Set primary conversion to qualified lead, not initial form fill

---

### **5. Exclude Your Brand from Generic Performance Max Campaigns**
**DON'T:** Let PMax cannibalize your branded traffic
**DO:** Add brand terms to negative keywords, create separate branded campaign if needed

**Rationale:**
- Branded traffic has different ROAS (typically much higher)
- PMax will prioritize best-performing terms (usually branded)
- Generic campaigns should focus on new customer acquisition
- Better budget allocation and performance analysis

**Action:**
- Add company name, common misspellings, and branded service terms to negative keyword list
- Create separate "Branded Search" campaign with exact/phrase match brand terms
- Set different ROAS target for branded campaign (usually much higher)

---

### **6. Start with 15 Headlines, 5 Descriptions, 20 Images Minimum**
**DON'T:** Use minimum required assets (3 headlines, 2 descriptions)
**DO:** Max out asset variety from day one

**Rationale:**
- More variety = more combinations for Google to test
- Asset ratings from "Good" to "Excellent" drive 6% more conversions
- Insufficient assets limit AI optimization
- Google auto-generates videos from images if you don't upload - bad for brand

**Action:**
- Create 15 headlines covering: location, value props, benefits, CTAs, social proof
- Write 5 descriptions with varied messaging
- Upload 15-20 high-quality images (before/after, projects, team, process)
- Upload 3-5 videos (project tours, testimonials, transformations)
- Refresh quarterly - replace low performers

---

### **7. Budget Minimums Matter: $50-100/Day Per Campaign**
**DON'T:** Spread thin budget across many campaigns
**DO:** Consolidate into fewer, well-funded campaigns

**Rationale:**
- AI needs data to learn (30-50 conversions minimum)
- Underfunded campaigns stay in perpetual learning mode
- Better to run 2 well-funded campaigns than 5 starved ones
- Performance Max especially requires sufficient budget for cross-channel optimization

**Action:**
- If total budget <$2,000/month: Run 1 PMax + 1 Search campaign max
- If budget $2,000-$5,000/month: Run 1-2 PMax + 1-2 Search campaigns
- If budget $5,000+/month: Can expand to multiple PMax campaigns by service or location
- Prioritize highest-value services if consolidating

---

### **8. Geographic Targeting: Be Precise or Waste Money**
**DON'T:** Target broadly hoping to catch everyone
**DO:** Define exact service area with radius or specific cities

**Rationale:**
- Ads to prospects outside service area = clicks that never convert
- Significant budget waste common with imprecise targeting
- Use "Presence" targeting (not "Interest") for local services
- Location extensions improve performance when precise targeting enabled

**Action:**
- Map exact service area (where you're willing to travel)
- Use radius targeting (e.g., 25 miles) OR specific city list
- Select "Presence" setting (not "Presence or Interest")
- Enable location extensions for Maps placement
- Review "Locations" report monthly, exclude poor performers

---

### **9. Negative Keywords Are Your AI Guardrails - Use 100s, Not 10s**
**DON'T:** Add a few obvious negatives and forget about it
**DO:** Build comprehensive negative keyword lists with 200-500+ terms

**Rationale:**
- Broad match + AI = more reach BUT also more irrelevant matches
- Negative keywords are primary control mechanism in AI campaigns
- March 2025 update allows 10,000 negatives in PMax (up from 100)
- Weekly review of search terms is essential practice

**Action:**
- Start with categorical negatives: DIY, jobs, wrong services, budget terms
- Review Search Terms Report weekly
- Add 5-10 negatives per week initially
- Build to 200-500 negatives over first 3 months
- Create account-level negative lists for universal exclusions
- Campaign-level negatives for service-specific exclusions

---

### **10. First 30 Days = Data Collection, Not Perfection**
**DON'T:** Panic and make major changes in week 1-2
**DO:** Let AI learn for 30 days with minimal interference

**Rationale:**
- Smart Bidding needs 30-50 conversions to optimize effectively
- Performance Max especially requires learning period
- Frequent changes reset learning
- Early performance not indicative of long-term results

**Action:**
- **Week 1-2:** Monitor only. Add obvious negative keywords. Fix technical issues only.
- **Week 3-4:** Light optimizations. Add negatives. Check conversion tracking works.
- **Week 5-8:** Begin real optimization. Adjust bids, refresh creative, analyze performance.
- **Month 3+:** Full optimization mode. Test aggressively, scale winners.

**Bidding Evolution:**
1. Start: Maximize Conversions (no target)
2. After 30-50 conversions: Add Target CPA or Target ROAS
3. After 100+ conversions: Tighten targets based on goals
4. Ongoing: Adjust targets quarterly based on business needs

---

## Appendix A: Additional Resources

### Google Official Documentation
- Performance Max Help Center: https://support.google.com/google-ads/answer/10724817
- Smart Bidding Guide: https://support.google.com/google-ads/answer/7065882
- Broad Match Guide: https://support.google.com/google-ads/answer/12159290
- Local Services Ads: https://support.google.com/localservices

### Industry Resources
- Search Engine Land (PPC News): https://searchengineland.com
- PPC Hero (Best Practices): https://ppchero.com
- WordStream Blog: https://www.wordstream.com/blog
- Google Ads Blog: https://blog.google/products/ads-commerce

### Key Google Updates (2024-2025)
- March 2025: PMax negative keywords expanded to 10,000
- January 2025: Asset testing for retailers launched
- Google Marketing Live 2024: AI-powered creative tools, asset-level reporting
- November 2024: LSA integration with Google Maps

---

## Appendix B: Glossary

**Asset Group:** Collection of creative assets (headlines, descriptions, images, videos) within a Performance Max campaign that share audience signals and settings.

**Audience Signals:** Suggestions provided to Performance Max about who might be interested in your services - NOT strict targeting.

**Broad Match:** Keyword match type that allows Google to show ads for related searches, including synonyms and related intent.

**Enhanced Conversions:** Feature that sends hashed customer data to Google for improved conversion tracking accuracy.

**Impression Share:** Percentage of impressions received vs. total eligible impressions.

**Offline Conversions:** Conversions that happen outside the website (phone calls, in-person consultations, closed deals) that are imported from CRM.

**Performance Max (PMax):** Automated campaign type that runs across all Google channels (Search, Display, YouTube, Discover, Gmail, Maps).

**ROAS:** Return on Ad Spend - ratio of conversion value to ad spend (e.g., 400% = $4 revenue per $1 spent).

**Smart Bidding:** Google's AI-powered automated bidding strategies (Target CPA, Target ROAS, Maximize Conversions, Maximize Conversion Value).

**Target CPA:** Smart Bidding strategy that optimizes to achieve specified cost per acquisition.

**Target ROAS:** Smart Bidding strategy that optimizes to achieve specified return on ad spend percentage.

---

## Report Summary

This comprehensive research report provides actionable strategies for structuring Google Ads campaigns for home services businesses in 2024-2025. The key recommendations emphasize:

1. **Dual Campaign Strategy:** Run Performance Max and Search campaigns together for full-funnel coverage
2. **AI-Powered Optimization:** Embrace broad match + Smart Bidding for maximum reach and efficiency
3. **Service-Based Structure:** Organize asset groups by service offering, not generic groupings
4. **Conversion Quality:** Implement offline conversion tracking to optimize for qualified leads, not just volume
5. **Creative Excellence:** Max out asset variety (15 headlines, 5 descriptions, 20 images, 3-5 videos)
6. **Budget Discipline:** Maintain $50-100/day minimum per campaign for effective AI learning
7. **Precise Targeting:** Define exact service areas to prevent wasted spend
8. **Negative Keyword Management:** Build comprehensive negative lists (200-500+ terms)
9. **Long-Term Approach:** Allow 30-day learning period before major optimizations

The report includes specific examples, templates, and benchmarks for bathroom remodeling, kitchen remodeling, and other home services. The recommended campaign architecture balances automation (Performance Max) with control (Search campaigns) while leveraging Google's AI capabilities for optimal performance.

Expected results based on industry data: 27% increase in conversions from Performance Max adoption, 35% more conversions from broad match + Smart Bidding, and 3x-8x ROAS for home services businesses following these best practices.

---

**Report prepared based on research conducted in October 2025, synthesizing current best practices from Google official documentation, industry leaders, and real-world case studies.**