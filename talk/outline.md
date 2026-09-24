# Outline v5: "How to scale yourself"

Lane `story/deck-v4` · Opus 5.5 · 2026-09-24 12:1x PDT. A proposal on `talk/plan/structure-v4.md`
(audience-first; the coordinator merges only after I approve). v4 (lane `fix/F2-deck`) is
rebuilt around the audience's questions: engineers, PMs and product designers asking "what do I do in
MY project?". Speaker notes with citations live in `talk/notes.md` (generated from the deck's
notes); this file carries the argument only.

**Format.** 35 min live + 10 min Q&A, 18 slides + 3 backup. Audience: software engineers, product
managers, product designers (D10).

**The talk in one sentence.** When a hard problem lands mid-project, there are four problems you'll
hit (too many forks for one of you; is my favourite idea better; is it done; where to start), and a
method for each, shown with the card scout as evidence and one step to try next week.

**Shape.** Situation → complication → resolution for Part 1, told from the audience's seat first
(slide 2: their moment, no card scout) and then as my version (3–7). Part 2 is not an arc: four
problems, each a short run of method slides in one fixed pattern. Part 3 hands it back: a cheat sheet
and two actions.

**The method-slide pattern (9–16).** A small green header names the problem (A–D). The title is the
audience's question, in their words. One line, with a green rule, gives the method in plain words.
The card scout is the evidence: one visual or one number, labelled in plain words. Codes (E67, G0h…)
live only in the source footer and the notes. The notes run in three moves: "you'll see this
when…", what I did and what the evidence says (cited), and "try it" (pointing into `starter/`).

**Visual grammar.** STORY beats (2, 4, and the testimony lines on 5 and 18) use a grey rule and carry
no numbers as data; EVIDENCE beats carry a visual and a source footer. Colour: one meaning per hue
(blue = before, orange = after/shipped, green = method/gate, grey = context and testimony).

## Slide map

### Part 1 · A moment you'll recognise (13.0 min, slides 1–7)

| # | Min | Title (as the audience reads it) | The argument it carries |
|---|---|---|---|
| 1 | 0.5 | How to scale yourself: methods for when a hard problem lands mid-project | The promise, with the repo URL. |
| 2 | 1.5 | You've been here | Their moment, no card scout: a hard problem lands mid-project; five fixes, one week, one of you; the default is to pick one and push. Situation, not data. |
| 3 | 1.0 | My version: the card scout | The screenshot; one line on what it does. In August naming a card took 6–15 s. |
| 4 | 1.5 | It almost worked, and I could see 45+ ways to fix it | Story: it got fast enough to flap (09-02); 3 areas × 3 parts × ~5 experiments, my estimate (P5). `fork-tree.svg`. |
| 5 | 2.0 | What changed: trying an idea got cheap | Worktree, gate, flag defined; the loop (record → replay offline → gated experiments in worktrees, overnight). Cost on stage: ~30 min a day (my estimate), a flat Claude Max subscription, ~100 experiments in two weeks, the flapping fixed in 3 days (D13, D14, D16). |
| 6 | 1.5 | Did it work? The flapping was gone in 3 days | E19 against a control: 35.8 → 15.4 → 0.14 per 100. Both levers get credit. |
| 7 | 5.0 | Demo · the card scout, live | The dev-box build, vote on (D18): it lands and holds. Fallback: the recorded clip, said as recorded. |

*Transition:* "That's where it ended up. Now the part that's about your projects."

### Part 2 · Four methods for four problems (16.0 min, slides 8–16)

| # | Min | Title (as the audience reads it) | Method (one line) | Evidence on screen |
|---|---|---|---|---|
| 8 | 1.0 | Four problems you'll hit, four methods | The map: A–D, problem → method. | `four-problems.svg` (to be drawn) |
| **A** | | **Too many forks, one of you** | | |
| 9 | 2.0 | How do I chase five fixes at once? | A lane per fix (own copy of the code, own agent, own gate); a smaller model builds, a stronger one reviews, I decide. | `e-lane-dag.svg`: this repo's lanes |
| 10 | 3.5 | Can it keep working while I sleep? (focus) | Pass/kill bar first, flag, caps per run; the gate decides the merge, I flip production. Honest failure: the idle tab. | `gates-flags.svg` |
| **B** | | **Is my favourite idea better?** | | |
| 11 | 1.5 | Is my favourite idea actually better? | Write the score that kills the idea before the run, then let it. Dedup lost 14.43 points and died; the shipped re-rank came after the kill, on the same photos: a lead, then a flag and a replay. | `d4-arms.svg` |
| 12 | 1.5 | Are we measuring what users feel? | Score what the user sees: the win halves (+9.95 first guess → +5.47 right card among the 3 shown). Live: about 2 in 3 (45/69 non-locked lots, one tapper). | `d4-slope.svg` + one line |
| 13 | 1.0 | What should we stop working on? | Give every expensive idea a bar before it starts; a clean no is a result. Four stops from the ledger. | text list |
| **C** | | **Is it actually done?** | | |
| 14 | 2.5 | The tests pass. Is it actually done? | A persona panel in front of "done", then a real device. The panel said DONE; my iPhone said unusable. | `persona-gate.svg` (F1 lane) |
| 15 | 1.5 | Too many judgment calls to do by hand? | Agents take the first pass, a person gives the verdict: labeling 180 s (my stopwatch) → 31–46 s. Two levers. | `f-two-levers.svg` |
| **D** | | **Where do we even start?** | | |
| 16 | 1.5 | Which piece do I build first? | Solve the hardest shared piece once, first: naming the card, for two apps (D11). | `shared-core.svg` |

*Transition:* "Here's all of that on one slide."

### Part 3 · Close (3.5 min, slides 17–18)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 17 | 2.0 | If you see this in your project → try this | Cheat sheet, text only, 4 rows A–D: what you'll see → what to try → where to start in `starter/`. |
| 18 | 1.5 | Two things for next week | (1) Gated experiments that can run unattended, first step + `starter/two-lanes/`, `unattended.md`. (2) A persona review gate in front of "done", first step + `starter/persona-gate/`. The boss sentence, labelled as my framing. Repo URL. |

### Backup (not in the timed total)

| # | Title | The argument it carries |
|---|---|---|
| B1 | Cost, hours, hold-out | Claude Max; ~$9 metered on another provider [D13]; ~30 min a day, my estimate [D16]; the re-rank never saw a test photo [D14]. |
| B2 | How we got here | The old timeline, simplified on the slide to its start and end: 6–15 s in August → under half a second (375 ms p50, E88) by 09-11. The seven areas stay in the notes. |
| B3 | Four yardsticks | Top-3 measured four incompatible ways; why slide 12 picks one bar. Lock rate and precision (18/87, 16/18) moved here from the old slide 14. |

## Timing (shown)

| Part | Slides | Minutes | Running |
|---|---|---:|---:|
| 1 · A moment you'll recognise | 1–7 | 0.5 + 1.5 + 1.0 + 1.5 + 2.0 + 1.5 + 5.0 = 13.0 | 13.0 |
| 2 · Four methods for four problems | 8–16 | 1.0 + 2.0 + 3.5 + 1.5 + 1.5 + 1.0 + 2.5 + 1.5 + 1.5 = 16.0 | 29.0 |
| 3 · Close | 17–18 | 2.0 + 1.5 = 3.5 | 32.5 |
| **Total** | **18** | **32.5** | |
| Buffer | | 2.5 | |
| **Live slot** | | **35.0** | |

The minutes are structure-v4's targets. The 2.5 min buffer covers a slow demo (slide 7 is the one
live moment) and the pauses on slides 2 and 10.

## What changed from v4, and why (structure-v4 diagnosis)

1. **Titles are the audience's questions** (9–16), with the method in one line under them. v4's
   titles answered "what happened in card scout".
2. **No internal labels in the slide text.** G0/G3/G0h, print@1, auto-lock, lock precision, E-numbers,
   cohort and frozen split are gone from titles and lines; codes live in footers and notes. Several
   visuals still carry them (see open items).
3. **Every method has a bridge back**: the notes open with "you'll see this when…" and close with
   "try it".
4. **Nine methods in a row became four problems** (A–D), with a header on each method slide and a map
   (8) and cheat sheet (17) that use the same letters.
5. **The opening starts on their moment** (2) before card scout; the timeline moved to backup B2;
   old slides 4 + 5 merged into 4; old 13 + 14 merged into 12 (lot tiles to backup).
6. **Kept:** the live demo with the vote on (D18), its stage notes and fallback; the cost line (5);
   testimony labelled as testimony; the story vs evidence grammar.

## Open items (notes-only; nothing on a slide)

- **Missing visuals, referenced anyway:** `assets/diagrams/four-problems.svg` (8, new) and
  `assets/diagrams/persona-gate.svg` (14, F1). Both slides render without their picture until the
  visuals lane lands them.
- **Internal labels still baked into visuals** (for the visuals lane to relabel): `d4-arms` (G0/G3/G0h,
  "pre-registered kill line: G0 − 2.0 pts", n/201; the kill-line label overlaps the first bar);
  `d4-slope` (G0/G0h legend, "top-1"/"top-3"); `e-lane-dag` (model names, "mine:", "main", clipped
  "Opus 5.5"); `gates-flags` ("E67's fired", "E84: …", the third-person "…'s word" chip, "frozen data");
  `f-two-levers` ("E84", and testimony labels in the third person: they should read "my stopwatch", "my estimate"); `jitter-drops` (BASE/CTRL/F5, p50);
  `experiment-loop` ("key transitions"); `fork-tree` and `shared-core` ("embedding", "identify core",
  "LLM"); `identify-timeline` (B2: E88, E67, E79b, p50).
- **"A small language filter"** (structure-v4's suggested label for G0h) is not quite right: the head
  is a soft re-rank by language, not a filter (arc A). The slides and notes say "re-rank".
