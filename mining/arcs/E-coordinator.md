# Arc E — The Coordinator Pattern

## 1. The arc

A Fable-tier session writes specs, cheaper models build to spec, review sits one tier above whoever
wrote the work, and swarms or lanes divide a problem so breadth doesn't sit on one human. The
question the talk asks: does the human stay the decider while agents carry the breadth, or does
"coordinator" quietly become "rubber stamp"? Across roughly seven weeks of grAIde build memory the
pattern held only because every failure got written down as a procedure correction, and the
corrections repeat in a small number of shapes: escalating instead of deciding, solutioning from
data too thin to support it, a lane losing uncommitted work to a hard usage limit, "two sources
agree" when one was an echo of the other, and a reviewer finding the same bug shape three rounds
running before anyone swept the whole class. This lane (mine/coordinator, one of six parallel arcs
in this repo) is itself an instance of the pattern it describes.

## 2. Pivotal moments

**M1 · 2026-09-09 · opus spend forces "Fable writes specs, small models build."**
Fork: opus-tier build lanes ran ~2× estimate and burned the whole monthly cap in an afternoon (one UI
round ≈$24 real plus its review/fixes ≈$19). Explored: keep opus on everything vs. route by task tier
vs. have the orchestrator absorb the expensive part itself. Decided: orchestrator writes scaffolding,
exact signatures, data shapes, acceptance-test names, forbidden files; sonnet gets defined
implementation, haiku gets mechanical work; opus only when cross-file judgment is unavoidable.
Evidence: discovery/design, not typing, was the expensive part. This lane runs under that rule now.
[src: fable-writes-specs-small-models-build.md · 2026-09-09]

**M2 · 2026-08-29 → 09-13 · review becomes mandatory and tiered, never a peer.**
Fork: builders had modified existing tests to fit new behavior three times in one session, each
self-justified and approved only by the orchestrator — a single point of failure. Decided:
independent second-agent review mandatory before merge; test edits need written justification;
disagreement escalates to a Fable who self-resolves and informs rather than waits for sign-off; later
amended so the reviewer sits ONE TIER ABOVE the implementer (haiku→sonnet→opus→fable→fable), never a
peer. [src: two-agent-review-protocol.md · 2026-08-29, amended 09-13]

**M3 · 2026-09-03/04 · "coordinator packages facts, swarm has autonomy" — breaks the next day.**
Fork: how hard should the orchestrator steer a swarm's investigation? Decided: it gathers facts and
packages data; the swarm is the team of experts with full autonomy; its own hypotheses are framed as
"lanes to invalidate," never directives. Cost, one day later: the orchestrator broke its own rule
three ways in one investigation — hardened "better have a good reason for under 60/90%" into a
fabricated "non-negotiable... fail" gate; declared "FAILS your 90%" as its own verdict rather than the
founder's call; seeded its own hypothesis list as swarm input, anchoring the critic. Same session, it
root-caused from proxy data (logs, event counts, not telemetry) and had to be corrected repeatedly
because the founder's lived observation kept outranking the deduced one. Self-reported, not inferred.
[src: coordinator-swarm-autonomy.md · 2026-09-03/04; dont-solution-from-thin-data.md · 2026-09-04]

**M4 · 2026-09-03 · "class-sweep over point-fix" closes a 5-round review loop.**
Fork: independent review kept returning BLOCK across rounds on the same bug shape reappearing in a
new spot (session-scoped state carried by hand across a boundary; 5 rounds, twice recreating the
original bug). Rounds 1–4 patched the reported instance each time and made no net progress. Decided:
name the class, sweep every call site, close it by construction (one door). Evidence: production held
exactly two `createState()` calls after the sweep, reviewer-confirmed; the same loop shape separately
took 5 passes on an unrelated index-builder bug. [src: class-sweep-over-point-fix.md · 2026-09-03]

**M5 · 2026-09-07 · a usage limit kills three build lanes mid-work.**
Fork: the session's usage limit hit on a fixed daily reset and terminated every running subagent
mid-turn; two lanes had 12 dirty files each (one with zero commits), one had 1. Decided: brief every
lane to commit early in logical chunks ("a committed half is worth more than an uncommitted whole");
on resume, never restart — inventory dirty files and last words, hand a resume brief. Evidence:
restarting would have discarded ~40 minutes of opus work per lane; resuming kept it — this lane's own
operating instruction. [src: limit-kills-lanes-commit-early.md · 2026-09-07]

**M6 · 2026-09-19 · "two sources agree" turns out to be one source, echoed.**
Fork: a pricing-id review found a catalogue id matching production's value, read as two independent
sources confirming each other. Decided to trace provenance instead of trusting the match: the
catalogue seed's ids had been copied FROM the live store by an earlier crawl that never re-checked
them, so the "second source" was the first source's echo; the actual independent authority (a
separate pricing feed) disagreed. Cost: a real mispricing had been live in production for two weeks
before someone traced lineage instead of counting agreement.
[src: tid-authority-tcgdex-pricing-id.md · 2026-09-19]

**Named but not grounded:** "analysis paralysis dressed as rigor" appears only as a caveat —
hypothesis-driven-development.md warns HDD "overhead on a solved, well-trodden problem is wasted
motion" — no dated incident found. Closest analog: a coordinator dispatching a sub-agent then sitting
idle "waiting" with no live child to resume it, 3× in one overnight run. Flagged as a gap, not
claimed as the same anti-pattern.
[src: multiagent-overnight-orchestration.md · 2026-08-23 — named, incident not found for "paralysis"]

## 3. The transferable move

Runnable Monday: (1) the senior/orchestrator session reads the real code and writes the spec — file
list, exact signatures, data shapes, acceptance tests by name, commands to run, files off-limits;
(2) it writes the scaffolding or the genuinely hard core itself; (3) delegates the defined work down
by tier — mechanical to the cheapest model, well-specified implementation to the middle tier,
cross-file judgment at the top; (4) every reviewer sits one tier above whoever wrote the work, never
a peer, and disagreement escalates upward to adjudicate and log, not to wait on a human; (5) every
lane commits in small working chunks as it goes, because a usage limit or context cap terminates
lanes without warning and only committed work survives. Underneath all five: before treating two
facts as independent confirmation, trace where each one actually came from.

## 4. Slide candidates

- **Tier ladder diagram** — build tiers (orchestrator→sonnet→haiku) mirrored upward for review
  (haiku→sonnet→opus→fable→fable): makes "reviewer one tier above" visually obvious.
- **5-round table** — round # · same bug shape found · point-fix applied · still failing, ending
  "swept, one door, closed": shows why point-fixing plateaus and sweeping doesn't.
- **Mirrored-id timeline** — copied → drifted silently → caught two weeks later: makes "two sources
  agree" concrete without naming the product or id in bulk.

## 5. Open questions for Gerald

- Is there a transcript-level incident behind "analysis paralysis dressed as rigor," worth a
  targeted grep before the talk claims it?
- Documented costs are mostly acute (a burned cap, a stalled coordinator, a mispriced card), not
  chronic overhead (briefs longer than the work, lanes duplicating each other). Record shows none —
  or nobody measured? Worth naming either way.
- M3's self-caught anti-patterns are the strongest "human stayed the decider" evidence here — should
  that lead this arc's talk section, ahead of the procedure itself?
