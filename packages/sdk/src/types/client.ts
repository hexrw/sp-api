import type { Middleware } from "openapi-fetch"
import type { TokenBucket } from "limiter"
import type { paths } from "../paths"
import type { Region } from "../enums"
import type { LwaClient } from "../lwa"

export interface SpApiConfig {
    clientId: string
    clientSecret: string
    refreshToken?: string
    accessToken?: string
    region?: Region | string
    sandbox?: boolean
    scopes?: string | string[]
        lwaClient?: LwaClient
    fetch?: typeof fetch
    middleware?: Middleware[]
    rateLimiters?: Partial<Record<keyof paths, TokenBucket>>
    endpointOverride?: {
        sellingPartnerApi?: string
        lwa?: string
    }
    logger?: Pick<Console, "debug" | "warn"> | Console
}

export type SchemaPath = keyof paths
