# Arc D demonstrated on itself — audience-tailored drafts of the talk abstract

Two parts: (1) interview Gerald so arc D has first-person truth; (2) run the persona-drafting
move on this talk's own abstract so the repo shows the method working.

## Part 1 — six questions for Gerald (Fable asks; answers go in docs/project/decisions.md as D4)
1. Walk me through the last time you did the multi-audience draft trick: what was the document,
   which audiences, how long did the versions take, how long did your hybrid pass take?
2. What do you look for when choosing the hybrid — frame, evidence layout, tone?
3. What has gone wrong with it (a version that invented a claim, a tone miss)? How do you guard?
4. On the product pivots (pregrade → lots → live scout → comps): which one felt like a
   scope/timeline conversation you could NOT have had without evidence in hand?
5. Which single experiment changed your mind the most, and which one you wish you had run earlier?
6. Talk length, live demo or recorded, and the spine arc if time is halved.

## Part 2 — the fan-out (four Sonnet lanes, independent; Fable or Gerald picks the hybrid)
Input: `talk/abstract-rough.md` (Gerald writes a rough 150–300-word abstract; until then, use
the thesis paragraph in docs/project/brief.md as the stand-in and say so in the output).
Branches: `draft/exec`, `draft/engineer`, `draft/designer`, `draft/pm`.
Outputs: `talk/abstract-<audience>.md`.
Lane body: the "Draft-lane prompt shape" in docs/agents/personas.md with that audience's brief
row. ≤ 200 words each. Preserve every factual claim; flag drops; end with 3 questions the
audience will ask.

Then the hybrid: `talk/abstract-final.md` + a 6-line `talk/abstract-hybrid-log.md` saying which
version supplied the frame, which the evidence order, which the closing ask, and what was cut.
Time the hybrid pass and record it — that number is a slide.
