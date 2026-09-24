# Arc B — pivots timeline

Source: `~/git/grAIde-main/docs/plan/` (84 docs, grepped by filename/heading, then read in full
only for the dated handoff / "RESUME HERE" / assessment docs that mark pivots), cross-checked
against git (see `mining/timeline/git-timeline.md`) and against memory
`~/.claude/projects/-Users-geraldsornsen-git-grAIde/memory/whatnot-card-scout-extension.md`.

Columns: date · from → to · trigger · who decided · was a scope/timeline conversation held.

| Date | From → to | Trigger | Who decided | Scope/timeline conversation held? |
|---|---|---|---|---|
| 2026-08-19 | Pregrade single-card identify → bulk capture + lots | "Single-scan flow is solid + identify is strong; now the arc is durable persistence and organization, toward scanning many cards at a show/shop and grouping them." | Founder — the doc's own header reads "Founder-defined sequencing (2026-08-19)" | **YES, explicit.** The roadmap doc is a structured milestone plan (M1 batch queue / M2 captures management / M3 lots) with stated acceptance criteria, not a retrospective summary. [src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md] |
| 2026-08-18 | Pregrade identify (one card, uploaded photo) → live-stream auction identify (whatnot-scout extension) | The existing identify path served `~6–15s` per card (vision-LLM); a live Whatnot auction needs an answer while the card is still on screen. | Founder — the commit message frames Wave 1 as answering "the founder's first live test"; the SPADE doc's own format (Setting/People/Perspectives/Alternatives/Decide/Explain) is Gerald's structured decision-record method | **YES, and with evidence in hand before the build:** the SPADE doc states the requirement as a number — "~2s end-to-end, on live frames. This is a gate, not a target. A path that is accurate-but-4s **fails**" — and cites the OCR-spike measurement (0/13 viable on live crops) that ruled out the fastest naive approach *before* Wave 1 shipped. [src: docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md] |
| 2026-08-19 | Whatnot Wave-1 (embedding-only ranker) → a measured 3-lane bakeoff (OCR / vision-LLM / embedding) that revised the SPADE's own recommendation | Overnight measurement found none of the three lanes was both accurate and sub-2s alone, and that the SPADE's original "client-OCR primary" call was wrong once tested on real crops (OCR: median 25s, 2/6 correct; vision: median 10.4s, 5/6 correct; embedding: ~130ms but confident-wrong on reprints). | Produced "autonomously overnight"; doc requests "Founder review... on the one architecture fork (client-ONNX vs server embedding)" | **YES, and it revised the plan on evidence.** The doc is explicit that it "Revises the ID-authority choice in [the SPADE]" based on a 34-crop bakeoff, and flags exactly one fork for founder sign-off rather than re-deciding everything. This is the clearest example in arc B of a decision revised *because* new evidence contradicted the prior call. [src: docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md] |
| 2026-09-06 → 09-07 | Whatnot/lots load → comps freshness/TTL/pubsub redesign | Stale comps (a PSA10 comp priced 30–40% under recent solds) and multiple extensions watching the same live stream, driving redundant identify/comp traffic. | Founder — both design docs open on dated, timestamped, directly quoted founder statements, not paraphrase: comps-ttl-by-class-design opens on *"that math starts to change when we have ttls by classification…"* (2026-09-07 17:11 PDT); comps-pubsub-design opens on the founder's literal question, *"n extensions watching the same stream or wanting..."* (2026-09-07 13:38 PDT), with a later "Founder go 14:47 PDT" recorded in-line | **YES, and unusually well-instrumented.** Both docs are pre-registered designs (stated PPT-credit/Vectorize budget spent = zero before build) that cite specific experiments (`EXP-COMPS-TTL-2026-09-07`, `EXP-E53e-request-dedup-2026-09-07`) and quote the founder's own principle before proposing a mechanism, rather than a team member inferring the timeline pressure. [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md §0, docs/plan/2026-09-07-comps-pubsub-design.md] |

## Notes / caveats

- These four rows are the pivots inside the arc's own frame (pregrade → lots →
  live-stream → comps). As `git-timeline.md`'s "Honesty check" section documents, the
  *chronology* implied by that frame (strict A-then-B-then-C-then-D) is a simplification: the
  live-stream pivot (08-18) and the lots pivot (08-19) are one day apart and the two efforts
  ran concurrently for the rest of August, and comps existed as a spine from 2026-07-04 —
  what changed on 09-06/07 was a maturity wave, not comps' origination.
- A fifth, undocumented-by-the-arc event (Art Binder, 2026-08-12 → 08-18) sits directly before
  the whatnot-scout start with no equivalent founder-quoted scope conversation found in its
  handoff doc (`docs/plan/2026-08-12-michi-binder-in-grailith-handoff.md` — written by "the
  orchestrating session," not attributed to a founder decision). Flagged, not resolved: it may
  simply be a track whose founder conversation happened outside the docs this lane read
  (transcripts, not mined here).
- Every row above that quotes the founder does so from a doc that timestamps the quote to the
  minute (PDT); this pattern — quoted decision, timestamped, followed by a build — is itself
  one candidate slide artifact for the talk (see `mining/arcs/B-pivots.md`).
