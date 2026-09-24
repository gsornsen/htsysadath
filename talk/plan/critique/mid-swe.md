# Critique: mid-level SWE persona

Persona: 3 years in, AI autocomplete only, never ran agents in parallel. Walked the deck (slides
plus notes), all 22 rendered PNGs, `demo/`, `docs/agents/coordinator.md`, `docs/agents/personas.md`,
`prompts/04-audience-drafts.md` (2026-09-24).

**DONE: 8 of 22.**

| # | Verdict | Blocking reason (first hesitation) | Remove |
|---|---|---|---|
| 1 | DONE | — | — |
| 2 | DONE | "scout" and "detect→identify" land only because the notes say them aloud | the "five experiments per part" arithmetic |
| 3 | DONE | — | bullet 1's generic "scope, staffing and timeline" |
| 4 | NOT | The whole method is one sentence on a demo kickoff slide. "Worktrees" and "hypothesis-gated" are never defined | the thesis sentence (give it its own slide) |
| 5 | NOT | Chart text is about 8 px, so it's unreadable. Internal IDs ("Arc B", "D9, D11") are on screen | chart caption and source line |
| 6 | NOT | Same chart, no act-2 highlight. Notes add "three-lane bakeoff" (*lane* undefined), SigLIP, top-1 | SigLIP and the 0.84 / 44 ms numbers |
| 7 | NOT | Same chart a third time, and no method takeaway on the slide | the repeated chart |
| 8 | NOT | "Comps" is never defined, and nothing here is about scaling yourself | the whole slide |
| 9 | NOT | The title says dedup lost, but the chart has no dedup arm (only G0 and G0h). The copyable idea, the kill line, is never shown as text | McNemar annotations |
| 10 | DONE | "The metric you pre-register is a decision" lands | the second McNemar line |
| 11 | NOT | The title says "didn't try" but the chart shows measurement methods. Stopped experiments appear only in the notes, as E-numbers | one of the two halves |
| 12 | DONE | "auto-lock" and "truth lots" are undefined, but "two in three" is clear | the stat tiles |
| 13 | NOT | Screenshots are unreadable, and the panel prompt I'd copy isn't on screen | the dissent-card screenshot |
| 14 | DONE | "Your own hands are the last gate" lands | the second screenshot |
| 15 | NOT | The four columns look like magic: I never see the prompt or the `claude -p` loop. Stray line break at "tl;dr / frame" | the localhost link text |
| 16 | NOT | Placeholder "⟨Fill after rehearsal…⟩" renders on the slide | the placeholder |
| 17 | DONE | "P0/P1" is jargon. Chart says 20–30 s, subtitle says ~20 s | the P0/P1 label |
| 18 | NOT | The slide I came for is four boxes with SHAs. "Fable", *lane*, *spec* and *tier* are undefined, and it never says how lanes are spawned or isolated | the SHA labels |
| 19 | NOT | Shows the result, not the setup. No stop shows a brief or a lane being created | stop 2 (slide 20 covers it) |
| 20 | NOT | Six rows at about 9 px, and nothing I'd do differently on Monday | rows 4–6, or the slide |
| 21 | DONE | "go both" needs the notes | "shadow ranker" (notes jargon) |
| 22 | NOT | "Start here" gives no URL, path or QR. The obvious file, `prompts/04-audience-drafts.md`, is mostly interview answers | merge the two question bullets |

## Top 5 fixes, ranked

1. **Slide 22: make "start here" findable.** Add the repo URL and a QR code, plus three exact
   paths: `demo/fanout` (the loop), `demo/fanout.d/engineer.md` (a real persona brief), and
   `docs/agents/coordinator.md` § "Brief template". Point at `demo/fanout.d/`, not
   `prompts/04-audience-drafts.md`, which is project-specific interview material.
2. **Replace slide 16's placeholder, or add a slide after 15: "This is all demo/fanout is."**
   Show about 8 lines: for each persona, `claude -p "$(cat persona.md) + draft" --model sonnet >
   out/persona.md &`, plus 6 lines of one brief (Wants / Cut / Keep / "preserve every claim,
   flag drops, end with 3 questions"). That turns the demo into something I can copy.
3. **Slide 18: define the words and show one brief.** Add a glossary strip:
   *lane* = one task on its own branch and worktree (`git worktree add ../lane-x -b lane/x`);
   *gate* = a pass/fail check written before the run; *reviewer one tier up* = Haiku's work
   checked by Sonnet, Sonnet's by Opus, and the review states what it verified (counts,
   spot-checks), never "looks good". Put one filled 9-line brief beside the DAG. Say "your
   strongest model" instead of "Fable", and say how lanes were launched (sub-agents with
   worktree isolation, or N terminals).
4. **Slides 5–8: collapse the four acts into one slide** with the current act highlighted. The
   repeated chart can't be read on a projector and carries no method. Spend the 2–3 minutes
   you save on fixes 2 and 3.
5. **Slides 9 and 13: show the artifact, not the result.** On 9, show E67's kill line as it was
   written before the run, and either add the dedup arm or retitle the chart. On 13, replace
   the dissent-card screenshot with the 4-line panel prompt from `docs/agents/personas.md` §1
   and one persona line ("Dez, 22, phone-only, one thumb").

## Concepts used before they're explained

| Concept | First | Explained |
|---|---|---|
| worktree | 4 | never |
| hypothesis-gated / gate | 4 | partly: 9 (kill line, notes), 13 ("done gate"). Never defined in general |
| fan-out | 4 | never (implied by the demo) |
| persona brief | 4 notes, 15 | 13 notes (Dez), never shown |
| lane | 4 notes, 6 notes | never |
| comps | 8 | never |
| embedding, image-to-image, SigLIP | 2 notes, 6 | never |
| top-1 / print@1 / top-3 | 6 notes, 9 | top-3 in the 10 notes; print@ never |
| pre-registered kill line | 9 | 9 notes, one clause |
| arc B, D9/D11, E-numbers | 5 (chart) | never; they're internal IDs |
| auto-lock, truth lots | 12 | 12 notes, partly |
| coordinator | 18 | 18, one sentence |
| tier, Fable/Opus/Sonnet/Haiku | 18 chart | never; the audience doesn't know "Fable" |
| reviewer one tier up | 18 | 18, one sentence; *what* it checks is only in `coordinator.md` |
| spec / brief | 18 notes | never shown; the template is only in the repo |

## Could I start the two practices next week?

- **Persona drafting: almost.** `demo/fanout` plus `demo/fanout.d/*.md` is a working,
  copyable kit (bash, `claude -p`, four briefs). But the deck never names those files, and they
  hard-code `talk/abstract-rough.md` and talk-specific "Keep" lines. I'd have to find them and
  then edit them.
- **Coordinator/lanes: no.** `coordinator.md` has a real brief template. But it assumes things I
  don't know: the repo-specific branch prefixes `mine|draft|talk`, "Fable" as coordinator, and
  nothing on *how* a lane is spawned into its own worktree, what happens at merge, or how
  "done by count" is checked. Demo 1 doesn't use worktrees (it's four background processes),
  so the only lanes I see live aren't the pattern on slide 18. The root README's "Start here"
  is for agents continuing this talk, not for an attendee.

## The missing "how to start" artifact

**A one-page starter, separate from this talk's machinery** (e.g. `START-HERE.md`, linked
from slide 22 and the README), with:

1. a generic `fanout <draft> <persona-dir>`, with de-personalised briefs;
2. a blank lane brief with generic branch names;
3. a five-step "first two-lane run" checklist: write the gate, `git worktree add` two lanes,
   launch each with its brief, have a stronger model review with a positive check, then
   `merge --no-ff` with what you learned.
