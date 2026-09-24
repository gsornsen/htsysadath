dry run 2026-09-24 · demo/fanout · model sonnet · wall time 77s (start 16:57:19Z, end 16:58:36Z)

# Product Designer draft

Early in building Scout, Gerald hit a wall at the seam between "detect a card" and "identify it": the underlying match was working — results came back roughly every half second — but the app itself was jittery, presenting a match, then overriding it with another, and another. "Not even close to usable," in his words, even though everything past the presentation layer looked promising.

The tradeoff he made: don't treat this as one problem. He split it into layers — the presentation/UI, the card-detection step, and the embedding/matching step underneath — each layer explorable, and testable, on its own.

What made that split pay off was capturing real usage data so it could be replayed and tested offline, concurrently, before anything touched production. That let him run close to 100 experiments across isolated environments, gated by hypotheses rather than guesswork — many of them completing while he was asleep or doing other work, with results simply unlocking the next experiment when a gate cleared. His takeaway: give agents the right context, autonomy, and guardrails, and they work like multiple versions of yourself — freeing you to focus elsewhere.

[dropped: the client-to-server embedding pipeline and image-to-image search mechanics behind the match step, reason: implementation detail excluded per audience brief]
[dropped: each of the three lanes (UI/UX, detection, embedding) fanning into at least 3 system areas and then 5 experiments apiece, reason: too granular for word budget]
[dropped: PostHog instrumentation of key transitions as the specific mechanism enabling replay, reason: engineering internal excluded per audience brief]
[dropped: experiments run in isolated git worktrees, reason: implementation detail / word budget]
[dropped: the two next-week takeaways (watch for the next fork in the road; ask whether validating each fork could be automated), reason: secondary call-to-action, cut for word budget]
[dropped: Gerald's stated target audience for the talk (Software Engineers, Product Managers, Product Designers), reason: meta info about the talk, not part of this narrative]

Questions:
- Which layer — UI, detection, or embedding — turned out to be the real source of the jitter?
- What made it safe to ship a presentation-layer fix before the underlying match quality was resolved?
- How did he decide which of the ~100 experiments were worth keeping versus discarding?
