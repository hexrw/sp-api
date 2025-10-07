import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { SpApi } from "./core"
import { Endpoint } from "./consts"
import { Region } from "./enums"

const useMock = vi.fn<(...middlewares: any[]) => void>((...middlewares) => {
    recordedMiddlewares = middlewares
})

const clientMock = {
    use: useMock,
    GET: vi.fn(),
    POST: vi.fn(),
    DELETE: vi.fn(),
}

const createClientMock = vi.hoisted(() => vi.fn(() => clientMock))

let recordedMiddlewares: any[] = []
const bucketInstances: Array<{
    bucketSize: number
    tokensPerInterval: number
    interval: string
    content: number
    removeTokens: ReturnType<typeof vi.fn>
}> = []

const MockTokenBucket = vi.hoisted(() => {
    return class {
        bucketSize: number
        tokensPerInterval: number
        interval: string
        content: number
        removeTokens: ReturnType<typeof vi.fn>

        constructor(config: { bucketSize: number; tokensPerInterval: number; interval: string }) {
            this.bucketSize = config.bucketSize
            this.tokensPerInterval = config.tokensPerInterval
            this.interval = config.interval
            this.content = this.bucketSize
            this.removeTokens = vi.fn(async () => {})
            bucketInstances.push(this)
        }
    }
})

vi.mock("openapi-fetch", () => ({
    __esModule: true,
    default: createClientMock,
}))

vi.mock("limiter", () => ({
    TokenBucket: MockTokenBucket,
}))

describe("SpApi", () => {
    beforeEach(() => {
        bucketInstances.length = 0
        recordedMiddlewares = []
        useMock.mockClear()
        clientMock.GET.mockReset()
    clientMock.POST.mockReset()
    clientMock.DELETE.mockReset()
    createClientMock.mockClear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const createInstance = () =>
        new SpApi({
            clientId: "client",
            clientSecret: "secret",
            refreshToken: "refresh",
            region: Region.EU,
        })

    it("sets up the OpenAPI client with defaults", () => {
        const instance = createInstance()
        expect(instance).toBeInstanceOf(SpApi)
    expect(createClientMock).toHaveBeenCalledTimes(1)
    const callArgs = ((createClientMock.mock as any).calls?.[0]?.[0] ?? {}) as Record<string, any>
    expect(callArgs.baseUrl).toBe(Endpoint[Region.EU].api)
    expect(callArgs.headers?.["User-Agent"]).toContain("@selling-partner-api/sdk")
        expect(useMock).toHaveBeenCalledTimes(1)
        expect(recordedMiddlewares).toHaveLength(3)
    })

    it("creates rate limiters and adjusts them from response headers", async () => {
        createInstance()
        const rateLimiterMiddleware = recordedMiddlewares[1]
        const request = new Request("https://example.com/reports")
        await rateLimiterMiddleware.onRequest({ request, schemaPath: "/reports" })
        expect(bucketInstances).toHaveLength(1)
        expect(bucketInstances[0].removeTokens).toHaveBeenCalledWith(1)

        const response = new Response(null, {
            status: 200,
            headers: { "x-amzn-RateLimit-Limit": "0.5" },
        })
        await rateLimiterMiddleware.onResponse({ response, schemaPath: "/reports" })
        expect(bucketInstances[0].tokensPerInterval).toBe(0.5)

        const throttled = new Response(null, { status: 429 })
        await rateLimiterMiddleware.onResponse({ response: throttled, schemaPath: "/reports" })
        expect(bucketInstances[0].content).toBe(0)
    })

    it("serializes array query parameters as comma-separated values", async () => {
        createInstance()
        const queryMiddleware = recordedMiddlewares[2]
        const request = new Request("https://example.com/path?foo=1")
        const result = await queryMiddleware.onRequest({
            request,
            params: { query: { foo: ["a", "b"], bar: "baz" } },
        })
        const url = new URL(result.url)
        expect(url.searchParams.get("foo")).toBe("a,b")
    })

    it("handles rate limit middleware edge cases", async () => {
        createInstance()
        const rateLimiterMiddleware = recordedMiddlewares[1]

        const unknownResponse = new Response(null, { status: 204 })
        const passthrough = await rateLimiterMiddleware.onResponse({ response: unknownResponse, schemaPath: "/unknown" })
        expect(passthrough).toBe(unknownResponse)

        await rateLimiterMiddleware.onRequest({ request: new Request("https://example.com/reports"), schemaPath: "/reports" })
        const invalidHeader = new Response(null, { status: 200, headers: { "x-amzn-RateLimit-Limit": "NaN" } })
        await rateLimiterMiddleware.onResponse({ response: invalidHeader, schemaPath: "/reports" })

        const zeroHeader = new Response(null, { status: 200, headers: { "x-amzn-RateLimit-Limit": "0" } })
        await rateLimiterMiddleware.onResponse({ response: zeroHeader, schemaPath: "/reports" })
    })

    it("throws for invalid regions", () => {
        expect(() =>
            new SpApi({
                clientId: "client",
                clientSecret: "secret",
                refreshToken: "refresh",
                region: "unknown",
            } as any),
        ).toThrowError("Invalid region")
    })
})
