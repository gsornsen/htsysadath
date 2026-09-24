# Arc F — agents as labelers

**E28a** = `docs/experiments/EXP-E28a-adversarial-agent-labeling-2026-09-06.md`; **E84** =
`docs/experiments/EXP-E84-agent-tools-pilot-2026-09-09.md`; both under `~/git/grAIde-main/`.

## Metrics (extracted first, narrative below)

### E28a — paired blind agent labelers on 120 served-fire identities (2026-09-06)

| metric | value | src |
|---|---|---|
| labeler agreement | 115/120 = 95.8% | [E28a §1] |
| Cohen's κ (10-cat) | 0.952 | [E28a §3.2] |
| exact id right (agreed, n=114) | 81/114 = 71.1%, CI [62.1,78.6] | [E28a §1,§4.1] |
| right incl. wrong print-language | 110/114 = 96.5%, CI [91.3,98.6] | [E28a §1] |
| unlabelled residual | 6/120 → 3/120 after founder review | [E28a §6,§12.2] |
| wrong-agreements | 0 | [E28a §3.1] |

### E84 — tool-using agent labeler, pilot (23 tasks) → 800-task run (2026-09-09/11)

| agent | exact id | verdict acc | abstain | $/task | tools | wall | src |
|---|---|---|---|---|---|---|---|
| A Gemini 2.5 Flash | 11/18=61% | 9/23 | 5 | $0.004 | 3.2 | 11 s | [E84 §1] |
| B Haiku 4.5 (cap 8) | 4/18=22% | 5/23 | 14 | $0.024 | 7.0 | 16 s | [E84 §1] |
| B chosen: gpt-5.6-terra | 10/18=56% | 10/23 | 4 | $0.009 | 6.4 | — | [E84 §6] |
| pair, either right | 14/18=78% | — | — | ~$0.013 | — | — | [E84 §6] |

Wrong agreements across every pairing tested (pilot + 800-run): **0**. [E84 §1,§6,§7]

800-task run: A named 431/760 (49 min, $2.99); B named 599/760 (74 min, $6.09). Pair agreed on id
**316 (42%)**, agreed no-id **85**, **dissented 359 (47%)** — 77 different ids, 244 one-sided.
[E84 §7]

### What stayed human

E28a: founder blind-adjudicated the 6 unresolved fires (*"agent labels are NOT ground truth; the
founder adjudicates"*) [E28a §8,§12]. E84: his 359-dissent review queue and his audit reversing the
"converged" claim [E84 §15]. Standing rule: a model's stated id/URL is never trusted directly, only
name/number/set resolved through the catalogue [src: ~/.claude/projects/-Users-geraldsornsen-git-
grAIde/memory/model-words-not-model-ids.md · 09-13].

---

## THE NUMBER: "~3 min by hand → ~10 s with agents + `[verify]`"

**Verdict: 3-minute half NOT FOUND. 10-second half sourced, but narrower than claimed.**

- **"~3 min by hand" — NOT FOUND.** No doc checked (labeling feature spec, labeling-start-here,
  the pilot spec, `docs/ops/labeling.md`, labeler-UX memories, the 09-13 labeler-critique) states a
  per-label manual duration. Adjacent, not equivalent: the founder stopped hand-labeling after 23
  labels over UI friction (memory `labeler-ux-blockers-2026-09-09`); the critique's "<60 s median"
  target was un-instrumented at the time — its plan calls a seconds-per-task counter "a new event"
  still to build [src: docs/design/2026-09-13-labeler-critique/final-critique-and-plan.md ·
  ~L340-356 · 09-13], headlined "labeler NOT < 1 min today" [src: docs/plan/2026-09-08-handoff-
  siglip2.md · 09-13]. Context for *why* labeling was believed slow, not *how* slow.
- **"~10 s with agents" — sourced as agent wall time only, excludes verify.** E84 pilot agents ran
  11 s (Gemini) / 16 s (Haiku) per task [E84 §1]; later passes measured medians 13.7 s / 12 s
  [E84 §10,§12] — tool calls + model turns only, no `[verify]` step anywhere in sources. Closest
  analog: the founder's E28a adjudication, 6 dissents in 6 minutes — **derived** ~1 min/item (no
  per-item time reported), an order slower than 10 s. [E28a §12]
- **For the talk:** quote 11–16 s agent wall time with its scope caveat (agent-only, no human
  review); mark the 3-min baseline NOT FOUND rather than present a guess as measured.

## 1. The arc in one paragraph

The labeling program moved from "the founder is the only labeler and it's the bottleneck" to
"agents label, paired and blind, and the founder reviews the disagreements." E28a showed two
independent agent labelers agree 95.8% of the time and, when they agree, are right often enough
(71% exact, 96.5% modulo print language) to turn a stalled ±25-point precision estimate into a
usable ±8-point one, at no founder cost. E84 then ran a tool-using agent labeler at 800-task scale
for ~$9, with zero cases of agreement on a wrong answer. The catch, found by the founder auditing
the agents' own "not in catalogue" calls: agreement is not correctness — it can hide a blind spot
only a human spot-check catches.

## 2. Pivotal moments

1. **2026-09-06 — pair the agents, then adjudicate only the residual.** Fork: relabel everything vs.
   founder adjudicating only what two blind agents disagree on. Decision: paired-blind; founder
   adjudicates the residual. Evidence: κ = 0.952; dissents clustered on the print-language
   ambiguity the study targeted; the founder closed 3 of 6 residual fires blind in a 6-minute
   session. Benefit: turned a blocked ship decision into a measured one and shrank the CI band
   ±2.5→±1.25 points for ~6 minutes of his time instead of a full re-run. [E28a §2,§3.4,§9,§12]
2. **2026-09-09 — give the agent tools, not just a picture.** Fork: vision-only vs. catalog/
   reference-art/web tools, capped (8 calls, 60 s, $6/run). Decision: tools, capped. Evidence:
   Gemini nearly doubled the best embedding model's exact-id rate at $0.004/task, zero wrong
   agreements. Not pursued: unlimited budget — Haiku's cap drove most abstentions, fixed by raising
   it, not swapping models. [E84 §1,§3]
3. **2026-09-10/11 — a founder audit reverses a written "converged" claim.** Fork: trust the
   pipeline's "48 named/19 gap" summary vs. re-opening it by hand. Decision: he read all 20
   remaining tasks himself. Evidence: 9/20 were actually in the catalogue — the model had refused
   hits it already had, or searched by the wrong-language name. Benefit: reversed a stated
   conclusion, drove 4 fix passes ($1.24) recovering 20 written-off labels. [E84 §14,§15]
4. **2026-09-13 — the UI, not the agents, is the real bottleneck.** Fork: push agent coverage
   further vs. fix why the founder's own review sessions were slow. Decision: a labeling-UI design
   critique. Evidence: the one-tap answer rendered 276–639 px below the fold; sessions ran "NOT <
   1 min" against a 60 s target. Benefit: shifted the arc from "can agents label" to "can the human
   review fast enough." [src: docs/plan/2026-09-08-handoff-siglip2.md; docs/design/2026-09-13-
   labeler-critique/final-critique-and-plan.md]

## 3. The transferable move

Don't ask "can an agent do this task" — ask "can two independent, blind agents agree often enough
that agreement is informative." Pay for a cheap pair, not one strong model: a capped, tool-using
agent paired against a second gives a usable signal at a fraction of human time, and the
disagreement — or an audit showing agreement hid a shared blind spot — is where scarce human
minutes belong. Agreement means a question is answerable, never that the answer is right; auditing
the agreements, not just the dissents, caught §15.

## 4. Slide candidates

- **"Two blind agents agree 96% of the time, and where they don't is where the system is wrong."**
  Artifact: E28a's 3×3 decision matrix next to the dissent-clustering finding.
- **"Agreement is not correctness."** Artifact: E84 §15's table — 9/20 "genuine gaps" a human
  audit found were actually in the catalogue, one-line cause each.
- **"The number the talk almost quoted."** Artifact: E84's 11–16 s wall time next to a "3 min by
  hand — NOT FOUND" label.

## 5. Open questions for Gerald

1. Source for "~3 minutes per label by hand"? Name it and it can be re-checked.
2. Does "~10 s with agents" include the human `[verify]` step, or is it agent-only (as sourced)?
3. Is the founder's E28a adjudication (~1 min/item, derived) what you mean by "verify"?
