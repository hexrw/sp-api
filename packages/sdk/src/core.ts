import { Region, Marketplace, Report, Query, FulfillmentNetwork } from "./enums"
import createClient, { type Middleware, type Client } from "openapi-fetch"
import { SpError, SpValidationError } from "./lib/errors"
import type { paths } from "./paths"
import rateLimits from "./lib/rate-limit/path"
import * as packageJson from "../package.json"
import { TokenBucket } from "limiter"
import { Endpoint } from "./consts"
import { LwaClient } from "./lwa"
import type { SchemaPath, SpApiConfig } from "./types"
import { ReportsClient } from "./helpers/reports"
import { FinancesClient } from "./helpers/finances"

export type SpClient = Client<paths, "application/json">
type TokenBuckets = Partial<Record<SchemaPath, TokenBucket>>

const FALLBACK_RPS = 0.2
const FALLBACK_BURST = 1

const resolveRegion = (region?: Region | string): Region => {
    const value = region ?? Region.EU
    const key = (typeof value === "string" ? value : Region[value as keyof typeof Region]).toLowerCase() as Region
    return key
}

export class SpApi {
    private readonly lwaClient: LwaClient
    private readonly client: SpClient
    private readonly tokenBuckets: TokenBuckets
    private readonly fetchImpl: typeof fetch
    private readonly logger: Pick<Console, "debug" | "warn"> | Console
    private readonly middleware: Middleware[]

    public readonly reports: ReportsClient
    public readonly finances: FinancesClient

    static version = packageJson.version
    static userAgent = `${packageJson.name}/${packageJson.version} (Language=TypeScript) (Platform=Node.js/${process.version})`
    static Endpoint = Endpoint
    /**
     * @deprecated Use `Region` instead
     */
    static SpRegion = Region
    static Region = Region
    static LwaClient = LwaClient
    static Marketplace = Marketplace
    static Report = Report
    static Query = Query
    static FulfillmentNetwork = FulfillmentNetwork
    static SpError = SpError
    static TokenBucket = TokenBucket

    constructor(config: SpApiConfig) {
        const region = resolveRegion(config.region)
        const endpointConfig = Endpoint[region]
        if (!endpointConfig) throw new SpValidationError("Invalid region")

        this.fetchImpl = config.fetch ?? globalThis.fetch.bind(globalThis)
        this.logger = (config.logger as any) ?? console

        const baseUrl = config.endpointOverride?.sellingPartnerApi ?? (config.sandbox ? endpointConfig.sandbox : endpointConfig.api)
        const lwaEndpoint = config.endpointOverride?.lwa ?? endpointConfig.token

        this.lwaClient =
            config.lwaClient ??
            new LwaClient({
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
                accessToken: config.accessToken,
                region,
                scopes: config.scopes,
                tokenEndpoint: lwaEndpoint,
                fetch: this.fetchImpl,
            })

        this.client = createClient<paths, "application/json">({
            baseUrl,
            fetch: this.fetchImpl,
            headers: {
                "Content-Type": "application/json",
                "User-Agent": SpApi.userAgent,
            },
        })

        this.tokenBuckets = config.rateLimiters ? { ...config.rateLimiters } : {}

        const authMiddleware: Middleware = {
            onRequest: async ({ request }) => {
                const token = await this.lwaClient.getAccessToken()
                request.headers.set("x-amz-access-token", token)
                return request
            },
        }

        const rateLimitMiddleware: Middleware = {
            onRequest: async ({ request, schemaPath }) => {
                const limiter = this.ensureRateLimiter(schemaPath as SchemaPath)
                await limiter.removeTokens(1)
                return request
            },
            onResponse: async ({ response, schemaPath }) => {
                const path = schemaPath as SchemaPath
                const limiter = this.tokenBuckets[path]
                if (!limiter) return response

                const header = response.headers.get("x-amzn-RateLimit-Limit")
                if (header) {
                    const rps = Number.parseFloat(header)
                    if (!Number.isNaN(rps) && rps > 0 && limiter.tokensPerInterval !== rps) {
                        limiter.tokensPerInterval = rps
                        this.logger?.debug?.(`Adjusted rate limiter for ${path} to ${rps} rps`)
                    }
                }

                if (response.status === 429) {
                    limiter.content = 0
                    this.logger?.warn?.(`Rate limit exceeded for ${path}`)
                }

                return response
            },
        }

        const querySerializerMiddleware: Middleware = {
            onRequest: async ({ request, params }) => {
                if (params.query && request.url.includes("?")) {
                    const url = new URL(request.url)
                    Object.entries(params.query).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            url.searchParams.delete(key)
                            url.searchParams.append(key, value.join(","))
                        }
                    })
                    request = new Request(url.toString(), request)
                }
                return request
            },
        }

        this.middleware = [authMiddleware, rateLimitMiddleware, querySerializerMiddleware, ...(config.middleware ?? [])]
        this.client.use(...this.middleware)

        this.reports = new ReportsClient(this)
        this.finances = new FinancesClient(this)
    }

    private ensureRateLimiter(schemaPath: SchemaPath) {
        if (this.tokenBuckets[schemaPath]) return this.tokenBuckets[schemaPath]!

        const [requestsPerWindow, bucketSize, windowSeconds = 60] = rateLimits[schemaPath] ?? [FALLBACK_RPS * 60, FALLBACK_BURST, 60]
        const tokensPerInterval = requestsPerWindow / windowSeconds

        const limiter = new TokenBucket({
            bucketSize,
            tokensPerInterval,
            interval: "second",
        })
        limiter.content = bucketSize
        this.tokenBuckets[schemaPath] = limiter
        this.logger?.debug?.(
            `Created rate limiter for ${schemaPath}: ${requestsPerWindow} requests/${windowSeconds}s (burst ${bucketSize})`
        )
        return limiter
    }

    public setRateLimiter(schemaPath: SchemaPath, rateLimiter: TokenBucket) {
        this.tokenBuckets[schemaPath] = rateLimiter
    }

    public getClient() {
        return this.client
    }

    public getFetch() {
        return this.fetchImpl
    }

    public getLwaClient() {
        return this.lwaClient
    }

    public getAccessToken() {
        return this.lwaClient.getAccessToken()
    }
}
