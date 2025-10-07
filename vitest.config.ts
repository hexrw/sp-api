import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        include: ["packages/sdk/src/**/*.spec.ts"],
        environment: "node",
        globals: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "json-summary", "lcov"],
            reportsDirectory: "coverage",
            exclude: [
                "**/dist/**",
                "**/*.d.ts",
                "**/node_modules/**",
                "docs/**",
                "vendor/**",
                "packages/models/**",
                "packages/sdk/scripts/**",
                "packages/sdk/src/lib/rate-limit/**",
                "packages/sdk/src/types/**",
                "packages/sdk/src/client-v1.ts",
                "packages/sdk/src/fetch-client.ts",
                "packages/sdk/src/paths.ts",
                "**/*.config.*",
                "coverage/**",
                "vitest.config.ts",
            ],
            thresholds: {
                statements: 90,
                branches: 85,
                functions: 90,
                lines: 90,
            },
        },
    },
})
