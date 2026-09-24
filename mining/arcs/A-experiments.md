# Arc A — the experiments track (SIGLIP2-TRACK)

## 1 · The arc in one paragraph

Between 2026-09-05 and 2026-09-21, the identify pipeline was worked through 155 pre-registered
experiment documents (of "229 entries" counting raw-data folders), each with a question, a bar
fixed before the run, and a documented KILL condition. The spine: detection/search housekeeping
(E1-E44) → an encoder freeze (E46b, E53d, E57, E58 all NO-GO on changing or fine-tuning the model)
→ most "wrong card" errors are actually artwork misses, not print misses (E62) → the truth set
itself is structurally blind to catalogue coverage gaps (E63) → the language/dedup question the
founder asked directly (E61's own epigraph quotes him) → a pre-registered kill of his own
hypothesis (E67) that produced a cheaper fix nobody had asked for → a local-gallery serving stack
(E75-E81) that made the index question mostly moot for latency. The throughline is method, not any
one technique: every non-trivial call is pre-registered, bar-fixed, and the falsifying result stays
in the document rather than getting edited away.

## 2 · Pivotal moments

**2026-09-08, ~13:xx PDT — the founder names the shape (D4).** Quoted verbatim in the E61
pre-registration: *"I'd like to strive for EN only first and work towards a solution of only
adding language exclusive cards to the index and solve for the multi language support without
having duplicated art across languages."* This is the fork: dedupe the gallery by artwork, keep
one language-exclusive tail, and stop paying for language-duplicated vectors.
[src: docs/experiments/EXP-E61-cross-language-art-dedup-2026-09-08.md §0]

**2026-09-08, 11:52 PDT — the census says the shape is real, and prices the trade.** 96.14% of
19,258 JA renders have an identical-art EN twin (hand-checked on 50+30 stratified pairs). But
deduping also collapses 4,387 EN reprints — already the hardest class in the eval — into shared
vectors. E61-proper (the real hypothesis test) is pre-registered but explicitly not run yet; it
waits on the catalogue growing (CATALOG-JA-1, PikaQian zh-cn) first, per E63's finding.
[src: docs/experiments/EXP-E61-cross-language-art-dedup-2026-09-08.md §0, §6]

**2026-09-08, 20:02 PDT → 22:00 PDT — E67 runs the real test, and kills the dedup arm.**
Pre-registered H1-H5 plus an explicit KILL condition, run on the frozen split once inputs landed.
Result: the deduped gallery + language-head soft re-rank (arm G3) loses 14.43 points of print
accuracy against a 4.0-point KILL line — **KILL FIRES**. The failure is root-caused, not waved
away: the medoid-selection rule silently handed 11,021 of 21,128 artwork groups a non-English
render as their single representative vector, because a continuous provenance score never reached
the tie-break it was supposed to win. A **post-hoc, not-pre-registered** diagnostic arm — the flat,
never-deduped gallery with the same language head applied as a soft re-rank and nothing else
("G0h") — beats every dedup arm on every metric: print accuracy 67.66%→77.61%, wrong-language
misses 34→1, McNemar b=0/c=20 (twenty fixed, none broken).
[src: docs/experiments/EXP-E67-artwork-dedup-gallery-2026-09-08.md §4.3, §4.6, §4.9]

**2026-09-09, 00:03 PDT — what actually shipped.** Production flips `IDENTIFY_LANG_HEAD_SERVE=on`
(pregrade-production build `1e7e03d8`): the language head serves as an additive soft-rerank
penalty on the **flat, still-duplicated** gallery — not a gate, not a scope, not an index rebuild.
Search scope stays EN-only at first; a same-night attempt to also union JA into the search scope is
explicitly **not** flipped (17 English records broken vs 5 Japanese fixed at the tested depth — the
trade was declined). A re-registered dedup experiment, E67b, is later **closed without being run**,
because E67's own post-hoc numbers already show the deduped arm trailing the flat one.
[src: docs/plan/2026-09-08-handoff-siglip2.md 00:03 PDT and 00:35 PDT entries; docs/experiments/EXPERIMENT-BACKLOG.md "E67" row]

**2026-09-19 — the memory is precise; the tension with Gerald's recollection is framing, not
fact.** Memory `index-design-evidence-2026-09-19` states: flat, one vector per print, no dedup;
language head as soft scope, "served in prod: `IDENTIFY_LANG_HEAD_SERVE = "on"`" — exactly what
E67 and the 09-09 flip show. Gerald remembers the dedup/cross-language work as "the single
experiment that most changed his mind" and "simplified the system and cut training and
maintenance." Read next to "dedup loses 14-20pts, flat kept," that sounds opposed. It is not: **the
index itself was never simplified — it stayed flat, at full size**, and no rebuild ever shipped
(E67b closed unrun). What Gerald is describing is what *testing* his own dedup hypothesis produced:
it talked him out of a costly rebuild (index migration, medoid maintenance, per-language galleries)
and out of the encoder-retraining path that had already failed twice (E57, E58), in favor of a
1,538-parameter head — "a 768x2 matmul already on the identify path," zero new Vectorize writes
beyond catalogue growth that had to land anyway. "Simplified" refers to **language handling and
training/maintenance burden**, not index composition — the index is what specifically did *not*
change.
[src: memory index-design-evidence-2026-09-19; docs/experiments/EXP-E65a-language-head-2026-09-08.md §6; docs/project/decisions.md D4]

## 3 · The transferable move

Pre-register the bar and the kill condition *before* the run, and — the part that generalises past
this codebase — **treat a killed hypothesis as a source document, not a dead end.** E67 did not
stop at "dedup loses 14 points"; its own pre-registration said in advance that a result like that
would be "a bug report on the medoid rule, not a finding about dedup," so the next step was already
specified: diagnose the bug, and keep scoring the diagnostic arms regardless of whether they answer
the original question. That is how a negative, pre-registered result (H1 FAIL, H3 FAIL, KILL FIRES)
produced the actual shipped win (G0h, never itself a hypothesis in the document). A colleague can
reuse this directly: write the KILL condition before running anything, and keep scoring past it —
the diagnostic you weren't testing is often the answer.

## 4 · Slide candidates

- **The E67 kill-and-recover table** (§4.2/§4.6 of the E67 doc): five pre-registered arms losing to
  the flat gallery, one post-hoc arm (G0h) beating all of them — a single table that shows a
  falsified hypothesis producing the actual fix.
- **The founder-quote-to-verdict arc**: the exact D4 quote ("without having duplicated art across
  languages") next to the 2026-09-09 00:03 PDT production-flip line — juxtaposed to show the gap
  between the shape someone asks for and the shape that measurably wins, and that both can be true
  at once (his instinct to solve language was right; his specific mechanism was not the one that
  shipped).
- **A small multiples chart of the encoder-freeze trio**: E57 (SigLIP2 swap, -9.55 pts), E58
  (fine-tune, FAIL), E53d-student (distillation, NO-GO) — three independent "obvious" model
  upgrades, three kills, in the same week, before the language-head win. Shows the discipline cost
  of the method (a lot of "no") that made the eventual "yes" credible.

## 5 · Open questions for Gerald

- Was the 2026-09-09 00:03 PDT flip ("founder's word") a live conversation or a standing
  instruction? The plan doc records it as done without quoting the exchange.
- Is there one moment you'd call "the mind-changing one" — the E61 census (96% twin rate), the E67
  KILL, or the G0h post-hoc number — or is it the sequence as a whole?
- E67b (provenance-first medoid) was closed without a run. Is dedup-as-a-storage-lever (3.04x
  smaller index) still worth telling, or fully off the table now?
