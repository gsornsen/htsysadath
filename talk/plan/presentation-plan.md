# Presentation plan: synthesis for approval

Lane `plan/synthesis` · Opus 5.5 · 2026-09-24 09:3x PDT. Inputs: plans 01–04 (their convergence
sections win over round 1), brief, D4–D9, `mining/findings/cross-arc.md`, and arc B's D9 rewrite
(`mining/arcs/B-pivots.md`, merged at `a8bd4b3`). This plan replaces
`talk/outline.md` v0. ⚠ marks content that depends on an unsettled fact.

## 1. Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | **Runtime:** Marp server mode, `html: true`. Author with `-s -w`; present with `-s` only. The fallback deck is `dist/` HTML plus a PDF. | 01 proved presenter view, notes and hash position over `localhost`. With watch off, a stray save can't reload the deck on stage. |
| 2 | **Handoff:** app-switch via link-out slides (`_class: demo`, titled per demo); return by URL hash. No iframes. | 01 conv. #3 and 02 agree. Nobody checked the frame headers; an app-switch can't blank. |
| 3 | **Demos:** Demo 1, persona fan-out of the abstract (0.5 min kickoff + 4 min reveal). Demo 2, this repo's log replayed offline (3 min). A reserve, "ask the repo", for Q&A only. | 02. D shown live and E on its own record. Neither touches Grailith, the scout or third-party data. |
| 4 | **Visuals:** 04's 7 charts, Storybook shots, a few founder-phone crops, and Marp tables. No scout clip, no bulk-approve beat, no P0/P1 re-render. | 03 conv., 04 conv.; see §7. |
| 5 | **Pipeline:** Storybook → Playwright `scripts/shoot.mjs` + `manifest.json` → `assets/shots/*.png` (≤1920×1080 or 390×844). `data/*.json`, each with a `source` → `scripts/build-charts.mjs` (no deps) → `assets/charts/*.svg`, committed. | The 03 probe and 04 proof both ran end to end. `shoot.mjs` copies the pattern of Grailith's harness without depending on it (03 Q5). |
| 6 | **Theme:** custom dark only, `#1a1a19`, system sans; tiers use the validated categorical slots 1–3. | Every app render is dark (03); the palette passed (04); 01 conv. adopted it. |
| 7 | **Layout:** `talk/slides/{deck.md, package.json, .marprc.yml (no inputDir), themes/, data/, assets/{shots,charts,demos}/, scripts/, dist/ (ignored)}` and `demo/{fanout, viewer/, rehearsal/, aliases.sh}`. | Assets inside Marp's input dir need no `--allow-local-files` (01 conv. #1). |
| 8 | **Ports:** on stage, **8080** Marp, **8090** fan-out viewer (from the demo clone), plus the outbound model API. Build-time only: **6009** pregrade-web Storybook, **6007** `@graide/ui` Storybook. **4321 is retired.** | 01 conv. #2, 02 conv., 03. |

**Loose ends, settled.**
- *Scout clip:* dropped; there's no live-scout footage anywhere. Slide 6 carries the SPADE's 6–15 s identify as text.
- *Visual #3:* final. It's 04's rewritten step timeline, four beats, each labelled by its trigger (D9), with Art Binder gone. 01's "stale" flag predates that rewrite.
- *P0/P1 stills:* not re-rendered. The existing 09-12 audit pair (Grailith `docs/design/2026-09-12-labeler-ux-audit/`, copied in as `f-answer-bar-{before,after}-390.png`) plus the 09-14 founder crops carry the beat. Re-render only if Q6 says no.
- *Arc B dates:* sourced in `a8bd4b3`. Two framings are still open with Gerald (Q7) and marked ⚠ below.
- *Demo 1:* the tooling gets built now against the brief's thesis, labelled as a stand-in. Rehearsal waits for the abstract.

## 2. Slide map (22 slides, 34 min + 1 min buffer)

| # | Arc | Min | Content · carries |
|---|---|---|---|
| 1 | — | 0.5 | Title |
| 2 | Moment | 1.5 | One real fork, told straight ⚠ story (Q3) |
| 3 | Moment | 1.5 | Why we push through: scope · staffing · timeline |
| 4 | Changed | 2.0 | Exploring got cheap. **Demo 1 kickoff** (terminal, `demo/fanout`, back to the deck) ⚠ abstract |
| 5 | B act 1 | 1.0 | Pregrade, 07-04: LLM-vision identify as a proof of concept and baseline · #3 beat 1 · `b-verdict-banner-*.png` |
| 6 | B act 2 | 1.0 | Scout, 08-18: image-to-image. Bakeoff: vision got 5/6 at 10.4 s; embedding took ~130 ms · #3 beat 2 |
| 7 | B act 3 | 1.0 | Bulk scan: fast lane 08-20; LLM lane retired 09-03; the scout had 0 commits 08-19→09-01 · #3 beat 3 · `b-finish-selector-*.png` ⚠ "ported from the scout" or "designed for the scout, proven in bulk scan" |
| 8 | B act 4 | 1.0 | Comps: raw comps by condition (NM–DMG) outgrew "use an API" · #3 beat 4 ⚠ does it start 08-23 or 09-06/07? |
| 9 | A | 1.5 | D4: the discriminating experiment, where the negative result was the win · #1, @1 group (`d4-arms.svg`) |
| 10 | A | 1.0 | At top-3 the gain halves (+9.95 → +5.47), because 13 of the 20 fixes were already rank 2–3 · #1, @3 group |
| 11 | A | 1.5 | What we didn't try; top-3 measured four incompatible ways · #2 small multiples |
| 12 | A/B | 1.0 | Lot-level bar: 65.2 % top-3 on non-locked lots (45/69); lock 20.7 % at 88.9 % precision · #7 |
| 13 | C | 1.5 | The panel as done gate · `c-dissent-card-1440.png`, `f-answer-bar-{before,after}-390.png` |
| 14 | C | 1.0 | The gate fails: Dez DONE on 09-13, "pretty much unusable" on the iPhone on 09-14 · `c-founder-mobile-*.png` |
| 15 | D | 4.0 | **Demo 1 reveal** (:8090): draft + 4 columns; a hybrid chosen aloud per D4 ⚠ abstract |
| 16 | D | 0.5 | What I took from each draft |
| 17 | F | 2.0 | Two levers: 180 s → agents 11–16 s → human review ~20 s, trust tiers tagged on the slide · #4 |
| 18 | E | 1.5 | Coordinator: the reviewer sits one tier above · #6 curated lane DAG |
| 19 | E | 3.0 | **Demo 2**: `git log --graph --oneline main`, three stops: fan-out merges; D6→D7 and D5→D9; review merges. Fallback: #6 |
| 20 | Spine | 2.5 | Remembered vs recorded · #5 table |
| 21 | Close | 2.0 | Against paralysis: an evidence threshold, a time box, "go both" when it's reversible, log the paths not taken |
| 22 | Close | 1.5 | Two things for next week: persona drafts; a coordinator plus lanes |

**The #5 table, final.** Four rows where the record corrects memory: D4's dedup framing; the
top-3 bar dated 09-11, not 09-13; E79's crop win didn't hold; 76.9 % at n=52 was a small-sample
high. **Two counter-example rows, marked apart:** D5→D9 (overlapping dates read as concurrency)
and D6→D7 (absence from the corpus read as unsourced). The takeaway: keep both records, and check
in both directions.

## 3. Build plan: the next swarm

Each reviewer is one tier up: Sonnet → Opus 5.5, Opus 5.5 → Fable.

| Lane | Model / reviewer | Inputs | Outputs | Done means | Needs |
|---|---|---|---|---|---|
| L1 scaffold | Sonnet / Opus 5.5 | §1, 01 | `talk/slides/` skeleton, 22 stub slides, theme, `.gitignore` | `build` and `pdf` work offline; `serve` is up on 8080; hash jump works | — |
| L2 charts | Sonnet / Opus 5.5 | 04, findings, D4–D9 | `data/*.json`, `build-charts.mjs`, 7 SVGs | every JSON cites a source line; validator passes; each SVG looked at; no lines joining points on #2 or #7 | Q7, for the two #3 framings |
| L3 shots | Sonnet / Opus 5.5 | 03 table, Grailith checkout on the laptop | `shoot.mjs`, `manifest.json`, PNGs, a provenance row for each | every PNG opened and hygiene-cleared; crops show no browser chrome; Storybook stopped | — |
| L4 demo tooling | Sonnet / Opus 5.5 | 02, `prompts/04`, personas | `demo/fanout`, `demo/viewer/` on :8090, `aliases.sh`, tag `talk-demo` | stand-in dry run completes; viewer shows 4 lanes with status and elapsed-time chips; no `--all`, paths or usernames | — |
| L5 outline v1 + notes | Opus 5.5 / Fable | §2, arcs, D4–D9 | `talk/outline.md` v1, notes for every slide | every claim cites an id; timings sum to ≤ 35 min; ⚠ items flagged | — |
| L6 integrate | Sonnet / Opus 5.5 | L1–L5 | filled `deck.md`, `dist/deck.pdf` | every asset resolves; PDF renders offline; hygiene grep clean | L1, L2, L3, L5 |
| L7 critique | Opus 5.5 / Fable | deck, personas | `talk/plan/critique.md` | DONE/NOT per slide from 4 personas | L6 |
| R rehearse | Gerald + L4 | deck, demos | `demo/rehearsal/`, `assets/demos/*.mp4` | 5 Demo 1 runs (p50/max per lane); 2 timed run-throughs | L4, L6, abstract |

**DAG.**
- **Now, in parallel:** L1–L5. Outside the swarm, Gerald writes the abstract and answers Q7.
- **Then:** L6 waits for L1, L2, L3 and L5. #3's two ⚠ labels are fixed once Q7 is answered.
- **Last:** L7 and R run in parallel after L6; R also needs L4 and the abstract. Freeze the PDF after R.

## 4. Rehearsal and pre-flight (T–60, then again at T–10)

- [ ] "Talk" Chrome profile: signed out, no extensions, no bookmarks bar, no autofill.
- [ ] Terminal: 28 pt, high contrast, prompt `$ `. No username, path, email or plan visible.
- [ ] Focus mode on. Slack, Mail, Messages and sync clients quit. Dock hidden. Phone silent.
- [ ] Projector checked at 1920×1080 and 1280×720. A 200-word column readable from the back row (start at 150 %). Extended display, and the presenter popup tested on the stage machine itself.
- [ ] 8080 and 8090 free. Marp running (`-s`) and the viewer running. No Storybook, devbox, tailnet or Grailith.
- [ ] Deck and viewer tabs open. Terminal in the demo clone at `talk-demo`. Demo 2 aliases dry-run on `main`.
- [ ] Pre-authenticated; the key comes from env and is never echoed. Usage headroom checked, capped key preferred.
- [ ] Venue wifi tested; phone tether ready.
- [ ] PDF and MP4s open offline. The rehearsal-drafts slide is labelled "this morning's run".
- [ ] Two timed run-throughs, with the switches on slides 4, 15 and 19 practised.
- [ ] Fallback ladder: live → finished lanes plus labelled rehearsal → static slide → skip, and say so. Never fake "live".

## 5. Risks

| Risk | Owner | Fallback |
|---|---|---|
| Demo 1 slow or hits a usage limit on stage | L4 / Gerald | 15 s rule; show the labelled rehearsal; come back to it in Q&A |
| No abstract in time to rehearse | Gerald | Run on the thesis stand-in and label it; if that fails, a static slide of the drafts |
| Q7 on the arc B framings is still open at freeze | Gerald | Say "wired into bulk scan 08-20, scout switched 09-02", and date act 4 by its first ship (08-23) with a footnote |
| Hygiene leak in a shot or the terminal | L3 / L6 reviewers | Drop the image; aliases show `main` only; prompt checked in pre-flight |
| Presenter view or the display fails | L1 / Gerald | Built HTML or PDF full-screen, notes on a second device |

## 6. Open questions for Gerald (most blocking first)

1. **Write `talk/abstract-rough.md`.** It blocks Demo 1, slides 4, 15 and 16, and rehearsal.
2. Is a labelled rehearsal an acceptable Demo 1 fallback, or do we cut the demo if it fails?
3. Which fork opens the talk (slide 2): the Japanese-index call or "when to run identify"?
4. Whose laptop, what display and adapter, and is there venue wifi?
5. On stage: a capped API key or the subscription?
6. Is the 09-12 before/after pair the P0/P1 redesign? If not, L3 re-renders both historical commit pairs.
7. Arc B (`B-pivots.md` §5): is act 3 "ported from the scout" or "designed for the scout, proven in bulk scan"? Does act 4 start on 08-23 or 09-06/07?
8. An audience vote on the hybrid? The default is no, to save time.

## 7. Dissent log

1. 01 wanted `-s -w` on stage. Present with `-s` only; watch is for authoring.
2. 01 conv. called #3 stale. It isn't: 04's D9 rewrite is final.
3. 03 handed the scout clip to 02. Dropped outright, siding with 02 (hygiene, D9).
4. 04 #5 counts D6→D7 as a memory-wrong instance. It's a second counter-example, the same shape as D5→D9 (02 conv.).
5. 02/03 wanted P0/P1 re-rendered at historical commits. No: the existing audit pair carries slide 13 unless Q6 says otherwise.
6. 04 placed `build-charts.mjs` at `talk/slides/`. It moves to `talk/slides/scripts/`, per 01.
7. 03 Q3 offered to write a bulk-approve story. The beat is dropped instead; no claim needs it.
