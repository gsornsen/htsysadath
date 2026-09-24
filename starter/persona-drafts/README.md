# persona-drafts

`fanout <draft.md> [persona-dir]` starts one headless `claude -p` run per persona brief in
`personas/` (or the directory you pass), all in parallel. It prints one line and returns in
under a second; the lanes keep running in the background and write `out/<persona>.md` plus
`out/<persona>.status`.

## Dry run (2026-09-24, n=1)

Ran `./fanout sample-draft.md` against `sample-draft.md` (a 120-word fake internal proposal,
no real names) with the four generic personas, model `sonnet`. All four lanes started
together at `17:48:12Z`; no lane wrote to its `.err` file.

| Persona | Wall time |
|---|---|
| engineer | 11 s |
| exec | 13 s |
| pm | 20 s |
| designer | 47 s |

All four outputs were well-formed (correct heading, word budget respected, 3 questions under
`Questions:`). `out/` is git-ignored (see `starter/.gitignore`) — it's regenerated every run,
never committed.

This is a single run (n=1); rerun a few times before relying on these numbers for a live
demo or a tight time budget.
