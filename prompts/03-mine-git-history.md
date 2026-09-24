# Lane body — mine the Grailith git history for the pivot timeline and the method

**Model:** Haiku for extraction, Sonnet for the timeline narrative. **Branch:** `mine/git`.
**Output:** `mining/timeline/git-timeline.md`, `mining/findings/git-merge-bodies.md`.

Repo: `~/git/grAIde-main` (3,966 commits, first 2026-07-02). Read-only. Do not check out
branches; use `git log`/`git show` only.

## Extract (Haiku)
1. Weekly commit counts and the top 5 touched top-level paths per week:
   `git log --format=%ad --date=short | sort | uniq -c` grouped by ISO week;
   `git log --since=<wk> --until=<wk> --name-only --format= | cut -d/ -f1-2 | sort | uniq -c | sort -rn | head -5`.
2. All merge commits with subject + date: `git log --merges --format='%h %ad %s' --date=short`.
3. For merges whose body contains `gate:` or `Review` lines, capture the body:
   `git show -s --format=%B <sha>`. These show the merge-gate + reviewer-tier method in the wild.
4. First commit that mentions each of: `identify`, `lots`, `scout`, `whatnot`, `comps`,
   `pricing`, `labeler`, `persona`, `panel`, `experiment`, `deploy-prod` — gives the arc-B order.

## Narrate (Sonnet) — `mining/timeline/git-timeline.md`
A dated table of phases (pregrade identify → bulk/lots → live-stream scout → comps/pricing →
labeler/personas → trunk consolidation → mobile verification), each with: start/end week,
commit volume, the merge that opened it, the merge/plan doc that closed or paused it, and the
one-line "why the pivot" as the merge bodies/plan docs state it. Mark inferences as inferences.

## Hygiene
Commit subjects/bodies may contain hostnames, emails in `Co-Authored-By`, or key paths. Keep
shas, dates, subjects; strip the rest.

## Done means
The timeline table cites a sha per row; counts are reproducible by the listed commands.
