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

## D5 · 2026-09-24 · Arc B is a concurrency story, not a four-act sequence

**Context.** brief.md framed arc B as four pivots in order: pregrade identify → bulk/lots →
live-stream scout → comps/pricing. The `mine/pivots` lane tested that against the Grailith git
log and it does not hold. The D1 comps store shipped 2026-07-04 (`8b009b9f9`) and
`packages/pricing` the same day (`e3772c771`) — day two of a repo whose first commit is
2026-07-02. Lots (08-19) and whatnot-scout (08-18, `e04b6433b`) launched one day apart and ran
concurrently through August. Coordinator re-derived all four dates from `git log` directly.

**Decision.** Keep the four pivots as the arc's beats, but stop presenting them as a sequence.
Arc B is retold as *parallel spines with pivotal decision moments on each*, which is in fact a
better fit for the talk's own thesis — the claim is that agentic tools let you run several
threads at once, and the record shows Gerald already was.

**Alternatives not taken.** (a) Keep the linear framing as "narrative compression" — rejected: the
talk's credibility rests on the record matching the story, and someone will read the public repo.
(b) Drop the ordering claim silently — rejected: the gap between the remembered tidy sequence and
the messy concurrent record is itself talk material, and it pairs with D4's memory-vs-frame
finding as a second instance of the same lesson.

**Consequences.** talk/outline.md needs arc B restructured before Phase 3. The "what the
retrospective tidies away" beat now has two independent examples (D4 framing, D5 ordering) and
may deserve its own slide. Open: the Art Binder detour (08-12 → 08-18) has no founder-quoted
scope conversation in the mined docs — an honest counter-example to the "every pivot was an
evidence conversation" claim, unresolved pending Gerald.

## D6 · 2026-09-24 · The "3 min → 10 s per label" claim is not sourced; the talk drops it

**Context.** brief.md and D4 both asserted that agent labeling took a label from ~3 minutes by
hand to ~10 seconds with a `[verify]` step. The `mine/labeling` lane was briefed to source or
refute it. Refuted, and the coordinator re-ran the search independently and agrees.

- **"~3 min by hand": NOT FOUND.** No labeling source states a per-label manual duration —
  not the feature spec, labeling-start-here, the E84 pilot spec, `docs/ops/labeling.md`, the
  labeler-UX memories, or the 2026-09-13 critique. The record says the opposite of a measured
  baseline: at 2026-09-13 13:12 PDT the critique headline is "labeler NOT < 1 min today", and its
  plan calls a seconds-per-task counter "a new event" still to be built. The manual rate was
  **uninstrumented**. The only "~3 min" in the corpus is the 2026-09-09 deploy rollback window
  (an `assertEnvValid` boot failure) — a different thing entirely.
- **"~10 s with agents": sourced but scope-mismatched.** EXP-E84 measures **11 s** (Gemini 2.5
  Flash) and **16 s** (Claude Haiku 4.5) per task, 13.7 s / 12 s on re-runs — agent wall time
  only, excluding human review. No `[verify]` bracket appears in any source. The nearest
  human-verify analogue is E28a's blind adjudication, 6 dissents in 6 minutes ≈ 1 min/item,
  an order of magnitude slower than 10 s.

**Decision.** The talk does not use "3 min → 10 s". Arc F quotes **11–16 s of agent wall time per
task at $0.004–$0.024**, states plainly that the manual baseline was never measured, and makes
the honest point instead: the pipeline's value showed up in **agreement and cost** (E28a: 95.8%
agreement, κ = 0.952, 71.1% exact id, zero wrong agreements; E84: 800 tasks for $9), not in a
speedup nobody instrumented.

**Alternatives not taken.** (a) Quote the number with a hedge — rejected: the repo is public and
the number would be traced to nothing. (b) Reconstruct a 3-minute baseline by arithmetic and
present it as measured — rejected outright; that is the "solutioning from thin data" anti-pattern
the talk itself calls out, and doing it in the talk's own evidence would be self-refuting.

**Consequences.** brief.md arc F row corrected. D4's arc F paragraph is superseded on this point.
This is now the third instance of the same lesson (with D4's framing and D5's ordering):
**the remembered number is tidier than the record.** That pattern has earned its own slide.
Gerald still owes an answer on where his ~3 min came from — if it is a real stopwatch memory,
it is worth instrumenting once and quoting properly rather than dropping.

## D7 · 2026-09-24 · D6 reversed: the 3-min baseline is founder testimony, and it stays

**Context.** D6 dropped "~3 min per label by hand" as unsourced. Gerald (08:2x PDT): he timed
himself with the first labeler build and shared the average in a session message. The
coordinator then searched every human-typed message in all 30 transcript files on this laptop
(the 28 inventoried plus `-git-grAIde-main` and one worktree folder the inventory missed):
no timing message. The 09-07 session brief records sessions running on a second account;
the first labeling sessions most plausibly live there, outside the mined corpus.

**Decision.** D6's drop is reversed. The talk quotes **~3 min/label by hand** as Gerald's own
measurement, attributed as founder testimony with the original message "not in the mined
corpus". Absence from a partial corpus is not evidence against a firsthand measurement; D6
treated it as if it were. The agent side stays as measured: **11–16 s agent wall time per task
(E84), agent-only, excluding human review.**

**New evidence from the same search, which the talk should use.** Gerald, 2026-09-14 05:02
(session `403300ff`): "~30+ label tasks as admin in like 10 minutes" after the P0/P1 redesign,
roughly **20 s per task by a human**. So the 3-min figure fell through two levers, not one:
agents doing the first pass (11–16 s) and a redesigned UI making human review fast (~20 s).
The honest slide shows both. Crediting agents alone would overclaim.

**Lesson (method).** D6's mistake: "not found in what we mined" became "not sourced" without
first asking the one person who was there. The corpus-coverage gap is logged in tracking.md.

**D6/D7 erratum (2026-09-24, arc F Opus review).** D6's "800 tasks for $9" should read **760 tasks
for ~$9** ($2.99 + $6.09; 40 human-labelled tasks were skipped) [src: EXP-E84 lines 103–104]. Its
"zero wrong agreements" holds for E28a and the E84 pilot only; the 760-task run had no ground
truth, so wrong-agreement can't be measured there.

## D8 · 2026-09-24 · Gerald's answers after the Opus review pass

- **"michi" in Grailith file/branch names stays.** Gerald: fine to publish, do not scrub.
- **Top-3 replay of D4 (G0 vs G0h), offline:** run it. Lane `mine/e67-top3-replay` re-scores the
  saved E67 vectors on the devbox (no inference), with a positive control that print@1 must
  reproduce 67.66% / 77.61% exactly before any @3 number counts.
- **Lock-state flag in the lot harness:** approved as a Grailith code change on branch
  `eval/lot-top3-lock-state` (worktree `grAIde-lotlock`, off Grailith main `f75d531d`), not merged
  by this project. The founder's accuracy bar becomes measurable: top-3 on NON-locked lots, plus
  lock rate × lock precision.
- **The ≥ 200-lot run:** run offline over every truth lot available, and report the actual n
  instead of padding to 200.
