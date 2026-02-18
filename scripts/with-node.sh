#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_NODE_BIN="$ROOT_DIR/.local/node-current/bin"

if [[ -x "$LOCAL_NODE_BIN/node" ]]; then
  export PATH="$LOCAL_NODE_BIN:$PATH"
fi

exec "$@"
