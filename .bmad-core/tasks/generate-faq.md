<!-- Powered by BMAD™ Core -->

# Generate FAQ Section

## Purpose

Generate 5 FAQ (Frequently Asked Questions) Q&A pairs for a landing page, optimized for:
- **Local SEO** - Include location and service keywords naturally
- **Conversion** - Address objections and build trust
- **User Intent** - Answer real questions prospects have
- **Schema.org** - Structured format ready for FAQ schema markup

---

## Input Requirements

**Context needed before generation:**
- **Service Name** - The specific service (e.g., "Bathroom Remodeling")
- **Location** - City and State (e.g., "Austin, TX")
- **Service Type** - Category (e.g., "Home Improvement", "Professional Service")
- **Client Positioning** - Key differentiators (e.g., "25+ years", "A+ BBB rated")
- **Common Objections** - If known from client (e.g., "too expensive", "takes too long")

**Optional Context:**
- Existing FAQ examples from client
- Competitor FAQs
- Voice guidelines

---

## Generation Guidelines

### Question Types to Include (Select 5 from these categories)

1. **Cost/Pricing Questions** (Always include 1)
   - "How much does [service] cost in [location]?"
   - "Do you offer financing for [service]?"
   - "What factors affect the cost of [service]?"

2. **Timeline Questions** (Always include 1)
   - "How long does [service] take?"
   - "When can you start my [service] project?"
   - "How far in advance should I book [service]?"

3. **Qualification/Trust Questions** (Always include 1)
   - "Are you licensed and insured in [location]?"
   - "How long have you been providing [service]?"
   - "Do you offer warranties on [service]?"

4. **Process Questions**
   - "What's the process for [service]?"
   - "Do I need to prepare anything before [service]?"
   - "Will you handle permits for [service]?"

5. **Service Area Questions**
   - "Do you serve [specific neighborhood] in [city]?"
   - "How far outside [city] do you travel?"

6. **Quality/Results Questions**
   - "How long will my [service] last?"
   - "What materials do you use for [service]?"
   - "Can I see examples of your [service] work?"

---

## Answer Guidelines

**Answer Length:** 50-150 words per answer (2-4 sentences)

**Answer Structure:**
1. **Direct answer first** - Don't bury the lead
2. **Add specificity** - Include numbers, timelines, guarantees
3. **Build trust** - Reference experience, certifications, guarantees
4. **End with CTA** - Soft call-to-action when appropriate

**Example Good Answer:**
```
Q: How much does bathroom remodeling cost in Austin, TX?

A: Bathroom remodeling in Austin typically ranges from $8,000 to $25,000, depending on the size of your bathroom and the materials you choose. At [Company], we offer free in-home consultations to provide you with an accurate quote based on your specific needs and budget. We also offer flexible financing options to make your dream bathroom affordable. Contact us today for your free quote!
```

**Example Bad Answer (Don't do this):**
```
Q: What's your pricing?

A: Prices vary based on many factors. Every project is different. Contact us for a quote.
```
*Too vague, no specifics, no trust-building*

---

## SEO Optimization

**Include in Questions:**
- Service name (exact match from page)
- Location (City, State)
- Natural variations (e.g., "bathroom remodel" + "bathroom renovation")

**Include in Answers:**
- Company name 1-2 times
- Location references
- Service-specific keywords
- Trust signals (years, ratings, certifications)

**Example Optimized FAQ:**
```
Q: Are you licensed for bathroom remodeling in Austin, TX?

A: Yes, [Company Name] is fully licensed and insured for bathroom remodeling throughout Austin, Texas. We've been serving Austin homeowners for over 25 years and maintain an A+ rating with the Better Business Bureau. All of our work is performed by certified professionals and backed by our lifetime workmanship warranty. You can view our licenses and certifications on our website or request copies during your free consultation.
```
*Includes: service name, location, company name, trust signals, CTA*

---

## JSON Output Format

**Required Structure:**
```json
[
  {
    "question": "Question text here?",
    "answer": "Answer text here."
  },
  {
    "question": "Next question?",
    "answer": "Next answer."
  }
  // ... 5 total
]
```

**Field Requirements:**
- `question` - Must end with "?"
- `answer` - 50-150 words, ends with period
- Array must contain exactly 5 FAQ objects
- Must be valid JSON (use JSON validator)

---

## Validation Checklist

Before finalizing, verify:

**Content Quality:**
- [ ] 5 FAQs included
- [ ] Questions address real user concerns (not company-centric)
- [ ] Answers are specific and helpful (not vague)
- [ ] Service name mentioned in 3-4 questions/answers
- [ ] Location mentioned in 2-3 questions/answers
- [ ] Trust signals included (years, ratings, warranties)
- [ ] Soft CTAs in 2-3 answers

**Format:**
- [ ] Valid JSON syntax
- [ ] All questions end with "?"
- [ ] All answers 50-150 words
- [ ] No placeholder text (e.g., "[Company Name]")
- [ ] Proper capitalization and punctuation

**SEO:**
- [ ] Target keywords used naturally
- [ ] Location + service combinations present
- [ ] No keyword stuffing (reads naturally)
- [ ] Schema.org FAQPage ready

---

## Example Output

**Context:** Bathroom Remodeling in Austin, TX | Home Pro Services (25 years, A+ BBB)

**Generated FAQs:**
```json
[
  {
    "question": "How much does bathroom remodeling cost in Austin, TX?",
    "answer": "Bathroom remodeling in Austin typically ranges from $8,000 to $25,000, depending on your bathroom size, materials, and scope of work. At Home Pro Services, we provide free in-home consultations to give you an accurate quote based on your specific needs and budget. We also offer flexible financing options to help make your dream bathroom affordable. Contact us today to schedule your free consultation!"
  },
  {
    "question": "How long does a bathroom remodel take?",
    "answer": "Most bathroom remodels take between 2-4 weeks to complete, though larger or more complex projects may take longer. The timeline depends on factors like the size of your bathroom, the extent of plumbing or electrical work needed, and material availability. At Home Pro Services, we provide a detailed project timeline during your consultation and keep you informed throughout the process to minimize disruption to your daily routine."
  },
  {
    "question": "Are you licensed and insured for bathroom remodeling in Austin?",
    "answer": "Yes, Home Pro Services is fully licensed and insured for bathroom remodeling throughout Austin, Texas. We've been serving Austin homeowners for over 25 years and maintain an A+ rating with the Better Business Bureau. All of our work is performed by certified professionals and backed by our lifetime workmanship warranty. You can request to see our licenses and insurance certificates during your free consultation."
  },
  {
    "question": "Do you offer warranties on bathroom remodeling work?",
    "answer": "Absolutely! Home Pro Services offers a lifetime workmanship warranty on all bathroom remodeling projects in Austin. This means if any issues arise due to our installation or workmanship, we'll fix it at no cost to you. Additionally, all materials and fixtures come with manufacturer warranties, which we'll review with you during material selection. Your satisfaction and peace of mind are our top priorities."
  },
  {
    "question": "What areas of Austin do you serve for bathroom remodeling?",
    "answer": "Home Pro Services proudly serves all of Austin, TX and surrounding areas including Round Rock, Cedar Park, Georgetown, Pflugerville, and Lakeway. We've been remodeling bathrooms throughout the greater Austin area for over 25 years. If you're unsure whether we serve your neighborhood, give us a call - we're happy to discuss your project and confirm our service area."
  }
]
```

---

## Task Execution Steps

When executing this task as Content Writer agent:

1. **Gather Context:**
   - Load page data from Airtable (service, location, client)
   - Review content generation guidelines
   - Check for existing client FAQ examples

2. **Select Question Types:**
   - Choose 5 question types from the categories above
   - Ensure mix of cost, timeline, trust, and process
   - Prioritize questions that address common objections

3. **Generate Content:**
   - Write questions naturally (how users would ask)
   - Write answers with specifics and trust signals
   - Include company name, location, and service keywords
   - Add soft CTAs to 2-3 answers

4. **Format as JSON:**
   - Use exact JSON structure above
   - Validate JSON syntax (use validator)
   - Ensure no placeholder text remains

5. **Validate:**
   - Run through validation checklist
   - Check SEO optimization
   - Verify answer lengths (50-150 words)

6. **Output:**
   - Display formatted JSON
   - Provide summary of coverage (cost, timeline, trust, etc.)
   - Note any assumptions made

---

## Related Files

- **Agent:** `.bmad-core/agents/copywriter.md`
- **Guidelines:** `.bmad-core/data/content-generation-guidelines.md`
- **Master Workflow:** `.bmad-core/tasks/generate-landing-page-content.md`
- **Validation Template:** `.bmad-core/templates/content-validation-checklist-tmpl.yaml`

---

**END OF TASK**
