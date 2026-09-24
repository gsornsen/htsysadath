# Arc B — git timeline (grAIde-main)

Source: `~/git/grAIde-main`, read-only, 3,966 commits, 2026-07-02 → 2026-09-21 (last commit
`f75d531d`). All commands below were run with `git -C ~/git/grAIde-main ...` and are
reproducible from a checkout of the same history.

## Method

```
git log --format=%ad --date=short | wc -l                     # 3,966
git log --format=%ad --date=short --reverse | head -1         # 2026-07-02
git log --format=%ad --date=short | sort | awk '{print $1}' \
  | while read d; do date -jf "%Y-%m-%d" "$d" "+%G-W%V"; done \
  | sort | uniq -c                                             # weekly counts (ISO week)
git log --merges --format='%h %ad %s' --date=short             # merge list
git log --since=<start> --until=<end> --name-only --format= \
  | cut -d/ -f1-2 | sort | uniq -c | sort -rn | head -5         # top paths per window
```

**Caveat [inference]:** weekly ISO-week counts (table below) and `--since/--until` day-range
counts can differ by low hundreds for the same nominal week — `--since`/`--until` filter on
committer date, `%ad` prints author date, and these diverge on this history (long autonomous
sessions where commits are authored and committed at different times). Both are reproducible
from the commands above; they are not the same number and the table below uses the ISO-week
grouping.

## Weekly commit volume

| ISO week | date range (approx) | commits | dominant top-level paths (from a sampled window) |
|---|---|---|---|
| 2026-W27 | Jun 29 – Jul 5 | 42 | `apps/pregrade-web` (86), `services/card-refresh` (62), `services/pregrade` (58) [src: sample 06-29..07-06] |
| 2026-W28 | Jul 6–12 | 113 | — |
| 2026-W29 | Jul 13–19 | 101 | — |
| 2026-W30 | Jul 20–26 | 22 | — |
| 2026-W31 | Jul 27–Aug 2 | 170 | — |
| 2026-W32 | Aug 3–9 | 188 | — |
| 2026-W33 | Aug 10–16 | 70 | — |
| 2026-W34 | Aug 17–23 | 166 | `scratchpad/tidstore` (504 file-touches — a data-migration scratch area, not feature code), `services/pregrade` (306), `apps/pregrade-web` (221), `apps/whatnot-scout` (62) [src: sample 08-17..08-24] |
| 2026-W35 | Aug 24–30 | 137 | — |
| 2026-W36 | Aug 31–Sep 6 | 634 | — |
| 2026-W37 | Sep 7–13 | 1,803 | `docs/experiments` (1,188 file-touches), `services/pregrade` (553), `apps/whatnot-scout` (510), `docs/plan` (482) [src: sample 09-07..09-14] |
| 2026-W38 | Sep 14–20 | 458 | `apps/pregrade-web` (271), `docs/data` (204), `docs/plan` (193) [src: sample 09-14..09-21] |
| 2026-W39 | Sep 21 (partial) | 62 | — |

File-touch counts are per-commit path mentions, not distinct files; they indicate which
top-level area a window's activity concentrated in, not exact line-level scope.

## Dated phase table

| Phase | Start → end (approx) | Volume | Opening evidence | Closing/next-phase evidence | Why (as sources state it) |
|---|---|---|---|---|---|
| **Pregrade identify (one card)** | 2026-07-02 → ~08-18 | ~700 commits (W27–W33) | `f7a484e95` 2026-07-04 "photo identification + adjudication UI: analyze without typing a tid (v2.3)" | `0f6b04285` 2026-08-19 roadmap doc: "Single-scan flow is solid + identify is strong; now the arc is durable persistence and organization" | Founder judged the single-card flow solid enough to stop investing there and open the next arc [src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md] |
| **Art Binder (a detour, not on the arc's stated spine)** | 2026-08-12 → 08-18 | ~40 merges | `8ae7b965` 2026-08-14 "feat(binder): Wave 1a — versioned page persistence" | superseded in priority by whatnot-scout starting the same week | A separate feature track (collage/compose tool) ran concurrently; git shows it, but it is not part of the identify→lots→scout→comps spine the talk narrates [inference] |
| **Live-stream auction identify (whatnot-scout)** | 2026-08-18 → ongoing through Sept | ~510+ file-touches in W37 alone | `e04b6433b` 2026-08-18 "feat(whatnot-scout): MV3 shell + P0 pixel-readback capture (Wave 1)"; same-day decision doc `8eb911a8` "SPADE — sub-2s card identification decision" | `718238b8` 2026-08-21 "merge: identify hardening stack — confident-wrong 0 on live corpus (9 fixes)"; problem re-opened and re-scoped `docs/plan/2026-09-08-card-identification-problem-brief.md` | The existing (pregrade) identify path was ported to a browser extension watching a live Whatnot stream; the SPADE doc frames the ~2s latency budget as "a gate, not a target" [src: docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md] |
| **Bulk scans + lots** | 2026-08-19 → prod 09-20 | lots v1 merge + 3+ later waves | `0f6b04285` 2026-08-19 roadmap (M1 batch queue, M2 captures management, M3 lots); `3359aabd` 2026-08-21 "merge: lots v1 first-cut behind VITE_FEATURE_LOTS" | `9131c674` 2026-09-20 "merge: Lots ON in the prod web build (VITE_FEATURE_LOTS=1 in the one prod build door) + tripwire" | "Founder-defined sequencing (2026-08-19)" toward "scanning many cards at a show/shop and grouping them" [src: docs/plan/2026-08-19-capture-persistence-and-lots-roadmap.md] |
| **Comps/pricing maturity** | present from 2026-07-04, matured in waves | waves: 08-02, 08-24, 09-06/07 | `8b009b9f9` 2026-07-04 "D1 comps store: shared data plane, dual-write + read-through cache (v1.6)" — i.e. present from day 2 of the repo | `e65c7480` 2026-08-24 "merge: lots comp freshness — two-clocks badge + on-demand refresh + lot doorway + graded ceiling"; design docs `docs/plan/2026-09-07-comps-ttl-by-class-design.md`, `2026-09-07-comps-pubsub-design.md`, both opening with dated, timestamped founder quotes | Freshness/TTL/pubsub work responded to load from lots + whatnot volume; comps-ttl doc opens on a quoted founder principle "that math starts to change when we have ttls by classification" (2026-09-07 17:11 PDT) [src: docs/plan/2026-09-07-comps-ttl-by-class-design.md §0] |
| **Labeler / personas (arc F/C territory)** | 2026-09-06 → ongoing | spec + pilot docs | `docs/plan/2026-09-06-labeling-feature-spec.md`; `docs/experiments/EXP-E28a-adversarial-agent-labeling-2026-09-06.md` | `docs/experiments/EXP-E84-agent-tools-pilot-2026-09-09.md` | Out of scope for this lane (arc F owns it); flagged here only because it shares the W36–W37 window [src: file dates] |
| **Trunk consolidation** | closes 2026-09-18 | 1 large merge | (feature branches accumulate through Sept) | `695c0620` 2026-09-18 "merge: labels/mobile-rethink → main — main becomes the deployed world (2,626 commits, 08-23 → 09-18)"; also `2d8ec78c` 2026-09-18 "merge: feat/deploy-prod-script → main — tools/deploy-prod.sh, the one door for production (prod = a commit)" | A deliberate, dated consolidation gate, not an organic drift [src: merge subjects + `docs/plan/2026-09-18-trunk-consolidation-plan.md`] |
| **Mobile verification** | 2026-09-20 → | ~15 merges same day | `docs/plan/2026-09-20-mobile-verification-assessment.md` | `9131c674` 2026-09-20 lots-in-prod merge; `e7482206` 2026-09-20 "merge: vintage Japanese lane" | Last dated phase in the mined window (repo continues past 09-21) [src: file date + merge cluster] |

## Honesty check on the arc's claimed order

The brief's arc description is **pregrade (one card) → bulk scans/lots → back to live-stream
auction identify → comps/pricing**, read as four sequential acts. The git record does not
fully support strict sequencing:

1. **Comps/pricing is not a fourth, late act.** The D1 comps store shipped 2026-07-04, two
   days after the repo's first commit — it is a parallel spine present from the start, not
   something reached only after lots and live-stream. What *did* happen later (08-02, 08-24,
   09-06/07) is a series of **maturity waves** on that spine (freshness, TTL-by-class, pubsub),
   timed to load from lots and whatnot, not its origination. [src: `8b009b9f9`, dated design
   docs above]
2. **"Back to live-stream" and "bulk scans/lots" launched in the same week, whatnot first.**
   `e04b6433b` (whatnot-scout Wave 1) is dated 2026-08-18; the lots roadmap doc is dated
   2026-08-19, one day later, and its own text says the single-scan/pregrade flow was already
   "solid" — it does not say lots came before or after whatnot. The two efforts ran
   concurrently through the rest of August, not as a strict A-then-B pivot. [src: `e04b6433b`,
   `0f6b04285`]
3. **There was an unlabeled detour.** Art Binder (2026-08-12 → 08-18, ~40 merges) sits directly
   before the whatnot-scout start and is not part of the arc's stated spine at all. It is real,
   dated, sourced work; the talk's four-act structure simply does not mention it. [inference:
   this is a simplification the talk makes, not an error, but it is worth flagging]

**Net:** the four named phases are real and each is individually well-sourced, but the arc's
implied strict linear order (1→2→3→4) is a narrative simplification. The truer shape from the
commit record is: pregrade-identify-and-comps-from-day-one → a binder detour → lots and
live-stream-scout launched concurrently in the same week → comps matured in dated waves keyed
to the load those two produced.
