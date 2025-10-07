import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { FinancesClient } from "./finances"
import type { SpApi } from "../core"
import { SpResponseError } from "../lib/errors"

type ClientMock = {
    GET: ReturnType<typeof vi.fn>
}

describe("FinancesClient", () => {
    let client: ClientMock
    let finances: FinancesClient

    beforeEach(() => {
        client = {
            GET: vi.fn(),
        }
        const apiMock = {
            getClient: () => client,
        } as unknown as SpApi
        finances = new FinancesClient(apiMock)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it("fetches financial events and validates payloads", async () => {
        const payload = { payload: { FinancialEvents: [] } }
        client.GET.mockResolvedValue({ data: payload, error: undefined, response: new Response(null, { status: 200 }) })
        const result = await finances.getFinancialEvents({ NextToken: "abc" })
        expect(result).toEqual(payload)
        expect(client.GET).toHaveBeenCalledWith("/finances/v0/financialEvents", { params: { query: { NextToken: "abc" } } })

        client.GET.mockResolvedValue({ data: undefined, error: undefined, response: new Response(null, { status: 200 }) })
        await expect(finances.getFinancialEvents({})).rejects.toBeInstanceOf(SpResponseError)
    })

    it("iterates through paginated financial events", async () => {
        vi.useFakeTimers()
        const logger = { debug: vi.fn(), warn: vi.fn(), error: vi.fn() }
        client.GET
            .mockResolvedValueOnce({
                data: { payload: { FinancialEvents: [], NextToken: "next" } },
                error: undefined,
                response: new Response(null, { status: 200, headers: { "x-amzn-ratelimit-limit": "1.5" } }),
            })
            .mockResolvedValueOnce({
                data: { payload: { FinancialEvents: [] } },
                error: undefined,
                response: new Response(null, { status: 200 }),
            })

        const pages: any[] = []
        const iterator = finances.iterateFinancialEvents({}, { pageSize: 50, delayMs: 25, logger })

        const first = await iterator.next()
        pages.push(first.value)

        const pendingSecond = iterator.next()
        await vi.advanceTimersByTimeAsync(25)
        const second = await pendingSecond
        pages.push(second.value)
        const done = await iterator.next()
        expect(done.done).toBe(true)

        expect(pages[0]).toMatchObject({ rateLimit: 1.5, statusCode: 200 })
        expect(pages[1]).toMatchObject({ statusCode: 200 })
        expect(logger.debug).toHaveBeenCalledWith("Waiting 25ms before fetching next financial events page")
        expect(client.GET).toHaveBeenCalledTimes(2)
    })
})
