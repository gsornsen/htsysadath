# Public repo hygiene — read before every commit

This repository will be pushed to a public remote. The raw material it is mined from is NOT
public: Claude Code transcripts (`~/.claude/projects/**/*.jsonl`), project memory, private plan
docs, a production codebase.

## Never commit

- Raw transcript lines or files, even excerpts longer than a sentence. Paraphrase; cite
  `session <first-8-of-id> · <date>`.
- Email addresses, names of third parties who did not consent, customer or labeler identities.
- API keys, tokens, `.dev.vars`, key file paths that reveal infrastructure, credit balances,
  hostnames/IPs of private machines.
- Production data (prices, product ids in bulk, database row dumps).
- Screenshots that show personal accounts, notifications, or other people's content. Crop to the
  app; blur anything else.

## Always

- Run `git diff --cached | grep -iE "api[_-]?key|(^|[^A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}|token|@gmail|@.*\.com|\.dev\.vars|192\.168|100\."`
  before committing. A hit is a stop. Check only ADDED lines (`grep -E "^\+"` first): a hit on a removed line is
  history, not a leak, but the decision is the coordinator's, not the lane's.
- Keep raw working copies under `mining/raw/` (git-ignored) or in the session scratchpad.
- Prefer numbers that are already public-safe (counts, dates, percentages) over identifiers.

## If something slips

Rotate first (if a secret), then rewrite history before the first public push. After the repo is
public, a leaked secret is rotated and the commit is left as a lesson in lessons-learned.md.
