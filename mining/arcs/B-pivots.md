# Arc B — the pivots, as concurrent spines (per D5)

## 1. The arc in one paragraph

Grailith was never one project moving through four acts. From day two it had two spines,
single-card identify and comps [src: `f7a484e95`, `8b009b9f9` · 2026-07-04]. In one week in
August three more opened: Art Binder (08-13), the live Whatnot scout (08-18) and bulk
capture/lots (08-19). All five then ran side by side [src: `d93b68c35`, `e04b6433b`,
`0f6b04285`]. Each spine has its own decision moments, and most of them are the same move: a
number written down, a cheap test, a founder quote with a timestamp. The talk's thesis is that
agentic tools let one person run several threads at once. The record shows Gerald already was,
and it also shows where the tidy retelling ("pregrade → lots → live → comps") breaks down.

## 2. Pivotal moments, by spine

**Spine: live scout (08-18 → Sept).** The densest spine, and the one Gerald remembers.
- *08-18, build first, then decide.* Waves 1–3 shipped between 17:50 and 19:00. The SPADE came
  at 22:44, after the live runs showed the vision-LLM identify at 6–15 s. It set "~2s
  end-to-end … a gate, not a target." Its OCR spike cleared OCR as the cause (detection, frame
  choice and rotation were failing) and it recommended client-OCR first [src: `e04b6433b`,
  `8eb911a86`; docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md].
- *08-19, the plan revised by its own test.* An overnight 34-crop bakeoff killed the SPADE's
  pick: OCR had a 25 s median, vision 10.4 s, and embedding ran at ~130 ms. The architecture was
  rebuilt around embedding, with one fork left for the founder
  [src: docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md].
- *09-02/03, the 5-crop proposer.* One detectQuad crop was the presented card in 0/36 live
  frames. The fix cuts up to five card-shaped crops per fire and sends them in **one** identify
  request, and the server embed-searches every crop and keeps the best-scoring one. The ship gate
  was measured at 19 correct / 0 wrong, against 1 / 30 for the shipped path
  [src: `3079bbc68` 2026-09-02; `3b66e82cc` 2026-09-03].
- *09-07, what five crops cost.* A production incident traced to five concurrent embed-searches
  × 2 orientations = 10 forward passes per identify on one vCPU. The fix batched them and left
  "the founder's product number" (the 8 s deadline) untouched [src: `f5d6a6491` · 2026-09-07].
- *09-09, the founder calls it a hack.* 02:00 PDT, quoted in the experiment doc: the 5 crops
  were "a hack/optimization around poor accuracy prior to fixing catalog issues". Eleven minutes
  later E79b answered. On 41 human-truth scenes the vote scored 26/41 at 1,893 ms, and one crop
  with 17 px of padding scored 31/41 at 337 ms [src: docs/experiments/EXP-E79-single-crop-vs-proposal-vote-2026-09-09.md].
- *09-11 → 09-13, the bar moves.* On the fast box stack the founder found identify "super fast"
  and asked whether detection was still "a holdover from the 5-crop proposer and a slow
  identify". E88 measured first quad → fire at p50 218 ms / p95 401 ms and the round trip at
  375 / 692 ms [src: docs/experiments/EXP-E88-identify-timer-retune-2026-09-11.md]. Two days
  later his bar became **detection ≤ 1 s; identification = right card in the top 3 per lot**
  (session 403300ff · 2026-09-13 22:44). The 09-11 numbers meet the first half on the dev
  stack [inference: dev box, not production]. The second half turned it into a ranking problem,
  and the multi-crop set came back only to *order alternates*: top-3 went from 70.3 % to 82.9 %,
  and the crops were never used to pick identity
  [src: docs/plan/2026-09-13-scan-capture-prod-readiness.md §4, B3].

**Spine: lots (08-19 → 09-20).** One founder-sequenced milestone plan (M1 batch queue, "never
lose work on refresh", M2 captures, M3 lots), behind a flag from 08-21 and on in production on
09-20. The evidence is track record ("single-scan flow is solid"), not a new test
[src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md; `3359aabd8`, `9131c674b`].

**Spine: comps (07-04 → Sept).** Present from day two. It matured in waves (08-02, 08-24,
09-06/07) as lots and scout put load on it. The 09-07 redesign is the best-instrumented moment
in the arc: founder quotes at 13:38, 14:47 ("Founder go") and 17:11 PDT, two pre-registered
experiments, and zero spend before any build. The pubsub design keys its limits to E53e's
request-dedup measurement. (The prior draft's "under 1 %" figure was not re-verified in this
review.) [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md §0;
docs/plan/2026-09-07-comps-pubsub-design.md].

**Spine: Art Binder (08-12 → 08-29).** This spine had a scope conversation after all. Its SPADE
(08-12) lists "Founder's locked decisions" and a founder product direction refined after
community research. On 08-15 a *pre-written promotion trigger* fired (multi-step AND
tens-of-seconds AND resume-across-reload). The branch was merged on 08-23 and kept shipping
through 08-29, in parallel with lots and scout [src: docs/plan/2026-08-12-michi-binder-spade.md;
docs/plan/2026-08-15-binder-agentic-promotion.md; `0a6119e7f`, `6fe0432e9`]. It remains the
honest counter-example in a narrower form. Its decisions are paraphrased and dated to the day,
not quoted to the minute. Its first locked decision is "plan all phases equally … no forced MVP
cut", which is scope set by ambition, not by a kill number.

## 3. The transferable move

Run the threads in parallel, but give each one a number that can kill it. The spines that held
up (scout, comps) put the requirement in writing as a figure (2 s, then ≤ 1 s and top 3; a TTL
formula) and ran the cheapest test that could overturn the plan. They also kept the founder's
exact words with a timestamp. Two refinements to the tidy version. (a) The order was sometimes
build first, decide second: scout Wave 1 was a probe, and the SPADE followed it that night.
(b) The best decisions retired Gerald's own earlier fix. The 5-crop proposer was right on 09-03
and a hack by 09-09, once the catalogue was fixed. A colleague can copy this next week: for each
thread, write the kill condition before the spike, and note the date when a workaround stops
earning its cost.

## 4. Slide candidates

- **Swim-lane chart, 07-02 → 09-21.** Five horizontal spines (identify/scout, comps, lots, Art
  Binder, labeling), with decision dots at the dated moments above. It replaces the four-act
  arrow and is the D5 slide.
- **The proposer's life in four numbers.** 0/36 → 19/0 (09-03) → 10 forward passes per identify
  in the incident (09-07) → 26 vs 31 of 41, 1.9 s vs 0.34 s (09-09). A workaround that worked,
  cost money, then lost to a simpler path.
- **The bar that moved.** "~2s … a gate, not a target" (08-18) beside "detection ≤ 1 s; right
  card in the top 3 per lot" (09-13).
- **The comps §0 founder quote block**, unchanged from the prior draft.

## 5. Open questions for Gerald

1. **"~5 identify calls per detect."** The record has five *crops* per fire in **one** identify
   call, fanned out to five embed-searches (E79: "five embeds + five searches"). Is it fine to say
   "five embeds per identify" on stage?
2. **"5 crop proposer gone" (09-11).** No commit on any ref retires it. `main` still cuts up to
   `MAX_PROPOSALS` crops per fire, and E79 named the change "one constant … gated on a replay"
   that we cannot find. Did it ship from a build outside this repo, or is it still to do?
3. **"Close to being parked."** Only the identify *speed work* is recorded as parked (09-08
   problem brief §5), not the scout itself. When was the project at risk?
4. **Art Binder.** The SPADE shows your scope decisions. Was there ever a kill or park number
   for it, or was it deliberately open-ended?
