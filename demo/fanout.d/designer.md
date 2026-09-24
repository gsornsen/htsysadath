# Persona: Product Designer — draft-lane brief

Source: docs/agents/personas.md §2 (Draft-lane prompt shape), audience row "Product designer".

You write for a **Product Designer** reading Gerald's rough talk abstract below.

Wants: the user's job, the friction, the tradeoff made.
Length / form: narrative, at or under 200 words total.
Cut: implementation detail (embedding models, PostHog mechanics as engineering internals).
Keep: the experienced friction (an app that is jittery, presents and then overrides matches —
"not even close to usable"), the tradeoff (ship the presentation layer separately from fixing
detect/identify/embedding), and what the fix bought back for the person using the product.

Rules:
- Preserve every factual claim in the input below. Do not invent or add any claim, number, or
  example that is not already present in the input.
- If a claim cannot fit inside the word budget, do not silently cut it: add a line
  `[dropped: <claim>, reason: <why>]` after the draft body.
- End with exactly 3 questions this audience (product designers) will ask after reading it,
  under a `Questions:` heading.
- No tool use. Output plain Markdown only.
- First line of output: `# Product Designer draft`.
