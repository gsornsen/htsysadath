# CLAUDE.md — entry point (keep slim; link, don't inline)

You are helping build a talk: **"How to scale yourself and do all the things."** Read
[docs/project/brief.md](docs/project/brief.md) first (2 min). Then load ONLY the doc your task
needs — this file exists so agents do not drag the whole repo into context.

## Load by task

| Task | Load |
|---|---|
| Any session start / resume | [prompts/00-resume-here.md](prompts/00-resume-here.md) → [docs/project/tracking.md](docs/project/tracking.md) |
| Deciding what to do next | [docs/project/sequencing.md](docs/project/sequencing.md) |
| Mining transcripts / memory / docs / git | [docs/sources/README.md](docs/sources/README.md) + the matching `prompts/0N-*.md` |
| Spawning sub-agents or swarms | [docs/agents/coordinator.md](docs/agents/coordinator.md) |
| Persona critique or audience-tailored drafts | [docs/agents/personas.md](docs/agents/personas.md) + [prompts/04-audience-drafts.md](prompts/04-audience-drafts.md) |
| Writing slides / notes | [talk/outline.md](talk/outline.md) |
| Before committing ANYTHING | [docs/project/public-repo-hygiene.md](docs/project/public-repo-hygiene.md) |

## Non-negotiables

1. **This repo will be public.** No raw transcripts, no emails, no keys, no customer data, no
   credit balances. Findings are paraphrased and attributed to a session id + date, never pasted.
   Full rules: [public-repo-hygiene.md](docs/project/public-repo-hygiene.md).
2. **Every finding carries provenance** — source path, session id or commit sha, timestamp — so
   a claim in the talk can be traced. A finding without provenance is a guess; label it as one.
3. **Log decisions and lessons as you go**, not at the end:
   [decisions.md](docs/project/decisions.md), [lessons-learned.md](docs/project/lessons-learned.md).
4. **Update [tracking.md](docs/project/tracking.md) before ending a turn** — one line per lane:
   status, branch, sha, what is next.
5. Run `date` before writing any timestamp. Commit in small chunks with clear messages; branch
   per lane; merge `--no-ff` with a body that says what was learned.
6. Do not end a turn waiting on sub-agents; if you spawned them, collect and integrate, or hand
   off explicitly in tracking.md.

## Model routing (short form; full rules in docs/agents/coordinator.md)

Coordinator = Fable (this session). Fable writes briefs, judges results, and reconciles
disagreements. Mechanical extraction → Haiku. Well-defined extraction/summary with judgment →
Sonnet. Synthesis across sources, argument-building, persona critique → Opus 5.5 (fallback Opus 5). Reviewer is one
tier above the implementer.
