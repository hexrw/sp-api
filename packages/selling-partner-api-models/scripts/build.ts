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
    // Write the result to ./dist/merged.json, overwriting it if it exists, creating it if it doesn't
    const outputPath = resolve(OUTPUT_DIR, "merged.json")
    await Bun.write(outputPath, JSON.stringify(mergeResult.output, null, 2))
    console.log(`Merged OpenAPI specs written to ${outputPath}`)

    // Generate TypeScript OpenAPI paths for use in client
    console.log("Generating OpenAPI TypeScript paths AST")
    const ast = await openapiTs(mergeResult.output as any, {
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
