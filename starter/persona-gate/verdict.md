# Verdict format

Collect one row per persona (and per critic, if you're also running lens-based critics
alongside the personas) into a single table. This table — not a prose summary — is what the
implementor and the product owner read.

| Persona | DONE / NOT | Blocking reason | Seconds-per-task | Remove one thing |
|---|---|---|---|---|
| the one-thumb reader | NOT | a hover-only control has no touch equivalent | 30s (was: never finished) | the confirmation animation |
| the keyboard-only power user | DONE | — | 9s | the redundant label under the icon |
| the specialist on a tablet | DONE | — | 14s | the second "are you sure" step |
| the admin resolving disagreements | DONE | — | 10.5s | the percentage in the progress bar |

Column rules:

- **DONE / NOT** — one of exactly two values. Not "mostly," not "DONE with notes." If there's
  a real blocker, it's NOT.
- **Blocking reason** — the single thing that would make this persona give up. Not a list. If
  a reviewer names more than one, ask them which one actually stops the job.
- **Seconds-per-task** — measured, not estimated. Time the actual walk-through, start to
  finish. Record "never finished" rather than guessing a number if they didn't complete it.
- **Remove one thing** — every persona names one thing to cut, even on a DONE verdict. This is
  what keeps the panel from just rubber-stamping.

## Rolling it up

- **All DONE → ship**, after the real-device check below.
- **Any NOT, and the fix is simple, measurable, 1–2 files** → fix inline, normal code review,
  no re-panel. Log the fix and move on.
- **Any NOT, and the fix is pervasive** (touches the pattern everywhere, not one spot) →
  re-summon only the persona(s) who found it, not the whole panel, and re-verify their row.
- Whoever owns the product makes the "simple enough to skip re-panel" call — that's not a
  vote among the personas.

## The real-device check (do this before calling it DONE)

The panel above is a synthetic walk — usually a fixed viewport, no real device chrome, no
switching between tasks the way a real session does. Before you call the work DONE, re-walk
it on one real device, in the real flow, not a simulated one. Specifically check for what a
simulator hides: browser/OS chrome eating vertical space, a modal or prompt that reopens on
every task instead of once, anything reachable only after a rotation. If the real-device pass
disagrees with the panel, the real device wins — write down what it found and what the panel
missed, so the next panel's briefs get sharper.
