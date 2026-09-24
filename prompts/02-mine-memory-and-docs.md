# Lane body — mine project memory, experiment docs, plan docs, design docs

**Model:** Sonnet; Opus reviews. **Branches:** `mine/experiments` (arc A), `mine/pivots` (arc B,
pair with prompts/03), `mine/personas` (arc C), `mine/coordinator` (arc E), `mine/labeling` (arc F).
**Outputs:** `mining/arcs/<arc>.md` + supporting index tables in `mining/findings/`.

## Sources (read these; they are small enough)
- Memory: `~/.claude/projects/-Users-geraldsornsen-git-grAIde/memory/` (223 files). Start with
  `MEMORY.md`, then `~/git/grAIde-main/docs/memory-map.md` (grouped index). Each memory file has
  frontmatter (`type`, `description`, `modified`) and usually **Why** / **How to apply** lines —
  those ARE the lessons. Cite by file name.
- Experiments: `~/git/grAIde-main/docs/experiments/` (229 entries). Build
  `mining/findings/experiments-index.md`: E-id · date · question · discriminating test · result ·
  decision it drove · what was explicitly NOT pursued. Arc A's narrative comes from this table.
- Plans: `~/git/grAIde-main/docs/plan/` (84). The dated handoff / "RESUME HERE" / assessment docs
  mark pivots. Build `mining/findings/pivots-timeline.md`: date · from → to · trigger · who decided
  · scope/timeline conversation held (yes/no/how).
- Design: `~/git/grAIde-main/docs/design/` (19) + memories tagged design/panel/persona → arc C.
- Arc F (agents as labelers): `docs/experiments/EXP-E28a-adversarial-agent-labeling-2026-09-06.md`,
  `EXP-E84-agent-tools-pilot-2026-09-09.md` (+ folders `e28a/`, `e84/`), plan specs
  `docs/plan/2026-09-06-labeling-feature-spec.md`, `2026-09-08-labeling-start-here.md`,
  `2026-09-09-agent-tools-labeler-pilot-spec.md`, memories `labeling-program-design-2026-09-09`,
  `model-words-not-model-ids`, `founder-wont-hunt-ids-on-poor-crops`. Extract: per-agent exact-id
  rate, verdict accuracy, abstentions, $/task, tool calls, wall time; agreement vs dissent between
  paired agents; what stayed human (verdict of record). Gerald's number to VERIFY: ~3 min/label by
  hand → ~10 s with agents. Find where 3 min and 10 s come from (a plan doc, a transcript, a
  ledger) or report "not found" — the talk quotes only what is sourced.

## Per-arc deliverable (`mining/arcs/<arc>.md`, ≤ 1,200 words)
1. The arc in one paragraph.
2. 3–6 pivotal moments, each: date · the fork · what was explored (and what was NOT) · the
   decision · the evidence · the cost/benefit seen later. Provenance on every moment.
3. The transferable move (what a colleague can do next week), one paragraph.
4. Slide candidates: 3 bullets, each with the artifact that could be shown (a table, a merge
   body, a chart, a screenshot — describe, do not embed).
5. Open questions for Gerald.

## Hygiene
Public repo. Paraphrase. No emails, hosts, key paths, credit balances, labeler names. Product
ids and prices only as illustrative single examples if needed; never bulk.

## Done means
Every moment has provenance; the reviewer spot-checks 3 and finds them. Commit on the branch.
Report ≤ 30 lines.
