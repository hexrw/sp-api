import { describe, test, expect } from "bun:test"
import * as sdk from "./index"

describe("sp-sdk", () => {
    test("exports something", () => {
        expect(sdk).toBeDefined()
    })
})
