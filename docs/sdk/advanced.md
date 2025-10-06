# Advanced Guides

The SDK ships with sensible defaults, but you can tune rate limiting, endpoints, and logging to match your production setup.

## Per-operation token buckets

Each schema path is throttled with a `TokenBucket` seeded from `packages/sdk/src/assets/rate-limits.json`. You can override buckets per operation when you have higher quotas or want stricter enforcement:

```ts
import { Region, SpApi, TokenBucket } from "@selling-partner-api/sdk"

const client = new SpApi({
  clientId: "...",
  clientSecret: "...",
  refreshToken: "...",
  region: Region.EU,
})

client.setRateLimiter(
  "/reports/2021-06-30/reports#post",
  new TokenBucket({
    bucketSize: 10,
    tokensPerInterval: 5,
    interval: "second",
  }),
)
```

`setRateLimiter` swaps the limiter for future requests without mutating global state.

## Understanding automatic throttling

The default rate limiter provisions buckets on-demand. When Amazon returns updated headers (`x-amzn-RateLimit-Limit`), the client adjusts the bucket automatically. In the event of a `429`, the SDK waits for the bucket to refill and retries the request once before surfacing the error.

## Regional and sandbox endpoints

Use the static maps on `SpApi` to inspect and override endpoints:

```ts
import { Region, SpApi } from "@selling-partner-api/sdk"

const endpoint = SpApi.Endpoint[Region.FE]

console.log(endpoint.api) // https://sellingpartnerapi-fe.amazon.com

// Point to the sandbox instead of production
SpApi.Endpoint[Region.NA] = {
  api: "https://sandbox.sellingpartnerapi-na.amazon.com",
  lwa: endpoint.lwa,
}
```

Set the map back to its original value when you exit tests to avoid leaking configuration into other suites.

## Inspecting generated models

All operations and models live in the published `@selling-partner-api/models` package. Import schemas or paths if you need to validate payloads or render forms:

```ts
import { notifications, paths as notificationPaths } from "@selling-partner-api/models"

console.log(notifications.components.schemas.CreateDestinationResponse)
console.log(notificationPaths["/notifications/v1/destinations"].post)
```

The SDK consumes the same objects during build time, so any upstream changes land in both packages simultaneously.

## Debug logging

Set `DEBUG=sp-api:*` to surface internal diagnostics, including bucket creation, retry attempts, and auth refreshes. Combine it with Bun’s `--watch` flag when iterating locally to see live feedback.
