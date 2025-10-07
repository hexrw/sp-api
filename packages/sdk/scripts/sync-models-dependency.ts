import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(currentDir, "..", "..")
const modelsPackagePath = resolve(repoRoot, "models", "package.json")
const sdkPackagePath = resolve(repoRoot, "sdk", "package.json")

function readJson(path: string) {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>
}

const modelsPackage = readJson(modelsPackagePath)
const sdkPackage = readJson(sdkPackagePath)

const modelsVersion = modelsPackage.version
if (typeof modelsVersion !== "string") {
    throw new Error("Failed to resolve models package version")
}

const expectedRange = `^${modelsVersion}`
sdkPackage.dependencies ??= {}

const currentRange = sdkPackage.dependencies["@selling-partner-api/models"]
if (currentRange === expectedRange) {
    console.log(`[sync-models] dependency already set to ${expectedRange}`)
    process.exit(0)
}

sdkPackage.dependencies["@selling-partner-api/models"] = expectedRange
writeFileSync(sdkPackagePath, `${JSON.stringify(sdkPackage, null, 4)}\n`)
console.log(`[sync-models] updated @selling-partner-api/models to ${expectedRange}`)
