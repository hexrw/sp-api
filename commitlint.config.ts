import type { UserConfig } from "@commitlint/types"

export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat",
                "fix",
                "docs",
                "style",
                "chore",
                "refactor",
                "test",
                "release",
                "build",
                "ci",
                "perf",
                "revert",
                "wip",
                "types",
                "infra",
            ],
        ],
    },
} as UserConfig
