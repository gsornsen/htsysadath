# Lane brief — blank template

Copy this whole block once per lane, fill it in, and paste it to the agent (or terminal
session) running that lane. Two lanes running against a real gate, each on its own branch and
worktree, reviewed by a stronger model — is the whole practice. Fields below are explained in
comments; delete the comments once filled in.

```
LANE <name> · branch <lane-a|lane-b>/<slug> · model <tier>
# <name>: a short label for this lane (e.g. "A", "fix-retry", "alt-approach"). Used in commit
# prefixes and in your own notes — pick something you can tell apart from the other lane at a
# glance.
# branch: one branch per lane, off the same base. Generic names: lane-a/<slug>, lane-b/<slug>.
# Two lanes racing the same problem get lane-a/<slug> and lane-b/<slug> off the same base sha.
# model: which model tier runs this lane (e.g. haiku / sonnet / opus). Match the tier to the
# judgment the task needs, not to how big the task looks — see "reviewer one tier up" below.

GOAL: one sentence, naming the artifact this lane produces (a file path, a passing test, a
# One thing, stated as an outcome you can point at when it's done — not "investigate X" but
# "X passes with output at path/to/file".
merged PR, etc).

SOURCES: exact paths this lane should read; note anything it should NOT open (e.g. a huge
# Bound the lane's context on purpose. A lane that reads everything has no scope. If a file is
# large, say so explicitly ("do not open data.csv, it is 400MB — use the sample instead").
log or dataset — give it a size guard).

OUTPUT CONTRACT: file path(s), what sections/format they must have, max length if relevant.
# What "done" looks like, mechanically. If a reviewer can't check this without re-reading the
# whole lane's work, it isn't a contract yet.

DONE MEANS: a positive, checkable statement (e.g. "tests pass locally, N assertions added,
# Not "it works" or "looks good" — a fact someone else can re-verify: a count, a command that
# exits 0, a spot-check that names what it checked.
diff touches only path/to/dir").

COMMIT: small commits on the branch; message prefix `<name>:`; do NOT merge to the base
# Commit early and often — a crash or limit should never cost more than a few minutes of work.
# The lane does not merge itself; that's the reviewer's or coordinator's step, after review.
branch yourself.

REPORT: what you found, what you could not do, alternatives you considered, and the commit
# Keep it short (aim for under 30 lines). The report is what the reviewer reads first — make
# it something a stronger model can judge without re-doing your work.
sha(s).

Do not spawn sub-agents of your own. Do not end your turn waiting on anything — report and
stop.
```

## The gate

Before you launch either lane, write down **the gate**: the single result that decides
whether the lane succeeded, stated so plainly that reading its output answers yes/no. Example
gates: "the new test suite passes and covers the reported bug", "the two approaches produce
the same output on the sample input, and lane B is the one that also handles the edge case in
`sources.md` line 12". The gate is not "which one do I like better" — write it before you see
either lane's output, or you'll rationalize whichever one you saw first.

## Reviewer one tier up

Whoever reviews a lane's output should be a stronger model than whoever ran it (e.g. a
sonnet-tier lane gets reviewed by an opus-tier reviewer). The review is a positive statement of
what was checked — counts, a spot-check with the exact lines it verified, a re-run of the
gate's command — never "looks good" on its own.
