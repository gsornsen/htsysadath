---
marp: true
theme: dark
size: 16:9
html: true
paginate: true
---

<!-- _class: lead -->
<!-- _paginate: false -->

# How to scale yourself
## and do all the things

Orchestration, gates and experiments, and which one fits which problem.

Gerald Sornsen · github.com/gsornsen/htsysadath

<!--
Hi, I'm Gerald. This talk is about what to do at a fork in the road: when a hard problem lands in
the middle of a project and your instinct says push through. I'm going to show you how I apply
three things, orchestration, gates and experiments, and which method fits which kind of problem.
It's my own project, told in first person. Everything I claim is in a public repo with its source,
so you can check me [D1; D16]. But first, let me show you where it ended up.
-->

---

<!-- _class: demo -->

## Demo 0

<span class="stage-target">the scout, live →</span>

<!--
This is the scout. It's a browser extension that identifies trading cards on live auction streams
[arc B]. Watch the card on screen. The extension cuts one padded crop, the server turns it into an
embedding, and an image search comes back with the three most likely cards [abstract; D12;
top3-traj]. It lands, and it stays put. No flicker, no changing its mind. In August this took
somewhere between six and fifteen seconds, and then it flapped on screen [arc B; D14]. The rest of
this talk is how it got from there to here, and which method did what.

**Stage (2.0 min, Demo 0).**
1. Before the talk: load the demo build in the presenting browser and point it at the dev stack;
   confirm the stack answers from the venue network; open a stream tab with cards on screen.
   ⟨from demo lane: the exact build, the single-crop setting, the health check and the stream to
   use⟩.
2. On this slide, switch to the stream tab. Wait for a card. Point at the overlay as it identifies,
   then leave it alone for a few seconds so the room sees it hold.
3. If a card is wrong, say: "That's one of the misses. I'll show you how often that happens."
   (Slide 11 has the number.) Don't retry on stage.
4. Fallback: if the stream or the stack isn't answering within 15 s, play the recorded clip, a
   local file that is not in the repo, and say it's recorded. Never present it as live.
5. Return to the deck, slide 3.
-->

---

<!-- _footer: "Source: mining/arcs/B-pivots.md (bakeoff 3f5eabd7e, 08-18; SigLIP 423e2e894, 08-20); EXP-E88 (09-11); D12, D14" -->

## How we got here

Identify: 6–15 s live in August → under half a second by September 11.

![](assets/diagrams/identify-timeline.svg)

<!--
Here's the whole trip on one line. In August the scout's identify was an LLM vision call: six to
fifteen seconds live, and a 10.4-second median when we benchmarked it overnight on August 18th
[arc B; G:3f5eabd7e · 08-18]. Two nights later an image-embedding model won on speed, at 44 ms
[arc B; G:423e2e894 · 08-20]. By September 11th one identify round trip was about 375 ms at the
median [P1]. Along the way there were seven places that, in my experience, could each have eaten
weeks: latency, the jitter, accuracy across languages, the crop policy, labeling throughput,
knowing when the UI was done, and measuring the right bar [arc B; D14; arc A; D12; D7; arc C;
lot-top3]. None of them did. The rest of this talk is why.
-->

---

<!-- _class: story -->

## The first sign

> Identify got fast enough to flap. That was the first sign we were onto something.

![](assets/diagrams/jitter-before-after.svg)

<!--
Here's the moment I now think of as the first sign we were onto something. It didn't feel like
it. On September 2nd I ran my first instrumented live session, and the scout was locking and
unlocking at least once a second. When it didn't clobber itself, it identified well
[G:70b2f1b9e · 09-02; D14]. On screen it was super jittery, not close to usable. But everything
under the presentation layer looked promising [abstract]. It could only flap because identify had
got fast enough to change its mind [D16]. The question had moved from "can this work at all" to
"which of many fixes".
-->

---

<!-- _class: story -->

## The fork

> Every area fanned out into parts, and every part into experiments. The old move: pick the fix I know, and push.

![](assets/diagrams/fork-tree.svg)

<!--
And that's a fork. I could attack the jitter from three areas: the UI, card detection, or how we
generate embeddings. Each area had at least three parts of the system to explore, and each part
about five experiments [abstract]. That's forty-five forks or more for one bug, and that grid is my
own count, not something in the record [P5]. Every project is boxed by scope, staffing and
timeline [brief]. Identify still wasn't fast enough end to end to win an auction, and the project
had come close to being parked [D4]. So the old move is obvious: pick the fix I know best, push
through, and hope.
-->

---

## What changed

<p class="testimony">“About half an hour a day of my time, setting agents up for the night.” <cite>my estimate</cite></p>

![](assets/diagrams/experiment-loop.svg)

<span class="kickoff">$ demo/fanout</span>

<!--
What changed wasn't a smarter model. It was three steps. Instrument the key transitions, so I
could see where it flapped: PostHog events, plus a record of every fire [P2; G:1267e680e · 08-22;
G:3c52c2b72 · 09-04]. Replay that data offline, so an experiment doesn't need a live stream [P2].
Then run gated experiments, each in its own git worktree, many of them overnight [P3; P4]. When a
gate cleared, the work merged and the next experiment unlocked [abstract; P4]. That came to about
a hundred experiments in two weeks [D13]. My part was about half an hour a day, spread out, setting
agents up for the night. That's my estimate, not a measurement [D16]. To show it on something
small, I'm starting four writers on my rough abstract, now [D10].

**Stage (Demo 1 kickoff, inside the 2.5 min).**
1. Switch to the terminal, already in the demo clone at tag `talk-demo`, prompt `$ `, 28 pt
   [plan §1, §4].
2. Run `demo/fanout`. Say while it starts: "Executive, engineer, designer, product manager. Each
   gets my rough draft and a persona brief."
3. When the four lane lines appear (about 30 s), say: "They'll be done long before we need them."
   Return to the deck, slide 7.
4. If the lanes haven't started after 15 s, don't debug on stage. Say "I'll show you the recording
   when we get there" and go on. The fallback is Gerald's ~2-minute video at slide 16 (D10).
-->

---

<!-- _footer: "Source: EXP-E19 (Grailith, 09-05), via decisions.md D14" -->

## Jitter, resolved

Answers thrown away per 100: 35.8 → 15.4 → 0.14, measured against a control.

![](assets/charts/jitter-drops.svg)

<!--
So here's how the jitter story ends, early. On September 5th we measured it against a control, in
an experiment called E19 [D14]. The data showed us where it was flapping. A 3× faster server cut
thrown-away answers from 36 to 15 in every 100; then one behaviour change, cancel the request but
keep the answer, took it to about 1 in 700. Three days from the first instrumented complaint
[D14; E19: 35.8 → 15.4 → 0.14 per 100]. Both levers get credit. Crediting only the behaviour
change would overclaim [D14]. And one of my three areas, the embedding model, never needed an
experiment for the jitter at all [D14].
-->

---

## Which method fits which problem

Problem type → method → the slide where you'll see it.

![](assets/diagrams/methods-map.svg)

<!--
Before the details, here's the map. Different kinds of problem want different methods. A fork
with many plausible fixes wants orchestration: parallel lanes with gates [arc E]. An idea you want
to be true wants a kill line, written before the run [arc A]. "Is it good enough?" wants the bar
measured in the product's own units [lot-top3]. A long list of possible work wants gates that let
you stop [G:ledger]. One hard piece that several things depend on: solve it first [D11]. "Is the UI
done?" wants personas as a done gate, and your own hands last [arc C]. Repetitive judgment work:
agents first, a human verdict [arc F]. A document for mixed readers: persona drafts [D4]. One
slide each.
-->

---

<!-- _footer: "Source: this repo's merge log; mining/arcs/E-coordinator.md" -->

## Method: orchestration

**Lane:** one task, its own worktree. **Gate:** pass/fail, written first. **Reviewer:** one tier up.

![](assets/charts/e-lane-dag.svg)

<!--
Orchestration first, because everything else ran on it. One senior session, the coordinator,
writes the brief: files, acceptance tests, what's off limits. Cheaper models build to it, each in a
lane: one task, its own branch and worktree, so lanes never collide [arc E]. A gate is a pass/fail
check written before the work. The reviewer always sits one tier above whoever built it, never a
peer [arc E]. Lanes commit early, because a usage limit killed three build lanes mid-work on
September 7th [arc E]. That night at eleven I asked what was prepped to run, and the queue ran on
its own until seven the next morning [P4; G:backlog]. This chart is this talk repo's own lanes. It
isn't free: an early rule letting the swarm steer itself broke the next day [arc E].
-->

---

<!-- _footer: "Source: mining/arcs/A-experiments.md; mining/findings/E67-top3-replay.md" -->

## Method: kill lines

De-duplicating the index hit its pre-written kill line; a small language head shipped instead.

![](assets/charts/d4-arms.svg)

<!--
Kill lines are for the idea you want to be true. Japanese cards were scoring higher similarity than
English ones, and a census found 96 % of 19,258 Japanese renders had an English twin with
identical art [arc A]. My instinct was to de-duplicate the index. The kill line was written down
before the run. De-duplication lost 14.43 points of top-1, and the kill fired [arc A]. Scoring past
it, keeping the flat index and adding a small language head lifted top-1 from 67.66 % to 77.61 % on
201 test crops: 20 fixed, none broken [arc A; E67-top3]. It shipped on September 9th [arc A]. The
idea I expected to win lost, and that loss found the change we shipped.
-->

---

<!-- _footer: "Source: mining/findings/E67-top3-replay.md; mining/findings/lot-top3-unlocked.md (n = 87 lots)" -->

## Method: measure the bar

The gain halves at top-3; on live lots, the right card is in the top 3 about two times in three.

<div class="pair">

![](assets/charts/d4-slope.svg)

![](assets/charts/lot-bar.svg)

</div>

<!--
But top-1 isn't my bar. My bar is top-3: the right card somewhere in the picker's three
candidates [top3-traj]. Replayed at top-3, after checking the replay reproduced the top-1 numbers
exactly, the same win goes from 83.58 % to 89.05 %. Real, but plus 5.47 points, not 9.95
[E67-top3]. Then the bar that matters, live lots. Of all 87 truth lots in the record, the scout
didn't auto-lock 69, and on those the right card was in the top 3 in 45. That's 65.2 %, with an
interval of 53 to 75 % [lot-top3]. The truth is my own taps, one tapper, five days of streams
[lot-top3]. About two in three. Not done, but measurable, and I know which number to move.
-->

---

## Method: stop things

- An encoder swap: 9.55 points down. Stopped.
- A fine-tune and a distilled student: both failed their bars.
- Re-embedding the reference art: never started.
- Paying for more Japanese art: zero lift, not scaled.

<!--
Gates pay off as much in what they let you stop. We stopped a SigLIP2 encoder swap that came in
9.55 points down [G:ledger · E57]. The fine-tune and the distilled student both failed their bars
[G:ledger · E58, E53d]. We never re-embedded the reference art [G:ledger · E12, E39]. And paying for
more Japanese art showed zero lift, so we didn't scale it [G:ledger · E119]. A lot of the hundred
experiments were like these: they saved time by returning a clean no, and nobody had to argue
about it afterwards.
-->

---

<!-- _footer: "Source: decisions.md D11; mining/arcs/B-pivots.md (08-20, 09-02, 09-03)" -->

## Method: hardest shared core first

One identify core for bulk scan and the scout; the LLM came out of both.

![](assets/diagrams/shared-core.svg)

<!--
Some problems aren't forks; they're foundations. Identify was the hardest part of the whole system,
and two apps needed it: bulk scan and the scout. Every app like them I'd tested was slow and
inaccurate [D11]. So I solved it once, as a shared core, and built both apps around it. Bulk scan
got the embedding-first lane on August 20th, the scout on September 2nd, and the old LLM identify
was retired from both on September 3rd [D11; G:5f76f4810 · 08-20; G:06119bc92 · 09-02;
G:0d12da755 · 09-03]. The embedding became a ranker, never the authority on its own [arc B]. Solve
the hardest shared piece first, and you're free to focus elsewhere [D11].
-->

---

<!-- _footer: "Source: mining/arcs/C-personas-review.md (09-13 21:50 → 09-14 09:40)" -->

## Method: personas as the done gate

<div class="gate-row">
<div class="gate-card">

**Brief · Dez:** 22, phone-only, one thumb. Job: “swipe-fast, not homework.”

**Panel:** DONE.

<p class="testimony">“Pretty much unusable.” <cite>me, on my iPhone, next morning</cite></p>

</div>

![](assets/shots/c-founder-mobile-01-crop.png)

![](assets/shots/c-founder-mobile-03.png)

</div>

<!--
For design, the gate is people, or stand-ins for them. On September 13th I made a design panel the
done gate: four fictional personas, each a short brief with a device and a job, plus three critics
[arc C]. Dez is 22, phone-only, one thumb. The panel re-walks the built screens and returns DONE or
NOT. Dez went from 30 seconds a task to 9, simulated, not human [arc C; arc F]. Then the gate
failed. The panel said DONE on the phone at 21:50. At 09:40 the next morning I opened the deployed
app on my own iPhone, and it was pretty much unusable: three scrolling sections, a help modal on
every task, rotating the phone to reach options [arc C]. The panel walked a fixed viewport [arc C].
It's necessary. Your own hands on the real device are the last gate.
-->

---

<!-- _footer: "Source: decisions.md D7; mining/arcs/F-agent-labeling.md (E84)" -->

## Method: agents first, human verdict

<p class="testimony">“I timed myself on the first labeler build.” <cite>testimony</cite></p>

![](assets/charts/f-two-levers.svg)

<!--
Labeling is repetitive judgment work. By hand it took me about three minutes a label. That's my own
stopwatch on the first labeler build; the message isn't in the record we mined [D7]. With agents
doing the first pass, that dropped to 11 to 16 seconds of agent wall time [arc F]. Then my review,
after a persona-driven redesign of the review screen, took about 20 to 30 seconds [D7; arc F]. The
fair total is about 31 to 46 seconds end to end, agent plus review [D7]. Two levers: agents took
the first pass, and a redesign made my verdict fast. Crediting agents alone would overclaim [D7].
-->

---

<!-- _class: demo -->

## Method: persona drafts · Demo 1 reveal

<a href="http://localhost:8090/" target="_blank">Four drafts of my abstract →</a>

<img src="assets/diagrams/hybrid-layers.svg" class="chart-demo" />

<!--
Remember the four writers I started back at the beginning? Here's what they did with my rough
abstract [D10]. Each got my draft and one persona brief: executive, engineer, designer, product
manager. I'll read the first line of each, not the whole draft. Then I pick a hybrid, out loud: the
tl;dr from whichever says it clearest, the drill-down order from whichever structures the detail
best, and one cut [D4]. That's the rule: a tl;dr the busy reader finishes, drill-down beneath for
whoever needs detail. It replaced docs too long to be read, which forced the very meetings the doc
was meant to replace [D4]. I'm not grading four drafts. I'm assembling one.

**Stage (4.5 min, Demo 1 reveal).**
1. Click the link on the slide; switch to the viewer tab on `localhost:8090`, opened before the
   talk [plan §1].
2. Show the rough draft on the left for five seconds, then the four columns. Read the first line
   of each column aloud and name the persona.
3. Choose aloud: tl;dr frame from draft X, drill-down order from draft Y, one cut. No audience
   vote (plan Q8).
4. If a lane hasn't finished or the viewer is blank after 15 s, say "Here's the same run, recorded
   earlier" and play Gerald's ~2-minute video (D10). Say it's recorded. Never present it as live.
5. Back on the slide, point at the diagram: tl;dr on top, drill-down beneath. Then slide 17.
-->

---

<!-- _class: demo -->

## Demo 2 · this repo, overnight, replayed

<div class="terminal-note">$ git log --graph --oneline main</div>

<!--
This talk was built the same way, and the log is public. I'll show you the choreography, not the
details. Stop one: the mining lanes, one per story arc, fanning out and merging back, each merge
message saying what was learned [e29c1d8; a504755; e37492e]. Stop two: the plan, written in two
rounds, four lanes dividing the work and then converging [82e7361; 9cac896]. Stop three: review.
Each mined arc was reviewed by a model one tier above the one that wrote it; then four persona
critics walked the deck, and three revision lanes merged back [a0641ea; 6b0d9b9; 716cd12; 3822e14;
f28411d; 2ecd64c; 2d4d8fe]. Every lane had a brief, a gate and a reviewer. The calls that needed a
human came to me, and they're in the decision log [D1–D16].

**Stage (2.0 min, Demo 2). First to cut if time runs short.**
1. Switch to the terminal, in the demo clone on `main`.
2. Aliases only; no typing, no network [plan 02]. The graph is `git log --graph --oneline main`,
   never `--all`, so no worktree branches show [plan 02].
3. Stop 1 at `e29c1d8`, `a504755`, `e37492e`; stop 2 at `82e7361` → `9cac896`; stop 3 at
   `a0641ea`, `6b0d9b9`, then `716cd12` … `3822e14`, then `f28411d`, `2ecd64c`, `2d4d8fe`. Read the
   one-line subject at each stop; don't scroll bodies, and don't stop on the correction merges
   (the D-log stays in the repo, not on stage, D16).
4. ⟨Quote the commit count on main on the day.⟩
5. Fallback: go back to slide 9's lane chart and narrate it. Then slide 18.
-->

---

## Against paralysis

- An evidence threshold, written before the run.
- A time box and a budget.
- “Go both” when it’s reversible.
- A log of the paths not taken.

<!--
Cheap exploration can turn into analysis paralysis dressed up as rigor. To be honest, the record
names that risk, but I couldn't find a dated incident of it [arc E]. What kept it in check were four
habits. An evidence threshold written before the run, like the de-duplication kill line [arc A]. A
time box and a budget: the labeling agent was capped at 8 calls, 60 seconds and $6 a run [arc F].
"Go both" when it's reversible: the language head shipped first as a shadow ranker next to the
served one [G:ledger · E65a]. And a log of the paths not taken, which is the stop list you saw.
Decide on the evidence you have, and write down why.
-->

---

## Two things for next week

1. **Persona-draft your next doc.**
2. **Run your next fork as two gated lanes.**

github.com/gsornsen/htsysadath · starter kit: starter/

<!--
Here's what I'd tell a colleague. When you come to the next fork in the road, ask how you could get
an answer while you focus on something else [abstract]. So, two things for next week. One:
persona-draft your next doc. A few short briefs, a draft from each, and you assemble the hybrid
[D4]. Two: run your next fork as two gated lanes. Write the gate first, put each option in its own
worktree, and let a stronger model review before you merge [arc E]. Give agents the right context,
autonomy and guardrails, and they work like extra copies of you [abstract]. It's all in the repo,
with a starter kit in `starter/`. Thanks.
-->

---

<!-- _class: backup -->

## Backup · cost, hours, hold-out

- **Cost:** all Claude work within a Claude Max subscription; the only metered model spend was the labeling pilots, ~$9 for 760 tasks.
- **Hours:** ~30 minutes a day, spread across the day, setting agents up for overnight runs: my estimate.
- **Held out:** the language head trained on catalogue images only, its one knob set on a separate dev split; none of the 201 test photos in any of it.

<!--
Q&A only. All of the Claude work ran within my Claude Max subscription. The only metered model spend
in the record is the labeling pilots: about $9 for 760 tasks [D13]. My own time was about thirty
minutes a day, spread across the day, setting agents up for overnight runs. That's my estimate;
nothing in the record measures it [D16]. And the question I get about slide 10, held out? Yes. The
language head never saw a real photo while it trained: catalogue images only, its one knob set on a
separate dev split, and none of the 201 test photos in any of that [D14]. If pressed: it has seen
the catalogue image of the true card, which is the gallery, known at inference, not leakage [D14].
-->

---

<!-- _class: backup -->
<!-- _footer: "Source: mining/findings/top3-trajectory.md; mining/findings/lot-top3-unlocked.md" -->

## Backup · four yardsticks

We measured top-3 four ways; you can't draw one line through them.

![](assets/charts/top3-measures.svg)

<!--
Q&A only, if someone asks "so what is the accuracy?". We measured top-3 four different ways, and
they don't agree. Crops as served: 78.2 %. The same crops scored offline: 74.3 %. A six-crop
consensus proxy: 70.3 % up to 82.9 %. And live lots, pooled: 71.3 %, with 65.2 % on the lots that
never auto-locked [top3-traj; lot-top3]. Four yardsticks. You can't draw one trend line through
them, which is why slide 11 picks one bar and says which [lot-top3].
-->
