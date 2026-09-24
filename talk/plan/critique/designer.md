# Critique: senior product designer (story, craft, legibility)

Lane `critique/designer`, 2026-09-24, deck at `main` `ad41954`, rendered at 1280×720 and at
`--image-scale 0.5`. Each chart is a 1280×720 SVG capped at `max-height: 380px`, so it is drawn
at **0.53×** (a 13.5 px SVG label reaches the screen at 7 px). The floor for room-readable text
is **24 px** (the body text is 32 px).

**DONE: 3 of 22.**

| # | Verdict | Blocking reason | Remove |
|---|---|---|---|
| 1 | DONE | None. | Nothing |
| 2 | NOT | The on-screen maths fails: "three layers … five per part" is 15, not 45+ (the "three parts" factor is only in the notes). A talk about *visual* jitter has no visual. | "detect→identify" jargon |
| 3 | DONE | None. | "Scope, staffing and timeline" |
| 4 | NOT | Two jobs. The talk's turn ("exploring got cheap") sits on a 30-second demo hand-off. | The thesis line: give it its own slide |
| 5 | NOT | Four-act chart with no "you are here" (all nodes are the same blue). Descriptions render at **7.4 px**, and the chart's lower half is empty. | The in-chart title, caption and source |
| 6 | NOT | The same chart, with Act 2 not lit. The bakeoff numbers are only in the notes. | Same |
| 7 | NOT | The same chart. "One core, two apps" is a diagram that is never drawn. | Same |
| 8 | NOT | The fourth identical chart in a row reads as a stuck clicker. | Same |
| 9 | NOT | The headline is "dedup lost, the kill fired", but the chart has no dedup arm and no kill line. Its @3 group pre-empts slide 10. | The @3 group |
| 10 | NOT | The same chart as 9 with no new emphasis. +9.95 → +5.47 appears only in a 7 px caption. | McNemar labels (6.9 px) |
| 11 | NOT | Two jobs. The title promises the stopped experiments, which are only in the notes. The chart is a four-panel taxonomy: ticks **5.8 px**, labels **7.4 px**, panel titles **9 px**. The chart's low point is 42.1 % (8/19 fire rows); the notes say 45.2 % (E100b). The source line is clipped. | The taxonomy |
| 12 | NOT | The tiles read (21 px numbers). The dot plot doesn't (6–8 px), and it's titled "non-locked" while drawn against a 71.3 % *overall* line. The source line is clipped. | The dot plot |
| 13 | NOT | The method is invisible: no persona brief, no DONE/NOT, no s/task. The 190 px crops show purple placeholders with no before/after label. It reads as a gimmick. | The two answer-bar crops |
| 14 | NOT | Phone captures about 190 px wide with 4–5 px text. None of the three failures is marked, and "Dez DONE · 8 s" doesn't appear. | The second capture |
| 15 | NOT | A source newline renders as a break: "a tl;dr / frame". | "each under 200 words" |
| 16 | NOT | An unfilled placeholder, with the same break bug. | The ⟨…⟩ text |
| 17 | NOT | A log axis makes 180 s → 11 s look about 4×, not 12×. Ranges are drawn as bars from zero. The subtitle says "~20 s"; the chart says "20–30 s". | The caveat box (7 px) |
| 18 | NOT | "One tier up" isn't encoded: the edges are undirected. Fable (hatched green) and Opus (green) share a hue. The shas are about 5 px. | The node shas |
| 19 | DONE | None. | "(slide 18's chart)" |
| 20 | NOT | A 6×4 table in an SVG. The body renders at **6.6–7.7 px** and the Source column at **6.1 px**, about 3.5 px at half scale. | The Source column |
| 21 | NOT | The notes say "four habits" and the slide shows three bullets. | Nothing; split bullet 2 |
| 22 | NOT | "Two things" over three bullets, and no repo URL or QR on the slide people photograph. | The "Start here" bullet → URL |

## Top 5 fixes, ranked

1. **Stop shrinking full-canvas SVGs (5–12, 17, 18, 20).** Author each chart for the real content
   box (about 1136×440) and delete the in-SVG title, caption and source line: the slide title does
   that job, and the source goes in the notes. Target **≥ 24 px** for every label a claim depends
   on and ≥ 18 px for ticks. This fixes most of the NOTs.
2. **Slide 20: redesign it.** Split it into "memory corrected" (3 rows) and "record over-read"
   (3 rows). Each row gets two cells, remembered → recorded, at ≥ 28 px. Sources go to the notes.
   Keep the green rule.
3. **Slide 11: redesign and split it.** Put the stopped experiments on screen, as the title
   promises (5 rows: "E57 SigLIP2: −9.55, stopped"). Show the four yardsticks as one strip: four
   labelled ranges on a shared 0–100 axis, ≥ 24 px, no per-panel axes. Reconcile 42.1 vs 45.2.
4. **Slides 13–14: show the method.** On 13, put one persona card (Dez: 22, phone-only, one thumb,
   the job in her words) beside the P0 verdict table (seat · s/task · DONE/NOT), plus the
   literal-ask → job row ("bulk approve 92" → "don't make me re-click my own answers" → zero
   clicks), all at ≥ 24 px. On 14, set "Dez · DONE · 8 s" against "my iPhone: unusable", with
   three numbered callouts on one capture at ≥ 320 px wide.
5. **Slides 5–8: add "you are here".** Four nodes and dates at ≥ 24 px. Light the current act and
   dim the others to about 40 %. The prose goes to the notes.

Also: 9 shows @1 plus the dedup arm and the kill line; 10 adds @3. 17 uses a linear dot/range
plot. Fix the breaks on 15–16 and the counts on 21–22, and add the URL.

## Craft notes

- **Type scale.** The Markdown layer is consistent (h2 45 px, body 32 px). Inside the images
  there's a second type system, about 4× smaller: 3–6 px at half scale. The charts also span
  only x ≈ 302–977, which leaves about 45 % of the width empty.
- **Legibility verdict on 11 and 20: confirmed illegible, and both need a redesign.** Even at 1:1
  they stay under the floor and carry too many cells for any size that would pass. A resize is
  enough for 9/10, 12's tiles and 18.
- **Contrast.** Ink on the surface is fine. The blue terminal note (#3987e5 on #242422) is about
  **4.2:1**; raise it to about #6aa6f0. The orange button (about 4.5:1) passes at 42 px bold.
- **Colour meaning drifts.** Blue means baseline (9), then a stat (12), then Haiku (18). Orange
  means treatment, then a daily dot, then Sonnet. Green means historical, then Opus, then
  over-read. Fix one meaning per hue, or go monochrome plus one focal accent.
- **Arc C/D does not do the method justice.** The substance, all of it in the notes and none on
  screen: standing briefs with a device and a job, critics with a lens, file:line citations,
  seconds-per-task, the tie-break rule, and ask → job translation. The on-screen evidence is
  unreadable UI chrome. The idea designers would take home, translating the literal ask into the
  job, is never shown. Slide 16 is empty, so arc D's payoff (what came from which draft) has no
  visual. As built, a designer leaves thinking "he had agents role-play users."
- **Pacing.** Slides 5–12 are eight same-layout chart slides in a row. Slide 12's tiles (one big
  number per idea) show the fix.
