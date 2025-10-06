#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "➡️ Ensuring vendor submodule is initialised"
cd "${REPO_ROOT}"
git submodule update --init vendor/selling-partner-api-models

echo "🔄 Pulling latest models from upstream main"
git submodule update --remote --depth 1 vendor/selling-partner-api-models

echo "✅ Amazon models submodule synced"
