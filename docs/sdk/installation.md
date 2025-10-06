# Installation

Before installing the SDK, make sure your toolchain meets the following minimum versions:

- **Bun**: 1.2.0 or newer (preferred)
- **Node.js**: 22.0.0 or newer (if you run builds/tests under Node)
- **TypeScript**: 5.6.x or newer for the best inference and project references

## Add the dependency

```bash
bun add @selling-partner/sdk
# or, if you are still on npm
npm install @selling-partner/sdk
```

The package ships as pure ESM. If you rely on CommonJS, convert your project or use dynamic `import()` calls.

## Workspace layout

When cloning this repository, the SDK lives in `packages/sdk`. The root uses Bun workspaces, so the following commands install everything in one go:

```bash
bun install
bun run build:sdk
```

The build step will:

1. Regenerate rate-limit metadata from `packages/sdk/src/assets/rate-limits.json`.
2. Compile TypeScript sources into `packages/sdk/dist`.
3. Emit `.d.ts` files alongside the ESM output.

## Environment variables

At runtime the SDK expects the following values:

| Variable | Description |
| --- | --- |
| `SP_CLIENT_ID` | Login With Amazon (LWA) client ID |
| `SP_CLIENT_SECRET` | LWA client secret |
| `SP_REFRESH_TOKEN` | Refresh token obtained during seller authorization |
| `SP_REGION` | One of `eu`, `na`, or `fe` |

You can provide these directly when constructing `SpApi`, but keeping them in environment variables simplifies deployments and local testing.

## Monorepo usage

If you publish your own packages from the same repository, consume the SDK via the workspace protocol:

```json
{
  "dependencies": {
    "@selling-partner/sdk": "workspace:*"
  }
}
```

This ensures local builds use the current source while release workflows publish the compiled output.
