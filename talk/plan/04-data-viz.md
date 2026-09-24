# Data-viz plan — lane `plan/data-viz`

2026-09-24. `dataviz` skill loaded first; its procedure isn't repeated here.

## Visual list (claim · source · form · risk)

1. **D4 kill-and-recover, paired @1/@3.** Claim: the language-head fix holds at the bar that
   matters (top-3), at half its @1 size. Source: `E67-top3-replay.md` — G0 67.66→83.58 %, G0h
   77.61→89.05 %, paired McNemar b=0/c=20 p=1.9e-06 @1, b=1/c=12 p=0.0034 @3. Form: grouped bar,
   G0 slot-1 blue vs G0h slot-2 orange × 2 groups (@1, @3), p as annotation text. Risk: reading
   the smaller @3 gap as "noisier" rather than its cause (13 of 20 @1 fixes already sat rank
   2–3) — caption must say so.
2. **Top-3, four incompatible measurement groups.** Claim: top-3 was measured four
   structurally different ways (crop-served, crop-offline, redundant-crop groups, live lot); none
   forms a trend line. Source: `top3-trajectory.md` groups A–D. Form: small multiples, one strip
   per group, points *not* connected across panels, each stating its unit and n. Risk: the
   deck's biggest misuse risk — any layout letting the eye draw one line across panels is wrong
   by construction; no shared x-axis, ever.
3. **Arc B — concurrent spines, swimlane.** Claim: four "pivots" the brief frames as sequential
   opened within 8 days and ran concurrently for weeks. Source: `git-timeline.md` dated-phase
   table + `pivots-timeline.md` decision marks. Form: swimlane, lane per spine (pregrade, Art
   Binder, live scout, lots, comps, consolidation, mobile). Risk: implying precision the source
   lacks (Art Binder is day-stamped, not minute-stamped) — say so on-slide.
4. **Arc F — two levers, not one.** Claim: "3 min → ~20 s" fell through two levers (agent first
   pass, redesigned review UI), not one speedup. Source: `F-agent-labeling.md` two-lever table.
   Form: three horizontal bars (hand 180 s / agent-only 11–16 s / human review ~20 s), tagged
   with scope (per-label vs per-task) and evidence tier (testimony / instrumented / estimate).
   Risk: one arrow implies agents alone did it — the tags carry the honesty.
5. **Remembered vs recorded — 6-instance table.** Claim: six times the remembered/tidied fact
   differed from the record; the gap is the talk's own "why mine, don't recall" argument. Source:
   `decisions.md` D4–D8, `cross-arc.md`: D4 dedup framing, D5 arc-B ordering, D6→D7 the 3-min
   reversal, top-3-bar date, E79 crop-vote not holding, 76.9 %-at-n=52 (visual 7). Form: a table
   — Instance · Remembered · Recorded · Source; identity data, a chart would be theater. Risk:
   reads as a "gotcha" on Gerald unless captioned as self-caught and logged in the open.
6. **Arc E — coordinator tier ladder, as this repo's own lane graph.** Claim: "reviewer one
   tier above implementer," shown on real branches/merges. Source: `E-coordinator.md` M2,
   curated from `tracking.md`'s lane table — **not** a raw `git log --all --graph`, dominated by
   ambient `worktree-agent-*` session branches, not talk content. Form: small DAG, nodes = lane
   branches colored by model tier, edges = merges to main. Risk: an uncurated graph is illegible
   from the back of the room.
7. **Lot-level top-3 accuracy, final.** Claim: on non-locked lots, top-3 held for about two in
   three (65.2 %, 45/69); the earlier 76.9 % at n=52 was a small-sample high, not a trend.
   Source: `lot-top3-unlocked.md`. Form: (a) three stat tiles — lock rate 20.7 %, lock precision
   88.9 %, non-locked top-3 65.2 %, each with its Wilson CI; (b) a dot plot of top-3-last by day
   (n, CI per dot) showing 76.9 % doesn't survive its own interval. Risk: the mistake the slide
   argues against — connecting daily dots into a line.

Cut: none — each of the 7 carries a distinct claim.

## Rendering pipeline

**Default: a dependency-free Node build script emitting static SVG**, committed as assets.
Rejected Mermaid for the diagrams: `mmdc` needs headless Chromium via puppeteer (heavy) and its
default theme misses the mark spec without heavy overrides. Every visual here is small (≤8
lanes, ≤10 nodes, ≤4 series), so hand-templated SVG in the same script that draws the bar charts
is less total tooling. Rejected inline hand-authored HTML/SVG per-slide too: these numbers have
already been reconciled twice (D6→D7) and will likely be again; a script forces every chart to
regenerate from checked-in data instead of inviting silent drift in inline markup.

**Layout:** `talk/slides/data/*.json` (hand-typed numbers, each with a `source` field citing the
findings-file line) → `talk/slides/build-charts.mjs` (one script, no npm install) →
`talk/slides/assets/charts/*.svg` (generated, committed, no client-side JS). Marp embeds charts
as `![](assets/charts/d4-arms.svg)` or `<img>`.

**Palette/typography:** dark theme only (projected stage talk) — surface `#1a1a19`, categorical
slots 1–2 (blue/orange) for two-arm comparisons, slots 1–3 for the DAG's model tiers (clears the
all-pairs CVD floor for exactly three; a 4th tier folds into a shared label). System sans
throughout, proportional figures for stat tiles, legend for ≥2 series, sparing direct labels,
hairline gridlines. `validate_palette.js` run once against the dark surface for the categorical
order as a whole; per-chart reruns are redundant since every chart uses a subset of it.

## Proof result

Built `build-chart.mjs` + `d4-arms.json` in the session scratchpad (not committed) and rendered
visual #1 end to end: JSON → SVG, dark theme, slots 1+2, rounded-top bars square at baseline,
tip labels, legend, McNemar annotations, source line. First ran `validate_palette.js
"#3987e5,#d95926" --mode dark --surface "#1a1a19"` — **ALL CHECKS PASS** (worst adjacent CVD ΔE
26.8, normal-vision ΔE 31.8, clear of the ≥8/≥15 floors). One layout fix was needed on first
render (annotation text collided with axis labels) — confirms skill step 7 ("render it, look at
it") matters even for a scripted chart. Zero npm dependencies; the pattern extends directly to
the swimlane (rows, not bars) and DAG (nodes/edges).

## Questions for Gerald

1. Visual 6: hand-curate the lane DAG, or a filtered `git log --graph` (dropping
   `worktree-agent-*`)? Curated is more legible; filtered-full more verifiably honest.
2. Visual 4 mixes founder testimony, an instrumented number, and a founder estimate. Print all
   three trust tiers on the slide, or push to speaker notes?
3. OK to ship dark-mode only, given a live-stage talk with no obvious print/light consumer?

## Hygiene check before commit

`git diff --cached | grep -E "^\+" | grep -iE "api[_-]?key|sk-|token|@gmail|/Users/|/home/|\.ts\.net|192\.168"` — must be empty.
