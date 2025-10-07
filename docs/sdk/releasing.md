# Releasing & Publishing the SDK

The repository publishes new SDK builds through release-please. When code lands on `main`, per-package release PRs keep versions, changelog entries, and dependency alignment ready to ship. Once merged, GitHub releases trigger the publish workflows that push to npm and GitHub Packages on the default `latest` dist-tag.

## Standard release flow

1. Land changes on `main`. When `packages/models` or `packages/sdk` updates, release-please opens (or refreshes) a release PR for that component.
2. Review the release PR. Auto-merge is enabled for the `release: pending` label once checks pass, but you can merge manually if you prefer.
3. On merge, release-please tags `@selling-partner-api/models@<version>` first, then `@selling-partner-api/sdk@<version>` and publishes GitHub releases.
4. The `publish-models` workflow publishes the OpenAPI bundle to npm/GitHub Packages; once the version is visible, the `publish-sdk` workflow rebuilds against it and publishes the SDK with provenance attestation.

You still review every release, but the automation handles tagging, changelog maintenance, dependency alignment, and registry publishing.

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
