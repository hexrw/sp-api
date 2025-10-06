# Usage Examples

With the SDK installed and authenticated, you can invoke any Selling Partner API operation using fully typed helpers. Each operation returns a typed response and exposes metadata such as rate limits.

## Basic request

```ts
import { SpApi, Region } from "@selling-partner/sdk"

const client = new SpApi({
  clientId: process.env.SP_CLIENT_ID!,
  clientSecret: process.env.SP_CLIENT_SECRET!,
  refreshToken: process.env.SP_REFRESH_TOKEN!,
  region: Region.NA,
})

const { body, rateLimits } = await client.reports.createReport({
  reportType: "GET_FLAT_FILE_OPEN_LISTINGS_DATA",
  marketplaceIds: ["ATVPDKIKX0DER"],
})

console.log(body.reportId)
console.log(rateLimits.remaining)
```

Every method mirrors the SP-API REST path structure. For instance, `client.orders.getOrderById` maps to `GET /orders/v0/orders/{orderId}`.

## Pagination helpers

The `paginate` utility wraps cursor-based endpoints and yields typed pages:

```ts
import { paginate, Region, SpApi } from "@selling-partner/sdk"

const client = new SpApi({ /* ...auth */ })

for await (const order of paginate(client.orders.getOrders, {
  createdAfter: "2024-01-01T00:00:00Z",
})) {
  console.log(order.amazonOrderId)
}
```

Pass additional request parameters as the second argument. The iterator automatically respects throttling tokens between pages.

## Handling errors

Errors throw subclasses of `SpError`. You can inspect the HTTP status, error payload, and request metadata:

```ts
import { SpResponseError } from "@selling-partner/sdk"

try {
  await client.reports.getReport({ reportId: "foo" })
} catch (error) {
  if (error instanceof SpResponseError) {
    console.error(error.code)
    console.error(error.details.status)
  }
}
```

Enable debug logging via `DEBUG=sp-api:*` to surface raw response details when troubleshooting.

## Marketplace shortcuts

`@selling-partner/sdk/utils` exposes curated helpers:

```ts
import { getMarketplaceByCountryCode } from "@selling-partner/sdk/utils"

const marketplace = getMarketplaceByCountryCode("GB")

console.log(marketplace.id) // A1F83G8C2ARO7P
```

These helpers are generated from Amazon’s marketplace metadata and update automatically with nightly syncs.

## Rate limit metadata

Every response includes the rate-limit headers so you can implement custom backoff logic:

```ts
const result = await client.finances.listFinancialEventGroups({
  financialEventGroupStartedAfter: "2024-01-01T00:00:00Z",
})

console.log(result.rateLimits.limit) // e.g. 10
console.log(result.rateLimits.reset) // epoch timestamp
```

The SDK already queues requests to stay under Amazon’s quotas, but this data helps when orchestrating multiple workers.
