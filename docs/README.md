# Documentation workspace

This directory contains the VitePress site used for the Selling Partner API documentation. It lives alongside the rest of the monorepo and is managed as a private workspace package, so its dependencies resolve through the root lockfile without being published to npm.

## Local development

Run the development server from the repo root:

```bash
bun run docs:dev
```

Alternatively, you can run commands directly within the workspace:

```bash
bun run --cwd docs dev
bun run --cwd docs build
bun run --cwd docs preview
```

## Output

The static site build emits files into `.vitepress/dist/`, which is ignored from version control. GitHub Pages deployment workflows consume this directory when publishing the documentation site.

## Customizing the base path

Deployments default to `https://<org>.github.io/selling-partner-api/`. To host Docs on a custom sub-path, set `DOCS_BASE_PATH` when running any VitePress command, for example:

```bash
DOCS_BASE_PATH=/docs/ bun run docs:build
```

The helper keeps leading and trailing slashes consistent. When you eventually move to a custom domain, you can omit the variable (VitePress will fall back to `/`).
