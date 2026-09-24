# mining/ — OUTPUTS only

- `timeline/` — `sessions.md` (transcript inventory; redact the opening-request column before
  commit), `git-timeline.md`, `pivots-timeline.md`.
- `findings/` — per-source finding files (`transcripts-<sid8>.md`, `experiments-index.md`,
  `git-merge-bodies.md`, `cross-arc.md`).
- `arcs/` — one synthesis per arc (`A-experiments.md`, `B-pivots.md`, `C-personas-review.md`,
  `D-personas-documents.md`, `E-coordinator.md`, `F-agent-labeling.md`).
- `raw/` — git-ignored scratch for working copies. Never committed.

Every finding carries a `[src: …]` line (format in docs/sources/README.md).
