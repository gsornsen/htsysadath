# Gates and flags that let experiments run unattended

Mined for D17's focus slide: what made agent-run experiments safe to run overnight unwatched
(~30 min/day of Gerald's time to set them up).

## (a) Mechanism table

| Mechanism | Prevents | Example | src |
|---|---|---|---|
| Pre-registered PASS/KILL bar | Moving goalposts after the result | E67 KILL: `print@1(G3) ≥ print@1(G0) − 2.0 pts`; loss 14.43 pts → FIRES | [src: EXP-E67-artwork-dedup-gallery-2026-09-08.md §4.9] |
| Pre-registration, standard practice | Unfalsifiable writeups | 83 of 151 `EXP-*` docs mention pre-registration (case-insensitive `pre-regist`); 12 carry an explicit KILL line (E67's kill fired at a 14.43-pt loss) | [src: coordinator grep over docs/experiments/EXP-*.md, 2026-09-24; talk/notes.md P3a] |
| Flag, dev ON / prod OFF | Unproven behaviour reaching users early | `IDENTIFY_LANG_HEAD_SERVE` flipped prod ON 09-09 after replay: +5.97 pts, 12 fixed/0 broken | [src: EXPERIMENT-BACKLOG.md; handoff-siglip2.md 00:03 PDT] |
| Flag default OFF pending corroboration | Overnight-only code in normal builds | `FAST_TIMERS` dev ON/prod OFF; boundary-enter "defaulted OFF until the replay shows a lift" | [src: EXP-E88-...2026-09-11.md §1; EXP-E116-...2026-09-12.md] |
| Inert knob default | Silent behaviour change pre-evaluation | `hashVeto` null ⇒ shipped `sameCard` unchanged | [src: EXP-E91-...2026-09-11.md] |
| Founder-only prod flip | Agent unilaterally changing production | Flip logged "PRODUCTION FLIP DONE (founder's word)" | [src: handoff-siglip2.md 00:03 PDT] |
| Per-run tool/time/spend cap | Unattended agent looping or overspending | E84 labeler pilot: 8 calls · 60 s · $6/run; raised to 14 after agents hit the wall | [src: EXP-E84-...2026-09-09.md L5, 64] |
| Env validation refuses prod drift | Box-only config reaching prod | `env-validation.ts` throws if `EMBED_SEARCH_LANGS` ≠ `"en"` — JA gate hadn't passed | [src: services/card-embed/src/env-validation.ts:150-158] |
| Idle-tab / spend watchdog | A dead orchestrator leaving a capture running | Chrome left on a live stream burned the full daily API allowance plus purchased credits in ~7 h | [src: memory `park-the-scout-chrome-on-stop`, 2026-09-07] |
| Reviewer one tier above | Self-approved merges | Standing rule beside "never --amend/rebase/reset shared refs" | [src: 2026-09-18-trunk-consolidation-plan.md L159] |
| Commit early / in chunks | Losing work to a usage-limit kill | Kill hit three lanes; all resumed from their last commit | [src: 2026-09-18-trunk-consolidation-plan.md, "Usage-limit kill"] |
| Frozen eval split, reused | Gate bar drifting with the test set | `split_id fd4f57d5` frozen 09-08; founder 09-11: "stays frozen" | [src: handoff-siglip2.md; 2026-09-11 17:51 PDT decision] |
| Offline replay harness | Needing a live session to score a gate | `lot_top3.py` scores lot top-3 offline; E46d replay scored cold-start without touching prod | [src: 2026-09-11-evening-plan.md §10a; experiment-ledger.md E46d] |
| Overnight contract, named end time | Runs drifting indefinitely | "Run until the stated hour or pause; production not pre-approved" | [src: memory `autonomous-overnight-experiment-mode`, 09-05 21:07→09-06 10:00 PDT] |
| Ledger records what a gate unlocks | Downstream work on unverified input | `INDEX-FULLDIFF`: "22,613/22,613 at cos≥0.9999; unlocks E38/E39" | [src: experiment-ledger.md, INDEX-FULLDIFF] |

## (b) The overnight loop in 5 steps

1. **Hand over the window with an end time.** First window 09-05 21:07 → 09-06 10:00 PDT: "run
   continuously until the stated hour or pause." [src: memory `autonomous-overnight-experiment-mode`]
2. **Queue lanes with each gate stated up front.** The 09-07 23:05 queue named what was running
   and the night's hard rules: zero PPT beyond one probe credit, prod limited to two nodded
   deploys, never a live tab on the box. [src: EXPERIMENT-BACKLOG.md, "Overnight queue 23:05 PDT 09-07"]
3. **Each result re-grooms the queue**, picking the next lane by test-window need and what just
   unlocked or invalidated — recorded as "unlocks E38/E39" rows. [src: EXPERIMENT-BACKLOG.md; experiment-ledger.md INDEX-FULLDIFF]
4. **Gates run against frozen/offline data**, so a verdict doesn't need a live session: split
   `fd4f57d5`, `lot_top3.py`, E46d's replay harness. [src: handoff-siglip2.md; 2026-09-11-evening-plan.md §10a]
5. **Morning: one groomed file, and the words only Gerald can give** — prod flips ("founder's
   word"), index-apply pre-approval, any EN/JA tradeoff flag. [src: handoff-siglip2.md; 2026-09-18-trunk-consolidation-plan.md]

## (c) Honest failures

1. **Idle-tab leak.** A dead orchestrator left Chrome on a live stream; no gate caught it — the
   a full day's pricing-API allowance plus purchased credits burned in ~7 h. [src: memory `park-the-scout-chrome-on-stop`, 2026-09-07]
2. **A cap that bit the founder, not the leak.** The box's minute-bucket governor, left at an
   overnight rail (8/5), throttled Gerald's own live session with 429s next afternoon. [src: EXPERIMENT-BACKLOG.md, GOV-BOX-RATE]
3. **A default cap that denied nothing.** SCOUT-IDLE-WATCHDOG's proposed 5,000/day cap, replayed
   against the actual leak, caught zero; had to drop to 3,000/500 to bite, and even then cost
   Gerald part of his day on the shared budget. [src: EXPERIMENT-BACKLOG.md, SCOUT-IDLE-WATCHDOG]
4. **A converged result an audit reversed.** E84 first read Haiku as worse than Gemini on exact-id
   — the gap was an 8-call cap starving the agent, not a capability gap; re-run at cap 14 changed
   the read. [src: EXP-E84-agent-tools-pilot-2026-09-09.md L64, 84-89]
5. **Usage-limit kill mid-lane.** Three lanes were interrupted mid-work; commit-early meant they
   resumed rather than lost work, but each still needed a human-adjacent re-gating pass. [src: 2026-09-18-trunk-consolidation-plan.md, "Usage-limit kill"]

## (d) Diagram content — `gates-flags.svg` (≤ 7 boxes, ≤ 6 words each)

1. **Pre-register: hypothesis + kill bar**
2. **Flag: dev ON / prod OFF**
3. **Caps: tool calls · time · spend**
4. **Env validation refuses prod drift**
5. **Idle watchdog: park the tab**
6. **Gate clears → unlocks next lane**
7. **Founder's word: prod flip / merge**

Arrows: 1 → 2 → 3 → 4 (boot-time check before prod) → 6 (result ungates the next lane) ⇄ 5
(watchdog runs alongside every lane) → 7 (only a cleared, reviewed gate reaches the founder).
