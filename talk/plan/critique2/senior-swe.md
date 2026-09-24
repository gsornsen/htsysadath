# Critique round 2: skeptical senior/staff SWE

Lane `critique2/senior-swe` · Opus 5.5 · 2026-09-24. I walked `talk/slides/deck.md` at `b22f162`,
slides and notes together, rendered all 20 slides and spot-checked 6 numbers. Critique only.

## Per slide

| # | Verdict | Blocking reason (element) | Remove |
|---|---|---|---|
| 1 | DONE | (hesitated: notes say "check me" in a public repo, but the `G:`/EXP sources are in private Grailith) | — |
| 2 | DONE | A real screenshot is the right opener | subtitle |
| 3 | NOT | The two ends use different units: "6–15 s end to end" vs "375 ms identify round trip". 10.4 s is n = 6. 375 ms is in no finding, only D14's open questions | "Seven areas…" caption |
| 4 | DONE | (hesitated: "— Gerald" on a line written for the talk) | green pill |
| 5 | DONE | "45+" is now labelled "my estimate". Old blocker fixed | — |
| 6 | NOT | "~30 min a day", the thesis number, is uninstrumented and shown twice. It leaves out human work the deck itself shows: morning review, 87 lot taps, iPhone check, correcting the swarm | bottom box |
| 7 | DONE | Against a control, both levers credited (hesitated: no n; "1 in 700" may be one event) | — |
| 8 | DONE | Fallback labelled (hesitated: branch `demo/scout-single-crop` runs the vote. The name invites "staged?") | — |
| 9 | NOT | The map ≠ the method slides: no orchestration or "stop things" row, no slide numbers, different order, and the notes list a different 8 | third-column labels |
| 10 | NOT | Breaks its own rule: the Haiku lane merges to `main` with no reviewer. "Opus 5.5" is clipped. Still this talk repo, not the overnight queue | legend |
| 11 | NOT | Focus slide, but the notes say "five steps, four mechanisms" and the diagram draws 6 boxes. The E84 cap is the *labeler's*, shown as an overnight guard | "founder's word" pill |
| 12 | NOT | Losing arm and kill line are now drawn (fixed), but G0h is **post-hoc** (arc A l.31) on the same split, and the slide implies it was planned. The kill-line label overprints G0 | "(65.7%)" |
| 13 | DONE | The gain halves, with CIs (hesitated: lots are 83 EN / 4 JA, so the head is barely tested there; one tapper) | "the gain halves" caption |
| 14 | NOT | The only method slide with no footer. "9.55 points" of what, on which split? Two items have no number | "never started" bullet |
| 15 | DONE | (hesitated: "every app I'd tested" is opinion) | "serves both" |
| 16 | NOT | Takeaway #2's only evidence is the gate *failing*; nothing it caught pre-merge. Screenshots have no captions | second screenshot |
| 17 | DONE | Linear axis, testimony hatched, stages stacked. Fixed (hesitated: speed only; put κ = 0.952 on it) | floating whisker |
| 18 | DONE | URL and `starter/` (which exists) are on screen. Fixed | — |
| 19 | DONE | Hold-out answered (hesitated: name the Max tier) | — |
| 20 | DONE | (hesitated: 71.3/65.2 labels crowd) | — |

**DONE: 12 of 20** (was 7 of 22).

## Top 5 fixes, ranked

1. **Slide 3: use one metric at both ends.** For example, live card-on-screen → answer, or the
   bench median against E88's p50 under the same definition. Log 375 ms with its definition and
   provenance in a finding first.
2. **Slide 12: write "post-hoc arm, same split · 20 fixed / 0 broken" on G0h.** Move the kill
   label off the bar. Say "forking paths" before Q&A does.
3. **Slide 11: make the words match the picture.** Re-script to 6 boxes, or redraw as 5 + 4.
   Label the E84 cap as the labeler's, or use an overnight-run cap. Cut "founder's word".
4. **Slide 6 (and 19): replace the 30-min box with what only Gerald did.** That's set up the
   night, read the morning file, flip prod, 87 taps, iPhone check, correct the swarm. Or bound his
   hours from `mining/timeline/sessions.md`.
5. **Slides 9/10/14: fix the structure.** Map exactly slides 10–17, with their numbers. Draw
   the Haiku lane's reviewer and un-clip the label. On 14, add a footer and "metric · split · Δ"
   per item.

## Numbers checked

| Claim (slide) | Source | Result |
|---|---|---|
| 35.8 → 15.4 → 0.14; p50 1,157 → 433 ms (7) | D14 l.299–300 | **Match.** No n found |
| 67.66 → 77.61 @1; 83.58 → 89.05 @3 (12, 13) | E67-top3-replay l.57–71, 101 | **Match** (12 fixed / 1 broken, p = 0.0034) |
| 45/69 = 65.2 % [53.4–75.4]; 18/87; 16/18 (13) | lot-top3-unlocked l.12, 75, 126 | **Match.** One tapper, 83 EN / 4 JA |
| 10.4 s, 44 ms, 375 ms (3) | arc B l.25, 36, 38; D14 l.309 | **Partial.** 10.4 s is n = 6. 44 ms is model latency. 375 ms appears only as an open question; pivots-timeline l.31 says quad→fire p50 218 ms |
| −14.43 pts; 96 % of 19,258 (12) | arc A l.29–30 | **Match** (96.14 %) |
| 8 · 60 s · $6 → 14; ~$9 / 760 (11, 19) | gates-and-flags l.16; D13; erratum l.149 | **Match.** But it's the labeler's cap, and the $9 was a non-Claude provider |

## The Q&A challenge the talk still can't answer

**"Agents are extra copies of you. How many hours did *you* spend, and on what?"** The title
promises scaling the self, and the only measure of the self is an estimate: D13 ruled out an
hours claim, and D16 brought it back as testimony. Meanwhile the deck shows a swarm that needed
correcting (10), a gate that passed an unusable UI (16), 87 lots tapped by hand (13) and an idle
tab that burned a day's allowance (11). Until the session log bounds it, "30 minutes" sounds like
survivorship.

Runner-up: "With 83 EN / 4 JA live lots, how much of the 2-in-3 is the language head?" Nearly
unmeasured.
