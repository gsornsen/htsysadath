#!/usr/bin/env node
// Dependency-free chart builder. Node built-ins only.
// Run from talk/slides/:  node scripts/build-charts.mjs
//
// Reads talk/slides/data/*.json (each carries a `source` field) and writes
// talk/slides/assets/charts/*.svg. No numbers are hard-coded here except the
// Wilson-interval formula (a general statistics formula, not a data value) and
// layout constants. Every displayed number is derived from a JSON file's
// numerator/denominator or literal fields.
//
// Palette: dark-theme only (talk/plan/04-data-viz.md "Palette/typography"),
// dataviz skill `references/palette.md` dark column, categorical slots 1-3.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'charts');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1280;
const H = 720;
const FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;

// dataviz skill references/palette.md — dark column
const C = {
  surface: '#1a1a19',
  page: '#0d0d0d',
  textPrimary: '#ffffff',
  textSecondary: '#c3c2b7',
  textMuted: '#898781',
  grid: '#2c2c2a',
  baseline: '#383835',
  border: 'rgba(255,255,255,0.14)',
  slot1: '#3987e5', // blue
  slot2: '#d95926', // orange
  slot3: '#199e70', // aqua
  goodText: '#0ca30c',
};

function readJSON(name) {
  return JSON.parse(readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8'));
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Approximate word-wrap for system-sans at a given font size. Conservative
// average-char-width factor so wrapped text stays inside its box.
function wrap(text, maxWidth, fontSize, charW = 0.56) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * charW)));
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (t.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function tspans(lines, x, y0, dy) {
  return lines.map((l, i) => `<tspan x="${x}" y="${y0 + i * dy}">${esc(l)}</tspan>`).join('');
}

// Wilson 95% score interval. Used ONLY where the source document does not
// already state an exact CI for that figure (day-level dots in lot-bar,
// the n=52 historical read) — never to override a CI the source quotes.
function wilson(numerator, denominator) {
  if (!denominator) return { p: 0, lo: 0, hi: 0 };
  const z = 1.96;
  const n = denominator;
  const phat = numerator / n;
  const denom = 1 + (z * z) / n;
  const center = (phat + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((phat * (1 - phat)) / n + (z * z) / (4 * n * n))) / denom;
  return { p: phat * 100, lo: Math.max(0, (center - half) * 100), hi: Math.min(100, (center + half) * 100) };
}

function pctOf(numerator, denominator) {
  return (numerator / denominator) * 100;
}

function fmt1(x) {
  return x.toFixed(1);
}

function svgOpen(w = W, h = H) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ` +
    `font-family='${FONT}'>\n` +
    `<rect x="0" y="0" width="${w}" height="${h}" fill="${C.surface}"/>\n`
  );
}
const svgClose = '</svg>\n';

function title(text, x = 56, y = 56) {
  return `<text x="${x}" y="${y}" fill="${C.textPrimary}" font-size="30" font-weight="700">${esc(text)}</text>\n`;
}

function sourceLine(text, x = 56, y = H - 20) {
  return `<text x="${x}" y="${y}" fill="${C.textMuted}" font-size="14">${esc(text)}</text>\n`;
}

function captionBlock(text, x, yTop, maxWidth, fontSize = 18, lineH = 24, fill = C.textSecondary) {
  const lines = wrap(text, maxWidth, fontSize);
  let out = `<text x="${x}" y="${yTop}" fill="${fill}" font-size="${fontSize}">`;
  out += tspans(lines, x, yTop, lineH);
  out += `</text>\n`;
  return { svg: out, height: lines.length * lineH };
}

// ---------------------------------------------------------------------------
// 1. d4-arms.svg — grouped bar, @1 / @3, G0 vs G0h
// ---------------------------------------------------------------------------
function buildD4Arms(d) {
  let svg = svgOpen();
  svg += title(d.title);

  const plotX = 130;
  const plotY = 110;
  const plotW = W - plotX - 300; // leave room for legend at right
  const plotH = 380;
  const axisMax = 100;

  // gridlines
  for (let v = 0; v <= 100; v += 20) {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 5}" text-anchor="end" fill="${C.textMuted}" font-size="15">${v}%</text>\n`;
  }
  svg += `<line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  const groupW = plotW / d.groups.length;
  const barW = 84;
  const barGap = 16;
  const seriesColor = { G0: C.slot1, G0h: C.slot2 };

  d.groups.forEach((g, gi) => {
    const groupCx = plotX + groupW * gi + groupW / 2;
    const startX = groupCx - (barW * g.bars.length + barGap * (g.bars.length - 1)) / 2;

    g.bars.forEach((b, bi) => {
      const pct = pctOf(b.numerator, b.denominator);
      const x = startX + bi * (barW + barGap);
      const barH = (pct / axisMax) * plotH;
      const y = plotY + plotH - barH;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${seriesColor[b.series]}"/>\n`;

      // When a CI is present, its upper whisker can sit above the bar top —
      // anchor the value labels above the WHISKER, not the bar, so the
      // whisker line never runs through the label text.
      let yHi = null;
      let yLo = null;
      if (b.ciLo != null) {
        yLo = plotY + plotH - (b.ciLo / axisMax) * plotH;
        yHi = plotY + plotH - (b.ciHi / axisMax) * plotH;
      }
      const labelTop = yHi != null ? Math.min(y, yHi) : y;
      svg += `<text x="${x + barW / 2}" y="${labelTop - 12}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">${fmt1(pct)}%</text>\n`;
      svg += `<text x="${x + barW / 2}" y="${labelTop - 34}" text-anchor="middle" fill="${C.textMuted}" font-size="13">${b.numerator}/${b.denominator}</text>\n`;
      if (yHi != null) {
        const cx = x + barW / 2;
        svg += `<line x1="${cx}" y1="${yLo}" x2="${cx}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
        svg += `<line x1="${cx - 6}" y1="${yLo}" x2="${cx + 6}" y2="${yLo}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
        svg += `<line x1="${cx - 6}" y1="${yHi}" x2="${cx + 6}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
      }
    });

    // group label
    svg += `<text x="${groupCx}" y="${plotY + plotH + 34}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">${esc(g.label)}</text>\n`;
    // mcnemar annotation, above the group, clear of bar-tip labels
    svg += `<text x="${groupCx}" y="${plotY - 26}" text-anchor="middle" fill="${C.textSecondary}" font-size="15">${esc(g.mcnemar)}</text>\n`;
  });

  // legend, top-right
  const legX = plotX + plotW + 40;
  let legY = 120;
  svg += `<text x="${legX}" y="${legY}" fill="${C.textPrimary}" font-size="16" font-weight="700">Arm</text>\n`;
  legY += 30;
  const legendSeries = [
    ['G0', 'G0 — flat, no head'],
    ['G0h', 'G0h — flat + language head'],
  ];
  for (const [key, label] of legendSeries) {
    svg += `<rect x="${legX}" y="${legY - 14}" width="18" height="18" rx="3" fill="${seriesColor[key]}"/>\n`;
    const lines = wrap(label, 190, 15);
    svg += `<text x="${legX + 28}" y="${legY}" fill="${C.textSecondary}" font-size="15">${tspans(lines, legX + 28, legY, 19)}</text>\n`;
    legY += 19 * lines.length + 16;
  }

  const cap = captionBlock(d.caption, 56, plotY + plotH + 90, W - 112, 18, 24);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 2. top3-measures.svg — small multiples, 4 panels, points never joined
// ---------------------------------------------------------------------------
function buildTop3Measures(d) {
  let svg = svgOpen();
  svg += title(d.title);

  const gridX = 56;
  const gridY = 96;
  const gridW = W - gridX * 2;
  const gridH = 470;
  const cols = 2;
  const rows = 2;
  const cellW = gridW / cols;
  const cellH = gridH / rows;
  const padIn = 24;

  d.panels.forEach((panel, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx0 = gridX + col * cellW;
    const cy0 = gridY + row * cellH;
    const innerX = cx0 + padIn;
    const innerY = cy0 + 58;
    const innerW = cellW - padIn * 2;
    const innerH = cellH - 58 - 30;

    // panel frame
    svg += `<rect x="${cx0 + 6}" y="${cy0}" width="${cellW - 12}" height="${cellH - 14}" rx="6" fill="none" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${innerX}" y="${cy0 + 26}" fill="${C.textPrimary}" font-size="17" font-weight="700">${esc(panel.title)}</text>\n`;
    svg += `<text x="${innerX}" y="${cy0 + 44}" fill="${C.textMuted}" font-size="13">${esc(panel.unit)}</text>\n`;

    // y gridlines 0/50/100
    [0, 50, 100].forEach((v) => {
      const y = innerY + innerH - (v / 100) * innerH;
      svg += `<line x1="${innerX}" y1="${y}" x2="${innerX + innerW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
      svg += `<text x="${innerX - 8}" y="${y + 4}" text-anchor="end" fill="${C.textMuted}" font-size="11">${v}</text>\n`;
    });

    const n = panel.points.length;
    const slotW = innerW / (n + 1);
    panel.points.forEach((pt, pi) => {
      const pct = pctOf(pt.numerator, pt.denominator);
      const x = innerX + slotW * (pi + 1);
      const y = innerY + innerH - (pct / 100) * innerH;
      svg += `<circle cx="${x}" cy="${y}" r="7" fill="${C.slot1}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<text x="${x}" y="${y - 16}" text-anchor="middle" fill="${C.textPrimary}" font-size="14" font-weight="700">${fmt1(pct)}%</text>\n`;
      const labLines = wrap(`${pt.label} (${pt.numerator}/${pt.denominator})`, slotW + 26, 11);
      svg += `<text x="${x}" y="${innerY + innerH + 16}" text-anchor="middle" fill="${C.textMuted}" font-size="11">${tspans(labLines, x, innerY + innerH + 16, 13)}</text>\n`;
    });
  });

  const cap = captionBlock(d.caption, 56, gridY + gridH + 46, W - 112, 18, 24);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 3. b-four-acts.svg — four sequential acts, one arrow, four segments
// ---------------------------------------------------------------------------
function buildFourActs(d) {
  let svg = svgOpen();
  svg += title(d.title);

  const railY = 150;
  const marginX = 150;
  const usableW = W - marginX * 2;
  const n = d.acts.length;
  const step = usableW / (n - 1);

  // connecting rail (the sequence IS the claim, per D9 — a single arrow is correct here)
  svg += `<line x1="${marginX}" y1="${railY}" x2="${marginX + usableW}" y2="${railY}" stroke="${C.baseline}" stroke-width="3"/>\n`;
  // arrowhead
  const ax = marginX + usableW;
  svg += `<path d="M ${ax} ${railY - 8} L ${ax + 14} ${railY} L ${ax} ${railY + 8} Z" fill="${C.baseline}"/>\n`;

  d.acts.forEach((act, i) => {
    const cx = marginX + step * i;
    svg += `<circle cx="${cx}" cy="${railY}" r="22" fill="${C.slot1}" stroke="${C.surface}" stroke-width="4"/>\n`;
    svg += `<text x="${cx}" y="${railY + 7}" text-anchor="middle" fill="${C.textPrimary}" font-size="20" font-weight="700">${act.n}</text>\n`;

    svg += `<text x="${cx}" y="${railY - 46}" text-anchor="middle" fill="${C.textPrimary}" font-size="19" font-weight="700">${esc(act.label)}</text>\n`;
    svg += `<text x="${cx}" y="${railY - 24}" text-anchor="middle" fill="${C.textMuted}" font-size="14">${esc(act.date)}</text>\n`;

    // Clamp each node's text box so wrapped, centered text never crosses the
    // canvas edge — edge nodes (act 1, act 4) sit close to the margin.
    const safePad = 40;
    const maxHalf = Math.min(cx - safePad, W - safePad - cx);
    const boxW = Math.min(step - 30, maxHalf * 2);
    const triggerText = (act.flag ? '⚠ ' : '') + act.trigger;
    const lines = wrap(triggerText, boxW, 14.5);
    const cardTop = railY + 46;
    svg += `<text x="${cx}" y="${cardTop}" text-anchor="middle" fill="${C.textSecondary}" font-size="14.5">${tspans(lines, cx, cardTop, 20)}</text>\n`;

    if (act.detail) {
      const detailY = cardTop + lines.length * 20 + 18;
      const dLines = wrap(act.detail, boxW, 12.5);
      svg += `<text x="${cx}" y="${detailY}" text-anchor="middle" fill="${C.textMuted}" font-size="12.5" font-style="italic">${tspans(dLines, cx, detailY, 17)}</text>\n`;
    }
  });

  const cap = captionBlock(d.caption, 56, 560, W - 112, 18, 24);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 4. f-two-levers.svg — 3 horizontal bars, log scale, evidence tiers tagged
// ---------------------------------------------------------------------------
function buildTwoLevers(d) {
  let svg = svgOpen();
  svg += title(d.title);

  const plotX = 380;
  const plotY = 140;
  const plotW = W - plotX - 60;
  const rowH = 130;

  const axisMin = 8;
  const axisMax = 260;
  const logMin = Math.log10(axisMin);
  const logMax = Math.log10(axisMax);
  const xOf = (v) => plotX + ((Math.log10(v) - logMin) / (logMax - logMin)) * plotW;

  // log gridlines
  [10, 30, 100, 260].forEach((v) => {
    const x = xOf(v);
    svg += `<line x1="${x}" y1="${plotY - 10}" x2="${x}" y2="${plotY + rowH * d.bars.length + 6}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${x}" y="${plotY - 20}" text-anchor="middle" fill="${C.textMuted}" font-size="13">${v}s</text>\n`;
  });

  d.bars.forEach((b, i) => {
    const y = plotY + i * rowH + rowH / 2;
    const barThick = 30;
    const xLow = xOf(b.low);
    const xHigh = xOf(b.high);

    // label to the left
    const labLines = wrap(b.label, plotX - 96, 16);
    svg += `<text x="${plotX - 24}" y="${y - (labLines.length - 1) * 10}" text-anchor="end" fill="${C.textPrimary}" font-size="16" font-weight="600">${tspans(labLines, plotX - 24, y - (labLines.length - 1) * 10, 20)}</text>\n`;

    svg += `<rect x="${xOf(axisMin)}" y="${y - barThick / 2}" width="${xHigh - xOf(axisMin)}" height="${barThick}" rx="4" fill="${C.slot1}"/>\n`;
    if (b.high !== b.low) {
      svg += `<line x1="${xLow}" y1="${y - barThick / 2 - 6}" x2="${xLow}" y2="${y + barThick / 2 + 6}" stroke="${C.textPrimary}" stroke-width="3"/>\n`;
    }
    const valueText = b.high === b.low ? `${b.low}${b.unit}` : `${b.low}–${b.high}${b.unit}`;
    svg += `<text x="${xHigh + 14}" y="${y + 6}" fill="${C.textPrimary}" font-size="22" font-weight="700">${esc(valueText)}</text>\n`;

    // evidence tier tag, below the bar
    svg += `<text x="${xOf(axisMin)}" y="${y + barThick / 2 + 22}" fill="${C.textMuted}" font-size="13">${esc(b.tierLabel)}</text>\n`;
  });

  const caveatY = plotY + d.bars.length * rowH + 30;
  svg += `<rect x="56" y="${caveatY - 22}" width="${W - 112}" height="52" rx="6" fill="${C.grid}" opacity="0.5"/>\n`;
  const caveatLines = wrap(d.caveat, W - 150, 14.5);
  svg += `<text x="72" y="${caveatY - 2}" fill="${C.textSecondary}" font-size="14.5">${tspans(caveatLines, 72, caveatY - 2, 19)}</text>\n`;

  const cap = captionBlock(d.caption, 56, caveatY + 70, W - 112, 18, 24);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 5. remembered-vs-recorded.svg — table, counter-example rows marked apart
// ---------------------------------------------------------------------------
function buildRememberedTable(d) {
  // colX[0] sits clear of the counter-example accent bar (drawn at x=52,
  // width 6) with a visible gap, so its text is never clipped by the bar.
  const colX = [70, 244, 636, 1028];
  const colW = [164, 382, 382, 168];
  const headerY = 88;
  let svg = svgOpen();
  svg += title(d.title, 56, 50);

  const headers = ['Instance', 'Remembered', 'Recorded', 'Source'];
  headers.forEach((h, i) => {
    svg += `<text x="${colX[i]}" y="${headerY}" fill="${C.textMuted}" font-size="13" font-weight="700" letter-spacing="0.5">${esc(h.toUpperCase())}</text>\n`;
  });
  svg += `<line x1="56" y1="${headerY + 10}" x2="${W - 56}" y2="${headerY + 10}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  let y = headerY + 32;
  const fontSize = 13.5;
  const lineH = 17.5;
  const padV = 11;

  d.rows.forEach((row) => {
    const isCounter = row.type === 'counter-example';
    const instLines = wrap(row.instance, colW[0] - 10, 14.5);
    const remLines = wrap(row.remembered, colW[1] - 16, fontSize);
    const recLines = wrap(row.recorded, colW[2] - 16, fontSize);
    const srcLines = wrap(row.source, colW[3] - 10, 12.5);
    const labelLines = row.label ? wrap(row.label, colW[0] - 10, 11.5) : [];

    const contentLines = Math.max(instLines.length + labelLines.length, remLines.length, recLines.length, srcLines.length);
    const rowH = contentLines * lineH + padV;

    if (isCounter) {
      svg += `<rect x="52" y="${y - padV / 2}" width="${W - 104}" height="${rowH}" rx="6" fill="${C.slot3}" opacity="0.12"/>\n`;
      svg += `<rect x="52" y="${y - padV / 2}" width="6" height="${rowH}" fill="${C.slot3}"/>\n`;
    }

    const textY = y + fontSize - 2;
    svg += `<text x="${colX[0]}" y="${textY}" fill="${isCounter ? C.slot3 : C.textPrimary}" font-size="14.5" font-weight="700">${tspans(instLines, colX[0], textY, lineH)}</text>\n`;
    if (labelLines.length) {
      const labY = textY + instLines.length * lineH + 1;
      svg += `<text x="${colX[0]}" y="${labY}" fill="${C.slot3}" font-size="11.5" font-weight="600">${tspans(labelLines, colX[0], labY, 14.5)}</text>\n`;
    }
    svg += `<text x="${colX[1]}" y="${textY}" fill="${C.textSecondary}" font-size="${fontSize}">${tspans(remLines, colX[1], textY, lineH)}</text>\n`;
    svg += `<text x="${colX[2]}" y="${textY}" fill="${C.textPrimary}" font-size="${fontSize}">${tspans(recLines, colX[2], textY, lineH)}</text>\n`;
    svg += `<text x="${colX[3]}" y="${textY}" fill="${C.textMuted}" font-size="12.5">${tspans(srcLines, colX[3], textY, lineH)}</text>\n`;

    y += rowH + 7;
  });

  const capTop = y + 16;
  const cap = captionBlock(d.caption, 56, capTop, W - 112, 15, 19);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`, 56, capTop + cap.height + 16);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 6. e-lane-dag.svg — curated lane DAG, tiers Haiku/Sonnet/Opus/Fable
// ---------------------------------------------------------------------------
function buildLaneDag(d) {
  let svg = svgOpen();
  svg += title(d.title);

  const tierColor = { haiku: C.slot1, sonnet: C.slot2, opus: C.slot3, fable: C.slot3, root: C.textMuted };
  // 4th tier (Fable) folds into the shared slot-3 hue, distinguished by a
  // 45deg hatch texture per the skill's texture channel (dataviz
  // references/marks-and-anatomy.md, "Texture — the backup channel").
  svg += `<defs>
    <pattern id="hatch-fable" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="${C.slot3}"/>
      <line x1="0" y1="0" x2="0" y2="8" stroke="#0f3b2c" stroke-width="3"/>
    </pattern>
  </defs>\n`;

  const tierY = { fable: 130, opus: 260, sonnet: 390, haiku: 520 };
  const stageX = { impl: 220, review: 560 };
  const mainNode = { x: 1050, y: 640 };

  // tier row labels
  Object.entries(d.tierLabels).forEach(([tier, label]) => {
    if (tierY[tier] == null) return;
    svg += `<text x="90" y="${tierY[tier] + 5}" text-anchor="end" fill="${C.textMuted}" font-size="14">${esc(label)}</text>\n`;
    svg += `<line x1="100" y1="${tierY[tier]}" x2="${W - 60}" y2="${tierY[tier]}" stroke="${C.grid}" stroke-width="1" stroke-dasharray="2,4"/>\n`;
  });

  const nodeById = {};
  d.nodes.forEach((node) => {
    if (node.id === 'main') {
      nodeById[node.id] = mainNode;
      return;
    }
    const isReview = /^review-|fable-review/.test(node.id);
    const x = isReview ? stageX.review : stageX.impl;
    const y = tierY[node.tier];
    nodeById[node.id] = { x, y };
  });

  // edges first, under nodes
  d.edges.forEach((e) => {
    const a = nodeById[e.from];
    const b = nodeById[e.to];
    svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>\n`;
  });

  svg = svg.replace(
    '</defs>',
    `<marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="${C.textMuted}"/>
    </marker></defs>`
  );

  // main node — filled (not just outlined) so incoming edges/arrowheads
  // that terminate at its center are hidden under the box, not through it
  svg += `<rect x="${mainNode.x - 60}" y="${mainNode.y - 24}" width="120" height="48" rx="8" fill="${C.surface}" stroke="${C.textPrimary}" stroke-width="2"/>\n`;
  svg += `<text x="${mainNode.x}" y="${mainNode.y + 6}" text-anchor="middle" fill="${C.textPrimary}" font-size="17" font-weight="700">main</text>\n`;

  d.nodes.forEach((node) => {
    if (node.id === 'main') return;
    const { x, y } = nodeById[node.id];
    const fill = node.tier === 'fable' ? 'url(#hatch-fable)' : tierColor[node.tier];
    svg += `<rect x="${x - 90}" y="${y - 24}" width="180" height="48" rx="8" fill="${fill}" stroke="${C.surface}" stroke-width="3"/>\n`;
    svg += `<text x="${x}" y="${y - 2}" text-anchor="middle" fill="${C.textPrimary}" font-size="14" font-weight="700">${esc(node.label)}</text>\n`;
    svg += `<text x="${x}" y="${y + 16}" text-anchor="middle" fill="${C.textPrimary}" font-size="11" opacity="0.85">${esc(node.sha)}</text>\n`;
  });

  // legend
  let lx = 100;
  const ly = H - 96;
  svg += `<text x="${lx}" y="${ly - 16}" fill="${C.textMuted}" font-size="13">tier (reviewer one tier above implementer)</text>\n`;
  d.tierOrder.forEach((tier) => {
    const fill = tier === 'fable' ? 'url(#hatch-fable)' : tierColor[tier];
    svg += `<rect x="${lx}" y="${ly}" width="18" height="18" rx="3" fill="${fill}"/>\n`;
    svg += `<text x="${lx + 26}" y="${ly + 14}" fill="${C.textSecondary}" font-size="14">${esc(d.tierLabels[tier])}</text>\n`;
    lx += 150;
  });

  svg += sourceLine(`source: ${d.source}`, 56, H - 44);
  const cap = captionBlock(d.caption, 56, H - 20, W - 112, 13.5, 16, C.textMuted);
  // caption placed compactly above source line for this dense diagram
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 7. lot-bar.svg — stat tiles + dot plot (no trend line)
// ---------------------------------------------------------------------------
function buildLotBar(d) {
  let svg = svgOpen();
  svg += title(d.title);

  // stat tiles
  const tileW = (W - 112 - 2 * 24) / 3;
  const tileH = 130;
  const tileY = 92;
  d.tiles.forEach((tile, i) => {
    const x = 56 + i * (tileW + 24);
    const pct = pctOf(tile.numerator, tile.denominator);
    svg += `<rect x="${x}" y="${tileY}" width="${tileW}" height="${tileH}" rx="8" fill="${C.grid}" opacity="0.45"/>\n`;
    svg += `<text x="${x + 20}" y="${tileY + 30}" fill="${C.textMuted}" font-size="14">${tspans(wrap(tile.label, tileW - 40, 14), x + 20, tileY + 30, 17)}</text>\n`;
    svg += `<text x="${x + 20}" y="${tileY + 82}" fill="${C.slot1}" font-size="40" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${x + 20}" y="${tileY + 108}" fill="${C.textMuted}" font-size="14">${tile.numerator}/${tile.denominator}, CI ${fmt1(tile.ciLo)}–${fmt1(tile.ciHi)}</text>\n`;
  });

  // dot plot
  const plotX = 100;
  const plotY = tileY + tileH + 66;
  const plotW = W - plotX - 260; // leave room for historical callout at right
  const plotH = 250;
  const axisMax = 100;

  [0, 25, 50, 75, 100].forEach((v) => {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 5}" text-anchor="end" fill="${C.textMuted}" font-size="13">${v}%</text>\n`;
  });

  // pooled reference line (dashed — a reference, not a trend across the dots).
  // Its label lives in a small legend strip above the plot, not inline on the
  // line itself, since the daily dots crowd every point on the line.
  const overallPct = pctOf(d.overall.numerator, d.overall.denominator);
  const yOverall = plotY + plotH - (overallPct / axisMax) * plotH;
  svg += `<line x1="${plotX}" y1="${yOverall}" x2="${plotX + plotW}" y2="${yOverall}" stroke="${C.textSecondary}" stroke-width="2" stroke-dasharray="6,6"/>\n`;
  const legendY = plotY - 22;
  svg += `<line x1="${plotX}" y1="${legendY}" x2="${plotX + 28}" y2="${legendY}" stroke="${C.textSecondary}" stroke-width="2" stroke-dasharray="6,6"/>\n`;
  svg += `<text x="${plotX + 38}" y="${legendY + 4}" fill="${C.textSecondary}" font-size="13">${fmt1(overallPct)}% overall, pooled — reference line, not a trend</text>\n`;

  const pts = d.dotplot.points;
  const slotW = plotW / (pts.length + 1);
  pts.forEach((pt, i) => {
    const pct = pctOf(pt.numerator, pt.denominator);
    const w = wilson(pt.numerator, pt.denominator);
    const x = plotX + slotW * (i + 1);
    const y = plotY + plotH - (pct / axisMax) * plotH;
    const yLo = plotY + plotH - (w.lo / axisMax) * plotH;
    const yHi = plotY + plotH - (w.hi / axisMax) * plotH;
    svg += `<line x1="${x}" y1="${yLo}" x2="${x}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.4"/>\n`;
    svg += `<circle cx="${x}" cy="${y}" r="9" fill="${C.slot2}" stroke="${C.surface}" stroke-width="2"/>\n`;
    svg += `<text x="${x}" y="${y - 18}" text-anchor="middle" fill="${C.textPrimary}" font-size="15" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${x}" y="${plotY + plotH + 24}" text-anchor="middle" fill="${C.textSecondary}" font-size="14">${esc(pt.day)}</text>\n`;
    svg += `<text x="${x}" y="${plotY + plotH + 42}" text-anchor="middle" fill="${C.textMuted}" font-size="12">n=${pt.denominator}</text>\n`;
  });

  // historical n=52 callout, marked apart (different marker + dashed CI, off to the side)
  const hist = d.historical;
  const histPct = pctOf(hist.numerator, hist.denominator);
  const wHist = wilson(hist.numerator, hist.denominator);
  const hx = plotX + plotW + 90;
  const hy = plotY + plotH - (histPct / axisMax) * plotH;
  const hyLo = plotY + plotH - (wHist.lo / axisMax) * plotH;
  const hyHi = plotY + plotH - (wHist.hi / axisMax) * plotH;
  svg += `<line x1="${hx}" y1="${hyLo}" x2="${hx}" y2="${hyHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.4" stroke-dasharray="3,3"/>\n`;
  svg += `<rect x="${hx - 9}" y="${hy - 9}" width="18" height="18" fill="${C.slot3}" stroke="${C.surface}" stroke-width="2" transform="rotate(45 ${hx} ${hy})"/>\n`;
  svg += `<text x="${hx}" y="${Math.min(hy, hyHi) - 22}" text-anchor="middle" fill="${C.textPrimary}" font-size="15" font-weight="700">${fmt1(histPct)}%</text>\n`;
  const histLines = wrap('historical read, n=52 (small-sample high)', 150, 12);
  const histTextTop = Math.max(hy, hyLo) + 22;
  svg += `<text x="${hx}" y="${histTextTop}" text-anchor="middle" fill="${C.textMuted}" font-size="12">${tspans(histLines, hx, histTextTop, 15)}</text>\n`;

  svg += `<line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  const capTop = plotY + plotH + 76;
  const cap = captionBlock(d.caption, 56, capTop, W - 112, 16.5, 21);
  svg += cap.svg;
  svg += sourceLine(`source: ${d.source}`, 56, capTop + cap.height + 18);
  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------

const charts = [
  ['d4-arms', buildD4Arms],
  ['top3-measures', buildTop3Measures],
  ['b-four-acts', buildFourActs],
  ['f-two-levers', buildTwoLevers],
  ['remembered-vs-recorded', buildRememberedTable],
  ['e-lane-dag', buildLaneDag],
  ['lot-bar', buildLotBar],
];

for (const [name, fn] of charts) {
  const data = readJSON(name);
  const svg = fn(data);
  const outPath = path.join(OUT_DIR, `${name}.svg`);
  writeFileSync(outPath, svg, 'utf8');
  console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
}
