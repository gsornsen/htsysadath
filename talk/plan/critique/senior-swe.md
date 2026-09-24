# Critique: skeptical senior/staff SWE

Lane `critique/senior-swe` · Opus 5.5 · 2026-09-24. I walked `talk/slides/deck.md` (slides and
notes together), rendered all 22 slides at 1280×720, and checked them against the notes'
provenance appendix, D4–D12, arc A and the three top-3 findings. Critique only: nothing was edited.

## Per slide

| # | Verdict | Blocking reason (element) | Remove |
|---|---|---|---|
| 1 | NOT | Notes say "public repo… check me", but there's no URL on the slide, and most `[G:…]` sources are in Grailith, which a viewer can't open | — (add the URL) |
| 2 | NOT | "about every 500 ms" conflicts with the talk's own provenance (P1b: fires p50 6.2 s; question 1 still open). "45+" is 3×3×5 testimony (P5), shown as if it were a count | "45+" |
| 3 | DONE | (hesitated: "nearly parked" is testimony, but it's labelled D4) | generic bullet 1 |
| 4 | NOT | "about 100 hypothesis-gated experiments… overnight". The record: ~150 docs over 09-05→09-21, ~25 merges in one overnight wave, only 12 of 151 with a KILL line (P3a) | "overnight" |
| 5 | NOT | The same `b-four-acts.svg` on 4 slides, labels ~8 px, no highlight on the current act | the repeats |
| 6 | NOT | Notes set vision "5 of 6" against embedding "1 of 5 same-art prints": different n, different sets. Neither number is on screen | one bakeoff |
| 7 | NOT | Duplicate chart; framing (D11), no outcome | slide (merge 5–8) |
| 8 | NOT | Duplicate chart; act 4 shows no result | slide (merge 5–8) |
| 9 | NOT | The chart leaves out the dedup arm and its kill line (−14.43 never visible). The winning arm was **post-hoc** (arc A l.31), scored on the same split | duplicate of 10's chart |
| 10 | DONE | (hesitated: @1 bars have no CI whiskers, @3 bars do). The halving is the most credible minute | — |
| 11 | NOT | "What we didn't try" is wrong: E57/E58/E53d were run. Two topics on one slide. Spoken numbers ≠ plotted ones (notes "70.3→82.9", "45.2 %"; chart 80.5, 42.1). Footer cut off | four-yardsticks chart |
| 12 | DONE | (hesitated: headline uses the non-locked subset; the only rater is the author) | green 76.9 % diamond |
| 13 | NOT | Screenshots illegible at 720p; the "zero clicks" win isn't visible | 1440 px card |
| 14 | DONE | (hesitated: shots unreadable, but the quote carries it) | — |
| 15 | DONE | (hesitated: live LLM on venue Wi-Fi; a labelled video fallback exists, D10) | the hard break in "tl;dr / frame" |
| 16 | NOT | Placeholder "⟨Fill after rehearsal…⟩" renders on screen | — |
| 17 | NOT | Log-axis bars from an arbitrary origin; testimony (180 s) drawn the same as instrumented bars. Agent and review are successive stages, not alternatives: the fair comparison is 180 s vs ~31–46 s. Subtitle "~20 s" vs chart "20–30 s" | log-scale bars |
| 18 | NOT | Notes ask how a hundred experiments ran "while I slept"; the DAG shows 4 lanes from *this talk repo*, not Grailith's overnight queue | tiny tier labels |
| 19 | DONE | (hesitated: commit count still ⟨⟩ in notes; offline aliases, nothing staged) | — |
| 20 | NOT | A 6×4 table at ~9 px is a document, not a slide | source column |
| 21 | DONE | (hesitated: "no dated incident" of paralysis; honest, keep it) | — |
| 22 | NOT | No URL, paths or QR code. Two questions aren't a method I can run on Monday | bullet 2 |

**DONE: 7 of 22.**

## Top 5 fixes, ranked

1. **Slide 4: make "~100" match the record.** Say "~150 experiment docs over 16 days, about half
   pre-registered, 12 with a kill line; one overnight run merged ~25." It's the thesis number,
   and the repo currently contradicts it.
2. **Slide 9: draw the losing arm.** Add G3 (dedup) with its kill line. Say the head arm was
   post-hoc, on the same 201-crop split, and still survives (p = 1.9e-6 across four arms). Say
   "forking paths" before Q&A does.
3. **Slide 17: switch to a linear axis and hatch the testimony.** Rows: by hand 180 s (hatched)
   vs agent 11–16 s **plus** review 20–30 s, stacked. Make the subtitle match the chart.
4. **Slide 11: split it and reconcile.** Rename it "What we stopped" (E57, E58, E53d, E119). Give
   the yardsticks their own slide or cut them. Make the spoken numbers equal the plotted points.
   Fix the footer.
5. **Slides 5–8, 20, 22: legibility and the takeaway.** Merge 5–8 into one highlighted timeline
   with 20 px+ labels (saves ~1.5 min). Cut 20 to three legible rows. On 22: the URL, a QR code,
   `prompts/04-audience-drafts.md`, `docs/agents/coordinator.md`, and a 3-step Monday recipe
   (instrument the transition, freeze a replay set, write the kill line first).

Also, before rehearsal: slide 16's placeholder, slide 2's 500 ms (answer P1 Q1), and slide 1's URL.

## Q&A challenges

1. **"How many of the ~100 had a gate written before the run?"** Answerable: 83/151 mention
   pre-registration, 12 have KILL lines, and one overnight wave merged ~25. But the answer
   undercuts slide 4 as worded.
2. **"Your win is an arm added after the kill, on the same split. How many arms, and is the
   split held out from the head's training?"** Half-answered. Arc A says post-hoc; the E67
   replay reproduces four arms exactly. I found nothing on whether the split was held out from
   head training.
3. **"What did it cost, in dollars and in your hours?"** The talk can't answer this yet. Costs
   are scattered (~$24 + ~$19 for one Opus round in arc E M1; ~$9 for 760 labels; a $6 per-run
   cap). There's no total spend for the experiment track, and nothing on Gerald's hours spent
   speccing, reviewing and correcting ("I had to keep correcting it"). Without that,
   "extra copies of you" is the claim I walk out on. An aggregate spend isn't a credit
   balance.

Also: "the truth is my own taps" (slide 12). One rater, who is also the author: no inter-rater
agreement.

## Hype, staging, time

- **Hype:** "extra copies of you" (slide 22 notes) and "while I slept" (18). The rest is hedged
  well; slides 10, 12, 14 and 21 are why I'd stay.
- **Staging:** low risk. Demo 2 is offline aliases, and Demo 1's video is labelled as recorded.
  But four LLM rewrites is the least surprising thing in the talk for engineers, at 4.5 min.
  The method I'd actually try, gated offline replay (slides 4, 9–12), has no demo.
- **Budget:** the notes run ~2,400 spoken words, ~17 min at 140 wpm, plus 7.5 min of demos: ~25
  of the planned 34. Believable, even loose. The exception is slide 15: nobody reads four
  200-word drafts in 4 min. Show one in full and the other three as headlines.
