# Lessons learned — about building THIS talk with agents

Two kinds of entries. (1) Lessons from the Grailith build that belong IN the talk (tag `[talk]`).
(2) Lessons from building this repo with agents (tag `[method]`). Add as they happen; date every
entry; link the finding or commit that proves it.

## Seed entries (from the Grailith build; verify against sources before quoting)

- `[talk]` The reviewer finding the same shape three times is the signal to stop point-fixing and
  fix the class by construction (one door). — memory `class-sweep-over-point-fix`.
- `[talk]` A "clean" result needs a positive count, never an eyeballed absence. — memory
  `verification-hygiene-in-swarms`.
- `[talk]` A usage limit terminates every sub-agent with uncommitted work; brief lanes to commit in
  chunks. — memory `limit-kills-lanes-commit-early`.
- `[talk]` Don't root-cause from proxy data when telemetry is missing; it pollutes the team's model
  of the problem. — memory `dont-solution-from-thin-data`.
- `[talk]` The persona panel is the done gate; the designer translates literal asks into jobs and
  may decline them. — memories `design-panel-is-the-done-gate`, `design-translates-feedback`.
- `[talk]` 2026-09-21: a viewport fix went through three review rounds — the first clamped the
  value to zero (a no-op for the reported case), the second applied both signs (would have moved
  bars over the keyboard). Reading the fix against BOTH the reported screenshot and the adjacent
  case is what caught it. Good "reviewer one tier above" example.

## Method entries (this repo)

- `[method]` 2026-09-24: scaffold first, mine second. The inventory script exists so the first
  agent lane does not try to read 1.25 GB.

- `[method]` 2026-09-24: **a lane's self-reported hygiene check is not a hygiene check.** The
  inventory lane (Haiku) ran the required grep, saw hits, reasoned that they were "old removed
  lines," reported CLEAN — and committed a file whose very first line was an absolute home path.
  The grep was right and the interpretation was wrong. Two fixes, both structural rather than
  exhortative: the brief must name *what* the grep may legitimately hit (a `-` line in a diff)
  versus what it may not (any `+` line), and the coordinator re-runs the check on the merge diff
  instead of reading the lane's verdict. Verified at merge 105d837; root cause fixed in
  scripts/inventory-transcripts.py at 7fae46f.

- `[method]` 2026-09-24: **the redaction step must come before the first commit, not after it.**
  The brief told the lane to commit the raw inventory immediately ("a crash must not lose this")
  and redact in a second commit. That is correct for crash-safety and wrong for a public repo:
  the raw blob stays in history, and `git log -p` outlives the redaction. The lane did exactly as
  briefed; the brief was the bug. Fixed by rebuilding the branch as one clean commit before
  merging. Crash-safety on unpublished material belongs in the scratchpad, not in a commit.

- `[method]` 2026-09-24: **the lanes that reported what they could NOT find were the most useful.**
  Arc E refused to ground "analysis paralysis dressed as rigor" and said so, and declined to read
  an absence of evidence about coordination overhead as a clean bill of health. Arc C flagged that
  its one failure case was "the panel missed it," not "the panel certified something broken," and
  said the distinction matters for the talk. Arc A separated a factual dispute from a framing
  dispute instead of picking a winner. Briefs should ask for the not-found list explicitly — it is
  where the honest talk material is.

- `[method]` 2026-09-24: **six parallel lanes need six worktrees.** Branch-per-lane in one working
  tree cannot work when the lanes run concurrently. Isolated worktrees held; the only collision was
  two lanes creating `mining/findings/cross-arc.md` from the same base, which conflicted add/add at
  merge. An append-only shared file wants to exist on trunk BEFORE the lanes branch.
