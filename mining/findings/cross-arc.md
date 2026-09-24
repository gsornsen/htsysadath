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
