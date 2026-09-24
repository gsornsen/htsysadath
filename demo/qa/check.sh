#!/usr/bin/env bash
# demo/qa/check.sh — idempotence check: replay the pipeline twice into temp dirs and compare
# the sha256 of every out/*.json (and site/index.html when render.mjs exists). Also compares
# the first run against the committed demo/qa/out/. Exits non-zero on any difference.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for n in 1 2; do
  # Public replay: never read private sources, even if the caller's shell has GRAILITH_DIR set.
  env -u GRAILITH_DIR node "$ROOT/demo/qa/run.mjs" --replay \
    --out "$TMP/run$n/out" --site "$TMP/run$n/site/index.html" 2> "$TMP/run$n.log" \
    || { cat "$TMP/run$n.log" >&2; echo "check: replay run $n failed" >&2; exit 1; }
done

digest() { # dir → "sha  relative-path" lines, sorted
  (cd "$1" && find . -type f \( -name '*.json' -o -name 'index.html' \) | LC_ALL=C sort | while read -r f; do
    printf '%s  %s\n' "$(shasum -a 256 "$f" | cut -d' ' -f1)" "$f"
  done)
}

d1="$(digest "$TMP/run1")"
d2="$(digest "$TMP/run2")"
echo "$d1"
if [[ "$d1" != "$d2" ]]; then
  echo "check: FAIL, two replays differ" >&2
  diff <(echo "$d1") <(echo "$d2") >&2 || true
  exit 1
fi

committed="$(digest "$HERE/out" | sed 's#  \./#  ./out/#')"
fresh="$(digest "$TMP/run1/out" | sed 's#  \./#  ./out/#')"
if [[ "$committed" != "$fresh" ]]; then
  echo "check: FAIL, replay differs from committed demo/qa/out/" >&2
  diff <(echo "$committed") <(echo "$fresh") >&2 || true
  exit 1
fi

echo "check: OK, two replays byte-identical and equal to committed out/ ($(echo "$d1" | wc -l | tr -d ' ') files)"
