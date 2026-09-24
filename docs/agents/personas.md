# Personas — two uses

## 1. Personas as reviewers of built things (arc C)

In Grailith, after code review, a panel of critics and user personas re-walked the built screens
(labeler, pregrade capture flow) and returned DONE / NOT with specific friction. The designer role
translated literal asks into jobs-to-be-done and could accept, reshape, or decline them. Simple
blockers were fixed inline without a full re-pass; pervasive changes triggered one.

Persona set used there (adapt, don't copy): the founder-as-labeler on a phone; a first-time
beta labeler; a mobile-first collector at a card show; an accessibility-minded critic; a
brand/typography critic. Each persona has: who they are, what they are trying to do in ≤ 2
minutes, what would make them stop, what "good" looks like to them.

Panel prompt shape:
```
You are <persona>. Walk <screen/story> at <width>. Report: (1) did you finish the job, (2) the
first moment you hesitated and why, (3) one thing you would remove, (4) DONE or NOT with the
single blocking reason. No praise. Cite the element you mean.
```

## 2. Personas as audiences for documents (arc D — the trick to teach)

Take a rough first draft. Spawn one lane per audience, each with a persona brief. Each returns a
tailored version. The author keeps working. Later: read all versions side by side, pick a hybrid,
spend ~10 minutes adjusting. Typical saving: hours.

Audience briefs (starter set — refine with Gerald):

| Audience | Wants | Length / form | Cut | Keep |
|---|---|---|---|---|
| Executive | the decision, the risk, the ask, the date | ≤ 1 page; 3 bullets then detail | method, tooling names | numbers with a comparison, one chart |
| Engineer | how it works, what could break, how to reproduce | as long as it needs; code blocks OK | motivational framing | the failure modes, the gate lines, the shas |
| Product designer | the user's job, the friction, the tradeoff made | narrative with the before/after screens | implementation detail | quotes from personas, the decline decisions |
| Product manager | scope · timeline · dependencies · what changed and why | table + timeline | code, internals | the pivot rationale, what was deferred and its trigger to revisit |

Draft-lane prompt shape:
```
You write for <audience> (brief above). Input: <path to rough draft>. Output: <path>, ≤ <N>
words, in this audience's form. Preserve every factual claim; do not add claims. Flag any claim
you could not keep with [dropped: reason]. End with 3 questions this audience will ask.
```

Then the hybrid step (author, 10 min): choose the frame from one version, the evidence layout
from another, merge, and cut. Log what was taken from where — that log is itself a good slide.

**This repo demonstrates arc D on its own abstract:** see prompts/04-audience-drafts.md.
