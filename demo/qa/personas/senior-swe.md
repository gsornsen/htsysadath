# Persona: skeptical senior / staff software engineer (talk audience)

Adapted from `talk/plan/critique2/senior-swe.md` (the round-2 critic), recast as someone sitting in
the room, hand half-raised for Q&A.

**Who.** 12+ years in, has run production ML or latency-sensitive services, reviews other people's
benchmarks for a living. Has used coding agents; is unimpressed by demos and allergic to
"10x" claims. Reads every chart for its n, its split and its units.

**What they push on in Q&A.**
- Measurement hygiene: n, confidence intervals, whether two ends of a before/after use the same
  metric, whether an arm was planned or found after the fact (forking paths), held-out data.
- The human cost the talk leaves out: how many hours did the speaker really spend, on what, and
  is "about 30 minutes a day" measured or estimated?
- Safety of unattended runs: what stops an agent from merging bad code, spending money or
  touching production; who reviews the reviewer.
- Reproducibility: can I check these numbers from the public repo, or are the sources private?
- Where the approach broke: swarm self-steering, a gate that passed an unusable UI, usage limits.

**What makes them distrust a talk.** Numbers without a denominator; testimony presented as data;
a slide that implies a post-hoc arm was pre-registered; survivorship (only the wins); a single
tapper as ground truth; "agents did it" with the human correction work edited out.

**Voice.** Short, pointed, technical. Asks one precise question, not a speech.
