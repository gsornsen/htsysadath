# Speaker notes v1

Lane L5 (`build/outline`) · Opus 5.5 · 2026-09-24 09:5x PDT. One section per slide, matching
`talk/outline.md` v1. The spoken part is written to be said out loud; stage directions sit in
**Stage** blocks and don't count toward the 60–150 words. The integrate lane (L6) moves these
into `deck.md` as Marp notes.

## Citation key

| Tag | Source |
|---|---|
| `[abstract]` | `talk/abstract-rough.md`, Gerald's own words: founder testimony (D10) |
| `[D1]`…`[D11]` | `docs/project/decisions.md` (D11 as relayed by the coordinator, 2026-09-24) |
| `[arc A]` `[arc B]` `[arc C]` `[arc E]` `[arc F]` | `mining/arcs/{A-experiments,B-pivots,C-personas-review,E-coordinator,F-agent-labeling}.md` |
| `[E67-top3]` `[lot-top3]` `[top3-traj]` `[cross-arc]` | `mining/findings/{E67-top3-replay,lot-top3-unlocked,top3-trajectory,cross-arc}.md` |
| `[brief]` | `docs/project/brief.md` |
| `[plan §n]` | `talk/plan/presentation-plan.md`; `[plan 02]` is `talk/plan/02-live-demos.md` |
| `[P1]`…`[P4]` | the provenance rows at the end of this file |
| `[G:<sha>]` | a Grailith (grAIde-main) commit, read-only |
| `[G:ledger]` | Grailith `docs/plan/2026-09-18-trunk-consolidation/experiment-ledger.md` |
| `[G:backlog]` | Grailith `docs/experiments/EXPERIMENT-BACKLOG.md` |
| bare 7-char sha | a commit in this repo |

---

## Slide 1 · How to scale yourself and do all the things

Hi, I'm Gerald. This talk is about a fork in the road: the moment a hard problem lands in the
middle of a project and your instinct says push through. I want to show you that stepping back
has become cheap, and how I explore several forks at once while I keep doing my actual job.
Everything I show you today is in a public repo, with its sources, so you can check me [D1].

## Slide 2 · The jitter

Early on with the scout, a browser extension that identifies trading cards on live auction
streams, I was stuck at the boundary between detect and identify. The client sees a card, cuts a
crop, sends it to the server for an embedding, and runs an image-to-image search [abstract]. We
got results about every 500 milliseconds [abstract; P1]. Everything under the presentation layer
looked promising. On screen it was jittery. It showed a match, overrode it, showed another
[abstract; G:45b8bddb7 · 08-18; G:70b2f1b9e · 09-02]. I could attack it in the UI, in card
detection, or in how we generate embeddings. Each of those had at least three parts of the
system to explore, and each part had about five experiments [abstract]. That's more than
forty-five forks for one bug.

## Slide 3 · Why we push through

Every project is boxed by scope, staffing and timeline [brief]. When a problem like that lands,
the default is to lean on what you already know and push through. There's no time, no spare
people, and maybe nobody on the team who knows the alternatives. The pressure was real for me.
Identify wasn't fast enough end to end to win an auction, and the project came close to being
parked [D4]. With forty-five forks and one of me, the honest move used to be: pick the fix I
know best, ship it, and hope. I think that math has changed, and the rest of this talk is what
changed it.

## Slide 4 · Exploring got cheap

The unlock wasn't a smarter model. It was instrumentation. We sent the key transitions to
PostHog and made sure every fire could be replayed offline from recorded frames and fire records
[P2; G:1267e680e · 08-22; G:3c52c2b72 · 09-04]. Once that existed, a team of agents and I came up
with nearly 100 experiments [abstract; P3]. Each ran in its own git worktree against the same
frozen data [P3]. Each was a hypothesis with a gate. When a gate cleared, the work merged and the
next experiment unlocked, overnight while I slept, and during the day while I did other things
[abstract; P4]. So let me prove it on something small. I'm starting four writers on my own rough
abstract, right now.

**Stage (0.5 min, Demo 1 kickoff).**
1. Advance to the `_class: demo` link-out slide and click it. The terminal is already in the demo
   clone at tag `talk-demo`, prompt `$ `, 28 pt [plan §1, §4].
2. Run `demo/fanout`. Say while it starts: "Executive, engineer, designer, product manager. Each
   one gets my rough draft and a persona brief."
3. When the four lane lines appear (about 30 s), say: "They'll be done before we need them. I'm
   not going to wait." Return to the deck by URL hash to slide 5.
4. If the lanes haven't started after 15 s, don't debug on stage. Say "I'll show you the
   recording when we get there" and go on. The fallback is the ~2-minute video at slide 15 (D10).

## Slide 5 · Act 1: a baseline on purpose

First, some context on how the product got here. It happened in four acts, each with a reason
[D9]. Act 1 was pregrade, in early July: identify one card from a photo with an LLM vision call.
That was a proof of concept on purpose, to show the job was feasible and to set a baseline
before moving to image-to-image [D9]. It shipped on day three of the repo. A vision agent read
the collector number and a deterministic step resolved the card, in 6.9 seconds on the one photo
it was checked on [arc B; G:f7a484e95 · 07-04]. I don't have an accuracy number from those
weeks. The record doesn't hold one [arc B].

## Slide 6 · Act 2: the scout

Act 2 started on August 18th: the scout. A card on a live auction is on screen for seconds, and
identify took 6 to 15 seconds live [arc B]. We shipped three waves in about an hour, and wrote
the spec afterwards [arc B; G:e04b6433b · 08-18]. That night, a three-lane bakeoff ran against
the act 1 baseline. Vision got 5 of 6 right at a 10.4-second median. The embedding answered in
about 130 milliseconds, but got top-1 on only 1 of 5 same-art prints [arc B; G:3f5eabd7e ·
08-18]. A second overnight run on 84 real captures picked SigLIP, with top-1 of 0.84 at 44
milliseconds [arc B; G:423e2e894 · 08-20]. The embedding became a ranker, never an authority on
its own [arc B].

## Slide 7 · Act 3: one core, two apps

Here's where commit dates would tell the story wrong. Every app I'd tried for this was slow and
inaccurate. Bulk scan and the scout both needed identify to be fast and accurate, and identify
was the hardest part of the whole system. So I solved it once, as a shared core, and built both
apps around it [D11]. The dates are the supporting detail. The image-to-image lane went into
bulk-scan capture on August 20th with the LLM demoted to a fallback. The scout switched on
September 2nd. The LLM identify lane was retired on September 3rd [arc B; G:5f76f4810 · 08-20;
G:06119bc92 · 09-02; G:0d12da755 · 09-03]. Solve the hardest shared piece first, then you're
free to focus elsewhere.

## Slide 8 · Act 4: comps

Act 4 started on September 6th [D11]. Comps had been in the repo since day two [D5], and pregrade
got by with graded comps and near-mint raw prices from a service [D9]. The problem changed shape
when I needed raw comps at every condition, from near mint down to damaged. That's a far bigger
problem than "use an API" [D9; D11]. An earlier per-condition tier inside lots, on August 23rd,
was a precursor at most [D11; arc B]. Condition tiles shipped in the scout on 09-06, and the
next day's pricing-cache redesign got a founder go before anything was spent [arc B;
G:a8b11dc96 · 09-06]. What we didn't do: no scraping, and no guessed prices across services
[arc B].

## Slide 9 · The negative result was the win

Back to identify, and the one experiment that changed my mind the most [D4]. Japanese cards were
scoring higher similarity than English ones. A census found that 96.14 % of 19,258 Japanese
renders had an English twin with identical art [arc A]. My instinct was to dedup the index. E67
tested that against a kill line written down before the run. Dedup lost 14.43 points of print@1,
and the kill fired [arc A]. Scoring past it, one arm kept the flat index and added a small
language head. It lifted print@1 from 67.66 % to 77.61 % on a 201-crop test split, 20 fixed and
none broken [arc A; E67-top3]. The head shipped on 09-09 [arc A]. The experiment I expected to
win lost, and that loss found the change we shipped.

## Slide 10 · At top-3 the gain halves

But that was top-1, and my bar is top-3: the right card somewhere in the picker's three
candidates [top3-traj]. So we replayed the saved E67 vectors at top-3, after checking that the
replay reproduced E67's top-1 numbers exactly [E67-top3]. The win holds. Print@3 goes from
83.58 % to 89.05 %, 12 fixed and 1 broken, p = 0.0034 [E67-top3]. But it's +5.47 points, not
+9.95. Why? Of the 20 crops the head fixed at top-1, 13 already had the right print at rank 2 or
3 [E67-top3]. That's one frozen split, n = 201 [E67-top3]. Same experiment, same code, half the
headline. The metric you pre-register is a decision too [arc A].

## Slide 11 · What we didn't do, and a yardstick measured four ways

Gated experiments pay off in what they let you stop. We stopped a SigLIP2 encoder swap that came
in 9.55 points down [G:ledger · E57]. The fine-tune and the distilled student both failed their
bars [G:ledger · E58, E53d]. We didn't re-embed the reference art [G:ledger · E12, E39], and
paying for more Japanese art showed zero lift, so we didn't scale it [G:ledger · E119]. A lot of
the "nearly 100" were tests like these. And a caution. We measured top-3 four different ways:
served crops at 78.2 %, the same crops offline at 74.3 %, a six-crop proxy going from 70.3 % to
82.9 %, and live lots anywhere from 45.2 % to 76.9 % [top3-traj]. Those are four yardsticks. You
can't draw one trend line through them.

## Slide 12 · The bar, measured

So how good is the scout by my own bar? We ran every truth lot in the record: 87, not the 200 I
asked for [lot-top3; D8]. The scout auto-locked 18 of them, 20.7 %, and 16 of those 18 were
right, 88.9 % [lot-top3]. On the 69 lots it didn't lock, the right card was in the top 3 on the
last fire in 45: that's 65.2 %, with an interval of 53 to 75 % [lot-top3]. The truth here is my
own taps. One tapper, five days of streams [lot-top3]. So, about two in three. It isn't done,
but now it's measurable, and I know which number to move.

## Slide 13 · The panel is the done gate

For design forks, the gate is people, or stand-ins for them. On September 13th I made a design
panel the done gate. Code-done isn't done [arc C]. There are four fictional personas, each a short
brief with a device and a job. Dez, for example, is 22, phone-only, one thumb. Then three critics
with a lens instead of a backstory [arc C]. They re-walk the built screens and return DONE or NOT,
with blockers [arc C]. They also translate literal asks into jobs. I asked for a bulk-approve
button. The job turned out to be "don't make me re-click my own answers", and that shipped with
zero clicks [arc C]. The persona timings are simulated, not human [arc F].

## Slide 14 · The gate fails

And then the gate failed. The second panel pass, at 21:50 on the 13th, had Dez DONE at 8 seconds
with no scrolling to reach Submit [arc C]. At 09:40 the next morning I opened the deployed app on
my own iPhone, and it was pretty much unusable. Three scrolling sections, a help modal reopening
on every task, and I had to rotate the phone to reach some options [arc C]. The panel walked
Storybook at a fixed viewport. It never saw iOS browser chrome or the real flow between tasks
[arc C]. The fix was another pass, this time allowed to start from a blank canvas [arc C]. The
panel is necessary. Your own hands on the real device are still the last gate.

## Slide 15 · Four drafts of my abstract (Demo 1 reveal)

Remember the four writers from minute four? Here's what they did with my rough abstract [D10].
Executive, engineer, designer, product manager, each under 200 words, each written from a
persona brief [plan 02]. I pick a hybrid for structure. I want a tl;dr the busy reader actually
finishes, then drill-down levels for the curious and for the people who need the data [D4]. So
I'll take the tl;dr from one draft, the order of the drill-downs from another, and I'll cut one
thing. I'll say each choice out loud. The real pass takes me about ten minutes. This is the
two-minute version.

**Stage (4.0 min).**
1. Click the link-out slide; switch to the viewer tab on `localhost:8090`, opened before the talk
   [plan §1].
2. Show the rough draft on the left for five seconds, then the four columns. While the audience
   reads, name each persona and one line it got right.
3. Choose aloud: tl;dr frame from draft X, drill-down order from draft Y, one cut. Default is no
   audience vote (plan Q8).
4. If a lane hasn't finished or the viewer is blank after 15 s, say "Here's the same run,
   recorded earlier" and play Gerald's ~2-minute video (D10). Say it's recorded. Never present
   it as live. There is no labelled-rehearsal fallback any more (D10).
5. Return to the deck by URL hash at slide 16.

## Slide 16 · What I took from each

⟨Fill after rehearsal: one line per draft saying what I kept from it. The drafts don't exist
until Demo 1 runs; don't invent them.⟩ The point isn't these particular drafts. I kept talking
to you for eleven minutes while four versions were written, and choosing took two. The failure
this replaced wasn't a bad doc. It was docs too long to read, which forced the very meetings the
doc was meant to replace [D4].

## Slide 17 · Two levers, not one

Agents can also do the work itself. Labeling card crops by hand took me about three minutes a
label. That's my own stopwatch on the first labeler build; the original message isn't in the
record we mined [D7]. With tools, an agent's first pass took 11 seconds on Gemini 2.5 Flash and
16 on Haiku 4.5. That's agent wall time only [arc F]. A pair ran 760 tasks for about $9 [D7].
But labeling wasn't fast until a persona-driven redesign. After it, I cleared about 30 review
tasks in about 10 minutes, roughly 20 seconds each, and that's my estimate [D7]. Two levers.
One caveat: three minutes is per fresh label, and 20 seconds is per task with agent pre-labels
on screen [arc F].

## Slide 18 · The coordinator

So how did a hundred experiments run while I slept? With a coordinator pattern. One senior
session writes the spec: files, signatures, acceptance tests, what's off limits. Cheaper models
build to it [arc E]. The reviewer sits one tier above whoever wrote the work, never a peer
[arc E]. Lanes commit early, because a usage limit killed three build lanes mid-work on
September 7th [arc E]. That night at 23:00 I asked what was prepped to run overnight, and the
queue ran on its own until 07:00 [P4; G:backlog]. It isn't free. An early rule to let the swarm
steer itself broke the next day, and I had to keep correcting it [arc E].

## Slide 19 · This talk's own log (Demo 2)

This talk was built the same way, and the log is public. Three stops. First, mining lanes fanning
out and merging back, with merge messages that say what was learned [3de113f]. Second, two
corrections. At 08:22 we dropped my three-minute number as unsourced. At 08:29 we reversed that,
after asking the one person who was there: me [767b0c4; 7fefd2f; D7]. The same thing happened
between 08:19 and 09:27, when the log said the product work was concurrent and I said it was
sequential [b1d7e8f; 7607585; D9]. Third, review merges, each reviewed by a model one tier above
the one that wrote the work [a0641ea; 6b0d9b9; 1f3a3f7; arc E]. ⟨Quote the commit count on main
on the day; it was 75 at 09:5x PDT on 09-24.⟩

**Stage (3.0 min).**
1. Click the link-out slide to the terminal, in the demo clone on `main`.
2. Use the aliases only; no typing, no network [plan 02]. The graph is `git log --graph --oneline
   main`, never `--all`, so no worktree branches show [plan 02].
3. Stop 1 at `3de113f`; stop 2 at `767b0c4` → `7fefd2f`, then `b1d7e8f` → `7607585`; stop 3 at
   `a0641ea`, `6b0d9b9`, `1f3a3f7`. Read the one-line subject at each stop; don't scroll bodies.
4. Fallback: the curated DAG slide (#6) [plan §2]. Return by URL hash to slide 20.

## Slide 20 · Remembered vs recorded

Four times, the record corrected my memory [plan §2]. I remembered the dedup work as the
simplifying win. The record says dedup's kill fired and a small head shipped [D4; arc A]. I dated
my top-3 bar to the 13th. The docs have it on the 11th [cross-arc]. A padded-crop win didn't
hold on replay: 25 versus 24 at top-1, 33 versus 33 at top-3 [cross-arc]. And 76.9 % on 52 lots
was a small-sample high. On 87 lots it's 71.3 % [lot-top3]. Twice, it went the other way. The
record was over-read, and the person who was there corrected it [D7; D9]. So keep both records,
and check in both directions.

## Slide 21 · Against paralysis

Cheap exploration can turn into analysis paralysis dressed up as rigor. To be honest, the record
names that risk, but I couldn't find a dated incident of it [arc E]. What kept it in check were
four habits. An evidence threshold written before the run, like E67's kill line [arc A]. A time
box and a budget: the labeling agent was capped at 8 calls, 60 seconds and $6 a run [arc F]. "Go
both" when it's reversible: the language head shipped first as a shadow ranker next to the
served one [G:ledger · E65a]. And a log of the paths not taken, which is what slide 11 was.
Decide on the evidence you have, and write down why.

## Slide 22 · Two things for next week

Here's what I'd tell a colleague. When you give agents the right context, the right autonomy and
the right guardrails, they work like extra copies of you on a problem while you focus on
something else [abstract]. Two things for next week. One: at your next fork in the road, ask how
you could get an answer to it while you work on something else. Two: ask how you could validate
the different forks, and whether that could be automated [abstract]. Then try it. Two easy
places to start are in the repo: the persona-drafts prompt and the coordinator brief [plan §2].
Thanks.

---

## Abstract claims: provenance

Searched read-only on 2026-09-24: `git log --all -i --grep` over the Grailith (grAIde-main)
history, and grep over its `docs/`. No transcript (`.jsonl`) was opened, and no file over 200 KB
was read whole; the 553 KB backlog was read only at the lines cited. Grailith paths are relative
to its `docs/`.

| # | Claim in the abstract | Verdict | Source |
|---|---|---|---|
| P1a | Jitter at the detect/identify boundary: matches presented, then overridden | **Sourced** | `G:45b8bddb7` (2026-08-18 19:00): the scout's third wave on its first day was an anti-jitter state machine, built for the overlay jitter and over-firing seen live. `G:70b2f1b9e` (2026-09-02 18:14): the founder's first live session reported the scout locking and unlocking at least once a second, and identifying well when it didn't clobber itself. `experiments/EXP-E1E7-drops-and-thrash-2026-09-05.md`: supersede drops and lock-steal thrash, measured from PostHog and the box ledger. |
| P1b | Results about every 500 ms | **Partly sourced; question 1** | `experiments/EXP-E88-identify-timer-retune-2026-09-11.md` §1 (09-11): client round trip p50 375 ms, p95 692 ms, server total p50 321 ms. That matches ~500 ms as the time for one result. But the same table puts the gap between fires at p50 6.2 s, and at launch (08-18) identify took 6–15 s live [arc B]. |
| P2 | Key transitions instrumented in PostHog, and data replayable offline | **Sourced** | `G:1267e680e` (08-22): PostHog event taxonomy plus a flow-id funnel join. `G:70b2f1b9e` (09-02): a per-frame phase-transition ring buffer and frame stats on every debug record. `G:ab1eba282` (09-02): debug captures. `G:912a455d4` (09-04): `ui_result_dropped`, so the supersede drop is no longer silent. `G:3c52c2b72` (09-04): an unattended capture ledger joining frame ↔ panel state ↔ fire record ↔ worker log. E13, E14, E15b, E16 and E43 (09-05) each state "offline replay" of saved frames and fire records. Nuance: PostHog holds events and taps, but lock state per fire lives only in the fire records [lot-top3 §1]. So the replay runs mostly from fire records, with PostHog alongside. |
| P3a | "Nearly 100 experiments" | **Sourced (conservative)** | `G:ledger` (compiled 09-18): 150 experiment docs, ids E1–E119 plus named ones, about 108 done or shipped and about 18 negative. [arc A]: 155 docs from 09-05 to 09-21, 83 of 151 pre-registered with a KILL condition. |
| P3b | Run in isolated git worktrees, all replaying the same data | **Sourced; "all" is per family, question 2** | `G:backlog` §EXP-001 "Reproducible baseline": each arm gets its own git worktree off frozen commits, against a frozen copy of the captured data (0.4.2 cohort 592 records, 0.4.3 cohort 456). `G:ledger` §4 checked 72 worktrees. The shared corpora were several, not one: the frozen 335-crop split, the 426 provisional-truth crops, and the box ledger's fire records [top3-traj]. Many ledger items were cost or infrastructure work, not replays. |
| P4 | Hypothesis gates that unlocked the next experiment overnight; merged or deployed when a gate cleared | **Sourced** | `G:backlog` line 57: at 23:00 PDT on 09-07 the founder asked what was prepped to run through the night; the queue ran in autonomous mode from 23:05 until 07:00 on 09-08. `G:backlog` §"Overnight wave" (09-06 late → 09-07 02:10 PDT): about 25 merges. `G:7ca4e5eab` (09-05): an overnight queue table for the 09-05→09-06 run. `G:ledger`: E001 made hypothesis-driven development "the standard" (09-06), and INDEX-FULLDIFF "unlocks E38/E39". |
| P5 | Three lanes (UI/UX, detection, embedding) × at least 3 parts × 5 experiments each | **Founder testimony (D10)** | No planning doc with that fan-out was found. Thread 6 of `G:ledger` (scout detection and cadence) holds 16 experiments, which fits one lane of it. |
| P6 | Agents ran experiments during the day "while I was busy doing other things" | **Founder testimony (D10)** | Consistent with [arc E] (lanes, reviewer tiers, commit-early rule), not separately timed. |

### Questions for Gerald (the story is not changed)

1. **The ~500 ms.** The record has about 375–692 ms for one identify round trip in September (E88,
   09-11), fires several seconds apart (p50 6.2 s), and a 6–15 s identify at the scout's launch
   (08-18). Is "about once every 500 ms" the round-trip time, the rate the overlay changed, or a
   period we haven't mined? If it's the round trip, slide 2 can say "each result took about half
   a second" and match the record exactly.
2. **"Nearly 100 … all replaying the same data."** The ledger has about 150 experiment docs, so
   "nearly 100" is safe. They replayed several frozen corpora (335 crops, 426 crops, fire records),
   and some weren't replays at all. Which set is the "nearly 100": the scout detect/identify
   experiments only, or the whole track? Both are fine; the slide should say which.
