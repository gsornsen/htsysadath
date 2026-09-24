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
