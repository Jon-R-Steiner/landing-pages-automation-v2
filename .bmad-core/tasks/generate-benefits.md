<!-- Powered by BMAD™ Core -->

# Generate Benefits List

## Purpose

Generate 5-7 benefit statements for a landing page, focusing on:
- **Customer Outcomes** - What the customer gains, not what the company does
- **Emotional + Rational** - Mix of emotional benefits and logical reasons
- **Differentiation** - What makes this company unique vs. competitors
- **Trust Building** - Concrete proof points and specifics

**Key Principle:** Benefits answer "What's in it for me?" from the customer's perspective.

---

## Input Requirements

**Context needed before generation:**
- **Service Name** - The specific service being offered
- **Location** - City and State for local relevance
- **Client Differentiators** - What makes this company unique
  - Years in business
  - Certifications/licenses
  - Ratings (BBB, Google, etc.)
  - Warranties/guarantees
  - Special processes or expertise
- **Target Audience** - Who is the ideal customer
- **Common Pain Points** - What problems does the service solve

**Optional Context:**
- Competitor analysis
- Customer testimonials (to extract common benefits)
- Client brand guidelines

---

## Benefits vs. Features (Critical Distinction)

### ❌ Features (Don't Focus Here)
- "We use high-quality materials"
- "Our team is certified"
- "We've been in business for 25 years"
- "We offer free estimates"

### ✅ Benefits (Focus Here)
- "Enjoy a bathroom that lasts 20+ years" *(outcome of quality materials)*
- "Rest easy knowing licensed experts handle every detail" *(peace of mind from certification)*
- "Trust a company that's proven itself with 25 years of local expertise" *(trust from experience)*
- "Get a no-pressure quote that helps you plan your budget" *(value of free estimates)*

**Formula:** Feature + "which means" + Customer Benefit = Good Benefit Statement

---

## Benefit Categories (Include Mix)

### 1. Quality/Results Benefits
- Durability ("Lasts 20+ years")
- Performance ("Reduces energy bills by 30%")
- Aesthetics ("Transform your space into a showpiece")

### 2. Trust/Safety Benefits
- Peace of mind ("Sleep well with our A+ BBB rating")
- Security ("Fully licensed, bonded, and insured")
- Proven track record ("Trusted by 5,000+ local homeowners")

### 3. Convenience/Experience Benefits
- Easy process ("From quote to completion in 2 weeks")
- No hassle ("We handle all permits and cleanup")
- Flexibility ("Schedule around your busy life")

### 4. Financial Benefits
- Cost savings ("Save 30% on energy bills")
- ROI ("Increase home value by $15,000+")
- Affordability ("Flexible financing available")

### 5. Exclusivity/Differentiation Benefits
- Unique process ("Our 7-point quality guarantee")
- Local expertise ("Austin's most experienced team")
- Special offer ("Limited-time warranty upgrade")

---

## Generation Guidelines

**Number of Benefits:** Generate 5-7 benefits (prefer 6 for grid layout)

**Benefit Structure:**
Each benefit should have 3 components:

1. **Title** (3-8 words) - The benefit headline
2. **Description** (15-30 words) - Explanation of the benefit
3. **Icon** (keyword) - Suggested icon category for UI

**Title Guidelines:**
- Action-oriented or outcome-focused
- Include numbers when possible (builds specificity)
- Use power words (guaranteed, proven, exclusive, trusted)
- Keep under 8 words

**Description Guidelines:**
- Explain the "why it matters" to the customer
- Include proof points (years, numbers, certifications)
- Use "you" language (customer-focused)
- Avoid jargon and technical terms

**Icon Categories:**
Choose from: `star`, `shield`, `checkmark`, `clock`, `dollar`, `award`, `thumbs-up`, `heart`, `home`, `tool`, `certificate`, `badge`

---

## Example Good Benefits

**Context:** Bathroom Remodeling | Austin, TX | 25 years experience | A+ BBB | Lifetime warranty

```json
[
  {
    "title": "25+ Years of Austin Expertise",
    "description": "Trust a local company that's transformed over 5,000 bathrooms across Austin. We know Texas building codes inside and out.",
    "icon": "award"
  },
  {
    "title": "Lifetime Workmanship Warranty",
    "description": "Sleep easy knowing your investment is protected forever. If our workmanship fails, we fix it free - no questions asked.",
    "icon": "shield"
  },
  {
    "title": "2-Week Average Completion",
    "description": "Get back to your routine fast. Most bathroom remodels are completed in just 2-4 weeks with minimal disruption to your home.",
    "icon": "clock"
  },
  {
    "title": "A+ BBB Rating You Can Trust",
    "description": "We've earned the highest rating from the Better Business Bureau through consistent quality and customer service. Your satisfaction is guaranteed.",
    "icon": "certificate"
  },
  {
    "title": "Licensed & Fully Insured",
    "description": "Protect your home and family. Every technician is licensed, background-checked, and covered by comprehensive insurance.",
    "icon": "checkmark"
  },
  {
    "title": "No-Pressure Free Quotes",
    "description": "Get a detailed, itemized quote with no obligation. We'll help you understand your options and plan your budget - without the sales pressure.",
    "icon": "dollar"
  }
]
```

---

## Example Bad Benefits (Avoid These)

### ❌ Too Vague
```json
{
  "title": "Quality Service",
  "description": "We provide excellent service to all our customers.",
  "icon": "star"
}
```
*No specifics, no proof, no differentiation*

### ❌ Feature-Focused
```json
{
  "title": "Latest Tools and Equipment",
  "description": "We use the newest tools available on the market.",
  "icon": "tool"
}
```
*Focuses on what company has, not what customer gets*

### ❌ Too Generic
```json
{
  "title": "Customer Satisfaction Guaranteed",
  "description": "We guarantee you'll be satisfied with our work.",
  "icon": "thumbs-up"
}
```
*Every company says this - no differentiation or specifics*

---

## JSON Output Format

**Required Structure:**
```json
[
  {
    "title": "Benefit title here",
    "description": "Benefit description here.",
    "icon": "icon-keyword"
  },
  {
    "title": "Next benefit",
    "description": "Next description.",
    "icon": "icon-keyword"
  }
  // ... 5-7 total
]
```

**Field Requirements:**
- `title` - 3-8 words, outcome or action-focused
- `description` - 15-30 words, customer-focused explanation
- `icon` - One of the approved icon keywords
- Array must contain 5-7 benefit objects
- Must be valid JSON

---

## Validation Checklist

Before finalizing, verify:

**Content Quality:**
- [ ] 5-7 benefits included
- [ ] Benefits are customer-focused (not company-focused)
- [ ] Mix of benefit categories (quality, trust, convenience, financial)
- [ ] Specific numbers and proof points included
- [ ] No generic claims ("best", "quality" without specifics)
- [ ] Each benefit is differentiated (not repetitive)

**Format:**
- [ ] Valid JSON syntax
- [ ] All titles 3-8 words
- [ ] All descriptions 15-30 words
- [ ] All icons from approved list
- [ ] No placeholder text

**Differentiation Test:**
- [ ] At least 3 benefits are unique to this company (not generic)
- [ ] Benefits leverage specific client data (years, ratings, warranties)
- [ ] Clear reason why customer should choose this company

---

## SEO Considerations

**Subtle Keyword Integration:**
- Include service name in 1-2 benefit descriptions
- Include location in 0-1 benefit descriptions
- Don't force keywords - prioritize natural, compelling copy

**Example:**
```json
{
  "title": "Austin's Most Experienced Team",
  "description": "Over 25 years remodeling bathrooms throughout Austin. We understand local codes, climate challenges, and homeowner needs.",
  "icon": "award"
}
```
*Includes "Austin" and "bathrooms" naturally*

---

## Task Execution Steps

When executing this task as Content Writer agent:

1. **Gather Context:**
   - Load page data from Airtable
   - Extract client differentiators (years, ratings, warranties, etc.)
   - Identify service pain points and desired outcomes

2. **Select Benefit Categories:**
   - Choose 5-7 categories from the list above
   - Ensure variety (not all trust benefits, for example)
   - Prioritize categories that leverage client strengths

3. **Generate Benefits:**
   - Write titles that are outcome-focused
   - Write descriptions that explain "why it matters"
   - Select appropriate icon for each
   - Include specific numbers and proof points

4. **Convert Features to Benefits:**
   - For each client differentiator, ask "What does the customer gain?"
   - Transform facts into emotional + rational benefits
   - Add specificity and proof

5. **Format as JSON:**
   - Use exact JSON structure above
   - Validate JSON syntax
   - Ensure no placeholder text

6. **Validate:**
   - Run through validation checklist
   - Ensure differentiation (not generic)
   - Verify customer-focused language

7. **Output:**
   - Display formatted JSON
   - Provide summary of benefit categories covered
   - Note key differentiators leveraged

---

## Related Files

- **Agent:** `.bmad-core/agents/copywriter.md`
- **Guidelines:** `.bmad-core/data/content-generation-guidelines.md`
- **Master Workflow:** `.bmad-core/tasks/generate-landing-page-content.md`
- **Validation Template:** `.bmad-core/templates/content-validation-checklist-tmpl.yaml`

---

**END OF TASK**
