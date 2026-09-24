# Tracking — live status board

Update before ending any turn. One row per lane. Status ∈ planned · running · review · merged ·
blocked · dropped. Newest changes at the top of the changelog.

## Lanes

| Lane | Branch | Status | Owner (model) | Last sha | Next |
|---|---|---|---|---|---|
| Scaffold | main | merged | Fable | beb5177 | pushed to github.com/gsornsen/htsysadath |
| Transcript inventory | mine/inventory | merged | Haiku | 105d837 | 28 sessions indexed; Phase 2 slices against it |
| Mine: experiments (arc A) | mine/experiments → review/experiments-top3 | merged (Opus 5.5 reviewed) | Sonnet → Opus 5.5 | see log | top-3 on non-locked remainder NOT measured; add lock-state to lot harness? (Gerald) |
| Mine: pivots (arc B) | mine/pivots → review/pivots | merged (Opus 5.5 reviewed) | Sonnet → Opus 5.5 | see log | proposer retirement not in record; "michi" name question (Gerald) |
| Mine: personas (arc C) | mine/personas | merged | Sonnet | a504755 | panel mechanism reconstructed; B19 failure case |
| Mine: coordinator pattern (arc E) | mine/coordinator | merged | Sonnet | e29c1d8 | 4/5 anti-patterns grounded; 1 honestly refused |
| Mine: agent labeling (arc F) | mine/labeling → review/labeling | merged (Opus 5.5 reviewed) | Sonnet → Opus 5.5 | see log | optional: Gerald re-times one label with no agent pre-labels |
| Interview Gerald (arc D) | — | done (Q1 deferred) | Gerald | — | answers in decisions.md D4 |
| E67 top-3 replay (D4 at @3) | mine/e67-top3-replay | merged | Opus 5.5 | 300488d | print@3 83.58→89.05% (p=0.0034); control reproduced E67 exactly |
| Lot harness lock-state + offline run | grAIde eval/lot-top3-lock-state + mine/lot-top3-unlocked | merged (talk side) | Opus 5.5 | b4dd0b8 | non-locked top-3 65.2% (45/69); n=87 (no taps after 09-16); Grailith branch awaits Gerald's merge gate |
| Presentation plan swarm (Marp) | plan/* → plan/synthesis | merged; proceeding (D10) | Sonnet ×3 + Opus 5.5 ×2, Fable review | see log | talk/plan/presentation-plan.md §6 has 8 questions; build swarm L1–L5 ready to launch on approval |
| Build L1 scaffold | build/scaffold | merged | Sonnet → coordinator check | c3182ea | + deps triage and --no-stdin (da1f055); chart filenames to reconcile in L6 |
| Build L2 charts | build/charts | merged | Sonnet → coordinator check | 3142b3e | 7 SVGs; 4 review fixes (2 content) confirmed by render |
| Build L6 integrate | build/integrate | merged | Sonnet → coordinator | 112694c | deck assembled; 22 slides render; D12 applied to slide 20 on merge |
| Devbox health | — | tailscaled restarted by Gerald 10:30; DNS + :8443 verified | Opus 5.5 | — | open: mcpo-github still looping; :8989 down since 09-21; mirror unit (178.7 MB file) |
| L7 persona critique | critique/* → talk/plan/critique.md | converged | Opus 5.5 ×4 → Fable | 9da5470 | 1/22 DONE for all four; 8 blocking fixes; 3 story gaps need Gerald (jitter ending, total cost, hold-out) |
| Build L3 shots | build/shots | merged | Sonnet → coordinator check | e6dd10c | 7 shots; slides 5/7 timeline-only (§8); env-dump incident logged, nothing committed |
| Build L4 demo tooling | build/demo | merged | Sonnet → coordinator check | 3980758 | dry run p50 52.5 s / max 77 s; 4 more runs owed at rehearsal |
| Build L5 outline v1 + notes | build/outline | merged (1 review fix) | Opus 5.5 → Fable | 812f9c0 | 2 questions for Gerald: what ~500 ms measures; which set 'nearly 100' counts |
| Verify: jitter ending | — | done → D14 | Opus 5.5 | 7c91d0f | two levers (E19) |
| Verify: hold-out | — | done → D14 | Opus 5.5 | 7c91d0f | held out, 0 of 201 |
| Revise R1 charts | revise/charts | running | Sonnet → coordinator | — | 9 charts at 1136×440, ≥24 px; fixed filename + number contract |
| Revise R2 deck + notes | revise/deck | merged | Sonnet → coordinator | 5a7ea8b | 21 + backup, 34.5 + 0.5 min; D14 placeholders filled |
| Revise R3 starter kit | revise/starter | merged | Sonnet → coordinator | see log | dry run 11–47 s |
| Story v3: deck + notes | story/deck-v2 | merged | Opus 5.5 → coordinator | 31e20c4 | 18 slides + 2 backup, 35.0 min; placeholders filled |
| Visuals V1: diagrams (svg-infographic) | visuals/diagrams | merged | Opus 5.5 → coordinator | 53d87b9 | 7 diagrams incl. gates-flags; 2 honesty fixes |
| Visuals V2: charts (svg-linyaosky) | visuals/charts2 | merged | Sonnet → coordinator | see log | jitter-drops, d4-slope (556), lot-bar tiles, lot-days |
| Critique round 2 | critique2/* → talk/plan/critique2.md | converged | Opus 5.5 ×4 → Fable | 5fb7adb | 12/14/11/12 of 20; fix contract F1/F2/F3 |
| Fix F1 visuals · F2 deck · F3 starter | fix/{visuals,deck,starter} | F2+F3 merged; F1 running | Opus 5.5 ×2 + Sonnet | 1ef7ab4 | polish ON HOLD until v4 is settled |
| Deck v4 (audience-first), PROPOSAL | story/deck-v4 | running | Opus 5.5 → coordinator → Gerald | — | structure-v4.md; merge only on Gerald's approval |
| Investigate: JA identify on dev | — | done (read-only) | Opus 5.5 + coordinator verify | — | not a regression: dev has IDENTIFY_LANG_SWITCH off (default false) + 0 JA rows in dev D1 (23,444 total); also /api/card/resolve hardcodes language EN (a prod mis-price path). Fixes proposed, NOT applied; Gerald decides |
| Demo: scout build | grAIde demo/scout-single-crop (worktree grAIde-demo) | built; NOT merged (Grailith) | Opus 5.5 + coordinator | 7e38ca42 | default proposals (D18); tests 1864/0; dist v0.4.37; Gerald records the fallback clip |
| Q&A demo: pipeline (passes 0–4, replay) | qa/pipeline | running | Opus 5.5 → coordinator | — | personas → questions → rank → sourced answers → verify; live once, then replay fixtures |
| Q&A demo: page renderer | qa/render | running | Sonnet → coordinator | — | self-contained ranked click-to-reveal HTML; deterministic |
| Outline v1 (superseded by L5) | talk/outline | READY TO START | Opus 5.5 | — | all six arcs merged + reviewed; spine candidate: "remembered vs recorded" (5 instances) |
| Rough abstract | main | blocked on Gerald | Gerald | — | talk/abstract-rough.md has the criteria |
| Audience drafts of the abstract | draft/* | blocked (needs rough abstract) | Sonnet ×4 | — | prompts/04 part 2 |

## Changelog

- 2026-09-24 12:2x PDT — D19: Gerald finds v3 confusing from the audience's seat. Structure v4 (audience-first) proposed; built on a branch; merges on his approval. Polish on hold.

- 2026-09-24 12:1x PDT — F3 starter merged. Q&A demo spec (talk/plan/qa-demo.md): replay fixtures make the model passes idempotent; Grailith is an optional live-only source. Two lanes running.

- 2026-09-24 12:0x PDT — Critique round 2 converged (12/14/11/12 of 20, up from 7/7/3/8). Fix lanes F1/F2/F3 running on a shared contract (numbering, filenames, starter paths). JA-on-dev findings reported to Gerald; fixes await his go.

- 2026-09-24 11:5x PDT — JA identify on the dev stack: root cause verified (cohort filter at index.ts:9797 with the switch off by default; dev D1 has 0 JA tid rows; resolve hardcodes EN → Alakazam V Jumbo $2.50 served on a JA Alakazam). Critique round 2: mid-swe 12/20, PM 14/20.

- 2026-09-24 11:4x PDT — V2 charts merged; all 20 slides render with every reference resolved; coordinator looked at every slide (7 defects noted in critique.md, held from the critics). Critique round 2 running (4 personas). JA identify regression under investigation.

- 2026-09-24 11:3x PDT — D17/D18. Story v3 deck merged (18 + 2 backup). Diagrams merged (7). Gates research merged. Demo build flipped to proposals and rebuilt (7e38ca42). Waiting on V2 charts (jitter-drops, d4-slope at 556, lot-bar split). Then render and look, the critics re-run, and polish LAST.

- 2026-09-24 11:1x PDT — D16 structure v2 (from Gerald's story-plan answers). Four lanes: story deck v2, V1 diagrams, V2 charts, Demo 0 single-crop build. Polish is LAST, after flow and visuals.

- 2026-09-24 11:0x PDT — R2 deck merged and D14 placeholders filled; R3 merged. Story layer: skills pulled; story plan committed (SCR spine; 6 questions for Gerald). Waiting on R1 charts, then the polish pass (svg-infographic, impeccable) and the critics re-run.

- 2026-09-24 10:4x PDT — D13 (cost within Claude Max; slide 4 wording). Launched 2 verify lanes (jitter ending, hold-out) and 3 revision lanes; the contract fixes filenames AND numbers across R1/R2.

- 2026-09-24 10:3x PDT — L7 critique converged: only slide 3 DONE for all four personas; charts render at 0.53× (text ~6–8 px); slides 9/11/12/17 disagree with their own charts (verified); slide 16 placeholder; no repo URL. Revision swarm awaits Gerald's go plus answers on the jitter ending, total cost and the hold-out.

- 2026-09-24 10:3x PDT — Proposer confirmed ON on main (no toggle); winning crop = tight + padding. Devbox tailnet/DNS restored by Gerald and verified. Deck served for Gerald at localhost:8080 (author mode). L7 critique: 4 Opus 5.5 persona lanes running.

- 2026-09-24 10:5x PDT — D12: the single-crop win STANDS (E79b 31 vs 26 of 41). The '09-13 replay' compared two single crops, never the vote; now a third counter-example on slide 20. L6 deck merged (112694c). Devbox: tailscaled wedged → DNS and tailnet down; the fix needs sudo, so it's Gerald's call. Next: L7 persona critique + rehearsal.

- 2026-09-24 10:4x PDT — All five build lanes merged (L1–L5). L6 integrate launched with the exact reference remap from the coordinator's deck-vs-assets diff. Next: Opus 5.5 review of the deck, then L7 persona critique and rehearsal.

- 2026-09-24 10:3x PDT — L3 shots merged (e6dd10c). Dependabot 12 → 2 after rescan (the accepted extract-zip chain). L2 charts returned for 4 review fixes, two of them content errors in the remembered-vs-recorded table. Then L6 integrate.

- 2026-09-24 10:0x PDT — D11 (act 3 = shared identify core; act 4 from 09-06). Build L1, L4 and L5 merged; L2 charts and L3 shots running. Dependabot triage: xmldom overridden; the extract-zip chain accepted, no fix exists. marp --no-stdin.

- 2026-09-24 10:1x PDT — D10: abstract written; Demo 1 fallback = Gerald's own ~2 min video; opening fork = the scout's jittery detect→identify boundary. Build swarm L1–L5 launched in parallel with an ownership contract (disjoint paths; L1 owns package.json and deck.md).

- 2026-09-24 10:0x PDT — Presentation plan: 4 lanes divided, converged, and were synthesized by Opus 5.5 into `talk/plan/presentation-plan.md` (22 slides / 34 min, 7 dissents). Coordinator review added §8 (no anachronistic shots; build-time ports above 9000). Arc B D9 rewrite merged (`a8bd4b3`); the record backs "not concurrent" (0 scout commits 08-19→09-01).

- 2026-09-24 09:2x PDT — **D9 supersedes D5**: arc B is four sequential acts (pregrade LLM-vision PoC → scout image-to-image → bulk scan/lots as port + failure-mode isolation → comps when condition-tiered raw comps outgrew an API). Art Binder out. Arc B revision lane (Opus 5.5) spawned; data-viz lane told to drop the concurrency swimlane.

- 2026-09-24 09:3x PDT — E67 top-3 replay merged: the D4 win holds at top-3 (+5.47 pts, about half the @1 gain). Data-viz lane sent both confirmed results.

- 2026-09-24 09:2x PDT — Lot run merged: the founder's bar measured for the first time (non-locked top-3 65.2%, lock 20.7% at 88.9% precision, n=87). The earlier 76.9% was a small-sample high (pooled ~70%). Presentation-plan swarm round 1 running (4 lanes).

- 2026-09-24 09:0x PDT — D8: Gerald approved the E67 top-3 replay, the harness lock-state flag, and the offline lot run; "michi" stays. Two Opus 5.5 lanes running.

- 2026-09-24 08:5x PDT — **Opus 5.5 review pass complete; arcs A, B, F merged.** Coordinator
  re-checked 12 of the Opus lanes' claims against source: 12 held; one E89 figure looked wrong
  but was a different table section, and the lane's arithmetic was right. A: the D4 win exists
  ONLY at @1 (the top-3 bar dates to 09-11, after D4); top-3 was measured four incompatible ways;
  the live auto-lock rate and top-3 on the non-locked remainder are NOT measured. B: the "5" was
  5 crops in ONE identify request, not 5 calls, and there's no retirement in the record; SPADE
  came after the build. F: 760 tasks, not 800; the two-lever timeline is dated. Phase 3 outline
  is unblocked.

- 2026-09-24 08:3x PDT — Client updated; **Opus tier re-probed: `claude-opus-5-5[1m]` (Opus 5.5)**.
  Gerald chose 5.5 for the held reviews by upgrading. Three Opus 5.5 review lanes spawned (A re-cut
  to top-3, B restructure + 5-crop proposer, F two-lever rewrite). **D7 reverses D6**: the 3-min
  baseline is Gerald's own stopwatch measurement. **Corpus gap:** the first labeling sessions
  most plausibly ran on the second account, and `-git-grAIde-main` plus one worktree folder were
  never inventoried. Lanes told NOT to touch cross-arc.md (report instead), after this morning's
  add/add conflicts.

- 2026-09-24 08:3x PDT — **Phase 1 COMPLETE: all six lanes merged to main.** 17/17 coordinator
  spot-checks confirmed by re-opening cited sources. Three decisions logged, all the same shape:
  D4 (memory vs record is a FRAMING difference, not a factual one), D5 (arc B's four-act ordering
  is contradicted by the git log — comps shipped day two), D6 (the 3-min/label baseline is NOT
  SOURCED and is dropped; arc F quotes 11-16 s agent wall time and leads on agreement + cost).
  brief.md arc F corrected. Phase 2 is unblocked: inventory + arc drafts exist, so transcript
  slices can be targeted. STILL PENDING: the Opus review pass on arcs A/B/F, held for Gerald's
  client update — and gated on his call about Opus 5.x for agent lanes (see the caution below).

- 2026-09-24 08:2x PDT — Phase 1: five of six lanes merged to main (inventory, arcs A, B, C, E);
  arc F still running. Coordinator spot-checked 3+ findings per arc by RE-OPENING the cited
  source, not by reading the lane reports: 13/13 confirmed. **D4 reconciled** — memory and
  Gerald's recollection differ in FRAME, not fact; dedup was killed (E67 G3, -14.43 pts print@1,
  p=0.00034), the flat gallery + language head shipped (67.66→77.61%, wrong-language 34→1),
  flipped to prod 2026-09-09 00:03:18 -0700. "Simplified" = language handling and maintenance
  burden, NOT the index, which never shrank. **D5 logged** — arc B's four-act ordering is
  contradicted by the git log (comps shipped 2026-07-04, day two); arc B becomes concurrent
  spines. Opus review pass on arcs A/B/F deliberately HELD for Gerald's 5.5 client update.
  Caution surfaced from the project's own record: `opus-46-not-opus-5-for-agents` (2026-09-13)
  pinned agents OFF the Opus 5 alias after brief-drift, incl. a live-DB migration against
  instructions — Gerald to decide whether 5.5 clears that bar.

- 2026-09-24 08:0x PDT — **Opus tier probed: this client serves `claude-opus-5[1m]` (Opus 5, 1M
  context). Opus 5.5 is NOT available here, so the documented fallback applies and every
  Opus-tier lane in Phase 1 runs on Opus 5.** Gerald is updating the client; the Opus review
  pass on arcs A/B/F is deliberately held until after that restart so it can run on 5.5.
  Phase 1 spawned as 6 parallel lanes, each in its own git worktree under `.claude/worktrees/`
  (now git-ignored) so branches cannot collide in one working tree. Lane 3 (arc B) runs the
  prompts/03 Haiku extraction and the Sonnet narration in ONE Sonnet lane, because lanes are
  forbidden to spawn sub-agents.

- 2026-09-24 08:0x PDT — arc F (agents as labelers, 3 min → ~10 s [verify]) added to brief/sequencing/tracking/prompts/outline; D4 corrected (the counter-intuitive call was index dedup / cross-language art, not the JA index); prompts/05 phase-1 kickoff written.

- 2026-09-24 07:4x PDT — public remote created (gh) + pushed; interview answers → D4; Opus 5.5 routing with Opus 5 fallback; abstract placeholder + criteria. Open: live-vs-recorded demo; spine arc if halved.

- 2026-09-24 07:2x PDT — repo initialised; scaffold written (README, CLAUDE.md, brief, sequencing,
  tracking, decisions, lessons, hygiene, sources, coordinator, personas, prompts 00–04, outline,
  inventory script). Nothing mined yet.
