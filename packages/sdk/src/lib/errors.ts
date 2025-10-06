export class SpError extends Error {
    code: string
    details?: any

    constructor(message: string, code: string, details?: any) {
        super(message)
        this.name = new.target.name || "SpError"
        this.code = code
        this.details = details
    }
}
export class SpAuthError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "AUTH_ERROR", details)
    }
}
export class SpRequestError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "REQUEST_ERROR", details)
    }
}
export class SpResponseError extends SpError {
    constructor(message: string, status: number, details?: any) {
        super(message, "RESPONSE_ERROR", { status, ...(details ?? {}) })
    }
}
export class SpValidationError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "VALIDATION_ERROR", details)
    }
}
export class SpRateLimitError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "RATE_LIMIT_ERROR", details)
    }
}
export class SpUnknownError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "UNKNOWN_ERROR", details)
    }
}
export class SpNotImplementedError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "NOT_IMPLEMENTED_ERROR", details)
    }
}
export class SpTimeoutError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "TIMEOUT_ERROR", details)
    }
}
export class SpNetworkError extends SpError {
    constructor(message: string, details?: any) {
        super(message, "NETWORK_ERROR", details)
    }
}