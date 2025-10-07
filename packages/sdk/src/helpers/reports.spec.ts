import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ReportsClient } from "./reports"
import { SpResponseError, SpValidationError } from "../lib/errors"
import type { SpApi } from "../core"
import { gzipSync } from "node:zlib"
import { Buffer } from "node:buffer"

type ClientMock = {
    POST: ReturnType<typeof vi.fn>
    GET: ReturnType<typeof vi.fn>
    DELETE: ReturnType<typeof vi.fn>
}

const createClient = (): ClientMock => ({
    POST: vi.fn(),
    GET: vi.fn(),
    DELETE: vi.fn(),
})

describe("ReportsClient", () => {
    let client: ClientMock
    let fetchMock: ReturnType<typeof vi.fn>
    let reports: ReportsClient

    beforeEach(() => {
        client = createClient()
        fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "content-type": "application/json" } }))
        const apiMock = {
            getClient: () => client,
            getFetch: () => fetchMock,
        } as unknown as SpApi
        reports = new ReportsClient(apiMock)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it("creates reports with transformed options", async () => {
        const payload = { reportId: "123" }
        client.POST.mockResolvedValue({ data: payload, error: undefined, response: new Response(null, { status: 201 }) })

        const result = await reports.create({
            reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
            marketplaces: ["A"],
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-01-02T00:00:00Z",
            options: { scheduled: true, value: 10 },
        })

        expect(result).toEqual(payload)
        expect(client.POST).toHaveBeenCalledWith("/reports/2021-06-30/reports", {
            body: {
                reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
                marketplaceIds: ["A"],
                dataStartTime: "2024-01-01T00:00:00Z",
                dataEndTime: "2024-01-02T00:00:00Z",
                reportOptions: { scheduled: "true", value: "10" },
            },
        })
    })

    it("throws when create returns an empty payload", async () => {
        client.POST.mockResolvedValue({ data: undefined, error: undefined, response: new Response(null, { status: 200 }) })
        await expect(reports.create({ reportType: "GET_MERCHANT_LISTINGS_ALL_DATA" })).rejects.toBeInstanceOf(SpResponseError)
    })

    it("lists reports with query parameters", async () => {
        const response = { payload: { reports: [] } }
        client.GET.mockResolvedValue({ data: response, error: undefined, response: new Response(null, { status: 200 }) })
        const result = await reports.list({ processingStatuses: ["DONE"] } as any)
        expect(result).toEqual(response)
        expect(client.GET).toHaveBeenCalledWith("/reports/2021-06-30/reports", { params: { query: { processingStatuses: ["DONE"] } } })
    })

    it("retrieves a report and surfaces errors", async () => {
        const reportPayload = { payload: { reportId: "r1" } }
        client.GET.mockResolvedValueOnce({ data: reportPayload, error: undefined, response: new Response(null, { status: 200 }) })
        const report = await reports.get("r1")
        expect(report).toEqual(reportPayload)

        client.GET.mockResolvedValueOnce({ data: undefined, error: undefined, response: new Response(null, { status: 200 }) })
        await expect(reports.get("missing")).rejects.toBeInstanceOf(SpResponseError)
    })

    it("cancels a report and throws on failure", async () => {
        client.DELETE.mockResolvedValueOnce({ error: undefined, response: new Response(null, { status: 202 }) })
        await expect(reports.cancel("r1")).resolves.toBeUndefined()

        client.DELETE.mockResolvedValueOnce({ error: undefined, response: new Response(null, { status: 500 }) })
        await expect(reports.cancel("r1")).rejects.toBeInstanceOf(SpResponseError)
    })

    it("waits for a report to complete", async () => {
        vi.useFakeTimers()
        const finalReport = { payload: { reportId: "r1", processingStatus: "DONE", reportDocumentId: "doc" } }
        vi.spyOn(reports, "get")
            .mockResolvedValueOnce({ payload: { reportId: "r1", processingStatus: "IN_PROGRESS" } } as any)
            .mockResolvedValueOnce(finalReport as any)

        const statuses: string[] = []
        const promise = reports.waitForReport("r1", { intervalMs: 10, timeoutMs: 100, onStatus: (status) => statuses.push(status ?? "") })
        await vi.advanceTimersByTimeAsync(10)
        const result = await promise
        expect(result).toEqual(finalReport)
        expect(statuses).toEqual(["IN_PROGRESS", "DONE"])
    })

    it("throws when report terminates fatally", async () => {
        vi.spyOn(reports, "get").mockResolvedValue({ payload: { reportId: "r1", processingStatus: "FATAL" } } as any)
        await expect(reports.waitForReport("r1", { intervalMs: 1, timeoutMs: 10 })).rejects.toBeInstanceOf(SpResponseError)
    })

    it("times out when a report never reaches completion", async () => {
        vi.useFakeTimers()
        vi.spyOn(reports, "get").mockResolvedValue({ payload: { reportId: "r1", processingStatus: "IN_PROGRESS" } } as any)
    const promise = reports.waitForReport("r1", { intervalMs: 5, timeoutMs: 10 })
    const expectation = expect(promise).rejects.toBeInstanceOf(SpValidationError)
    await vi.advanceTimersByTimeAsync(15)
    await expectation
    })

    it("downloads, decompresses and decodes report documents", async () => {
        const documentResponse = { payload: { reportDocumentId: "doc", url: "https://example.com/doc", compressionAlgorithm: "GZIP" } }
        vi.spyOn(reports, "getDocument").mockResolvedValue(documentResponse as any)

        const json = JSON.stringify({ value: 42, status: "DONE" })
        const gzipped = gzipSync(Buffer.from(json))
        const bytes = new Uint8Array(gzipped.buffer, gzipped.byteOffset, gzipped.byteLength)
        const arrayBuffer = new ArrayBuffer(bytes.byteLength)
        new Uint8Array(arrayBuffer).set(bytes)

        fetchMock.mockResolvedValueOnce(new Response(arrayBuffer, {
            status: 200,
            headers: { "content-type": "text/plain" },
        }))

        const download = await reports.download("doc")
        expect(download.contentType).toBe("text/plain")
        expect(download.metadata).toEqual(documentResponse.payload)
        expect(download.toJSON<{ value: number; status: string }>()).toEqual({ value: 42, status: "DONE" })
        expect(download.toText()).toContain("value")
    })

    it("throws when report download fails", async () => {
        vi.spyOn(reports, "getDocument").mockResolvedValue({ payload: { reportDocumentId: "doc", url: "https://example.com" } } as any)
        fetchMock.mockResolvedValueOnce(new Response("fail", { status: 500 }))
        await expect(reports.download("doc")).rejects.toBeInstanceOf(SpResponseError)
    })

    it("derives report summaries", () => {
        const summary = reports.toReportMeta({ payload: { reportId: "1", createdTime: "now", processingStatus: "DONE" } } as any)
        expect(summary).toEqual({ id: "1", createdAt: "now", processingStatus: "DONE", reportDocumentId: undefined })
    })

    it("validates payload shapes", async () => {
        vi.spyOn(reports, "getDocument").mockResolvedValueOnce({} as any)
        await expect(reports.download("doc", { decompress: false })).rejects.toBeInstanceOf(SpValidationError)
    })
})
