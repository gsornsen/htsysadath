# L7 critique: converged (coordinator, 2026-09-24)

Four Opus 5.5 persona critics walked all 22 rendered slides and the spoken notes:
[senior-swe](critique/senior-swe.md), [pm](critique/pm.md), [designer](critique/designer.md),
[mid-swe](critique/mid-swe.md). Only findings that several personas share, or that the
coordinator re-verified against the source, are promoted here. Nothing in the deck is changed yet.

## DONE matrix (D = DONE; order: designer · mid-swe · pm · senior-swe)

| Slide | Verdicts | DONE | | Slide | Verdicts | DONE |
|---|---|---|---|---|---|---|
| 1 | D D D . | 3 | | 12 | . D . D | 2 |
| 2 | . D D . | 2 | | 13 | . . . . | 0 |
| 3 | D D D D | **4** | | 14 | . D D D | 3 |
| 4 | . . . . | 0 | | 15 | . . D D | 2 |
| 5–8 | . . . . | 0 | | 16 | . . . . | 0 |
| 9 | . . . . | 0 | | 17 | . D D . | 2 |
| 10 | . D . D | 2 | | 18 | . . . . | 0 |
| 11 | . . . . | 0 | | 19 | D . . D | 2 |
| | | | | 20 | . . . . | 0 |
| | | | | 21 | . D D D | 3 |
| | | | | 22 | . . . . | 0 |

Per persona: designer 3/22 · mid-swe 8/22 · pm 7/22 · senior-swe 7/22. **NOT for all four: 12 slides.**

## Blocking, agreed across personas or verified by the coordinator

1. **Charts render at half size** (designer, confirmed): every chart is a 1280×720 SVG capped by
   `section img { max-height: 380px }` → 0.53×; chart text lands at ~6–8 px vs a ~24 px floor.
   Slides 11 and 20 need a redesign, not a resize (too many cells at any legible size). *Fix:*
   redraw charts for their real box (~1136×440), labels ≥ 24 px, no in-chart title/caption/source
   (the source moves to a slide footer or the notes); split 20 into two 3-row slides; split 11.
2. **Slides 5–8 repeat one chart four times** (all four). *Fix:* one timeline slide with the
   current act highlighted, or two slides.
3. **Chart and slide disagree** (senior, designer, mid; coordinator-verified):
   - 9: the headline is "dedup lost, the kill line fired", but the chart has neither the dedup arm nor the line.
   - 11: the title says "what we didn't do"; the chart is four top-3 yardsticks. Speech and plot
     show different reads (notes 45.2 % = E100b vs chart 42.1 % = single fire 8/19; notes 70.3→82.9
     vs chart only 82.9). Panel D stops at the 76.9 % small-sample high, not the pooled 71.3 %
     (n=87). Panel C includes the B1 replay, which D12 showed is a padding-only single-crop test.
   - 17: log x-axis (`Math.log10` in build-charts.mjs), so bar length misstates the ratio. Testimony
     drawn like measurement. Agent and review are successive stages: the fair comparison is 180 s
     vs ~31–46 s. The subtitle says ~20 s; the chart says 20–30 s.
   - 12: titled for non-locked lots, drawn against the overall 71.3 % line.
4. **Slide 16 shows its placeholder on screen** (all four).
5. **Slide 22 doesn't say where to start** (all four): no repo URL (also missing on slide 1);
   three bullets under "two things"; two are questions, not actions.
6. **Slide 4 overstates the thesis number** (senior; checked against notes P3a): "about 100
   hypothesis-gated experiments … overnight". The record: ~108 done/shipped across ~150 docs from
   09-05 to 09-21; ~25 merges in one overnight wave; 12 of 151 have an explicit KILL line. *Fix:*
   "~100 experiments in two weeks, many of them gated and run overnight". Gerald decides the words.
7. **The persona method is never shown** (designer, mid): slides 13–15 show no brief, no DONE/NOT
   verdict, no literal-ask → job example. Demo 1 looks like magic (it's four `claude -p` calls fed
   persona briefs, and the audience never sees one). *Fix:* show one real brief and one verdict row.
8. **Slide 18's terms go undefined** (mid, pm, senior): lane, worktree, gate and tier are never
   defined; "Fable" means nothing to the room; the DAG shows this talk repo's lanes, not the
   overnight experiments the notes describe. *Fix:* define on the slide; label it "this repo".

## Story gaps (need Gerald)

- **The opening story never ends** (pm): slide 2's jitter is never resolved. Which fork won, how
  long did it take, what did it cost?
- **Total cost, dollars and hours** (pm, senior; the Q&A question the talk can't answer): scattered
  figures only (~$9 for 760 labels, a $6/run cap, one Opus round at ~$24 + ~$19). There's no total for
  the experiment track, and no estimate of Gerald's own hours speccing and reviewing.
- **Hold-out** (senior; coordinator checked, still OPEN): was E67's 201-crop test side held out from
  the E65a head's 432 real training crops? The head's split spec is by SET for renders (70/15/15,
  425 sets); its real-crop input is a different file (`e11_crops_vecs`); nothing proves disjointness.

## Smaller, agreed

- Slide 2: "three layers, five per part" reads as 15. The abstract's math is 3 areas × 3 parts × 5 = 45.
- Slide 21's notes say "four habits" over three bullets; slide 22 says "two things" over three bullets.
- Stray line breaks from the source on slides 15 and 16.
- Colour meanings shift between charts.
- The terminal blue is ~4.2:1 contrast (target 4.5:1).
- Slide 15: four 200-word drafts can't be read in 4 minutes. Reveal the tl;dr lines, then choose.
- Jargon on slides (pm): McNemar/p, @1/@3, arm, dedup, frozen split, CI, auto-lock. Plain words on
  the slide; statistics go to the notes.
- A copyable **starter kit** (mid): generic fan-out + briefs, a blank lane brief, and a five-step first-run checklist.
