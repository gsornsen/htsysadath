# Visual assets plan — screenshots and images

Scope: what images the deck needs, what exists, what must be captured, and how to capture it
safely. Charts/data-viz are lane 4's; live-demo framing is lane 2's. This lane covers static
screenshots, persona captures, and drawn diagrams.

## Asset table

| Slide beat (arc) | Asset | Source | Path / recipe | Hygiene |
|---|---|---|---|---|
| F — "600 px below the fold" | Labeler task screen, mobile, before/after redesign | existing | `grailith:docs/design/2026-09-12-labeler-ux-audit/{before,after}-09-task-mobile-390.png` | usable as-is — synthetic fixture ids (`E44 GOLD-41`, `Gardevoir`), no accounts/notifications |
| C — dissent card / F — admin review | Task screen w/ taxonomy + review keymap, withheld-verdict card | existing | `grailith:docs/design/2026-09-13-labeler-critique/personas/dez/task-with-taxonomy-and-review-legend-bottom.png` | usable as-is — fixture data |
| C — "does it hold on real hardware" | Founder's own phone, live app | existing (9 files) | `grailith:docs/design/2026-09-13-labeler-critique/founder-screens/founder-mobile-0{1..9}.png` | **needs crop** — native browser chrome (nav bar, back/forward, share) visible top/bottom; only `01` spot-checked (clean, no notifications) — the other 8 need the same check before use |
| C — persona panel walkthroughs | Dez/Ken/Marisol screen sets (mobile/iPad/desktop) | existing (~50 files) | `grailith:docs/design/2026-09-13-labeler-critique/personas/{dez,ken,marisol}/*.png` | **spot-check pending** — only 2 of ~50 opened; both were clean fixture renders from the same before/after harness, so likely fine, but not blanket-cleared |
| C/F — queue states | Queue mobile, "show mine", skip row/bar | existing (4 files) | `grailith:docs/design/2026-09-13-queue-clarity/*.png` | usable as-is (small, fixture data) — not yet opened, low risk given pattern |
| B — pivot artifact / verdict bar | VerdictBanner states: Submit, Don't-submit, Sell-as-is gate, Hold, Insufficient-data | capture | Storybook `packages/ui`, title `Verdict/VerdictBanner` → `verdict-banner.stories.tsx` | safe — component-only, no chrome, deterministic props |
| C — dissent card (current build) | `TaskInDissent`, `ConsensusWithheldBlind`, `TaskWithTaxonomyAndReview` | capture | Storybook `apps/pregrade-web`, title `Labeling` → `labels.stories.tsx` | safe — fixture payload only (confirmed by probe capture below) |
| B — bulk gates / finish selection | `ThreeFinishes`, `ReverseHoloPreSelected`, `NidokingDeckExclusives` | capture | Storybook `apps/pregrade-web`, `captures/finish-selector.stories.tsx` | safe |
| Chrome / nav framing | `HeaderNoAccount`, `MobileThumbBarResting` | capture | Storybook `apps/pregrade-web`, `app-shell.stories.tsx` | built hygiene-safe — literally an account-free header state |
| E — coordinator/lane topology | Tier ladder (build ↓ Fable→Sonnet→Haiku, review ↑ mirrored) | draw | self-made diagram, SVG in `talk/assets/img/` | n/a |
| E — this repo's own lanes | Git branch graph of `htsysadath` | draw | generate from `git log --graph --all` in **this** repo, redraw clean (not a raw terminal screenshot — includes local paths) | self-made; strip any local path text before use |
| E — 5-round table / mirrored-id timeline | Text tables | draw / Marp table | inline in slide markdown, no image needed | n/a |
| C — panel roster + verdict table, literal-ask-vs-built | Text tables | draw / Marp table | inline in slide markdown | n/a |
| A — experiment bars, B — swim lanes | Charts | **lane 4** | out of scope here | — |

Bulk-approve gate specifically (from the prompt) has **no dedicated Storybook story** yet — grep
of `*.stories.tsx` under `apps/` found none named for it; `p2/lane-a-bulk-approve-and-hide-done.md`
documents the feature in prose only. Either write a minimal story first, or skip the beat.

## Capture pipeline

Two Storybook instances, both auth-free (confirmed: `app-shell.stories.tsx` comment: "auth-FREE —
plain props, no context"):
- `pnpm -F pregrade-web storybook` (from Grailith repo root) → `localhost:6009` — labeler/admin/
  finish-selector/app-shell stories.
- `pnpm -F @graide/ui storybook` → `localhost:6007` — verdict-banner, badge, orb, instruments.

Headless capture: Playwright (already a root devDependency, no install needed) hitting each
story's iframe directly — `http://localhost:<port>/iframe.html?id=<story-id>&viewMode=story` —
at fixed viewports (390×844 phone, 1440×900 desktop), no `networkidle` flakiness since stories
render synchronously from fixture props. A manifest-driven script (`talk/slides/scripts/shoot.mjs`,
not yet written) would loop `{storyId, viewport, outFile}` entries and write PNGs to
`talk/assets/img/`. Grailith already has a same-shaped precedent worth reusing the pattern from:
`grailith:tools/labels/ux/beforeafter.mjs`, which shoots stories × devices and diffs before/after
— it's git-ignored for output but the harness logic is a good starting point.

Theme: every image opened so far renders dark-only; no light-mode toggle was found in the
stories checked. Treat dark as the only theme unless Gerald says otherwise.

Claude-in-Chrome was considered for ad-hoc captures but the extension was not connected in this
environment (probe attempt failed with "Browser extension is not connected"); Playwright is the
reliable path and doubles as the repeatable script.

## Feasibility probe result: WORKED

Ran once, laptop only, nothing touched the devbox:
1. `cd apps/pregrade-web && pnpm storybook` — ready in <60 s at `localhost:6009` (single command).
2. Playwright headless (`chromium.launch()`, no install step needed) navigated to
   `iframe.html?id=labeling--task-in-dissent&viewMode=story` at 1440×900 and screenshotted.
3. Result: clean render, synthetic fixture data only (`Mega Charizard Y ex`, `Chansey`, `Raichu`
   candidates), no auth prompt, no chrome. Saved to the session scratchpad only — **not** committed
   to either repo. Storybook process killed after the probe.

This validates the whole pipeline end to end at small scale; scaling to the full manifest is a
follow-up task, not done here.

## Grailith routes: auth / hygiene risk

- **Safe:** any Storybook story (both packages) — fixture props, no login, no live data.
- **Risky, avoid:** live `pregrade-web` app routes (real captures, real pricing) and the
  `whatnot-scout` browser extension (scrapes real Whatnot auctions — other people's usernames and
  bids appear on screen). Neither should be screenshotted live for the public deck; Storybook
  fixtures stand in for both.

## Proposed folder layout

```
talk/assets/img/
  <arc-letter>-<kebab-slug>[-<viewport>].png     e.g. f-answer-bar-before-390.png
                                                        f-answer-bar-after-390.png
                                                        c-dissent-card-1440.png
  diagrams/
    e-coordinator-tier-ladder.svg
    e-branch-graph.svg
talk/slides/scripts/
  shoot.mjs           # manifest-driven Storybook capture (to be written)
  manifest.json        # {storyId, viewport, outFile}[]
```

## Questions for Gerald

1. Founder-screens (real-device photos, 9 files) — worth the crop-and-clear effort, or drop in
   favor of Storybook-only captures for a cleaner, more consistent deck?
2. ~50 persona capture files (Dez/Ken/Marisol) are unreviewed beyond two spot checks — should this
   lane finish the review, or is the P0/P1 before/after pair (already checked) enough to carry
   Arc C without the extra persona screens?
3. Bulk-approve gate has no story — write one (small effort, safest) or drop that specific beat?
4. Confirm dark-theme-only is fine for the whole deck's app imagery.
5. OK to model `shoot.mjs` directly on Grailith's `tools/labels/ux/beforeafter.mjs`, or keep it
   independent so this repo has no behavioral dependency on Grailith's harness?

## Convergence (round 2)

**Agree.** Runtime's `html: true` + link-out demo handoff needs stable asset paths, which I adopt.
Data-viz's SVG-script pipeline (JSON → script → committed SVG) mirrors my Storybook-manifest
approach — same shape, different source. D9: none of my assets touch Art Binder/michi-binder
(`art-binder.stories.tsx`, `binder-*.stories.tsx` appeared in the story grep but never entered my
table) — already consistent with dropping it.

**Conflicts.**
1. Path: I proposed `talk/assets/img/`; runtime's layout (01) reserves `talk/slides/assets/shots/`
   for lane 3, `~1920×1080 max` PNG. Resolution: adopt runtime's path and size cap; rename all
   entries below.
2. Ownership overlap: data-viz Visual 6 (coordinator tier ladder *as* this repo's lane DAG,
   script-rendered, curated from `tracking.md`) duplicates my two "draw" rows (tier ladder,
   branch graph). Resolution: cede both to lane 4; I drop mine.
3. Demos (02) asks me for things my pipeline doesn't reach: (a) P0 vs P1 Storybook stills at
   phone width — the actual renders live only on "the box"/scratchpad per
   `beforeafter/README.md`, not in git; feasible by re-running my probe's Playwright method
   against the two historical commit pairs (`00488a20`/`29ec4ff8`, `5fb495ee`/`4297ed25`), extra
   step, not yet done. (b) Scout clip, sellers/chat blurred — out of my static-screenshot scope;
   hygiene-safe *if* blurring is total, but it's a live/recorded video from `whatnot-scout`
   (real third-party auction data), not a Storybook capture — recommend lane 2 owns capture, I
   supply the blur checklist. (c) Static "rehearsal drafts" slide — blocked on lane 2's demo dry
   runs existing first.

**Accepted dependencies.** Path/size from runtime (1); cede coordinator DAG to viz (4); founder
09-14 iPhone failure asset (`founder-mobile-*`, already in my table) feeds demos' timeline stills
directly.

**Changes to my plan.** Rename folder → `talk/slides/assets/shots/`; drop the two draw rows;
add a P0/P1-stills row (status: not yet captured, needs historical-commit re-render); add a
scout-clip hygiene note (not owned by this lane).
