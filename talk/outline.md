# Outline v4: "How to scale yourself and do all the things"

Lane `fix/F2-deck` · Opus 5.5 · 2026-09-24 11:48 PDT. v3 (lane `story/S1-deck-v2`: structure v2,
D16, with D17's order and cuts, and D18's crop vote) revised against critique round 2
(`talk/plan/critique2.md`, F2). Old slide 13 splits into 13 and 14, so every later slide moves up
by one. Speaker notes with citations live in `talk/notes.md`; this file carries the argument only.

**Format.** 35 min live + 10 min Q&A, 19 slides + 2 backup. Audience: software engineers, product
managers, product designers (D10).

**The talk in one sentence.** When a hard fork lands mid-project, you don't have to push through on
the fix you know: instrument it, replay it, and let gated experiments run unattended while you work,
picking the method that fits the kind of problem, with a human verdict at the gates that matter.

**Shape.** Situation → complication → resolution, with Gerald as protagonist and narrator (story
plan §a). Situation: the scout works today (2), and here's the trip (3). Complication: the first
sign we were onto something was a jitter (4), and it forked 45 ways (5). Resolution: what changed,
and what it cost (6), the jitter resolved early (7), the working thing live (8), then the methods,
one per kind of problem (9–18), and two things to do (19). Visual grammar (story plan §d): STORY
beats (4, 5, and the testimony lines on 6, 18, 19) use a quotation treatment, a grey rule, and carry
no numbers as data; EVIDENCE beats carry a visual and a source footer. Colour: one meaning per hue
(blue = before, orange = after, green = method/gate, grey = context and testimony).

## Slide map

### Part 1 · Where it ended up, and how (3.5 min, slides 1–3)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 1 | 0.5 | How to scale yourself and do all the things | The promise, with the repo URL: orchestration, gates and experiments, and which fits which problem. |
| 2 | 1.0 | The scout today | Open on the working thing: a card on a live stream, identified (screenshot; "it holds" is left for the live demo). |
| 3 | 2.0 | How we got here | One timeline in one unit, identify latency as the client sees it: 6–15 s live (10.4 s median of 6 bakeoff captures, 08-18) → 375 ms p50 by 09-11 (EXP-E88), with seven areas that could each have eaten weeks. |

*Transition:* "It didn't look like this in September. Here's the first sign we were onto something."

### Part 2 · The complication (3.0 min, slides 4–5)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 4 | 1.5 | The first sign | Story: identify had got fast enough to flap. Unusable on screen, promising underneath. |
| 5 | 1.5 | The fork | Story: 3 areas × 3 parts × ~5 experiments (testimony); the default is to pick the fix you know and push. |

*Transition:* "So what changed, so I didn't have to pick one?"

### Part 3 · The resolution, shown (8.5 min, slides 6–8)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 6 | 2.0 | What changed | Worktree, gate and flag in plain words; instrument → replay offline → gated experiments in worktrees overnight. The cost on stage: ~30 min a day of my time (my estimate) · a flat Claude Max subscription · ~100 experiments in two weeks · the jitter fixed in 3 days (D13, D14, D16). |
| 7 | 1.5 | Jitter, resolved | Evidence: E19 against a control, 35.8 → 15.4 → 0.14 per 100, in 3 days. Both levers get credit: a faster server, then cancel-but-keep. |
| 8 | 5.0 | Demo: the card scout, live | The dev-box build on a live stream, crop vote on: it lands and holds. Said in plain words: a little margin around each box, and keep the vote (D18). Fallback: the recorded clip. |

*Transition:* "The jitter was one fork. They didn't all want the same tool. Here's the map."

### Part 4 · The methods, one per kind of problem (18.0 min, slides 9–18)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 9 | 1.5 | Which method fits which problem | The table of contents: 8 rows in slide order, problem → method → slide 10…18. |
| 10 | 2.0 | Method: orchestration | The coordinator (my strongest model: briefs and judging, never building) defined once; a lane is a new worktree + branch + one session with a brief; gate written first; reviewer one tier up; commit early. This repo's own lanes on screen. |
| 11 | 4.0 | Method: gates and flags (focus) | What let experiments run while I slept: a window with an end time, then the six numbered boxes (kill bar; flag dev on / prod off; per-run caps, the example from the labeling agents; guard rails + idle-tab watchdog; judged offline on frozen data; gate passes → merge → next unlocks), the morning prod flip, and one honest failure (an idle tab burned a day's allowance). [gates-and-flags] |
| 12 | 1.5 | Method: kill lines in action | Pre-register the kill: de-duplication hit it. The language-head arm was added AFTER the kill, on the same 201 test crops: a lead, not proof, so it went out behind a flag and prod flipped after a replay. |
| 13 | 1.0 | Method: measure the bar · top-3 | Full-width slope: the same win halves at top-3 (+9.95 → +5.47 points). |
| 14 | 1.5 | Method: measure the bar · live lots | Full-width tiles, plain words on screen (auto-lock; top-3 when it doesn't): locks 18/87, right on 16/18, top-3 on 45/69 non-locked = 65.2 %. One tapper, mostly English. Not done, but measurable. |
| 15 | 1.0 | Method: stop things | Four clean no's the gates bought: an encoder swap, a fine-tune and a smaller model, a re-embed, paid art. Source footer: the ledger. |
| 16 | 1.5 | Method: hardest shared core first | One identify core for bulk scan and the scout; the LLM came out of both (D11). |
| 17 | 2.5 | Method: persona review gates | `persona-gate.svg`: Dez's brief → panel DONE, 30 s → 9 s → "pretty much unusable" on my own iPhone next morning → a real-device check before DONE (the rule I draw from it; the record's fix was another panel pass). |
| 18 | 1.5 | Method: agents first, human verdict | Labeling: 180 s by hand → ~31–46 s with an agent first pass plus my review. Two levers; agents alone would overclaim. |

*Transition:* "So if you only take two things from this..."

### Part 5 · Close (1.5 min, slide 19)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 19 | 1.5 | Two things for next week | (1) Run your next fork as gated experiments that can run unattended. First step + `starter/two-lanes/`, `starter/two-lanes/unattended.md`. (2) Put a persona review gate in front of "done" for UI and design work. First step + `starter/persona-gate/`. One sentence for your boss, labelled as Gerald's framing. Repo URL. |

### Backup (not in the timed total)

| # | Title | The argument it carries |
|---|---|---|
| B1 | Cost, hours, hold-out | All Claude work within a Claude Max subscription; the only metered spend ~$9 for 760 labeling tasks on another provider [D13]. ~30 min a day, my estimate [D16]. Held out: the language head never saw a test photo [D14]. |
| B2 | Four yardsticks | Top-3 measured four incompatible ways; why slide 14 picks one bar. |

## Timing (shown)

| Part | Slides | Minutes | Running |
|---|---|---:|---:|
| 1 · Where it ended up | 1–3 | 0.5 + 1.0 + 2.0 = 3.5 | 3.5 |
| 2 · The complication | 4–5 | 1.5 + 1.5 = 3.0 | 6.5 |
| 3 · The resolution, shown | 6–8 | 2.0 + 1.5 + 5.0 = 8.5 | 15.0 |
| 4 · The methods | 9–18 | 1.5 + 2.0 + 4.0 + 1.5 + 1.0 + 1.5 + 1.0 + 1.5 + 2.5 + 1.5 = 18.0 | 33.0 |
| 5 · Close | 19 | 1.5 | 34.5 |
| **Total** | **19** | **34.5** | |
| Buffer | | 0.5 | |
| **Live slot** | | **35.0** | |

The split of old slide 13 (2.0 min) into 13 (1.0) + 14 (1.5) costs 0.5 min; the methods map gives
it back (2.0 → 1.5), since it is now a plain table of contents. Live time inside the total: slide 8,
5.0 min (the one live moment).

## What changed from v3 (critique round 2, F2), and why

1. **13 split into 13 + 14**, each with one full-width chart (`d4-slope.svg`, `lot-bar.svg`); the
   side-by-side layout is gone. Slide 14 defines auto-lock and top-3 in plain words; no "CI" on the
   deck's text (designer, pm, mid-swe).
2. **Slide 6 carries the cost on stage** and defines worktree, gate and flag (pm fix 1, mid-swe).
3. **Slide 3's units** are said out loud: both ends are identify latency as the client sees it; the
   10.4 s is n = 6 (senior fix 1).
4. **Slide 12 says the shipped arm came after the kill, on the same split** (senior fix 2, arc A).
5. **Slide 11's notes follow the six numbered boxes**; the caps are the labeling agents' (senior
   fix 3, designer, mid-swe).
6. **"Fable" is said once, as the coordinator**, on slide 10, with how a lane starts (mid-swe fix 3).
7. **Slide 8's notes** drop "crops vote", "pad 17 px" and "E79" for plain words (pm).
8. **Slide 19** gives each action a first step and its starter path, plus the boss sentence (pm
   fixes 1–2, mid-swe fix 1).
9. **Slide 17** uses `persona-gate.svg` (F1) instead of two unreadable phone captures (designer fix 1).
10. **Testimony rule is grey**, not orange, so orange keeps one meaning (designer, colour).

## Open items (notes-only; nothing on a slide)

- **F1 visuals** land on their own branch under the filenames in `critique2.md`; until then
  `assets/diagrams/persona-gate.svg` is missing on this branch and slide 17 renders without its
  diagram. `experiment-loop.svg` still has its own "~30 min" bar; slide 6 crops it off (top 350 px)
  so the cost line isn't said twice. F1 could drop that bar and the crop can go.
- **F3 starter paths** (`starter/persona-gate/`, `starter/two-lanes/unattended.md`) are referenced on
  slide 19 before they exist on this branch.
- `persona-gate.svg`'s last step, "a real-device check before DONE", is Gerald's rule drawn from the
  failure; the record's recorded fix was another panel pass (arc C). The notes say so.
