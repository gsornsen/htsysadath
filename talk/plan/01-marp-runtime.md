# Runtime plan — Marp in the browser, with live-demo handoff

## Recommendation

Run `marp-cli` in combined **watch + server mode** (`-s -w`) against `talk/slides/`, presented
from `http://localhost:8080/deck.md` in a normal browser tab. Author with `html: true` so iframes
and speaker notes work. Primary demo-handoff is a **link-out slide** (`target="_blank"` to a demo
tab opened ahead of time), not an embedded iframe — iframes risk a blank/blocked panel on stage.
Keep a **PDF export** as the fallback deck and a short **MP4/GIF** per demo as an `<img>`/`<video>`
fallback slide, so a dead network never blocks the talk. Presenter view and notes work over
`http://localhost`, so there's no reason to present from a `file://` build on stage.

## What I PROVED (throwaway dir, `npx @marp-team/marp-cli@latest`, nothing installed globally)

- **Server mode serves a directory index** at `/` (lists `deck.md` with inline PDF/PPTX
  convert-on-the-fly links); `/deck.md` renders the full bespoke-marp HTML — same template as a
  built file, not a stripped-down preview.
- **Presenter view works in server mode.** The served page ships `presenterUrl`, `PresenterView`,
  `window.open`, and `localStorage` sync code identical to a built HTML file. This overturns the
  assumption that presenter view needs a static build — it needs an http(s) origin so the popup
  and main window can sync, which server mode gives for free (a `file://` double-click is the
  riskier path, since some browsers partition storage per `file://` document, not the safer one).
- **Watch mode live-reloads** over an injected WebSocket. Edited the H1 mid-session; a plain
  `curl` of `/deck.md` two seconds later showed the new text with no server restart.
- **`html: true` is required for iframes/notes to render as HTML at all.** Rebuilt the same deck
  with `--html=false`: the `<iframe>` tag got HTML-escaped to visible text instead of embedding.
  That's the real security trade-off — Marp does not sanitize with `html: true`, so anything in
  the deck's own Markdown runs as raw HTML. Fine for a single-author deck; don't accept
  pasted-in Markdown from anyone else without turning it back off.
- **Slide position lives in the URL** (`location.hash` + `history.pushState`/`replaceState`), so
  tab-switching away and back preserves the exact slide, and a hash link (`deck.md#7`) can jump
  straight to a demo-handoff slide if the count changes late.
- **PDF and PPTX export work locally with no setup** (`--pdf`, `--pptx`): headless Chromium
  resolved automatically, no network fetch beyond a comment-only license URL in the output. Same
  for **math** (`math: mathjax`): renders fully inline, zero CDN calls at render time — offline-safe.
- **`.marprc.yml` with `inputDir` set conflicts with passing a filename on the CLI/npm script**
  (`Cannot pass files together with input directory` — hard error). Config is either
  directory-wide (`-I`/`inputDir`, no filename anywhere) or per-file (filename argument, no
  `inputDir` in config) — pick one, don't mix.
- Mermaid: confirmed **not present** in `@marp-team/marp-core` (no "mermaid" matches in the
  installed package or rendered output).

## What I only READ (not exercised locally)

- Storybook/Grailith-web `X-Frame-Options`/CSP headers — did not stand up either app, so the
  iframe-blocked failure mode is inferred, not observed. **Action for lane 2**: confirm whether
  either target sends `X-Frame-Options: DENY/SAMEORIGIN` or restrictive `frame-ancestors`; if so,
  iframe is a non-starter and link-out is the only option.
- KaTeX as a lighter MathJax alternative — `marp-core` supports `math: katex`; not benchmarked.

## Proven example (title, notes, demo handoff)

```markdown
---
marp: true
theme: default
size: 16:9
html: true
---
<!-- _class: lead -->
# How to scale yourself
## and do all the things
<!-- Speaker notes: open cold. Timing target 2 min. -->
---
## The moment
- Push through on instinct
- Or step back and explore in parallel
<!-- Mention the pivotal-decision example here. -->
---
<!-- _class: demo -->
## Live demo: labeler agent
[Open demo →](http://localhost:4321/){target="_blank"}
<!-- Fallback: play demo.mp4 if the app or network is down. -->
```

## Repo layout proposal

```
talk/slides/
  deck.md          # single source deck, comments mark arc boundaries
  package.json     # scripts: serve, build, pdf
  .marprc.yml      # NO inputDir — filename passed explicitly in scripts
  themes/custom.css
  assets/shots/    # lane 3: screenshots
  assets/charts/   # lane 4: pre-rendered SVG/PNG
  assets/demos/    # lane 2: GIF/MP4 fallbacks per live demo
  scripts/         # shoot.mjs (lane 3), build-charts.mjs (lane 4)
  dist/            # git-ignored: build/pdf/pptx output
```

`package.json` scripts: `serve`: `marp -s -w --html .`, `build`: `marp --html deck.md -o
dist/deck.html`, `pdf`: `marp --html --pdf deck.md -o dist/deck.pdf`.

**Git-ignore**: `talk/slides/dist/`, `node_modules/`. Commit `assets/demos/*.mp4` only if small
(a few MB) and scrubbed of on-screen private data — otherwise git-ignore and note as missing.

## Assumptions the other lanes depend on

- **Screenshots (lane 3)**: `talk/slides/assets/shots/`, PNG, ~1920×1080 max (Marp scales but
  large originals bloat `dist/`).
- **Data viz (lane 4)**: pre-rendered SVG/PNG in `talk/slides/assets/charts/` — no live chart
  library in the deck; Mermaid needs pre-rendering to SVG (not natively supported) if used.
- **Live demos (lane 2)**: fallback GIF/MP4 per demo in `assets/demos/`, known local port so the
  link-out URL is stable; confirm target apps' frame-embedding headers before assuming iframe.

## Open risks

- Presenter-view popup blockers: some OS/browser combos block `window.open` from an indirect
  keypress — needs a stage rehearsal, not just a laptop test.
- `-s -w` binds a fixed port (8080 default); confirm nothing else on the venue laptop claims it.

## Questions for Gerald

1. Present live from `localhost:8080` (server mode), or a pinned static build as primary with
   server mode only for authoring?
2. Iframe or link-out for demo handoff — pending lane 2 confirming target app frame headers?
3. Any venue wifi guarantee, or plan the whole talk (deck + demos) for offline?

## Convergence (round 2)

**AGREE.** Lane 2's fallback ladder (live → labelled rehearsal → static slide → skip, never a
faked "live" result) matches my PDF/GIF fallback stance. Its Demo 1 design (terminal, then a
separate viewer app) is effectively app-switch already, not an iframe — endorse. Lane 4's chart
path (`talk/slides/assets/charts/*.svg`, `<img>`, no client JS) matches my layout exactly. Dark-
only theme (lanes 3/4) is a reasonable stage default.

**CONFLICTS.**
1. Asset path: lane 3 proposes `talk/assets/img/` (outside `talk/slides/`); I proposed
   `talk/slides/assets/shots/`; lane 4 matches mine. *Resolution*: consolidate on
   `talk/slides/assets/{shots,charts,demos}/` — keeps assets inside Marp's trusted input dir, so
   the build never needs `--allow-local-files` for a path outside it (proved that flag/warning
   triggers once a path escapes the input dir). Lane 3 retargets `shoot.mjs`'s manifest.
2. Lane 2's pre-flight adds a second local server, the fan-out viewer at `:8090`, beside Marp's
   `:8080` — not a port clash, but missing from my "one server" framing. *Resolution*: one shared
   pre-flight port list; the proven hash-URL slide position means alt-tabbing terminal →
   viewer(:8090) → deck(:8080) needs no extra logic.
3. Lane 2 asks me to resolve iframe vs app-switch: **app-switch**, matching their own demo design.

**ACCEPTED DEPENDENCIES.** Lane 2: Marp stays on `:8080`; demo slides get `<!-- _class: demo -->`
titled per demo. Lane 3: images at `talk/slides/assets/shots/`, PNG, ≤1920×1080 or 390×844. Lane
4: SVG charts at `talk/slides/assets/charts/`.

**CHANGES.** Theme moves from light `default` to a dark custom theme (`#1a1a19`) to match lanes
3/4. Add `talk/slides/scripts/` (shoot.mjs, build-charts.mjs) to repo layout. D9 (arc B now
sequential, Art Binder dropped) doesn't change this plan; lane 4's swimlane visual #3 predates it
and needs a content update — flagged for that lane, not fixed here.
