import { describe, expect, it } from "vitest"
import { parseDelimitedReport } from "./report-parser"

describe("parseDelimitedReport", () => {
    it("parses TSV with quoted values and trims fields", () => {
        const source = "header1\theader2\n\"value\t1\"\t value2 \n\n"
        const rows = parseDelimitedReport(source)
        expect(rows).toEqual([
            {
                header1: "value\t1",
                header2: "value2",
            },
        ])
    })

    it("supports custom delimiters and headers", () => {
        const source = "1,2,3"
        const rows = parseDelimitedReport(source, { delimiter: ",", headers: ["x", "y", "z"], trimFields: false })
        expect(rows).toEqual([
            { x: "1", y: "2", z: "3" },
        ])
    })

    it("fills missing columns when data is sparse", () => {
        const source = "alpha\tbeta\tgamma\nvalue\t\t"
        const rows = parseDelimitedReport(source, { skipEmptyLines: false })
        expect(rows).toEqual([
            { alpha: "value", beta: "", gamma: "" },
        ])
    })
})
