# Tracking — live status board

Update before ending any turn. One row per lane. Status ∈ planned · running · review · merged ·
blocked · dropped. Newest changes at the top of the changelog.

## Lanes

| Lane | Branch | Status | Owner (model) | Last sha | Next |
|---|---|---|---|---|---|
| Scaffold | main | merged | Fable | beb5177 | pushed to github.com/gsornsen/htsysadath |
| Transcript inventory | mine/inventory | running | Haiku | — | run `scripts/inventory-transcripts.py`, commit `mining/timeline/sessions.md` |
| Mine: experiments (arc A) | mine/experiments | running | Sonnet → Opus review | — | prompts/02 |
| Mine: pivots (arc B) | mine/pivots | running | Sonnet (extract+narrate) → Opus review | — | prompts/02 + prompts/03 |
| Mine: personas (arc C) | mine/personas | running | Sonnet | — | prompts/02 |
| Mine: coordinator pattern (arc E) | mine/coordinator | running | Sonnet | — | prompts/01 + this repo's log |
| Mine: agent labeling (arc F) | mine/labeling | running | Sonnet → Opus review | — | prompts/02 §arc F |
| Interview Gerald (arc D) | — | done (Q1 deferred) | Gerald | — | answers in decisions.md D4 |
| Outline v1 | talk/outline | planned | Opus | — | after any two arcs land |
| Rough abstract | main | blocked on Gerald | Gerald | — | talk/abstract-rough.md has the criteria |
| Audience drafts of the abstract | draft/* | blocked (needs rough abstract) | Sonnet ×4 | — | prompts/04 part 2 |

## Changelog

- 2026-09-24 08:0x PDT — **Opus tier probed: this client serves `claude-opus-5[1m]` (Opus 5, 1M
  context). Opus 5.5 is NOT available here, so the documented fallback applies and every
  Opus-tier lane in Phase 1 runs on Opus 5.** Gerald is updating the client; the Opus review
  pass on arcs A/B/F is deliberately held until after that restart so it can run on 5.5.
  Phase 1 spawned as 6 parallel lanes, each in its own git worktree under `.claude/worktrees/`
  (now git-ignored) so branches cannot collide in one working tree. Lane 3 (arc B) runs the
  prompts/03 Haiku extraction and the Sonnet narration in ONE Sonnet lane, because lanes are
  forbidden to spawn sub-agents.

- 2026-09-24 08:0x PDT — arc F (agents as labelers, 3 min → ~10 s [verify]) added to brief/sequencing/tracking/prompts/outline; D4 corrected (the counter-intuitive call was index dedup / cross-language art, not the JA index); prompts/05 phase-1 kickoff written.

- 2026-09-24 07:4x PDT — public remote created (gh) + pushed; interview answers → D4; Opus 5.5 routing with Opus 5 fallback; abstract placeholder + criteria. Open: live-vs-recorded demo; spine arc if halved.

- 2026-09-24 07:2x PDT — repo initialised; scaffold written (README, CLAUDE.md, brief, sequencing,
  tracking, decisions, lessons, hygiene, sources, coordinator, personas, prompts 00–04, outline,
  inventory script). Nothing mined yet.
