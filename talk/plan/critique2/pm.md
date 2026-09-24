# Critique 2: product manager persona

Lane `critique2/pm` · 2026-09-24 · main `b22f162`, rendered 1280×720, slides and notes read together.

**Result: 14 of 20 DONE** (old deck: 7 of 22).

**Fixed:** the jitter is resolved (7). The repeated charts are gone. "Hardest shared piece first" is on a slide (15). The stopped work is its own slide (14). The close has two items and the URL. **Partly fixed:** cost. "~30 min a day" is on slide 6, but the dollars and the pitch live only on backup slide 19.

| # | Slide | DONE/NOT | Blocking reason | Remove |
|---|---|---|---|---|
| 1 | Title | DONE | none | none |
| 2 | Scout today | DONE | none. Real product, instantly. | none |
| 3 | How we got here | DONE | none. "Seven areas that could each have eaten weeks" is a roadmap sentence. I paused on "p50". | E-codes on the ticks |
| 4 | First sign | DONE | none. I paused on "why is fast bad?"; the notes answer it. | the green pill repeating the quote |
| 5 | The fork | DONE | none. "45+ forks, one of me" is my week. | none |
| 6 | What changed | DONE | none. It answers "what do I do differently". I paused on "worktrees". | the top quote (the bottom bar repeats it) |
| 7 | Jitter, resolved | DONE | none. Put "in 3 days" (now only in the notes) in the subtitle. | "BASE/CTRL/F5", "p50 1,157→433ms" |
| 8 | Demo | DONE | none. The narration drifts into "crops vote, pad 17 px, E79". | the padding story |
| 9 | Methods map | NOT | No rows for orchestration or "stop things", though the notes name both. The subtitle promises "the slide where you'll see it", but the column shows E19/E67, not slide numbers. | codes in column 3 |
| 10 | Orchestration | NOT | The axis is model names ("Fable", and "Opus 5.5" is clipped). The idea (senior writes the brief, a cheaper model builds, a reviewer one tier up checks it) is only in the definitions strip. | model-name axis and legend |
| 11 | Gates and flags | DONE | none. This is how I'd sell unattended runs: flag off in prod, caps, "I flip prod myself". | "−14.43 pts", "E84", "founder's word" chip |
| 12 | Kill lines | NOT | The kill-line label is drawn across the blue bar. The bars are named G0/G3/G0h. The subtitle is perfect; the chart isn't. | G-codes → "today / my favourite idea / what shipped" |
| 13 | Measure the bar | NOT | Two ideas. "Lock rate", "lock precision" and "CI" aren't defined, and "+5.47" overprints the line. It never says whether 2 in 3 is enough. The notes' best PM line ("not done, but measurable; I know which number to move") is not on the slide. | the two lock tiles |
| 14 | Stop things | DONE | none. The most PM-useful list. It should say what each stop saved. | "distilled student" |
| 15 | Shared core first | DONE | none | the dates in the LLM pill |
| 16 | Persona review gates | NOT | The lesson ("your own hands on the real device are the last gate") is only in the notes. The screenshots are illegible and don't show what broke. | the right-hand screenshot |
| 17 | Agents first | DONE | none. 180 s → 31–46 s is repeatable. | the "I timed myself" quote (put "~5× faster per label" there) |
| 18 | Two things | NOT | No first step on the slide. `starter/` teaches persona **drafts** and two-lanes, not the review gate or the overnight queue it points to. | nothing; it needs a first step added |
| 19 | Backup: cost | DONE (backup) | none, but it belongs in the main talk (fix 1) | "Held out" bullet |
| 20 | Backup: yardsticks | DONE (backup) | none. It's for engineers in Q&A. | none |

## Top 5 fixes, ranked

1. **Put the cost and the pitch on a main slide** (slide 6's bottom bar or slide 18). For example: "~30 min/day of me · flat subscription + ~$9 metered · jitter fixed in 3 days · ~100 experiments in 2 weeks." Add one line for my boss: "Unattended runs bought clean no's on four expensive ideas." Right now cost is answered only if someone asks.
2. **Make 18 usable on Monday, and make `starter/` match it.** Give each action a first step. (1) "Before the next fork: write the pass/kill bar, time-box it, put it behind a flag." (2) "Write three persona briefs (device + job), have an agent walk the build, then use your own phone." The kit currently teaches the practice that was cut.
3. **Make slide 9 the table of contents.** List all eight methods in slide order, with slide numbers and no codes. It's the slide a PM photographs.
4. **Strip codes from charts 10, 12 and 13.** Use plain labels. Fix the kill-line and "+5.47" collisions. Put "not done, but measurable" on 13, and cut the lock tiles.
5. **Put the lesson on slide 16:** "Panel said DONE. My phone said no. Your hands are the last gate." Keep one screenshot, cropped to what broke.

## Remaining jargon (on screen)

p50 (3, 7) · E19/E67/E79b/E84/E88 (3, 9, 11, 17) · BASE/CTRL/F5 (7) · worktrees (6, 10) · Fable/Opus/Sonnet/Haiku, "main" (10) · pre-register, kill line "G0 − 2.0 pts" (9, 12) · G0/G3/G0h, flat, dedup, language head (12, 13) · top-1/top-3, lock rate, lock precision, CI (13) · encoder swap, fine-tune, distilled student, re-embedding (14) · image-to-image embeddings (15) · "founder's word" (11).

**Worst: slide 13**, three undefined metrics with confidence intervals. Next is 12's G-codes. The demo narration (8) brings back the old wall.

## Are the closing actions usable by a PM?

- **Action 2 (persona review gate): yes.** A PM or designer can run it without an engineer. It needs its first step on the slide and a starter folder (there isn't one).
- **Action 1 (gated unattended experiments): half.** I can't run worktrees overnight, but I can *ask for it*: "Before we pick a fix, write the kill bar, time-box three options, ship behind a flag." That phrasing isn't in the deck. Say it on 18 in PM words, with slide 11 as the evidence, and it works for the whole room.
