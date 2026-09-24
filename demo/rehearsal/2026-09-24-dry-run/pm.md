dry run 2026-09-24 · demo/fanout · model sonnet · wall time 55s (start 16:57:19Z, end 16:58:14Z)

# Product Manager draft

**Context:** On Scout, the card-detect → identify handoff was returning results fast (~every 500ms), but the experience was jittery — matches presented then overridden — so it wasn't shippable even though everything past the UI looked promising.

**Scope decision:** The fix could live in UI/UX, card detection, or embedding generation. All three lanes were opened, each fanning into at least 3 exploration areas, each of those into 5 candidate experiments.

**The unlock, in sequence:**
1. Instrument key product transitions for analytics visibility, and make session data replayable so experiments could run offline, concurrently, before any live test.
2. With that in place, scale up: a team of agents ran nearly 100 experiments in parallel isolated environments against the same replayed data, under a hypothesis-driven, gated process — a blocked experiment waited for its gate to clear, then merged/deployed, unlocking the next.

**Takeaway:** with the right context, autonomy, and guardrails, agents let one person work like several parallel versions of themselves. Next step: at the next fork in the road, ask whether validating each path could be automated while you work on something else.

[dropped: the exact technical pipeline — client detects card, generates a crop, sends it to the server for embedding, then runs an image-to-image search query, reason: implementation internals excluded per brief]
[dropped: intended talk audience is Software Engineers, Product Managers, and Product Designers, reason: not scope/timeline/dependency content for this summary]

Questions:
1. What's the timeline to apply this instrumentation-and-replay approach to other product areas?
2. What's the cost/resource footprint of running ~100 concurrent agent-driven experiments?
3. Who owns setting and approving the hypothesis gates, and how do we trust a gate before something merges to production?
