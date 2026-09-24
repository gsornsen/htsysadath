# Dry run — 2026-09-24, demo/fanout

One run of `demo/fanout` against the real `talk/abstract-rough.md` (383 words), all four
lanes launched at the same instant (16:57:19Z), model `sonnet`. No lane failed; no lane's
`.err` file has any content.

| Persona | Start (UTC) | End (UTC) | Wall time |
|---|---|---|---|
| engineer | 16:57:19Z | 16:57:39Z | 20 s |
| exec     | 16:57:19Z | 16:58:09Z | 50 s |
| pm       | 16:57:19Z | 16:58:14Z | 55 s |
| designer | 16:57:19Z | 16:58:36Z | 77 s |

p50 (median of the 4): **52.5 s**. Max: **77 s**.

All four lanes finish well inside the ~4-minute gap between the slide-4 kickoff and the
slide-15 reveal (talk/plan/presentation-plan.md #4, #15) — no lane needs the 15-second
on-stage wait rule invoked, and per D10 the fallback is Gerald's own video, not this
labelled-rehearsal output. Kept here as arc D material (n=1; five-run rehearsal with p50/max
is still owed per talk/plan/02-live-demos.md pre-flight — see demo/README.md).

Provenance: this repo, branch `build/demo`, dry run at 2026-09-24 ~16:57–16:58 UTC (~09:57
PDT). Source status files: `demo/out/*.status` at run time (git-ignored, not committed).
