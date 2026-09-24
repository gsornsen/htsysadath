# Top-3 trajectory and the auto-lock side — arc A re-cut

Written 2026-09-24 by the `review/experiments-top3` lane (Opus-tier reviewer). Source repo is
grAIde-main; every `[src: …]` path is relative to its `docs/` directory unless marked otherwise.
Swept with a grep for `top-3 / @3 / recall@3 / auto-lock / in the strip` across
`docs/experiments/` and `docs/plan/`; only the files that carry numbers were read. No transcripts
were opened.

## 0 · The bar, and when it was set

Gerald's definition: **identification succeeds when the right card is in the TOP 3 per lot; top-1
is the stretch; auto-lock perfection is not a goal.** The repo records it first on **2026-09-11**:

- 2026-09-11 19:37 PDT — "stage 2: the correct card in the TOP 3 per lot (top-1 is the stretch; UX on
  alternatives is the fallback, not a failure) … auto-lock perfection is not a goal."
  [src: plan/2026-09-11-evening-plan.md · "Bars (founder, today)" · 2026-09-11]
- 2026-09-11 — the E108 write-up names it "the founder's stage-2 bar (2026-09-11)".
  [src: experiments/EXP-E108-top3-baseline-2026-09-11.md · header · 2026-09-11]
- Sep 12, session 403300ff, founder decision log (paraphrase of a quoted line): he is less worried
  about auto-locks being perfect than about the correct card being in the top 3 candidates.
  [src: plan/2026-09-18-trunk-consolidation/session-mining.md · §B founder decisions log · Sep 12]

The coordinator's brief dates this bar to 2026-09-13 22:44 in the same session. The documents
above put it two days earlier; 09-13 is probably a restatement. **Open for Gerald.**

Consequence for the talk: **every top-3 number below that predates 09-11 was measured before top-3
was the bar.** The D4 language work (E61–E67, 09-08/09) was scored almost entirely at @1.

## 1 · Every measured top-3 / @3 / "in the strip" number

Grouped by definition. **Rows in different groups are not comparable, and no trend line is drawn
across groups.**

### Group A — crop-level, SERVED path, frozen 335-crop split (the E108 yardstick)

| date | E-id | exact definition | value | compared to | what changed | src |
|---|---|---|---|---|---|---|
| 2026-09-11 | E108 | truth print id in the served identify-fast top-3; 335 crops of the frozen split (201 test + 134 dev), one crop per call; box stack (S1 gallery `9615db51`, 64,054 ids, back prototype s1, PPT off) | **pooled 262/335 = 78.2 %** (test 89.6 %, dev 61.2 %, EN 77.5 %, JA 11/11); top-1 62.1 %, top-8 84.8 % | none — this is the baseline; top-1 reproduces E69c's stock arm within +0.9 pt | first top-3 yardstick; the +16-pt top-1→top-3 gap is 54 "sibling-wander" crops over 21 truth ids | [src: experiments/e108-top3/RESULT-2026-09-11.md · Results, Conclusion · 2026-09-11] |

There is only one Group A measurement. **No later served-path re-run of the 335 at top-3 was found**, so
Group A has no trajectory.

### Group B — crop-level, OFFLINE numpy cosine, same 335 crops (no head, no front selector)

| date | E-id | exact definition | value | compared to | what changed | src |
|---|---|---|---|---|---|---|
| 2026-09-12 | E103 | truth in cosine top-3 of the served gallery copied out and searched in numpy; 335 crops re-embedded via the fleet | 249/335 = **74.3 %** old gallery; **74.3 %** with 216 JA art rows added (0 crops changed) | same 335, old gallery | JA art fill (217 rows) | [src: experiments/e103-art-fill/RESULT-2026-09-12.md · §3 · 2026-09-12] |
| 2026-09-12 | E119 | same offline harness on the promoted `9a8b5711` gallery (64,271 rows) | 249/335 = **74.3 %**, identical with +948 or +992 JA-keyspace rows | same | JA-keyspace art | [src: experiments/EXP-E119-ja-keyspace-art-2026-09-12.md · replay table · 2026-09-12] |

Group B's 74.3 % and Group A's 78.2 % are the same 335 crops on the same gallery; the 4-point gap is the
serving path (language head, front selection), not a change over time. The frozen split has only 11 JA
crops, so neither art fill could move it.

### Group C — group-level, redundant crops of ONE still photo (E109 proxy)

| date | E-id | exact definition | value | compared to | what changed | src |
|---|---|---|---|---|---|---|
| 2026-09-11 | E109 | 41 groups of 6 crop boxes cut from one photo; truth in the group's top-3 after aggregating the six hit lists | R2/R3/R4 Σ-ordering **82.9 %** (wander subset 91.3 %); R1 plurality 68.3 % (hurts 5) | single-crop average **70.3 %** on the same groups | ordering rule over redundant crops; 0 of 41 groups hurt | [src: experiments/EXP-E109-consensus-proxy-2026-09-11.md · table · 2026-09-11] |
| 2026-09-13 | B1 replay | 41 frozen scenes; tight `b00` vs bleed-padded `b17` crop, top-3 per scene through the app's exact request body | **33/41 = 80.5 %** both arms (discordant 1 vs 1) | arm vs arm | crop padding | [src: plan/2026-09-13-scan-capture-prod-readiness.md · B1 Results · 2026-09-13] |

E109's own opus review states the +12.6 pts is "this experiment's finding, not a live number". The
coordinator's lead cites it from the siglip2 handoff; the handoff does not carry 70.3/82.9 — the
evening plan (line 44) and the prod-readiness doc do.

### Group D — LOT-level, live auctions, truth = the founder's taps

| date | E-id | exact definition | value | compared to | what changed | src |
|---|---|---|---|---|---|---|
| 2026-09-11/12 | run-4 reads | 7 lots / 19 fire rows with a confirmed tid; truth in the fire's top-3 | single **42 %** (8/19) → R3 consensus **63 %** (12/19) | single fire | consensus rule (offline) | [src: experiments/run4-reads/RESULT-2026-09-11.md · consensus table · 2026-09-12] |
| 2026-09-12 00:4x | E100b | 31 tapped lots, runs 4–5; truth in top-3 at the LAST fire / at ANY fire; **lot-id-first join** | single **45.2 %** last / 71.0 % any; shipped consensus 45.2 % (inert by construction) | single fire | shipped 0.4.33 consensus | [src: experiments/EXP-E100b-consensus-live-2026-09-12.md · table · 2026-09-12] |
| 2026-09-12 00:5x | E112 | same 31 lots and join; truth in the first 3 of the lot POOL (union of each fire's band-limited top-3) at the last fire | **64.5 %** (first-5: 67.7 %); honest subset where the header was wrong (n = 18): 5.6 % → **44.4 %** in the first three alternates | 45.2 % single fire | lot candidate pool → shipped 0.4.35 | [src: experiments/EXP-E112-lot-candidate-pool-2026-09-12.md · table + REVIEW FIX · 2026-09-12] |
| 2026-09-12 22:57 | lot-eval review | — | E100b's 45/71 (and so E112's base) are **join-biased under-counts**; lot-first join failed a built-in invariant 5/29 | — | harness `tools/eval/lot_top3.py` supersedes | [src: experiments/EXP-E100b-consensus-live-2026-09-12.md · Addendum 22:57 · 2026-09-12] |
| 2026-09-12 23:21 | lot_top3 harness | tapped lots, EN only, **flow-first join**; truth in top-3 at the LAST fire | n = 34: **67.6 %** (top-1 64.7 %) | lot-first on 37: 51.4 % | join corrected (a measurement fix, not a product change) | [src: plan/2026-09-11-evening-plan.md · §10a · 2026-09-12] |
| 2026-09-12 23:23 | lot_top3 harness | same, +18 lots from one more founder session | n = 52: **76.9 %** (top-1 71.2 %); top-3-any 100 % but definitional on 37/52 | n = 34 | more lots, same code | [src: plan/2026-09-11-evening-plan.md · §10a; plan/2026-09-08-handoff-siglip2.md · 23:23 entry · 2026-09-12] |
| 2026-09-12 20:1x UTC | run-6 reads | 9 lots with truth, 0.4.35 live; single-fire top-3 and pool first-3 | **88.9 %** (8/9), identical for single and pool | single vs pool | none measurable at n = 9 | [src: experiments/run6-reads/RESULT-2026-09-12.md · Replay table · 2026-09-12] |

Group D is the definition Gerald's bar is written in (per lot), but: n is 9–52; the join changed between
rows; and 67.6 → 76.9 is the same code on a bigger sample, not an improvement. The plan's own verdict: "still
thin; need ≥ 200 truth lots before it decides anything." **No lot-level top-3 figure after 2026-09-12 was
found in the experiment or plan docs.**

### Group E — candidate-strip containment on labelled hard tails (not the frozen split)

| date | E-id | exact definition | value | compared to | what changed | src |
|---|---|---|---|---|---|---|
| 2026-09-09 15:28 | E83 | 26 human-truth tasks from the founder's DISSENT queue (hard by construction); truth in the labeling strip | old strip **12/26** → new S1 @3 **15/26** (teacher ∪ S1 @3 also 15) | old frozen strip (teacher top-1+2 + student top-1, EN-only, no head) | whole new stack: E77 gallery en+ja+zh-cn, exact search, E65a head, S1 | [src: experiments/EXP-E83-recandidate-2026-09-09.md · Result · 2026-09-09] |
| 2026-09-10 20:20 | E85 | 426 crops with provisional truth (mostly agent-agreed); served S1 path with head, depth 24 | **368/426 = 86 %** @3 (top-1 68 %); founder-sighted stratum 62 % @3 (n = 32) | offline 88 % | served vs offline | [src: experiments/EXP-E85-served-vs-provisional-truth-2026-09-09.md · table · 2026-09-10] |

E83 is the only before/after @3 number that spans the D4 era, and it is confounded (head, JA fill,
zh-cn, exact search and a new encoder tier all changed at once) at n = 26.

### Checked and absent

- **E67 (G0 vs G0h): no print@3 or artwork@3.** It reports print@1 and artwork@1 only.
  [src: experiments/EXP-E67-artwork-dedup-gallery-2026-09-08.md · §2, §4 · 2026-09-08]
- **E62:** top-3…top-5 "not cached anywhere"; it reports artwork@1/@2/@5, no @3.
  [src: experiments/EXP-E62-artwork-vs-print-2026-09-08.md · line ~99 · 2026-09-08]
- E65, E65a, E77: @1 only in the swept lines.

## 2 · The auto-lock side

**There are two different auto-locks; only one matters for the scout.**

| rail | rule | arrived | src |
|---|---|---|---|
| web app `pickAutoLockDetailed` | lock only when identity confidence is "high" (needs a confirmed, unambiguous collector number) | 2026-07-27, commit `2f53a452` ("auto-lock the card when the ID is unambiguous") | grAIde-main git log; [src: experiments/EXP-E27-floor-margin-operating-point-2026-09-05.md · §6 · 2026-09-05] |
| scout extension `decideLock` — "AUTO-LOCK ONLY ON A CLEAR WIN" | top-1 ≥ floor **0.62** AND top-1 − top-2 ≥ margin **0.03**; later optional `spread8` conjunct (E34 flag); refusals added for uncertain printing (E54) and card backs (E89) | 2026-09-02, commit `ab1eba28` ("the testable loop — clear-win lock, candidates-first overlay…") | grAIde-main git log; [src: experiments/EXP-ALT-PICK-2026-09-07.md · §1, §(b) · 2026-09-07] |
| founder's operating point | margin **0.01** / spread **0.02** | set 2026-09-11 | [src: plan/2026-09-11-evening-plan.md · §1 "Closed lanes" · 2026-09-11] |

The web rail never fires on the scout's path: the scout sends `numberPolicy: none`, so confidence is
never "high" — 0 auto-locks on 3,301 scout scans.
[src: experiments/EXP-E31-printing-fanout-2026-09-05.md · line ~180 · 2026-09-05]

### Lock rate and lock precision, measured

| date | where | lock rate | lock precision | src |
|---|---|---|---|---|
| 2026-09-05 | E27, teacher encoder, 765 live objects / 41 founder-gold fires, offline replay | shipped 0.62/0.03: 39 priceable auto-locks of 765 objects; 67/387 real fronts served | gold precision **2/3** at shipped; **9/12 = 0.75** at recommended 0.62/0.01/spread8 ≥ 0.045 (n far too small; CI [50,100]) | [src: experiments/EXP-E27-floor-margin-operating-point-2026-09-05.md · §1, §6, §7 · 2026-09-05] |
| 2026-09-11 | E89 §5, S1 encoder, 426 provisional-truth crops, offline | shipped 0.03: **60/426 = 14.1 %** (19 % of correct cards) · margin 0.01 + spread5 0.02: **172/426 = 40.4 %** (55 % of correct cards) | shipped **0.90** (54/60) · 0.01/0.02: **0.92** (158/172) | [src: experiments/EXP-E89-back-gate-under-s1-2026-09-11.md · §3, §5 · 2026-09-11] |
| 2026-09-11 | live, founder run 0.4.26 | 1 auto-lock in 49 fires | **0/1** — gold Mew locked as a Pikachu | [src: experiments/EXP-E88-identify-timer-retune-2026-09-11.md · §3 · 2026-09-11] |
| 2026-09-11 | live, E89 reading | 2 auto-locks in 292 fires ("near-silent") | not stated | [src: experiments/EXP-E89-back-gate-under-s1-2026-09-11.md · §3b · 2026-09-11] |
| 2026-09-11 | live, E99 | 8 committed priced locks across 334 fires (≈ 2.4 %) | one confirmed false auto-lock in the no-answer segment | [src: experiments/EXP-E99-no-answer-segments-2026-09-11.md · §2 · 2026-09-11] |

Caveats from E89 itself: the replay recorded 5 hits, so `spread5` stands in for the live `spread8`; the
426 "truth" is provisional (mostly agents agreeing), not founder labels.

### The complete picture Gerald's definition asks for

accuracy = lock rate × lock precision, **plus** top-3 containment on the non-locked remainder.

- Lock rate × precision: **FOUND offline** (E89, above). **NOT FOUND live** at any n that gives a rate.
- Top-3 on the non-locked remainder: **NOT FOUND as a measurement.** No document stratifies top-3 by
  lock state; the lot-level harness (Group D) scores all lots together.
- **Derived bound, not a measurement** (labelled so it is never quoted as one): E85 and E89 replay the
  same 426 crops and both report top-1 289/426, so assume the same ranked lists. At the founder's
  0.01/0.02 point, 172 lock (158 right); the 254 non-locked crops hold 368 − 158 − x top-3 hits, where x
  (0–14) is the wrong locks whose truth sat at rank 2–3 → **top-3 on the remainder between 77 % and 83 %**.
  At the shipped 0.03 margin: 366 non-locked, **84–86 %**. Re-running the E89 script with a per-crop
  top-3 flag would close this in minutes of box time.

## 3 · What this means for D4 (the language/dedup reconciliation)

The D4 win exists **only in @1 terms**: G0h lifted print@1 67.66 % → 77.61 % on the 201-crop test split
(E67), and E77 reproduced 77.6 % on the served path. The first top-3 yardstick (E108, 78.2 % pooled /
89.6 % test) arrived three days later on a stack that already served the language head, so it is an
after-only number. The one before/after @3 figure that spans the change (E83: 12/26 → 15/26 in the
strip) is confounded by four simultaneous changes and n = 26. **Honest statement: the record cannot say
what the language head did to top-3.** A replay of the 335 with the head off vs on at top-3 would.
