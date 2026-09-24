# Live-talk structure v2 (coordinator, 2026-09-24): from Gerald's story-plan answers

## What changed, and why
- **Topic sharpened (Q4):** the talk is about HOW TO APPLY orchestration, gates and experiments,
  and which method fits which kind of problem. "Remembered vs recorded" is CUT (Q5: no stage
  time). Demo 2 no longer walks the D-log corrections.
- **Protagonist (Q1):** Gerald, first person, narrating his own project.
- **Open (Q2):** resolve early, and open on the CURRENT STATE, live: the scout identifying cleanly
  (Demo 0). The attention-getter is the working thing.
- **Timeline (Q3):** one overview from identify at ~10–15 s to today, calling out each area that
  could have eaten weeks.
- **Context before the jitter (Gerald, 11:1x):** the jitter was the FIRST SIGN WE WERE ONTO
  SOMETHING. Identify had become fast enough to flap. Then experiments took it to today's clean state.
- **Hours (Q6, testimony):** ~30 minutes a day, spread across the day, to set agents up to run
  experiments overnight. All Claude work within a Claude Max subscription (D13).

## Spine: situation → complication → resolution; Gerald's arc inside it

| # | Beat | Min | Point | Story / evidence | Visual (skill) |
|---|---|---|---|---|---|
| 1 | Title | 0.5 | — | — | — |
| 2 | **Demo 0: the scout today** | 2.0 | It works: a live card, identified, stable | demo | live; fallback clip |
| 3 | How we got here | 2.0 | ~10–15 s identify → today; 6–7 areas that could each have eaten weeks | evidence | `identify-timeline.svg` (svg-infographic) |
| 4 | The first sign | 1.5 | Identify got fast enough to jitter: the first sign we were onto something | story | `jitter-before-after.svg` (svg-infographic) |
| 5 | The fork | 1.5 | 3 areas × 3 parts × ~5 experiments = 45+ forks; the old move is push through | story + framing | `fork-tree.svg` (svg-infographic) |
| 6 | What changed | 2.5 | Instrument → replay offline → gated experiments in worktrees overnight; ~100 in two weeks; ~30 min/day of my time. **Demo 1 kicks off** | evidence + testimony | `experiment-loop.svg` (svg-infographic) |
| 7 | Jitter, resolved | 1.5 | Faster server 35.8 → 15.4; one behaviour change → 0.14 per 100 (E19, against a control) | evidence | `jitter-drops.svg` (svg-linyaosky step) |
| 8 | Methods map | 1.5 | Problem type → method → where you'll see it next | framing | `methods-map.svg` (svg-infographic matrix) |
| 9 | Orchestration | 2.0 | Coordinator, lanes, gates, reviewer one tier up, commit early | evidence (this repo) | `e-lane-dag.svg` |
| 10 | Method: kill lines | 1.5 | Pre-register the kill; the negative result was the win | evidence | `d4-arms.svg` |
| 11 | Method: measure the bar | 1.5 | Top-1 → top-3 halves the gain; the real bar is top-3 on non-locked lots, 65.2 % (n=69) | evidence | `d4-slope.svg` + `lot-bar.svg` |
| 12 | Method: stop things | 1.0 | What the gates let us NOT build | evidence | text list |
| 13 | Method: hardest shared core first | 1.5 | One identify core for both apps; LLM removed | evidence + reason (D11) | `shared-core.svg` (svg-infographic) |
| 14 | Method: personas as done gate | 2.0 | Panel DONE/NOT, and where it failed (real device) | evidence + story at the failure | brief/verdict on slide + phone crops |
| 15 | Method: agents first, human verdict | 1.5 | 180 s → 31–46 s; two levers | evidence + testimony | `f-two-levers.svg` |
| 16 | Method: persona drafts, **Demo 1 reveal** | 4.5 | Four drafts → a hybrid (tl;dr + drill-down) | demo + method | `hybrid-layers.svg` (svg-infographic) |
| 17 | Demo 2: overnight, replayed | 2.0 | This repo's own lanes, reviews and merges as choreography | demo | fallback: `e-lane-dag.svg` |
| 18 | Against paralysis | 2.0 | Decide-by rules | framing | text |
| 19 | Two things next week | 1.5 | Persona-draft your next doc; run your next fork as two gated lanes. Repo + starter/ | action | text |
| B | Backup | — | Cost, hours, hold-out, four yardsticks | Q&A | `top3-measures.svg` |

Total 34.5 + 0.5 buffer. Three live moments (Demo 0, 1, 2): see risks.

## "Areas that could have eaten weeks" (slide 3), each with a source for the visuals lane
1. Identify latency: LLM vision ~10 s median (bakeoff 08-18: 5/6 at 10.4 s; 6–15 s live) → embedding ~130 ms / SigLIP pick 08-20. [B-pivots; `3f5eabd7e`, `423e2e894`]
2. Jitter / thrash: 09-02 complaint → 09-05 E19 (35.8 → 0.14 per 100). [D14]
3. Accuracy and languages: index composition, E65–E67, 09-08/09 (dedup killed; head shipped). [D4; E67]
4. Crop policy: the 5-crop vote vs one padded crop, E79b 09-09 (31 vs 26 of 41). [D12]
5. Labeling throughput: 09-06 → 09-14 (agents first pass; UI redesign). [arc F; D7]
6. Knowing when the UI is done: persona panel 09-13/14. [arc C]
7. Measuring the right bar: top-3 per lot, 09-11 → 87 lots. [lot-top3-unlocked]

## Risks for Gerald
- Three live moments in 35 minutes. Demo 0 needs the devbox stack reachable from the venue, a live
  or replayed stream, and the extension with single-crop on: the most fragile. Fallback: a
  recorded clip. Demo 2 is the first to cut if time runs short.
- "~10–15 s": Gerald recalls 11–15 s; the record shows 6–15 s live and a 10.4 s bakeoff median. The
  slide will show the sourced range.

## v3 changes (Gerald, 2026-09-24 11:1x) supersede the table above where they differ
Order: 1 Title · 2 **The scout today: a screenshot** (`assets/shots/scout-gengar-today.jpg`, usernames
pixelated) · 3 How we got here · 4 The first sign · 5 The fork · 6 What changed · 7 Jitter, resolved ·
8 **Demo: the card scout, live** (single-crop build; moved here from slide 2) · 9 Methods map ·
10 Orchestration · 11 **Gates and flags that let experiments run unattended** (new focus; sourced from
`mining/findings/gates-and-flags.md`) · 12 Kill lines in action (d4-arms) · 13 Measure the bar ·
14 Stop things · 15 Hardest shared core first · 16 **Persona review gates** for UI/UX/design (kept) ·
17 Agents first, human verdict · 18 Demo 2 (repo record; kept unless Gerald cuts it) · 19 Two things.
CUT: persona drafts + Demo 1 (the fan-out), and "against paralysis". The two things become:
(1) run your next fork as gated experiments that can run unattended; (2) put a persona review gate
in front of "done" for UI/design work. `hybrid-layers.svg` is no longer needed.
