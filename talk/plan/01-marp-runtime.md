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
