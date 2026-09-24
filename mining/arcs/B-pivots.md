# Arc B — the pivots (pregrade → bulk/lots → live-stream identify → comps)

## 1. The arc in one paragraph

Grailith started as a tool for grading and identifying one card at a time from an uploaded
photo. Over eleven weeks it grew three more surfaces on the same identify/pricing core: bulk
capture and organization ("lots," scanning a stack at a show), a live browser extension that
watches a Whatnot auction stream and identifies the card the seller is holding up before the lot
closes, and a pricing/comps layer that had existed since the repo's second day and matured in
dated waves as the other two surfaces put load on it. The talk's claim: every pivot was a
scope/timeline conversation held with evidence in hand, not a vibe shift. The record mostly
supports that, with two honest exceptions: the claimed strict ordering (one → lots → live-stream
→ comps) doesn't survive the commit dates, and one adjacent track (Art Binder) shows no
equivalent documented founder conversation at all.

## 2. Pivotal moments

**2026-08-19 — pregrade (single card) → bulk capture/lots.** The fork: keep polishing one-card
identify, or build durable multi-card capture. Explored: little elaboration — the roadmap doc
states the premise plainly ("single-scan flow is solid + identify is strong") and moves straight
to milestones (M1 batch queue with a hard "never lose work on refresh" acceptance bar, M2
captures management, M3 lots). Not explored in the doc: alternative sequencings, e.g. lots
before hardening single-scan. Decision: founder-defined sequencing, dated in the doc's header.
Evidence: the "solid" claim rests on seven prior weeks of pregrade work (W27–W33, ~700 commits)
rather than a fresh measurement — the one pivot here where "evidence in hand" leans on track
record over a discrete test. Cost/benefit later: lots shipped to prod flagged on 2026-09-20, a
month after the roadmap. [src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md]

**2026-08-18 — pregrade identify → live-stream auction identify (whatnot-scout).** The fork:
port the existing (accurate but 6–15s) vision-LLM identify path into a browser extension
watching a live Whatnot stream, where a card is on screen for roughly 5–10 seconds. Explored:
the SPADE decision doc runs a full Setting/People/Perspectives/Alternatives/Decide/Explain pass
before Wave 1 ships, and an OCR spike is run *first* to rule out the cheapest option (native
OCR scored 0/13 viable on live crops, confirming the failure was upstream in detection/crop
quality, not the reading step). Not explored: shipping the existing 6–15s vision path as-is and
hoping "feels live" was negotiable — the doc explicitly rejects this ("a path that is
accurate-but-4s fails"). Decision: founder, framed via the commit message ("the founder's first
live test") and the SPADE's own format. Evidence in hand: a scored recipe with per-tier numbers,
gathered before Wave 1's code shipped. Cost/benefit seen later: the very next day (08-19), an
overnight 3-lane bakeoff (OCR/vision/embedding, 34 crops) found the SPADE's own primary
recommendation (client-OCR) didn't survive contact with real crops and revised the architecture
on the spot — the clearest example in this arc of a plan changing *because* of evidence, not
before it. [src: docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md,
docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md]

**2026-09-06/07 — whatnot + lots load → comps freshness/TTL/pubsub redesign.** The fork: keep
comps as a simple 20-hour-TTL cache, or design per-class freshness and a pubsub layer so
multiple watching extensions don't each pay for the same stale-comp refresh. Explored: both
design docs are pre-registered (stated zero-credit, zero-write budget before any build) and
cite specific experiments run first (`EXP-COMPS-TTL-2026-09-07`, `EXP-E53e-request-dedup`).
Not explored: buying a higher-tier price-API plan to paper over the staleness — the founder's
own quoted principle rejects this ("that math starts to change when we have ttls by
classification," arguing against buying the tier before demand is honest). Decision: founder,
quoted and timestamped to the minute in both docs, including an in-line "Founder go 14:47 PDT."
Evidence: E53e's request-dedup measurement (falsified — under 1% of identify calls were
intra-episode repeats) directly informed the pubsub design's scope. Cost/benefit: this is the
best-instrumented pivot found in the mining — a direct founder quote, a dated pre-registration,
and a cited experiment, all before a line of production code. [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md, docs/plan/2026-09-07-comps-pubsub-design.md]

**2026-08-12→18 — Art Binder (undocumented fork, cautionary).** The honest counter-example the
brief asked to surface: this collage/compose feature ran for a week directly before the whatnot
pivot, with a handoff doc attributed to "the orchestrating session," not a founder decision. No
timestamped quote, no pre-registered evidence, no scope conversation of the kind seen above. It
is unclear whether that conversation happened elsewhere (a transcript this lane didn't read) or
didn't happen. Flagged, not resolved. [src: docs/plan/2026-08-12-michi-binder-in-grailith-handoff.md]

## 3. The transferable move

The pattern across the three well-evidenced pivots: state the requirement as a number before
building anything (2s, not "fast"; a TTL formula, not "fresher"), run the cheapest test that
could kill the plan, and only then write the build doc — founder's words quoted and timestamped,
not paraphrased into "the team decided." A colleague copying this next week doesn't need the
SPADE template specifically; they need the discipline of writing the kill condition down
*before* the spike, and preferring a timestamped direct quote over a summary — the quote is what
makes "evidence in hand" checkable later, including by a mining lane eleven weeks on.

## 4. Slide candidates

- **The SPADE's OCR-spike table** (docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md) — a
  three-tier scored table (clean scans / phone shots / live crops) showing OCR going from
  viable to 0/13 non-viable as the input gets closer to the real product. Shows evidence
  killing an idea before it shipped, not after.
- **The comps-ttl-by-class-design.md founder quote block** — the doc literally opens on a
  timestamped direct quote (§0) before any mechanism. A screenshot of that section is a ready-
  made "decision, not a vibe" slide.
- **git-timeline.md's phase table + "honesty check" section** — pairing the narrated order
  against the dated commit record is itself a slide: claimed four sequential acts versus what
  the shas show (a parallel spine plus one concurrent launch pair), the method self-correcting.

## 5. Open questions for Gerald

1. Interview claim 1 ("close to being parked"): the record shows identify was too slow for the
   live-auction use case (SPADE's explicit 2s gate against a measured 6–15s baseline), but no
   doc or commit uses "parked"/"shelved" about the *whatnot-scout project itself* being at risk.
   Is that memory from a conversation not captured in `docs/plan/` or the mined memory files —
   and if so, roughly when?
2. Interview claim 2 ("~5 identify calls per detect," not needed after moving-cards thinking):
   this lane found a plausible mechanical source — the pre-Wave-3 design fired identify on a
   "minimal-5-frame-lock placeholder," replaced by Wave 3's "one-call-per-committed-lock" state
   machine — but that **bridges "5-frame" to "~5 calls" by inference, not a document stating the
   figure directly**. [src: memory `whatnot-card-scout-extension.md` line 81;
   `docs/experiments/EXP-E88-identify-timer-retune-2026-09-11.md`; `docs/ops/ppt-governor.md:1315`].
   Right mechanism, or is "~5" from a different measurement this lane didn't find?
3. Was there a scope conversation for Art Binder equivalent to the three pivots above, and if
   so, where does it live?
4. The arc's stated order (pregrade → lots → live-stream → comps) reads cleanly but the commit
   dates show lots and live-stream a day apart and comps present from day two. Intentional
   narrative compression, or should the slide show the truer concurrent shape?
