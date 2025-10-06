# Selling Partner API TypeScript Client

This SDK can only run server-side. For one, Selling Partner API does not support CORS, second, it requires a client secret and refresh token which should not be exposed in the browser and third, rate limiting uses a cache database to store the rate limit state which is not available in the browser.

- Cross-runtime
    - works in Node.js, Deno and Bun (server-side only)
- Written in TypeScript
    - full typing coverage
    - typing based on the [OpenAPI schemas provided by Amazon](https://github.com/amzn/selling-partner-api-models)
- Lightweight
- Handles authentication
    - auto-refresh access token
- Handles rate limiting with custom backoff strategy
- Handles throttling
- Handles request signing (needs additional setup)
- Auto-retry (1 retry by default)
- Automatic response destructuring using [destr](https://github.com/unjs/destr)
    - no need to manually parse response
    - falls back to raw response

## Install

```bash
npm install @selling-partner-api/sdk
# or
bun add @selling-partner-api/sdk
```

Pair the SDK with the published models package whenever you need direct access to the full OpenAPI schema or type metadata:

```bash
npm install @selling-partner-api/models
# or
bun add @selling-partner-api/models
```

## Usage

### Create a client instance

```ts
import { SpApi, Region } from "@selling-partner-api/sdk"

const client = new SpApi({
    clientId: "amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    clientSecret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    refreshToken: "Atzr|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    region: Region.EU
})
```

### Make a request

```ts
// Example request - get a list of 'GET_MERCHANT_LISTINGS_ALL_DATA' reports
import { SpApi, Marketplace } from "@selling-partner-api/sdk"

/*
 * Response is automatically typed based on the OpenAPI schema provided by Amazon.
 * It will also be automatically parsed and destructured using the correct format
 * falling back to plain text if needed.
 */
const client = new SpApi({
    clientId: process.env.SP_CLIENT_ID!,
    clientSecret: process.env.SP_CLIENT_SECRET!,
    refreshToken: process.env.SP_REFRESH_TOKEN!,
    region: Region.EU
})

const { reports } = await client.get("/reports/2021-06-30/reports", {
    params: {
        // Query will be automatically URL encoded, joined and appended to the final URL
        query: {
            reportTypes: ["GET_MERCHANT_LISTINGS_ALL_DATA"], // case-sensitive
            marketplaceIds: [Marketplace.UK],
            pageSize: 10,
            createdSince: new Date("2021-01-01").toISOString(), // ISO 8601
            processingStatuses: ["DONE"], // case-sensitive
        },
    },
})
```

### Make a request using a helper method from the wrapper

**Note**: The wrapper doesn't offer full coverage of the SP-API. It's only meant to make common requests easier.

```ts
import { Marketplace } from "@selling-partner-api/sdk"

const orders = await client.getOrders({
    marketplaceIds: [Marketplace.UK],
    pageSize: 10,
    createdAfter: "2021-01-01", // supports all common date formats
})
```

## Current internal fetch client SP-API coverage

<details>
<summary>Expand</summary>

| API Reference                                               | Version    | Status |
| ----------------------------------------------------------- | ---------- | ------ |
| A+ Content Management API v2020-11-01                       | 2020-11-01 | 🚧     |
| Authorization API v1                                        | v1         | ✅     |
| Catalog Items API v2022-04-01                               | 2022-04-01 | ✅     |
| Catalog Items API v2020-12-01                               | 2020-12-01 | ❌     |
| Catalog Items API v0                                        | v0         | ❌     |
| Easy Ship API v2022-03-23                                   | 2022-03-23 | 🚧     |
| FBA Inbound Eligibility API v1                              | V1         | 🚧     |
| FBA Inventory API v1                                        | V1         | 🚧     |
| FBA Small and Light API v1                                  | v1         | 🚧     |
| Feeds API v2021-06-30                                       | 2021-06-30 | 🚧     |
| Feeds API v2020-09-04                                       | 2020-09-04 | ❌     |
| Finances API v0                                             | v0         | ✅     |
| Fulfillment Inbound API v0                                  | v0         | 🚧     |
| Fulfillment Outbound API v2020-07-01                        | 2020-07-01 | 🚧     |
| Listings Items API v2021-08-01                              | 2021-08-01 | ✅     |
| Listings Items API v2020-09-01                              | 2020-09-01 | ❌     |
| Listing Restrictions API v2021-08-01                        | 2021-08-01 | ✅     |
| Merchant Fulfillment API v0                                 | v0         | 🚧     |
| Messaging API v1                                            | v1         | 🚧     |
| Notifications API v1                                        | v1         | ✅     |
| Orders API v0                                               | v0         | ✅     |
| Product Fees API v0                                         | v0         | ✅     |
| Product Pricing API v0                                      | v0         | ✅     |
| Product Pricing API v2022-05-01                             | 2022-05-01 | ✅     |
| Product Type Definitions API v2020-09-01                    | 2020-09-01 | ❌     |
| Replenishment API v2022-11-07                               | 2022-11-07 | ❌     |
| Reports API v2021-06-30                                     | 2021-06-30 | ✅     |
| Reports API v2020-09-04                                     | 2020-09-04 | ❌     |
| Sales API v1                                                | v1         | ✅     |
| Sellers API v1                                              | v1         | ✅     |
| Services API v1                                             | v1         | ✅     |
| Shipment Invoicing API v0                                   | v0         | 🚧     |
| Shipping API v1                                             | v1         | 🚧     |
| Solicitations API v1                                        | v1         | 🚧     |
| Tokens API v2021-03-01                                      | 2021-03-01 | ✅     |
| Uploads API v2020-11-01                                     | 2020-11-01 | 🚧     |
| Vendor Direct Fulfillment Inventory API v1                  | v1         | 🚧     |
| Vendor Direct Fulfillment Orders API v2021-12-28            | 2021-12-28 | 🚧     |
| Vendor Direct Fulfillment Orders API v1                     | v1         | ❌     |
| Vendor Direct Fulfillment Payments API v1                   | v1         | 🚧     |
| Vendor Direct Fulfillment Sandbox Test Data API v2021-12-28 | 2021-12-28 | ❌     |
| Vendor Direct Fulfillment Shipping API v2021-12-28          | 2021-12-28 | 🚧     |
| Vendor Direct Fulfillment Shipping API v1                   | v1         | ❌     |
| Vendor Direct Fulfillment Transactions API v2021-12-28      | 2021-12-28 | 🚧     |
| Vendor Direct Fulfillment Transactions API v1               | v1         | ❌     |
| Vendor Retail Procurement Invoices API v1                   | v1         | 🚧     |
| Vendor Retail Procurement Orders API v1                     | v1         | 🚧     |
| Vendor Retail Procurement Shipments API v1                  | v1         | 🚧     |
| Vendor Retail Procurement Transaction Status API v1         | v1         | 🚧     |

</details>

## Development

### Scripts

```json5
// package.json (workspace root)
{
    "scripts": {
        "build": "bun run --cwd packages/sdk build",
        "test": "bunx vitest"
    }
}

// packages/sdk/package.json
{
    "scripts": {
        "build": "bun run clean && bun run generate:limits && tsc --project tsconfig.build.json",
        "test": "bunx vitest"
    }
}
```

### Build

```bash
bun run --cwd packages/sdk build
```

### Test

```bash
bunx vitest run
```

## License

[MIT](./LICENSE)
