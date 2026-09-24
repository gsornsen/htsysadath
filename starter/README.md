# Starter kit: scale yourself with two practices

This is a self-contained copy of two practices from the talk "How to scale yourself and do
all the things" — nothing here depends on the rest of this repo. Copy the `starter/`
directory anywhere and use it on your own work.

## The talk's two actions, and where to start

1. **Run your next fork as gated experiments that can run unattended.** Start with
   [`two-lanes/checklist.md`](two-lanes/checklist.md) (a first, watched run), then
   [`two-lanes/unattended.md`](two-lanes/unattended.md) for what makes it safe to leave
   running while you sleep: the pass/fail bar, flags, per-run caps, a named end time, and a
   morning-report template.
2. **Put a persona review gate in front of "done" for UI and design work.** Start with
   [`persona-gate/README.md`](persona-gate/README.md): 3–5 personas with a job (not a
   feature list), a panel that walks the built thing and returns DONE/NOT with a blocking
   reason and seconds-per-task, and a real-device check before you actually call it done.

## Prerequisites

- The [Claude Code CLI](https://claude.com/claude-code) installed and signed in (`claude`
  works from your terminal without further login).
- `git`, including `git worktree` (ships with any recent git).
- A `bash`-compatible shell for `persona-drafts/fanout` (extras, below).

## Practice 1: two gated lanes

1. Read [`two-lanes/checklist.md`](two-lanes/checklist.md) — a 5-step first run, plus the
   ten rules worth knowing before you start (commit early, verify cleanup claims, etc — each
   one cost someone real time to learn).
2. Copy [`two-lanes/lane-brief.md`](two-lanes/lane-brief.md) once per lane and fill it in.
3. Run the checklist.
4. Ready to leave a lane (or a queue of lanes) running unattended? Read
   [`two-lanes/unattended.md`](two-lanes/unattended.md) first — it adds the flag, cap, time
   window and morning-report rules that a watched run doesn't need.

## Practice 2: persona review gate

1. Read [`persona-gate/README.md`](persona-gate/README.md) — the method in one page: write
   3–5 personas with a job, run them against the BUILT thing, collect a DONE/NOT verdict with
   a blocking reason and seconds-per-task, and always finish with a real-device check.
2. Copy [`persona-gate/panel-brief.md`](persona-gate/panel-brief.md) once per persona and
   fill it in.
3. Use [`persona-gate/verdict.md`](persona-gate/verdict.md) for the verdict table format and
   the panel prompt to hand each reviewer.

## Terms, defined once

- **Lane** — one task, running on its own branch and in its own `git worktree`, so it can
  work concurrently with other lanes without colliding.
- **Worktree** — a second working directory checked out from the same git repo
  (`git worktree add <path> -b <branch>`), so two lanes can each have files on disk at the
  same time without stepping on each other.
- **Gate** — the single, pass/fail result you write down *before* running a lane, that
  decides whether it succeeded — not a vibe check after the fact.
- **Reviewer one tier up** — whoever reviews a lane's output is a stronger model than
  whoever produced it, and states plainly what it checked (a count, a re-run command, a
  spot-check) rather than saying "looks good."
- **Flag** — a switch that turns new behaviour on or off without a new deploy; default it on
  in dev and off in production, and have a human (not a lane) flip the production flag.

## Extras

- **`persona-drafts/`** — a related but different practice: turn one rough draft into several
  audience-tailored drafts in parallel, then hand-pick a hybrid. Good for anything one person
  writes that several kinds of readers need to understand (a proposal, a doc, an
  announcement) — not a substitute for `persona-gate/`, which reviews a built UI instead of a
  document.
  1. Write (or grab) a rough draft as a `.md` file.
  2. Run `starter/persona-drafts/fanout <draft.md>`. It reads every persona brief in
     `starter/persona-drafts/personas/` (four are included: engineer, pm, designer, exec) and
     starts one background `claude -p` run per persona, writing `out/<persona>.md` and
     `out/<persona>.status`. It prints one line and returns immediately — the lanes keep
     running after the command exits.
  3. Poll `out/*.status` (`state=queued|running|done|failed`) until all four say `done`.
  4. Read the four drafts side by side and build a hybrid — see
     [`persona-drafts/hybrid.md`](persona-drafts/hybrid.md) for the rule (tl;dr frame on top,
     drill-down beneath) and a 6-line log template to record what you took from where.

  Edit or replace the persona briefs in `persona-drafts/personas/` for your own audiences —
  they're plain text, one file per audience. See
  [`persona-drafts/README.md`](persona-drafts/README.md) for the dry-run timing from building
  this kit.
