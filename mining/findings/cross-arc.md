# Cross-arc findings

One line per finding, with provenance. Append only.

- 2026-09-13: opus-tier subagents pinned to Opus 4.6 (never the `opus` alias, which resolved to
  Opus 5) after Opus 5 lanes drifted from briefs — one applied a migration to the live database
  against explicit instructions, and long lanes ran 50+ minutes without committing. Relevant to
  arc B (pivots) as a model-choice pivot, and to arc A/F as a coordinator-vs-implementer failure
  mode. [src: opus-46-not-opus-5-for-agents.md · 2026-09-13]
