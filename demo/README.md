# Demo run-of-show

For Gerald, stage-side. Covers both live demos: Demo 1 (persona fan-out, slides 4 → 15) and
Demo 2 (the git log replayed, slide 19). Sources: `talk/plan/02-live-demos.md`,
`talk/plan/presentation-plan.md` §1/§2/§4, `docs/project/decisions.md` D10.

## Demo 1 — "Four writers, started at minute 3"

**What it proves.** Drafts are cheap; choosing the hybrid is the skill (D4's rule).

**The four personas, and why.** `docs/agents/personas.md` §2 defines exactly four audience
briefs: Executive, Engineer, Product designer, Product manager. D10 names the talk's audience
as Software Engineers, Product Managers, Product Designers — three of the four. The fan-out
uses all four rather than inventing a fifth (e.g. "skeptical senior eng," which has no brief
anywhere in the repo): Engineer, PM and Designer match the stated audience directly, and
Executive is the natural fourth — it is already fully specified, and it gives the on-stage
comparison a genuinely different frame (decision/risk/ask) instead of three columns that all
read as "how it works, retold."

**Commands.**
```
demo/fanout
```
Prints one line and returns in under a second. Auth is whatever `claude` is already logged in
as on this machine — the script never reads, passes or echoes a key.

At the reveal:
```
PORT=8090 node demo/viewer/server.mjs
```
Open `http://localhost:8090` in a pre-opened tab (localhost only; no external fetches). It
polls `demo/out/*.status` and `demo/out/*.md` every 1.5 s and shows the rough draft plus four
columns (name, status chip, elapsed time, rendered draft once done).

**Timing (dry run, 2026-09-24, n=1 — see `demo/rehearsal/2026-09-24-dry-run/TIMING.md`).**
All four lanes started together; model `sonnet`.

| Persona | Wall time |
|---|---|
| engineer | 20 s |
| exec | 50 s |
| pm | 55 s |
| designer | 77 s |

p50 ≈ 52.5 s, max 77 s — comfortably inside the ~4-minute gap between the slide-4 kickoff and
the slide-15 reveal. **Still owed before the talk:** the presentation-plan pre-flight asks for
five Demo-1 runs with p50/max read from all five, not one. Re-run `demo/fanout` four more
times before the real pre-flight and update this table.

**On stage (talk/plan/02-live-demos.md Demo 1).**
1. Slide 4: "I'm starting four writers now." Run `demo/fanout`, the one line prints, switch
   back to slides. ~30 s total, no waiting.
2. Slide 15: switch to the viewer tab. Walk the four columns.
3. Pick a hybrid in ~2 min using D4's rule: tl;dr frame from one draft, drill-down order from
   another, one cut, said aloud.
4. "The real pass takes about 10 minutes; this is the 2-minute cut." Return to slides.

**When to switch to the video (D10).** Gerald has his own ~2-minute recording of this demo.
The fallback ladder is simply: **live, or play the video** — there is no labelled-rehearsal
fallback anymore, and Demo 1 is not expected to stall. If it does stall or a lane is still
running past the 15 s rule at slide 15 for the columns you need, cut to the video rather than
wait on stage; do not present a finished lane's earlier output "as if live." The video stays
outside this public repo unless Gerald asks for it to be committed after a hygiene review.

## Demo 2 — "The record, replayed"

**What it proves.** The record beats the tidy memory (D5–D7), and the record can be
over-read too (D9) — check both directions.

**Setup.**
```
source demo/aliases.sh
```

**The three stops (slide 19), each one screen, offline, no network/model/credentials.**
```
demo2_stop1_fanout       # six mining lanes fan out and merge --no-ff (22 lines)
demo2_stop2_corrections  # D6 -> D7, and D5 -> D9, corrected both ways (23 lines)
demo2_stop3_review       # review merges, one tier above the implementer (15 lines)
```
Or run all three in order with `demo2_all`. Every command walks `main`'s ancestry only
(`git log --graph --oneline`, never `--all`) — no `worktree-agent-*` branches, no paths, no
usernames, no emails ever appear. Line counts above were measured on this dry run
(2026-09-24); re-check before the talk if `main` has moved, since new commits shift the
`-N` windows.

## Pre-flight (T–60, again at T–10)

Merged from `talk/plan/02-live-demos.md` and `talk/plan/presentation-plan.md` §4.

- [ ] "Talk" Chrome profile: signed out, no extensions, no bookmarks bar, no autofill.
- [ ] Terminal: 28 pt, high contrast, prompt `$ `. No username, path, email or plan visible.
- [ ] Focus mode on. Slack, Mail, Messages and sync clients quit. Dock hidden. Phone silent.
- [ ] Projector checked at 1920×1080 and 1280×720. A column readable from the back row
      (start zoom at 150%). Extended display; presenter popup tested on the stage machine.
- [ ] Ports free: **8080** (Marp) and **8090** (this viewer), plus the outbound model API.
      Nothing else — no Storybook, devbox, tailnet or Grailith checkout running.
- [ ] Deck and viewer tabs pre-opened. Terminal at the repo root, `demo/aliases.sh` sourced,
      Demo 2 dry-run already run once today.
- [ ] Pre-authenticated; `claude` login checked; key/session comes from the environment and
      is never echoed. Usage headroom checked — prefer a capped key over a plan with a fixed
      reset (arc E M5 is a lane a usage limit killed; must not happen on stage).
- [ ] Venue wifi tested; phone tether ready.
- [ ] Gerald's ~2-minute Demo 1 video open and ready to play, offline, full-screen capable.
- [ ] Two timed run-throughs, with the switches on slides 4, 15 and 19 practised.
- [ ] Fallback: live, or play the video (D10). Never a pre-baked result "revealed as if live."

## File map

```
demo/fanout            one command, starts the 4 persona lanes, returns immediately
demo/fanout.d/*.md     versioned persona prompt briefs (engineer, pm, designer, exec)
demo/viewer/           static page + server.mjs (zero deps), PORT default 8090, localhost only
demo/aliases.sh        the 3 Demo-2 stop functions, main-only, curated to fit one screen
demo/out/               fanout's run output — git-ignored, regenerated every run
demo/rehearsal/         dry-run outputs kept as arc D material, hygiene-checked before commit
```
