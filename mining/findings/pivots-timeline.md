# Arc B — pivots timeline

Source: `grAIde-main/docs/plan/` and `docs/experiments/` (grepped by filename/heading, then read
in full only for the dated decision / handoff / experiment docs that mark pivots), cross-checked
against git (see `mining/timeline/git-timeline.md`) and against memory
`whatnot-card-scout-extension.md`. Reviewed and corrected by the Opus-tier lane
`review/pivots` on 2026-09-24 (see "Review log" at the end).

Rows are grouped by **spine** (per D5), not ordered as a sequence. Columns: date · spine ·
from → to · trigger · who decided · was a scope/timeline conversation held.

| Date | Spine | From → to | Trigger | Who decided | Scope/timeline conversation held? |
|---|---|---|---|---|---|
| 2026-08-12 | Art Binder | paused hobby pipeline → flag-gated feature inside Grailith | Community research reframed "digitize my binder" into a photo-first composer | Founder — SPADE lists "Founder's locked decisions" and "Product direction — refined by founder (post-research, 2026-08-12)", with a dissent log resolved the same day | **YES** (corrected on review — earlier rows said none was found). Paraphrased founder decisions, dated to the day, not the minute; no numeric kill gate — the first locked decision is "plan all phases equally … no forced MVP cut." [src: docs/plan/2026-08-12-michi-binder-spade.md; first commit `d93b68c35` 2026-08-13 00:42] |
| 2026-08-15 | Art Binder | single-shot AI planner → agentic loop with resume | A *written promotion trigger* in the 08-14 composer design ("multi-step AND tens-of-seconds AND resume-across-reload") fired when the founder named the walk-away/resume need | Founder decision, recorded in the doc's status line | **YES, with a pre-written trigger.** [src: docs/plan/2026-08-15-binder-agentic-promotion.md; docs/plan/2026-08-14-binder-composer-design.md] |
| 2026-08-18 | Live scout | pregrade identify (uploaded photo) → live Whatnot stream | Waves 1–3 were built first (17:50–19:00); the first live runs showed the vision-LLM identify at 6–15 s against a card on screen for seconds | Founder — Wave 1's body says it exists so "the founder's first live test" answers the pixel-readback unknown | **YES, but after a build-first probe, not before it** (corrected). The SPADE (22:44) states "~2s end-to-end … a gate, not a target"; its OCR spike found OCR was *not* the failure mode (failures were upstream: detection, frame choice, rotation; 5/13 live frames had no quad) and it recommended client-OCR first. [src: `e04b6433b`, `8eb911a86`; docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md] |
| 2026-08-19 | Live scout | SPADE's client-OCR primary → embedding-first cascade | Overnight 34-crop, 3-lane bakeoff: OCR median 25 s (2/6), vision 10.4 s (5/6), embedding ~130 ms but top-1 1/5 on same-art prints | Produced overnight; one fork flagged for founder sign-off | **YES — revised the prior call on evidence the next day.** [src: docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md] |
| 2026-08-19 | Lots | single-scan → capture persistence → captures → lots | "Single-scan flow is solid + identify is strong" | Founder — "Founder-defined sequencing (2026-08-19)" | **YES, milestone plan (M1/M2/M3) with acceptance bars**; lots v1 behind a flag 08-21 (`3359aabd8`), ON in prod 09-20 (`9131c674b`). [src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md] |
| 2026-09-02/03 | Live scout | one detectQuad crop → five card-aspect proposal crops, server picks by argmax | The single crop was the presented card in 0/36 live frames; replay on 38 founder frames: 19 correct / 0 wrong vs the shipped path's 1 / 30 | Spec + ship gate in tracked code; not attributed to a founder quote | **Measured, with a ship gate.** One identify request per lock carrying up to 5 fronts, which pregrade embed-searched concurrently. [src: `3079bbc68` 2026-09-02 23:57; `3b66e82cc` 2026-09-03 00:21] |
| 2026-09-07 | Live scout | 5-way concurrent embed fan-out → one batched embed | Production incident 06:00–06:06Z: five concurrent embed-searches × 2 orientations = 10 forward passes per identify on 1 vCPU; congestion collapse | Fix under the founder's 8 s deadline ("the founder's product number") | Incident-driven, root cause measured. [src: `f5d6a6491` 2026-09-07 23:22] |
| 2026-09-06 → 09-07 | Comps | 20-h TTL cache → per-class TTL + pubsub | Stale comps; many extensions on one stream | Founder — quotes timestamped 13:38, 14:47 ("Founder go"), 17:11 PDT | **YES, pre-registered, zero-spend budget.** [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md §0, docs/plan/2026-09-07-comps-pubsub-design.md] |
| 2026-09-09 | Live scout | five-proposal vote → one padded crop (recommended) | Founder, 02:00 PDT, in-doc: the 5 crops per identify were "a hack/optimization around poor accuracy prior to fixing catalog issues" — try removing it | Founder asked; E79/E79b answered within 11 min | **YES, founder question → experiment.** E79b, 41 human-truth scenes: vote 26/41 @ 1,893 ms vs one tight+17 px crop 31/41 @ 337 ms. [src: docs/experiments/EXP-E79-single-crop-vs-proposal-vote-2026-09-09.md; `38cd59496`, `177749ea6`] |
| 2026-09-11 | Live scout | slow identify → ~0.4 s identify; timers re-sized | Founder's first box-stack run: "super fast on identify"; he asked if detection was "a holdover from the 5-crop proposer and a slow identify" | Founder question → E88 | Measured: first quad → fire p50 218 ms / p95 401 ms; server 321 ms; round trip 375 / 692 ms. [src: docs/experiments/EXP-E88-identify-timer-retune-2026-09-11.md; `5ffcae9e2`] |
| 2026-09-13 | Live scout → app | top-1 → founder's top-3 bar | "What can we push to production …" (13:0x PDT); the doc names "the founder's top-3 law" | Founder question → read-only inventory | Multi-crop comes back **only to order alternates** (E109: top-3 70.3 % → 82.9 %), never to pick identity. [src: docs/plan/2026-09-13-scan-capture-prod-readiness.md §4, B3] |

## Notes / caveats

- Per D5 these rows are spines, not acts. Art Binder (08-13), live scout (08-18) and lots
  (08-19) open within six days and run side by side; comps exists from 2026-07-04
  (`8b009b9f9`) and matures in waves.
- **The 5-crop proposer is not retired in the git record.** On `main` today the scout still
  cuts up to `MAX_PROPOSALS` (4 rect + 1 diversity) crops per fire
  (`apps/whatnot-scout/src/content/proposals-capture.ts`, `content.ts` fire path), and no
  commit on any ref after 09-09 changes `proposals-capture.ts`. What changed was the cost: the
  batched embed (09-07) and the fast student model on the box stack (0.4.25, 09-11). The
  founder's "5 crop proposer gone" (session 403300ff · 2026-09-11) is either about a build
  outside this repo's refs or is the remembered version. [inference; open question]
- Quoted founder words come from docs that stamp them to the minute (PDT), except Art Binder,
  whose decisions are paraphrased and stamped to the day.

## Review log (review/pivots · 2026-09-24)

1. Sha/date/subject for `718238b85`, `3359aabd8`, `9131c674b`, `695c06200`, `0f6b04285`,
   `8eb911a86`, `e65c7480d`, `8ae7b965e`; bakeoff numbers; comps quote times — **held**.
2. "SPADE before Wave 1 ships" and "OCR 0/13 viable" — **did not hold.** The SPADE is 22:44,
   after Waves 1–3; "0/13" is not in the doc (it has 5/13 no-quad), and the spike exonerated OCR
   rather than ruling it out. Fixed above.
3. "Art Binder: ~40 merges 08-12 → 08-18, no scope conversation" — **did not hold.** 46 branch
   commits, merged 08-23, merges through 08-29, and a founder-scoped SPADE dated 08-12. Fixed
   above and in git-timeline.md.
4. The earlier "~5 calls" bridge (a 5-frame lock) was the wrong five: 5-frame is the fire
   *streak* (E88), and the ~5 is the proposal crops per identify (`3079bbc68`, E79).
