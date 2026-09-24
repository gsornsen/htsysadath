# Tracking — live status board

Update before ending any turn. One row per lane. Status ∈ planned · running · review · merged ·
blocked · dropped. Newest changes at the top of the changelog.

## Lanes

| Lane | Branch | Status | Owner (model) | Last sha | Next |
|---|---|---|---|---|---|
| Scaffold | main | merged | Fable | beb5177 | pushed to github.com/gsornsen/htsysadath |
| Transcript inventory | mine/inventory | planned | Haiku | — | run `scripts/inventory-transcripts.py`, commit `mining/timeline/sessions.md` |
| Mine: experiments (arc A) | mine/experiments | planned | Sonnet → Opus review | — | prompts/02 |
| Mine: pivots (arc B) | mine/pivots | planned | Sonnet → Opus review | — | prompts/02 + prompts/03 |
| Mine: personas (arc C) | mine/personas | planned | Sonnet | — | prompts/02 |
| Mine: coordinator pattern (arc E) | mine/coordinator | planned | Sonnet | — | prompts/01 + this repo's log |
| Interview Gerald (arc D) | — | done (Q1 deferred) | Gerald | — | answers in decisions.md D4 |
| Outline v1 | talk/outline | planned | Opus | — | after any two arcs land |
| Rough abstract | main | blocked on Gerald | Gerald | — | talk/abstract-rough.md has the criteria |
| Audience drafts of the abstract | draft/* | blocked (needs rough abstract) | Sonnet ×4 | — | prompts/04 part 2 |

## Changelog

- 2026-09-24 07:4x PDT — public remote created (gh) + pushed; interview answers → D4; Opus 5.5 routing with Opus 5 fallback; abstract placeholder + criteria. Open: live-vs-recorded demo; spine arc if halved.

- 2026-09-24 07:2x PDT — repo initialised; scaffold written (README, CLAUDE.md, brief, sequencing,
  tracking, decisions, lessons, hygiene, sources, coordinator, personas, prompts 00–04, outline,
  inventory script). Nothing mined yet.
