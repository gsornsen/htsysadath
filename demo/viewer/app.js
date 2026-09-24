// demo/viewer/app.js — polls /api/state (same-origin only, no external fetches) and renders
// the rough draft plus four persona columns.

const POLL_MS = 1500;

const roughEl = document.getElementById("rough-text");
const columnsEl = document.getElementById("columns");
const servedAtEl = document.getElementById("served-at");

const STATE_LABEL = {
  queued: "queued",
  running: "running",
  done: "done",
  failed: "failed",
};

function fmtElapsed(seconds) {
  if (seconds === null || seconds === undefined) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Minimal renderer for the draft lanes' output shape: a leading "# ... draft" heading,
// body paragraphs, optional "[dropped: ...]" lines, and a trailing "Questions:" section.
function renderDraft(text) {
  const lines = text.split("\n");
  let html = "";
  let inQuestions = false;
  let paraBuf = [];

  function flushPara() {
    if (paraBuf.length) {
      html += `<p>${escapeHtml(paraBuf.join(" ")).trim()}</p>`;
      paraBuf = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      continue;
    }
    if (line.startsWith("# ")) {
      flushPara();
      html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
      continue;
    }
    if (/^questions:?$/i.test(line.replace(/^#+\s*/, ""))) {
      flushPara();
      inQuestions = true;
      html += `<div class="questions"><strong>Questions:</strong>`;
      continue;
    }
    if (line.toLowerCase().startsWith("[dropped:")) {
      flushPara();
      html += `<div class="dropped">${escapeHtml(line)}</div>`;
      continue;
    }
    if (inQuestions) {
      html += `<div>${escapeHtml(line)}</div>`;
      continue;
    }
    paraBuf.push(line);
  }
  flushPara();
  if (inQuestions) html += `</div>`;
  return html || `<p>${escapeHtml(text)}</p>`;
}

function renderColumn(p) {
  const col = document.createElement("div");
  col.className = "col";

  const head = document.createElement("div");
  head.className = "col-head";
  head.innerHTML = `<h3>${escapeHtml(p.label)}</h3><span class="elapsed">${fmtElapsed(p.elapsedSeconds)}</span>`;

  const chip = document.createElement("span");
  chip.className = `chip ${p.state}`;
  chip.textContent = STATE_LABEL[p.state] || p.state;

  const draft = document.createElement("div");
  draft.className = "draft";
  if (p.state === "done" && p.draft) {
    draft.innerHTML = renderDraft(p.draft);
  } else if (p.state === "failed") {
    draft.innerHTML = `<p class="placeholder">Lane failed.</p>${p.error ? `<div class="error">${escapeHtml(p.error)}</div>` : ""}`;
  } else if (p.state === "running") {
    draft.innerHTML = `<p class="placeholder">Writing…</p>`;
  } else {
    draft.innerHTML = `<p class="placeholder">Queued.</p>`;
  }

  col.appendChild(head);
  col.appendChild(chip);
  col.appendChild(draft);
  return col;
}

async function poll() {
  try {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const state = await res.json();

    roughEl.textContent = state.abstract;

    columnsEl.innerHTML = "";
    for (const p of state.personas) {
      columnsEl.appendChild(renderColumn(p));
    }

    const t = new Date(state.servedAt);
    servedAtEl.textContent = `updated ${t.toLocaleTimeString()}`;
  } catch (err) {
    servedAtEl.textContent = `viewer: ${err.message}`;
  }
}

poll();
setInterval(poll, POLL_MS);
