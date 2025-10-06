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
                "**/*.config.*",
                "coverage/**",
                "vitest.config.ts",
            ],
        },
    },
})
