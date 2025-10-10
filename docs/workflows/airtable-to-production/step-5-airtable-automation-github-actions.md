# STEP 5: Airtable Automation → GitHub Actions

## Airtable Automation Configuration

```yaml
Automation Name: "Trigger Export on Approval"

Trigger:
  When: Record matches conditions
  Conditions:
    - Status = "Approved"
    - Table: Pages

Actions:
  1. Find Records (verify client is active)
  2. Send Webhook

     Method: POST
     URL: https://api.github.com/repos/{owner}/{repo}/dispatches

     Headers:
       Authorization: Bearer {GITHUB_PAT}
       Accept: application/vnd.github.v3+json
       Content-Type: application/json

     Body:
       {
         "event_type": "airtable_export",
         "client_payload": {
           "trigger": "page_approved",
           "page_id": "{Page ID}",
           "service": "{Service}",
           "location": "{Location}",
           "timestamp": "{Last Modified}"
         }
       }
```

**Setup Requirements:**
1. Create GitHub Personal Access Token (PAT) with `repo` scope
2. Store PAT in Airtable automation secrets
3. Replace `{owner}/{repo}` with your GitHub username and repository name

---
