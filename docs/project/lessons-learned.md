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
