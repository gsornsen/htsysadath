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
It's my own project, told in first person. Every claim I make is written up in a public repo with
where it came from, so you can trace it [D1; D16]. But first, here's where it ended up.
-->

---

## The scout today

A card on a live auction stream, identified.

![](assets/shots/scout-gengar-today.jpg)

<!--
This is the scout, today. It's a browser extension I built that identifies trading cards on live
auction streams [arc B]. A card comes up on the stream, and the scout's overlay says which card it
is, here Gengar, Stormfront 18 of 100: my capture beside the reference art, then the raw prices by
condition and the graded comps. The usernames are pixelated; the rest is as it looked [D17]. What
you can't see in a still is the part I care about: it lands and it stays put. In August the same
step took somewhere between six and fifteen seconds, and then it changed its mind on screen
[arc B; D14]. I'll show it to you live in a few minutes. First, how it got here.
-->

---

<!-- _footer: "Source: mining/arcs/B-pivots.md (bakeoff 3f5eabd7e, 08-18, n = 6; SigLIP 423e2e894, 08-20); EXP-E88 (09-11); D14, D18" -->

## How we got here

Identify, as the client sees it: 6–15 s in August → 375 ms by September 11.

![](assets/diagrams/identify-timeline.svg)

<!--
Here's the whole trip on one line, and both ends measure the same thing: identify latency as the
client sees it, from sending the card to getting an answer back. In August identify was an LLM
vision call: six to fifteen seconds live, and a 10.4-second median in the August 18th bakeoff,
though that median is only six captures [arc B; G:3f5eabd7e · 08-18]. Two nights later an
image-embedding model won on speed [arc B; G:423e2e894 · 08-20]. By September 11th the client's
round trip was about 375 ms at the median [P1]. Along the way there were seven places that, in my
experience, could each have eaten weeks: latency, the jitter, accuracy across languages, the crop
policy, labeling throughput, knowing when the UI was done, and measuring the right bar [arc B; D14;
arc A; D18; D7; arc C; lot-top3]. The rest of this talk is how each one went, and which method it
took.
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

<!-- _class: changed -->
<!-- _footer: "Source: decisions.md D13 (cost, ~100 experiments), D14 (3 days), D16 (my estimate); talk/notes.md P2–P4" -->

## What changed

<p class="defs"><b>Worktree:</b> each lane’s own copy of the code · <b>Gate:</b> a pass/fail bar, set first · <b>Flag:</b> off in prod until I flip it</p>

![](assets/diagrams/experiment-loop.svg)

<p class="costline"><span class="testimony">~30 min a day of my time <cite>my estimate</cite></span> · a flat Claude Max subscription<br>~100 experiments in two weeks · the jitter fixed in 3 days</p>

<!--
What changed wasn't a smarter model. Three words first. A worktree is a second checkout of the same
repo, so two agents never edit the same files. A gate is a pass-or-fail bar written before the
run. A flag is a switch that keeps new code off in production until I turn it on. Then the loop:
instrument the key transitions and record live sessions [P2; G:1267e680e · 08-22; G:3c52c2b72 ·
09-04], replay them offline [P2], and run gated experiments in worktrees, many overnight [P3; P4].
When a gate cleared, the work merged and the next experiment unlocked [P4]. The cost, along the
bottom: about half an hour a day of my time setting it up, which is my estimate, not a measurement,
and it doesn't count mornings reading results [D16]. A flat Claude Max subscription; the only
metered spend was about $9 of labeling calls on another provider [D13]. About a hundred experiments
in two weeks [D13]. The jitter, fixed in three days [D14].
-->

---

<!-- _footer: "Source: EXP-E19 (Grailith, 09-05), via decisions.md D14" -->

## Jitter, resolved

Answers thrown away per 100: 35.8 → 15.4 → 0.14 against a control, in 3 days.

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

<!-- _class: demo -->

## Demo · the card scout, live

<span class="stage-target">the scout, live →</span>

<!--
Enough history. Here it is, live, on a real stream. The extension cuts a few candidate boxes around
the card, each one is matched against the catalogue, and the boxes vote on the answer [D18;
G:3079bbc68 · 09-02]. Even that was a fork the experiments settled, and not the way I first read
it. One experiment showed that a little extra margin around a single box helps. It never showed
that one box beats the vote, and when we replayed recorded sessions without the vote, it locked
wrong cards [D18; D12]. So we kept both: a little margin, and the vote [D18]. Watch the card. It
identifies, and it holds. If it misses, that's the one in three I'll show you in a few minutes
[lot-top3].

**Stage (5.0 min, the live demo).**
1. Before the talk: load the dev-box build in the presenting browser with the vote ON
   (`cropMode: "proposals"`) and point it at the dev stack; confirm the stack answers from the
   venue network; open a stream tab with cards on screen [D18]. The build: Grailith branch
   `demo/scout-single-crop` at `7e38ca42`, v0.4.37, loaded unpacked (disable the regular scout
   build first, or every card fires twice). Options → the dev-box preset. Sign in to the dev web
   app in the same browser profile. The vote is the default; nothing to set [D18]. Health: the dev
   stack's `/api/health` answers 200 from the venue network. Stream: any live show with cards on
   screen. Afterwards, park the tab on about:blank, because an idle live tab keeps spending
   pricing calls [gates-and-flags].
2. On this slide, switch to the stream tab. Wait for a card. Point at the overlay as it identifies,
   then leave it alone for a few seconds so the room sees it hold. Let two or three cards go by.
3. If a card is wrong, say: "That's one of the misses." Don't retry on stage.
4. Fallback: if the stream or the stack isn't answering within 15 s, play the recorded clip, a
   local file that is not in the repo, and say it's recorded. Never present it as live. Slide 2's
   screenshot is the last resort.
5. Return to the deck, slide 9.
-->

---

## Which method fits which problem

Problem → method → the slide where you'll see it.

![](assets/diagrams/methods-map.svg)

<!--
Now the methods, because the jitter was one fork of many, and they didn't all want the same tool.
This map is the rest of the talk, in order. Too many forks and one of you: lanes, with a reviewer
one tier up, slide 10 [arc E]. Runs you can't watch: gates and flags, 11 [gates-and-flags]. A
favourite idea: a kill line written before the run, 12 [arc A]. "Is it better?": measure the bar
that matters, 13 and 14 [E67-top3; lot-top3]. Too much to try: let the gates tell you what to
stop, 15 [G:ledger]. One hard core under many products: solve it once, first, 16 [D11]. "Is the
UI done?": a persona review gate, 17 [arc C]. Repetitive judgment work: agents first, a human
verdict, 18 [arc F].
-->

---

<!-- _class: orch -->
<!-- _footer: "Source: this repo's merge log; mining/arcs/E-coordinator.md; decisions.md D2" -->

## Method: orchestration

<p class="defs"><b>Coordinator:</b> my strongest model; it writes briefs and judges results, never builds<br><b>Lane:</b> one task, own worktree · <b>Gate:</b> pass/fail, written first · <b>Reviewer:</b> one tier up</p>

![](assets/charts/e-lane-dag.svg)

<!--
Orchestration first, because everything else ran on it. The coordinator is one session on my
strongest model, Fable. It writes the briefs and judges the results; it doesn't build [D2; arc E].
A lane starts as a new git worktree and branch, with one Claude Code session in it, handed a brief:
the files, the acceptance test, what's off limits [arc E]. Cheaper models build in the lanes, so
lanes never collide. The gate is written before the work, and the reviewer always sits one tier
above whoever built it, never a peer [arc E]. Lanes commit early, because a usage limit killed
three build lanes mid-work on September 7th [arc E]. This chart is this talk repo's own lanes. It
isn't free: an early rule letting the swarm steer itself broke the next day, and I had to keep
correcting it [arc E].
-->

---

<!-- _footer: "Source: mining/findings/gates-and-flags.md (Grailith backlog + ledger; EXP-E67; EXP-E84 labeling agents; 09-05 → 09-09)" -->

## Method: gates and flags

Unattended runs: gates decide the merge; flags keep it reversible.

![](assets/diagrams/gates-flags.svg)

<!--
Here's what let experiments run while I slept. I hand over a window with an end time, then six
things, in the order of the numbers [gates-and-flags]. One: before the run, a pass-or-kill bar is
written down; E67's fired. Two: the change sits behind a flag, on in dev, off in prod. Three: every
run is capped on tool calls, time and money. The example here is my labeling agents: 8 calls, 60
seconds, $6 a run, raised to 14 calls when they hit the wall. Four: guard rails. Production refuses
unsafe config at boot, and a watchdog parks idle tabs. Five: gates are judged offline, on frozen,
recorded data. Six: the gate passes, the change merges, and the next experiment unlocks. In the
morning I get one file with the calls only I can make, like flipping production; the language head
went live that way on September 9th [gates-and-flags]. It isn't airtight. Before that watchdog, an
idle tab burned a full day's API allowance overnight [gates-and-flags].

**Stage (4.0 min).** This is the focus slide. Slow down. The six boxes snake, so follow the
numbers, not left to right, and point at each box as you say its number. Don't quote any credit or
dollar amount for the idle tab; "a full day's allowance" is the line.
-->

---

<!-- _footer: "Source: mining/arcs/A-experiments.md (E67: kill fired; language-head arm added after it, same 201-crop split); mining/findings/E67-top3-replay.md" -->

## Method: kill lines in action

My favourite idea hit its kill line. What shipped was found after the kill, on the same test crops.

![](assets/charts/d4-arms.svg)

<!--
Kill lines are for the idea you want to be true. Japanese cards were scoring higher similarity than
English ones, and a census found 96 % of 19,258 Japanese renders had an English twin with
identical art [arc A]. My instinct was to de-duplicate the index. The kill line was written down
before the run. De-duplication lost 14.43 points of top-1, and the kill fired [arc A]. Then,
after the kill, we tried one arm that wasn't in the plan: keep the flat index and add a small
language head. On the same 201 test crops it lifted top-1 from 67.66 % to 77.61 %: 20 fixed, none
broken [arc A; E67-top3]. Found after the kill, on the same split, it's a lead, not proof. It went
out behind a flag, and prod flipped only after a replay: 12 fixed, none broken
[gates-and-flags]. The idea I expected to win lost, and that loss found the change we shipped.
-->

---

<!-- _footer: "Source: mining/findings/E67-top3-replay.md (201 test crops; replay reproduces top-1 exactly)" -->

## Method: measure the bar · top-3

Score what the user sees, and the win halves: +9.95 → +5.47 points.

![](assets/charts/d4-slope.svg)

<!--
But top-1 isn't my bar. My bar is top-3: the right card somewhere in the three candidates the
scout offers [top3-traj]. We replayed the same test at top-3, after checking the replay
reproduced the top-1 numbers exactly. The same win goes from 83.58 % to 89.05 %. Real, but plus
5.47 points, not 9.95 [E67-top3]. Half the gain disappears once you score what the user actually
sees.
-->

---

<!-- _class: live -->
<!-- _footer: "Source: mining/findings/lot-top3-unlocked.md (87 lots I tapped over five days; one tapper)" -->

## Method: measure the bar · live lots

<p class="defs"><b>Auto-lock:</b> the scout commits to one card on its own · <b>Top-3:</b> when it doesn't, the right card is among the 3 it offers</p>

![](assets/charts/lot-bar.svg)

<!--
So, the bar that matters: live lots. Two words. Auto-lock means the scout commits to one card on
its own. When it doesn't, it shows three candidates, and I want the right card among them. Of all
87 lots where I tapped the truth, the scout auto-locked 18, and it was right on 16 of those. It
didn't lock 69, and on those the right card was in the top 3 in 45. That's 65.2 %, somewhere
between about 53 and 75 % given how few lots there are [lot-top3]. The truth is my own taps: one
tapper, five days of streams, and almost all English cards, so the Japanese side is barely tested
[lot-top3]. About two in three. Not done, but measurable, and I know which number to move.
-->

---

<!-- _footer: "Source: Grailith experiment ledger, 09-18 (E57, E58, E53d, E12, E39, E119)" -->

## Method: stop things

- A newer image encoder: 9.55 points down. Stopped.
- A fine-tune and a smaller distilled model: both failed their bars.
- Re-embedding the reference art: never started.
- Paying for more Japanese art: zero lift, not scaled.

<!--
Gates pay off as much in what they let you stop. We stopped a newer image encoder that came in
9.55 points down on the test set [G:ledger · E57]. A fine-tune and a smaller distilled model both
failed their bars [G:ledger · E58, E53d]. We never re-embedded the reference art [G:ledger · E12,
E39]. And paying for more Japanese art showed zero lift, so we didn't scale it [G:ledger · E119].
A lot of the hundred experiments were like these: they saved time by returning a clean no, and
nobody had to argue about it afterwards.
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

<!-- _footer: "Source: mining/arcs/C-personas-review.md (P0 and P1 verdicts, 09-13; bug ledger B19, 09-14 09:40)" -->

## Method: persona review gates

The panel said DONE. My own phone said no. Real device before DONE.

![](assets/diagrams/persona-gate.svg)

<!--
For UI and design work, "done" needs a gate too, and code-done isn't it. On September 13th I made a
design panel the done gate: four fictional personas, each a short brief with a device and a job,
plus three critics [arc C]. Here's Dez: 22, phone-only, one thumb, and the job is "swipe-fast, not
homework". The panel walks the built screens and returns DONE or NOT. For Dez, a task went from 30
seconds to 9, simulated, not a human [arc C]. Then the gate failed. The panel said DONE on the
phone at 21:50. At 09:40 the next morning I opened the deployed app on my own iPhone, and it was
pretty much unusable: three scrolling sections, a help modal on every task, rotating the phone to
reach options. The panel had walked a fixed viewport [arc C]. The record's fix was another panel
pass [arc C]. The rule I take from it, and the one in the starter kit: a real-device check before
DONE [starter].
-->

---

<!-- _footer: "Source: decisions.md D7; mining/arcs/F-agent-labeling.md (E84)" -->

## Method: agents first, human verdict

<p class="testimony">“I timed myself on the first labeler build.” <cite>testimony</cite></p>

![](assets/charts/f-two-levers.svg)

<!--
Labeling is repetitive judgment work. By hand it took me about three minutes a label. That's my own
stopwatch on the first labeler build; the message isn't in the record we mined [D7]. With agents
doing the first pass, that dropped to 11 to 16 seconds of agent wall time, and the agent was boxed
in: 8 calls, 60 seconds and $6 a run at most [arc F]. Then my review, after a persona-driven
redesign of the review screen, took about 20 to 30 seconds [D7; arc F]. The fair total is about 31
to 46 seconds end to end, agent plus review [D7]. Two levers: agents took the first pass, and a
redesign made my verdict fast. Crediting agents alone would overclaim [D7].
-->

---

<!-- _class: close -->

## Two things for next week

1. **Run your next fork as gated experiments that can run unattended.**
   <span class="step">First step: before you pick a fix, write the kill bar, give each option a worktree, put it behind a flag. → `starter/two-lanes/` · `starter/two-lanes/unattended.md`</span>
2. **Put a persona review gate in front of “done” for UI and design work.**
   <span class="step">First step: write three persona briefs (a device, a job), have an agent walk the build, then use your own phone. → `starter/persona-gate/`</span>

<p class="testimony">“Before we pick a fix, let’s write down what would kill each option, run three of them overnight, and ship the winner behind a flag.” <cite>my framing: one sentence for your boss</cite></p>

github.com/gsornsen/htsysadath · starter kit: `starter/`

<!--
Here's what I'd tell a colleague. At the next fork, ask how you could get an answer while you focus
on something else [abstract]. So, two things. One: run your next fork as gated experiments that can
run unattended. First step: before you pick a fix, write the kill bar, give each option its own
worktree, and put it behind a flag. `starter/two-lanes/` has the lane brief, and `unattended.md`
has the flags, caps and the morning report [starter; gates-and-flags; arc E]. Two: put a persona
review gate in front of "done". First step: write three persona briefs, each a device and a job,
have an agent walk the build, then pick it up on your own phone. That's `starter/persona-gate/`
[starter; arc C]. And if you need one sentence for your boss, this is how I'd put it; it's my
framing, not a finding. It's all in the repo. Thanks.

**Stage.** Read the boss sentence on the slide aloud as written; don't paraphrase it into a claim.
-->

---

<!-- _class: backup -->
<!-- _paginate: false -->

## Backup · cost, hours, hold-out

- **Cost:** all Claude work within a Claude Max subscription; the only metered model spend was the labeling pilots, ~$9 for 760 tasks on another provider.
- **Hours:** ~30 minutes a day, spread across the day, setting agents up for overnight runs: my estimate.
- **Held out:** the language head trained on catalogue images only, its one knob set on a separate dev split; none of the 201 test photos in any of it.

<!--
Q&A only. All of the Claude work ran within my Claude Max subscription. The only metered model spend
in the record is the labeling pilots: about $9 for 760 tasks, on another provider [D13]. My own
time was about thirty minutes a day, spread across the day, setting agents up for overnight runs.
That's my estimate; nothing in the record measures it, and it doesn't count mornings reading
results or checking on my phone [D16]. And the question I get about slide 12, held out? Yes. The
language head never saw a real photo while it trained: catalogue images only, its one knob set on a
separate dev split, and none of the 201 test photos in any of that [D14]. If pressed: it has seen
the catalogue image of the true card, which is the gallery, known at inference, not leakage [D14].
-->

---

<!-- _class: backup -->
<!-- _paginate: false -->
<!-- _footer: "Source: mining/findings/top3-trajectory.md; mining/findings/lot-top3-unlocked.md" -->

## Backup · four yardsticks

We measured top-3 four ways; you can't draw one line through them.

![](assets/charts/top3-measures.svg)

<!--
Q&A only, if someone asks "so what is the accuracy?". We measured top-3 four different ways, and
they don't agree. Crops as served: 78.2 %. The same crops scored offline: 74.3 %. A six-crop
consensus proxy: 70.3 % up to 82.9 %. And live lots, pooled: 71.3 %, with 65.2 % on the lots that
never auto-locked [top3-traj; lot-top3]. Four yardsticks. You can't draw one trend line through
them, which is why slide 14 picks one bar and says which [lot-top3].
-->
