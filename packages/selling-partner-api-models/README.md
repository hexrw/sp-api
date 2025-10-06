# @selling-partner/api-models

This internal workspace package merges the upstream [amzn/selling-partner-api-models](https://github.com/amzn/selling-partner-api-models) repository into a single OpenAPI surface and TypeScript definition set that powers the SDK package.

The upstream repository is tracked as a git submodule under `vendor/selling-partner-api-models`. Run the helper script below to ensure it is initialised before building:

```bash
bun run --cwd packages/selling-partner-api-models models:update
```

## Build artefacts

```bash
# install dependencies once at the repository root
bun install

# merge OpenAPI sources and emit merged.json + paths.ts
bun run --cwd packages/selling-partner-api-models build
```

The generated files land in `packages/selling-partner-api-models/src` and are committed by the automation workflow.
