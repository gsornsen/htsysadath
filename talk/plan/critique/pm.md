# Critique: product manager persona

Lane `critique/pm` · 2026-09-24 · deck at main `ad41954`, rendered at 1280×720. I judged slides and notes together.

**Persona:** a PM with no spare time and a roadmap problem. I can't follow embeddings or significance tests. What I want to know: when a hard problem lands, what do I do differently, what does it cost, and how do I sell it?

**Result: 7 of 22 slides DONE.**

| # | Slide | DONE/NOT | Blocking reason | Remove |
|---|---|---|---|---|
| 1 | Title | DONE | none | none |
| 2 | The jitter | DONE | none. "45+ candidate forks for one bug" is the hook. | "detect→identify boundary" |
| 3 | Why we push through | DONE | none. "Came close to being parked" is my world. | none |
| 4 | Demo kickoff | NOT | The turn of the talk ("exploring got cheap") reads as an engineering recipe on a demo slide. | "in worktrees", "hypothesis-gated" |
| 5 | Act 1 | NOT | Chart text is about 8 px, unreadable from the back, and the slide doesn't say why I should care. | chart footer and source lines |
| 6 | Act 2 | NOT | Same chart again; "bakeoff", "image-to-image", SigLIP (notes). | the SigLIP sentence |
| 7 | Act 3 | NOT | "Solve the hardest shared piece first", the best PM line, is only in the notes. Third copy of the chart. | the commit-date paragraph |
| 8 | Act 4 | NOT | "Raw comps at every condition" is jargon. No scope or timeline trade-off is shown. | the "precursor 08-23" aside |
| 9 | Negative result was the win | NOT | "Kill line", "dedup", "print@1", "McNemar… p=1.9e-06". I checked out here. | McNemar labels, n/201, error bars |
| 10 | At top-3, the gain halves | NOT | Repeats the chart from slide 9. It's a statistics lesson and never says what it means for the product. | whole slide |
| 11 | What we didn't try | NOT | The title promises the stopped work (the most useful part for a PM), but the chart shows "four incompatible ways to measure top-3". | four-panel chart |
| 12 | The bar, measured | NOT | "Auto-lock", "lock precision" and "CI" aren't defined, and it never says whether two in three is good enough to ship. | stat tiles, daily dots |
| 13 | Panel is the done gate | NOT | Screenshots are illegible. The bulk-approve → "don't re-click my answers" story is only in the notes. | the dissent-card screenshot |
| 14 | The gate fails | DONE | none. The most honest slide. | none |
| 15 | Demo reveal | DONE | none. I'd steal this for my PRDs. | the stray line break after "a tl;dr" |
| 16 | What I took from each | NOT | Live placeholder: "⟨Fill after rehearsal… don't invent them.⟩" | the placeholder |
| 17 | Two levers | DONE | none. The only time and cost numbers in the talk (plus "$9 for 760 tasks", in the notes). | "P0/P1" in the chart label |
| 18 | The coordinator | NOT | Model names on the axis and commit hashes in the boxes bury a simple idea: a senior writes the spec, a cheaper worker builds. | hashes |
| 19 | Demo: the record | NOT | Three minutes of `git log --graph`. I can't read hashes, and slide 20 makes the point anyway. | the live walk |
| 20 | Remembered vs recorded | NOT | A small-print table of 6 rows × 4 columns with D- and E-numbers. The lesson fits in one line. | the table |
| 21 | Against paralysis | DONE | none. Threshold, time box, budget, "go both", log of paths not taken: a PM checklist. | none |
| 22 | Two things for next week | NOT | Three bullets for "two things", two of them questions rather than actions, and no repo URL or QR code on the slide. | the "automated?" bullet as a separate item |

## Top 5 fixes, ranked

1. **Add the cost and the pitch (new slide between 12 and 21).** This is my central question, and the deck never answers it. Give Gerald's hours of attention, agent dollars across the ~100 experiments, and calendar days, next to what push-through would have cost (slide 3's parking risk). Add one line I could say to my boss, e.g. "Three nights and $X bought a no on five expensive ideas." Today the only dollar figures are in the notes and come from labeling.
2. **Close slide 2's loop.** The talk opens on jitter and never says whether it got fixed, which fork won, or how long it took. Add a line to 12 or 21.
3. **Collapse 5–8 into one slide.** Show the chart once, readable. Put this on the slide: "Each pivot was a scope call made with evidence in hand. Solve the hardest shared piece first." That frees about 3 minutes for fix 1.
4. **Collapse 9–11 into one plain-language slide.** Suggested title: "The idea I expected to win lost, and the test found what we shipped (+10 points)." Beside it, list the five things the gates let us *stop* (encoder swap, fine-tune, re-embed, buying art, distilled student). Cut McNemar, p-values, @1/@3 and the four-yardstick panel.
5. **Make 22 actionable, and fill 16.** Give two actions, each with a first step. (a) "Next doc: four persona writers on your rough draft, then 10 minutes to merge." (b) "Next fork: 3 options, a kill line for each, a time box and a budget; agents run them while you work." Put the repo URL or QR code on the slide.

## Jargon that loses a non-engineer

detect→identify · embedding · image-to-image · PostHog / replay offline · worktrees · hypothesis-gated · bakeoff · SigLIP · top-1/top-3/print@1 · raw comps, NM/LP/MP/HP/DMG · dedup · kill line · arm · language head · shadow ranker · frozen split, n=201 · McNemar, p-values · CI / Wilson · auto-lock / lock precision · Storybook / viewport · model names (Gemini, Haiku, Sonnet, Opus, Fable) · `git log --graph`, commit hashes · D4–D12, E67/E79b.

The worst offenders are slides 9–11 (the statistics), 18 (model names and hashes) and 20 (D- and E-numbers).

## Promise check

- **Abstract:** three of its four beats are kept (about 100 experiments, the overnight runs, the colleague line). The jitter is set up and never resolved. The "blocked experiment unlocks when its gate clears" mechanic appears only in the notes on slide 4, never on a slide.
- **Brief item 3** ("the ones NOT explored and what that cost"): the paths not taken are only in the notes on slide 11, and their cost appears nowhere.
- **Brief item 4 (two things for next week):** I could run the persona trick after slides 4 and 15. I couldn't run the coordinator pattern from what's on screen, and slide 22 only points to it.
- **Arc:** the moment (2–3) is strong. "What changed" (4) is squeezed into a demo slide. Evidence (5–13) sags: nine slides of mostly engineering metrics, with three charts repeated. Method (17–21) recovers, and 21 is the best slide for this audience. The close (22) is soft. "Why care" comes early enough, but "how much does it cost" never comes.
