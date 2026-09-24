# Critique round 2: skeptical senior/staff SWE

Lane `critique2/senior-swe` · Opus 5.5 · 2026-09-24. Walked `talk/slides/deck.md` at `b22f162`
(slides + notes), rendered all 20 slides at 1280×720, spot-checked 6 numbers. Critique only.

## Per slide

| # | Verdict | Blocking reason (element) | Remove |
|---|---|---|---|
| 1 | DONE | (hesitated: notes say "everything… in a public repo, so you can check me", but the `G:` SHAs and EXP docs live in private Grailith) | — |
| 2 | DONE | (hesitated: nothing. A real screenshot is the right opener) | subtitle |
| 3 | NOT | The endpoints use different units. "6–15 s, identify end to end (LLM vision)" vs "375 ms p50, identify round trip". The 10.4 s median is n = 6. 375 ms appears in no mining finding, only as a parenthetical in D14's open questions; pivots-timeline gives quad→fire p50 218 ms | "Seven areas…" caption |
| 4 | DONE | (hesitated: "— Gerald" on a line written for the talk; the diagram gives away slide 7's answer) | the green pill (repeats the quote) |
| 5 | DONE | "45+" is now labelled "my estimate". Old blocker fixed | — |
| 6 | NOT | "~30 min a day" is the thesis number for *scale yourself*, and it's uninstrumented. It's on the slide twice, and the other slides show human work it leaves out: morning review, 87 lot taps, iPhone check, correcting the swarm | the bottom box (duplicates the quote) |
| 7 | DONE | Against a control, and both levers credited (hesitated: no denominator; "≈1 in 700" could be one event) | — |
| 8 | DONE | Fallback is labelled as recorded (hesitated: build is branch `demo/scout-single-crop` running the vote. The name invites "staged?") | — |
| 9 | NOT | The map doesn't match the method slides. It has no orchestration or "stop things" row, "where in the talk" gives no slide numbers, the order differs from 10–17, and the notes list a different set of 8 | the third column's labels (use slide numbers) |
| 10 | NOT | The chart breaks its own rule: the Haiku `mine: inventory` lane goes straight to `main` with no reviewer one tier up. "Opus 5.5" is clipped at the left edge. Still this talk repo, not the overnight queue (old blocker stands) | legend (duplicates the y-axis) |
| 11 | NOT | This is the focus slide, and the notes don't match the diagram: the notes speak "five steps… four mechanisms", the diagram draws 6 boxes. The E84 cap (8·60 s·$6) is the **labeler** agent's, but it's shown as an overnight-experiment guard | "founder's word" pill |
| 12 | NOT | The losing arm and kill line are now drawn (old blocker fixed). But G0h is still a **post-hoc** arm (arc A l.31) on the same 201-crop split. The slide never says so, and the subtitle implies it was planned. The kill-line label overprints the G0 bar | "(65.7%)" |
| 13 | DONE | The most credible minute: the gain halves, with CIs (hesitated: the lots are 83 EN / 4 JA, so the JA-motivated head is barely tested by the right-hand tiles; one tapper. Say it). "+5.47" collides with the line | the "the gain halves" caption (the subtitle says it) |
| 14 | NOT | The only method slide with no source footer. "9.55 points" of what metric, on which split? Two items have no number. "Never started" isn't a gate outcome | "Re-embedding… never started" |
| 15 | DONE | (hesitated: "every app I'd tested was slow" is opinion; there's no counterfactual) | "serves both" |
| 16 | NOT | Takeaway #2 rests on a slide whose only evidence is the gate *failing*. Nothing shows what the panel caught before merge. The screenshots have no captions, so I can't tell which one is "unusable" | second screenshot |
| 17 | DONE | Linear axis, testimony hatched, stages stacked. Old blocker fixed (hesitated: speed only; the κ = 0.952 agreement belongs on screen) | floating whisker |
| 18 | DONE | URL + `starter/` on screen, and `starter/` exists. Old blocker fixed | — |
| 19 | DONE | Hold-out answered (old Q&A #2 closed) (hesitated: name the Max tier; usage-limit kills are a cost too) | — |
| 20 | DONE | (hesitated: 71.3/65.2 labels crowd) | — |

**DONE: 12 of 20** (was 7 of 22).

## Top 5 fixes, ranked

1. **Slide 3: use one metric at both ends.** Either the bench median (10.4 s, n = 6) against E88's
   identify p50 with the same definition, or the live "card on screen → answer" at both ends. Put
   375 ms, with its definition, into a mining finding with provenance before it goes on a title
   slide.
2. **Slide 12: write "post-hoc arm, same split" on the G0h bar**, with "20 fixed / 0 broken,
   McNemar". Move the kill-line label off the blue bar. Say "forking paths" before Q&A does.
3. **Slide 11: make the words and the picture agree.** Re-script to the 6 boxes, or redraw as 5
   steps + 4 mechanisms. Label the E84 cap "labeler agent" or swap in an overnight-run cap. Cut
   "founder's word": third person reads as agent-written.
4. **Slide 6 (and 19): show the human work, not just a number.** Replace the box with the list
   of what only Gerald did: set up the night, read the morning file, flip prod, 87 taps, iPhone
   check, correct the swarm. Or compute active hours from `mining/timeline/sessions.md`. As it
   stands, "30 min/day" is the claim I walk out on.
5. **Slides 9, 10, 14: tighten the structure.** Make the map list exactly slides 10–17 with
   their numbers. Draw the reviewer on the Haiku lane (or explain its absence) and un-clip
   "Opus 5.5". Give slide 14 a footer and "metric · split · Δ" for each item.

Also: slide 16 needs one line on what the panel caught pre-merge (the 30 s → 9 s is in the notes
only, and it's simulated). Slide 1's notes should say "the product repo is private; every claim
traces to a paraphrased, dated finding here".

## Numbers checked

| Claim (slide) | Source | Result |
|---|---|---|
| 35.8 → 15.4 → 0.14 per 100; p50 1,157 → 433 ms (7) | decisions.md D14 l.299–300 | **Match.** No n anywhere I found |
| 67.66 → 77.61 top-1; 83.58 → 89.05 top-3, +5.47 (12, 13) | E67-top3-replay l.57–71, 101–102 | **Match** (12 fixed / 1 broken, p = 0.0034). Post-hoc per arc A l.31 |
| 45/69 = 65.2 % [53.4–75.4]; 18/87; 16/18 (13) | lot-top3-unlocked l.12, 75 | **Match.** l.126: one tapper, 83 EN / 4 JA |
| 10.4 s median, 44 ms, 375 ms p50 (3) | arc B l.25, 36, 38; D14 l.309 | **Partial.** 10.4 s is n = 6. 44 ms is SigLIP model latency on 84 captures. 375 ms appears only in an open question; pivots-timeline l.31 says quad→fire p50 218 ms |
| −14.43 pts; 96 % of 19,258 (12) | arc A l.29–30 | **Match** (96.14 %) |
| 8 calls · 60 s · $6 → 14; ~$9 / 760 (11, 19) | gates-and-flags l.16; D13; D6/D7 erratum l.149 | **Match**, but it's the labeler pilot's cap, and the $9 went to a non-Claude provider |

## The Q&A challenge the talk still can't answer

**"You say agents are extra copies of you. How many hours did *you* actually spend, and on
what?"** The title promises scaling the self. The only measure of the self is an estimate
(D13 said the talk would make no hours claim; D16 reversed that as testimony). Meanwhile the deck
itself shows a swarm that needed correcting (10), a gate that passed an unusable UI (16), 87 truth
lots tapped by hand (13) and an idle tab that burned a day's allowance (11). The session log in
`mining/timeline/` could bound it. Until it does, a staff engineer hears "30 minutes" and thinks
"survivorship."

Runner-up: "On 83 English and 4 Japanese live lots, how much of the 2-in-3 is the language head?"
The honest answer is: almost none of it is measured.
