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

## D4 · 2026-09-24 · Gerald's interview answers (prompts/04 part 1)

**Format.** 35 min live + 10 min Q&A. Live-vs-recorded for the arc D demo: not yet answered.
**Spine.** Not answered directly; the answers point at arc B's live-scout period as the richest
material, so the working spine stays B with A as the deep-dive (brief.md).
**Arc D (documents).** The hybrid is chosen for STRUCTURE: a tl;dr the busy reader finishes,
with drill-down levels for the curious and for people who need data/detail. Nothing has gone
wrong with the method; the failure it replaced was writing docs too long to be read, which
forced the meetings the doc was meant to replace. The full worked example (Q1) is deferred to a
later phase in case the other arcs fill the live slot.
**Arc B — the pivots that needed evidence in hand (live scout).** (1) Accuracy was stuck and
Japanese cards were scoring higher similarity than English ones on crops. The counter-intuitive
call was about the INDEX COMPOSITION: what to do with duplicated art, and art re-used across
prints in several languages (Gerald's clarification, 07:5x). Setting up the experiments to test
it simplified the system and cut training and maintenance — the single experiment that most
changed his mind, and the route to handling multiple languages from reference art. (2) Detection:
WHEN to run identify and when not to; identify was not fast enough end-to-end to win an auction
and the project was close to being parked. In hindsight the experiments that sped identify up
were less valuable than thinking earlier about moving cards — the team ended up not needing ~5
identify calls per detect.
**Verify during mining.** Memory `index-design-evidence-2026-09-19` records E67 (artwork-dedup
"loses 14–20 pts", "flat, no dedup" kept) and a language head as soft scope. Gerald remembers the
dedup/cross-language experiments as the simplifying win. The arc A lane reconciles from the E65/
E67 docs and transcripts: which arm was adopted, on what date, what was served — and whether
"simplified" refers to the index, the language handling, or the training/maintenance burden. The
reconciliation is talk material (memory vs record).
**Arc F added (07:5x).** Agent labeling with skills + different vision models took a label from
~3 minutes (human) to ~10 seconds `[verify]`. Sources: E28a adversarial agent labeling (09-06),
E84 agent-tools pilot (09-09: $/task, tool calls, wall time, agreement/dissent rates), plan specs
2026-09-06/08/09, memory `labeling-program-design-2026-09-09`, `model-words-not-model-ids`.
**Model routing.** Opus 5.5 (`claude-opus-5-5`) for Opus-tier lanes once the client is updated;
fall back to Opus 5 if 5.5 is unavailable. Gerald updates the client after this turn.
**Remote.** Public GitHub repo `gsornsen/htsysadath` created via gh; `origin` set.
