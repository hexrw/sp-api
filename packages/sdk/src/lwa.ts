import {
    SpAuthError,
    SpValidationError,
    SpResponseError,
    SpNetworkError,
    SpUnknownError,
    SpError,
} from "./lib/errors"
import { Endpoint } from "./consts"
import { Region } from "./enums"

export interface LwaClientConfig {
    clientId: string
    clientSecret: string
    refreshToken?: string
    scopes?: string | string[]
    region?: Region | string
    accessToken?: string
    tokenEndpoint?: string
    fetch?: typeof fetch
}

const DEFAULT_TIMEOUT = 10_000

const toScopeArray = (scopes?: string | string[]) =>
    Array.isArray(scopes) ? scopes : scopes ? [scopes] : []

const resolveRegionKey = (region?: Region | string) => {
    const value = region ?? Region.EU
    const key = (typeof value === "string" ? value : Region[value as keyof typeof Region]).toLowerCase() as Region
    if (!Endpoint[key]) throw new SpValidationError("Invalid region")
    return key
}

export class LwaClient {
    public accessToken?: string
    public accessTokenExpiresAt?: Date

    private readonly clientId: string
    private readonly clientSecret: string
    private readonly refreshToken?: string
    private readonly scopes: string[]
    private readonly tokenEndpoint: string
    private readonly fetchImpl: typeof fetch

    constructor(config: LwaClientConfig) {
        const { clientId, clientSecret, refreshToken, scopes, region, tokenEndpoint, accessToken, fetch } = config
        if (!clientId || !clientSecret) throw new SpAuthError("Missing credentials")

        const regionKey = resolveRegionKey(region)
        const endpoint = Endpoint[regionKey]

        this.clientId = clientId
        this.clientSecret = clientSecret
        this.refreshToken = refreshToken
        this.scopes = toScopeArray(scopes)
        this.tokenEndpoint = tokenEndpoint ?? endpoint.token
        this.fetchImpl = fetch ?? globalThis.fetch.bind(globalThis)
        this.accessToken = accessToken

        if (!this.refreshToken && this.scopes.length === 0 && !this.accessToken) {
            throw new SpAuthError("Provide either a refresh token, pre-fetched access token, or scopes for grantless flows")
        }
    }

    private async refreshAccessToken(retry = 0): Promise<{ value: string; expiresAt: Date } | null> {
        if (this.accessToken && this.accessTokenExpiresAt && new Date() < this.accessTokenExpiresAt) {
            return { value: this.accessToken, expiresAt: this.accessTokenExpiresAt }
        }

        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
        })

        if (this.refreshToken) {
            params.set("grant_type", "refresh_token")
            params.set("refresh_token", this.refreshToken)
        } else {
            params.set("grant_type", "client_credentials")
            params.set("scope", this.scopes.join(" "))
        }

        try {
            const response = await this.fetchImpl(this.tokenEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
                signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
            })

            if (!response.ok) {
                const errorText = await response.text().catch(() => undefined)
                throw new SpResponseError("Failed to get access token", response.status, errorText)
            }

            const payload = await response.json().catch((error) => {
                throw new SpValidationError("Invalid JSON response from LWA token endpoint", error)
            })

            const { access_token, expires_in, error, error_description } = payload
            if (!access_token || !expires_in || error) {
                throw new SpAuthError("Failed to get access token", { error, error_description })
            }

            const expiresAt = new Date(Date.now() + Number(expires_in) * 1000)
            return { value: access_token, expiresAt }
        } catch (error) {
            if (error instanceof SpError) throw error
            if (error instanceof TypeError) throw new SpNetworkError("Network error while fetching access token", error)

            if (retry < 3) {
                const delay = 2 ** retry * 1000
                await new Promise((resolve) => setTimeout(resolve, delay))
                return this.refreshAccessToken(retry + 1)
            }

            throw new SpUnknownError("Unknown error while fetching access token", error)
        }
    }

    async getAccessToken() {
        const token = await this.refreshAccessToken()
        if (!token) throw new SpAuthError("Failed to refresh access token")

        this.accessToken = token.value
        this.accessTokenExpiresAt = token.expiresAt
        return this.accessToken
    }

    invalidate() {
        this.accessToken = undefined
        this.accessTokenExpiresAt = undefined
    }
}
