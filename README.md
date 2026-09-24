# How to scale yourself and do all the things

A talk, built in the open, about the moments in a project where the instinct is to push
through with what you already know — and what changes when you step back, spin up several
approaches at once, and let AI/agentic tools carry the exploration while you keep moving.

The examples come from a real product build (Grailith: card identification, live-auction
scouting, bulk scanning, comps/pricing) and from the day-to-day practice of turning one rough
draft into audience-tailored versions in parallel.

**This repository is the talk AND the record of how it was made.** Every mining pass, decision,
and draft is committed so the audience can see the method, not just the slides.

| Start here | |
|---|---|
| [CLAUDE.md](CLAUDE.md) | slim entry point for agents — loads only what a task needs |
| [docs/project/brief.md](docs/project/brief.md) | thesis, audience, the five story arcs |
| [docs/project/sequencing.md](docs/project/sequencing.md) | what runs in parallel, what waits |
| [docs/project/tracking.md](docs/project/tracking.md) | live status board |
| [prompts/00-resume-here.md](prompts/00-resume-here.md) | paste into a fresh session to continue |

## Layout

```
docs/project/   brief · sequencing · tracking · decisions · lessons-learned · public-repo-hygiene
docs/sources/   where the raw material lives (paths, sizes, what each source is good for)
docs/agents/    coordinator + model routing · personas (UI critique and audience drafts)
prompts/        copy-paste session starters: resume, mine transcripts, mine memory/docs, mine git, audience drafts
mining/         OUTPUTS of mining passes (findings/, timeline/, arcs/) — never raw transcripts
talk/           outline → slides → speaker notes
scripts/        small helpers (transcript inventory)
```

## Working across machines

Trunk is `main`. Each mining pass or drafting lane works on its own branch
(`mine/<source>`, `draft/<audience>`, `talk/<section>`) and merges with `--no-ff` so the history
reads as a log of the method. See [docs/project/decisions.md](docs/project/decisions.md).
