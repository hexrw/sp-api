# Releasing & Publishing the SDK

This repository ships the SDK to npm automatically whenever a GitHub release with the `sdk-` prefix is published. Releases are currently treated as **beta pre-releases** so consumers must opt in to the `beta` dist-tag on npm.

## How the beta pipeline works

1. You bump the version in `packages/sdk/package.json`. Keep the existing semantic version and append a `-beta.x` suffix (for example, `2.0.0-beta.0`).  
2. Commit the change and merge it into `main`.  
3. Create a GitHub release that tags the repository with `sdk-v<version>` (for example, `sdk-v2.0.0-beta.0`). Mark the release as a pre-release in the GitHub UI if you create it manually.  
4. The `publish-sdk` GitHub Action runs automatically. It builds the SDK, runs tests, confirms the version contains `-beta`, then publishes to both npm and GitHub Packages with the `beta` dist-tag (`npm install @selling-partner-api/sdk@beta` or install from `https://github.com/selling-partner-api/selling-partner-api/pkgs/npm/sdk`).

The workflow will fail if the version string does not include `-beta`, preventing accidental stable releases.

## Transitioning to a stable release

When you are ready to ship a non-beta build:

1. **Update versioning**
   - Edit `packages/sdk/package.json` and remove the `-beta.x` suffix (for example, change `2.0.0-beta.4` to `2.0.0`).
   - Update `release-please-config.json` by setting `"prerelease": false` (or removing the field) so future releases are treated as stable.

2. **Adjust the publish workflow**
   - In `.github/workflows/publish-sdk.yaml`, remove the "Ensure beta prerelease version" step.
   - Change the publish command to drop the `--tag beta` flag so npm publishes to the default `latest` tag.

3. **Create the stable release**
   - Commit the changes above and merge them into `main`.
   - Create a GitHub release tagged `sdk-v<stable-version>` (for example, `sdk-v2.0.0`).
   - The workflow will publish the stable build to npm under the `latest` tag.

4. **Communicate the transition**
   - Update documentation, release notes and any migration guides to highlight that the SDK left beta.

Following these steps keeps the automated pipeline intact while making it explicit when the package graduates from beta to a stable release.

## Registry credentials

The publish workflow expects two authentication sources:

- `NPM_TOKEN` – an npm automation token with **publish** scope for the `@selling-partner-api` organization. This is used when pushing to `registry.npmjs.org`.
- `GITHUB_TOKEN` – automatically provided to GitHub Actions and granted `packages:write` permission by the workflow. It authenticates the publish to `npm.pkg.github.com`.

For local publishing or testing against GitHub Packages, create an `.npmrc` entry matching the docs from [GitHub Packages ↗](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry):

```ini
@selling-partner-api:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` to a fine-grained PAT with `packages:write` before running `npm publish`.
