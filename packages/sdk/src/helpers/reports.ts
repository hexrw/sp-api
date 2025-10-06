import { SpResponseError, SpValidationError, SpError } from "../lib/errors"
import type { SpApi, SpClient } from "../core"
import type { CreateReportOptions } from "../types"
import type { operations } from "../paths"
import { parseDelimitedReport } from "./report-parser"

const REPORTS_PATH = "/reports/2021-06-30/reports" as const
const REPORT_PATH = "/reports/2021-06-30/reports/{reportId}" as const
const DOCUMENT_PATH = "/reports/2021-06-30/documents/{reportDocumentId}" as const

const DEFAULT_POLL_INTERVAL = 5_000
const DEFAULT_TIMEOUT = 5 * 60 * 1000

type OperationResponse<T> = T extends { responses: infer Responses }
    ? {
            [Status in keyof Responses]: Responses[Status] extends { content: { "application/json": infer Body } }
                ? Body
                : never
        }[keyof Responses]
    : never

type OperationRequestBody<T> = T extends { requestBody: { content: { "application/json": infer Body } } } ? Body : never

type OperationPathParams<T> = T extends { parameters: { path: infer Path } } ? Path : Record<string, never>

type OperationQueryParams<T> = T extends { parameters: { query: infer Query } } ? Query : Record<string, never>

type CreateReportOperation = operations["createReport"]
type GetReportOperation = operations["getReport"]
type ListReportsOperation = operations["getReports"]
type CancelReportOperation = operations["cancelReport"]
type GetDocumentOperation = operations["getReportDocument"]

type CreateReportResponse = OperationResponse<CreateReportOperation>
type CreateReportPayload = OperationRequestBody<CreateReportOperation>
type GetReportResponse = OperationResponse<GetReportOperation>
type GetReportParams = OperationPathParams<GetReportOperation>
type ListReportsResponse = OperationResponse<ListReportsOperation>
type ListReportsQuery = OperationQueryParams<ListReportsOperation>
type CancelReportParams = OperationPathParams<CancelReportOperation>
type GetDocumentResponse = OperationResponse<GetDocumentOperation>
type GetDocumentParams = OperationPathParams<GetDocumentOperation>

type ReportPayload = {
    reportId: string
    createdTime?: string
    processingStatus?: string
    reportDocumentId?: string | null
    [key: string]: unknown
}

type DocumentPayload = {
    reportDocumentId: string
    url: string
    compressionAlgorithm?: string | null
    [key: string]: unknown
}

type ByteArray = Uint8Array<ArrayBuffer>

type WaitOptions = {
    intervalMs?: number
    timeoutMs?: number
    onStatus?: (status: ReportPayload["processingStatus"]) => void
}

type DownloadOptions = {
    decompress?: boolean
    encoding?: string
}

export interface ReportDownload {
    bytes: ByteArray
    contentType: string | null
    compression: string | null | undefined
    metadata: DocumentPayload
    toText(encoding?: string): string
    toJSON<T>() : T
    toRows(delimiter?: string): Record<string, string>[]
}

export interface ReportSummary {
    id: string
    createdAt?: string
    processingStatus?: ReportPayload["processingStatus"]
    reportDocumentId?: string | null
}

export class ReportsClient {
    private readonly api: SpApi
    private readonly client: SpClient
    private readonly fetchImpl: typeof fetch

    constructor(api: SpApi) {
        this.api = api
        this.client = api.getClient()
        this.fetchImpl = api.getFetch()
    }

    async create(options: CreateReportOptions): Promise<CreateReportResponse> {
        const body: CreateReportPayload = {
            reportType: options.reportType,
            marketplaceIds: options.marketplaces ?? [],
            ...(options.startDate ? { dataStartTime: options.startDate } : {}),
            ...(options.endDate ? { dataEndTime: options.endDate } : {}),
            ...(options.options
                ? {
                      reportOptions: Object.fromEntries(
                          Object.entries(options.options).map(([key, value]) => [key, value == null ? "" : String(value)]),
                      ),
                  }
                : {}),
        }

        const { data, error, response } = await this.client.POST(REPORTS_PATH, { body })
        if (error) throw error
        if (!data) throw new SpResponseError("Empty response from createReport", (response as Response | undefined)?.status ?? 500)
        return data
    }

    async list(query?: ListReportsQuery): Promise<ListReportsResponse> {
        const { data, error, response } = await this.client.GET(REPORTS_PATH, {
            params: query ? { query } : undefined,
        })
        if (error) throw error
        if (!data) throw new SpResponseError("Empty response from getReports", (response as Response | undefined)?.status ?? 500)
        return data
    }

    async get(reportId: string): Promise<GetReportResponse> {
        const params: GetReportParams = { reportId }
        const { data, error, response } = await this.client.GET(REPORT_PATH, { params: { path: params } })
        if (error) throw error
        if (!data) throw new SpResponseError("Empty response from getReport", (response as Response | undefined)?.status ?? 500)
        return data
    }

    async cancel(reportId: string): Promise<void> {
        const params: CancelReportParams = { reportId }
        const { error, response } = await this.client.DELETE(REPORT_PATH, { params: { path: params } })
        if (error) throw error
        if (response.status >= 400) throw new SpResponseError("Failed to cancel report", response.status)
    }

    async waitForReport(reportId: string, options: WaitOptions = {}): Promise<GetReportResponse> {
        const interval = options.intervalMs ?? DEFAULT_POLL_INTERVAL
        const timeout = options.timeoutMs ?? DEFAULT_TIMEOUT
        const startedAt = Date.now()

        while (true) {
            if (Date.now() - startedAt > timeout) {
                throw new SpValidationError(`Timed out waiting for report ${reportId}`)
            }

            const report = await this.get(reportId)
            const payload = this.getReportPayload(report)
            const status = payload.processingStatus
            if (status) options.onStatus?.(status)

            if (status === "DONE" && payload.reportDocumentId) {
                return report
            }

            if (status === "FATAL" || status === "CANCELLED") {
                throw new SpResponseError(`Report ${reportId} terminated with status ${status}`, 500, report)
            }

            await new Promise((resolve) => setTimeout(resolve, interval))
        }
    }

    async getDocument(reportDocumentId: string): Promise<GetDocumentResponse> {
        const params: GetDocumentParams = { reportDocumentId }
        const { data, error, response } = await this.client.GET(DOCUMENT_PATH, { params: { path: params } })
        if (error) throw error
        if (!data) throw new SpResponseError("Empty response from getReportDocument", (response as Response | undefined)?.status ?? 500)
        return data
    }

    async download(reportDocumentId: string, options: DownloadOptions = {}): Promise<ReportDownload> {
    const document = await this.getDocument(reportDocumentId)
    const payload = this.getDocumentPayload(document)

        const response = await this.fetchImpl(payload.url)
        if (!response.ok) {
            const text = await response.text().catch(() => undefined)
            throw new SpResponseError("Failed to download report document", response.status, text)
        }

        const buffer = await response.arrayBuffer()
        let bytes = new Uint8Array(buffer) as ByteArray

        if (options.decompress !== false && payload.compressionAlgorithm === "GZIP") {
            bytes = await this.decompressGzip(bytes)
        }

        const defaultEncoding = options.encoding ?? "utf-8"
        let cachedText: string | undefined

        const decode = (encoding?: string) => {
            const useEncoding = encoding ?? defaultEncoding
            if (!encoding && cachedText !== undefined) return cachedText
            const text = new TextDecoder(useEncoding).decode(bytes)
            if (!encoding) cachedText = text
            return text
        }

        return {
            bytes,
            contentType: response.headers.get("content-type"),
            compression: payload.compressionAlgorithm,
            metadata: payload,
            toText: (encoding?: string) => decode(encoding),
            toJSON: <T>() => {
                try {
                    return JSON.parse(decode()) as T
                } catch (error) {
                    throw new SpValidationError("Failed to parse report document as JSON", error)
                }
            },
            toRows: (delimiter?: string) => parseDelimitedReport(decode(), { delimiter }),
        }
    }

    private async decompressGzip(bytes: ByteArray): Promise<ByteArray> {
        if (typeof DecompressionStream !== "undefined") {
            const stream = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))
            const decompressed = await new Response(stream).arrayBuffer()
            return new Uint8Array(decompressed) as ByteArray
        }

        if (typeof process !== "undefined" && process.versions?.node) {
            const [{ gunzipSync }, { Buffer }] = await Promise.all([
                import("node:zlib"),
                import("node:buffer"),
            ])
            const result = gunzipSync(Buffer.from(bytes))
            const arrayBuffer = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength)
            return new Uint8Array(arrayBuffer) as ByteArray
        }

        throw new SpValidationError("GZIP decompression is not supported in this runtime. Provide pre-decompressed bytes instead.")
    }

    public toReportMeta(response: GetReportResponse): ReportSummary | undefined {
        const payload = this.getReportPayload(response)
        if (!payload) return undefined
        return {
            id: payload.reportId,
            createdAt: payload.createdTime,
            processingStatus: payload.processingStatus,
            reportDocumentId: payload.reportDocumentId,
        }
    }

    private getReportPayload(response: GetReportResponse): ReportPayload {
        if (response && typeof response === "object" && "payload" in response && response.payload) {
            return response.payload as ReportPayload
        }
        throw new SpResponseError("Missing report payload", 500, response)
    }

    private getDocumentPayload(response: GetDocumentResponse): DocumentPayload {
        if (response && typeof response === "object" && "payload" in response && response.payload) {
            return response.payload as DocumentPayload
        }
        throw new SpValidationError("Report document payload missing", response)
    }
}
