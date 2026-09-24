# Arc C — the design panel as the done gate

## 1 · The arc

Code review (tests, gates, criteria-auditors) answers "does it work"; it never answered "can
a real collector use it" — a code-complete labeler passed every gate on 2026-07-18 and still
put the founder into a mobile dead-end and confusing nav [src: memory
`founder-testing-milestones` · 2026-08-02]. Over 2026-09-09 to 2026-09-21 the project turned
that gap into a repeatable mechanism: a small panel of fictional personas (collector
archetypes, not real customers) plus adversarial critics re-walks the *built* screens against
the founder's own jobs-to-be-done, and returns DONE or NOT DONE with blocking vs. "later"
items. The founder made this the literal gate for calling labeling/pregrade work done, and
separately ruled that designers — human, agent, or persona — must never implement a literal
user ask; they translate it into the underlying job first. Below: the mechanism reconstructed
concretely, one literal-ask translation, and one place the gate itself missed something.

## 2 · Pivotal moments

**2026-09-13, ~13:5x PDT — the panel becomes the done gate.** Trigger: the 09-12 labeler audit
reproduced three founder complaints as named lines of code (a 450 ms hover timer opening a
full-screen modal over every candidate pick, killing every hotkey) [src:
`docs/design/2026-09-12-labeler-ux-audit.md` · 2026-09-12]. Ruling: code-done is not done —
"the design panel is the gate for considering work truly done," responsible for all personas,
iterate until implementor and panel align, non-blocking items wait for one polish round [src:
memory `design-panel-is-the-done-gate` · 2026-09-13]. Not explored: keeping "founder likes it"
as the gate — named explicitly as the thing this replaces.

**2026-09-13 — the mechanism itself.** Four *named, fictional* personas, each a standing brief
(`personas/{marisol,dez,ken,gerald-admin}.md`): Marisol (vintage WOTC collector, desktop +
couch phone, no keyboard-shortcut experience), Dez (22, phone-only, one thumb, "swipe-fast not
homework"), Ken (58, Japanese-card specialist, iPad + Pencil, reads JP), Gerald-admin (the
founder's own dissent-resolution loop, phone at 1am + laptop by day) — each states background,
device, and the job they hired the tool for. Three critics run in parallel with a *lens*
instead of a backstory — A (mobile ergonomics/time-per-task), B (information design), C
(admin/trust) — citing a file and line for every claim [src:
`docs/design/2026-09-13-labeler-critique/critiques/A-mobile-flow.md` · 2026-09-13]. All seven
walk the same built Storybook set (before/after commits pinned) on their stated device, log a
seconds-per-task number, and write DONE or NOT with blocking/later items into
`p0-panel-verdict.md`. The shape recurred 2026-09-21 on an unrelated feature with a different,
domain-specific roster (Reseller, Collector, "money-honesty critic") [src:
`docs/design/2026-09-21-finish-selector/04-panel.md` · 2026-09-21] — a template re-briefed per
feature, not one fixed cast.

**Literal ask → job, worked example.** Founder, 09-13: "I don't know how I can bulk approve
the 92 human-labeled tasks." Literal read: ship a bulk-approve button. Translation (per the
founder's rule that feedback is input, never spec [src: memory `design-translates-feedback` ·
2026-09-13]): the 92 are the founder's *own* prior answers awaiting his own approval, not
third-party decisions, so the job is "don't make me re-click my own answers" — satisfied with
zero clicks by owner-label self-resolution. A bulk-approve control still ships, but inbox-only
and gated behind four integrity checks (id cardinality ≤ 1 among winning-verdict labels; never
write an id consensus doesn't hold; `cant_tell` excluded from unanimity; refuse any
id-requiring verdict with an empty id set) [src:
`docs/design/2026-09-13-labeler-critique/final-critique-and-plan.md` §3.2, §4 · 2026-09-13].
The same table runs a dozen more — e.g. "x of x complete!" animation → one true clause, no
percentage, because the job was "know my effort mattered."

**DONE/NOT DONE in practice, with a tie-break.** P0's table: Dez DONE (9s median, was 30s),
Marisol DONE (14s desktop/9s phone), Gerald-admin DONE (10.5s), Ken **NOT → resolved**: two of
his three claimed blockers "did NOT reproduce" on re-drive (his taps landed on a 44×44
compare-icon corner, not the tile) but were fixed anyway [src:
`docs/design/2026-09-13-labeler-critique/p0-panel-verdict.md` · 2026-09-13]. Tie-break rule,
issued the same day after three trivial blockers came back: simple, measurable, 1–2-file fixes
get fixed with internal review and no re-invoked persona pass; only pervasive changes re-summon
the affected persona/critic, never the whole panel [src: memory `panel-blockers-fixed-inline` ·
2026-09-13]. The founder is the tie-breaker on "simple enough to skip re-panel," not a vote.

**The gate's honest failure.** Both P0 (09-13, Dez 9s DONE) and P1 (09-13 21:50, Dez 8s, "0
manual scroll to Submit" on 11 stories, DONE) certified the phone experience [src:
`docs/design/2026-09-13-labeler-critique/p1-panel-verdict.md` · 2026-09-13]. The next morning,
2026-09-14 09:40, the founder tested the *deployed* app on his own iPhone and called mobile
"pretty much unusable": three scrollable sections pushing content off-screen, a help modal
reopening every task, rotation required to reach some options [src:
`docs/plan/2026-09-15-labeler-bug-ledger.md` bugs B19/B20/B22, rules R13/R9 · 2026-09-14]. The
panel's headless, Storybook-driven walk (fixed viewport, no iOS chrome collapse, no cross-task
navigation) missed exactly what only shows up on a real device in the real flow. The fix was
procedural: "another design crit pass, but this time the swarm should also consider a blank
canvas rethink" [src: `docs/plan/2026-09-15-labeler-bug-ledger.md` R14 · 2026-09-14] — DONE
from the synthetic walk was necessary, not sufficient; his own hands stayed the final check.

## 3 · The transferable move

Write each persona as a short, durable brief (name, one expertise gap, device, and the *job*
in their own words, not a feature list) and keep it as a standing file reused every review
round, not a one-off prompt. Give each critic a *lens* (a measurable question, e.g.
"can a real human finish in under a minute on a phone") instead of a backstory, and require
citations — file:line, a measured pixel, a screenshot — for every claim; that's what turns "I
don't like it" into something an implementor can act on. Run all of them against the same
before/after built artifact, have each state a seconds-per-task and a DONE/NOT with
blocking-vs-later, then reconcile disagreements by naming the *design principle* each side
rests on, never by majority vote or deference to the founder's own ask — and log refusals
explicitly, since a refusal with its reasoning attached outlives a silent compliance. Reserve
the panel for pervasive changes; let simple, measurable fixes skip the ceremony. And never let
a synthetic walk stand in for the real device in the user's actual hands.

## 4 · Slide candidates

- **Panel roster + verdict table** — four persona/critic briefs (who, device, job) beside the
  P0 verdict table (seat · median s/task · before → after · blocking → later), source
  `p0-panel-verdict.md`.
- **Literal ask vs. what we built** — a 4–5-row excerpt of the §4 table from
  `final-critique-and-plan.md` (ask → accepted/reshaped/declined + reason).
- **The gate's blind spot** — timeline: 09-13 21:50 panel says Dez DONE at 8s → 09-14 09:40
  founder's iPhone says "pretty much unusable" → rule "blank canvas rethink." Source
  `p1-panel-verdict.md` + `2026-09-15-labeler-bug-ledger.md`.

## 5 · Open questions for Gerald

- Is panel seconds-per-task ever checked against a live stopwatch on your own sessions, or
  only itself before/after? (P1 cites your live "~30 tasks in 15 min" once — logged elsewhere?)
- 09-21's finish-selector panel used a different roster than the labeler panel. Rule for
  retiring vs. reusing personas across features, or is re-briefing per-feature intended?
- The panel gates the *build*; B19 (09-14) shows a second, unavoidable gate — your own device,
  your own hands. Worth formalizing a "real-hardware check before DONE ships" step?
