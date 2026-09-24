# Phase 1 kickoff — paste into a fresh Claude Code session in ~/git/htsysadath

You are the Fable coordinator for the talk "How to scale yourself and do all the things".
Read, in this order and nothing else yet: CLAUDE.md · docs/project/brief.md ·
docs/project/tracking.md · docs/project/sequencing.md · docs/agents/coordinator.md.

Then run `date`, `git status`, `git log --oneline -5`; confirm `main`, clean, and that `origin`
is github.com/gsornsen/htsysadath. Pull first.

## Spawn Phase 1 as parallel lanes (all independent; one brief each, template in coordinator.md)

Before spawning: probe the Opus tier once (a one-line task) to learn whether Opus 5.5 is
available in this client; fall back to Opus 5 and write which one ran into tracking.md.

1. `mine/inventory` — Haiku. Run `python3 scripts/inventory-transcripts.py
   ~/.claude/projects/-Users-geraldsornsen-git-grAIde --out mining/timeline/sessions.md`,
   then REDACT the opening-request column (paths, names) to a ≤ 12-word paraphrase. Commit.
2. `mine/experiments` (arc A) — Sonnet, Opus review. Body: prompts/02. Deliverables:
   `mining/findings/experiments-index.md` + `mining/arcs/A-experiments.md`. Must reconcile
   decisions.md D4's "dedup / cross-language art" memory-vs-record question from E65/E67 docs.
3. `mine/pivots` (arc B) — Haiku extract + Sonnet narrate, Opus review. Bodies: prompts/03 then
   prompts/02 §plans. Deliverables: `mining/timeline/git-timeline.md`,
   `mining/findings/pivots-timeline.md`, `mining/arcs/B-pivots.md`.
4. `mine/personas` (arc C) — Sonnet. Body: prompts/02 §design. Deliverable: `mining/arcs/C-personas-review.md`.
5. `mine/coordinator` (arc E) — Sonnet. Body: prompts/02 §memory (method memories) + this repo's
   own git log. Deliverable: `mining/arcs/E-coordinator.md`.
6. `mine/labeling` (arc F) — Sonnet, Opus review. Body: prompts/02 §arc F. Deliverable:
   `mining/arcs/F-agent-labeling.md`; must source or refute "3 min → 10 s per label".

Every lane: its own branch off main; disjoint output paths; commits early; provenance on every
finding; public-repo hygiene (docs/project/public-repo-hygiene.md — run the grep); reports ≤ 30
lines; no sub-agents; never ends a turn waiting.

## When lanes return
Review each (reviewer one tier above; spot-check 3 findings per arc by re-running their
`[src:]`). Merge `--no-ff` with a body stating what was learned and what was verified. Append to
`mining/findings/cross-arc.md` anything a lane found outside its arc. Update tracking.md and, for
any decision, decisions.md. Log at least one `[method]` lesson in lessons-learned.md from how the
lanes behaved. Push `main`.

Report to Gerald in ≤ 12 lines: arcs landed (paths + shas), the D4 reconciliation result, the
3-min→10-s verdict, which Opus ran, and the one decision you need from him.
