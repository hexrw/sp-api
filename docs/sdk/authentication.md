# Authentication

Amazon requires Login With Amazon (LWA) and Selling Partner API (SP-API) credentials for every request. The SDK wraps the OAuth2 machinery and signs each call transparently, but you still need to provide valid inputs.

## Required inputs

```ts
import { SpApi, Region } from "@selling-partner/sdk"

const client = new SpApi({
  clientId: process.env.SP_CLIENT_ID!,
  clientSecret: process.env.SP_CLIENT_SECRET!,
  refreshToken: process.env.SP_REFRESH_TOKEN!,
  region: Region.EU,
})
```

- **clientId/clientSecret** – issued when you register your application in Seller Central.
- **refreshToken** – generated after the seller authorises your application. Store it securely and rotate if Amazon revokes access.
- **region** – `Region.NA`, `Region.EU`, or `Region.FE`. Custom endpoints are available via `SpApi.Endpoint` if Amazon expands regions later.

## Grantless operations

Some endpoints (for example, the Notifications API) support grantless operations. Instantiate `LwaClient` directly and pass it to `SpApi`:

```ts
import { LwaClient, SpApi, Region } from "@selling-partner/sdk"

const lwa = new LwaClient(
  process.env.SP_CLIENT_ID!,
  process.env.SP_CLIENT_SECRET!,
  undefined, // no refresh token required for grantless flows
  Region.NA,
)

const client = new SpApi({
  clientId: lwa.clientId,
  clientSecret: lwa.clientSecret,
  refreshToken: "",
  region: Region.NA,
  lwaClient: lwa,
})
```

## Token caching & refreshes

`SpApi` caches access tokens until they expire. If a request returns `401`, the middleware retries once after forcing a refresh. For long-running processes you can pre-warm the cache:

```ts
await client.getAccessToken()
```

## IAM role assumptions

If you deploy inside AWS, keep secrets in AWS Secrets Manager or Parameter Store and resolve them before instantiating `SpApi`. The SDK does not load AWS credentials for you; instead, focus on storing LWA secrets securely and inject them via environment variables.

## Debugging failed auth

1. Ensure the refresh token belongs to the same client ID.
2. Verify the refresh token has not been revoked in Seller Central.
3. Double-check the region – the LWA token exchange is region-specific.
4. Enable verbose logging (`DEBUG=sp-api:* node ...`) to see request/response pairs when diagnosing issues.
