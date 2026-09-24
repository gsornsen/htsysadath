# Running lanes unattended: safe to leave while you sleep

`checklist.md` covers a lane you watch. This covers the extra rules for a lane (or a queue of
several) you start before bed and check in the morning — the difference between "ran
overnight" and "ran overnight safely."

## Before the run

1. **Write the gate's pass/fail bar first — not just the gate.** `checklist.md` already says
   write the gate before you see output. Unattended, go one step further: write the exact
   number or condition that DROPS the attempt, not just what counts as success. Example: "drop
   if the new approach loses more than 2.0 points against the current baseline." A bar you can
   check by reading one number means the lane (or you, in the morning) doesn't have to
   interpret anything to know whether to stop.
2. **New behaviour ships behind a flag, default states set on purpose.** On in dev, off in
   production. A lane can flip its own dev flag; only a human flips the production flag,
   explicitly, the next morning — never as a side effect of a lane finishing. Default a flag
   OFF until a result corroborates it, not on by default "until it causes a problem."
3. **Set per-run caps before you start, not after something runs long.** Three numbers,
   minimum: a cap on tool calls, a cap on wall-clock time, a cap on spend. Write the caps into
   the lane brief so they're visible, not buried in a config file. A cap that's never been
   tested against a real runaway is a guess — see "starved, not incapable" below for why the
   number matters.
4. **Give the window a named end time.** "Run continuously until <specific hour>, then stop or
   pause" — not "run overnight." An open-ended window is how a lane is still running, unwatched,
   well past when anyone meant it to.
5. **Gates run against frozen or replayed data, not a live session.** If the gate needs a live
   system to score, you can't score it while you're asleep — and you don't want an overnight
   lane touching production to get its own grade. Freeze the evaluation data (or the split) you
   score against before the run starts, and don't move it mid-run even if a later lane wants a
   bigger sample.

## The failures to guard against

- **An idle tab (or a stopped orchestrator) uses up your API allowance overnight, and no gate
  catches it** — a gate checks the *result*, not whether something got left running that
  shouldn't be. Run a separate idle/spend watchdog alongside every unattended window: something
  that checks "is anything still consuming budget with no lane actively using it" on its own
  schedule, independent of whatever the lanes themselves report.
- **A usage limit or crash stops a lane mid-run, and uncommitted work is gone.** Commit early,
  in small chunks, on every lane — the same rule as `checklist.md` § "rules that came from
  pain," worth repeating here because unattended runs are exactly when you're not there to
  notice a lane got cut off. A lane that resumes from its last commit costs you nothing; a lane
  that loses an evening's work to an uncommitted diff costs you the evening.
- **A cap set too tight starves the agent, and it looks like a capability failure.** If a lane
  hits its call or time cap partway through a task, the result you get back is *what it could
  do in that budget*, not *what it's capable of*. Before you write down "the agent couldn't do
  X," check whether it hit a cap first — raise the cap and re-run before concluding anything
  about capability. A "starved" verdict is not a capability verdict, and treating the two the
  same way throws away a correct finding along with the mistaken one.

## Morning-report template

One file, not a pile of logs. Every unattended run's lane writes to it, or a coordinator
assembles it from each lane's own short report.

```
# Overnight run — <date>, window <start> → <named end time>

## What ran
- <lane/attempt name>: <one line, what it tried>
- ...

## Gate results
- <lane name>: PASS/FAIL against <the bar you wrote before the run> — <the number>
- ...

## What unlocked
- <what this result now lets you try next, if anything — or "nothing, dead end confirmed">

## What needs your word
- <anything that touched a flag default, a production flip, a spend/cap decision, or crossed
  a line only a human should cross — named explicitly, not buried in a lane's full report>

## Caps hit (check before reading a FAIL as a capability finding)
- <any lane that hit a call/time/$ cap before finishing — flag these separately from real
  FAILs>
```

Read "what needs your word" first. That's the only section that requires you before the day's
next lane can start.
