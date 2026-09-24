# Top-3 on lots the scout did NOT auto-lock — the founder's accuracy bar, measured

Written 2026-09-24 by lane `lot-top3-lock-state` (Opus 5.5). Code: Grailith branch
`eval/lot-top3-lock-state`, commits `986ccd97` (feature), `62ec41b5` (tests), `436f4283`
(precision-note fix), off main `f75d531d`. Not merged. Numbers come from one offline run:
**[src: lot_top3 run · 2026-09-11T00:00Z–2026-09-25T00:00Z · 2026-09-24T16:11Z]**.
Raw outputs (seller names, card ids) stay in the session scratchpad. None are copied here.

## Headline

> **On lots the scout did not auto-lock, the right card was in the top 3 on the last fire for
> 45 of 69 lots: 65.2 % (95 % Wilson interval 53.4–75.4 %).** n = 69 non-locked truth lots
> out of 87. That is well short of the ≥ 200 the founder planned, and more data does not exist
> yet (see §2).

The founder's bar: when the scout does not auto-lock, the right card should be in the top 3 of
the candidate picker. By that bar the scout was at about two in three.

## 1 · What "lock state" means here, and where it came from

- **The rule.** `decideLock` in the extension is the "clear win" rail. It auto-locks when top-1
  clears a floor of 0.62 AND beats top-2 by a margin AND, from 2026-09-11, clears a spread
  conjunct. `lock.mode = "auto"` means the scout showed one card with its price and no picker.
  [src: grAIde `apps/whatnot-scout/src/shared/lock-decision.ts` · decideCoreRule · at f75d531d]
- **Recorded, not replayed.** The debug capture writes the decision onto every fire record
  (`lock.mode`, `lock.reason`, `lock.top1`, `lock.gatePoint`). The harness already reads those
  records. So lock state is **read from the record**, and nothing was reconstructed from scores.
  Each record also names the operating point it ran under. **All 87 truth lots ran at
  `0.620 / 0.010 / 0.020`** (floor / margin / spread8), the post-09-11 rule. No lot in the corpus
  ran the older 0.03-margin rule, so a replay was not needed and was not done.
- **PostHog does not hold it per fire.** `user_pick` and `match_confirmed` carry a `lock_mode`
  property, but only on fires the founder tapped, and only as of tap time. The fire record is the
  complete source.
- **Per lot = the LAST fire's decision.** That is what was on screen when the lot closed, and it
  is the same fire the "top-3 last" score uses. 39 of 87 lots auto-locked on *some* fire. Only
  18 were still auto-locked on the last one.
- **Precision uses `lock.top1.id`**, the catalogue id. It does not use the record's `lockedTid`,
  which is a TCGplayer product id in a different id space. Scoring against `lockedTid` would mark
  every lock as wrong. A test pins this.
- **`unpriced` is a sensitivity row, not part of the headline.** `lock.mode = "unpriced"` is the
  same clear win naming one card, but for a print with no price source (mostly Japanese). It
  also shows no picker. The two definitions are reported side by side in §3.

## 2 · n, by window

| window (UTC, by fire date) | truth lots | of which auto-locked (last fire) | non-locked |
|---|---|---|---|
| 2026-09-12 | 34 | 1 | 33 |
| 2026-09-13 | 18 | 6 | 12 |
| 2026-09-14 | 15 | 8 | 7 |
| 2026-09-15 | 13 | 2 | 11 |
| 2026-09-16 | 7 | 1 | 6 |
| **total** | **87** | **18** | **69** |

- Taps were pulled for **2026-09-11 → 2026-09-25 UTC** (676 tap events). The last tap in PostHog
  is **2026-09-16 00:32Z**. No taps exist after that, so the effective window is 09-11 → 09-16.
- Lotted fire records exist through 09-20, but the later ones carry no taps. Fires before 09-12
  have no `lotId`. Untapped lots are unlabeled and are excluded, never counted as misses.
- **87 < 200.** The founder's planned ≥ 200-lot run cannot be done on current data. Nothing is
  padded or extrapolated.
- Human labels were not included. They join by fire id and could add lots, but the label export
  needs an owner-authenticated call, which is outside this lane's read-only PostHog key. Truth is
  taps only, the same basis as the 67.6 % and 76.9 % runs.

## 3 · The numbers

**Overall (flow-first join, last fire):** top-1 **59.8 %** (52/87, CI 49.3–69.4); top-3
**71.3 %** (62/87, CI 61.0–79.7). The flow-first join had 0 confirm-invariant violations; the
lot-first join had 4.

**Lock split:**

| locked = | lock rate | lock precision | non-locked n | non-locked top-1 last | **non-locked top-3 last** | non-locked top-3 any |
|---|---|---|---|---|---|---|
| `auto` (headline) | 20.7 % (18/87, CI 13.5–30.4) | **88.9 %** (16/18, CI 67.2–96.9) | 69 | 52.2 % (36/69) | **65.2 % (45/69)** | 94.2 % (65/69) |
| `auto` + `unpriced` (sensitivity) | 40.2 % (35/87) | 85.7 % (30/35) | 52 | 42.3 % (22/52) | 57.7 % (30/52) | 92.3 % (48/52) |

Reading it:

- **Where the misses are, among non-locked lots (last-fire reason → top-3 hits):**
  - `candidates/margin` 27/40
  - `candidates/twin_print` 3/5
  - `candidates/lazy_pool_unconfirmed` 0/2
  - `unpriced/no_tid` 15/17
  - `none/card_back` 0/5

  **Restricted to lots where a picker was actually shown** (`candidates/*`, n = 47), top-3 is
  **63.8 % (30/47, CI 49.5–76.0)**. The 5 `card_back` lots showed "flip the card" instead of a
  picker, and none of them had the truth in its top 3.
- **Lock precision is partly definitional.** 12 of the 18 locked truths come from a 👍
  (`match_confirmed`), which ratifies a fire's own top-1. Those lots come out correct unless the
  👍 sat on an earlier fire than the last lock, which happened once (11/12). On pick-sourced
  locked lots, precision is 5/6. At n = 18 the honest reading is "most locks were right, and the
  interval is wide."
- **Top-3-any is mostly definitional** on non-locked lots too: 38 of 69 truths are 👍-minted.
  Use top-3 *last*, not *any*.
- **Non-locked top-3, split by truth source:**
  - 👍-minted: 29/38
  - pick-minted: 16/31

  A pick means the founder overruled the top-1, so pick-minted lots are the harder subset.

## 4 · Against the last recorded numbers

| read | n | top-1 last | top-3 last | basis |
|---|---|---|---|---|
| §10a first read (2026-09-12 23:21 PDT) | 34 | 64.7 % | **67.6 %** | flow-first, 09-12 sessions |
| §10a + one more founder session (2026-09-12 23:23 PDT) | 52 | 71.2 % | **76.9 %** | same |
| **this run, same code path + lock split** | 87 | 59.8 % | **71.3 %** | flow-first, 09-12 → 09-16 |
| this run, non-locked only | 69 | 52.2 % | **65.2 %** | same |

- **The old numbers reproduce exactly.** The 09-12 UTC slice alone is 23/34 = 67.6 %. Adding
  the 09-13 UTC slice (the extra founder session) gives 40/52 = 76.9 %. The lock-state change
  does not move any existing number.
- **The 76.9 % was a high point, not a trend.** The later days score top-3 last at 11/15 (09-14),
  6/13 (09-15) and 5/7 (09-16). At these sample sizes the pooled 71.3 % is the best estimate,
  and 67.6 → 76.9 → 71.3 is sampling noise around ~70 %, not a trajectory. The code did not
  change between reads. Only the sample grew.
- **Lock state explains part of the gap.** Top-3 over all lots (71.3 %) runs about 6 points
  above top-3 on non-locked lots (65.2 %), because the 18 auto-locked lots are mostly right.
  The founder's bar is the non-locked number, and it is the lower one.

## 5 · Caveats

1. **n = 87 truth lots (69 non-locked), not 200.** Every interval above is ±10–12 points.
2. **Truth is the founder's taps only.** One tapper, EN-heavy (83 EN, 4 JA), five UTC days of
   streams. Sellers and card mix vary a lot by day (09-15 alone scores 46 %).
3. **Selection bias.** A lot only has truth if the founder tapped it. He may tap more when the
   answer is wrong (a pick) or clearly right (a 👍) than when it is ambiguous.
4. **Last-fire lock state is one choice.** 39/87 lots auto-locked on *some* fire, but only 18 on
   the last. A lot that locked and then fell back to candidates counts as non-locked here,
   because that is what was on screen at the end.
5. **One operating point.** Every lot ran `0.620/0.010/0.020`. These numbers say nothing about
   the older 0.03-margin rule.
6. **Top-3 "last" is the ranker's first three `embedHits`**, the same definition as the 67.6 % and
   76.9 % reads. It can differ from the rendered picker order when the E113 lot pool reorders
   alternatives. The harness measures the pool separately, but fewer than 10 lots carry a pool
   sidecar here, too few to score.
7. **Offline only.** Recorded fire files plus a read-only PostHog pull. No live auction,
   production database, or deploy was touched.
