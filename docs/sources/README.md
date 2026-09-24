# Sources — where the raw material lives (machine: Gerald's Mac; paths are local)

None of this is in the repo. Mine in place; commit findings with provenance.

| Source | Path | Size / count (2026-09-24) | Good for | How to read |
|---|---|---|---|---|
| Claude Code transcripts, main project | `~/.claude/projects/-Users-geraldsornsen-git-grAIde/*.jsonl` | 27 files, 1.25 GB of jsonl (the project dir is 6.1 GB with tool results) | the actual decision moments: what was asked, what was proposed, what was chosen, what was rejected; timestamps | NEVER open whole. Run `scripts/inventory-transcripts.py` first; then grep by keyword/date; slice with `sed -n` around hits. See prompts/01. |
| Transcripts, other projects | `~/.claude/projects/-Users-geraldsornsen-git-michi-mcp/` (28 MB), `-Users-geraldsornsen-git-grAIde-main/` (5.7 MB) | small | side stories (binder/michi) | same tooling |
| Project memory | `~/.claude/projects/-Users-geraldsornsen-git-grAIde/memory/*.md` + `MEMORY.md` index | 223 files | distilled rules, decisions with WHY, dated; the best single map of the method | read `MEMORY.md` then `docs/memory-map.md` in the grAIde repo; each file has frontmatter `type: user/feedback/project/reference` |
| Experiment docs | `~/git/grAIde-main/docs/experiments/` | 229 files (E-numbered + dated folders) | arc A: hypothesis → discriminating test → result → decision; what was NOT tried | list by name; read the RESULT/RECOMMENDATION sections; index them by E-id, date, question, outcome |
| Plan docs | `~/git/grAIde-main/docs/plan/` | 84 files | arc B pivots, sequencing tables, handoffs ("RESUME HERE") | sort by date prefix; the handoff docs are the pivot points |
| Design docs | `~/git/grAIde-main/docs/design/` | 19 | arc C: panel rounds, persona critiques | look for "panel", "R1/R2", DONE/NOT |
| Git history | `~/git/grAIde-main` | 3,966 commits since 2026-07-02 | arc B timeline; `--no-ff` merge bodies carry gate lines and review rounds | `git log --merges --format='%h %ad %s' --date=short`; read merge bodies |
| Observability docs | `~/git/grAIde-main/docs/observability/` | small | how "measure before deciding" was made real | skim |
| Gerald | interview | — | arc D (document personas), the emotional truth of each pivot | prompts/04 has the questions |

## Provenance format (mandatory in every finding)

```
[src: transcript ab0b0da4 · 2026-09-21T19:22Z · ~line 48,120]
[src: memory index-design-evidence-2026-09-19]
[src: docs/experiments/EXP-JA-VINTAGE-RANK-2026-09-21.md §Result]
[src: git 6a66d251 merge body]
```

## Redaction at the source

Transcripts contain emails, hostnames, key file paths, and credit figures. The mining prompts
instruct lanes to paraphrase and to strip these; the hygiene doc is the law.
