# Decisions log (ADR-lite)

One entry per decision that shapes the talk or the method. Newest at the bottom. Format:
`## D<n> · <date> · <title>` then Context / Decision / Alternatives not taken / Consequences.

## D1 · 2026-09-24 · Build the talk in a public git repo, method visible

**Context.** Gerald wants the audience to see how the talk was built with Claude Code, not only
the slides. **Decision.** Repo `htsysadath`, trunk `main`, branch-per-lane, `--no-ff` merges with
explanatory bodies; findings committed with provenance; raw material never committed.
**Alternatives.** Private repo + exported slides (loses the method); a single long doc (loses
the parallel-lane story). **Consequences.** Hygiene rules are mandatory from commit one.

## D2 · 2026-09-24 · Fable coordinates; smaller models do bounded work

**Context.** 1.25 GB of transcripts, 223 memory files, 229 experiment docs, 3,966 commits — far
beyond one context window. **Decision.** Fable writes briefs and judges; Haiku/Sonnet/Opus lanes
mine and draft; reviewer one tier above implementer. Full rules in docs/agents/coordinator.md.
**Alternatives.** One Opus session reading everything (context-bound, slow, no parallelism).
**Consequences.** Every lane needs a self-contained brief and a provenance contract.

## D3 · 2026-09-24 · Transcript mining is scripted first, read second

**Context.** Transcripts are too large to read. **Decision.** `scripts/inventory-transcripts.py`
produces a session index (id, dates, size, opening request); lanes read only the sessions the
index points at, by grep/slice, and record findings with line offsets. **Alternatives.** Random
sampling (misses the pivots). **Consequences.** The index is the first mining artifact.
