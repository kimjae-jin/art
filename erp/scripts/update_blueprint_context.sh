#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BL="$ROOT/docs/blueprint.md"

LAST_COMMIT="$(git -C "$ROOT" rev-parse --short HEAD || echo 'working tree')"
BACKEND_UP=$(lsof -i :8000 -nP 2>/dev/null | awk 'NR>1{print 1; exit}' | sed 's/^$/0/')
FRONTEND_UP=$(lsof -i :5173 -nP 2>/dev/null | awk 'NR>1{print 1; exit}' | sed 's/^$/0/')

# macOS 기본 sed는 -i '' 사용
sed -i '' \
  -e "s/^last_commit:.*/last_commit: ${LAST_COMMIT}/" \
  -e "s/^backend_running:.*/backend_running: $([ "$BACKEND_UP" = "1" ] && echo true || echo false)/" \
  -e "s/^frontend_running:.*/frontend_running: $([ "$FRONTEND_UP" = "1" ] && echo true || echo false)/" \
  "$BL"

echo "updated RESUME CONTEXT:"
grep -E '^(last_commit|backend_running|frontend_running):' "$BL"
