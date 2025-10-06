const DEFAULT_DELIMITER = "\t"

export interface ParseDelimitedOptions {
    delimiter?: string
    skipEmptyLines?: boolean
    trimFields?: boolean
    headers?: string[]
}

const toText = (input: string | Uint8Array) =>
    typeof input === "string" ? input : new TextDecoder("utf-8").decode(input)

const splitLine = (line: string, delimiter: string, trim: boolean) => {
    const cells: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
            continue
        }

        if (char === delimiter && !inQuotes) {
            cells.push(trim ? current.trim() : current)
            current = ""
            continue
        }

        current += char
    }

    cells.push(trim ? current.trim() : current)
    return cells
}

export function parseDelimitedReport(source: string | Uint8Array, options: ParseDelimitedOptions = {}) {
    const delimiter = options.delimiter ?? DEFAULT_DELIMITER
    const trim = options.trimFields ?? true
    const skipEmpty = options.skipEmptyLines ?? true

    const raw = toText(source)
    const lines = raw.split(/\r?\n/)

    let headerCells = options.headers ?? []
    const rows: Record<string, string>[] = []

    for (const line of lines) {
        if (!headerCells.length) {
            const candidate = line.trim()
            if (!candidate && skipEmpty) continue
            headerCells = splitLine(line, delimiter, trim)
            continue
        }

        if (!line && skipEmpty) continue

        const values = splitLine(line.replace(/\r$/, ""), delimiter, trim)
        if (skipEmpty && values.every((value) => value === "")) continue

        const record: Record<string, string> = {}
        for (let index = 0; index < headerCells.length; index++) {
            const key = headerCells[index] ?? `column_${index}`
            record[key] = values[index] ?? ""
        }
        rows.push(record)
    }

    return rows
}
