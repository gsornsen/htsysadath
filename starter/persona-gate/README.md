# Persona review gate: a "done" gate for UI and design work

Code review answers "does it work." It never answers "can the person it's for actually use
it." This is a second, separate gate that catches what code review can't see — and it's the
gate you run in front of "done," not instead of testing.

## The method, in one page

1. **Write 3–5 personas, each with a job, not a feature list.** A persona is not "tests the
   settings page." A persona is: who they are, the device they're on, and the one thing they
   hired this screen to do for them, in their own words. See
   [`panel-brief.md`](panel-brief.md) for the template. Keep the briefs as standing files —
   reuse them every review round on the same product; re-brief a new roster only when the
   feature is genuinely different territory (e.g. an admin-only tool doesn't need a
   first-time-user persona).
2. **The panel walks the BUILT thing, not a description of it.** Point every persona at the
   same real, working build — the actual screens or flow, on the device stated in their
   brief. Not a mockup, not a plan, not "here's what it will do."
3. **Each persona returns DONE or NOT, with exactly one blocking reason and a
   seconds-per-task number.** Not a list of nitpicks — the single thing that would make this
   real person give up, and how long the job actually took them. See
   [`verdict.md`](verdict.md) for the table format. A persona that returns five complaints
   hasn't done the job; ask for the one that actually stops them.
4. **The tie-break rule.** A simple, measurable, 1–2-file fix gets fixed inline, with a normal
   code review — no need to re-run the whole panel. Only a pervasive change (touches the
   pattern everywhere, not one spot) re-summons the affected persona, and only that persona,
   not the full panel. Whoever owns the product is the one who decides "simple enough to
   skip the re-panel" — that call isn't a vote.
5. **The lesson: add a real-device check before DONE.** A panel run against a simulated
   viewport (a fixed-size browser window, no real phone chrome, no switching between tasks)
   can certify DONE and still miss what a real device shows: browser chrome that steals
   vertical space, a modal that reopens every time you switch tasks, an option that's only
   reachable after rotating the phone. One review cycle had every persona say DONE at a
   healthy seconds-per-task number, and the very next morning a real phone, in the real
   flow, called the result "pretty much unusable." The synthetic panel's DONE was necessary
   but not sufficient. Treat a real-device pass as the last step before you call it done —
   not a formality, an actual re-walk on the actual hardware.

## Why a panel and not just "does it look right to me"

The panel forces two things a solo look-over skips: a *job* instead of a vibe ("can this
person finish in under a minute on their actual phone" is checkable; "does this feel right"
isn't), and a citation for every claim (which element, what it did, how long it took) — the
difference between "I don't like it" and something an implementor can act on without
guessing.

## Files here

- [`panel-brief.md`](panel-brief.md) — the persona template: who, device, the job in ≤ 2
  minutes, what makes them stop, what good looks like.
- [`verdict.md`](verdict.md) — the verdict table format, plus the panel prompt shape to hand
  an agent or a human reviewer.
