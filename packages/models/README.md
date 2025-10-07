# @selling-partner-api/models

This package merges the upstream [amzn/selling-partner-api-models](https://github.com/amzn/selling-partner-api-models) repository into a single OpenAPI surface and TypeScript definition set that powers the SDK package.

> 🚀 **Automated CI/CD**: This package is automatically released when changes are merged to main using conventional commits.

## Installation

```bash
bun add @selling-partner-api/models
# or
npm install @selling-partner-api/models
```

Detailed paths and schemas are available directly from the published artefacts:

- `import { paths } from "@selling-partner-api/models"`
- `import * as merged from "@selling-partner-api/models/merged.json"`

The upstream repository is tracked as a git submodule under `vendor/selling-partner-api-models`. Run the helper script below to ensure it is initialised before building:

```bash
bun run --cwd packages/models models:update
```

## Build artefacts

```bash
# install dependencies once at the repository root
bun install

# merge OpenAPI sources and emit merged.json + paths.ts
bun run --cwd packages/models build
```

The generated files land in `packages/models/src` and are committed by the automation workflow.
