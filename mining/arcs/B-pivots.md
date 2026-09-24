# Arc B — the pivots, as four acts (per D9)

## 1. The arc in one paragraph

Grailith moved through four acts, and each began for a stated reason. (1) **Pregrade**
identified one card with an LLM vision call. That was a proof of concept, meant to show the
job was feasible and to set a baseline before moving to an image-to-image model. (2) The
**live-stream scout** pushed identify onto a live auction and brought in image-to-image
identify. (3) **Bulk scan/lots** took that identify over, removed the LLM from it, and was used
to strip out the odd ways the larger system fails in detection and on live streams. (4)
**Comps/pricing** became its own act when the need grew. Graded comps plus NM raw had come from
a service/API, and the act began when the need became raw comps across NM / LP / MP / HP / DMG
[src: founder testimony · 2026-09-24 · D9]. Overlapping commit dates are not concurrent work.

## 2. The four acts

**Act 1: pregrade, LLM-vision identify as a proof of concept (07-04 → 08-18).**
*Why it began:* feasibility and a baseline [src: founder testimony · 2026-09-24 · D9].
*Evidence at the time:* photo identify shipped on day three of the repo. A vision agent did
extraction only, reading the collector number first, and resolving the card stayed
deterministic. It was verified live on one photo: high confidence in 6.9 s
[src: `f7a484e95` · 2026-07-04]. Prices came from an external price-tracker API: an identify
searched it, and a never-priced card cost two API credits to backfill
[src: `f7a484e95` · 2026-07-04; `8b009b9f9` · 2026-07-04]. The first measured baseline came
later, from the scout: "accurate but 6–15 s live", then 5/6 correct at a 10.4 s median in the
bakeoff [src: docs/plan/2026-08-18-whatnot-sub2s-identify-spade.md;
docs/plan/2026-08-19-id-lane-bakeoff-revised-architecture.md]. No accuracy figure from the
pregrade weeks themselves was found (NOT FOUND).
*Not done:* no in-house recognition model, and no in-house price source.

**Act 2: live-stream scout, image-to-image identify (08-18).**
*Why:* a card on a live auction is on screen for seconds, and 6–15 s breaks "feels live".
*Build first, decide second:* Waves 1–3 shipped between 17:50 and 19:00. The SPADE followed at
22:44, after the live runs, and set "~2s end-to-end … a gate, not a target"
[src: `e04b6433b`, `8eb911a86` · 2026-08-18]. That night's 3-lane bakeoff compared the LLM
baseline directly: OCR 25 s median; vision 5/6 at 10.4 s; embedding at ~130 ms, top-5 4/5 but
top-1 1/5 on same-art prints [src: `3f5eabd7e` · 2026-08-18 23:47]. A second overnight run on
84 real captures picked SigLIP (top-1 0.84, 44 ms)
[src: `423e2e894` · 2026-08-20; docs/ops/2026-08-18-overnight-autonomous-log.md].
*Not done:* the embedding became a ranker, not an authority. It never auto-locks on image score
alone, and a number-confirm gate pins the printing.

**Act 3: bulk scan/lots, one shared identify core with the LLM removed (08-19 → 09-20).**
*Why:* every app Gerald tested was slow and inaccurate. Identify was the most complex part of the
system, and a fast, accurate identify in EITHER bulk scan or the scout would give both apps a
shared core to build around, so he solved it once and turned to other areas [src: founder
testimony · 2026-09-24 · D11]. Bulk scan was also where to strip out the bigger system's
failure modes, the odd ways detection and live streams fail [src: D9]. The phone `#capture` route opened on 08-19
[src: `1bcfb8f94` · 2026-08-19]. The port came on 08-20 at 08:52. The capture path moved to
embed-first identify (~100 ms), with "the ~10s vision LLM demoted to fallback"
[src: `5f76f4810`, `bf0a52e4f` · 2026-08-20]. The LLM was removed completely on 09-03 ("identify
spends NO LLM"; "the vision fallback is gone from BOTH client doors")
[src: `0d12da755`, `5d44daa90` · 2026-09-03]. The scout has 18 commits on 08-18, then none until
09-02 [src: `git log -- apps/whatnot-scout`, per-day counts]. That fits D9's "not concurrent".
Lots followed a founder-sequenced plan (M1 batch queue, M2 captures, M3 lots). It was flagged from 08-21
and on in production 09-20
[src: `0f6b04285`, `3359aabd8`, `9131c674b`].
*Not done:* the LLM stayed as a fallback for two weeks.

**Act 4: comps/pricing, raw comps across conditions (09-06 →) [src: founder · D11].**
*Why:* the need grew from graded + NM raw, where an API was enough, to raw comps at every
condition [src: founder testimony · 2026-09-24 · D9]. Service evidence: a 07-30 plan notes that
condition-segmented data "ALREADY EXISTS" through the API and that "pregrade already reads
raw_nm" [src: `35d383b35` · 2026-07-30]. The first shipped tiers were "per-condition raw comps
(NM/LP/MP/HP/DMG)", with each lot member resolving its own condition, "never silently NM"
[src: `cbb944ee5` · 2026-08-23], a precursor inside lots. The act itself begins 09-06 with the scout's condition tiles, and the 09-07
TTL-by-class redesign, with founder quotes at 13:38, 14:47 ("Founder go") and 17:11 PDT and zero
spend before any build [src: `a8b11dc96` · 2026-09-06;
docs/plan/2026-09-07-comps-ttl-by-class-design.md §0].
*Not done:* no scraping (the 07-30 skeptic pass deleted it), and no cross-service estimates
("absent stays absent").

**Inside act 2: the 5-crop proposer.** A single detectQuad crop was the presented card in 0/36
live frames. The fix cuts up to five crops per fire and sends them in **one** identify request,
and the server keeps the best-scoring crop. The ship gate scored 19 correct / 0 wrong, against
1 / 30 for the old path [src: `3079bbc68` · 2026-09-02; `3b66e82cc` · 2026-09-03]. By 09-09 the
founder called it "a hack/optimization around poor accuracy prior to fixing catalog issues". On
41 scenes, E79b scored the vote 26/41 at 1,893 ms and one padded crop 31/41 at 337 ms
[src: docs/experiments/EXP-E79-single-crop-vs-proposal-vote-2026-09-09.md]. The ledger's verdict: "drop the vote
hack", but E79's vote was over padding variants of one quad, not the extension's five rectangles.
Replayed on 2026-09-24, dropping the rectangle vote locks wrong cards; the extension keeps it [D18].

**The counter-example (D5).** A review lane read the overlapping commit dates as parallel work
and rebuilt this arc as concurrent spines. The founder corrected it: dates show when commits
landed, not where attention was [src: docs/project/decisions.md D5, D9]. The record can be
over-read too.

## 3. The transferable move

Start each act for a stated reason, backed by the previous act's evidence. Act 1
was a deliberate baseline, not a false start. Act 2 measured against that baseline on its first
night. Act 3 used a simpler surface to take the expensive component out. Act 4 opened when the
problem changed shape, not when the code first appeared. A colleague can copy this next week:
write down why the next act starts and which number from the last act justifies it.

## 4. Slide candidates

- **Four acts, four reasons.** One arrow in four segments: baseline → speed → strip failure
  modes → condition-tiered comps. It replaces the D5 swim-lane.
- **The baseline that earned its keep.** Vision 5/6 at 10.4 s beside embedding ~130 ms, then
  SigLIP 0.84 top-1 at 44 ms (08-18 → 08-20).
- **The LLM's exit in two dates.** Demoted to fallback on 08-20, gone on 09-03.
- **The proposer's life.** 0/36 → 19/0 → 26 vs 31 of 41 → verdict "drop the vote hack" (09-09), not yet shipped.

## 5. Open questions for Gerald

1. ~~Where image-to-image first ran~~. **Resolved (D11):** a shared identify core for both apps, not a port.
2. ~~Where act 4 starts~~. **Resolved (D11):** 2026-09-06; 08-23 is a precursor.
3. **"5 crop proposer gone" (09-11).** Partly resolved (D12): the single-crop win stands and the ledger says drop the
   vote, but no ref in any copy removes it from the extension. Planned, or built from an uncommitted tree?
