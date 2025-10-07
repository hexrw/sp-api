# Releasing & Publishing the SDK

The repository publishes new SDK builds automatically. You do **not** bump versions or create Git tags by hand—the release pipeline listens for changes on `main`, prepares a release PR, and handles npm once that PR merges. All releases are currently published under the `beta` dist-tag.

## How the beta pipeline works today

1. Commits touching `packages/models` or `packages/sdk` land on `main`.
2. [`release-please`](https://github.com/google-github-actions/release-please) opens (or updates) a unified release PR titled `release <component>@<version>` and applies the `release: pending` label.
3. The PR contains all version bumps, changelog entries, and any workspace dependency updates required to keep `@selling-partner-api/sdk` aligned with `@selling-partner-api/models`.
4. CI must stay green. Once it passes, the `release-please-auto-merge` workflow enables auto-merge so the PR lands as soon as reviews/checks allow.
5. When the PR merges, release-please creates prerelease GitHub releases tagged `@selling-partner-api/models@<version>` first and `@selling-partner-api/sdk@<version>` second.
6. The `publish-sdk` workflow reacts to those tags, rebuilds both packages, enforces the `-beta` suffix, and publishes to npm and GitHub Packages using the `beta` dist-tag.

To ship a new build you generally just review the release PR, allow auto-merge to do its thing, and watch the workflow logs.

## Transitioning to a stable release

When you’re ready to leave beta:

1. **Update versioning**
    - Edit `packages/sdk/package.json` and remove the `-beta.x` suffix (for example, change `2.0.0-beta.4` to `2.0.0`).
    - Update `release-please-config.json` by setting `"prerelease": false` (or removing the field) so future releases are treated as stable.

2. **Adjust the publish workflow**
    - In `.github/workflows/publish-sdk.yaml`, remove the "Ensure beta prerelease version" step.
    - Drop the `--tag beta` flag so npm publishes to the default `latest` tag.

3. **Ship the stable release**
    - Merge the changes above.
    - Allow release-please to open the next release PR; merge it to generate tags like `@selling-partner-api/sdk@2.0.0`.
    - Confirm the publish workflow succeeds without the beta guardrails.

4. **Communicate the transition**
    - Update docs, changelog call-outs, and release notes to highlight the move to stable.

Following these steps keeps the automation intact while making it explicit when the package graduates from beta to a stable release.

## Registry credentials

The publish workflow expects two authentication sources:

- `NPM_SECRET` – an npm automation token with **publish** scope for the `@selling-partner-api` organization. This is used when pushing to `registry.npmjs.org`.
- `GITHUB_TOKEN` – automatically provided to GitHub Actions and granted `packages:write` permission by the workflow. It authenticates the publish to `npm.pkg.github.com`.

For local publishing or testing against GitHub Packages, create an `.npmrc` entry matching the docs from [GitHub Packages ↗](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry):

```ini
@selling-partner-api:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` to a fine-grained PAT with `packages:write` before running `npm publish`.
