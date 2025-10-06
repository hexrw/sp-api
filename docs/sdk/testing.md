# Testing & Tooling

Reliable SP-API integrations need automated coverage. The SDK ships helpers and patterns to keep tests fast and deterministic.

## Unit tests with Bun

```ts
import { describe, expect, it, mock } from "bun:test"
import { Region, SpApi } from "@selling-partner-api/sdk"

const mockFetch = mock(async () =>
  new Response(JSON.stringify({ reportId: "r123" }), {
    headers: {
      "x-amzn-RateLimit-Limit": "10",
      "x-amzn-RateLimit-Remaining": "9",
      "x-amzn-RateLimit-Reset": `${Date.now() + 1_000}`,
    },
  }),
)

const client = new SpApi({
  clientId: "test",
  clientSecret: "test",
  refreshToken: "test",
  region: Region.NA,
  fetch: mockFetch,
})

describe("reports", () => {
  it("creates reports", async () => {
    const result = await client.reports.createReport({
      reportType: "GET_FLAT_FILE_OPEN_LISTINGS_DATA",
      marketplaceIds: ["ATVPDKIKX0DER"],
    })

    expect(result.body.reportId).toBe("r123")
    expect(mockFetch).toHaveBeenCalled()
  })
})
```

Mock `fetch` to avoid hitting the real API. Inject predictable responses and rate-limit headers to exercise retry behaviour.

## Recording fixtures

For integration tests, wrap the middleware to capture raw HTTP exchanges. Persist them and replay in CI to keep tests hermetic:

```ts
const recorder = (request, next) => {
  const key = `${request.operationId}-${Date.now()}`
  // ...write request to disk
  return next(request).then((response) => {
    // ...write response
    return response
  })
}
```

On replay, load the captured responses and short-circuit the middleware chain.

## Linting & type checks

The repository includes scripts for quick feedback:

- `bun run lint` – ESLint across source and tests.
- `bun run typecheck` – TypeScript project references keep declarations in sync.
- `bun run test` – executes `bun:test` suites inside `packages/sdk`.

## Local docs preview

Use `bun run docs:dev` from the repo root. VitePress hot reloads Markdown and TypeScript configs, making it easy to iterate on examples while you work on code.

## Continuous integration

`ci.yaml` runs build, lint, and tests on every push and pull request. Add your service-specific integration tests to the workspace and wire them into the `ci` workflow to keep coverage holistic.
