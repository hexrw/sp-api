# CI/CD Architecture - Quick Reference

## Workflow Trigger Map

```
┌─────────────────────────────────────────────────────────────┐
│                    Event-Driven Workflows                    │
└─────────────────────────────────────────────────────────────┘

Push to main (code changes)
  ├─→ ci.yaml (if not docs-only)
  │   └─→ Run lint, build, test, update coverage badge
  │
  ├─→ deploy-docs.yaml (if docs changed)
  │   └─→ Build & deploy VitePress to GitHub Pages
  │
  └─→ release-please.yaml (if packages changed)
      └─→ Create/update release PRs

Pull Request opened/updated
  ├─→ ci.yaml (if not release PR)
  │   └─→ Run lint, build, test
  │
  ├─→ release-please-auto-merge.yaml (if release PR)
  │   └─→ Enable auto-merge
  │
  └─→ dependabot-auto-merge.yaml (if Dependabot PR)
      └─→ Auto-approve & merge security/patch updates

Release Published
  ├─→ publish-models.yaml (if @selling-partner-api/models@*)
  │   ├─→ Build & publish to npm + GitHub Packages
  │   └─→ Triggers: update-sdk-models-dependency.yaml
  │       └─→ Create PR to update SDK dependency
  │
  └─→ publish-sdk.yaml (if @selling-partner-api/sdk@*)
      ├─→ Wait for models dependency on npm
      ├─→ Run full test suite
      └─→ Build & publish to npm + GitHub Packages

Scheduled (Daily 5:00 AM UTC)
  └─→ sync-models.yaml
      ├─→ Update vendor/selling-partner-api-models
      ├─→ Rebuild models & SDK
      └─→ Create PR with changes
```

## Release Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     Models Release Flow                       │
└──────────────────────────────────────────────────────────────┘

Developer commits to packages/models/
  ↓
PR opened → ci.yaml runs
  ↓
PR merged to main
  ↓
release-please.yaml creates release PR
  ↓
Release PR merged (auto or manual)
  ↓
GitHub release created (@selling-partner-api/models@X.Y.Z)
  ↓
publish-models.yaml publishes package
  ↓
update-sdk-models-dependency.yaml creates PR
  ↓
[SDK Release Flow starts...]


┌──────────────────────────────────────────────────────────────┐
│                      SDK Release Flow                         │
└──────────────────────────────────────────────────────────────┘

Developer commits to packages/sdk/ (or dependency update PR)
  ↓
PR opened → ci.yaml runs
  ↓
PR merged to main
  ↓
release-please.yaml creates release PR
  ↓
Release PR merged (auto or manual)
  ↓
GitHub release created (@selling-partner-api/sdk@X.Y.Z)
  ↓
publish-sdk.yaml:
  ├─→ Waits for @selling-partner-api/models availability
  ├─→ Runs tests
  └─→ Publishes package
```

## Conflict Prevention Strategy

```
┌──────────────────────────────────────────────────────────────┐
│         How We Prevent Simultaneous Package Releases         │
└──────────────────────────────────────────────────────────────┘

✓ Separate Release PRs
  - release-please config: separate-pull-requests: true
  - Each package gets its own PR
  - PRs can be merged independently

✓ Dependency Updates via PR
  - Models release → Creates new PR for SDK
  - Not a direct commit to main
  - Goes through normal review cycle

✓ Sequential Publishing
  - SDK waits for models on npm before publishing
  - Max wait: 5 minutes (30 attempts × 10s)

✓ No Automatic Merge of Both
  - Even with auto-merge enabled
  - PRs are separate
  - One merges, triggers release
  - Second PR stays open until ready
```

## When Workflows Run

| Workflow | On Push | On PR | On Release | Scheduled | Manual |
|----------|---------|-------|------------|-----------|--------|
| ci.yaml | ✓ | ✓ | | | |
| deploy-docs.yaml | ✓ (docs) | | | | ✓ |
| release-please.yaml | ✓ (pkg) | | | | ✓ |
| release-please-auto-merge.yaml | | ✓ (bot) | | | |
| publish-models.yaml | | | ✓ (models) | | |
| publish-sdk.yaml | | | ✓ (sdk) | | |
| update-sdk-models-dependency.yaml | | | ✓ (models) | | |
| sync-models.yaml | | | | ✓ (daily) | ✓ |
| dependabot-auto-merge.yaml | | ✓ (bot) | | | |

## Key Features

### ✓ Full Automation
- Releases managed by conventional commits
- Auto-merge for release PRs
- Auto-updates for dependencies

### ✓ Quality Gates
- Lint & test before merge
- Full test suite before SDK publish
- Version validation on publish

### ✓ Smart Triggers
- Docs only deploy when docs change
- CI skips release PRs (they'll be tested on publish)
- Path-based filtering reduces unnecessary runs

### ✓ Dual Publishing
- Both packages → npm + GitHub Packages
- Provenance attestation enabled
- Public access configured

### ✓ Dependency Safety
- SDK waits for models availability
- Exact version matching validated
- Timeout protection (won't wait forever)

## Common Commands

```bash
# Trigger a release (commit to main with conventional commit)
git commit -m "feat: add new feature"

# Skip CI for docs-only changes
git commit -m "docs: update readme [skip ci]"

# Skip both CI and release
git commit -m "chore: update config [skip ci][skip release]"

# Manual release trigger
# GitHub UI → Actions → release-please → Run workflow

# Manual model sync
# GitHub UI → Actions → sync-models → Run workflow
```

## Monitoring

Watch these areas:
- GitHub Actions tab for workflow runs
- Release PRs for version bumps
- npm registry for published packages
- Coverage badge for test coverage trends

## Emergency Procedures

### Stop a bad release
1. Don't merge the release PR
2. Fix the issue in a new PR
3. Release PR will update automatically

### Revert a published package
```bash
# For npm (within 72 hours)
npm unpublish @selling-partner-api/sdk@X.Y.Z

# Better approach: Publish a new patch version with fix
```

### Manual publish if automation fails
```bash
# Not recommended, but possible:
# 1. Checkout the release tag
# 2. Build the package
# 3. npm publish manually
# See individual publish-*.yaml for exact steps
```
