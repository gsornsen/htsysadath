# Cross-arc findings

One line per finding, with provenance. Append only — a lane that finds something
outside its own arc files it here instead of editing another arc's doc.

- 2026-09-13: opus-tier subagents pinned to Opus 4.6 (never the `opus` alias, which resolved to
  Opus 5) after Opus 5 lanes drifted from briefs — one applied a migration to the live database
  against explicit instructions, and long lanes ran 50+ minutes without committing. Relevant to
  arc B (pivots) as a model-choice pivot, and to arc A/F as a coordinator-vs-implementer failure
  mode. [src: opus-46-not-opus-5-for-agents.md · 2026-09-13]
- Reviewer-tier rule ("reviewer one tier above implementor": haiku→sonnet, sonnet→opus 4.6,
  opus→fable) that governs the design panel's own code-review gate is the same rule used for
  coordinator/agent routing generally — relevant to arc E (coordinator).
  [src: memory `two-agent-review-protocol` · 2026-08-30]
- The design panel's DONE/NOT-DONE mechanism (persona briefs + measurable critic lens, re-walking
  a *built* artifact) is structurally the same pattern arc F (agents-as-labelers) uses for agent
  verdict-of-record vs. human review — worth comparing gate designs across the two arcs.
  [src: memory `design-panel-is-the-done-gate` · 2026-09-13; arc C]
- Arc A (index/language): `docs/plan/2026-09-08-card-identification-problem-brief.md` §7/§9 gives a measured "artwork accuracy 64.8%" (E62) and a shadow-served "language head" re-rank moving print@1 64.7%→77.6% — this is the primary document for reconciling Gerald's "index composition / dedup / cross-language art" recollection (D4) against the record; it also directly evidences arc B's identify-speed pivot context (same brief's §5 "Speed work is parked" note). [src: mine/pivots lane, 2026-09-24]
- Arc A/B: the founder's accuracy bar in his own words is TOP-3, not top-1: "identification = right
  card in the TOP 3 per lot" (with "detection ≤ 1 s"), recorded as founder bars in a session brief.
  Arc A's print@1 framing should be re-cut to top-3. [src: session 403300ff · 2026-09-13 22:44]
- Arc B: probable source for the interview's "~5 identify calls per detect". Founder: detection is
  fine "now that we only need one good crop and identify is so fast with the new model and 5 crop
  proposer gone". The 5-crop proposer fired identify per proposal. [src: session 403300ff ·
  2026-09-11 23:14]
- Arc F: human admin review rate after the P0/P1 redesign: "~30+ label tasks as admin in like 10
  minutes", about 20 s/task. A second lever behind the 3-min drop besides agents. [src: session
  403300ff · 2026-09-14 05:02]
