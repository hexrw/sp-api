# CI/CD Workflows

This document describes the automated workflows for the selling-partner-api monorepo.

## Overview

The repository uses a sophisticated CI/CD pipeline that handles:
- Automated testing and linting
- Documentation deployment
- Independent package releases (models and SDK)
- Automated dependency updates
- Upstream API model synchronization

## Workflows

### 1. Continuous Integration (`ci.yaml`)

**Triggers:**
- Push to `main` branch (excluding docs and markdown files)
- Pull requests (excluding docs and markdown files)

**Skips:**
- Release-please PRs (labeled with `release: pending`)

**Actions:**
1. Install dependencies with Bun
2. Run linting (`bun run lint`)
3. Build all packages (`bun run build`)
4. Run tests with coverage (`bunx vitest run --coverage`)
5. On main branch: Update and commit coverage badge

**Purpose:** Ensures all code changes pass quality checks before merging.

---

### 2. Documentation Deployment (`deploy-docs.yaml`)

**Triggers:**
- Push to `main` branch that affects:
  - `docs/**` files
  - `.github/workflows/deploy-docs.yaml`
- Manual workflow dispatch

**Actions:**
1. Build VitePress documentation
2. Deploy to GitHub Pages

**Purpose:** Keeps documentation up-to-date automatically, only rebuilding when docs actually change.

---

### 3. Release Please (`release-please.yaml`)

**Triggers:**
- Push to `main` branch that affects:
  - `packages/models/**`
  - `packages/sdk/**`
  - Release configuration files
- Manual workflow dispatch

**Actions:**
1. Creates/updates separate release PRs for each package
2. Manages version bumps based on conventional commits
3. Generates CHANGELOGs
4. Tags releases when PRs are merged

**Configuration:**
- Separate PRs for models and SDK (`separate-pull-requests: true`)
- Component-specific tags (e.g., `@selling-partner-api/models@1.0.0`)
- PRs labeled with `release: pending`

**Purpose:** Automates semantic versioning and release management for both packages independently.

---

### 4. Release Please Auto-Merge (`release-please-auto-merge.yaml`)

**Triggers:**
- Pull request events (opened, labeled, reopened, etc.)

**Conditions:**
- PR author is `github-actions[bot]`
- PR has `release: pending` label

**Actions:**
- Enables auto-merge with squash method

**Purpose:** Automatically merges release PRs when ready, streamlining the release process.

---

### 5. Publish Models (`publish-models.yaml`)

**Triggers:**
- Release published event for tags starting with `@selling-partner-api/models@`

**Actions:**
1. Checkout code at the release tag
2. Install dependencies with Bun
3. Build models package
4. Validate version matches tag
5. Publish to npm registry
6. Publish to GitHub Packages

**Secrets Required:**
- `NPM_SECRET`: npm authentication token

**Purpose:** Publishes the models package to both npm and GitHub Packages when a release is created.

---

### 6. Publish SDK (`publish-sdk.yaml`)

**Triggers:**
- Release published event for tags starting with `@selling-partner-api/sdk@`

**Actions:**
1. Checkout code at the release tag
2. Install dependencies with Bun
3. Run full CI checks (lint, build, test)
4. Validate version matches tag
5. **Wait for models dependency to be available on npm**
6. Publish to npm registry
7. Publish to GitHub Packages

**Secrets Required:**
- `NPM_SECRET`: npm authentication token

**Purpose:** Publishes the SDK package after ensuring its models dependency is available, preventing version mismatch issues.

---

### 7. Update SDK Models Dependency (`update-sdk-models-dependency.yaml`)

**Triggers:**
- Release published event for tags starting with `@selling-partner-api/models@`

**Actions:**
1. Extract version from models release tag
2. Update SDK's `@selling-partner-api/models` dependency
3. Create a PR with the dependency update

**Purpose:** Automatically creates a PR to update the SDK when models releases, triggering the standard PR → release flow.

---

### 8. Sync Models (`sync-models.yaml`)

**Triggers:**
- Scheduled: Daily at 5:00 AM UTC
- Manual workflow dispatch

**Actions:**
1. Update vendor submodule to latest Amazon API models
2. Rebuild merged OpenAPI schema
3. Regenerate SDK artifacts
4. Create PR with changes

**Purpose:** Keeps the repository in sync with upstream Amazon Selling Partner API model changes via pull request (not direct push).

---

### 9. Dependabot Auto-Merge (`dependabot-auto-merge.yaml`)

**Triggers:**
- Pull request events from Dependabot

**Actions:**
- Auto-approves and merges security updates and patch version updates

**Purpose:** Keeps dependencies up-to-date with minimal manual intervention.

---

## Release Flow

### Models Package Release

1. Developer makes changes to `packages/models/**`
2. CI runs on PR
3. PR merged to main
4. Release-please creates/updates release PR
5. Release PR auto-merges (or manually merged)
6. GitHub release created with tag `@selling-partner-api/models@X.Y.Z`
7. `publish-models.yaml` publishes to npm and GitHub Packages
8. `update-sdk-models-dependency.yaml` creates PR to update SDK dependency
9. SDK dependency PR follows standard flow...

### SDK Package Release

1. Developer makes changes to `packages/sdk/**` (or dependency update PR created)
2. CI runs on PR
3. PR merged to main
4. Release-please creates/updates release PR
5. Release PR auto-merges (or manually merged)
6. GitHub release created with tag `@selling-partner-api/sdk@X.Y.Z`
7. `publish-sdk.yaml`:
   - Runs full test suite
   - Waits for models dependency availability
   - Publishes to npm and GitHub Packages

### Preventing Conflicts

The workflows prevent simultaneous releases through:
- **Separate release PRs**: Each package gets its own PR
- **Dependency updates via PR**: Models releases trigger SDK dependency updates through a new PR, not direct modification
- **Sequential flow**: SDK waits for models availability before publishing

---

## Testing Strategy

### PR Checks
- All PRs (except release-please) run full CI
- Tests, linting, and build must pass

### Pre-Publish Checks
- SDK package runs full test suite before publishing
- Models package only builds (no tests currently)

### Coverage Reporting
- Coverage badge automatically updated on main branch pushes
- Located at `docs/assets/coverage-badge.svg`

---

## Conventional Commits

Release-please relies on conventional commit messages to determine version bumps:

- `fix:` → Patch version (0.0.X)
- `feat:` → Minor version (0.X.0)
- `BREAKING CHANGE:` or `feat!:` or `fix!:` → Major version (X.0.0)
- `chore:`, `docs:`, `style:`, etc. → No release

Special markers:
- `[skip ci]` - Skip CI workflows
- `[skip release]` - Skip release-please processing

---

## Secrets Configuration

Required repository secrets:

| Secret | Description | Used By |
|--------|-------------|---------|
| `NPM_SECRET` | npm authentication token for publishing | `publish-models.yaml`, `publish-sdk.yaml` |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions | All workflows (GitHub Packages, PR creation) |

---

## Manual Operations

### Manually Trigger Release
```bash
# Via GitHub UI: Actions → release-please → Run workflow
```

### Manually Sync Models
```bash
# Via GitHub UI: Actions → sync-models → Run workflow
```

### Skip CI/Release
```bash
git commit -m "chore: update config [skip ci][skip release]"
```

---

## Best Practices

1. **Use conventional commits** for automatic versioning
2. **Let automation handle releases** - merge release PRs when ready
3. **Review dependency update PRs** from models releases before merging
4. **Monitor workflow runs** for any publishing failures
5. **Test locally** before pushing: `bun run lint && bun run build && bun run test`

---

## Troubleshooting

### Release PR not created
- Check if commits use conventional commit format
- Verify paths affected are in release-please config

### Publish fails waiting for models
- Check if models package published successfully
- Verify npm registry availability
- Check if version in SDK's package.json matches published models version

### Tests fail in publish-sdk
- Fix must be merged to main first
- Release PR will be updated automatically
- Re-merge release PR after fix

### Dual package releases
- Should not happen with current setup
- If it does, merge one release PR at a time
- Dependency update PR will sync versions
