import type { SpApi, SpClient } from "../core"
import { SpResponseError } from "../lib/errors"
import type { paths } from "../paths"

const FINANCIAL_EVENTS_PATH = "/finances/v0/financialEvents" as const

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type OperationResponse<T> = T extends { responses: infer Responses }
    ? {
            [Status in keyof Responses]: Responses[Status] extends { content: { "application/json": infer Body } }
                ? Body
                : never
        }[keyof Responses]
    : never

type GetFinancialEventsOperation = paths[typeof FINANCIAL_EVENTS_PATH]["get"]
type GetFinancialEventsResponse = OperationResponse<GetFinancialEventsOperation>
type GetFinancialEventsQuery = {
    NextToken?: string
    MaxResultsPerPage?: number
    [key: string]: unknown
}

type IterateOptions = {
    pageSize?: number
    delayMs?: number
    logger?: Pick<Console, "debug" | "warn" | "error">
}

export interface FinancialEventsPage {
    payload: NonNullable<GetFinancialEventsResponse>["payload"]
    rateLimit?: number
    statusCode?: number
}

export class FinancesClient {
    private readonly client: SpClient

    constructor(private readonly api: SpApi) {
        this.client = api.getClient()
    }

    async getFinancialEvents(query: GetFinancialEventsQuery): Promise<GetFinancialEventsResponse> {
        const { data, error, response } = await this.client.GET(FINANCIAL_EVENTS_PATH, {
            params: { query },
        })
        if (error) throw error
    const status = (response as Response | undefined)?.status ?? 500
    if (!data) throw new SpResponseError("Empty response from getFinancialEvents", status)
        return data
    }

    async *iterateFinancialEvents(
        query: GetFinancialEventsQuery,
        options: IterateOptions = {}
    ): AsyncGenerator<FinancialEventsPage, void, void> {
        let nextToken: string | undefined = query.NextToken as string | undefined
        const pageSize = options.pageSize

        do {
            const params: GetFinancialEventsQuery = {
                ...query,
                ...(nextToken ? { NextToken: nextToken } : {}),
                ...(pageSize ? { MaxResultsPerPage: pageSize } : {}),
            }

            const { data, error, response } = await this.client.GET(FINANCIAL_EVENTS_PATH, {
                params: { query: params },
            })

            if (error) throw error
            const status = (response as Response | undefined)?.status ?? 500
            if (!data) throw new SpResponseError("Empty response from getFinancialEvents", status)

            const rateLimitHeader = response?.headers?.get("x-amzn-ratelimit-limit")
            const rateLimit = rateLimitHeader ? Number.parseFloat(rateLimitHeader) : undefined

            yield {
                payload: data.payload,
                rateLimit,
                statusCode: (response as Response | undefined)?.status,
            }

            nextToken = data.payload?.NextToken ?? undefined

            if (nextToken && options.delayMs) {
                options.logger?.debug?.(`Waiting ${options.delayMs}ms before fetching next financial events page`)
                await sleep(options.delayMs)
            }
        } while (nextToken)
    }
}
