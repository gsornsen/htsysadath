# Sequencing — what runs in parallel, what waits

Legend: **P** parallel/independent · **S** sequential (needs the arrow's source) · **G** Gerald.

```
Phase 0  Scaffold (done 2026-09-24) ─────────────────────────────────────────┐
                                                                             │
Phase 1  P  inventory transcripts (Haiku, minutes)                           │
         P  mine experiments → arc A (Sonnet → Opus review)                  │
         P  mine plans + git → arc B timeline (Haiku+Sonnet → Opus review)   │ all independent
         P  mine design + memories → arc C (Sonnet)                          │ of each other
         P  mine memories + this repo's log → arc E (Sonnet)                 │
         P  mine E28a/E84 + labeling specs → arc F (Sonnet → Opus review)    │
         G  interview (6 questions) → arc D truth · answers spine/length     │
         G  write talk/abstract-rough.md (150–300 words)                     ┘
                    │
Phase 2  S  transcript slices per decision moment (Sonnet ×N) ← needs inventory + the arc
            drafts to know WHICH sessions/dates to slice
         S  four audience drafts of the abstract (Sonnet ×4) ← needs abstract-rough
         P  challenge round: one Opus lane argues the opposite reading of arc A and arc B
                    │
Phase 3  S  outline v1 (Opus) ← any two arcs + interview
         S  hybrid abstract + timing log (G, 10 min)
         S  persona panel on outline v1 (Opus ×4 personas: skeptical senior eng, EM with no time,
            junior IC, product designer) → DONE/NOT
                    │
Phase 4  S  slides + speaker notes per section (Sonnet per section, Opus review)
         S  public push (G confirms remote); README gains "how this was built" with the commit log
         G  dry run; final tweaks
```

## Rules
- Phase 1 lanes must not touch each other's output paths (`mining/arcs/<arc>.md` is one-writer).
- Nothing in Phase 2 starts until its arrow source is MERGED to main, not just "done".
- Any lane that discovers a decision moment outside its arc files it in
  `mining/findings/cross-arc.md` (append-only, one line + provenance) instead of editing another arc.
- Gerald's two items (interview, rough abstract) gate Phase 3; everything else can proceed without him.

## Estimated wall-clock with one coordinator
Phase 1 ≈ 1 session of parallel lanes; Phase 2 ≈ 1 session; Phase 3 ≈ 1 session + Gerald's
10-minute hybrid; Phase 4 ≈ 1–2 sessions. Across two machines: split Phase 1 by arc.
