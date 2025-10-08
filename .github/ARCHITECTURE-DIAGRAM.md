# Automation Architecture Diagram

## Complete End-to-End Flow

```
╔════════════════════════════════════════════════════════════════════════╗
║                         VENDOR SYNC WORKFLOW                           ║
║                      (Daily at 2 AM UTC)                               ║
╚════════════════════════════════════════════════════════════════════════╝
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │   Update Vendor Submodule   │
                    │ vendor/selling-partner-api- │
                    │         models              │
                    └─────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  Check for Changes in:      │
                    │  - models/                  │
                    │  - schemas/                 │
                    └─────────────────────────────┘
                                  │
                        ┌─────────┴─────────┐
                        │                   │
                  No Changes          Changes Found
                        │                   │
                        ▼                   ▼
                    ┌───────┐    ┌─────────────────────────┐
                    │ Skip  │    │ Rebuild Models Package  │
                    └───────┘    │  - merged.json          │
                                 │  - paths.ts             │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Create PR:              │
                                 │ "chore(models): sync    │
                                 │   vendor models"        │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ CI Tests Run            │
                                 └─────────────────────────┘
                                             │
                                    ✅ Tests Pass
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Auto-Merge PR           │
                                 └─────────────────────────┘
                                             │
╔════════════════════════════════════════════════════════════════════════╗
║                      RELEASE-PLEASE WORKFLOW                           ║
╚════════════════════════════════════════════════════════════════════════╝
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Analyze Commits         │
                                 │ - chore → patch         │
                                 │ - fix → patch           │
                                 │ - feat → minor          │
                                 │ - feat! → major         │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Create Release PR:      │
                                 │ "chore(models): release │
                                 │    X.Y.Z"               │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Auto-Merge Release PR   │
                                 └─────────────────────────┘
                                             │
╔════════════════════════════════════════════════════════════════════════╗
║                       PUBLISH MODELS WORKFLOW                          ║
╚════════════════════════════════════════════════════════════════════════╝
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Build & Test            │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Publish to npm:         │
                                 │ @selling-partner-api/   │
                                 │   models@X.Y.Z          │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Publish to GitHub       │
                                 │ Packages                │
                                 └─────────────────────────┘
                                             │
╔════════════════════════════════════════════════════════════════════════╗
║                    SDK AUTO-UPDATE WORKFLOW                            ║
╚════════════════════════════════════════════════════════════════════════╝
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Detect Models Release   │
                                 │ (via tag)               │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Install Old Version     │
                                 │ (from npm)              │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Install New Version     │
                                 │ (from npm)              │
                                 └─────────────────────────┘
                                             │
                                             ▼
                                 ┌─────────────────────────┐
                                 │ Compare paths:          │
                                 │ - Check for removals    │
                                 │ - Detect breaking       │
                                 │   changes               │
                                 └─────────────────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        │                                         │
                  Breaking Found                          No Breaking
                        │                                         │
                        ▼                                         ▼
            ┌───────────────────────┐             ┌─────────────────────────┐
            │ Commit: feat(sdk)!:   │             │ Check Version Type:     │
            │ (Major bump)          │             │ - Major/Minor → feat:   │
            └───────────────────────┘             │ - Patch → fix:          │
                        │                         └─────────────────────────┘
                        │                                         │
                        └────────────────┬────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Update package.json     │
                             │ dependency              │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Create PR               │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Run SDK Tests           │
                             └─────────────────────────┘
                                         │
                                ✅ Tests Pass
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Auto-Merge PR           │
                             └─────────────────────────┘
                                         │
╔════════════════════════════════════════════════════════════════════════╗
║                      RELEASE-PLEASE WORKFLOW                           ║
║                          (SDK Release)                                 ║
╚════════════════════════════════════════════════════════════════════════╝
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Create SDK Release PR   │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Auto-Merge Release PR   │
                             └─────────────────────────┘
                                         │
╔════════════════════════════════════════════════════════════════════════╗
║                        PUBLISH SDK WORKFLOW                            ║
╚════════════════════════════════════════════════════════════════════════╝
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Build & Test            │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Publish to npm:         │
                             │ @selling-partner-api/   │
                             │   sdk@X.Y.Z             │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ┌─────────────────────────┐
                             │ Publish to GitHub       │
                             │ Packages                │
                             └─────────────────────────┘
                                         │
                                         ▼
                             ╔═════════════════════════╗
                             ║    🎉 COMPLETE! 🎉      ║
                             ║                         ║
                             ║ Both packages updated   ║
                             ║ and published to npm!   ║
                             ╚═════════════════════════╝
```

## Timeline Example

**Day 1 - 2:00 AM UTC:**
```
02:00 - vendor-sync.yaml runs
02:01 - Vendor submodule updated (commit abc123)
02:02 - Models rebuilt (merged.json, paths.ts changed)
02:03 - PR created: "chore(models): sync vendor models"
02:04 - CI starts (lint, build, test)
02:06 - CI passes ✅
02:06 - PR auto-merges
```

**Day 1 - 2:10 AM UTC:**
```
02:10 - release-please.yaml triggers
02:11 - Analyzes commits: 1 chore commit found
02:12 - Creates PR: "chore(models): release 0.4.1"
02:13 - Auto-merge enabled
02:13 - PR auto-merges (no CI on release PRs)
```

**Day 1 - 2:15 AM UTC:**
```
02:15 - publish-models.yaml triggers (tag: models-v0.4.1)
02:16 - Builds models package
02:17 - Tests pass ✅
02:18 - Publishes to npm: @selling-partner-api/models@0.4.1
02:19 - Publishes to GitHub Packages
```

**Day 1 - 2:20 AM UTC:**
```
02:20 - update-sdk-on-models-release.yaml triggers
02:21 - Installs models@0.4.0 (current)
02:22 - Installs models@0.4.1 (new)
02:23 - Compares paths: no removals found ✅
02:24 - Determines commit type: fix (patch update)
02:25 - Updates SDK package.json: models@^0.4.1
02:26 - Creates PR: "fix(sdk): update models to 0.4.1"
02:27 - SDK tests run
02:29 - Tests pass ✅
02:29 - PR auto-merges
```

**Day 1 - 2:35 AM UTC:**
```
02:35 - release-please.yaml triggers
02:36 - Analyzes commits: 1 fix commit found
02:37 - Creates PR: "chore(sdk): release 1.0.1"
02:38 - Auto-merge enabled
02:38 - PR auto-merges
```

**Day 1 - 2:40 AM UTC:**
```
02:40 - publish-sdk.yaml triggers (tag: sdk-v1.0.1)
02:41 - Builds SDK package
02:43 - Tests pass ✅
02:44 - Publishes to npm: @selling-partner-api/sdk@1.0.1
02:45 - Publishes to GitHub Packages
02:46 - ✅ COMPLETE! Both packages updated and published!
```

**Total Time:** ~46 minutes from vendor sync to final publish
**Manual Intervention:** 0 steps
**Human Involvement:** Review commits the next morning ☕

## Workflow Dependencies

```
vendor-sync.yaml
    │
    ├─> Creates commit → Triggers release-please.yaml
    │
    └─> release-please.yaml
            │
            └─> Creates tag → Triggers publish-models.yaml
                    │
                    └─> Publishes to npm → Triggers update-sdk-on-models-release.yaml
                            │
                            └─> Creates commit → Triggers release-please.yaml
                                    │
                                    └─> Creates tag → Triggers publish-sdk.yaml
                                            │
                                            └─> Publishes to npm
                                                    │
                                                    └─> ✅ Done!
```

## Breaking Change Flow

**Scenario:** Amazon removes an API endpoint

```
Day 1, 2:00 AM - Vendor Sync
    │
    ├─> API endpoint removed in vendor/selling-partner-api-models
    │
    └─> Models rebuilt (paths.ts no longer includes removed endpoint)
            │
            └─> PR created → Auto-merged
                    │
                    └─> Models published: 0.4.1 → 0.5.0 (minor bump, no breaking)
                            │
                            └─> SDK auto-update runs
                                    │
                                    ├─> Breaking change detected! ⚠️
                                    │   (path '/orders/v0/orders' removed)
                                    │
                                    └─> Creates PR: "feat(sdk)!: update models to 0.5.0"
                                            │
                                            └─> BREAKING CHANGE footer added
                                                    │
                                                    └─> Auto-merged
                                                            │
                                                            └─> SDK released: 1.0.1 → 2.0.0 (major bump!)
                                                                    │
                                                                    └─> Users see clear breaking change in CHANGELOG
```

## Manual Override Points

Every workflow has manual trigger capability:

```
Manual Triggers Available:
├─ vendor-sync.yaml ─────────→ gh workflow run vendor-sync.yaml
├─ publish-models.yaml ──────→ gh workflow run publish-models.yaml -f tag=models-v0.5.0
├─ publish-sdk.yaml ─────────→ gh workflow run publish-sdk.yaml -f tag=sdk-v2.0.0
└─ update-sdk-on-models-release.yaml → gh workflow run update-sdk-on-models-release.yaml -f models_version=0.5.0
```

## Monitoring Dashboard (CLI)

```bash
# Today's automation status
gh run list --created "$(date +%Y-%m-%d)" --limit 20

# Vendor sync history
gh run list --workflow=vendor-sync.yaml --limit 5

# Recent releases
gh release list --limit 10

# Current package versions
npm view @selling-partner-api/models version
npm view @selling-partner-api/sdk version

# Open PRs (should be mostly empty if auto-merge works!)
gh pr list
```

---

**Created:** $(date)
**Status:** ✅ PRODUCTION READY
**Automation Level:** 100% (zero manual steps for regular updates)
