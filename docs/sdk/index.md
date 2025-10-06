# SDK Overview

Welcome to the home for the `@selling-partner/sdk` JavaScript/TypeScript client. This section explains how the SDK is versioned, what environments it supports, and the workflows we ship to keep releases healthy.

## Why this SDK

- **Fully typed** – generated from the upstream Selling Partner API models with zero manual shimming.
- **Modern runtime support** – tested against Bun 1.2+, Node 22+, and edge runtimes powered by the Fetch API.
- **Automated updates** – Dependabot, nightly model syncs, and release-please keep dependencies, schemas, and rate limits current.
- **Pragmatic defaults** – opinionated rate limiting, sensible retries, and ergonomic helpers, while still letting you drop down to raw endpoints.

## Release cadence

The repository uses [release-please](https://github.com/google-github-actions/release-please) to cut semantic versions whenever changes land on `main`. Upstream schema refreshes from Amazon are ingested nightly via the `sync-models` workflow and trigger a release if the generated outputs change.

1. Dependabot & nightly sync jobs open pull requests with updated lockfiles or schemas.
2. CI (`ci.yaml`) runs bun-based builds and tests on every PR and push.
3. Approved dependency patches are auto-merged; everything else requires a human review.
4. Once merged to `main`, `release-please.yaml` tags `sdk-vX.Y.Z` and records changes in `packages/sdk/CHANGELOG.md`.
5. The `publish-sdk.yaml` workflow publishes the package to npm (after the `NPM_TOKEN` secret is configured).

## Supported runtimes

| Runtime | Minimum version | Notes |
| --- | --- | --- |
| Bun | 1.2.0 | Primary development environment. Build, test, and scripts are bun-native. |
| Node.js | 22.0.0 | Uses the Web Fetch API and Undici under the hood. Enable `--experimental-fetch` on older LTS streams if you must, but they are unsupported. |
| Deno | 1.42 | Works via the ESM output. You will need to polyfill the `limiter` package with npm compat enabled. |

For browser usage, prefer server-side deployment. The SDK requires confidential credentials (LWA refresh tokens) and performs rate limiting that isn’t suitable for front-end applications.

## Next steps

- [Installation](./installation.md) – add the package to your monorepo or service.
- [Authentication](./authentication.md) – obtain and refresh LWA credentials.
- [Usage Examples](./usage.md) – call endpoints with full type support.
- [Advanced Guides](./advanced.md) – customise rate limiting, middlewares, and transports.
- [Testing & Tooling](./testing.md) – unit test your integrations safely.

If something is missing, use the “Suggest changes” link in the footer or open an issue.
