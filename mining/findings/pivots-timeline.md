# Arc B — pivots timeline

Source: `grAIde-main/docs/plan/`, `docs/experiments/`, `docs/ops/` (grepped by filename or
heading, then read only for the dated decision, handoff and experiment docs that mark
transitions), cross-checked against git (see `mining/timeline/git-timeline.md`). Reviewed by
`review/pivots` on 2026-09-24, then restructured by `revise/pivots-d9` on 2026-09-24 to the
four sequential acts of D9. The founder's account supplies the ORDER and the REASONS; the record
supplies the dates [src: founder testimony · 2026-09-24 · D9].

Rows are grouped by **act**. Columns: date · act · from → to · trigger · who decided · evidence.

## Act 1 — pregrade: LLM-vision identify as a proof of concept

| Date | From → to | Trigger | Who decided | Evidence |
|---|---|---|---|---|
| 2026-07-04 | type a tid → photo identify | Feasibility + a baseline before an image-to-image model [src: founder testimony · 2026-09-24 · D9] | Founder | Vision agent does extraction only (collector number first); card resolution stays deterministic. Verified live on one photo: high-confidence in 6.9 s. Candidates and comps come from an external price-tracker API (an identify searches it; backfilling a never-priced card costs 2 credits). [src: `f7a484e95` · 2026-07-04 17:55; comps store `8b009b9f9` · 2026-07-04] |
| 2026-07-30 | — (evidence that the API was enough) | Raw-condition milestone plan, skeptic pass | Plan + skeptic | "condition-segmented comp data ALREADY EXISTS" via the API; "pregrade already reads raw_nm". The scraping section was deleted. [src: `35d383b35` · 2026-07-30] |
| — | pregrade-era accuracy baseline | — | — | **NOT FOUND.** The first measured LLM baseline comes from act 2 (next table). |

## Act 2 — live-stream scout: image-to-image identify

| Date | From → to | Trigger | Who decided | Evidence |
|---|---|---|---|---|
| 2026-08-18 | uploaded photo → live Whatnot stream | Waves 1–3 built first (17:50–19:00). Live runs showed the vision-LLM identify at 6–15 s for a card on screen for seconds | Founder: Wave 1 exists so "the founder's first live test" answers the pixel-readback unknown | **Build first, decide second.** SPADE at 22:44: "~2s end-to-end … a gate, not a target". Its OCR spike cleared OCR (failures were upstream: detection, frame choice, rotation; 5/13 live frames had no quad). [src: `e04b6433b`, `8eb911a86` · 2026-08-18; docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md] |
| 2026-08-18/19 | LLM identify → embedding-first cascade | Overnight 3-lane bakeoff that **compares the LLM baseline directly**: OCR 25 s median (2/6); vision 5/6 at a 10.4 s median; embedding ~130 ms, top-5 4/5, top-1 1/5 on same-art prints | Produced overnight; one fork flagged for the founder | Revised the SPADE's client-OCR pick the next day. Embedding = ranker, not authority; a number-confirm gate pins the printing. [src: `3f5eabd7e` · 2026-08-18 23:47; docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md] |
| 2026-08-19 ~03:1x | model-first → image-quality-first | Founder steer: "great images first, then pick embedding models" | Founder | [src: docs/ops/2026-08-18-overnight-autonomous-log.md; `0a5caf393` · 2026-08-19] |
| 2026-08-20 01:33 | CLIP ViT-B/32 → SigLIP ViT-B/16 | Bakeoff on 84 real captures: SigLIP top-1 0.841 at 44 ms vs 0.449 | Overnight run, adoption checklist for the founder | [src: `423e2e894`, `7dce31432` · 2026-08-20] |
| 2026-09-02/03 | one detectQuad crop → five crops in **one** identify request, server keeps the best | The single crop was the presented card in 0/36 live frames; replay: 19 correct / 0 wrong vs 1 / 30 | Spec + ship gate in tracked code | The scout itself moved to the no-LLM lane the same day. [src: `06119bc92` · 2026-09-02 14:34; `3079bbc68` · 2026-09-02 23:57; `3b66e82cc` · 2026-09-03 00:21] |
| 2026-09-07 | 5-way embed fan-out → one batched embed | Incident: 5 crops × 2 orientations = 10 forward passes per identify on 1 vCPU | Fix under the founder's 8 s deadline | [src: `f5d6a6491` · 2026-09-07] |
| 2026-09-09 | five-crop vote → one padded crop (recommended) | Founder, 02:00 PDT: the 5 crops were "a hack/optimization around poor accuracy prior to fixing catalog issues" | Founder question → E79b within 11 min | Vote 26/41 at 1,893 ms vs one crop 31/41 at 337 ms. [src: docs/experiments/EXP-E79-single-crop-vs-proposal-vote-2026-09-09.md; `38cd59496`, `177749ea6`] |
| 2026-09-11 → 09-13 | slow identify → ~0.4 s; top-1 → top-3 | Box-stack run "super fast on identify"; E88; "the founder's top-3 law" | Founder question → experiment | First quad → fire p50 218 / p95 401 ms. Multi-crop returns only to order alternates (top-3 70.3 % → 82.9 %). [src: `5ffcae9e2`; docs/experiments/EXP-E88-identify-timer-retune-2026-09-11.md; docs/plan/2026-09-13-scan-capture-prod-readiness.md §4] |

## Act 3 — bulk scan/lots: the port that removed the LLM

| Date | From → to | Trigger | Who decided | Evidence |
|---|---|---|---|---|
| 2026-08-19 13:04 | scout extension → base-app `#capture` phone route | "pivot to base-app #capture route (phone flywheel + observability + reusable identify)" | Recorded in the ops log | [src: `9c310b4d1`, `1bcfb8f94` · 2026-08-19] |
| 2026-08-19 17:55 | single scan → batch queue → captures → lots | "Single-scan flow is solid + identify is strong" | Founder: "Founder-defined sequencing (2026-08-19)" | M1/M2/M3 milestone plan with acceptance bars. [src: `0f6b04285`; docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md] |
| 2026-08-20 08:52 | vision-LLM identify → embed-first (~100 ms), vision as fallback | **The port.** Adoption checklist from act 2: "wire embed-first identify … into the capture route" | Adoption step 3 | Both single-scan and batch queue route through `identifyFastFirst`. [src: `5f76f4810`, `bf0a52e4f` · 2026-08-20] |
| 2026-08-20 → 08-22 | — | Failure modes stripped out on bulk scan: hung identify, same-species confusion, zero-padded numbers, confident-wrongs, quad-detect misses | Fix waves | "confident-wrong 0 on live corpus (9 fixes)". [src: `b17328331` / `718238b85` · 2026-08-21; `7d4734a56` · 2026-08-22] |
| 2026-08-21 | lots v1 behind a flag | — | — | [src: `3359aabd8` · 2026-08-21] |
| 2026-09-03 01:00 | vision fallback → no LLM in identify | "identify spends NO LLM, and the grade still does"; "the vision fallback is gone from BOTH client doors" | — | [src: `0d12da755`, `5d44daa90` · 2026-09-03] |
| 2026-09-20 | lots flagged → on in production | — | — | [src: `9131c674b` · 2026-09-20] |

## Act 4 — comps/pricing: raw comps across conditions

| Date | From → to | Trigger | Who decided | Evidence |
|---|---|---|---|---|
| 2026-08-12 | NM × fixed multipliers → real condition prices (scoping only) | A personal master-set tracker | Scoping doc | The API "DOES expose raw condition tiers — NM / LP / MP / HP / DMG"; ingested but never surfaced. [src: docs/plan/2026-08-12-zapdos-comp-pipeline-scoping.md] |
| 2026-08-23 00:36 | NM raw only → per-condition raw comps | Captures and lots need each card's own condition | — | "per-condition raw comps (NM/LP/MP/HP/DMG) — sourced-only, resolver-served"; lot members resolve their own condition, "never silently NM". [src: `cbb944ee5`, merge `6d9594a60` · 2026-08-23] |
| 2026-08-23 18:47 | eBay ungraded sold → TCGplayer NM market as raw money of record | — | — | [src: `7d223c0a0` · 2026-08-23] |
| 2026-09-06 | — → scout condition tiles + price history per condition | Founder ask ~16:05 PDT | Founder | [src: `a8b11dc96`, `74919e747` · 2026-09-06; docs/plan/2026-09-06-scout-variants-price-history.md] |
| 2026-09-06 → 09-07 | 20-h TTL cache → per-class TTL + pubsub | Stale comps; many extensions on one stream | Founder: quotes at 13:38, 14:47 ("Founder go"), 17:11 PDT | Pre-registered, zero-spend budget. [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md §0; docs/plan/2026-09-07-comps-pubsub-design.md] |

## Notes / caveats

- **Order is testimony; dates are record.** Overlapping dates are not concurrent work
  [src: founder testimony · 2026-09-24 · D9]. The record fits that for acts 2 and 3: the scout
  has 18 commits on 08-18 and none from 08-19 to 09-01 [src: per-day commit counts on
  `apps/whatnot-scout`].
- **The 5-crop proposer is not retired in the git record.** `main` still cuts up to
  `MAX_PROPOSALS` crops per fire, and no commit after 09-09 changes `proposals-capture.ts`. The
  founder's "5 crop proposer gone" (session 403300ff · 2026-09-11) is an open question.
- **Questions for Gerald (record vs D9 on facts, not order):** (1) The image-to-image lane was
  designed in the scout's bakeoff, but it was first wired into bulk-scan capture (08-20). The
  scout used it only from 09-02. (2) The first condition-tier work (08-12 scoping, 08-23
  shipped) predates the 09-06/07 comps work. Which date opens act 4?

## Review log

1. `review/pivots` (2026-09-24): shas, bakeoff numbers and comps quote times held. "SPADE before
   Wave 1" and "OCR 0/13" did not hold and were fixed.
2. `revise/pivots-d9` (2026-09-24): rows regrouped from D5's spines into D9's four acts. Rows
   D9 puts out of the talk were removed. Act-1 PoC, the port (`5f76f4810`,
   `bf0a52e4f`), the LLM's removal (`0d12da755`, `5d44daa90`) and per-condition comps
   (`cbb944ee5`) added.
