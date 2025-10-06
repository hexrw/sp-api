#!/usr/bin/env bun

import { merge, isErrorResult, type MergeInput } from "openapi-merge"
import openapiTs, { astToString } from "openapi-typescript"
import swagger2openapi from "swagger2openapi"
import { Glob } from "bun"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync, mkdirSync } from "node:fs"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(scriptDir, "..")
const repoRoot = resolve(packageRoot, "..", "..")
const SOURCE_DIR = resolve(repoRoot, "vendor/selling-partner-api-models/models")
const OUTPUT_DIR = resolve(packageRoot, "src")

const AWS_ACCESS_KEY_PATTERN = /\b(?:A3T|AKIA|ASIA|AGPA|AIDA|ABIA|ACCA|ADIA|ANPA|ANVA|AROA|ANPA)[0-9A-Z]{16}\b/g
const AWS_CREDENTIAL_QUERY_PATTERN = /(X-Amz-Credential=)([A-Z0-9]{20})/g
const AWS_PLACEHOLDER = "AWSACCESSKEYIDREDACTED"

const sanitizeAwsCredentials = <T>(value: T): T => {
    if (typeof value === "string") {
        const sanitized = value
            .replace(AWS_CREDENTIAL_QUERY_PATTERN, (_, prefix) => `${prefix}${AWS_PLACEHOLDER}`)
            .replace(AWS_ACCESS_KEY_PATTERN, AWS_PLACEHOLDER)
        return sanitized as unknown as T
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeAwsCredentials(item)) as unknown as T
    }

    if (value && typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>).map(([key, val]) => [
            key,
            sanitizeAwsCredentials(val),
        ])
        return Object.fromEntries(entries) as T
    }

    return value
}

if (!existsSync(SOURCE_DIR)) {
    throw new Error(
        `Expected vendor models at ${SOURCE_DIR}. Ensure the git submodule vendor/selling-partner-api-models is initialised.`
    )
}

mkdirSync(OUTPUT_DIR, { recursive: true })

const glob = new Glob("**/*.json")

const models: MergeInput = []

for (const relativePath of glob.scanSync(SOURCE_DIR)) {
    const absolutePath = resolve(SOURCE_DIR, relativePath)
    const name = relativePath.split("/").pop() || relativePath.replace(/.*\//, "")
    const nameWithoutExtension = name.replace(/\.json$/, "")
    const content = await Bun.file(absolutePath).text()
    if (!content) {
        console.error(`Error reading file: ${relativePath}`)
        continue
    }

    try {
        const swagger = JSON.parse(content)
        const { openapi } = await swagger2openapi.convertObj(swagger, { patch: true, warnOnly: true })
        models.push({
            oas: {
                ...(openapi as any),
                info: {
                    ...openapi?.info,
                    title: "Selling Partner API",
                },
            },
            dispute: {
                prefix: `${nameWithoutExtension}_`,
                alwaysApply: true,
            },
            description: {
                title: {
                    value: nameWithoutExtension,
                    headingLevel: 2,
                },
                append: true,
            },
        })
    } catch (error) {
        console.error(`Error parsing JSON from file: ${relativePath}: ${content.slice(0, 100)}...`)
        continue
    }
}

const mergeResult = merge(models)

if (isErrorResult(mergeResult)) {
    // Oops, something went wrong
    console.error(`${mergeResult.message} (${mergeResult.type})`)
} else {
    console.log(`Merge successful!`)

    const sanitizedSpec = sanitizeAwsCredentials(mergeResult.output)

    // Write the result to ./dist/merged.json, overwriting it if it exists, creating it if it doesn't
    const outputPath = resolve(OUTPUT_DIR, "merged.json")
    await Bun.write(outputPath, JSON.stringify(sanitizedSpec, null, 2))
    console.log(`Merged OpenAPI specs written to ${outputPath}`)

    // Generate TypeScript OpenAPI paths for use in client
    console.log("Generating OpenAPI TypeScript paths AST")
    const ast = await openapiTs(sanitizedSpec as any, {
        alphabetize: true,
        emptyObjectsUnknown: true,
    })
    console.log("OpenAPI TypeScript paths AST generated, converting to string contents")
    const paths = astToString(ast)
    const pathsOutputPath = resolve(OUTPUT_DIR, "paths.ts")
    await Bun.write(pathsOutputPath, paths)
    console.log(`OpenAPI TypeScript paths written to ${pathsOutputPath}`)
    console.log("OpenAPI TypeScript paths generated successfully")
}
