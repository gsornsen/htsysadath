#!/usr/bin/env node
// demo/viewer/server.mjs — zero-dependency static + polling server for Demo 1's reveal.
//
// Serves the rough draft plus four persona columns (status, elapsed time, rendered draft once
// done), reading demo/out/*.status and demo/out/*.md written by `demo/fanout`. Localhost only;
// no external fetches; no npm dependencies (Node built-ins only).
//
// Usage: PORT=8090 node demo/viewer/server.mjs   (PORT defaults to 8090)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", ".."); // repo root
const ABSTRACT_PATH = path.join(ROOT, "talk", "abstract-rough.md");
const OUT_DIR = path.join(ROOT, "demo", "out");
const STATIC_DIR = __dirname;

const PORT = Number(process.env.PORT) || 8090;
const HOST = "127.0.0.1"; // localhost only

const PERSONAS = [
  { key: "engineer", label: "Engineer" },
  { key: "pm", label: "Product Manager" },
  { key: "designer", label: "Product Designer" },
  { key: "exec", label: "Executive" },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function parseStatus(raw) {
  const out = { state: "queued", start: "", end: "", error: "" };
  if (!raw) return out;
  for (const line of raw.split("\n")) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k === "state" || k === "start" || k === "end" || k === "error") out[k] = v;
  }
  return out;
}

function elapsedSeconds(status) {
  if (!status.start) return null;
  const startMs = Date.parse(status.start);
  if (Number.isNaN(startMs)) return null;
  const endMs = status.end ? Date.parse(status.end) : Date.now();
  if (Number.isNaN(endMs)) return null;
  return Math.max(0, Math.round((endMs - startMs) / 1000));
}

function buildState() {
  const abstract = readSafe(ABSTRACT_PATH) ?? "(talk/abstract-rough.md not found)";
  const personas = PERSONAS.map(({ key, label }) => {
    const status = parseStatus(readSafe(path.join(OUT_DIR, `${key}.status`)));
    const draft = status.state === "done" ? readSafe(path.join(OUT_DIR, `${key}.md`)) : null;
    return {
      key,
      label,
      state: status.state,
      elapsedSeconds: elapsedSeconds(status),
      error: status.error || null,
      draft,
    };
  });
  return { abstract, personas, servedAt: new Date().toISOString() };
}

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://${HOST}`);
  } catch {
    res.writeHead(400);
    res.end("bad request");
    return;
  }

  if (url.pathname === "/api/state") {
    const body = JSON.stringify(buildState());
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(body);
    return;
  }

  let rel = url.pathname === "/" ? "/index.html" : url.pathname;
  rel = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(STATIC_DIR, rel);
  if (!full.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    const ext = path.extname(full);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`demo viewer listening on http://${HOST}:${PORT} (pid ${process.pid})`);
});
