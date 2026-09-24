# Critique 2: senior product designer (craft, legibility, the persona gate)

Lane `critique2/designer`, 2026-09-24, deck at `main` `b22f162`, rendered at 1280×720 and at
0.5×. Sizes are px at 1280×720.

**DONE: 11 of 20** (last round 3 of 22). The main old blocker is fixed: charts fill the 1136×440
box and room-facing labels are 20–28 px, up from 6–8 px.

| # | First hesitation | Remove | Verdict: blocking reason |
|---|---|---|---|
| 1 | None | Nothing | **DONE** |
| 2 | The card ID is about 11 px in a 606 px-wide shot, with no callout | The Whatnot nav bar | **DONE** |
| 3 | The "UI done? 09-13" node sits before the "09-11" endpoint | "spaced by order" | **NOT**: the order contradicts the dates |
| 4 | "First sign…" appears three times: title, quote, pill | The pill | **NOT**: "After" shows the fix before slide 5's fork |
| 5 | None | The "my estimate" chip | **DONE** |
| 6 | Half-hour and "my estimate" each said twice | The bottom bar | **DONE** |
| 7 | The hero bar (0.14) has no ink. "≈ 1 in 700" (20 px) sits about 4 px above "0.14" | The p50 aside (3-line label) | **DONE** |
| 8 | None | Nothing | **DONE** |
| 9 | 7 rows for 8 method slides, in a different order. It promises slide numbers and gives names | The "UI flaps" row | **NOT**: the map doesn't match the deck |
| 10 | **"Opus 5.5" is clipped to "pus 5.5"** | The legend caption | **NOT**: clipped label. Edges are undirected, and Fable shares Opus's hue |
| 11 | Six boxes snake 1→3↓4←6. The script says "five steps, four mechanisms, left to right" | "founder's word" chip | **NOT**: the focus slide's diagram doesn't match its narration |
| 12 | **The kill-line label (20 px) runs across the G0 bar** (x ≈ 255–405). "KILLED/107/201/line/53.2%" is stacked with no gap | Codes G0/G3/G0h | **NOT**: the label collides with the bar |
| 13 | **"+9.95" and "+5.47" sit on the lines.** The slope uses about 40 of 300 px in height. The tiles use G0 blue | Lock rate and precision tiles | **NOT**: two jobs, and "the gain halves" isn't visible |
| 14 | None; a good breather | Nothing | **DONE** |
| 15 | None; the cleanest diagram | "serves both" | **DONE** |
| 16 | 270 px captures with 6–8 px UI. No failure is marked. The right capture is cut off ("3 ANSWERS DI…") | The second capture | **NOT**: the method is still off-screen |
| 17 | The subtitle is a citation, not the claim. Hatching marks one estimate (180 s) but not the other (20–30 s) | "founder testimony" | **DONE** (the linear axis is fixed) |
| 18 | None; the URL is now on the slide | Nothing | **DONE** |
| 19 | None | "spread across the day" | **DONE** |
| 20 | **The "65.2% non-locked" label runs into the 71.3 % dot.** The blue/orange consensus dots have no key | Counts in parentheses | **NOT**: label collision |

**Old blockers fixed:** half-size charts, the four identical act charts, the log axis, the
missing dedup arm and kill line, the unreadable yardsticks and table, the URL, bullet counts and
line breaks. **Still open:** undirected tier edges and Fable/Opus sharing a hue (10), persona-gate
evidence that is only unreadable UI chrome (16), and colour drift.

## Top 5 fixes, ranked

1. **16: show the gate, not the app.** Under the Dez card, add a verdict strip at 24 px:
   "Panel · 09-13 21:50 · DONE · 9 s/task (simulated)" → "Me · iPhone · 09-14 09:40 · unusable".
   Swap the two captures for one at ≥ 340 px wide, with three numbered 24 px callouts: scrolling
   sections, help modal, rotate. Add one line: "The panel walked a fixed viewport." That is the
   design takeaway, and right now it reads as "agents role-played users".
2. **13: one job.** Put the slopegraph in the full 1136×440 box with a 60–95 % y-axis, and set
   the deltas as 26 px labels outside the end dots. Give the lot result its own beat: "65.2 %,
   about 2 in 3" at 64 px in neutral ink. Lock rate and precision go to backup.
3. **12: move the kill-line label** to the axis end, above the line, at 22 px. Drop "107/201"
   and keep a gap of at least 12 px between "KILLED" and "53.2%". Name the arms in words.
4. **10: unclip "Opus 5.5"** with a left gutter of at least 110 px. Draw arrows from implementer
   to reviewer. Give Fable a neutral outline, not a green hatch.
5. **9, 11, 3, 2: make the pictures match the words.** 9: 8 rows in deck order, with slide
   numbers 10–17 at 24 px. 11: a left-to-right 5-step row with 4 mechanism chips beneath, or a
   stage note that says "follow the numbers". 3: fix the 09-13 node. 2: a 28 px callout on the
   card name.

## Craft notes

- **Type scale.** There is one system now: h2 45 px, subtitle 32, labels 22–28, dim notes 20,
  footers 16. The 20 px dim notes are "E67's fired at −14.43", "E84: 8 calls · 60 s · $6", the
  tile CIs and "≈ 1 in 700". They land at about 9 px on a far projector. Raise them to 22 px or
  cut them.
- **Colour meaning drifts.** Blue means before/baseline (3, 4, 7, 12, 15), then a headline
  number (13 tiles), then Haiku (10). Orange means after/shipped, then Sonnet, then the
  testimony rule. Green means method, then Opus. Fix it deck-wide: blue = before, orange =
  shipped, green = method, grey = control. Encode tiers on 10 by position plus a neutral fill.
- **Contrast.** It's fine. The weak pair is dim grey text in green boxes, which washes out at
  0.5×.
- **Pacing.** The order works: story (4–6), resolution, demo, map, then eight methods broken by
  two text slides (14, 18).
- **Persona section.** It's better than last round: the brief, the verdict and the testimony are
  on screen. It still under-serves the method, though. DONE → unusable is the talk's strongest
  designer moment, and right now it's one italic line next to two illegible screenshots.
