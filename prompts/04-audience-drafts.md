# Arc D demonstrated on itself — audience-tailored drafts of the talk abstract

Two parts: (1) interview Gerald so arc D has first-person truth; (2) run the persona-drafting
move on this talk's own abstract so the repo shows the method working.

## Part 1 — six questions for Gerald (Fable asks; answers go in docs/project/decisions.md as D4)
1. Walk me through the last time you did the multi-audience draft trick: what was the document,
   which audiences, how long did the versions take, how long did your hybrid pass take? -- I'll tackle this at a later phase in case the rest of the arc(s) take up the live talk time.
2. What do you look for when choosing the hybrid — frame, evidence layout, tone? -- a structure that folks that need the tl;dr can read quickly, and curious individuals and individuals that need to know the details, data, etc can drill into at the lebels they need to
3. What has gone wrong with it (a version that invented a claim, a tone miss)? How do you guard? -- none, but before using this method I was prone to writing too long/lengthy of docs that didn't get fully read and found myself having to hold meetings when the doc was meant to replace a meeting
4. On the product pivots (pregrade → lots → live scout → comps): which one felt like a
   scope/timeline conversation you could NOT have had without evidence in hand? -- live scout had a few areas/themes that drove big pivots with massive wins: when we were struggling with accuracy and japanese cards were having a higher similarity than english cards in the crops... it felt counter intuitive to drop the japanese index completely and taking the time to set up those experiments simplified a lot, reduced training need, maintenance, etc; the other was around how hard it was to land on detecting a card and when to run identify versus not run identify. I was getting close to parking the project since we were struggling to identify a card end to end in enough time to win an auction
5. Which single experiment changed your mind the most, and which one you wish you had run earlier? - the most: removing the japanese index and being able to tackle multiple languages with just the reference art. run earlier: i'm not entirely sure, something around when to detect and not detect a card sooner, we spent a lot of time running experiments to make identify faster, but in the end we ended up not needing to run 5 identify calls per detect like we were doing for a while, so thinking more about how to deal with moving cards would probably be it
6. Talk length, live demo or recorded, and the spine arc if time is halved. -- 35 minutes live with 10 minutes Q&A

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
