# GitHub Actions Workflows

## Airtable Export Workflow

**File:** `airtable-export.yml`

### Purpose

Automatically exports approved pages from Airtable to `content.json`, commits the file to the repository, and triggers Netlify deployment.

### How It Works

```
Airtable "Approved" View → GitHub Action → Export to content.json → Commit → Push → Netlify Build
```

### Triggers

1. **Manual Trigger** (workflow_dispatch)
   - Go to: GitHub repo → Actions tab → "Export Airtable to content.json"
   - Click "Run workflow"
   - Select branch (usually `master`)
   - Click "Run workflow" button

2. **Airtable Webhook** (repository_dispatch) - *Future enhancement*
   - Configure Airtable automation to send webhook when page is approved
   - Webhook triggers this workflow automatically

### Required GitHub Secrets

Configure these in: **GitHub repo → Settings → Secrets and variables → Actions**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AIRTABLE_API_KEY` | Personal access token from Airtable | `patXXXXXXXXXXXXXX` |
| `AIRTABLE_BASE_ID` | Base ID from Airtable URL | `appATvatPtaoJ8MmS` |

**To get Airtable API key:**
1. Go to https://airtable.com/create/tokens
2. Create new token with scope: `data.records:read` for your base
3. Copy the token (starts with `pat`)

**To get Base ID:**
1. Open your Airtable base
2. Check the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. Copy the `appXXXXXXXXXXXXXX` part

### Workflow Steps

1. **Checkout** - Clones the repository
2. **Setup Node.js** - Installs Node.js v22 with npm cache
3. **Install dependencies** - Runs `npm ci`
4. **Export Airtable data** - Runs `npm run export-airtable` with secrets
5. **Check for changes** - Detects if `content.json` was modified
6. **Commit and push** - If changed, commits and pushes to `master` branch
7. **Netlify auto-deploys** - Triggered by the push to master

### Testing the Workflow

**First-time setup:**

1. Add GitHub Secrets (see above)

2. Ensure Airtable has test data:
   - At least 1 page in "Approved" view
   - All required fields filled (Service, Location, SEO Title, SEO Description)

3. Trigger workflow manually:
   - Go to Actions tab → "Export Airtable to content.json" → "Run workflow"

4. Monitor execution:
   - Watch the workflow run in real-time
   - Check for errors in each step

5. Verify results:
   - Check that `content.json` was committed
   - Check Netlify deployment was triggered
   - Verify pages are live on production site

### Troubleshooting

**Workflow fails at "Export Airtable data"**
- Check GitHub Secrets are set correctly
- Verify Airtable API key has correct permissions
- Ensure Base ID is correct

**No changes detected**
- Verify Airtable "Approved" view has records
- Check export script logs for validation errors
- Ensure content.json format matches expected structure

**Commit fails**
- Check GitHub Actions has write permissions
- Verify branch protection rules allow bot commits

**Netlify doesn't deploy**
- Ensure Netlify auto-deploy is enabled for master branch
- Check Netlify build settings are correct

### Future Enhancements

1. **Airtable Webhook Integration**
   - Add webhook URL to Airtable automation
   - Configure webhook to send `repository_dispatch` event
   - Fully automated on approval

2. **Preview Deployments**
   - Create branch deploys for draft content
   - Review changes before merging to master

3. **Rollback Support**
   - Keep previous content.json versions
   - Easy rollback on bad deploys

### Related Documentation

- Export script: `scripts/export-airtable-to-json.ts`
- Workflow documentation: `docs/workflows/ongoing/approval-to-live/`
- Architecture decisions: `docs/architecture/`
- Project status: `docs/PROJECT-STATUS.md`
