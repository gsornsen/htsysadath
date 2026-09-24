# Rough draft: move the team wiki

Move our internal wiki off the old hosted tool to a git-backed docs site. The old tool is slow
to search and nobody trusts the results. Engineers already write docs in markdown then paste
them in, so a git-backed site removes that step. Estimate: one week of migration work for one
engineer, plus a review pass from each team lead. Risk: some pages have inline comments and
attachments that don't convert automatically, so those need manual review before the old tool
is shut off. Target: both systems live for two weeks in parallel, then cut over. No budget
request — the new tool is free and self-hosted on infra we already pay for.
