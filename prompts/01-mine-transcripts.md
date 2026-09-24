# Lane body — mine Claude Code transcripts for decision moments

**Model:** Sonnet (Haiku for the index step). **Branch:** `mine/transcripts-<sid8>` (one lane per
session file or per date window). **Output:** `mining/findings/transcripts-<sid8>.md`.

## Size guard (read first)
The transcript directory is `~/.claude/projects/-Users-geraldsornsen-git-grAIde/`: 27 `.jsonl`
files, 1.25 GB; single files reach 420 MB. NEVER `cat`, `Read`, or `json.load` a whole file.
Use `mining/timeline/sessions.md` (from `scripts/inventory-transcripts.py`) to choose a session,
then work by `grep -n` and `sed -n 'A,Bp' | cut -c1-2000`. Parse a line only when you need it.

## What you are looking for (the talk's raw material)
A **decision moment** = a point where the human faced a fork. Signals in the text:
- the human's own words: "should we", "what decision", "options", "instead", "let's focus",
  "pivot", "not now", "later", "go both", "push and", "agreed", "disagree", "why not"
- the assistant offering a recommendation with alternatives, and what was chosen
- an experiment being proposed, and the result changing a plan
- a lane being killed, re-briefed, or reviewed multiple rounds
- a step-back: "stop point-fixing", "class", "one door", "hypothesis", "discriminating"

## Method
1. `grep -n -i -E "<signal list>" <file> | cut -c1-200 | head -300` → candidate line numbers.
2. For each promising hit, `sed -n` a window of ±15 lines, `cut -c1-1500`. Parse `timestamp`,
   `type`, and the text. Note: `user` lines with `<system-reminder>` or `[Request interrupted…]`
   are not the human; skip.
3. Record a finding ONLY if you can state: the fork, the options on the table, what was chosen,
   what evidence drove it, and what happened next (or "unknown"). Paraphrase. Strip emails,
   hostnames, key paths, credit figures, third-party names.

## Output contract (`mining/findings/transcripts-<sid8>.md`)
```
# Findings — session <sid8> (<first date> → <last date>)
Scanned: <N> grep hits, <M> windows read. Lane model: <tier>.

## F1 · <date>T<hh:mm>Z · <one-line title>
Arc: A|B|C|D|E|anti-pattern
Fork: …
Options on the table: …
Chosen: …  Evidence: …  Then: …
Why it matters for the talk: one sentence.
[src: transcript <sid8> · <timestamp> · ~line <n>]
```
Max 25 findings per session; prefer the ones with the clearest fork. End with "Not found /
could not verify" and 3 suggested follow-up greps.

## Done means
Every finding has a `[src:]` line; a reviewer can re-run one grep per finding and land within
±30 lines. Commit the findings file on the branch; report ≤ 30 lines.
