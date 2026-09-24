# First two-lane run — a 5-step checklist

## The 5 steps

1. **Write the gate first.** Before either lane runs, write down the single result that
   decides success or failure (see `lane-brief.md` § "The gate"). Do this before you've seen
   any output — a gate written after the fact just ratifies your first impression.
2. **`git worktree add` two lanes.** Give each lane its own working directory and branch, off
   the same base:
   ```
   git worktree add ../lane-a -b lane-a/<slug>
   git worktree add ../lane-b -b lane-b/<slug>
   ```
   Concurrent lanes in one shared working tree collide; isolated worktrees don't.
3. **Launch each with its brief.** Fill out `lane-brief.md` once per lane (different `<name>`,
   `branch`, maybe different `model`) and hand each lane its own copy. Don't let one lane see
   the other's brief or output while it's running — that's not two independent lanes anymore.
4. **A stronger model reviews each, with a stated check.** The reviewer is one tier above the
   implementer (see `lane-brief.md` § "Reviewer one tier up"). The review names what it did:
   re-ran the gate's command, spot-checked N of M claims and which ones, diffed against the
   contract. "Looks good" is not a review.
5. **`merge --no-ff` with a body that says what was learned.** Even if you only merge one
   lane, write in the merge commit body what the losing lane got right or wrong and why you
   picked the winner — that's the part worth keeping.
   ```
   git merge --no-ff lane-a/<slug> -m "merge lane-a: <what was learned>"
   ```

## Rules that came from pain (keep)

1. **Commit early, on every lane.** A crash or a usage limit kills only uncommitted work —
   commit in small chunks as you go, not once at the end.
2. **A "cleaned up" claim is a claim, not a fact — verify it.** If a lane says it stopped a
   process or freed a port, check with `lsof` (or equivalent) before you believe it; don't
   signal a pid you didn't personally record starting.
3. **A message to a lane that has already reported "done" resumes it.** Once a lane has
   finished, either wait for a fix from that same lane or make the fix yourself — don't do
   both, or you'll get duplicate, diverging work.
4. **Before counting a "replication" as a failure or success, check it compared the same two
   arms.** A replay that changed more than one variable from the original isn't a replication
   of that original — re-read the setup, not just the numbers.
5. **Never print the environment.** No bare `env`, no dumping credential files. Read a single
   variable by name if you need it, and never echo a secret into a transcript or a commit.
6. **Non-interactive CLI calls need an explicit "don't read stdin" flag when scripted or
   backgrounded.** Some CLIs (e.g. `marp-cli`) read stdin by default whenever stdin isn't a
   TTY, and hang forever on an open pipe from a script or CI job. Pass the tool's no-stdin
   equivalent on every non-interactive call.
7. **Pick ports above 9000 and name them in your report.** Low, common ports collide with
   other tools and other lanes; naming the port you used makes cleanup verifiable by someone
   else.
8. **A lane's self-reported hygiene/gate check is not a check — re-run it yourself,** ideally
   on the merge diff rather than trusting the lane's read of its own grep output. The lane
   that says "these hits are fine" is often wrong about why.
9. **A gate chained with `;` is not a gate.** `command1 ; command2` runs command2 even if
   command1 failed. Chain with `&&` so a failing check actually stops the next step.
10. **One writer per file at a time; parallel lanes touch disjoint paths.** If two lanes might
    create or edit the same file, decide who owns it before they branch — not after they
    collide at merge.
