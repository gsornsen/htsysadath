# Q&A demo: likely questions, sourced answers, one page

Four audience personas (senior SWE, mid-level SWE, PM, product designer) read the talk's slides
and speaker notes and each write the ~10 questions they're most likely to ask. The pipeline
merges near-duplicates, ranks them, answers the top 20 in Gerald's voice **from the record only**,
checks every citation, and renders one self-contained page: ranked questions, click to reveal the
answer, its grounding badge and its citations. Spec: [talk/plan/qa-demo.md](../../talk/plan/qa-demo.md).

The trick it borrows from `demo/fanout`: one headless `claude -p` per persona, in parallel.

## Run it

```sh
node demo/qa/run.mjs            # replay (default): no model calls, byte-identical every time
demo/qa/check.sh                # replay twice into temp dirs; compare sha256 of out/*.json (+ page)
```

Replay needs only Node (built-ins, no `npm install`) and this checkout. A missing fixture is an
error, never a silent live call.

Live (re)generation, which is how the committed fixtures were made:

```sh
node demo/qa/run.mjs --live --model sonnet                  # repo sources only
GRAILITH_DIR=<path to a Grailith checkout> node demo/qa/run.mjs --live --model sonnet
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
| 4 | verify | deterministic | `out/verify.json`: `[{id, status, words, issues, citations:[{path, locator, status}]}]` |
| 5 | render | deterministic | `site/index.html` via `render.mjs` (skipped with a note if absent) |

- **Ids** are `q-` + the first 10 hex of `sha256(persona + normalized question)`; a cluster takes
  its seed's id.
- **Rank**: questions are taken in (likelihood desc, id) order; each joins the existing cluster
  whose seed shares ≥ 50 % of its content tokens (overlap coefficient; stopwords dropped, light
  stemming), else starts a new one. Score = Σ likelihood × (1 + 0.5 × (personas in cluster − 1));
  ties broken by id.
- **Retrieval** (pass 3): each corpus file is cut at its Markdown headings (sections over 1,600
  characters are split into parts). A chunk scores Σ idf of the question's content tokens it
  contains (all member questions of the cluster count). Top 6 repo chunks, ties broken by path
  then position; plus, live with `GRAILITH_DIR` only, the top 3 Grailith chunks by the same rule.
  `out/retrieval.json` lists which excerpts each answer saw.
- **Grounding**: `sourced` (a measurement, commit, experiment or logged decision backs it),
  `testimony` (Gerald's own account, labelled as such in the record), `not in the record`.
- **Verify**: every cited path is in the corpus; the locator (a heading or a quoted phrase) is
  found in the repo file; answers ≤ 120 words; sourced/testimony answers cite something.
  Grailith citations are `unverifiable in public replay` unless `GRAILITH_DIR` is set.
  Flagged answers are shown flagged, never hidden.
- **Fixtures**: `replay/<pass>/<sha256>.json`, keyed by the pass, the prompt file, the persona or
  question, and the inputs (the deck; the retrieved repo excerpts; the Grailith manifest hash).
  A live run deletes fixtures it no longer references.

## Public vs private

- **Public (committed):** personas, prompts, the code, every fixture, `out/*.json`, the page. The
  corpus is this repo's own sourced material, which already paraphrases the private record
  with provenance.
- **Private (never committed):** Grailith's experiment write-ups (`docs/experiments/*.md`) and
  experiment ledger. With `GRAILITH_DIR` set, `--live` sends the top matching excerpts to the
  model, but only `replay/grailith-manifest.json` (path, sha256, bytes) and the corpus entries
  are written. Answers paraphrase them and cite them as `grailith:<path>`. Public replay is
  complete without them; their citations show as unverifiable.
- Answers name no people other than Gerald, no sellers or customers, no hostnames, keys or
  credit balances.
