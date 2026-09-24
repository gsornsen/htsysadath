# Critique round 2: mid-level SWE persona

Persona: 3 years in, never ran agents in parallel. Walked `deck.md` and its notes at `b22f162`,
all 20 PNGs, and `starter/` (2026-09-24).

**DONE: 12 of 20** (was 8 of 22). Fixed since round 1: the terms are defined on screen (slide
10), the kill line is drawn (12), there are no placeholders, and the URL and `starter/` are on the
close. Still open: the demo isn't magic any more, but it shows the product, not the method. And
`starter/` doesn't fully cover either closing action.

| # | Landed? | First hesitation | Remove | Verdict: blocking reason |
|---|---|---|---|---|
| 1 | yes | — | — | DONE |
| 2 | yes | the price panel is tiny | graded comps in the notes | DONE |
| 3 | yes | "E67", "E79b", "p50" | E-numbers on the ticks | DONE |
| 4 | yes | — | the green pill (repeats the quote) | DONE |
| 5 | yes | — | — | DONE |
| 6 | mostly | "worktrees", "gated", "flag" all first appear here, undefined | the second "my estimate" | DONE: the loop reads without the words |
| 7 | yes | "BASE / CTRL / F5" | p50 in the CTRL label | DONE |
| 8 | as a product demo | the notes jump to crop voting, E79, 17 px | the crop-vote explanation | NOT: the only live moment shows no lane, gate or flag |
| 9 | partly | "where" gives no slide numbers; no orchestration or "stop" row | "jitter (E19)", already past | NOT: the map doesn't match the method slides that follow |
| 10 | the strip does | "Fable" unexplained; "Opus 5.5" clipped on the axis | "coordinator review" box | NOT: never says what starts a lane |
| 11 | half | the notes say "five steps… four mechanisms"; the screen shows 6 boxes | "founder's word" | NOT: the spoken walk-through won't match the picture |
| 12 | yes | G0 / G3 / G0h, "language head", "top-1" | the n/201 numerators | DONE (the kill-line label overlaps the blue bar) |
| 13 | no | top-1/top-3, lock rate, precision, CI undefined | lock-rate and precision tiles | NOT: too many undefined measures for one point |
| 14 | the list does | "encoder", "distilled student" | — | NOT: the lesson (a gate written first lets you stop) is only in the notes |
| 15 | yes | — | dates on the LLM pill | DONE |
| 16 | the quote does | what the "Panel" is: only the notes say | the second screenshot (unreadable) | NOT: I can't see how to build the panel |
| 17 | yes | the "testimony" tag | the E84 reference | DONE |
| 18 | the words do | which file for which action? | — | NOT: action 2 has no starter file |
| 19 | yes | — | — | DONE (backup) |
| 20 | yes | — | — | DONE (backup) |

## Top 5 fixes, ranked

1. **Slide 18: map each action to a file, and add a kit for action 2.** Action 1 →
   `starter/two-lanes/checklist.md`. For action 2, `persona-drafts/` rewrites prose; it doesn't
   review a UI. Add `starter/persona-gate/`: one brief like Dez, the panel prompt, the DONE/NOT
   format, and "then open it on the real device".
2. **Add "unattended" to `two-lanes/`.** It has no flag, cap, time window or morning file.
   Add six lines to the checklist: end time, kill bar, flag default-off, call/time/$ cap, frozen
   data, one morning report.
3. **Slide 10: say how a lane starts.** One line: a new worktree and branch per lane, then one
   Claude Code session in it, given a brief. Replace "Fable" with "my strongest model".
4. **Slide 11: make the notes and the diagram count the same things.** Change "founder's word"
   to "my call".
5. **Slide 9: add slide numbers and the missing rows** (orchestration → 10, stop → 14), in slide
   order. On 13, cut two lock tiles and define top-3 on screen.

## Concepts used before they're explained

| Concept | First used | Explained |
|---|---|---|
| worktree | 6 | 10, only as "its own worktree"; how to make one is only in `starter/README.md` |
| gate | 6 | 6 ("bar set before the run"), properly on 10 |
| flag | 6 | 11 ("dev on, prod off") |
| lane | 10 notes | 10 (strip) |
| reviewer one tier up | 10 | 10, via the legend |
| Fable | 10 | never |
| kill line / pre-register | 9 | 11–12 |
| embedding | 5 | never |
| top-1 / top-3 | 12 | 13 notes only |
| lock rate / lock precision / CI | 13 | never |
| language head | 12 | never |
| persona review panel | 9 | 16 notes only |
| E-numbers (E19, E67, E84…) | 3 | never |

## Can I start Monday?

**Action 1: partly.** With `starter/two-lanes/` I can run two gated lanes in worktrees with a
stronger reviewer this week. The checklist and its "rules from pain" are excellent. What I can't
do is make it *unattended*: nothing covers caps, flags or the morning report. Slide 11 names
them but doesn't show how to set any of them up.

**Action 2: no.** The talk shows a persona gate's result but never the panel prompt, and
`starter/` has nothing for UI review. I'd be reconstructing it from slide 16's notes.

Net: I can start the parallel-lanes half. The flags half and the persona-gate half each need a
file.
