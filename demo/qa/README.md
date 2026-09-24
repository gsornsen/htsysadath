# Q&A demo: likely questions, sourced answers, one page

## How to run

From the repo root:

```sh
# 1. Replay (default): no model calls, rebuilds out/*.json and the page from committed fixtures
node demo/qa/run.mjs
open demo/qa/site/index.html          # macOS; or xdg-open on Linux, or open it in any browser

# 2. Live regeneration (calls `claude -p --model sonnet`; rewrites the fixtures).
#    GRAILITH_DIR is optional and adds the private experiment write-ups to retrieval.
GRAILITH_DIR=<path to a Grailith checkout> node demo/qa/run.mjs --live --model sonnet

# 3. Idempotence check: replay twice into temp dirs, compare sha256 of every output
demo/qa/check.sh
```

## What it is

Four audience personas (senior SWE, mid-level SWE, PM, product designer) read the talk's slides
and speaker notes and each write the ~10 questions they're most likely to ask. The pipeline
merges near-duplicates, ranks them, answers the top 20 in Gerald's voice **from the record only**,
checks every citation, and renders one self-contained page: ranked questions, click to reveal the
answer, its grounding badge and its citations. Spec: [talk/plan/qa-demo.md](../../talk/plan/qa-demo.md).

The trick it borrows from `demo/fanout`: one headless `claude -p` per persona, in parallel.

## Options

Replay needs only Node (built-ins, no `npm install`) and this checkout. A missing fixture is an
error, never a silent live call.

Other live variants (the committed fixtures came from the GRAILITH_DIR run above):

```sh
node demo/qa/run.mjs --live --model sonnet                  # repo sources only
node demo/qa/run.mjs --live --only q-abc123,q-def456        # re-ask only these answers
```

`--reuse` calls the model only where a fixture is missing; `--concurrency N` bounds the answer
calls in flight (default 4); `--out`/`--site` redirect the outputs (check.sh uses them).

**Model:** every committed fixture was produced by **Claude Sonnet** (`claude -p --model sonnet`),
with all tools disallowed, run from a neutral temp directory so the repo's own `CLAUDE.md` isn't
in the context. The model name is recorded in each fixture.

## The passes

| # | Pass | Kind | Output |
|---|---|---|---|
| 0 | snapshot | deterministic | `out/corpus.json`: `{files:[{path, sha256, bytes, source}]}` |
| 1 | questions | model, one call per persona | `out/questions.json`: `[{id, persona, question, likelihood 1–5, why, slide_ref}]` |
| 2 | rank | deterministic | `out/ranked.json`: `[{rank, id, question, personas, score, members}]` |
| 3 | answer | model, one call per top-20 question | `out/answers.json`: `[{id, answer, grounding, citations:[{path, locator}]}]` |
| 4 | verify | deterministic | `out/verify.json`: `[{id, ok, citations:[{path, locator, status: verified\|failed\|unverifiable}]}]` |
| 5 | render | deterministic | `site/index.html` via `render.mjs` (skipped with a note if absent) |

- **Ids** are `q-` + the first 10 hex of `sha256(persona + normalized question)`; a cluster takes
  its seed's id.
- **Rank**: questions are taken in (likelihood desc, id) order; each joins the existing cluster
  whose seed shares ≥ 50 % of its content tokens (overlap coefficient; stopwords dropped, light
  stemming), else starts a new one. Score = Σ likelihood × (1 + 0.5 × (personas in cluster − 1));
  ties broken by id.
- **Retrieval** (pass 3): each corpus file is cut at its Markdown headings (sections over 1,600
  characters are split into parts). Chunks are scored by BM25 (k1 1.2, b 0.75; idf within each
  pool) against the content tokens of all the cluster's member questions. Top 6 repo chunks,
  ties broken by path then position; plus, live with `GRAILITH_DIR` only, the top 3 Grailith
  chunks by the same rule.
  `out/retrieval.json` lists which excerpts each answer saw.
- **Grounding**: `sourced` (a measurement, commit, experiment or logged decision backs it),
  `testimony` (Gerald's own account, labelled as such in the record), `not in the record`.
- **Voice**: answers are Gerald's, in the first person ("I", "my estimate"). An answer or a
  question that refers to him in the third person is rejected and re-asked (questions: dropped).
- **Verify**: every cited path is in the corpus; the locator (a heading or a quoted phrase) is
  found in the repo file; answers ≤ 120 words; sourced/testimony answers cite something.
  Grailith citations are `unverifiable` in public replay unless `GRAILITH_DIR` is set.
  Flagged answers are shown flagged, never hidden.
- **Fixtures**: `replay/<pass>/<sha256>.json`, keyed by the pass, the prompt file, the persona or
  question, and the inputs (the deck; the retrieval rule and the retrieved repo excerpts; the
  Grailith manifest hash).
  A live run deletes fixtures it no longer references.

## Public vs private

- **Public (committed):** personas, prompts, the code, every fixture, `out/*.json`, the page. The
  corpus is this repo's own sourced material, which already paraphrases the private record
  with provenance.
- **Private (never committed):** Grailith's experiment write-ups (`docs/experiments/*.md`) and
  experiment ledger. With `GRAILITH_DIR` set, `--live` sends the top matching excerpts to the
  model, but only `replay/grailith-manifest.json` (path, sha256, bytes) and the corpus entries
  are written. The one write-up about Gerald's own working lane is left out of the pool.
  Answers paraphrase them and cite them as `grailith:<path>`. Public replay is
  complete without them; their citations show as unverifiable.
- Answers name no people other than Gerald, no sellers or customers, no hostnames, keys or
  credit balances.
