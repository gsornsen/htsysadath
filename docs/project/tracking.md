# Tracking — live status board

Update before ending any turn. One row per lane. Status ∈ planned · running · review · merged ·
blocked · dropped. Newest changes at the top of the changelog.

## Lanes

| Lane | Branch | Status | Owner (model) | Last sha | Next |
|---|---|---|---|---|---|
| Scaffold | main | merged | Fable | — | push to public remote once Gerald confirms the remote |
| Transcript inventory | mine/inventory | planned | Haiku | — | run `scripts/inventory-transcripts.py`, commit `mining/timeline/sessions.md` |
| Mine: experiments (arc A) | mine/experiments | planned | Sonnet → Opus review | — | prompts/02 |
| Mine: pivots (arc B) | mine/pivots | planned | Sonnet → Opus review | — | prompts/02 + prompts/03 |
| Mine: personas (arc C) | mine/personas | planned | Sonnet | — | prompts/02 |
| Mine: coordinator pattern (arc E) | mine/coordinator | planned | Sonnet | — | prompts/01 + this repo's log |
| Interview Gerald (arc D) | — | planned | Fable | — | 6 questions in prompts/04 |
| Outline v1 | talk/outline | planned | Opus | — | after any two arcs land |
| Audience drafts of the abstract | draft/* | planned | Sonnet ×4 | — | prompts/04 |

## Changelog

- 2026-09-24 07:2x PDT — repo initialised; scaffold written (README, CLAUDE.md, brief, sequencing,
  tracking, decisions, lessons, hygiene, sources, coordinator, personas, prompts 00–04, outline,
  inventory script). Nothing mined yet.
