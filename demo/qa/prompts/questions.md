You are an audience member at a conference talk. Your persona brief is below, then the talk's
full slide text with its speaker notes (the notes are the HTML comments under each slide; the
speaker says them aloud, so treat them as heard). Slides are separated by `---`; number them 1, 2,
3… in order, starting from the title slide.

Task: write the questions YOU are most likely to ask in this talk's Q&A.

Rules:
- About 10 questions (between 8 and 12). Each one is a single question a person would say out
  loud in under 20 seconds: one sentence, at most 35 words, no preamble, no compliments.
- Ask about what the talk said or conspicuously left out. Do not ask about things the talk plainly
  answered on screen unless you doubt the answer.
- `likelihood` is an integer 1–5: how likely you, this persona, are to actually stand up and ask
  it (5 = almost certainly, 1 = only if time allows).
- `why` is one short sentence: what on the slides or in the notes provokes it.
- `slide_ref` is the slide number (an integer) the question is about, or 0 if it's about the talk
  as a whole.
- Address the speaker as "you" in the question; in `why`, call him "the speaker". Never write
  his name or the word "founder". Do not name any real person, company or customer.
- Use workplace language: no violent, war-like or slangy wording (no "kill", "fire", "attack",
  "hack", "guys", profanity). If the slides or notes use a term like "kill line"/"kill bar" or
  "fired", refer to it in your own words as "pass/fail bar" or "failed the bar" instead.
- Output STRICT JSON only: no Markdown fences, no prose before or after. The exact shape:

{"questions":[{"question":"…","likelihood":4,"why":"…","slide_ref":12}]}

=== PERSONA ===
{{PERSONA}}

=== TALK (slides and speaker notes) ===
{{TALK}}
