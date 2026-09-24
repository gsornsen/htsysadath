#!/usr/bin/env node
// demo/qa/render.mjs — pass 5 of the Q&A demo (talk/plan/qa-demo.md).
//
// Pure, deterministic JSON -> HTML renderer. Node built-ins only. No timestamps,
// no randomness, no network. Same three input files always produce byte-identical
// output. Usage:
//
//   node demo/qa/render.mjs <out-dir> <html-path>
//
// Reads <out-dir>/ranked.json, <out-dir>/answers.json, <out-dir>/verify.json and
// writes one self-contained HTML file to <html-path> (parent dirs are created).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Persona display names. Unknown persona slugs fall back to a title-cased
// version of the slug so the page never breaks on an unexpected value.
// ---------------------------------------------------------------------------
const PERSONA_ORDER = ["senior-swe", "pm", "designer", "mid-swe"];
const PERSONA_LABELS = {
  "senior-swe": "Engineer",
  pm: "PM",
  designer: "Designer",
  "mid-swe": "New to agents",
};

const GROUNDING_META = {
  sourced: { label: "Sourced", cls: "sourced" },
  testimony: { label: "Testimony", cls: "testimony" },
  "not in the record": { label: "Not in the record", cls: "not-in-record" },
};

function personaLabel(slug) {
  if (PERSONA_LABELS[slug]) return PERSONA_LABELS[slug];
  return String(slug)
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function personaRank(slug) {
  const i = PERSONA_ORDER.indexOf(slug);
  return i === -1 ? PERSONA_ORDER.length : i;
}

function sortPersonas(list) {
  return [...new Set(list || [])].sort((a, b) => {
    const ra = personaRank(a);
    const rb = personaRank(b);
    if (ra !== rb) return ra - rb;
    return String(a).localeCompare(String(b));
  });
}

// ---------------------------------------------------------------------------
// Escaping. All input text (questions, answers, citations, persona ids) is
// untrusted content and must be escaped before it lands in the HTML.
// ---------------------------------------------------------------------------
function escapeHtml(input) {
  return String(input == null ? "" : input).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}

function slugify(input) {
  const s = String(input == null ? "" : input).replace(/[^A-Za-z0-9_-]+/g, "-");
  return s.length ? s : "x";
}

// ---------------------------------------------------------------------------
// Loading + normalizing the three pass outputs. Every field is read
// defensively: a missing or malformed field degrades gracefully rather than
// crashing the render, since this script only owns rendering, not the
// upstream passes' schemas.
// ---------------------------------------------------------------------------
function loadJson(path, fallback) {
  try {
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw new Error(`render.mjs: could not read/parse ${path}: ${err.message}`);
  }
}

function normalizeVerifyStatus(citation) {
  if (!citation) return "unknown";
  if (typeof citation.status === "string") return citation.status;
  if (citation.verified === true) return "verified";
  if (citation.verified === false) return "failed";
  if (citation.ok === true) return "verified";
  if (citation.ok === false) return "failed";
  return "unverifiable";
}

function buildVerifyIndex(verifyList) {
  // id -> { ok, citeStatus: Map("path\u0000locator" -> status) }
  const index = new Map();
  for (const entry of verifyList || []) {
    if (!entry || typeof entry.id !== "string") continue;
    const citeStatus = new Map();
    let sawFailed = false;
    for (const c of entry.citations || []) {
      const status = normalizeVerifyStatus(c);
      if (status === "failed") sawFailed = true;
      citeStatus.set(`${c.path}\u0000${c.locator}`, status);
    }
    const ok = typeof entry.ok === "boolean" ? entry.ok : !sawFailed;
    index.set(entry.id, { ok, citeStatus });
  }
  return index;
}

// ---------------------------------------------------------------------------
// HTML fragment builders
// ---------------------------------------------------------------------------
function renderCitation(citation, verifyEntry) {
  const path = citation && citation.path != null ? String(citation.path) : "";
  const locator = citation && citation.locator != null ? String(citation.locator) : "";
  const isPrivate = path.startsWith("grailith:");
  const status = verifyEntry
    ? verifyEntry.citeStatus.get(`${path}\u0000${locator}`) || "unknown"
    : "unknown";
  const failed = status === "failed";

  const displayPath = isPrivate ? path.slice("grailith:".length) : path;
  const parts = [];
  parts.push(`<li class="citation${isPrivate ? " citation-private" : ""}${failed ? " citation-failed" : ""}">`);
  parts.push(`<span class="citation-line">`);
  parts.push(`<code class="citation-path">${escapeHtml(displayPath)}</code>`);
  if (locator) {
    parts.push(`<span class="citation-sep"> · </span><span class="citation-locator">${escapeHtml(locator)}</span>`);
  }
  parts.push(`</span>`);
  if (isPrivate) {
    parts.push(`<span class="citation-note">private source, not in this repo</span>`);
  }
  if (failed) {
    parts.push(`<span class="citation-flag" role="note">&#9888; citation not verified</span>`);
  }
  parts.push(`</li>`);
  return parts.join("");
}

function renderCard(rank, answer, verifyEntry, maxScore) {
  const id = rank.id;
  const slug = slugify(id);
  const personas = sortPersonas(rank.personas);
  const score = typeof rank.score === "number" ? rank.score : 0;
  const pct = maxScore > 0 ? Math.max(6, Math.round((score / maxScore) * 1000) / 10) : 0;
  const scoreLabel = Number.isInteger(score) ? String(score) : String(Math.round(score * 10) / 10);

  const groundingKey = answer && GROUNDING_META[answer.grounding] ? answer.grounding : null;
  const groundingMeta = groundingKey ? GROUNDING_META[groundingKey] : { label: "Ungrounded", cls: "unknown" };

  const citations = (answer && answer.citations) || [];
  const citationsHtml = citations.length
    ? `<ul class="citations">${citations.map((c) => renderCitation(c, verifyEntry)).join("")}</ul>`
    : `<p class="no-citations">No citations — this answer draws on nothing in the corpus.</p>`;

  const overallOk = verifyEntry ? verifyEntry.ok : true;
  const bannerHtml = !overallOk
    ? `<p class="answer-banner" role="note">&#9888; One or more citations below failed verification.</p>`
    : "";

  const chipsHtml = personas
    .map((p) => `<span class="chip" data-persona="${escapeHtml(p)}">${escapeHtml(personaLabel(p))}</span>`)
    .join("");

  const answerText = answer && answer.answer ? escapeHtml(answer.answer) : "No answer recorded.";
  const rankNum = typeof rank.rank === "number" ? rank.rank : 0;
  const rankTag = `Q·${String(rankNum).padStart(2, "0")}`;
  const panelId = `panel-${slug}`;

  return `
      <details class="card" data-personas="${escapeHtml(personas.join(" "))}" data-id="${escapeHtml(slug)}">
        <summary class="card-summary" aria-controls="${panelId}">
          <span class="card-head">
            <span class="rank-tag" aria-hidden="true">${rankTag}</span>
            <span class="score-wrap" title="likelihood score ${escapeHtml(scoreLabel)}">
              <span class="meter"><span class="meter-fill" style="width:${pct}%"></span></span>
              <span class="score-num">${escapeHtml(scoreLabel)}</span>
            </span>
          </span>
          <span class="question" role="heading" aria-level="2">${escapeHtml(rank.question)}</span>
          <span class="chips">${chipsHtml}</span>
        </summary>
        <div class="answer" id="${panelId}">
          <p class="answer-text">${answerText}</p>
          <span class="badge badge-${groundingMeta.cls}">${escapeHtml(groundingMeta.label)}</span>
          ${bannerHtml}
          ${citationsHtml}
        </div>
      </details>`;
}

function renderFilterButtons(allPersonas) {
  return allPersonas
    .map(
      (p) =>
        `<button type="button" class="filter-btn" data-persona="${escapeHtml(p)}" aria-pressed="false">${escapeHtml(
          personaLabel(p)
        )}</button>`
    )
    .join("\n        ");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const [, , outDirArg, htmlPathArg] = process.argv;
  if (!outDirArg || !htmlPathArg) {
    process.stderr.write("usage: node demo/qa/render.mjs <out-dir> <html-path>\n");
    process.exit(2);
  }
  const outDir = resolve(outDirArg);
  const htmlPath = resolve(htmlPathArg);

  const rankedRaw = loadJson(`${outDir}/ranked.json`, []);
  const answersRaw = loadJson(`${outDir}/answers.json`, []);
  const verifyRaw = loadJson(`${outDir}/verify.json`, []);

  const answersById = new Map();
  for (const a of Array.isArray(answersRaw) ? answersRaw : []) {
    if (a && typeof a.id === "string") answersById.set(a.id, a);
  }
  const verifyIndex = buildVerifyIndex(Array.isArray(verifyRaw) ? verifyRaw : []);

  const ranked = (Array.isArray(rankedRaw) ? rankedRaw : [])
    .slice()
    .sort((a, b) => {
      const ra = typeof a.rank === "number" ? a.rank : Number.MAX_SAFE_INTEGER;
      const rb = typeof b.rank === "number" ? b.rank : Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;
      return String(a.id).localeCompare(String(b.id));
    });

  const maxScore = ranked.reduce((m, r) => Math.max(m, typeof r.score === "number" ? r.score : 0), 0);

  const allPersonasSet = new Set();
  for (const r of ranked) for (const p of r.personas || []) allPersonasSet.add(p);
  const allPersonas = sortPersonas([...allPersonasSet]);

  const cardsHtml = ranked
    .map((r) => renderCard(r, answersById.get(r.id), verifyIndex.get(r.id), maxScore))
    .join("\n");

  const html = buildPage({ cardsHtml, filterButtonsHtml: renderFilterButtons(allPersonas) });

  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, html, "utf8");
}

function buildPage({ cardsHtml, filterButtonsHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Questions this audience is most likely to ask</title>
<style>
${CSS}
</style>
</head>
<body>
  <header class="page-head">
    <h1>Ranked &amp; sourced</h1>
    <p class="sub">Questions this audience is most likely to ask: ranked, with sourced answers.</p>
  </header>

  <div class="toolbar" role="toolbar" aria-label="Filter and view controls">
    <div class="filter-group" role="group" aria-label="Filter by persona">
      <button type="button" class="filter-btn filter-all" data-persona="" aria-pressed="true">All</button>
      ${filterButtonsHtml}
    </div>
    <div class="view-group" role="group" aria-label="Expand or collapse all">
      <button type="button" id="expand-all" class="view-btn">Expand all</button>
      <button type="button" id="collapse-all" class="view-btn">Collapse all</button>
    </div>
  </div>

  <main class="list" id="list" aria-label="Ranked questions">
${cardsHtml}
  </main>

  <footer class="page-foot">
    <p>Generated deterministically by <code>demo/qa/render.mjs</code> from replayed fixtures. No live model calls, no network requests.</p>
  </footer>

<script>
${JS}
</script>
</body>
</html>
`;
}

const CSS = `
:root {
  --bg: #f6f3ea;
  --panel: #ffffff;
  --panel-2: #f0ece0;
  --ink: #241f19;
  --ink-dim: #6b6458;
  --rule: #ddd4bf;
  --accent: #b3541e;
  --accent-ink: #ffffff;
  --ok: #3f6b4f;
  --ok-bg: rgba(63, 107, 79, 0.10);
  --warn: #8a5f1f;
  --warn-bg: rgba(169, 120, 44, 0.14);
  --danger: #a73b2e;
  --danger-bg: rgba(167, 59, 46, 0.10);
  --focus: #1b56d6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #171613;
    --panel: #201f1b;
    --panel-2: #27251f;
    --ink: #f3efe4;
    --ink-dim: #ab9f8b;
    --rule: #3a3529;
    --accent: #e08a3e;
    --accent-ink: #171613;
    --ok: #86c98d;
    --ok-bg: rgba(134, 201, 141, 0.14);
    --warn: #e0ab5c;
    --warn-bg: rgba(224, 171, 92, 0.16);
    --danger: #e58c7c;
    --danger-bg: rgba(229, 140, 124, 0.14);
    --focus: #7fb0ff;
  }
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 19px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a, button {
  font-family: inherit;
}

:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-radius: 4px;
}

.page-head {
  padding: 32px 24px 12px;
  max-width: 880px;
  margin: 0 auto;
}

.page-head h1 {
  font-family: "Iowan Old Style", "Palatino Linotype", "URW Palladio L", Palatino, Georgia, serif;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
}

.page-head .sub {
  margin: 0;
  color: var(--ink-dim);
  font-size: 19px;
  max-width: 56ch;
}

.toolbar {
  max-width: 880px;
  margin: 18px auto 0;
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  justify-content: space-between;
}

.filter-group, .view-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn, .view-btn {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--panel);
  color: var(--ink);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
}

.filter-btn[aria-pressed="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-ink);
}

.view-btn {
  border-radius: 8px;
}

.view-btn:hover, .filter-btn:hover {
  border-color: var(--accent);
}

.list {
  max-width: 880px;
  margin: 20px auto 0;
  padding: 0 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--rule);
  border-radius: 12px;
  overflow: hidden;
}

.card[hidden] {
  display: none;
}

.card-summary {
  list-style: none;
  cursor: pointer;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 14px;
  align-items: center;
}

.card-summary::-webkit-details-marker { display: none; }

.card-summary::before {
  content: "\\25B8";
  grid-row: 1 / 3;
  grid-column: 1;
  color: var(--ink-dim);
  font-size: 18px;
  transition: transform 0.15s ease;
  justify-self: start;
  align-self: start;
  margin-top: 6px;
}

details[open] > .card-summary::before {
  transform: rotate(90deg);
}

.card-head {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 14px;
}

.rank-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--ink-dim);
  background: var(--panel-2);
  border: 1px dashed var(--rule);
  border-radius: 5px;
  padding: 3px 7px;
  background-image: radial-gradient(circle, var(--bg) 1.4px, transparent 1.6px);
  background-size: 7px 7px;
  background-position: right 2px center;
  background-repeat: repeat-y;
}

.score-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meter {
  width: 84px;
  height: 7px;
  background: var(--panel-2);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--rule);
}

.meter-fill {
  display: block;
  height: 100%;
  background: var(--accent);
}

.score-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  color: var(--ink-dim);
}

.question {
  grid-column: 2;
  font-family: "Iowan Old Style", "Palatino Linotype", "URW Palladio L", Palatino, Georgia, serif;
  font-size: 22px;
  line-height: 1.35;
}

.chips {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.chip {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-dim);
  background: var(--panel-2);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 2px 9px;
}

.answer {
  padding: 4px 20px 22px 54px;
  border-top: 1px solid var(--rule);
  margin-top: 2px;
  padding-top: 16px;
}

.answer-text {
  margin: 0 0 14px;
  font-size: 18px;
  max-width: 68ch;
}

.badge {
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 12px;
  border: 2px solid currentColor;
  border-radius: 3px 9px 3px 9px / 9px 3px 9px 3px;
  transform: rotate(-2deg);
  margin: 0 0 14px;
}

.badge-sourced { color: var(--ok); background: var(--ok-bg); }
.badge-testimony { color: var(--warn); background: var(--warn-bg); }
.badge-not-in-record { color: var(--danger); background: var(--danger-bg); }
.badge-unknown { color: var(--ink-dim); background: var(--panel-2); }

.answer-banner {
  color: var(--danger);
  font-weight: 700;
  font-size: 15px;
  margin: 0 0 10px;
}

.citations {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.citation {
  font-size: 15px;
  color: var(--ink-dim);
}

.citation-line {
  display: block;
}

.citation-path {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 14px;
  color: var(--ink);
  background: var(--panel-2);
  border-radius: 4px;
  padding: 1px 5px;
}

.citation-locator {
  font-style: italic;
}

.citation-note {
  display: block;
  font-size: 13px;
  font-style: italic;
  color: var(--ink-dim);
  margin-top: 2px;
}

.citation-private .citation-path {
  background: none;
  border: 1px dashed var(--rule);
}

.citation-flag {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 800;
  color: var(--danger);
  background: var(--danger-bg);
  border-radius: 4px;
  padding: 2px 7px;
}

.no-citations {
  color: var(--ink-dim);
  font-style: italic;
  font-size: 15px;
  margin: 0;
}

.page-foot {
  max-width: 880px;
  margin: 0 auto;
  padding: 8px 24px 40px;
  color: var(--ink-dim);
  font-size: 13px;
}

.page-foot code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

@media (max-width: 640px) {
  body { font-size: 18px; }
  .page-head { padding: 22px 16px 8px; }
  .page-head h1 { font-size: 30px; }
  .toolbar { padding: 0 16px; }
  .list { padding: 0 16px 32px; }
  .card-summary { padding: 14px 14px; grid-template-columns: auto 1fr; gap: 4px 10px; }
  .answer { padding: 14px 14px 18px 14px; }
  .question { font-size: 20px; }
  .meter { width: 60px; }
}
`;

const JS = `
(function () {
  "use strict";
  var list = document.getElementById("list");
  var cards = Array.prototype.slice.call(list.querySelectorAll(".card"));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var allBtn = document.querySelector(".filter-all");
  var active = new Set();

  function applyFilter() {
    cards.forEach(function (card) {
      var personas = (card.getAttribute("data-personas") || "").split(" ").filter(Boolean);
      var visible = active.size === 0 || personas.some(function (p) { return active.has(p); });
      if (visible) card.removeAttribute("hidden");
      else card.setAttribute("hidden", "");
    });
  }

  filterBtns.forEach(function (btn) {
    if (btn === allBtn) return;
    btn.addEventListener("click", function () {
      var persona = btn.getAttribute("data-persona");
      if (active.has(persona)) {
        active.delete(persona);
        btn.setAttribute("aria-pressed", "false");
      } else {
        active.add(persona);
        btn.setAttribute("aria-pressed", "true");
      }
      allBtn.setAttribute("aria-pressed", active.size === 0 ? "true" : "false");
      applyFilter();
    });
  });

  if (allBtn) {
    allBtn.addEventListener("click", function () {
      active.clear();
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", b === allBtn ? "true" : "false"); });
      applyFilter();
    });
  }

  var expandAll = document.getElementById("expand-all");
  var collapseAll = document.getElementById("collapse-all");
  if (expandAll) expandAll.addEventListener("click", function () {
    cards.forEach(function (c) { c.setAttribute("open", ""); });
  });
  if (collapseAll) collapseAll.addEventListener("click", function () {
    cards.forEach(function (c) { c.removeAttribute("open"); });
  });

  // Roving arrow-key navigation between question summaries, in addition to
  // native Tab/Enter/Space support from <details>/<summary>.
  list.addEventListener("keydown", function (ev) {
    if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
    var summaries = cards
      .filter(function (c) { return !c.hasAttribute("hidden"); })
      .map(function (c) { return c.querySelector(".card-summary"); });
    var idx = summaries.indexOf(document.activeElement);
    if (idx === -1) return;
    ev.preventDefault();
    var next = ev.key === "ArrowDown" ? idx + 1 : idx - 1;
    if (next < 0) next = summaries.length - 1;
    if (next >= summaries.length) next = 0;
    summaries[next].focus();
  });
})();
`;

main();
