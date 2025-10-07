import { describe, expect, it } from "vitest"
import {
    SpAuthError,
    SpError,
    SpNetworkError,
    SpNotImplementedError,
    SpRateLimitError,
    SpRequestError,
    SpResponseError,
    SpTimeoutError,
    SpUnknownError,
    SpValidationError,
} from "./errors"

describe("SDK error hierarchy", () => {
    it("encodes error metadata consistently", () => {
        const cases: [SpError, string][] = [
            [new SpAuthError("auth"), "AUTH_ERROR"],
            [new SpRequestError("req"), "REQUEST_ERROR"],
            [new SpResponseError("res", 418), "RESPONSE_ERROR"],
            [new SpValidationError("validation"), "VALIDATION_ERROR"],
            [new SpRateLimitError("rate"), "RATE_LIMIT_ERROR"],
            [new SpUnknownError("unknown"), "UNKNOWN_ERROR"],
            [new SpNotImplementedError("todo"), "NOT_IMPLEMENTED_ERROR"],
            [new SpTimeoutError("timeout"), "TIMEOUT_ERROR"],
            [new SpNetworkError("network"), "NETWORK_ERROR"],
        ]

        for (const [error, code] of cases) {
            expect(error).toBeInstanceOf(SpError)
            expect(error.code).toBe(code)
            expect(error.name).toContain("Sp")
        }

        const response = new SpResponseError("boom", 503, { message: "Service Unavailable" })
        expect(response.details).toEqual({ status: 503, message: "Service Unavailable" })
    })
})
