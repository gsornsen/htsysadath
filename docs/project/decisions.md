# Decisions log (ADR-lite)

One entry per decision that shapes the talk or the method. Newest at the bottom. Format:
`## D<n> · <date> · <title>` then Context / Decision / Alternatives not taken / Consequences.

## D1 · 2026-09-24 · Build the talk in a public git repo, method visible

**Context.** Gerald wants the audience to see how the talk was built with Claude Code, not only
the slides. **Decision.** Repo `htsysadath`, trunk `main`, branch-per-lane, `--no-ff` merges with
explanatory bodies; findings committed with provenance; raw material never committed.
**Alternatives.** Private repo + exported slides (loses the method); a single long doc (loses
the parallel-lane story). **Consequences.** Hygiene rules are mandatory from commit one.

## D2 · 2026-09-24 · Fable coordinates; smaller models do bounded work

**Context.** 1.25 GB of transcripts, 223 memory files, 229 experiment docs, 3,966 commits — far
beyond one context window. **Decision.** Fable writes briefs and judges; Haiku/Sonnet/Opus lanes
mine and draft; reviewer one tier above implementer. Full rules in docs/agents/coordinator.md.
**Alternatives.** One Opus session reading everything (context-bound, slow, no parallelism).
**Consequences.** Every lane needs a self-contained brief and a provenance contract.

## D3 · 2026-09-24 · Transcript mining is scripted first, read second

**Context.** Transcripts are too large to read. **Decision.** `scripts/inventory-transcripts.py`
produces a session index (id, dates, size, opening request); lanes read only the sessions the
index points at, by grep/slice, and record findings with line offsets. **Alternatives.** Random
sampling (misses the pivots). **Consequences.** The index is the first mining artifact.

## D4 · 2026-09-24 · Gerald's interview answers (prompts/04 part 1)

**Format.** 35 min live + 10 min Q&A. Live-vs-recorded for the arc D demo: not yet answered.
**Spine.** Not answered directly; the answers point at arc B's live-scout period as the richest
material, so the working spine stays B with A as the deep-dive (brief.md).
**Arc D (documents).** The hybrid is chosen for STRUCTURE: a tl;dr the busy reader finishes,
with drill-down levels for the curious and for people who need data/detail. Nothing has gone
wrong with the method; the failure it replaced was writing docs too long to be read, which
forced the meetings the doc was meant to replace. The full worked example (Q1) is deferred to a
later phase in case the other arcs fill the live slot.
**Arc B — the pivots that needed evidence in hand (live scout).** (1) Accuracy was stuck and
Japanese cards were scoring higher similarity than English ones on crops. The counter-intuitive
call was about the INDEX COMPOSITION: what to do with duplicated art, and art re-used across
prints in several languages (Gerald's clarification, 07:5x). Setting up the experiments to test
it simplified the system and cut training and maintenance — the single experiment that most
changed his mind, and the route to handling multiple languages from reference art. (2) Detection:
WHEN to run identify and when not to; identify was not fast enough end-to-end to win an auction
and the project was close to being parked. In hindsight the experiments that sped identify up
were less valuable than thinking earlier about moving cards — the team ended up not needing ~5
identify calls per detect.
**Verify during mining.** Memory `index-design-evidence-2026-09-19` records E67 (artwork-dedup
"loses 14–20 pts", "flat, no dedup" kept) and a language head as soft scope. Gerald remembers the
dedup/cross-language experiments as the simplifying win. The arc A lane reconciles from the E65/
E67 docs and transcripts: which arm was adopted, on what date, what was served — and whether
"simplified" refers to the index, the language handling, or the training/maintenance burden. The
reconciliation is talk material (memory vs record).
**Arc F added (07:5x).** Agent labeling with skills + different vision models took a label from
~3 minutes (human) to ~10 seconds `[verify]`. Sources: E28a adversarial agent labeling (09-06),
E84 agent-tools pilot (09-09: $/task, tool calls, wall time, agreement/dissent rates), plan specs
2026-09-06/08/09, memory `labeling-program-design-2026-09-09`, `model-words-not-model-ids`.
**Model routing.** Opus 5.5 (`claude-opus-5-5`) for Opus-tier lanes once the client is updated;
fall back to Opus 5 if 5.5 is unavailable. Gerald updates the client after this turn.
**Remote.** Public GitHub repo `gsornsen/htsysadath` created via gh; `origin` set.

## D5 · 2026-09-24 · Arc B is a concurrency story, not a four-act sequence

**Context.** brief.md framed arc B as four pivots in order: pregrade identify → bulk/lots →
live-stream scout → comps/pricing. The `mine/pivots` lane tested that against the Grailith git
log and it does not hold. The D1 comps store shipped 2026-07-04 (`8b009b9f9`) and
`packages/pricing` the same day (`e3772c771`) — day two of a repo whose first commit is
2026-07-02. Lots (08-19) and whatnot-scout (08-18, `e04b6433b`) launched one day apart and ran
concurrently through August. Coordinator re-derived all four dates from `git log` directly.

**Decision.** Keep the four pivots as the arc's beats, but stop presenting them as a sequence.
Arc B is retold as *parallel spines with pivotal decision moments on each*, which is in fact a
better fit for the talk's own thesis — the claim is that agentic tools let you run several
threads at once, and the record shows Gerald already was.

**Alternatives not taken.** (a) Keep the linear framing as "narrative compression" — rejected: the
talk's credibility rests on the record matching the story, and someone will read the public repo.
(b) Drop the ordering claim silently — rejected: the gap between the remembered tidy sequence and
the messy concurrent record is itself talk material, and it pairs with D4's memory-vs-frame
finding as a second instance of the same lesson.

**Consequences.** talk/outline.md needs arc B restructured before Phase 3. The "what the
retrospective tidies away" beat now has two independent examples (D4 framing, D5 ordering) and
may deserve its own slide. Open: the Art Binder detour (08-12 → 08-18) has no founder-quoted
scope conversation in the mined docs — an honest counter-example to the "every pivot was an
evidence conversation" claim, unresolved pending Gerald.

## D6 · 2026-09-24 · The "3 min → 10 s per label" claim is not sourced; the talk drops it

**Context.** brief.md and D4 both asserted that agent labeling took a label from ~3 minutes by
hand to ~10 seconds with a `[verify]` step. The `mine/labeling` lane was briefed to source or
refute it. Refuted, and the coordinator re-ran the search independently and agrees.

- **"~3 min by hand": NOT FOUND.** No labeling source states a per-label manual duration —
  not the feature spec, labeling-start-here, the E84 pilot spec, `docs/ops/labeling.md`, the
  labeler-UX memories, or the 2026-09-13 critique. The record says the opposite of a measured
  baseline: at 2026-09-13 13:12 PDT the critique headline is "labeler NOT < 1 min today", and its
  plan calls a seconds-per-task counter "a new event" still to be built. The manual rate was
  **uninstrumented**. The only "~3 min" in the corpus is the 2026-09-09 deploy rollback window
  (an `assertEnvValid` boot failure) — a different thing entirely.
- **"~10 s with agents": sourced but scope-mismatched.** EXP-E84 measures **11 s** (Gemini 2.5
  Flash) and **16 s** (Claude Haiku 4.5) per task, 13.7 s / 12 s on re-runs — agent wall time
  only, excluding human review. No `[verify]` bracket appears in any source. The nearest
  human-verify analogue is E28a's blind adjudication, 6 dissents in 6 minutes ≈ 1 min/item,
  an order of magnitude slower than 10 s.

**Decision.** The talk does not use "3 min → 10 s". Arc F quotes **11–16 s of agent wall time per
task at $0.004–$0.024**, states plainly that the manual baseline was never measured, and makes
the honest point instead: the pipeline's value showed up in **agreement and cost** (E28a: 95.8%
agreement, κ = 0.952, 71.1% exact id, zero wrong agreements; E84: 800 tasks for $9), not in a
speedup nobody instrumented.

**Alternatives not taken.** (a) Quote the number with a hedge — rejected: the repo is public and
the number would be traced to nothing. (b) Reconstruct a 3-minute baseline by arithmetic and
present it as measured — rejected outright; that is the "solutioning from thin data" anti-pattern
the talk itself calls out, and doing it in the talk's own evidence would be self-refuting.

**Consequences.** brief.md arc F row corrected. D4's arc F paragraph is superseded on this point.
This is now the third instance of the same lesson (with D4's framing and D5's ordering):
**the remembered number is tidier than the record.** That pattern has earned its own slide.
Gerald still owes an answer on where his ~3 min came from — if it is a real stopwatch memory,
it is worth instrumenting once and quoting properly rather than dropping.

## D7 · 2026-09-24 · D6 reversed: the 3-min baseline is founder testimony, and it stays

**Context.** D6 dropped "~3 min per label by hand" as unsourced. Gerald (08:2x PDT): he timed
himself with the first labeler build and shared the average in a session message. The
coordinator then searched every human-typed message in all 30 transcript files on this laptop
(the 28 inventoried plus `-git-grAIde-main` and one worktree folder the inventory missed):
no timing message. The 09-07 session brief records sessions running on a second account;
the first labeling sessions most plausibly live there, outside the mined corpus.

**Decision.** D6's drop is reversed. The talk quotes **~3 min/label by hand** as Gerald's own
measurement, attributed as founder testimony with the original message "not in the mined
corpus". Absence from a partial corpus is not evidence against a firsthand measurement; D6
treated it as if it were. The agent side stays as measured: **11–16 s agent wall time per task
(E84), agent-only, excluding human review.**

**New evidence from the same search, which the talk should use.** Gerald, 2026-09-14 05:02
(session `403300ff`): "~30+ label tasks as admin in like 10 minutes" after the P0/P1 redesign,
roughly **20 s per task by a human**. So the 3-min figure fell through two levers, not one:
agents doing the first pass (11–16 s) and a redesigned UI making human review fast (~20 s).
The honest slide shows both. Crediting agents alone would overclaim.

**Lesson (method).** D6's mistake: "not found in what we mined" became "not sourced" without
first asking the one person who was there. The corpus-coverage gap is logged in tracking.md.

**D6/D7 erratum (2026-09-24, arc F Opus review).** D6's "800 tasks for $9" should read **760 tasks
for ~$9** ($2.99 + $6.09; 40 human-labelled tasks were skipped) [src: EXP-E84 lines 103–104]. Its
"zero wrong agreements" holds for E28a and the E84 pilot only; the 760-task run had no ground
truth, so wrong-agreement can't be measured there.

## D8 · 2026-09-24 · Gerald's answers after the Opus review pass

- **"michi" in Grailith file/branch names stays.** Gerald: fine to publish, do not scrub.
- **Top-3 replay of D4 (G0 vs G0h), offline:** run it. Lane `mine/e67-top3-replay` re-scores the
  saved E67 vectors on the devbox (no inference), with a positive control that print@1 must
  reproduce 67.66% / 77.61% exactly before any @3 number counts.
- **Lock-state flag in the lot harness:** approved as a Grailith code change on branch
  `eval/lot-top3-lock-state` (worktree `grAIde-lotlock`, off Grailith main `f75d531d`), not merged
  by this project. The founder's accuracy bar becomes measurable: top-3 on NON-locked lots, plus
  lock rate × lock precision.
- **The ≥ 200-lot run:** run offline over every truth lot available, and report the actual n
  instead of padding to 200.

**D8 outcomes (2026-09-24 09:3x PDT).** (1) The D4 win carries to top-3, at about half the size:
print@3 83.58% → 89.05% (b=1/c=12, p=0.0034) vs @1 67.66% → 77.61%, after a positive control
reproduced E67 exactly [mining/findings/E67-top3-replay.md]. The talk may now say "the negative
result was the win" in the founder's own units, with the @1/@3 halving as the honest caveat.
(2) The founder's bar on live lots: top-3 on non-locked lots 65.2% (45/69), lock 20.7% at 88.9%
precision, n=87, the most recorded data allows [mining/findings/lot-top3-unlocked.md]. The
remembered 76.9% was a small-sample high; the pooled level is about 70%.

## D9 · 2026-09-24 · D5 superseded: arc B is four sequential acts, each with its own reason

**Context.** D5 read the git log's overlapping dates (scout Wave 1 08-18, lots roadmap 08-19,
comps store 07-04) as concurrent work and restructured arc B into parallel spines. Gerald
(09:5x PDT), who did the work, corrects it on every point:

1. **Comps/pricing WAS a fourth act.** The comps store existing from day two is true, but the
   *problem* changed later: pregrade got by with graded comps and NM raw via a service/API; the
   act began when the need grew to raw comps across conditions (NM / LP / MP / HP / DMG), a far
   bigger problem than "use an API".
2. **LLM-vision identify was a proof of concept**, to establish feasibility and a baseline before
   moving to an image-to-image model. It's a deliberate stage, not a false start.
3. **Scout and bulk scan/lots overlapped in time but were NOT worked concurrently.** Once identify
   worked well enough in the scout, it was ported to bulk scan to remove the LLM portion, and bulk
   scan was used to strip out failure modes of the bigger system (the ways detection and live
   streams fail oddly). The order is pregrade → scout → bulk scan/lots → comps, each act with a reason.
4. **Art Binder / michi-binder is out of the presentation entirely.**

**Decision.** Arc B returns to four sequential acts, told with the REASON each began. The `mine/pivots`
review lane sources the transition dates for acts 3 and 4 and the LLM→image-to-image switch; the
founder's account of the ORDER and the REASONS is testimony and is not re-litigated from commit dates.

**Alternatives not taken.** Keep D5 and cite overlapping dates: rejected. Dates show when commits
landed, not where attention was. D5 made the same error D6 made, in the other direction:
inference from a partial record was allowed to overrule the person who was there.

**Consequences.** brief.md arc B corrected. D5 no longer counts as a "remembered vs recorded"
instance; it becomes the counter-example, **the record can be over-read too**, which the talk's
spine needs so it doesn't become "trust the logs over people". Data-viz lane told to drop the
concurrency swimlane and Art Binder.

## D10 · 2026-09-24 · Abstract written; Demo 1 fallback is Gerald's own video; the opening fork

- **Abstract:** Gerald wrote `talk/abstract-rough.md` (383 words). It's Demo 1's input.
- **Demo 1 fallback:** Gerald has a ~2-minute recorded video of the demo and states the live demo
  won't stall. The fallback ladder in presentation-plan §4 is replaced by: live, or play the video.
  The labelled-rehearsal fallback is dropped. The video stays outside the public repo unless
  Gerald asks for it to be committed after a hygiene review.
- **Opening fork (plan Q3) answered by the abstract:** neither the Japanese-index call nor "when to
  run identify", but the scout's jittery detect→identify boundary (results every ~500 ms,
  matches presented then overridden). The unlock: instrument key transitions in PostHog so data
  can be replayed and experiments run concurrently offline, then about 100 hypothesis-gated
  experiments in isolated worktrees overnight, each gate unlocking the next.
- **Audience emphasis:** Software Engineers, Product Managers, Product Designers.
- **Plan status:** `talk/plan/presentation-plan.md` proceeds as written plus §8 and this entry;
  build swarm L1–L5 launched. The abstract's checkable claims (~500 ms cadence, "nearly 100
  experiments", PostHog replay, overnight gates) are sourced by L5 as provenance. Contradictions
  go to Gerald as questions; they don't overrule him.

## D11 · 2026-09-24 · Arc B's two open framings, answered by the founder

1. **Act 3 is a shared core, not a port.** Gerald wanted fast identify for BOTH bulk scan and the
   scout, because every app he'd tested was slow and inaccurate. Identify was the most complex part
   of the system, and getting it fast and accurate in either app would give a shared core to
   build around, freeing focus for other areas. The record fits: the embed-first lane wired into
   bulk scan 08-20, the scout switched 09-02, LLM identify retired from both doors 09-03. The
   lane's two proposed framings ("ported from the scout" / "designed for the scout, proven in bulk
   scan") are both dropped. The talk beat: **solve the hardest shared core once, then fan out.**
2. **Act 4 starts 2026-09-06.** The 08-23 per-condition tiers inside lots are a precursor.

Applied: `mining/arcs/B-pivots.md` (act 3/4 text, §5 resolved), brief.md arc B row; L2 (chart #3
JSON) and L5 (notes, slides 7–8) told while running.

## D12 · 2026-09-24 · The single-crop win stands; "the replay undid it" was our over-read

**Context.** The arc-B review lane, the cross-arc log and the coordinator-approved chart row all said
E79's single-crop win "didn't hold on replay" (09-13: 25 vs 24 top-1, 33 vs 33 top-3). Gerald
disputed it: single crop clearly raised accuracy. A verification lane (Opus 5.5) swept every clone,
every ref (laptop and devbox, after fetch), every experiment markdown file, the backlog and the ledger.

**Finding (verified by the coordinator against the sources).**
- E79b (Grailith `177749ea6`, 2026-09-09 02:11 PDT), 41 human-truth scenes: vote **26/41** at 1,893 ms;
  one tight+17 px crop (b17) **31/41** at 337 ms; oracle 33. Wider crops LOST (b34 21, outer17 6).
- Ledger (`experiment-ledger.md` @ f75d531d): E79 status **D** (done, not shipped). Verdict: "Vote
  WORSE than single 17px-padded crop and 5.6x slower; drop the vote hack."
- The 09-13 "replay" (prod-readiness B1) compared **b00 vs b17**, two single crops, padding only, in
  the pregrade-web app. It never re-ran the vote. The same doc restates E79b as standing.
- No git hygiene gap: laptop and devbox trunks are both at `f75d531d`, even with origin. The
  extension still sends five crops (`content.ts` → `captureProposals`; no flag). The E79
  recommendation never reached the extension.

**Decision.** The E79 row moves from "record corrects memory" to a THIRD counter-example: "a
'replication' that tested different arms". The talk says: the single crop won (31 vs 26 of 41,
5.6× faster), the verdict was to drop the vote, and it hadn't shipped to the extension as of the
record. Chart, slide 20 notes, arc B and cross-arc corrected.

**Still open with Gerald.** (1) The winning crop was tight + ~17 px, not WIDE; wide variants lost.
Is "wide" meant relative to the old tight detect crop? (2) "5 crop proposer gone" (09-11) isn't in
any ref. Was it retired in an uncommitted build, or planned?

**D12 follow-up (2026-09-24 10:3x PDT, Gerald).** (1) Confirmed: the winning crop was tight + padding
(~17 px), not wide. (2) Gerald believed the proposer was "turned off by default". The coordinator
checked `main` (`f75d531d`): `content.ts` calls `captureProposals` unconditionally and encodes
and uploads every proposal; no options/storage key or flag gates it; `rectK`/`diversityK` are
hard-coded. **On main the proposer is ON for every fire, with no off switch.** If it was turned
off, that change never reached git. Talk wording: "the verdict was to drop the vote; the
extension code still sends five crops". Don't claim it's off.
**Devbox (10:30 PDT):** Gerald ran `sudo systemctl restart tailscaled`. The coordinator verified box
DNS resolves and the :8443 tailnet health endpoint returns 200 from the laptop. `mcpo-github` was
still restart-looping 49 s after (exit 2); recheck later. The :8989 keyless pregrade (down since
09-21) and the mirror unit's 178.7 MB file are unchanged and are Gerald's call.

## D13 · 2026-09-24 · Cost, slide 4 wording, and the critique follow-ups

- **Cost:** all of the Claude work ran within Gerald's Claude Max subscription budget. No separate
  Claude spend. The only metered model spend in the record is the labeling pilots' vision-model
  calls (E84: $0.64 pilot; ~$9 for the 760-task run via another provider). The talk says exactly
  that and makes NO claim about Gerald's hours; there's no source for them.
- **Slide 4 wording (approved):** "~100 experiments in two weeks, many gated and run overnight."
- **The jitter story's ending** is to be answered from the experiment markdown files and the ledger
  (lane `verify/jitter-ending`), not from memory.
- **Hold-out** (E67's 201 test crops vs the E65a head's 432 real training crops): lane
  `verify/holdout` checks the crop ids directly.
- **Revision swarm** (R1 charts, R2 deck + notes, R3 starter kit) proceeds on the converged
  critique (`talk/plan/critique.md`). Slides that depend on the two verify lanes are patched
  after they report.

## D14 · 2026-09-24 · Two verified answers: the jitter story's ending, and the hold-out

**The jitter ending (from the experiment docs + ledger, per Gerald; coordinator re-checked E19).**
- 08-18: the anti-jitter liveness state machine shipped (`45b8bddb7`), built against 6–15 s identify.
- 09-02: Gerald's first instrumented live session was still "super jittery". The data showed the flap
  was per-frame overlay state; a results queue with a sticky view shipped (`70b2f1b9e`).
- 09-05: E1/E7 sized it (steals 13–19 % of committed locks). **E19, against a control**, measured
  answers thrown away per 100: **35.8** (old client, slow server) → **15.4** (old client, 3× faster
  server, p50 1,157 → 433 ms) → **0.14** (after F5: cancel the request, keep the answer).
- 09-11: E88 timer retune ("nothing thrashed"); Gerald: "worked really well, super fast on identify".
- Killed or never needed: E91 hashVeto (a trade, not a win), E116 boundary-enter (lift vanished net
  of control), E100b consensus (inert on the bar); no embedding-MODEL experiment was needed for jitter.
- **Stage ending:** "The data showed us where it was flapping. A 3× faster server cut thrown-away
  answers from 36 to 15 in every 100; then one behaviour change, cancel the request but keep the
  answer, took it to about 1 in 700. Three days from the first instrumented complaint." Both levers
  get credit. Crediting only the behaviour change would overclaim.
- **Questions for Gerald (not blocking):** the ~500 ms cadence only exists after the 09-05 speedup
  (09-11 p50 375 ms), so is the story set in September? PostHog went in 08-10 for analytics; the drop
  event exists from 09-04, and the 09-02 fix used a replay test. Is "instrument, then replay" the
  right order? The 3×5 fork grid is testimony (not in the record).

**The hold-out (verify lane, coordinator re-checked the fit code).** HELD OUT: 0 of the 201 E67 test
crops trained or tuned the head. `e65a_head.py` fits `fit_linear(Xtr, …)` with `Xtr = R[tr]`, catalogue
RENDER rows in the train sets only; the real-crop sets are loaded only to be scored. λ was chosen on
dev (disjoint from test in split `fd4f57d5…`). Crop-filename join and a cosine check (max 0.997, none
≥ 0.999) found no test photo in any E11 crop. Caveat for Q&A: the head has seen the catalogue render
of the true card for most test crops, which is the gallery, known at inference, not leakage.
**Talk line:** "The language head never saw a real photo while it trained: catalogue images only, its
one knob set on a separate dev split, and none of the 201 test photos in any of that."
**For Gerald:** EXP-E67 §4.1 (Grailith, line 643) says "The E65a head was fitted on 432 E11 crops". That's
wrong: it was E11's older probe. Worth correcting before anyone quotes it.

## D15 · 2026-09-24 · The orbs design competition stays out of the talk

Gerald: leave it out. The pulled orbs material (`scratch/orbs/`: pitch brief, FACTS.json, story
concepts, the champion build) is used ONLY as a reference for how the toolchain was applied. None
of its content, numbers or imagery goes into slides, notes or the public repo. The six pulled skills
(`.claude/skills/`, git-ignored) are used as TOOLS for this deck: svg-infographic for structural
diagrams; svg-design / svg-linyaosky for hand-authored charts; impeccable + hallmark as design gates.

## D16 · 2026-09-24 · Structure v2: a talk about applying the methods; Gerald as protagonist

From Gerald's answers in `talk/plan/story-plan.md` §e and his 11:1x message:
- The talk is about **applying orchestration, gates, experiments, and which method fits which
  problem type**. Remembered-vs-recorded is CUT (no stage time); the D-log stays in the repo.
- Gerald is protagonist AND narrator. The opening demos the CURRENT state live (Demo 0: the scout),
  then gives one timeline from ~10–15 s identify to today, with the areas that could have eaten weeks.
- **The jitter is reframed:** the first sign we were onto something (identify got fast enough to
  flap). Experiments then brought it to today's clean state.
- **Hours (testimony):** ~30 minutes a day, spread out, setting agents up for overnight
  experiments. Goes on the backup slide and in the notes, labelled as Gerald's estimate.
- Polish is LAST. Before it, the new visuals get generated with the pulled skills
  (svg-infographic for structure, svg-linyaosky for the step and slope charts).
- **Demo 0 (proposer off):** no lane had been asked before 11:1x. Lane `demo/scout-single-crop`
  builds it on a Grailith branch (no merge, no deploy).
Structure: `talk/plan/structure-v2.md`.

## D17 · 2026-09-24 · v3 order: screenshot open, live demo after the jitter; gates focus; cuts

Gerald (11:1x): open with a screenshot of the working scout instead of a live demo; order: image →
how we got here → first sign → fork → what changed → jitter resolved → **live card-scout demo**.
Gates: focus on the **experiment gates and flags that let experiments run unattended**, and keep the
**persona review gates** for UI/UX/design. CUT: persona drafts and their demo (Demo 1), and
"against paralysis". The screenshot (`scout-gengar-today.jpg`) has the seller's and the winning
bidder's avatars and usernames pixelated for the public repo; the original is in git-ignored `scratch/`.
Demo 2 is kept pending Gerald (he didn't mention it). Details: structure-v2.md § v3.
**D17 addendum (Gerald, 11:2x):** Demo 2 (the repo-record replay) is CUT too. 18 slides + backup; its
minutes go to the live card-scout demo and the gates slide. The only live moment is now the card-scout demo.
