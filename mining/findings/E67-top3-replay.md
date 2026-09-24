# E67 top-3 replay: does the language-head win carry to top-3?

Written 2026-09-24 by the `mine/e67-top3-replay` lane (Opus 5.5). Offline re-score of saved
vectors on the lab box. No model inference, no network, no paid API. The source experiment is
Grailith's E67 (2026-09-08); its write-up is `docs/experiments/EXP-E67-artwork-dedup-gallery-2026-09-08.md`
in grAIde-main.

## Question

E67 measured the E65a language head, used as a soft re-rank (λ = 0.10, chosen on dev), on the flat
64,127-vector gallery. On the 201-crop frozen test split it lifted print@1 from **67.66 %** (arm G0,
no head) to **77.61 %** (arm G0h). The founder's accuracy bar is **top-3**: the right card has to
be among the picker's top 3 candidates. E67 never scored @3, and its per-crop file keeps only each
arm's top-1. **Does the D4 win still hold when you score at top-3?**

## Definitions (what "top-3" means here)

- **print@3 (headline).** The exact printing (the truth print id) is among the first 3 entries the
  arm returns. The picker shows prints, so this is the bar that matters.
  - Flat arms (G0, G0h): the first 3 gallery rows by score. I also scored a
    **distinct-print** variant, which collapses repeated ids before cutting at 3. It came out
    identical to raw print@3 for every arm, so no duplicate print ever took up a top-3 slot.
  - Deduped arms (G3, G3p): the top 3 *artworks*, each resolved to its best print in stage 2. So
    these arms' 3 slots are always 3 different artworks.
- **artwork@3 (secondary).** The truth print's artwork group is among the groups of the first 3
  entries. In a flat arm two slots can hold the same artwork in two languages, so artwork@3 is not
  "3 distinct artworks" there.
- **wrong-language miss@3.** The truth print is not in the top 3, *and* none of the 3 is in the
  truth's language. (At @1 this is E67's own definition: the top-1 is wrong and in another language.)

## Method

1. I copied E67's original `e67_score.py` byte-for-byte (the md5 of the box copy matches the
   grAIde-main copy) to a new directory, `~/exp/e67-top3/`. The original script and
   `~/exp/e67/results` were not touched: md5 and mtimes were checked after the run.
2. There are three edits, and none of them changes a score or an ordering:
   - `OUT` now points at `~/exp/e67-top3/results`.
   - `metrics()` keeps the ranked list it was already given. Both scorers already return the top
     k = 5 per crop, and the original read only index 0. It adds `print@3`, `print@5`,
     `artwork@3`, `print@3_distinct` and `wrong_language_miss@3` per crop:
     ```python
     "print@3": t in res[c]["ids"][:3], "print@5": t in res[c]["ids"][:5],
     "artwork@3": tg in gs[:3],
     "print@3_distinct": t in list(dict.fromkeys(res[c]["ids"]))[:3],
     ```
   - A new block at the end writes `e67_top3_summary.json` (counts per arm, paired McNemar via the
     unchanged `e65_lib.mcnemar`, which is a two-sided exact binomial on the discordant pairs) and
     a per-crop ranked-list file. Both stay on the box.
3. The split, the head, the grid, and λ are unchanged. λ was re-selected on **dev** by the
   original code path and came out 0.10 for both G3 and G0h, the same as E67. Nothing was tuned on
   test.

## Positive control: E67's @1 reproduces exactly

| arm | E67 write-up print@1 | replay print@1 | E67 artwork@1 | replay artwork@1 | wrong-lang misses (E67 / replay) |
|---|---:|---:|---:|---:|---:|
| G0 | 136 / 201 = 67.66 % | **136** | 149 | **149** | 34 / 34 |
| G0h | 77.61 % (= 156) | **156** | 78.61 % (= 158) | **158** | 1 / 1 |
| G3 | 107 | **107** | 109 | **109** | 8 / 8 |
| G3p | 75.12 % (= 151) | **151** | 76.12 % (= 153) | **153** | 1 / 1 |

The paired G0 vs G0h print@1 McNemar also reproduces: b = 0 / c = 20, p = 1.9e-06, which is
E67 §4.6's number. **The control passes, so the @3 numbers below come from the same ranking E67
scored.** [src: box ~/exp/e67-top3/results/e67_top3_summary.json · 2026-09-24T16:13:36Z]

## Results (test, n = 201, λ = 0.10)

| arm | print@1 | **print@3** | print@5 | artwork@1 | artwork@3 | wrong-lang miss @1 | wrong-lang miss @3 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **G0** (flat, no head) | 136 (67.66 %) | **168 (83.58 %)** [77.8, 88.1] | 175 (87.06 %) | 149 (74.13 %) | 171 (85.07 %) | 34 | 14 |
| **G0h** (flat + head) | 156 (77.61 %) | **179 (89.05 %)** [84.0, 92.7] | 184 (91.54 %) | 158 (78.61 %) | 180 (89.55 %) | 1 | 1 |
| *G3p (secondary)* | 151 (75.12 %) | *173 (86.07 %)* | 175 (87.06 %) | 153 (76.12 %) | 175 (87.06 %) | 1 | 1 |
| *G3 (secondary)* | 107 (53.23 %) | *118 (58.71 %)* | 122 | 109 | 120 | 8 | 2 |

Brackets are Wilson 95 % intervals. [src: box ~/exp/e67-top3/results/e67_top3_summary.json · 2026-09-24T16:13:36Z]

### Paired McNemar, G0 → G0h

| metric | broken (G0 hit, G0h miss) | fixed (G0h hit, G0 miss) | exact p |
|---|---:|---:|---:|
| print@1 | 0 | 20 | 1.9e-06 |
| **print@3** | **1** | **12** | **0.0034** |
| print@5 | 0 | 9 | 0.0039 |
| artwork@1 | 1 | 10 | 0.012 |
| artwork@3 | 0 | 9 | 0.0039 |

Wrong-language misses: at @1 G0h removes 33 of 34 and introduces 0 (E67's figure). At @3 it
removes **14 of 14** and introduces **1**. That one is the same crop that stays a wrong-language
miss at @1, so G0h ends with a single wrong-language miss at either cut-off.

### Secondary context (not the question)

- **G0 → G3p** at print@3: b = 9 / c = 14, p = 0.40. At @1 it was b = 6 / c = 21, p = 0.006.
  The deduped provenance-first arm's @1 edge over the baseline **does not survive at top-3**.
- **G0h vs G3p** at print@3: G0h is ahead, 8 crops to 2 (p = 0.11, not significant). At print@5
  it is 9 to 0 (p = 0.004). Flat + head is the stronger top-3 shape on this split.

## Verdict

**The D4 win does carry to top-3.** Adding the language head to the flat gallery moves print@3 from
**168/201 (83.58 %) to 179/201 (89.05 %)**, +5.47 pts. That is 12 crops fixed and 1 broken, exact
McNemar **p = 0.0034**. The effect is about half the size it was at @1 (+9.95 pts). The per-crop file shows
why. Of the 20 crops the head fixed at @1, **13 already had the truth in G0's top 3**: the right
print was sitting at rank 2–3, typically behind a foreign-language render. The unaided flat
gallery already counts those as hits at @3. What
remains is still a real, nearly one-directional gain, and it removes every wrong-language @3 miss
but one.

## Caveats

- **n = 201, one frozen test split.** The 95 % intervals on print@3 overlap (77.8–88.1 vs
  84.0–92.7). The paired test is what carries the claim, and it rests on 13 discordant crops.
- 196 of 201 truth prints are English. Only 5 are Japanese, so "wrong language" here almost always
  means "a JA or zh-cn render outranked the EN truth".
- The flat arms' top 3 can hold two language twins of the same artwork, so for G0 and G0h
  artwork@3 is not "3 distinct artworks". The deduped arms' top 3 always are. Compare print@3
  across shapes with that in mind.
- The replay took 538 s on the box. The original E67 run logged 26 s. The compute is the same
  numpy plus the extra bookkeeping, so the difference is probably box load rather than the code.
  Recorded, not investigated.
- The per-crop ids (`per_crop_e67_top3.jsonl`) stay on the box on purpose and are not committed.
