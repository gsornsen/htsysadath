# Brief — "How to scale yourself and do all the things"

**Status:** v0 (2026-09-24). Owner: Gerald. Audience: engineering colleagues (mixed IC / lead /
manager). Format: talk with a public companion repo (this one).

## Thesis

Projects are boxed by scope, staffing, and timeline. When a hard problem lands mid-project, the
default move is to lean on current knowledge and push straight through — because there is no
time, no spare people, and sometimes no one on the team who knows the alternatives. The talk's
claim: **with agentic tools the cost of exploring several approaches at once has collapsed**, so
the step-back is now cheaper than the push-through, and the real skill becomes *deciding fast*
without falling into analysis paralysis. "Scaling yourself" = running the exploration in parallel
while you keep doing the job, then spending a short, focused window choosing and adjusting.

## What the talk must do for the audience

1. Name the moment: the pivotal decision point where instinct says "push through."
2. Show a repeatable move: frame options → fan out → converge on evidence → decide in minutes.
3. Make it concrete with real before/during/after examples (below), including the ones that
   were NOT explored and what that cost.
4. Leave them with two things they can do next week: the persona-drafting trick for documents,
   and a coordinator/swarm pattern for technical exploration.

## The six story arcs (source material lives in Grailith)

| # | Arc | The pivotal decision | Where the evidence is |
|---|---|---|---|
| A | **Experiments for the card scout** — dozens of numbered experiments (E12…E119+) on identify accuracy, indexes, encoders, art sources | when to stop point-fixing and run a discriminating experiment; what NOT to try (encoder swap, re-embed, buying image sources) | grAIde `docs/experiments/` (229 files), memory `index-design-evidence-2026-09-19`, session transcripts |
| B | **The product pivots** — identify one card in pregrade → bulk scans + lots → back to live-stream auction identify → comps/pricing | each pivot was a scope/timeline conversation held WITH evidence in hand | `docs/plan/`, git history (3,966 commits since 2026-07-02), memory `trunk-consolidation-*`, `founder-testing-milestones` |
| C | **Personas as reviewers** — critics + personas re-walk built screens for the labeler and pregrade app; "design panel is the done gate" | replacing "does the founder like it" with a panel that returns DONE / NOT and translates literal asks into jobs | memory `design-panel-is-the-done-gate`, `design-translates-feedback`, `labeling-mobile-ux-crit-p2`, `docs/design/` |
| D | **Personas for documents** — one rough draft → executive / engineer / designer / PM versions built in parallel, then a 10-minute hybrid | the author keeps working while versions are built; choose a hybrid, tweak, ship; hours → minutes | Gerald's own practice (interview him); this repo will DEMONSTRATE it on the talk's own abstract |
| F | **Agents as labelers** — agents with skills and different vision models label crops; **~3 min/label by hand (Gerald's own stopwatch after the first labeler build — founder testimony, original message not in the mined corpus) → 11–16 s agent wall time per task (E84, agent-only)**; the redesigned UI separately took human admin review to ~20 s/task (09-14). Adversarial pairs, agreement/dissent, $/task | replacing human labeling throughput with an agent pipeline while keeping the human as the verdict of record for hard cases | `docs/experiments/EXP-E28a-*`, `EXP-E84-*` (+ `e28a/`, `e84/` folders), `docs/plan/2026-09-0{6,8,9}-labeling-*`, memory `labeling-program-design-2026-09-09`, `model-words-not-model-ids`, `founder-wont-hunt-ids-on-poor-crops` |
| E | **The coordinator pattern** — Fable writes specs, smaller models build, reviewer one tier above, swarms divide and conquer, lanes commit early | how the human stays the decider while agents carry breadth | memory `fable-writes-specs-small-models-build`, `two-agent-review-protocol`, `coordinator-swarm-autonomy`, `limit-kills-lanes-commit-early`; this repo's own commit log |

## Anti-patterns to show honestly

- Analysis paralysis dressed up as rigor (many experiments, no decision).
- Solutioning from thin data (memory `dont-solution-from-thin-data`).
- Killing a lane by running out of context/limits with uncommitted work.
- Trusting "two sources agree" when one was copied from the other (`tid-authority-tcgdex-pricing-id`).
- The reviewer catching the same shape three times → the class fix (`class-sweep-over-point-fix`).

## Out of scope

Product marketing for Grailith; anything that exposes keys, credit balances, emails, or
customers; a tools tutorial (the method matters, the vendor does not).

## Open questions for Gerald (answer in decisions.md)

1. Talk length and slide budget? ANSWERED: 35 min live + 10 min Q&A (~22 slides)
2. Live demo (persona drafting on the abstract) or recorded?
3. Which ONE arc is the spine if time is cut in half? (recommend B, with A as the deep-dive)
