#!/usr/bin/env node
// talk/slides/scripts/shoot.mjs
//
// Manifest-driven capture pipeline for the deck's screenshots (lane L3). Reads
// manifest.json (same directory) and, per row's "type", either:
//   - "capture": screenshots a Storybook story's iframe with Playwright, at a fixed
//     viewport, from an already-running Storybook instance;
//   - "copy": copies an existing PNG straight out of the Grailith checkout, unmodified;
//   - "crop": copies an existing PNG out of the Grailith checkout through a pixel-exact
//     ImageMagick crop (dropping browser chrome / OS chrome), no other edit;
//   - "timeline-beat-only": produces no file. Recorded so the manifest documents *why*
//     a slide has no shot (see docs/agents' anachronism rule) rather than silently
//     omitting it.
//
// This script owns no npm dependencies of its own. Playwright is loaded at runtime from
// the Grailith checkout via createRequire, per GRAILITH_DIR (never hard-coded). "copy"
// and "crop" only touch the filesystem plus, for "crop", the system `magick`/`convert`
// binary (ImageMagick) if present — no Grailith devDependency needed for those rows.
//
// Usage:
//   GRAILITH_DIR=/path/to/grAIde-main \
//   STORYBOOK_URL=http://localhost:9609 \
//   node scripts/shoot.mjs [--only <id>[,<id>...]]
//
// Run from talk/slides/ (matches L1's package.json "shots" script: `node scripts/shoot.mjs`).

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SLIDES_DIR = resolve(__dirname, "..");
const SHOTS_DIR = join(SLIDES_DIR, "assets", "shots");
const MANIFEST_PATH = join(__dirname, "manifest.json");

const GRAILITH_DIR = process.env.GRAILITH_DIR;
const STORYBOOK_URL = process.env.STORYBOOK_URL || "http://localhost:9609";

function parseOnly() {
  const idx = process.argv.indexOf("--only");
  if (idx === -1) return null;
  const raw = process.argv[idx + 1] || "";
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

function loadManifest() {
  const raw = readFileSync(MANIFEST_PATH, "utf8");
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error("manifest.json must be a JSON array");
  return rows;
}

function requireGrailithDir() {
  if (!GRAILITH_DIR) {
    throw new Error(
      "GRAILITH_DIR is not set. Point it at the Grailith checkout, e.g.\n" +
        "  GRAILITH_DIR=/path/to/grAIde-main node scripts/shoot.mjs",
    );
  }
  if (!existsSync(GRAILITH_DIR)) {
    throw new Error(`GRAILITH_DIR does not exist: ${GRAILITH_DIR}`);
  }
}

function loadPlaywright() {
  // Load Playwright from the Grailith checkout's own node_modules (root devDependency
  // there), not from this repo — the talk repo adds no dependencies of its own.
  const req = createRequire(join(GRAILITH_DIR, "package.json"));
  return req("playwright");
}

function findImageMagick() {
  for (const bin of ["magick", "convert"]) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      // try next
    }
  }
  return null;
}

async function runCapture(row, playwright) {
  const { chromium } = playwright;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: row.viewport.width, height: row.viewport.height },
    });
    const url = `${STORYBOOK_URL}/iframe.html?id=${encodeURIComponent(row.storyId)}&viewMode=story`;
    // Stories render synchronously from fixture props (no fetch/auth) once their module
    // is loaded, per talk/plan/03-visual-assets.md — but the FIRST request for any story
    // in a given stories.tsx file pays Vite's on-demand compile cost for that whole file
    // (seconds, not ms), during which the preview shows its own loading spinner. Wait for
    // network to go idle (covers that compile-triggering request) rather than a fixed
    // "load" event, plus a settle for fonts/layout.
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(500);
    if (typeof row.scrollY === "number") {
      // Some stories' salient state (e.g. an "in dissent" banner) sits below the fold at
      // the 1440x900 cap this pipeline uses (talk/plan/03-visual-assets.md, presentation-
      // plan.md §1 decision 5 — no viewport taller than the 1920x1080 cap). Scroll instead
      // of growing the viewport so the shot still respects the size cap.
      await page.evaluate((y) => window.scrollTo(0, y), row.scrollY);
      await page.waitForTimeout(150);
    }
    const outPath = join(SHOTS_DIR, row.outFile);
    await page.screenshot({ path: outPath });
    return outPath;
  } finally {
    await browser.close();
  }
}

function runCopy(row) {
  const src = join(GRAILITH_DIR, row.source);
  if (!existsSync(src)) throw new Error(`copy source missing: ${src}`);
  const outPath = join(SHOTS_DIR, row.outFile);
  copyFileSync(src, outPath);
  return outPath;
}

function resizeToWidth(outPath, width) {
  const magick = findImageMagick();
  if (!magick) {
    throw new Error(`resize requested (width ${width}) but no ImageMagick ("magick"/"convert") on PATH`);
  }
  execFileSync(magick, [outPath, "-resize", `${width}x`, outPath], { stdio: "inherit" });
}

function runCrop(row) {
  const magick = findImageMagick();
  if (!magick) {
    throw new Error(
      `row "${row.id}" needs a crop but neither "magick" nor "convert" (ImageMagick) is on PATH`,
    );
  }
  const src = join(GRAILITH_DIR, row.source);
  if (!existsSync(src)) throw new Error(`crop source missing: ${src}`);
  const outPath = join(SHOTS_DIR, row.outFile);
  const geometry = `${row.crop.width}x${row.crop.height}+${row.crop.x}+${row.crop.y}`;
  const args =
    magick === "magick"
      ? [src, "-crop", geometry, "+repage", outPath]
      : [src, "-crop", geometry, "+repage", outPath];
  execFileSync(magick, args, { stdio: "inherit" });
  return outPath;
}

async function main() {
  mkdirSync(SHOTS_DIR, { recursive: true });
  const only = parseOnly();
  const rows = loadManifest().filter((r) => !only || only.has(r.id));

  const needsGrailith = rows.some((r) => r.type !== "timeline-beat-only");
  if (needsGrailith) requireGrailithDir();

  const needsPlaywright = rows.some((r) => r.type === "capture");
  const playwright = needsPlaywright ? loadPlaywright() : null;

  const results = [];
  for (const row of rows) {
    if (row.type === "timeline-beat-only") {
      console.log(`[skip] ${row.id} — timeline beat only: ${row.reason ?? "no reason recorded"}`);
      results.push({ id: row.id, outFile: null, status: "timeline-beat-only" });
      continue;
    }
    if (row.type === "capture") {
      const outPath = await runCapture(row, playwright);
      console.log(`[capture] ${row.id} -> ${outPath}`);
      results.push({ id: row.id, outFile: outPath, status: "captured" });
    } else if (row.type === "copy") {
      const outPath = runCopy(row);
      if (row.resizeWidth) resizeToWidth(outPath, row.resizeWidth);
      console.log(`[copy] ${row.id} -> ${outPath}${row.resizeWidth ? ` (resized to ${row.resizeWidth}w)` : ""}`);
      results.push({ id: row.id, outFile: outPath, status: "copied" });
    } else if (row.type === "crop") {
      const outPath = runCrop(row);
      if (row.resizeWidth) resizeToWidth(outPath, row.resizeWidth);
      console.log(`[crop] ${row.id} -> ${outPath}${row.resizeWidth ? ` (resized to ${row.resizeWidth}w)` : ""}`);
      results.push({ id: row.id, outFile: outPath, status: "cropped" });
    } else {
      throw new Error(`row "${row.id}" has unknown type "${row.type}"`);
    }
  }
  console.log(`\ndone: ${results.length} row(s) processed, ${SHOTS_DIR}`);
}

main().catch((err) => {
  console.error(err.stack || String(err));
  process.exitCode = 1;
});
