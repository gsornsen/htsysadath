dry run 2026-09-24 · demo/fanout · model sonnet · wall time 20s (start 16:57:19Z, end 16:57:39Z)

# Engineer draft

Problem: at the detect-card → identify boundary, the client detects a card, generates a crop, sends it to the server for embedding generation, then runs an image-to-image search query. Results returned at roughly a 500ms cadence, but the app was jittery — presenting matches, then overriding them. Not usable, though everything past the presentation layer looked promising.

Candidate fixes spanned three lanes: UI/UX, Card Detection, Embedding Generation. Each lane fanned out into at least 3 system areas to explore, and each of those into 5 candidate experiments.

Mechanism: instrument key transitions in PostHog, make the data replayable, and run experiments concurrently offline before pushing to live testing. With that in place, a team of agents ran nearly 100 experiments in isolated git worktrees, all replaying the same captured data, using a hypothesis-driven method with gates. An experiment blocked on another would deploy/merge and unlock the next once its gate cleared — including while unattended (asleep, or working on other tasks).

Questions:
1. What specifically triggers a "match override" — a new embedding result superseding a displayed one, or a UI race condition?
2. How is the replay data captured and kept representative of live conditions (lighting, card angle, camera hardware variance)?
3. What defines a gate — a threshold on a specific metric, a manual review step, or an automated test suite per experiment?
