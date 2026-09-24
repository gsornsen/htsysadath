# Outline v3: "How to scale yourself and do all the things"

Lane `story/S1-deck-v2` · Opus 5.5 · 2026-09-24. Built on `talk/plan/structure-v2.md` (D16) with
Gerald's later changes on top (D17, via the coordinator, 11:3x PDT): the opening is a screenshot of
the scout today and the live demo moves to slide 8; a new focus slide on gates and flags; persona
drafts, Demo 1, Demo 2 and "Against paralysis" are cut. D18: the crop vote stays; nothing claims a
single crop beat it. Speaker notes with citations live in
`talk/notes.md`; this file carries the argument only.

**Format.** 35 min live + 10 min Q&A, 18 slides + 2 backup. Audience: software engineers, product
managers, product designers (D10).

**The talk in one sentence.** When a hard fork lands mid-project, you don't have to push through on
the fix you know: instrument it, replay it, and let gated experiments run unattended while you work,
picking the method that fits the kind of problem, with a human verdict at the gates that matter.

**Shape.** Situation → complication → resolution, with Gerald as protagonist and narrator (story
plan §a). Situation: the scout works today (2), and here's the trip (3). Complication: the first
sign we were onto something was a jitter (4), and it forked 45 ways (5). Resolution: what changed
(6), the jitter resolved early (7), the working thing live (8), then the methods, one per kind of
problem (9–17), and two things to do (18). Visual grammar (story plan §d): STORY beats (4, 5, and
the testimony lines on 6, 16, 17) use a quotation treatment and carry no numbers as data; EVIDENCE
beats carry a visual and a source footer.

## Slide map

### Part 1 · Where it ended up, and how (3.5 min, slides 1–3)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 1 | 0.5 | How to scale yourself and do all the things | The promise, with the repo URL: orchestration, gates and experiments, and which fits which problem. |
| 2 | 1.0 | The scout today | Open on the working thing: a card on a live stream, identified (screenshot; "it holds" is left for the live demo). |
| 3 | 2.0 | How we got here | One timeline: identify at 6–15 s live (10.4 s bakeoff median) in August → ~375 ms round trip by 09-11, with seven areas that could each have eaten weeks. The range is the record's, not memory's. |

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
| 6 | 2.0 | What changed | Instrument → replay offline → gated experiments in worktrees overnight; ~100 in two weeks; ~30 min a day of my time (testimony, my estimate). |
| 7 | 1.5 | Jitter, resolved | Evidence: E19 against a control, 35.8 → 15.4 → 0.14 per 100. Both levers get credit: a faster server, then cancel-but-keep. |
| 8 | 5.0 | Demo: the card scout, live | The dev-box build on a live stream, crop vote on: it lands and holds. The crop policy is itself a settled fork: pad the crop ~17 px, and keep the vote (E79, D18). Fallback: the recorded clip. |

*Transition:* "The jitter was one fork. They didn't all want the same tool. Here's the map."

### Part 4 · The methods, one per kind of problem (18.0 min, slides 9–17)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 9 | 2.0 | Which method fits which problem | Problem type → method → slide: many plausible fixes / unattended runs / a favourite idea / "good enough?" / too much possible work / a shared foundation / "is the UI done?" / repetitive judgment. |
| 10 | 2.0 | Method: orchestration | Coordinator, lanes in worktrees, gates written first, reviewer one tier up, commit early; this repo's own lanes on screen. |
| 11 | 4.0 | Method: gates and flags (focus) | What let experiments run while I slept: the five-step overnight loop (a window with an end time; a queue with gates and hard rules up front; results re-groom the queue; gates judged on frozen data; mornings hold only my prod calls), four mechanisms with one real example each (kill bar, dev-on/prod-off flag, per-run caps, prod refusing unsafe config), and one honest failure (an idle tab burned a day's API allowance; the watchdog came after). [gates-and-flags] |
| 12 | 1.5 | Method: kill lines in action | Pre-register the kill: de-duplication hit it; a small language head shipped instead. The negative result was the win. |
| 13 | 2.0 | Method: measure the bar | The same win halves at top-3; the real bar is top-3 on non-locked live lots, 65.2 % (45/69, n = 87 lots). |
| 14 | 1.0 | Method: stop things | Four clean no's the gates bought: an encoder swap, a fine-tune and a student, a re-embed, paid art. |
| 15 | 1.5 | Method: hardest shared core first | One identify core for bulk scan and the scout; the LLM came out of both (D11). |
| 16 | 2.5 | Method: persona review gates | A persona panel as the done gate for UI, and where it failed: DONE on the panel, "pretty much unusable" on my own iPhone. Hands on the real device are the last gate. |
| 17 | 1.5 | Method: agents first, human verdict | Labeling: 180 s by hand → ~31–46 s with an agent first pass plus my review. Two levers; agents alone would overclaim. |

*Transition:* "So if you only take two things from this..."

### Part 5 · Close (1.5 min, slide 18)

| # | Min | Title | The argument it carries |
|---|---|---|---|
| 18 | 1.5 | Two things for next week | (1) Run your next fork as gated experiments that can run unattended. (2) Put a persona review gate in front of "done" for UI and design work. Repo + `starter/`. |

### Backup (not in the timed total)

| # | Title | The argument it carries |
|---|---|---|
| B1 | Cost, hours, hold-out | All Claude work within a Claude Max subscription; the only metered spend ~$9 for 760 labeling tasks [D13]. ~30 min a day, my estimate [D16]. Held out: the language head never saw a test photo [D14]. |
| B2 | Four yardsticks | Top-3 measured four incompatible ways; why slide 13 picks one bar. |

## Timing (shown)

| Part | Slides | Minutes | Running |
|---|---|---:|---:|
| 1 · Where it ended up | 1–3 | 0.5 + 1.0 + 2.0 = 3.5 | 3.5 |
| 2 · The complication | 4–5 | 1.5 + 1.5 = 3.0 | 6.5 |
| 3 · The resolution, shown | 6–8 | 2.0 + 1.5 + 5.0 = 8.5 | 15.0 |
| 4 · The methods | 9–17 | 2.0 + 2.0 + 4.0 + 1.5 + 2.0 + 1.0 + 1.5 + 2.5 + 1.5 = 18.0 | 33.0 |
| 5 · Close | 18 | 1.5 | 34.5 |
| **Total** | **18** | **34.5** | |
| Buffer | | 0.5 | |
| **Live slot** | | **35.0** | |

Live time inside the total: slide 8, 5.0 min (one live moment; Demo 1 and Demo 2 are cut). The
minutes freed by the cuts (persona drafts 4.5, against paralysis 2.0, Demo 2 2.0–2.5) went to the
live demo (2.0 → 5.0), the gates slide (→ 4.0), the methods map, measure-the-bar and persona gates
(+0.5 each) and the one-minute screenshot open; "What changed" gave back 0.5 with the Demo 1
kickoff gone.

## What changed from v2 (structure-v2 + D17), and why

1. **Opens on the working thing** (Q2): a screenshot at 2, the live demo at 8 once the audience
   knows what they're looking at (D17). The jitter is resolved early (7), not held as a payoff.
2. **Remembered vs recorded is cut** (Q5, D16), along with persona drafts, Demo 1, Demo 2 and
   "Against paralysis" (D17). The D-log stays in the repo.
3. **Methods are the body** (Q4): a map (9) and one slide per method, each titled "Method: …".
4. **Gates and flags get a focus slide** (11, D17), built from `mining/findings/gates-and-flags.md`
   (main `fe50602`). One line on the slide; the diagram and the notes carry it.
5. **The two things** match D17's wording exactly.
6. **Layout:** the page number moved to the top-right corner, clear of the charts' bottom-right
   axis labels; the 1136×440 image box is kept; the source footer sits below it.

## Open items (notes-only; nothing on a slide)

- `⟨from demo lane⟩`: the exact build, health check and stream for slide 8 (vote on, `cropMode: "proposals"`, D18; no hostnames in the repo).
- `⟨check against the shot⟩`: name the card and what the overlay shows (slide 2).
- **Visuals referenced before they exist on this branch:** `assets/shots/scout-gengar-today.jpg`
  (on main); `mining/findings/gates-and-flags.md` (on main, cited but not merged here);
  `assets/diagrams/{identify-timeline,jitter-before-after,fork-tree,experiment-loop,
  methods-map,gates-flags,shared-core}.svg`; `assets/charts/{jitter-drops,d4-slope}.svg`.
- **Slide 13's two charts share the box side by side** (two 556×440 halves). `lot-bar.svg` is
  currently 1136×440, so it renders at half size there; `d4-slope.svg` and `lot-bar.svg` should be
  authored for 556×440.
