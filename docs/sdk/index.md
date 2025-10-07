# SDK Overview

The `@selling-partner-api/sdk` package is a server-side JavaScript/TypeScript client that mirrors the Amazon SP-API surface area. It is published from this repository whenever code changes land on `main` and has a hard dependency on the companion `@selling-partner-api/models` package.

## What you get

- Generated typings sourced from Amazon's OpenAPI definitions.
- A composable `SpApi` client built on top of `openapi-fetch`.
- Built-in LWA token management with refresh, grantless, and pre-provisioned token support.
- Adaptive rate limiting per schema path backed by token buckets.
- Helper clients (`ReportsClient`, `FinancesClient`) that encapsulate the trickier workflows most teams end up writing.
- End-to-end automation: release detection, auto-merged release PRs, ordered publishing (models first, SDK second), and npm provenance attestation.

## Release flow at a glance

1. A commit touching `packages/models` or `packages/sdk` reaches `main`.
2. `release-please` analyses the commit history and opens/updates a unified release PR titled `release <component>@<version>`.
3. CI runs Biome, builds both packages, and executes Vitest with coverage thresholds (90% statements/lines, 85% branches).
4. The `release-please-auto-merge` workflow enables auto-merge for the PR once checks are green and the `release: pending` label is present.
5. On merge, release-please tags `@selling-partner-api/models@*` and `@selling-partner-api/sdk@*` (in that order) and publishes GitHub releases.
6. The `publish-sdk` workflow publishes models to npm/GitHub Packages, waits until the version is visible, synchronises the SDK dependency, builds, tests, and publishes the SDK.

No manual tagging nor `npm publish` commands are required.

## Package structure

| Path | Purpose |
| --- | --- |
| `packages/models` | Consolidated OpenAPI schema published as `@selling-partner-api/models`. |
| `packages/sdk` | The runtime SDK published as `@selling-partner-api/sdk`. |
| `packages/sdk/scripts` | Automation scripts (rate-limit generation, dependency sync). |
| `docs/sdk/*` | The documentation you are reading right now. |

## Runtime support

- Node.js ≥ 22.x (LTS) – leverages built-in `fetch`, `URL`, and Web Streams.
- Bun ≥ 1.2 – supported out of the box.
- Deno (server-side) – works when you provide compatible `fetch`/`Blob` implementations.

Browser runtimes are **not supported** because SP-API credentials must remain secret and rate-limiting requires server-side state.

## Next steps

- [Installation](./installation.md) – add the package to your monorepo or service.
- [Authentication](./authentication.md) – obtain and refresh LWA credentials.
- [Usage Examples](./usage.md) – call endpoints with full type support.
- [Advanced Guides](./advanced.md) – customise rate limiting, middlewares, and transports.
- [Testing & Tooling](./testing.md) – unit test your integrations safely.

If something is missing, use the “Suggest changes” link in the footer or open an issue.
