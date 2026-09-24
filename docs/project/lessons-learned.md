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

- `[method]` 2026-09-24: **"not in the corpus" is not "not sourced", so ask the witness before
  ruling.** D6 dropped Gerald's 3-min/label baseline because no mined file contained it; he had
  timed it himself, and the message sat on an account this laptop never saw (D7). The lane was
  right to report NOT FOUND. The coordinator's error was upgrading that into a DECISION without
  a one-line question to the person who was there. Rule: a NOT FOUND on a founder claim goes to
  the open-questions list, never straight into decisions.md.

- `[method]` 2026-09-24: **the Opus 5.5 reviewers overturned the Sonnet lanes on the details the
  talk would have quoted**: the SPADE ordering (after the build, not before), the 800-task run
  (760), "0/13 OCR viable" (not in the doc), the E79 winning crop (padded, not tight), "all
  pre-registered" (83 of 151). Every Sonnet claim the coordinator had spot-checked held; the
  errors sat in the claims nobody had re-opened. Reviewing one tier up earned its cost, and
  3 spot-checks per arc isn't enough coverage for a number that goes on a slide.
- `[method]` 2026-09-24: a gate chained with `;` is not a gate. The coordinator ran a hygiene grep
  and a merge in one command joined by `;`, so the merge ran before the grep's 15 hits were read.
  They turned out to be `@1`/`@3` metric names, not handles, and nothing was pushed. Chain gates
  with `&&`, and make the grep exit non-zero on a hit.

- `[method]` 2026-09-24: **a lane's "I cleaned up" is a claim like any other, and so is the
  coordinator's.** The visual-assets lane reported its Storybook stopped; it was still listening
  on :6009 from the Grailith trunk checkout. The coordinator verified and stopped it by exact
  pid. Ten minutes later the coordinator itself left a Marp test server running, then "fixed" it
  by killing the process group holding the port without checking whose it was. That was a
  second lane's Python preview server, sharing the port. Harmless this time, but it's exactly
  the rule Grailith wrote down on 09-13 (`devbox-shell-gotchas`: kill the port holder's group),
  minus the part that matters: confirm the holder is yours (command line, cwd, start time)
  before signalling it. Rules: lanes pick ports above 9000 and name them in their report; every
  cleanup claim gets a `lsof` check; never signal a pid you didn't record starting.
- `[method]` 2026-09-24: the hygiene grep's `sk-` term matches "task-", so lanes learned to wave
  its hits through as false positives, which is how a real hit gets waved through too. Narrowed to
  `sk-[A-Za-z0-9_-]{20,}` in public-repo-hygiene.md so a hit means something again.

- `[method]` 2026-09-24: **an ownership contract has to fix NAMES, not just paths.** The build
  swarm's contract gave each lane disjoint directories and one owner for `deck.md`, so nothing
  conflicted in git. But L1 invented chart filenames for its image references, and L2 got a
  different list from the coordinator. The merge was clean; the integration broke. A parallel
  contract needs the shared identifiers (filenames, ids, ports) written into every brief from
  one list, not just the directory split.

- `[method]` 2026-09-24: **marp-cli reads stdin whenever stdin isn't a TTY**, so any build that
  runs from a script, CI or a backgrounded shell hangs forever on an open pipe. The coordinator
  lost ~3 minutes to it and left two hung marp processes behind: the chain's build, then its pdf
  step once the build was killed. Found by `ps` and stopped by pid. Fix: `--no-stdin` on every
  non-interactive marp call (da1f055). Meta-lesson, second time today: when a coordinator command
  times out into the background, the NEXT command must be a `ps` for its children, not a retry.

- `[method]` 2026-09-24: **a lane printed the shell environment.** L3 ran a bare `env` while
  exploring, which dumped personal API tokens into its own tool output: the session transcript,
  and the model's context. Nothing reached a file or the repo (coordinator token-shape scan of
  every added line plus `strings` over every PNG: clean). New brief rule: never print the
  environment or any credential file; read single variables by name (`printenv PORT`) and never
  echo a secret. The repo hygiene grep can't catch this, because it never touches a commit.
- `[method]` 2026-09-24: a `git push` that times out into the background sits on stdin like marp
  did. Run pushes as `GIT_TERMINAL_PROMPT=0 git push … < /dev/null`; the stalled push finished in
  3 s that way.
- `[method]` 2026-09-24: **the chart review caught content errors that no numeric check would.**
  All the numbers in `remembered-vs-recorded` were real, but two rows told the wrong story: E79's
  original result shown as the thing that failed, and D4 framed as a wrong memory when D4 found a
  framing difference. A chart about "the record corrects memory" can misquote the record too. The
  reviewer has to read the sentence, not just re-derive the digits.

- `[method]` 2026-09-24: **before counting a replay against a result, check that it compared the
  same two arms.** E79 was single crop vs the 5-crop vote; the 09-13 "replay" was single crop vs
  single crop (padding only). Two lanes and the coordinator (who approved the chart row) accepted it
  as a failed replication, because the numbers were real and the doc was right there. Third time
  today the record was over-read and the founder was right (D7, D9, D12). This one survived a
  numeric review because the numbers were accurate; only the arms were wrong.

- `[method]` 2026-09-24 (L6 integrate, fe1c632): **`npm run build`/`pdf` succeeding proves nothing
  about layout — Marp clips overflow silently instead of shrinking or erroring.** A 3-line body
  paragraph plus a full-height chart pushed the chart's own bottom caption past the 720px canvas
  on 7 of 22 slides; both `build` and `pdf` exited 0. Only rendering every slide to PNG and
  looking (task step 5) caught it. Fix was two-part: shorten chart/shot-slide bodies to one line
  (the brief's own rule — "the chart carries the slide" — turned out to be the actual fix, not
  just a style preference), and cap `section img { max-height }` with a computed budget instead
  of a number that looked generous in isolation.
- `[method]` 2026-09-24 (L6 integrate): **consecutive Markdown images with no blank line between
  them collapse into one `<br>`-joined paragraph**, which silently breaks a CSS flex row of
  figures (they all become one flex *item*, so they stack instead of sitting side by side). The
  fix is a blank line between every image/`<img>` in the group, even inside a raw `<div>` block.
  Same session: a kramdown-style `{target="_blank"}` attribute after a Markdown link isn't
  supported by this Marp config — it renders as literal trailing text on the slide. Use a raw
  `<a href=... target=...>` tag instead (html: true is already on).

- `[method]` 2026-09-24: **a message to a lane that has finished resumes it.** The coordinator
  sent L6 a slide 20 correction, merged L6 itself when the lane seemed done, then applied the fix
  on main. The message then resumed L6, which re-did the same fix on its branch (162a761,
  ac709b9): duplicate work, older than main's, so left unmerged. Rule: once a lane has reported,
  either wait for its fix OR do it yourself. Pick one and tell the lane which.
