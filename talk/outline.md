# Outline v2: "How to scale yourself and do all the things"

Lane `revise/R2-deck` · Sonnet · 2026-09-24. Replaces v1 per `talk/plan/critique.md` (the
converged four-persona critique). Speaker notes with citations live in `talk/notes.md`; this file
carries the argument only.

**Format.** 35 min live + 10 min Q&A, 21 slides + 1 backup. Audience: Software Engineers, Product
Managers, Product Designers (D10).

**The talk in one sentence.** When a hard fork lands mid-project, the step back is now cheaper
than the push through: give agents the right context, autonomy and guardrails, let them explore
the forks while you keep working, and spend your own time deciding on evidence.

## What changed from v1

1. **Slide 2's maths fixed on screen:** "3 areas × 3 parts × ~5 experiments = 45+ forks", not a
   number that reads as 15. The jitter's ending is not resolved on screen — it waits on
   `verify/jitter-ending` and is marked pending in the notes only.
2. **Slide 4 carries the D13-approved wording exactly:** "~100 experiments in two weeks, many
   gated and run overnight."
3. **The four repeated act charts (old 5–8) collapse into one slide (new 5)**, freeing about
   1.0 min and removing three duplicate charts.
4. **Old slide 11 ("what we didn't try") splits in two:** a plain-text stopped-work list (new 8,
   no chart) and a dedicated four-yardsticks chart slide (new 9), with the notes' numbers made to
   match the chart exactly.
5. **The persona-panel method is now shown, not just narrated (new 11):** a 3-line brief excerpt,
   a DONE/verdict row, and the literal-ask → job example, replacing an illegible screenshot row.
6. **Old slide 16's dangling placeholder is gone.** New slide 14 states Gerald's actual hybrid
   rule as content, not a promise to fill in later.
7. **New slide 16 (the coordinator) defines lane / worktree / gate / reviewer-one-tier-up on the
   slide itself**, names this repo's own lanes, and footnotes "Fable" under "coordinator".
8. **Old slide 20 splits into two (new 18, 19):** "remembered vs recorded" (three corrections)
   and "…and the record over-read" (three counter-examples), each with its own chart.
9. **New slide 21 closes on exactly two imperative actions**, plus the repo URL and the starter
   kit path, replacing three bullets (two of them questions).
10. **A backup slide (cost + hold-out)** replaces the scattered dollar figures with a single D13
    line and marks the E67/E65a hold-out check as pending `verify/holdout`, notes-only.
11. **Charts are redrawn (R1 lane) for a 1136×440 box**, no in-chart title/caption/source; every
    chart slide carries its own title on the slide and a small source footer.

## Slide map (sum 34.5 min + 0.5 min buffer = 35.0)

### Part 1 · The moment (3.5 min, slides 1–3)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 1 | 0.5 | How to scale yourself and do all the things | The promise, with the repo URL on screen: you can explore every fork without stopping the job you're doing. |
| 2 | 1.5 | The jitter | A real fork: the scout's detect→identify loop worked underneath and was unusable on screen; 3 areas × 3 parts × ~5 experiments = 45+ candidate forks for one bug. |
| 3 | 1.5 | Why we push through | Scope, staffing and timeline make "pick the one fix you know and push" the default, and the scout was close to being parked. |

*Transition:* "That was the old math. Here's what changed it."

### Part 2 · What changed (2.0 min, slide 4)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 4 | 2.0 | Exploring got cheap | The unlock was instrumenting the key transitions and replaying them offline: ~100 experiments in two weeks, many gated and run overnight; to prove the point, four writers start on my abstract now (**Demo 1 kickoff**). |

*Transition:* "Here's where the scout came from, and the bigger forks that led there."

### Part 3 · Arc B, four acts, one slide (3.0 min, slide 5)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 5 | 3.0 | Four acts, each with a reason | Pregrade (baseline), the scout (bakeoff to image-to-image), one shared identify core for two apps, then comps once raw multi-condition pricing outgrew "use an API" (D9, D11). |

*Transition:* "Every act started with a reason and a number. Here's what the numbers looked like
inside one of them."

### Part 4 · Arc A, experiments as decision tools (5.5 min, slides 6–10)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 6 | 1.5 | The negative result was the win | A pre-registered kill line turned my favourite idea (de-duplicate the index) into a no, and scoring past it found the small change that shipped. |
| 7 | 1.0 | At top-3 the gain halves | The same win measured in the product's own units is half the size, because the metric you pick is itself a decision. |
| 8 | 1.0 | What the gates let us stop | Four things a gate turned into a clean no: an encoder swap, a fine-tune and a distilled student, a re-embed that never started, and paid art with zero lift. |
| 9 | 1.0 | Four yardsticks, not one line | Top-3 measured four incompatible ways (served, offline, six-crop consensus, live lots) — you can't draw one trend line across them. |
| 10 | 1.0 | The bar, measured | On live lots the scout didn't auto-lock, the right card was in the top 3 about two times in three, at n=87, the most the record allows. |

*Transition:* "Experiments decide technical forks. For design, the gate is people. Or personas."

### Part 5 · Arcs C and D, personas (8.0 min, slides 11–14)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 11 | 2.0 | The panel is the done gate | Persona and critic briefs that re-walk the built screens and return DONE or NOT, shown on the slide: a brief excerpt, a verdict row, and one literal-ask → job translation. |
| 12 | 1.0 | The gate fails | The panel said DONE on the phone, and my own iPhone the next morning said "pretty much unusable" — three named failures the panel never saw. |
| 13 | 4.0 | Four drafts of my abstract (**Demo 1 reveal**) | The four writers I started at minute 4 are done; I pick a hybrid aloud in two minutes. |
| 14 | 1.0 | The hybrid rule | Gerald's actual rule, not a placeholder: a tl;dr frame on top, drill-down beneath for whoever needs detail. |

*Transition:* "Personas review and write. Agents can also do the work itself."

### Part 6 · Arcs F and E, agents doing the work (6.5 min, slides 15–17)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 15 | 2.0 | Two levers, not one | Labeling fell from 180 s by hand to ~31–46 s with agents plus review — two levers, not one, and crediting agents alone would overclaim. |
| 16 | 1.5 | The coordinator pattern | Lane, worktree, gate, reviewer-one-tier-up, defined on the slide: this repo's own lanes are how the overnight experiments ran without me. |
| 17 | 3.0 | The repo's own record (**Demo 2**) | The repo you can clone shows the pattern: lanes fanning out, two corrections where the record was over-read, and tiered review merges. |

*Transition:* "That log also caught me misremembering. And it caught the log being over-read."

### Part 7 · Spine and close (6.0 min, slides 18–21)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 18 | 1.25 | Remembered vs recorded | Three times the record corrected my memory: the de-duplication story, the top-3 bar's date, and the small-sample 76.9 % high. |
| 19 | 1.25 | …and the record over-read | Three times it went the other way: overlapping dates read as concurrent, testimony read as unsourced, a partial replay read as undoing a real win. |
| 20 | 2.0 | Against paralysis | Cheap exploration only helps if you decide: an evidence threshold, a time box and budget, "go both" when reversible, and a log of paths not taken (four habits, four bullets). |
| 21 | 1.5 | Two things for next week | Exactly two actions: persona-draft your next doc, and run your next fork as two gated lanes — plus the repo URL and the starter kit. |

### Backup (not in the timed total)

| # | Title | The argument it carries |
|---|---|---|
| — | Cost, and the open question | All Claude work ran inside a Claude Max subscription; the only metered spend was the labeling pilots (~$9/760 tasks) [D13]. The E67/E65a hold-out check is pending `verify/holdout`, notes-only. |

## Timing

| Part | Slides | Min |
|---|---|---:|
| 1 · The moment | 1–3 | 3.5 |
| 2 · What changed | 4 | 2.0 |
| 3 · Arc B, one slide | 5 | 3.0 |
| 4 · Arc A | 6–10 | 5.5 |
| 5 · Arcs C + D | 11–14 | 8.0 |
| 6 · Arcs F + E | 15–17 | 6.5 |
| 7 · Spine + close | 18–21 | 6.0 |
| **Total** | **21** | **34.5** |
| Buffer | | 0.5 |
| **Live slot** | | **35.0** |

Demo time inside the total: 0.5 (slide 4 kickoff) + 4.0 (slide 13) + 3.0 (slide 17) = 7.5 min.

## Open ⚠ items

- **Slide 2's ending** waits on lane `verify/jitter-ending`; marked `<!-- ending: pending
  verify/jitter-ending -->` in the notes only, never on screen.
- **The backup slide's hold-out line** waits on lane `verify/holdout`; shown as
  `⟨pending verify/holdout⟩` in the notes only.
- **R1's charts** (`assets/charts/{b-four-acts,d4-arms,d4-top3,top3-measures,lot-bar,
  f-two-levers,e-lane-dag,rvr-memory,rvr-counter}.svg`) are referenced by filename throughout;
  they may not exist yet on this branch. `remembered-vs-recorded.svg` is retired in favour of the
  split `rvr-memory.svg` / `rvr-counter.svg`.
- **Slides 2 and 4:** the abstract's checkable claims are sourced in `talk/notes.md`,
  "Abstract claims: provenance". Two questions for Gerald are listed there; the story is not
  changed.
