# Arc A — the experiments track (SIGLIP2-TRACK)

*Re-cut 2026-09-24 around Gerald's accuracy bar: the right card in the TOP 3 of the candidate picker
whenever the scout does not auto-lock. Number table: `mining/findings/top3-trajectory.md`. grAIde-main
paths below are relative to its `docs/`.*

## 1 · The arc in one paragraph

Between 2026-09-05 and 2026-09-21 the identify pipeline was worked through 155 experiment documents,
about half of them explicitly pre-registered with a bar and a KILL condition (83 of 151 `EXP-*` docs use
the word). For its first week the track scored itself on **print@1**:
encoder swaps and fine-tunes all failed (E57, E58, E53d), E62 and E63 showed misses were embedding and
catalogue gaps, and the language/dedup test of D4 (E61 → E67) was decided at @1. On **2026-09-11**
Gerald changed the bar. Identification means the right card is in the top 3 per lot. Top-1 is the
stretch, and auto-lock perfection is not a goal. From then on the track measured what the picker shows:
a crop-level top-3 yardstick (E108, 78.2 %), then a per-lot harness (76.9 % at the last fire, n = 52). The new lesson: **the metric you pre-register is itself a decision, and
it can be wrong.**
[src: plan/2026-09-11-evening-plan.md · Bars · 2026-09-11; experiments/EXP-E108-top3-baseline-2026-09-11.md]

## 2 · Pivotal moments

**2026-09-02 — the scout gets a lock rule.** The rule is "Auto-lock only on a clear win": top-1 ≥ 0.62
and top-1 beats top-2 by ≥ 0.03. Otherwise the scout shows candidates and asserts nothing. So its accuracy
is three numbers: how often it locks, how often a lock is right, and whether the truth is in the top 3
when it does not lock.
[src: grAIde-main commit `ab1eba28` · 2026-09-02; experiments/EXP-ALT-PICK-2026-09-07.md §1]

**2026-09-08/09 — D4, scored at @1.** Gerald asked for "EN only first … without having duplicated art
across languages" (E61 §0). The E61 census found that 96.14 % of 19,258 JA renders have an identical-art
EN twin. E67 then tested dedup against a pre-registered KILL line. The dedup arm lost 14.43 pts of
print@1, and **the KILL fired**. A post-hoc arm kept the flat gallery and added the language head as a
soft re-rank. It lifted print@1 from 67.66 % to 77.61 % on the 201-crop test split (20 fixed, 0 broken).
That head shipped on 2026-09-09 00:03 PDT. **None of this was measured at top-3.** E67 reports @1 only,
and the first top-3 yardstick arrived three days later on a stack that already served the head.
[src: experiments/EXP-E61-cross-language-art-dedup-2026-09-08.md §0; EXP-E67-artwork-dedup-gallery-2026-09-08.md §4.3, §4.9; plan/2026-09-08-handoff-siglip2.md 00:03 entry]

**2026-09-11 — the bar moves to top-3, and the lock turns out to be a sideshow.** The evening plan
records the new bar, and E108 set the yardstick the same day. On 335 frozen crops the right print was top-1 62.1 % of the
time and in the top 3 78.2 % (test split 89.6 %). The 16-point gap was 54 "sibling-wander" crops, where
the right print sat at rank 2–3 within a hair of rank 1. On the lock side, E89 replayed the lock rule on
426 crops. At the shipped 0.03 margin it locked 14 % of cards at 0.90 precision. At the 0.01/0.02 point
Gerald then chose, it locked 40 % at 0.92. Live it was near-silent: 8 priced locks in 334 fires, and the
one lock in a 49-fire run was wrong (a gold Mew locked as a Pikachu). Most fires never lock: the
picker is the product.
[src: plan/2026-09-11-evening-plan.md §0, §1; experiments/e108-top3/RESULT-2026-09-11.md; EXP-E89-back-gate-under-s1-2026-09-11.md §5; EXP-E99-no-answer-segments-2026-09-11.md §2; EXP-E88-identify-timer-retune-2026-09-11.md §3]

**2026-09-11/12 — a proxy that did not survive live lots.** E109 aggregated six crops of one photo with a
Σ-score order. Top-3 rose from 70.3 % to 82.9 %, with 0 of 41 groups hurt. The shipped version (0.4.33)
was narrowed at review to reorder the alternatives without changing the served card. On 31 live tapped
lots it was **inert on top-3**: 45.2 % both ways. The same data showed the real gap: the right card was in
some fire's top-3 in 71 % of lots, but in the last fire's top-3 in only 45 %. E112 built the alternatives
from every fire in the lot. Offline, the first three rose from 45.2 % to 64.5 %. On the 18 lots where the
header was wrong, the right card appeared in the first three alternates 44.4 % of the time, against
5.6 % before. That shipped as 0.4.35 the same night.
[src: experiments/EXP-E109-consensus-proxy-2026-09-11.md; EXP-E100b-consensus-live-2026-09-12.md; EXP-E112-lot-candidate-pool-2026-09-12.md · REVIEW FIX]

**2026-09-12 23:21 PDT — the yardstick is corrected, not the product.** A review found that the lot join
E100b and E112 used under-counted: it failed its own built-in check on 5 of 29 lots. The fixed harness
read top-3 at the last fire as 67.6 % on 34 lots, then 76.9 % on 52: more lots, not an improvement. The plan's own verdict: thin, and ≥ 200 truth lots are needed.
[src: plan/2026-09-11-evening-plan.md §10a; EXP-E100b-consensus-live-2026-09-12.md · Addendum]

**Reconciling D4 with the record, in top-3 terms.** Gerald remembers the dedup/cross-language work as
the experiment that simplified the system. The record agrees on what shipped: the index stayed flat, and
a 1,538-parameter head replaced a gallery rebuild and more encoder training (E67b was closed without a
run). **Its accuracy win exists only at @1.** The one before/after figure at the strip level is E83, where
the founder's truth sat in the strip 12/26 times before and 15/26 after. That number is confounded by
four simultaneous changes, and n = 26. The record cannot say what the language head did to top-3. A
head-off/head-on replay of the 335 at top-3 would answer it.
[src: memory index-design-evidence-2026-09-19; experiments/EXP-E65a-language-head-2026-09-08.md §6; EXP-E83-recandidate-2026-09-09.md; docs/project/decisions.md D4 (this repo)]

## 3 · The transferable move

**Pre-register the metric, not just the bar, and re-check that the metric is the user's.** For a week
this track pre-registered carefully and ran against print@1. The product's user was looking at a
candidate list and would tap the right card if it was there. Once the bar became "in the top 3 when we
don't lock", the question changed. It was no longer "which model is best". It became "what does the
list show at the moment of the auction". The biggest measured lift came from which fires feed the list
(E112), not from the model. The older half still holds: E67's KILL fired, and scoring past it found the arm that shipped.

## 4 · Slide candidates

- **Two denominators.** One bar split in two: lock rate × lock precision (E89: 40 % locked at 0.92), then
  the top-3 containment on everything that does not lock. The second is unmeasured; the derived
  bound is 77–83 % (top3-trajectory §2).
- **Last fire vs any fire.** 45 % against 71 % in E100b's biased count, then E112's pool. The right card
  was on screen earlier in the lot and gone by the time bidding closed.
- **Proxy vs live.** E109's +12.6 pts on six crops of one photo next to E100b's 0.0 on live lots.
- **The E67 kill-and-recover table**, captioned honestly: an @1 win, decided before the bar moved.

## 5 · Open questions for Gerald

- The docs record the top-3 bar on 2026-09-11 (evening plan, E108) and your auto-lock remark on
  2026-09-12. The brief dates the bar to 09-13 22:44. Was 09-13 a restatement?
- The live number your bar asks for is top-3 on the non-locked lots, and it has never been measured by
  lock state. Is it worth one harness flag before the talk?
- Did the language head help top-3, or only top-1? Is a head-off/head-on replay worth running for the
  slide?
- Is 76.9 % at n = 52 (2026-09-12) still the latest lot-level number, or has the ≥ 200-lot run happened?
