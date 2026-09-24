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

## The four acts (per D9)

Order and reasons are founder testimony [src: founder testimony · 2026-09-24 · D9]; the dates
and shas below are the record. Overlapping dates are not concurrent work. Restructured from
D5's spines by `revise/pivots-d9` on 2026-09-24.

| Act | Start → end (approx) | Why it began | Opening evidence | Transition / closing evidence |
|---|---|---|---|---|
| **1 · Pregrade: LLM-vision identify (proof of concept)** | 2026-07-02 → 08-18 (~700 commits, W27–W33) | Feasibility + a baseline before an image-to-image model [src: D9] | `f7a484e95` 2026-07-04 17:55 "photo identification + adjudication UI: analyze without typing a tid (v2.3)": a vision agent does extraction only; verified live at 6.9 s on one photo. Comps from an external price-tracker API; comps store `8b009b9f9` 2026-07-04 | First measured LLM baseline arrives in act 2: vision 5/6 at a 10.4 s median (`3f5eabd7e` 2026-08-18 23:47). Pregrade-era accuracy figure: **NOT FOUND** |
| **2 · Live-stream scout: image-to-image identify** | 2026-08-18 (first pass); resumed 09-02 → Sept | A card on a live auction is on screen for seconds; the LLM took 6–15 s | `e04b6433b` 2026-08-18 17:50 Wave 1; Waves 2–3 at 18:27 and 19:00; SPADE `8eb911a86` at 22:44, AFTER Waves 1–3 (build first, decide second); bakeoff `3f5eabd7e` 23:47 compares OCR / vision / embedding; SigLIP picked `423e2e894` 2026-08-20 01:33 | Scout commits per day: 18 on 08-18, **0 from 08-19 to 09-01**, 38 on 09-02 [src: per-day counts on `apps/whatnot-scout`]. Scout moves to the no-LLM lane `06119bc92` 2026-09-02; 5 crops in one identify request `3079bbc68` 09-02 / `3b66e82cc` 09-03 |
| **3 · Bulk scan/lots: the port that removed the LLM** | 2026-08-19 → prod 09-20 | Identify ported to bulk scan to remove the LLM; bulk scan used to strip out the bigger system's failure modes [src: D9] | `9c310b4d1` / `1bcfb8f94` 2026-08-19 `#capture` phone route; `0f6b04285` 2026-08-19 M1/M2/M3 roadmap; **port:** `5f76f4810` + `bf0a52e4f` 2026-08-20 08:52, embed-first identify on capture with "the ~10s vision LLM demoted to fallback" | Hardening `718238b85` 2026-08-21 "confident-wrong 0 on live corpus (9 fixes)"; lots behind a flag `3359aabd8` 08-21; **LLM gone:** `0d12da755` + `5d44daa90` 2026-09-03; lots on in prod `9131c674b` 2026-09-20 |
| **4 · Comps/pricing: raw comps across conditions** | 2026-08-23 → Sept (see question below) | The need grew from graded + NM raw (an API was enough) to NM / LP / MP / HP / DMG [src: D9] | API evidence: `35d383b35` 2026-07-30 ("pregrade already reads raw_nm"); scoping doc 2026-08-12 (docs/plan/2026-08-12-zapdos-comp-pipeline-scoping.md); **first shipped tiers** `cbb944ee5` 2026-08-23 "per-condition raw comps (NM/LP/MP/HP/DMG)" | `7d223c0a0` 2026-08-23 raw money of record = TCGplayer NM market; `e65c7480` 2026-08-24 lots comp freshness; scout condition tiles `a8b11dc96` 2026-09-06; TTL-by-class + pubsub design 2026-09-07 (founder quotes 13:38 / 14:47 / 17:11 PDT) |

## Outside arc B (same window)

| Phase | Start → end (approx) | Volume | Opening evidence | Closing/next-phase evidence | Why (as sources state it) |
|---|---|---|---|---|---|
| **Labeler / personas (arc F/C territory)** | 2026-09-06 → ongoing | spec + pilot docs | `docs/plan/2026-09-06-labeling-feature-spec.md`; `docs/experiments/EXP-E28a-adversarial-agent-labeling-2026-09-06.md` | `docs/experiments/EXP-E84-agent-tools-pilot-2026-09-09.md` | Out of scope for this lane (arc F owns it); flagged here only because it shares the W36–W37 window [src: file dates] |
| **Trunk consolidation** | closes 2026-09-18 | 1 large merge | (feature branches accumulate through Sept) | `695c0620` 2026-09-18 "merge: labels/mobile-rethink → main — main becomes the deployed world (2,626 commits, 08-23 → 09-18)"; also `2d8ec78c` 2026-09-18 "merge: feat/deploy-prod-script → main — tools/deploy-prod.sh, the one door for production (prod = a commit)" | A deliberate, dated consolidation gate, not an organic drift [src: merge subjects + `docs/plan/2026-09-18-trunk-consolidation-plan.md`] |
| **Mobile verification** | 2026-09-20 → | ~15 merges same day | `docs/plan/2026-09-20-mobile-verification-assessment.md` | `9131c674` 2026-09-20 lots-in-prod merge; `e7482206` 2026-09-20 "merge: vintage Japanese lane" | Last dated phase in the mined window (repo continues past 09-21) [src: file date + merge cluster] |

## Record vs the founder's account

D5 read the overlapping dates above as concurrent spines. D9 supersedes it: commit dates show
when work landed, not where attention was [src: founder testimony · 2026-09-24 · D9]. The
per-day scout counts fit that for acts 2 and 3. Two facts are open questions for Gerald, not
edits to the story:

1. **Where image-to-image first ran.** The embedding lane was designed in the scout's
   08-18/19 bakeoff. It was first wired into bulk-scan capture (08-20), and the scout used it
   only from 09-02 (`06119bc92`).
2. **Where act 4 opens.** Condition-tier work first appears as an 08-12 scoping doc for a
   personal tracker and ships on 08-23 inside captures/lots (`cbb944ee5`). The larger comps
   redesign is 09-06/07. Which date starts the act?
