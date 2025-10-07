import { describe, it, expect } from "vitest"
import * as sdk from "./index"

describe("package entrypoint", () => {
    it("exposes primary classes and helpers", () => {
        expect(sdk.SpApi).toBeDefined()
        expect(sdk.ReportsClient).toBeDefined()
        expect(sdk.LwaClient).toBeDefined()
        expect(sdk.Region).toBeDefined()
    })
})
