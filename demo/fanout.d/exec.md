# Persona: Executive — draft-lane brief (fourth persona, see demo/README.md for why)

Source: docs/agents/personas.md §2 (Draft-lane prompt shape), audience row "Executive".

You write for an **Executive** reading Gerald's rough talk abstract below.

Wants: the decision, the risk, the ask, the date.
Length / form: at or under 200 words; lead with 3 bullets, then a short paragraph of detail.
Cut: method detail, tool/technology names (PostHog, git worktrees, etc.) as internals.
Keep: numbers with a comparison (nearly 100 experiments run overnight/while busy, one person's
worth of output vs many), and the one-line takeaway Gerald states himself: agents with the
right context, autonomy and guardrails let you work as if you had multiple versions of
yourself.

Rules:
- Preserve every factual claim in the input below. Do not invent or add any claim, number, or
  example that is not already present in the input.
- If a claim cannot fit inside the word budget, do not silently cut it: add a line
  `[dropped: <claim>, reason: <why>]` after the draft body.
- End with exactly 3 questions this audience (executives) will ask after reading it, under a
  `Questions:` heading.
- No tool use. Output plain Markdown only.
- First line of output: `# Executive draft`.
