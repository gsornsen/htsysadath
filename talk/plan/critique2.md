# Critique round 2: converged (coordinator, 2026-09-24)

Scores (DONE / slides): senior-swe 12/20 (was 7/22) · pm 14/20 (was 7/22) · designer 11/20 (was 3/22) ·
mid-swe 12/20 (was 8/22). Files: `critique2/*.md`. The designer independently found all 7 of the
coordinator's held-back render notes (`critique.md`, end), which corroborates them.

## Final slide numbering (the contract for every fix lane)
1 Title · 2 The scout today · 3 How we got here · 4 The first sign · 5 The fork · 6 What changed ·
7 Jitter, resolved · 8 Demo: the card scout, live · 9 Which method fits which problem ·
10 Method: orchestration · 11 Method: gates and flags · 12 Method: kill lines in action ·
13 Method: measure the bar: top-3 halves the gain · 14 Method: measure the bar: the bar, live ·
15 Method: stop things · 16 Method: hardest shared core first · 17 Method: persona review gates ·
18 Method: agents first, human verdict · 19 Two things for next week · B1 cost/hours/hold-out ·
B2 four yardsticks. (Old slide 13 splits into 13 + 14; the total stays ≤ 35.0 min.)

## Fixes, by owner

**F1: visuals** (`talk/slides/assets/{charts,diagrams}/`, `data/`, `scripts/`)
- `identify-timeline.svg` (3): the end card is a RESULT panel off the time axis: "identify latency, as
  the client sees it · 375 ms p50 (EXP-E88, 09-11)"; the start card is "as the client sees it · 6–15 s
  live, 10.4 s median of 6 bakeoff captures (08-18)". The axis ends at the last node (09-13), so no
  node sits after an endpoint.
- `jitter-drops.svg` (7): give the 0.14 bar visible ink (a minimum height plus a marker); separate
  "≈ 1 in 700" from "0.14".
- `e-lane-dag.svg` (10): fix the clipped "Opus 5.5" label; directed edges (arrows); the coordinator tier
  visually distinct from Opus (not the same green); label it "coordinator (Fable)".
- `gates-flags.svg` (11): keep six boxes; label E84's caps "(labeling agents)", since they're the
  labeler's, not overnight runs'.
- `d4-arms.svg` (12): move the kill-line label clear of every bar; add a small tag on G0h: "found
  after the kill · same 201 test crops" (post-hoc honesty, arc A).
- `d4-slope.svg` (13): FULL WIDTH 1136×440, y-range ~60–95 % so the halving is visible; gap labels
  off the lines.
- `lot-bar.svg` (14): FULL WIDTH 1136×440, three tiles in a row, neutral + one accent (not G0 blue);
  plain labels ("how often it auto-locks", "right when it locks", "top-3 when it doesn't"); CI as small text.
- `methods-map.svg` (9): 8 rows in SLIDE ORDER with slide numbers, no E-codes:
  too many forks, one of you → lanes + a reviewer one tier up → 10 · runs you can't watch → gates +
  flags → 11 · a tempting favourite → a pre-registered kill line → 12 · "is it better?" → measure the
  bar that matters → 13–14 · too much to try → let the gates tell you what to stop → 15 · one hard core,
  many products → solve it once, first → 16 · "is the UI done?" → a persona review gate → 17 ·
  repetitive judgement work → agents first, human verdict → 18.
- NEW `persona-gate.svg` (17): brief card (Dez: 22, phone-only, one thumb; "swipe-fast, not
  homework") → the panel's verdict: DONE, 30 s → 9 s median (P0, 09-13) → the real device next morning:
  "pretty much unusable" (B19, 09-14 09:40) → the rule added: a real-device check before DONE.
  [arc C]
- `top3-measures.svg` (B2): un-overlap the 71.3 % / 65.2 % labels.
- Colour: one meaning per hue across ALL assets (blue = before/baseline, orange = after/intervention,
  green = method/gate, grey = context/rails); stat tiles are not blue.

**F2: deck + notes** (`deck.md`, `notes.md`, `outline.md`, `dark.css`)
- Split 13 → 13/14 and renumber everything; reference the F1 filenames above; slide 17 uses `persona-gate.svg`.
- Slide 6: one line defining worktree, gate and flag in plain words, and the COST line on stage:
  "~30 min a day of my time (my estimate) · a flat Claude Max subscription · ~100 experiments in two
  weeks · the jitter fixed in 3 days".
- Slide 3 notes: the units (both are identify latency as the client sees it; the 10.4 s median is from 6 bakeoff captures).
- Slide 8 notes: no jargon ("crops vote", "pad 17 px", "E79" → plain words).
- Slide 11 notes: match the six boxes; say the E84 caps came from the labeling agents.
- Slide 12: body + notes say G0h was found AFTER the kill, on the same test split.
- Slide 14: define auto-lock / "right when it locks" / top-3 in plain words; no "CI" on screen.
- "Fable": say "coordinator" and define it once (slide 10).
- Slide 19: each action gets a first step + the starter path: (1) `starter/two-lanes/` +
  `starter/two-lanes/unattended.md`; (2) `starter/persona-gate/`. Add one sentence a PM can say to their boss.

**F3: starter kit** (`starter/`)
- NEW `starter/persona-gate/`: README (the method: personas with jobs, a panel, a DONE/NOT verdict,
  seconds-per-task, a real-device check), `panel-brief.md` (a persona template), `verdict.md` (the
  verdict format).
- NEW `starter/two-lanes/unattended.md`: flags (dev on / prod off; a human flips prod), per-run caps,
  a time window with an end time, gates judged on frozen/replayed data, a morning-report template, and
  the idle watchdog lesson.
- `starter/README.md`: lead with the talk's two actions; move persona-drafts under "extras".

Then **polish, last** (impeccable + hallmark), then a short confirmation render.
