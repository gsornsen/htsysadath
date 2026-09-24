# Persona brief — blank template

Copy this block once per persona. Keep the filled-in brief as a standing file in your own
`personas/` folder and reuse it every review round — don't rewrite personas from scratch each
time. Aim for 3–5 personas total; more than that and no single reviewer reads all the
verdicts.

```
PERSONA: <a short, memorable label, not a real person's name — e.g. "the one-thumb reader",
"the keyboard-only power user", "the specialist on a tablet", "the admin resolving
disagreements">

WHO THEY ARE: one or two sentences — relevant background only. What do they already know
# Skip biography. Include only what changes how they'll use this screen: expertise level,
# familiarity with the product, anything that changes their tolerance for friction.
how to do, and what are they new to?

DEVICE: the exact device and context they're on (e.g. "phone, one thumb, on the move" / "iPad
# Be specific — "mobile" isn't a device, "phone, portrait, one thumb, on a couch" is. The
# device changes what breaks: a modal that's fine on desktop can block a phone entirely.
+ stylus, seated" / "desktop, keyboard shortcuts, two monitors").

THE JOB, IN ≤ 2 MINUTES: the one thing they came here to do, stated as their outcome, not a
# Not "browse the settings page" — "find out whether my last submission was accepted, and
# fix it if not." A job has a clear finish line; a feature tour doesn't.
feature name. If they can't finish it in about two minutes, that itself is a finding.

WHAT MAKES THEM STOP: the kind of friction that would make this specific person give up or
# Different personas stop at different things — a first-timer stops at unclear labels: an
# expert stops at anything that's slower than the shortcut they already know.
get frustrated, given who they are and the device they're on.

WHAT GOOD LOOKS LIKE: what this persona would say if the job went well — in their own words,
# A sentence you could imagine them actually saying. Not "the UI is intuitive" — "I didn't
# have to think, I just tapped through and it worked."
not a metric.
```

## Panel prompt shape

Hand this to each persona (an agent, or a human reviewer standing in for one):

```
You are <persona, from the brief above>. Walk <the built screen/flow — a URL, a Storybook
story, a real build> on <device from the brief>. Report:
1. Did you finish the job? (yes/no)
2. The first moment you hesitated, and why — cite the exact element.
3. One thing you would remove.
4. DONE or NOT, with the single blocking reason (not a list).
5. Seconds-per-task: how long the job actually took, start to finish.
No praise. Cite what you mean — an element, a pixel, a screenshot — don't just assert.
```

Run every persona against the same before/after built artifact — not a description of what
changed, the actual thing.
