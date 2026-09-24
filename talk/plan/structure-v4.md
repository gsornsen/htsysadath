# Structure v4: audience-first (coordinator, 2026-09-24): from Gerald's 12:2x feedback

> "The marp slides are for the audience (engineers, product managers, product designers). The goal is
> to talk about methods used to tackle these problems, how they might show up during their projects,
> and methods they can consider using to 'scale themselves', grounded in the evidence of card scout.
> I find the current state of the slides confusing if I put myself in their shoes."

## Diagnosis (why v3 confuses)
1. Slides answer "what happened in card scout"; the audience asks "what do I do in MY project".
2. Internal labels on screen: G0/G3/G0h, print@1, auto-lock, lock precision, E-numbers, cohort, frozen split.
3. Method titles assume context ("top-3 halves the gain": top-3 of what?).
4. No bridge back to their work: evidence with no "you'll see this when…" / "try this".
5. Nine methods in a row: too many to hold.
6. The opening dives into internals (seven dated areas) before giving a reason to care.

## The pattern for every method slide
- **Title = the audience's question**, in their words (e.g. "Is my favourite idea actually better?").
- **One line: the method.** Plain words.
- **Card scout as evidence**: one picture or one number, labelled in plain words ("before", "my
  favourite idea", "what shipped"). Codes (E67, G0h) only in the source footer and the notes.
- **The notes** carry "you'll see this in your project when…" and "try it: …".

## Skeleton (~35 min; minutes are targets)
**Part 1: a moment you'll recognise (story, ~8 min)**
1 Title: "How to scale yourself: methods for when a hard problem lands mid-project" (0.5)
2 **The moment**: framed for THEM, no card scout yet: a hard problem lands mid-project; five plausible
  fixes, one week, one of you; the default is to pick one and push. (1.5)
3 My version: the card scout (the screenshot; one line on what it does) (1.0)
4 The first sign and the fork: it got fast enough to flap; 45+ forks, one of me (merges the old 4 + 5;
  `jitter-before-after.svg` or `fork-tree.svg`) (1.5)
5 What changed: exploring got cheap. The loop in plain words, ~30 min a day (my estimate), a flat
  subscription; worktree, gate and flag defined here. (2.0)
6 It worked: thrown-away answers 36 → 15 → 0.14 per 100, in 3 days (`jitter-drops.svg`) (1.5)
7 **Live demo**: the card scout, live (vote on) (5.0)
   (The old "how we got here" timeline moves to BACKUP, simplified to its start and end: 6–15 s → under half a second.)
**Part 2: four methods for four problems (~21 min)**
8 Map: four problems you'll hit → four methods (a new diagram replaces the 8-row map) (1.0)
- **A. "Too many forks, and just one of you"**: explore in parallel, safely
  9 Lanes with a reviewer one tier up (simplified `e-lane-dag`: no tier names on screen beyond "smaller
    model builds, stronger model reviews, I decide") (2.0)
  10 Let it run while you sleep: gates and flags (`gates-flags.svg`); evidence includes the idle-tab failure (3.5)
- **B. "Is my favourite idea actually better?"**: decide with a line drawn in advance
  11 Write the kill line before the run: my favourite idea lost 14 points and was dropped; the simpler
     thing shipped (`d4-arms.svg`, relabelled in plain words) (1.5)
  12 Measure what users feel: the metric you pick can double or halve your win (top-1 → top-3 halves
     it); the bar that mattered, right card in the top 3 on live auctions, is about 2 in 3 (1.5)
  13 Let the gates tell you what to stop: things we never built (1.0)
- **C. "Is it actually done?"**: gates for quality
  14 A persona review panel as the done gate, and where it failed: a real phone (`persona-gate.svg`) (2.5)
  15 Agents first, a human verdict: 3 minutes → 31–46 s (`f-two-levers.svg`) (1.5)
- **D. "Where do we even start?"**: sequence the work
  16 Solve the hardest shared piece first (`shared-core.svg`) (1.5)
**Part 3: close (~4 min)**
17 **Cheat sheet**: "If you see this in your project → try this" (4 rows, text) (2.0)
18 Two things for next week + the starter kit + the repo (1.5)
Backup: B1 cost/hours/hold-out · B2 how we got here (simplified timeline) · B3 the four yardsticks.

## Visual changes this implies (a follow-up lane, after F1 lands)
- New `four-problems.svg` (slide 8): four problem cards → four methods.
- Relabel for the audience, no internal codes on screen: `d4-arms` ("before", "my favourite idea:
  dedupe the index", "what shipped: a small language filter"); `d4-slope` ("top-1 answer" / "right card
  in the top 3"); `lot-bar` (plain tiles); `e-lane-dag` (roles, not model names).
- `identify-timeline` simplified for backup.
