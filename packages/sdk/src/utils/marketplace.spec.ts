import { describe, expect, it } from "vitest"
import { nameToId, nameToIdMap, countryCodeToIdMap } from "./marketplace"
import { Marketplace } from "../enums"

describe("marketplace utilities", () => {
    it("maps marketplace display names", () => {
        expect(nameToId("Amazon.co.uk")).toBe(Marketplace.UK)
        expect(nameToIdMap["Amazon.com"]).toBe(Marketplace.US)
    })

    it("maps ISO country codes", () => {
        expect(countryCodeToIdMap.GB).toBe(Marketplace.UK)
        expect(countryCodeToIdMap.US).toBe(Marketplace.US)
    })
})
