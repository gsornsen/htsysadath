#!/usr/bin/env bash
# demo/aliases.sh — Demo 2, "the record, replayed" (talk/plan/02-live-demos.md Demo 2,
# presentation-plan.md slide 19). Source this file, then call the three stop functions in
# order. Offline: no network, model or credentials.
#
#   source demo/aliases.sh
#   demo2_stop1_fanout
#   demo2_stop2_corrections
#   demo2_stop3_review
#
# Rule (presentation-plan.md convergence, "Git graph three ways"): every command below walks
# `main`'s own ancestry only — NEVER `--all` — so the `worktree-agent-*` and other in-progress
# lane branches never appear on stage. `git log --oneline` prints hash + subject only: no
# paths, usernames or emails.

demo2_stop1_fanout() {
  # Stop 1: six mining lanes fan out from the scaffold commit and merge --no-ff, each body
  # saying what was learned (arc E coordinator, arc C personas, arc A experiments, arc B
  # pivots, arc F labeling, plus the session inventory). Representative merge: 3de113f.
  git log --graph --oneline -22 3de113f
}

demo2_stop2_corrections() {
  # Stop 2: the record corrected in both directions. Curated as three short windows (not one
  # continuous range) so it stays legible: D5 and D9 are 32 commits apart in the log, and
  # showing everything between them would bury the point in unrelated top-3/review commits.
  #   D6 -> D7 (3-min/label baseline): 767b0c4 (08:22) -> 7fefd2f (08:29), 7 minutes, one window.
  #   D5 (08:19) -> D9 (09:27, arc B ordering): shown as its own before/after pair.
  # The log keeps both corrections; neither commit is rewritten or dropped.
  echo "-- D6 -> D7: dropped the 3-min baseline at 08:22, restored it 7 min later at 08:29 --"
  git log --graph --oneline -5 7fefd2f
  echo
  echo "-- D5 (08:19): arc B first read as concurrent spines --"
  git log --graph --oneline -5 b1d7e8f
  echo
  echo "-- D9 (09:27): D5 superseded — arc B is four sequential acts, each with a reason --"
  git log --graph --oneline -5 7607585
}

demo2_stop3_review() {
  # Stop 3: review merges. The reviewer sits one tier above the implementer (Opus 5.5 review
  # of the Sonnet mining lanes): a0641ea (arc F), 6b0d9b9 (arc A top-3), 1f3a3f7 (arc B).
  git log --graph --oneline -10 1f3a3f7
}

demo2_all() {
  echo "=== stop 1: fan-out merges ==="
  demo2_stop1_fanout
  echo
  echo "=== stop 2: D6<->D7 and D5<->D9, corrected both ways ==="
  demo2_stop2_corrections
  echo
  echo "=== stop 3: review merges (one tier above) ==="
  demo2_stop3_review
}
