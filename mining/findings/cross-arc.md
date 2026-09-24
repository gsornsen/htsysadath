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
- Arc B/F: the labeling bottleneck moved from the model to the UX. On 09-09 the founder quit
  hand-labeling after 23 labels because of the interface, not the cards, and the fix that
  followed was design work (P0/P1), not model work. [src: memory labeler-ux-blockers-2026-09-09 ·
  2026-09-09 ~11:45 PDT; arc F review lane]
- Talk spine ("the remembered version is tidier than the record"), instances 4 and 5: the top-3
  bar is dated 09-11 in the docs (evening plan, E108), not 09-13; and E79's padded-crop win did not
  hold on replay (09-13 prod-readiness B1: top-1 25 vs 24 of 41, top-3 33 vs 33). [src: arc A and
  arc B Opus review lanes · 2026-09-24]
- Arc A/F: the auto-lock precision figures (E89: 0.90 / 0.92) are scored against mostly
  agent-agreed provisional truth, so they inherit arc F's labeling pipeline and its caveats.
  [src: arc A review lane; EXP-E85/E89 · 2026-09-10/11]
- Arc B pattern: build first, decide second. Scout Wave 1 shipped 17:50 on 08-18 and its SPADE
  was written at 22:44; the 08-19 lots roadmap and Art Binder show the same order. [src: 8eb911a86,
  e04b6433b; arc B review lane]
- Arc B/A: a proxy that did not survive live data. E109 lifted six-crop top-3 by 12.6 pts, and
  the live lot measure (E100b) moved 0. [src: arc A review lane · E109, E100b]
- Talk spine, instance 6: the lot-level top-3 "76.9%" (n=52, 09-13) was a small-sample high.
  The same code on all 87 truth lots gives 71.3% overall and 65.2% on non-locked lots; later days
  scored 11/15, 6/13, 5/7. [src: mining/findings/lot-top3-unlocked.md · 2026-09-24]
- Arc A: a gain measured at @1 roughly halves at @3 (language head +9.95 → +5.47 pts), because
  most @1 fixes were already rank 2–3. A metric choice can double or halve a headline.
  [src: mining/findings/E67-top3-replay.md · 2026-09-24]
