# Plan 02 · Live demos

Lane `plan/live-demos` · Opus 5.5 · 2026-09-24 09:1x PDT. Planning only; nothing was run.

## Candidates

| | Proves | Cost | Main risk | Call |
|---|---|---|---|---|
| (a) Persona fan-out of the abstract | drafts are cheap; choosing is the skill | 4.5 min | latency, odd text | **Live, start early** |
| (b) Toy coordinator swarm | lanes, commits, board | 5+ min | waiting | **Fold into (a)** as four committing lanes |
| (b) Replay this repo's history | pattern at scale; record corrects memory | 3 min | none (offline) | **Live, local** |
| (c) Labeler / dissent board / Storybook | DONE/NOT gate | 3 min | real cards, seller data, private hosts | **Stills + timeline** |
| (d) Live-stream scout | detect/identify | 2 min | network, 6–15 s identify, third-party sellers | **Recorded clip**, blurred |
| (e) Ask the repo, get cited answer | provenance makes the record queryable | 1.5 min | unscripted answer | **Q&A reserve** |

(c) fails hygiene first (`docs/project/public-repo-hygiene.md`). Its best material is the gate
*failing*: Dez DONE at 8 s on 09-13, then "pretty much unusable" on the founder's iPhone on 09-14
(`mining/arcs/C-personas-review.md` §2). That belongs on a timeline slide.

## Recommended: two live demos, one reserve (about 7.5 of 35 min)

### Demo 1 · "Four writers, started at minute 3" (0.5 + 4 min)

**Where.** The kickoff is on "What changed" (outline §3, about slide 4). The reveal is in the personas
section (§6, about slide 14, around minute 20).

**Setup.** A fresh clone of the public repo at tag `talk-demo`, in a neutral path with prompt `$ `.
One script, `demo/fanout`, runs the four lanes from `prompts/04-audience-drafts.md` Part 2 (exec,
engineer, designer, PM; ≤ 200 words; briefs from `docs/agents/personas.md` §2). Each lane commits to
its own `draft/*` branch and updates a tracking row. Model and budget are pinned. The input is
Gerald's real rough abstract (`talk/abstract-rough.md`, not yet written). The roughness is the point.

**On stage.**
1. "I'm starting four writers now." Terminal, `demo/fanout`, four lane lines appear. Back to the
   slides. About 30 s total, with no waiting.
2. At the reveal slide, switch to the viewer: the rough draft plus four columns.
3. Pick a hybrid in 2 min using Gerald's own rule (D4, `docs/project/decisions.md`): the tl;dr frame
   from one draft, the drill-down order from another, and one cut, each said aloud. Optional: a
   show of hands between two frames.
4. "The real pass takes about 10 minutes; this is the 2-minute cut." Press the back-to-slides key.
   The next slide is "What I took from each."

**Rule.** Never wait more than 15 s on stage. For a lane that hasn't finished, show its rehearsal
output labelled "this morning's run" and revisit in Q&A.

### Demo 2 · "The record, replayed" (3 min, offline)

**Where.** The arc E section (§8, about slide 19), just before the "remembered vs recorded" slide.

**Show.** `git log --graph` of this repo: 42 commits, 07:29–09:03 on 09-24 at time of writing (quote the
real count on the day). Three stops, each an alias or a viz bookmark:
1. Six mining lanes fanning out and merging `--no-ff` with bodies that say what was learned (`3de113f`).
2. **D6 drops the 3-min baseline (`767b0c4`, 08:22), then D7 reverses it seven minutes later
   (`7fefd2f`, 08:29)** after asking the one person who was there. The log keeps both.
3. Review merges `a0641ea`, `6b0d9b9`, `1f3a3f7`: the reviewer sits one tier above
   (`mining/arcs/E-coordinator.md` M2).

No network, model or credentials. Use aliases, not typing.

### Reserve · "Ask the repo" (1.5 min, Q&A only)

A headless query against the demo clone: "Where does the ~3 min per label figure come from, and how
sure are we?" The expected answer cites D6/D7 and the corpus gap. Fallback: the rehearsal answer on a slide.

## Pre-flight (T–60, again at T–10)

- **Browser/terminal.** A "Talk" Chrome profile: signed out, no extensions or bookmarks bar, autofill off.
  Terminal at 28 pt, high contrast. Neither the prompt nor the status line shows a username, home
  path, email or plan.
- **Quiet.** Focus mode on. Quit Slack, Mail, Messages and sync clients. Hide the Dock. Phone silent.
- **Display.** Test the projector at 1920×1080 and 1280×720. Zoom until a 200-word column reads from the
  back row (start at 150 %). Agree extended vs mirrored with the runtime lane.
- **Auth/limits.** Pre-authenticated. The key comes from the environment and is never echoed. Check
  usage headroom on the day: arc E M5 is a lane killed by a usage limit, which must not happen on
  stage. Prefer a metered key with a hard cap over a plan with a fixed reset.
- **Rehearsal.** Run Demo 1 five times. Log p50/max wall time per lane and read every output. Keep the
  best morning run in `demo/rehearsal/` as the labelled fallback.
- **Hosts/ports, nothing else.** Marp `localhost:8080`, viewer `localhost:8090`, outbound model API.
  No devbox, no tailnet names, no Grailith.
- **Network.** Venue wifi tested; phone tether as backup.

## Fallback ladder

Live → finished lanes plus labelled rehearsal output → static slide of the four drafts → skip,
and say so. **Never a pre-baked result "revealed as if live."** The spine is that the record beats the
tidy memory (D5–D7, `mining/findings/cross-arc.md` instances 4–5). A caught fake sinks it.

## Needs from other lanes

- **Runtime (1):** a one-key switch slides ⇄ terminal/viewer that keeps the deck position; demo slides
  titled like their demo so the return is seamless; confirm the ports or propose yours; iframe vs
  app switch.
- **Assets (3):** arc C P0 vs P1 Storybook stills at phone width plus the 09-14 iPhone failure; a
  20–30 s scout clip with sellers and chat blurred; the static "rehearsal drafts" slide.
- **Viz (4):** a four-column fan-out viewer (polls lane files, shows a status and elapsed-time chip per
  lane); optionally a stepped graph replay with the three stops.

## Questions for Gerald

1. Write `talk/abstract-rough.md`. Demo 1 is blocked on it.
2. Is a labelled rehearsal output an acceptable fallback, or cut the demo instead?
3. Keep Demo 2 live, or put the log on a slide?
4. Whose laptop? What display, adapter, venue wifi?
5. Stage billing: capped API key or subscription?
6. Audience vote on the hybrid?

## Convergence (round 2)

2026-09-24 09:3x PDT, after plans 01, 03, 04 and D9.

**Agree.** 01: server mode on 8080, link-out not iframe, URL hash to return to the slide, and a
fallback MP4/GIF per demo in `talk/slides/assets/demos/`. 03: Storybook fixtures only, no live
scout. 04: the git graph must be curated.

**Conflicts, with proposed resolutions.**
- *Port.* 01's example uses `4321`. Keep the viewer on `localhost:8090`, served from the demo
  clone and opened in its own tab beforehand. 01 owns the port list.
- *Viewer owner.* 04 is static SVG with no client JS, so **the demos lane builds the viewer**.
  04 supplies palette and type, and 01 the link-out slide.
- *Unlisted assets.* The scout clip clashes with 03's no-scout rule, so I drop it (arc B is
  re-cut per D9 anyway). The fallback MP4s and the rehearsal-drafts slide come from my
  rehearsals. The arc C stills are already on 03's list.
- *Git graph three ways.* 04 #6 is the slide and Demo 2's fallback. The live terminal runs
  `git log --graph --oneline main`, never `--all`, which keeps `worktree-agent-*` branches off
  screen. 03 drops `e-branch-graph.svg`.

**Accepted dependencies.** From 01: the link-out pattern, the hash jump, and the PDF deck. From
04: palette, type and #6. From 03: the arc C stills.

**Changes.**
- Demo 2's second stop now shows corrections in both directions: D6 → D7 (`767b0c4` 08:22 →
  `7fefd2f` 08:29) and D5 → D9 (`b1d7e8f` 08:19 → `7607585` 09:27). Both times the record was
  over-read, and both times the person who was there corrected it. With 04 #5, the spine
  becomes "keep both, check both ways."
- The count is 59 commits now. Quote the count on the day.
