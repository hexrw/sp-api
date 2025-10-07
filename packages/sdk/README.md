# Selling Partner API SDK (`@selling-partner-api/sdk`)

A fully typed TypeScript client for the Amazon Selling Partner API (SP-API). The SDK mirrors Amazon's OpenAPI definitions, manages Login with Amazon (LWA) authentication, and bundles opinionated helpers for high-traffic endpoints such as Reports and Finances.

> **Server-side only** – SP-API credentials must never be exposed in the browser. Target Node.js ≥ 22 or Bun ≥ 1.2.

## Highlights

- **End-to-end typing** – request and response contracts are generated from the official Amazon models.
- **Automated auth** – the built-in `LwaClient` refreshes tokens, supports grantless flows, and caches results.
- **Adaptive throttling** – per-path token buckets hydrate lazily and adjust when Amazon returns new rate-limit headers.
- **Convenience clients** – `ReportsClient` and `FinancesClient` encapsulate complex polling and pagination logic.
- **Model alignment** – every build synchronises the SDK's dependency on `@selling-partner-api/models` to the latest workspace version.
- **Zero-touch releases** – `release-please` auto-merges release PRs, tags models first, and the publish workflow handles npm/GitHub Packages.

## Installation

```bash
# npm
npm install @selling-partner-api/sdk

# bun
bun add @selling-partner-api/sdk
```

When you consume the SDK from npm the `@selling-partner-api/models` dependency is installed for you. Building from this repository also runs a sync script so the SDK always compiles against the newest models version on `main`.

## Quick start

```ts
import { Marketplace, Region, SpApi } from "@selling-partner-api/sdk"

const client = new SpApi({
    clientId: process.env.SP_CLIENT_ID!,
    clientSecret: process.env.SP_CLIENT_SECRET!,
    refreshToken: process.env.SP_REFRESH_TOKEN!,
    region: Region.EU,
})

const { reports } = await client.get("/reports/2021-06-30/reports", {
    params: {
        query: {
            reportTypes: ["GET_MERCHANT_LISTINGS_ALL_DATA"],
            marketplaceIds: [Marketplace.UK],
            pageSize: 10,
        },
    },
})

for (const report of reports ?? []) {
    console.log(report.reportId, report.processingStatus)
}
```

### Convenience helpers

```ts
import { FinancesClient, ReportsClient } from "@selling-partner-api/sdk"

const reportsClient = new ReportsClient(client)

// Create and wait for a report
const created = await reportsClient.create({
    reportType: "GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL",
    marketplaces: [Marketplace.US],
})

const completed = await reportsClient.waitForReport(created.reportId!, {
    intervalMs: 5_000,
    onStatus: (status) => console.info("Report status", status),
})

const document = await reportsClient.download(completed.payload!.reportDocumentId!, { decompress: true })
const rows = document.toRows()
console.log("Downloaded", rows.length, "rows")

// Stream financial events with automatic pagination
const finances = new FinancesClient(client)
for await (const page of finances.iterateFinancialEvents({}, { pageSize: 100, delayMs: 250 })) {
    console.log("Fetched", page.payload?.FinancialEvents?.ShipmentEventList?.length ?? 0, "shipment events")
}
```

## Authentication options

- **Refresh token flow** – provide `clientId`, `clientSecret`, and `refreshToken`. The SDK handles refreshes automatically.
- **Grantless flow** – provide scopes, omit the refresh token, and the client will request a client-credential token.
- **Pre-fetched token** – pass `accessToken` (and optionally `accessTokenExpiresAt`) for environments that manage tokens externally. Call `SpApi.getLwaClient()` if you need lower-level control.

The `LwaClient` class is exported for bespoke integrations and exposes `invalidate()` to force a refresh.

## Rate limiting & middleware

Every schema path receives a lazily created `TokenBucket`. Default quotas originate from `packages/sdk/src/assets/rate-limits.json`. Buckets automatically adjust when Amazon sends new `x-amzn-RateLimit-Limit` headers and collapse when a 429 is returned.

```ts
import { TokenBucket } from "@selling-partner-api/sdk"

client.setRateLimiter("/orders/v0/orders#GET", new TokenBucket({
    bucketSize: 10,
    tokensPerInterval: 2,
    interval: "second",
}))
```

Need more instrumentation? Pass extra middleware via the `middleware` option to log requests, sign with SigV4, or hook into retries.

## Errors

All thrown errors inherit from `SpError` and expose a stable `code` field (`AUTH_ERROR`, `RESPONSE_ERROR`, `VALIDATION_ERROR`, etc.) plus contextual metadata. Use `instanceof` or the `code` property to branch logic.

## Release automation

1. Commits touching `packages/models` or `packages/sdk` trigger `release-please`.
2. A single release PR collects version bumps, changelog entries, and synchronises the SDK's dependency on the models package.
3. CI (Biome linting, builds, Vitest coverage) must succeed; the `release-please-auto-merge` workflow enables auto-merge for the PR.
4. When the PR merges, release-please tags `models-v*` first, then `sdk-v*`.
5. The `publish-sdk` workflow publishes the models package, waits for npm to expose the new version, synchronises the SDK dependency, and finally publishes the SDK to npm and GitHub Packages.

No manual tagging or version bumps are required—push code and wait for CI.

## Development scripts

```bash
# Lint (Biome + TypeScript checks)
bun run lint

# Run the Vitest suite with coverage
bun run test -- --run --coverage

# Build both workspace packages
bun run build
```

Inside `packages/sdk`:

```bash
# Regenerate rate-limit metadata and compile
bun run build

# Align the SDK dependency with the latest models version
bun run sync:models

# Execute Vitest inside the package
bun run test
```

## License

[MIT](../../LICENSE)
