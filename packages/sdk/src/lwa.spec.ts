import { afterEach, describe, expect, it, vi } from "vitest"
import { LwaClient } from "./lwa"
import { Region } from "./enums"
import { SpAuthError, SpNetworkError, SpResponseError, SpUnknownError, SpValidationError } from "./lib/errors"

describe("LwaClient", () => {
    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    const successResponse = (token: string, expiresIn = 3600) =>
        new Response(JSON.stringify({ access_token: token, expires_in: expiresIn }), {
            status: 200,
            headers: { "content-type": "application/json" },
        })

    it("requires essential credentials", () => {
        expect(() => new LwaClient({ clientId: "id", clientSecret: "" as any })).toThrow(SpAuthError)
        expect(() => new LwaClient({ clientId: "", clientSecret: "secret" } as any)).toThrow(SpAuthError)
        expect(() =>
            new LwaClient({ clientId: "id", clientSecret: "secret", region: "mars" as any, refreshToken: "rt" }),
        ).toThrow(SpValidationError)
    })

    it("refreshes tokens using the refresh token grant", async () => {
        const fetchMock = vi.fn(async () => successResponse("token-123"))
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            refreshToken: "refresh",
            fetch: fetchMock as unknown as typeof fetch,
        })
        const token = await client.getAccessToken()
        expect(token).toBe("token-123")
        expect(fetchMock).toHaveBeenCalledTimes(1)
        const firstCall = (fetchMock.mock as any).calls?.[0] ?? []
        const url = firstCall[0]
        const init = firstCall[1]
        expect(url).toBe("https://api.amazon.co.uk/auth/o2/token")
        const body = init?.body as URLSearchParams
        expect(body.get("grant_type")).toBe("refresh_token")
        expect(body.get("refresh_token")).toBe("refresh")

        // cached token should be reused
        const cached = await client.getAccessToken()
        expect(cached).toBe("token-123")
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("supports grantless client credential flows", async () => {
        const fetchMock = vi.fn(async () => successResponse("grantless"))
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            scopes: ["sellingpartnerapi::notifications"],
            fetch: fetchMock as unknown as typeof fetch,
        })
        const token = await client.getAccessToken()
        expect(token).toBe("grantless")
        const params = (fetchMock.mock as any).calls?.[0]?.[1]?.body as URLSearchParams
        expect(params.get("grant_type")).toBe("client_credentials")
    })

    it("retries unknown failures with exponential backoff", async () => {
        vi.useFakeTimers()
        const fetchMock = vi.fn()
        fetchMock.mockRejectedValueOnce(new Error("boom"))
        fetchMock.mockResolvedValueOnce(successResponse("retry-token"))

        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            refreshToken: "refresh",
            fetch: fetchMock as unknown as typeof fetch,
        })
        const promise = client.getAccessToken()
        await vi.advanceTimersByTimeAsync(1000)
        const token = await promise
        expect(token).toBe("retry-token")
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("maps network errors to SpNetworkError", async () => {
        const fetchMock = vi.fn(async () => {
            throw new TypeError("network")
        })
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            refreshToken: "refresh",
            fetch: fetchMock as unknown as typeof fetch,
        })
        await expect(client.getAccessToken()).rejects.toBeInstanceOf(SpNetworkError)
    })

    it("forwards API errors with response context", async () => {
        const response = new Response(JSON.stringify({ error: "invalid_client" }), { status: 400 })
        const fetchMock = vi.fn(async () => response)
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            refreshToken: "refresh",
            fetch: fetchMock as unknown as typeof fetch,
        })
    await expect(client.getAccessToken()).rejects.toBeInstanceOf(SpResponseError)

        const badJson = new Response("<html>", { status: 200 })
        fetchMock.mockResolvedValueOnce(badJson)
        await expect(client.getAccessToken()).rejects.toBeInstanceOf(SpValidationError)
    })

    it("throws SpUnknownError after exhausting retries", async () => {
        vi.useFakeTimers()
        const fetchMock = vi.fn(async () => {
            throw new Error("fatal")
        })
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            refreshToken: "refresh",
            fetch: fetchMock as unknown as typeof fetch,
        })
    const promise = client.getAccessToken()
    const expectation = expect(promise).rejects.toBeInstanceOf(SpUnknownError)
    await vi.advanceTimersByTimeAsync(7000)
    await expectation
        expect(fetchMock).toHaveBeenCalledTimes(4)
    })

    it("accepts pre-provisioned access tokens", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: "invalid_request" }), { status: 400 }))
        const client = new LwaClient({
            clientId: "id",
            clientSecret: "secret",
            accessToken: "prefetched",
            region: Region.NA,
            fetch: fetchMock as unknown as typeof fetch,
        })
        client.accessTokenExpiresAt = new Date(Date.now() + 60_000)
        await expect(client.getAccessToken()).resolves.toBe("prefetched")
        client.invalidate()
        await expect(client.getAccessToken()).rejects.toBeInstanceOf(SpResponseError)
    })
})
