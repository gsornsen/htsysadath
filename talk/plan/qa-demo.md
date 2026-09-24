# Q&A demo: likely questions, sourced answers, one page (spec, 2026-09-24)

Gerald's ask: borrowing from the fan-out demo, personas generate the questions each is most likely to
ask in the Q&A; the answers come from the record (git history, experiment docs, the ledger); an
interactive HTML page ranks the questions by likelihood and reveals each answer on click. It's
multi-pass and **idempotent over a replayed dataset**: anyone who checks out this public repo can
re-run it and get the same page.

## Reproducibility model (the non-obvious part)
- Model calls aren't deterministic, so every model call's output is stored as a **replay fixture**,
  keyed by `sha256(pass + prompt file + persona + inputs)`, under `demo/qa/replay/`. `--replay` (the
  default) never calls a model; a missing fixture is an error, not a silent live call. `--live`
  calls `claude -p` and (re)writes fixtures.
- Every deterministic pass (snapshot, dedupe/rank, verify, render) is a pure function of its inputs:
  stable ids (a hash of the normalized text), sorted output, no timestamps, no randomness. Two
  `--replay` runs produce byte-identical `demo/qa/site/index.html`, checked by `demo/qa/check.sh`.
- **Public vs private sources.** The corpus is this repo's own sourced material (it already
  paraphrases the private Grailith record with provenance). Grailith's experiment docs and ledger are
  an OPTIONAL extra source for `--live` answering (`GRAILITH_DIR=…`); answers cite them as `grailith:<path>`,
  and the corpus manifest records only their sha256 (never their content). Public replay is complete
  without them.

## Layout (`demo/qa/`)
`README.md` · `run.mjs` (the orchestrator; Node built-ins only, plus `claude -p` in live mode) ·
`check.sh` (replay twice, compare hashes) · `personas/{senior-swe,pm,designer,mid-swe}.md` ·
`prompts/{questions,answer}.md` · `replay/{questions,answers}/<hash>.json` · `out/` (pass outputs,
committed) · `site/index.html` (self-contained, committed) · `render.mjs` (JSON → HTML).

## Passes and schemas
0. **snapshot** → `out/corpus.json`: `{files:[{path, sha256, bytes, source:"repo"|"grailith"}]}`. Repo paths:
   `talk/notes.md`, `talk/slides/deck.md`, `talk/outline.md`, `docs/project/decisions.md`,
   `mining/findings/*.md`, `mining/arcs/*.md`, `talk/plan/critique2/*.md`, `starter/**/*.md`.
1. **questions** (model, one call per persona) → `out/questions.json`: `[{id, persona, question,
   likelihood: 1–5, why, slide_ref}]`, with ~10 per persona.
2. **rank** (deterministic) → `out/ranked.json`: cluster near-duplicates across personas (normalized
   token overlap ≥ a fixed threshold) and score = Σ likelihood × (1 + 0.5 × (personas_in_cluster − 1));
   ties broken by id. `[{rank, id, question, personas:[…], score, members:[ids]}]`.
3. **answer** (model, one call per ranked question; top N = 20) → `out/answers.json`: `[{id, answer
   (≤ 120 words, first person as Gerald where it's his view), grounding: "sourced"|"testimony"|"not in
   the record", citations:[{path, locator}]}]`. The prompt feeds the corpus files most relevant to the
   question (deterministic keyword retrieval over the snapshot) and forbids claims beyond them.
4. **verify** (deterministic) → `out/verify.json`: every cited path is in the corpus; repo-path
   locators (a heading or a quoted phrase) are found in the file; grailith citations are "unverifiable
   in public replay" unless GRAILITH_DIR is set. Answers failing verification are shown flagged, never hidden.
5. **render** (deterministic) → `site/index.html`: one self-contained file (inline CSS/JS, no network,
   dark/light), questions ranked, click to reveal the answer + grounding badge + citations; filter by
   persona; each question shows which personas would ask it.

## Hygiene
Public repo: answers paraphrase; no names of people, sellers or customers; no hostnames, keys or
credit amounts. The same grep as everywhere else before commit.
