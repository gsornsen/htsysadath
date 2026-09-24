# Final pass: presentation-ready copy (from Gerald's review of v4, 2026-09-24 13:2x)

## Rule for every slide
Write each slide as FINAL copy, about to be presented. No meta or dangling labels on screen: no "my
framing:", no "(my estimate)" tags, no "testimony" chips, no "a lead, not proof" asides, no stage
directions on slides. Where a claim is Gerald's own account or estimate, say it in the sentence ("about
half an hour a day, by my count"; "I timed it: about three minutes a label"). Citations and caveats stay
in the SPEAKER NOTES and source footers. First person (D20); workplace wording (D22).

## Slide edits
1. **"What should we stop working on?"**: ground every item in its experiment (the id in the footer and
   notes, plain words on the slide). DROP the model items for now (the newer image model E57; the
   fine-tune E58; the distilled student E53d). The slide's thread becomes: **labeling first, then
   train a smaller distilled "student" model later**, grounded in the plan and labeling docs (e.g.
   `docs/plan/2026-09-14-trainset-track.md`, arc F, `mining/arcs/F-agent-labeling.md`). The Japanese art
   item: we DON'T pay for Japanese art. The context is that our catalogue plus the Japanese→TCGplayer
   mapping already cover it, so no additional art is needed. Grounding: EXP-E119 (09-12): "measured lift
   on the available replay harness is 0"; the mapping stage recovers the rows. Keep "re-processing every
   reference image: never started" if it's grounded (E12/E39); otherwise cut it.
2. **"The tests pass. Is it actually done?"** (persona review gates): after the real-phone miss, the
   personas got LIVE browser access (a real Chrome, not rendered screenshots), and the gates got much
   better: less rework before merging. Ground it (look for later panels that walked a live browser, e.g.
   the 09-21 finish-selector panel in `docs/design/2026-09-21-finish-selector/`, Playwright/Chrome notes
   in plans and memory). If the "less rework" isn't measured, say it as Gerald's experience in plain
   words. Update `persona-gate.svg` with a fifth step: "Then: personas on a live browser → fewer
   surprises before merge".
3. **Slide 8, "Four problems you'll hit, four methods"**: it looked blank. Make it the talk's pivot
   slide: `four-problems.svg` large and centred, no redundant text line (the diagram carries A–D), the
   title only. Verify it renders at full size in the deck.
4. Remove every dangler (e.g. slide 18's "my framing: one sentence for your boss"). Keep the boss sentence
   only if it reads as a normal final line.
Then re-run the Q&A demo LIVE so its questions and answers reflect the final slides; confirm public replay
(`check.sh`) and no "founder|gerald|kill".
