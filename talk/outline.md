# Outline v1: "How to scale yourself and do all the things"

Lane L5 (`build/outline`) · Opus 5.5 · 2026-09-24 09:5x PDT. Replaces v0. Built from
`talk/plan/presentation-plan.md` §2 and §8, D4–D10, `talk/abstract-rough.md`, the five arc files
and the four findings files. Speaker notes with citations live in `talk/notes.md`; this file
carries the argument only. ⚠ marks a line that waits on Gerald.

**Format.** 35 min live + 10 min Q&A, 22 slides. Audience: Software Engineers, Product Managers,
Product Designers (D10).

**The talk in one sentence.** When a hard fork lands mid-project, the step back is now cheaper
than the push through: give agents the right context, autonomy and guardrails, let them explore
the forks while you keep working, and spend your own time deciding on evidence.

## Changes from the §2 slide map

1. **Slide 2** opens on the scout's jittery detect→identify boundary from the abstract (D10), not
   the Japanese-index call or "when to run identify".
2. **Slide 4** carries the abstract's unlock (instrument the key transitions, replay offline, run
   about 100 hypothesis-gated experiments in worktrees overnight) before the Demo 1 kickoff. The
   unlock is called back on slides 9 and 11 (arc A) and 18 (arc E).
3. **Slide 22** closes on the abstract's two takeaways. Persona drafts and a coordinator with lanes
   become the "how to start" line under them, not the takeaways themselves.
4. **Slides 5 and 7** use the #3 timeline beat alone. The later-September screenshots named in §2
   are anachronistic for those acts (§8 rule 1). Slide 13's 09-12 audit pair is period-correct.
5. **Demo 1's fallback** is Gerald's ~2-minute video (D10). The labelled-rehearsal fallback is gone.
6. **Slides 7 and 8** are settled by the founder (D11): act 3 is "solve the hardest shared core
   once, then build both apps around it", not "ported from the scout"; act 4 starts 2026-09-06.
   The §2 ⚠ marks on both are closed.

## Slide map (sum 34.0 min + 1.0 min buffer = 35.0)

### Part 1 · The moment (3.5 min, slides 1–3)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 1 | 0.5 | How to scale yourself and do all the things | The promise: you can explore every fork without stopping the job you're doing. |
| 2 | 1.5 | The jitter | A real fork: the scout's detect→identify loop worked underneath and was unusable on screen, and the fixes fanned out across three layers into dozens of candidate experiments. |
| 3 | 1.5 | Why we push through | Scope, staffing and timeline make "pick the one fix you know and push" the default, and the scout was close to being parked. |

*Transition:* "That was the old math. Here's what changed it."

### Part 2 · What changed (2.0 min, slide 4)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 4 | 2.0 | Exploring got cheap | The unlock was instrumenting the key transitions and replaying them offline, so about 100 hypothesis-gated experiments could run in isolated worktrees on the same data while I slept; to prove the point, four writers start on my abstract now (**Demo 1 kickoff**). |

*Transition:* "Here's where the scout came from, and the bigger forks that led there."

### Part 3 · Arc B, four acts (4.0 min, slides 5–8)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 5 | 1.0 | Act 1: a baseline on purpose | Pregrade's LLM-vision identify was a deliberate proof of concept and baseline, not a false start. |
| 6 | 1.0 | Act 2: the scout | Live auctions broke a 6–15 s identify, and a one-night bakeoff against that baseline moved identify to image-to-image. |
| 7 | 1.0 | Act 3: one core, two apps | Identify was the hardest part and both bulk scan and the scout needed it fast and accurate, so I solved it once as a shared core and built both apps around it (D11). |
| 8 | 1.0 | Act 4: comps | From 09-06, pricing became its own act because the problem changed shape: raw comps at every condition outgrew "use an API" (D11). |

*Transition:* "Every act started with a reason and a number. Here's what the numbers looked like
inside one of them."

### Part 4 · Arc A, experiments as decision tools (5.0 min, slides 9–12)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 9 | 1.5 | The negative result was the win | A pre-registered kill line turned my favourite idea (dedup the index) into a no, and scoring past it found the small change that shipped. |
| 10 | 1.0 | At top-3 the gain halves | The same win measured in the product's own units is half the size, because the metric you pick is itself a decision. |
| 11 | 1.5 | What we didn't do, and a yardstick measured four ways | The list of things we stopped or never started is the payoff of gated experiments; four incompatible top-3 numbers show why you never draw one trend line across them. |
| 12 | 1.0 | The bar, measured | On live lots the scout didn't auto-lock, the right card was in the top 3 about two times in three, at n=87, which is the most the record allows. |

*Transition:* "Experiments decide technical forks. For design, the gate is people. Or personas."

### Part 5 · Arcs C and D, personas (7.0 min, slides 13–16)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 13 | 1.5 | The panel is the done gate | Persona and critic briefs that re-walk the built screens and return DONE or NOT replace "does the founder like it". |
| 14 | 1.0 | The gate fails | The panel said DONE on the phone, and my own iPhone the next morning said "pretty much unusable": synthetic walks are necessary, not sufficient. |
| 15 | 4.0 | Four drafts of my abstract (**Demo 1 reveal**) | The four writers I started at minute 4 are done; I pick a hybrid aloud in two minutes by my own rule: a tl;dr frame plus drill-down levels. |
| 16 | 0.5 | What I took from each | Hours of rewriting become minutes of choosing. |

*Transition:* "Personas review and write. Agents can also do the work itself."

### Part 6 · Arcs F and E, agents doing the work (6.5 min, slides 17–19)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 17 | 2.0 | Two levers, not one | Labeling fell from ~3 min by hand to ~20 s of review because agents took the first pass and a redesign made review fast; crediting agents alone would overclaim. |
| 18 | 1.5 | The coordinator | One session writes specs and judges, cheaper models build, and the reviewer sits one tier above; that is how the overnight experiments ran without me. |
| 19 | 3.0 | This talk's own log (**Demo 2**) | The repo you can clone shows the pattern: lanes fanning out, two corrections where the record was over-read, and tiered review merges. |

*Transition:* "That log also caught me misremembering. And it caught the log being over-read."

### Part 7 · Spine and close (6.0 min, slides 20–22)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 20 | 2.5 | Remembered vs recorded | Four times the record corrected my memory and twice the person who was there corrected the record: keep both, and check in both directions. |
| 21 | 2.0 | Against paralysis | Cheap exploration only helps if you decide: an evidence threshold, a time box, "go both" when it's reversible, and a log of paths not taken. |
| 22 | 1.5 | Two things for next week | At your next fork, ask how you could get the answer while you work on something else, and whether validating the forks could be automated. Then try it. |

## Timing

| Part | Slides | Min |
|---|---|---:|
| 1 · The moment | 1–3 | 3.5 |
| 2 · What changed | 4 | 2.0 |
| 3 · Arc B | 5–8 | 4.0 |
| 4 · Arc A | 9–12 | 5.0 |
| 5 · Arcs C + D | 13–16 | 7.0 |
| 6 · Arcs F + E | 17–19 | 6.5 |
| 7 · Spine + close | 20–22 | 6.0 |
| **Total** | **22** | **34.0** |
| Buffer | | 1.0 |
| **Live slot** | | **35.0** |

Demo time inside the total: 0.5 (slide 4 kickoff) + 4.0 (slide 15) + 3.0 (slide 19) = 7.5 min.

## Open ⚠ items

- **None from §2.** Both arc B framings (slides 7 and 8) were settled by D11.
- **Slides 2 and 4:** the abstract's checkable claims are sourced in `talk/notes.md`,
  "Abstract claims: provenance". Two questions for Gerald are listed there; the story is not
  changed.
