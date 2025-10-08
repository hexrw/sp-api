# Package Decoupling & Automation Restructure Plan

## Current Status ✅
- ✅ models@0.4.0 published to npm
- ✅ SDK@0.3.1 published to npm (but depends on models@0.2.0 which doesn't exist)
- ⚠️ Packages currently using workspace:* (needs fixing)

## Critical Issue
**SDK is broken:** SDK@0.3.1 depends on `@selling-partner-api/models@^0.2.0` which doesn't exist on npm. Users cannot install the SDK!

---

## Architecture Goals

### 1. Complete Package Decoupling
- Remove all `workspace:*` references
- Treat packages as independent npm packages
- Each package publishes to npm independently
- SDK depends on published models from npm registry

### 2. Models Automation
**Trigger:** Changes detected in `vendor/selling-partner-api-models/{models,schemas}/**`

**Flow:**
1. Vendor changes detected (via GitHub Actions schedule or manual trigger)
2. Run build script (regenerate `merged.json` and `paths.ts`)
3. Create PR with changes
4. Run tests/validation
5. If tests pass → auto-merge
6. If tests fail → leave PR open for manual review
7. PR merge → triggers release-please
8. Release-please creates release PR
9. Release PR auto-merges (if enabled)
10. Release created → triggers publish-models workflow
11. Models published to npm

**New Workflow Needed:** `vendor-sync.yaml`

### 3. SDK Automation  
**Trigger:** Models package published to npm

**Flow:**
1. Models published (publish-models workflow completes)
2. Detect if breaking changes (APIs/endpoints removed)
3. Update SDK dependency to new models version
4. Create PR with conventional commit:
   - Breaking changes detected → `feat!: update models` or `BREAKING CHANGE:` in body
   - No breaking changes → `fix: update models dependency`
5. Run SDK tests
6. If tests pass → auto-merge
7. PR merge → triggers release-please  
8. Release-please creates release PR (with correct version bump based on commit)
9. Release PR auto-merges
10. Release created → triggers publish-sdk workflow
11. SDK published to npm

**New Workflow Needed:** `update-sdk-models.yaml` (enhanced version)

### 4. Breaking Change Detection
**Logic:**
- Compare old vs new models package
- Check if any paths/operations were removed from `paths.ts`
- If removed → breaking change
- If only additions/extensions → patch/minor

**Implementation:**
- Download previous models version
- Compare `paths.ts` exports
- Detect removals

---

## Immediate Actions

### Phase 1: Fix Broken SDK (URGENT)
1. ✅ Publish models@0.4.0
2. Change SDK dependency from `workspace:*` to `^0.4.0`
3. Remove `sync-models-dependency.ts` script (no longer needed)
4. Update SDK build process (remove sync step)
5. Publish SDK@0.3.2 with fixed dependency

### Phase 2: Restructure Workflows
1. Update `publish-sdk.yaml`:
   - Remove models dependency wait (or update to check for actual version)
   - Remove workspace dependency logic
2. Update `publish-models.yaml`:
   - Already has manual trigger ✅
3. Delete old `update-sdk-models-dependency.yaml` (outdated)
4. Create new `vendor-sync.yaml` for models updates
5. Create new `update-sdk-models.yaml` with breaking change detection

### Phase 3: Enable Full Automation
1. Set up vendor sync workflow (daily cron)
2. Test full cycle:
   - Vendor change → models update → PR → release → publish
   - Models publish → SDK update → PR → release → publish
3. Enable PR auto-merge for release PRs
4. Monitor first automated cycle

---

## File Changes Required

### `/packages/sdk/package.json`
```diff
- "@selling-partner-api/models": "workspace:*"
+ "@selling-partner-api/models": "^0.4.0"
```

### `/packages/sdk/package.json` (scripts)
```diff
- "build": "bun run clean && bun run generate:limits && bun run sync:models && tsc --project tsconfig.build.json"
+ "build": "bun run clean && bun run generate:limits && tsc --project tsconfig.build.json"
```

### Delete
- `/packages/sdk/scripts/sync-models-dependency.ts` (no longer needed)

### New Files
- `.github/workflows/vendor-sync.yaml` (monitor vendor changes)
- `.github/workflows/update-sdk-models.yaml` (update SDK when models changes)
- `.github/scripts/detect-breaking-changes.ts` (breaking change detection logic)

### Update
- `.github/workflows/publish-sdk.yaml` (remove models wait or fix version check)
- `.github/workflows/sync-models.yaml` (possibly merge into vendor-sync)

---

## Workflow Designs

### `vendor-sync.yaml`
```yaml
name: vendor-sync

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  check-and-update:
    runs-on: ubuntu-latest
    steps:
      - Checkout with submodules
      - Check if vendor models changed
      - If changed:
        - Run build script
        - Create PR
        - Enable auto-merge if tests pass
```

### `update-sdk-models.yaml`
```yaml
name: update-sdk-models

on:
  workflow_run:
    workflows: ["publish-models"]
    types: [completed]
  workflow_dispatch:
    inputs:
      models_version:
        required: true

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - Get new models version
      - Detect breaking changes
      - Update package.json
      - Create PR with appropriate commit message
      - Run tests
      - Enable auto-merge if tests pass
```

---

## Success Criteria

1. ✅ Both packages published independently to npm
2. ✅ No workspace:* references
3. ✅ SDK installable by users (`npm install @selling-partner-api/sdk`)
4. ✅ Vendor changes automatically trigger models updates
5. ✅ Models updates automatically trigger SDK updates
6. ✅ Breaking changes properly detected and versioned
7. ✅ Full automation without manual intervention
8. ✅ Failed validations pause automation (leave PR open)

---

## Next Steps

1. **IMMEDIATE:** Fix SDK dependency and publish 0.3.2
2. Create vendor-sync workflow
3. Enhanced update-sdk-models workflow with breaking change detection
4. Test full cycle end-to-end
5. Enable auto-merge for release PRs
6. Document the new architecture

---

## Risk Mitigation

- **Risk:** Vendor sync creates too many PRs
  - **Mitigation:** Only create PR if actual changes detected
  
- **Risk:** Breaking change detection fails
  - **Mitigation:** Default to minor version if detection fails, manual review PRs

- **Risk:** Auto-merge merges broken code
  - **Mitigation:** Comprehensive tests in CI, auto-merge only if tests pass

- **Risk:** Circular dependencies
  - **Mitigation:** Clear dependency direction: vendor → models → SDK (one-way)

---

**Status:** Ready to implement
**Priority:** HIGH - SDK is currently broken for users
