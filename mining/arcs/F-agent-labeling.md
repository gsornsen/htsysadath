# Arc F — agents as labelers

Sources under `~/git/grAIde-main/docs/`. **E28a** = `experiments/EXP-E28a-adversarial-agent-labeling-2026-09-06.md`;
**E84** = `experiments/EXP-E84-agent-tools-pilot-2026-09-09.md`; **handoff** = `plan/2026-09-08-handoff-siglip2.md`;
**critique** = `design/2026-09-13-labeler-critique/`. Rewritten after D7 (2026-09-24).

## Metrics

### The number: two levers, not one

| step | figure | scope | src |
|---|---|---|---|
| by hand, first labeler build | **~3 min / label** | human, fresh label, no agent | [src: founder testimony · 2026-09-24 · D7] (original message not in the mined corpus) |
| agent first pass | **11 s** (Gemini 2.5 Flash) / **16 s** (Haiku 4.5) per task | agent wall time only, no human | [src: E84 · §1 · 2026-09-09] |
| human review, after P0/P1 redesign | **~30 tasks in ~15 min ≈ 30 s** | founder, admin mode, live stack, reading included | [src: critique/p1-panel-verdict.md · table · 2026-09-13 21:50] |
| same, next morning | **"~30+ label tasks as admin in like 10 minutes" ≈ 20 s** | same scope, founder's estimate | [src: D7 · session 403300ff · 2026-09-14 05:02] |

Two levers: agents do the first pass; a redesigned UI makes review fast. The human stays the verdict of record.

### E28a: paired blind agent labelers, 120 served fires (2026-09-06)

Agreement 115/120 = 95.8%, κ 0.952; exact id 81/114 = 71.1% [62.1, 78.6]; 96.5% counting a right card in the
wrong print language; 0 wrong agreements. [src: E28a · §1, §3 · 2026-09-06] Founder adjudicated the 6-fire
residual blind, **18:15–18:21 PDT**, closing 3; residual 6 → 3 of 120, band ±2.5 → ±1.25 points.
[src: E28a · §12, §12.2, §12.6 · 2026-09-06]

### E84: tool-using agent labeler (2026-09-09 → 09-11)

| agent (pilot, 23 tasks, 18 with a truth id) | exact id | $/task | wall | src |
|---|---|---|---|---|
| A · Gemini 2.5 Flash | 11/18 = 61% | $0.004 | 11 s | [E84 §1] |
| B · Haiku 4.5 (cap 8) | 4/18 = 22% | $0.024 | 16 s | [E84 §1] |
| B chosen · gpt-5.6-terra | 10/18 = 56% | $0.009 | n/a | [E84 §6] |

**Wide run** [src: E84 · §7 · 2026-09-09 19:44]: **760** tasks without a human label (of an 800 batch; 40 already
human-labeled were skipped). A: 49 min, $2.99; B: 74 min, $6.09 → **~$9 total**. Pair agreed on an id **316 (42%)**,
agreed on a no-id verdict 85, **dissented 359 (47%)**: 77 different ids, 244 one named / one did not.
Later re-passes: median agent wall 13.7 s / 12 s. [src: E84 · §10, §12 · 2026-09-10]

## 1. The arc in one paragraph

The founder was the only labeler, and labeling cost ~3 minutes a label by his own stopwatch. After 23 labels
on the first build he quit over UI friction. The program then split the work. E28a showed two blind agents
agree 95.8% of the time and are usually right when they do. E84 gave a capped, tool-using agent catalogue
access and ran a pair over 760 tasks for ~$9 at 11–16 s a task. That did not make labeling fast on its own:
on 09-13 the founder's review sessions still ran over a minute because the one-tap answer rendered below the
fold. A persona-driven redesign (P0/P1) fixed placement, and by 09-14 he cleared ~30 review tasks in ~10
minutes. Agents made the first pass cheap; design made the human pass fast; an audit showed agent claims
still need a human check.

## 2. Pivotal moments (dated, in order)

1. **2026-09-06: pair the agents, adjudicate only the residual.** Ask 14:45 PDT: agents write labels, the
   founder approves or overrides [src: plan/2026-09-06-labeling-feature-spec.md · header · 2026-09-06]. E28a
   the same day: κ 0.952; 6 rulings in 6 minutes halved the uncertainty band. [E28a §12]
2. **2026-09-08: first labeler build live**, "everything below is live on the box right now" (13:55 PDT)
   [src: plan/2026-09-08-labeling-start-here.md · header · 2026-09-08]. The ~3 min/label stopwatch comes from
   this build [D7].
3. **2026-09-09 ~11:45 PDT: the founder stops after 23 labels.** "I will not be doing any more labeling until
   the experience is vastly improved"; five UI blockers, fixed 12:22 PDT. [src: memory
   labeler-ux-blockers-2026-09-09.md · 09-09; labeling-start-here header]
4. **2026-09-09 17:33 PDT: E84, give the agent tools.** Capped at 8 calls / 60 s / $6 run. Gemini hit 61% exact
   at $0.004; Haiku's abstentions came from the cap. By 19:44 the pair had run 760 tasks.
   [E84 §1, §7]
5. **2026-09-10 23:25 PDT: an audit reverses "converged."** Run D's write-up (§14) called the remaining 19
   not-in-catalogue tasks "genuine gaps or unreadable crops." The founder asked for an audit. The orchestrating
   agent viewed every crop and queried the catalogue; the founder reviewed in parallel (23:27). The count
   was **20**, and **9 of 20 were in the catalogue**: refused hits it had (4), Japanese names against
   English-only rows (3), traditional characters (1), a misparsed form word (1). Fixed in §16 (09-11). [src: E84 · §14–§16 · 2026-09-10/11]
6. **2026-09-13 13:12 PDT: the UI, not the agents, is the bottleneck.** Critique headline: "labeler NOT
   < 1 min today"; the one-tap answer rendered 276–639 px below the fold; done = four personas under a 60 s
   median. [src: handoff · 2026-09-13 13:12 entry] P0 panel DONE 17:25–17:58; P1 panel DONE 21:50, where
   the founder's first live figure was ~30 s per resolution. [src: critique/p0-panel-verdict.md,
   p1-panel-verdict.md · 2026-09-13]
7. **2026-09-14 05:02: ~20 s per review task**, founder, admin mode. [D7 · session 403300ff]

## 3. The transferable move

Split the job into a cheap machine pass and a fast human pass, then fix both. Two blind agents make
disagreement informative, which tells you where human minutes are *not* needed. That pays off only if
the review screen is built for seconds. Measure the human step as hard as the model. Keep the human as the verdict of record, and audit the agents' confident claims
("converged," "not ours") as well as their dissents.

## 4. Slide candidates

- **"3 minutes → 20 seconds, and the agents only did half of it."** Artifact: the two-lever table above,
  scopes printed on the slide.
- **"Agreement is not correctness."** Artifact: E84 §15's failure-shape counts, 9 of 20 "gaps" that were not.
- **"The one-tap answer existed. It was 600 px below the fold."** Artifact: a critique before/after screen.

## Scope caveats (read before quoting)

- **Per label vs per task.** 3 min is per fresh label by hand. 11–16 s and ~20 s are per *task*. A review
  task is a label decision made *with* agent pre-labels on screen. So 3 min → 20 s compares different task
  shapes. The honest reading: "a label decision used to take 3 min of the founder; now it takes ~20 s of him
  plus ~15 s of agents."
- **~20 s and ~30 s are founder estimates**, not instrumented timings; the critique itself says a
  seconds-per-task counter would be a new event. [critique/final-critique-and-plan.md · ~L340]
- **Persona s/task in the panel verdicts** (9 / 14 / 11 / 10.5 s after P0) are simulated personas on
  fixtures, not humans.
- **Wide run:** 760 tasks, not 800. There is no ground truth, so the wrong-agreement rate is **unmeasured**
  (E84 §7 says so). "0 wrong agreements" holds only for E28a and the E84 pilot/partner selection.
- **Dissent split:** 77 + 244 = 321 of 359; E84 §7 does not break down the other 38 (likely mismatched
  no-id verdicts; unverified).
- **~$9** is the wide run's model spend only; pilot ($0.64) and re-passes ($1.24) are extra.

## 5. Open questions for Gerald

1. Were the 09-13 "~30 in 15 min" and 09-14 "~30+ in 10 min" the same kind of admin task (dissent
   resolution vs approving agreed labels)? It changes what "20 s" means.
2. Were your 23 labels on 09-09 the E84 pilot's 23 human-truth tasks? (The pilot spec says 26 known-truth
   tasks, so we have not claimed they are the same.)
3. Can the 3 min stopwatch be re-run once on today's build without agent pre-labels, so the talk can show
   the UI lever apart from the agent lever?
