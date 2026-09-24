#!/usr/bin/env node
// Dependency-free chart builder. Node built-ins only.
// Run from talk/slides/:  node scripts/build-charts.mjs
//
// Reads talk/slides/data/*.json (each carries a `source` field, for the deck
// lane's footer/notes — never drawn on the chart) and writes
// talk/slides/assets/charts/*.svg. No numbers are hard-coded here except the
// Wilson-interval formula (a general statistics formula, not a data value) and
// layout constants. Every displayed number is derived from a JSON file's
// numerator/denominator or literal fields.
//
// Box: each chart is authored for its REAL rendered box (viewBox 0 0 1136
// 440, the theme's image slot), not shrunk from a 1280x720 canvas. No
// in-chart title, caption or source line: the slide title carries the title,
// the source goes to the deck lane's footer from each JSON's `source` field.
// Every label is >= 24px; axis ticks >= 22px.
//
// Colour meaning, ONE per hue across every chart (revise/charts, 2026-09-24):
//   blue   = baseline / before
//   orange = after / intervention
//   green  = the counter-example ("the record was over-read")
//   grey   = context (a measurement that is neither a baseline nor a result)
//
// Palette: dataviz skill `references/palette.md` dark column, categorical
// slots 1-3 (blue/orange/aqua-as-green), plus the fixed chart-chrome greys
// and the status "critical" red (used ONLY as a text/icon tag, never a fill,
// per the skill's status-color rule).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'charts');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1136;
const H = 440;
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
  blue: '#3987e5', // categorical slot 1 — baseline / before
  orange: '#d95926', // categorical slot 2 — after / intervention
  green: '#199e70', // categorical slot 3 — counter-example
  grey: '#726f68', // context (achromatic, not part of the categorical run)
  critical: '#e66767', // status red — text/icon tag only (e.g. "KILLED"), never a fill
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
// already state an exact CI for that figure — never to override a CI the
// source quotes.
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

// 45deg hatch, used ONLY as the texture channel (never a colour substitute):
// here, to mark founder testimony (an unmeasured figure) apart from an
// instrumented one, per the skill's "texture — the backup channel".
function hatchDef(id, hex, dark) {
  return `<pattern id="${id}" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="${hex}"/>
    <line x1="0" y1="0" x2="0" y2="8" stroke="${dark}" stroke-width="3"/>
  </pattern>\n`;
}

// ---------------------------------------------------------------------------
// 1. b-four-acts.svg — four sequential acts on one timeline
// ---------------------------------------------------------------------------
function buildFourActs(d) {
  let svg = svgOpen();

  const railY = 130;
  const marginX = 120;
  const usableW = W - marginX * 2;
  const n = d.acts.length;
  const step = usableW / (n - 1);

  svg += `<line x1="${marginX}" y1="${railY}" x2="${marginX + usableW}" y2="${railY}" stroke="${C.baseline}" stroke-width="3"/>\n`;
  const ax = marginX + usableW;
  svg += `<path d="M ${ax} ${railY - 9} L ${ax + 16} ${railY} L ${ax} ${railY + 9} Z" fill="${C.baseline}"/>\n`;

  d.acts.forEach((act, i) => {
    const cx = marginX + step * i;
    svg += `<circle cx="${cx}" cy="${railY}" r="27" fill="${C.blue}" stroke="${C.surface}" stroke-width="4"/>\n`;
    svg += `<text x="${cx}" y="${railY + 9}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${act.n}</text>\n`;

    svg += `<text x="${cx}" y="${railY - 70}" text-anchor="middle" fill="${C.textPrimary}" font-size="28" font-weight="700">${esc(act.label)}</text>\n`;
    svg += `<text x="${cx}" y="${railY - 40}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${esc(act.date)}</text>\n`;

    // Clamp each node's text box so wrapped, centered text never crosses the
    // canvas edge — edge nodes (act 1, act 4) sit close to the margin.
    const safePad = 24;
    const maxHalf = Math.min(cx - safePad, W - safePad - cx);
    const boxW = Math.min(step - 20, maxHalf * 2);
    const triggerText = (act.flag ? '⚠ ' : '') + act.trigger;
    const lines = wrap(triggerText, boxW, 24);
    const cardTop = railY + 66;
    svg += `<text x="${cx}" y="${cardTop}" text-anchor="middle" fill="${C.textSecondary}" font-size="24" font-weight="600">${tspans(lines, cx, cardTop, 30)}</text>\n`;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 2. d4-arms.svg — three bars @1: G0, G3 (killed), G0h, plus the kill line
// ---------------------------------------------------------------------------
function buildD4Arms(d) {
  let svg = svgOpen();

  const roleColor = { baseline: C.blue, context: C.grey, after: C.orange };

  const plotX = 90;
  const plotY = 40;
  const plotW = W - plotX - 40;
  const plotH = 280;
  const axisMax = 100;

  for (let v = 0; v <= 100; v += 20) {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  }

  const n = d.bars.length;
  const groupW = plotW / n;
  const barW = 150;

  // kill line, drawn under the bars so bar fills sit on top of it
  const killY = plotY + plotH - (d.killLine.pct / axisMax) * plotH;
  svg += `<line x1="${plotX}" y1="${killY}" x2="${plotX + plotW}" y2="${killY}" stroke="${C.critical}" stroke-width="2" stroke-dasharray="8,6"/>\n`;

  // A bar's label stack (value% / numerator / KILLED tag) is normally
  // anchored just above its own bar top. When the bar falls short of the
  // kill line (a killed arm, by construction), that stack can straddle the
  // dashed line on its way up. Clamp any label that lands within `band` px
  // of the line so the stack jumps clear of it instead of sitting on it.
  const killBand = 12;
  const clampAboveLine = (labelY) => (Math.abs(labelY - killY) < killBand ? killY - killBand : labelY);

  d.bars.forEach((b, i) => {
    const pct = pctOf(b.numerator, b.denominator);
    const cx = plotX + groupW * i + groupW / 2;
    const x = cx - barW / 2;
    const barH = (pct / axisMax) * plotH;
    const y = plotY + plotH - barH;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${roleColor[b.role]}"/>\n`;

    const yVal = clampAboveLine(y - 14);
    svg += `<text x="${cx}" y="${yVal}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${fmt1(pct)}%</text>\n`;
    const yNum = clampAboveLine(yVal - 24);
    svg += `<text x="${cx}" y="${yNum}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${b.numerator}/${b.denominator}</text>\n`;
    if (b.killed) {
      const yKilled = clampAboveLine(yNum - 20);
      svg += `<text x="${cx}" y="${yKilled}" text-anchor="middle" fill="${C.critical}" font-size="22" font-weight="700">KILLED</text>\n`;
    }
    const labLines = wrap(b.label, barW + 30, 22);
    const labY = plotY + plotH + 34;
    svg += `<text x="${cx}" y="${labY}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">${tspans(labLines, cx, labY, 27)}</text>\n`;
  });

  // kill-line label, placed at the LEFT end, below the line — the right end
  // sits over G0h's bar top, and the line's own height sits close under
  // G0h's bar labels, so anything pinned "above, right" collides with one
  // or the other. Left end, below the line, stays clear of both.
  svg += `<text x="${plotX}" y="${killY + 26}" text-anchor="start" fill="${C.critical}" font-size="22" font-weight="600">${esc(d.killLine.label)} (${fmt1(d.killLine.pct)}%)</text>\n`;

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 3. d4-top3.svg — G0 vs G0h, paired @1 / @3
// ---------------------------------------------------------------------------
function buildD4Top3(d) {
  let svg = svgOpen();

  const plotX = 90;
  const plotY = 40;
  const plotW = W - plotX - 260; // room for legend at right
  const plotH = 280;
  const axisMax = 100;

  for (let v = 0; v <= 100; v += 20) {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  }
  svg += `<line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  const groupW = plotW / d.groups.length;
  const barW = 100;
  const barGap = 20;

  d.groups.forEach((g, gi) => {
    const groupCx = plotX + groupW * gi + groupW / 2;
    const startX = groupCx - (barW * 2 + barGap) / 2;
    const pairs = [
      { key: 'g0', color: C.blue, data: g.g0 },
      { key: 'g0h', color: C.orange, data: g.g0h },
    ];
    let tops = [];
    pairs.forEach((p, pi) => {
      const pct = pctOf(p.data.numerator, p.data.denominator);
      const x = startX + pi * (barW + barGap);
      const barH = (pct / axisMax) * plotH;
      const y = plotY + plotH - barH;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${p.color}"/>\n`;
      let yHi = y;
      if (p.data.ciLo != null) {
        const yLo = plotY + plotH - (p.data.ciLo / axisMax) * plotH;
        yHi = plotY + plotH - (p.data.ciHi / axisMax) * plotH;
        const cx = x + barW / 2;
        svg += `<line x1="${cx}" y1="${yLo}" x2="${cx}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
        svg += `<line x1="${cx - 7}" y1="${yLo}" x2="${cx + 7}" y2="${yLo}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
        svg += `<line x1="${cx - 7}" y1="${yHi}" x2="${cx + 7}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.55"/>\n`;
      }
      const labelTop = Math.min(y, yHi);
      svg += `<text x="${x + barW / 2}" y="${labelTop - 12}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(pct)}%</text>\n`;
      tops.push(labelTop);
    });
    // delta callout above the pair
    const deltaY = Math.min(...tops) - 40;
    svg += `<text x="${groupCx}" y="${deltaY}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(g.delta)}</text>\n`;
    svg += `<text x="${groupCx}" y="${plotY + plotH + 36}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(g.label)}</text>\n`;
  });

  // legend, top-right
  const legX = plotX + plotW + 40;
  let legY = 60;
  const legendSeries = [
    [C.blue, 'G0 — flat, no head'],
    [C.orange, 'G0h — flat + language head'],
  ];
  for (const [color, label] of legendSeries) {
    svg += `<rect x="${legX}" y="${legY - 18}" width="22" height="22" rx="3" fill="${color}"/>\n`;
    const lines = wrap(label, 190, 20);
    svg += `<text x="${legX + 32}" y="${legY}" fill="${C.textSecondary}" font-size="22">${tspans(lines, legX + 32, legY, 25)}</text>\n`;
    legY += 25 * lines.length + 24;
  }

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 4. jitter-drops.svg — step-down bars on a LINEAR per-100 axis, two lever
// callouts in the headroom above the plot. 0.14 stays on the same linear
// scale as 35.8/15.4 on purpose (it is supposed to look like almost
// nothing) but gets an explicit value + "about 1 in 700" note so it never
// reads as zero.
// ---------------------------------------------------------------------------
function buildJitterDrops(d) {
  let svg = svgOpen();
  svg += `<defs>
    <marker id="jitter-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="${C.textMuted}"/>
    </marker>
  </defs>\n`;

  const roleColor = { baseline: C.blue, context: C.grey, after: C.orange };

  const plotX = 90;
  const plotY = 100;
  const plotW = W - plotX - 40;
  const plotH = 220;
  const axisMax = d.axisMax;

  const ticks = [0, 10, 20, 30, 40].filter((v) => v <= axisMax);
  ticks.forEach((v) => {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}</text>\n`;
  });
  svg += `<text x="${plotX}" y="${plotY - 34}" fill="${C.textMuted}" font-size="22">${esc(d.unit)}</text>\n`;

  const n = d.bars.length;
  const groupW = plotW / n;
  const barW = 150;
  const centers = [];

  d.bars.forEach((b, i) => {
    const cx = plotX + groupW * i + groupW / 2;
    centers.push(cx);
    const x = cx - barW / 2;
    // Minimum-height floor so the 0.14 bar stays a visible sliver rather
    // than vanishing at this scale — the LABEL, not a log axis, is what
    // makes the number legible (per the brief).
    const barH = Math.max(1.5, (b.value / axisMax) * plotH);
    const y = plotY + plotH - barH;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${roleColor[b.role]}"/>\n`;

    const valTxt = b.value < 1 ? b.value.toFixed(2) : fmt1(b.value);
    svg += `<text x="${cx}" y="${y - 14}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(valTxt)}</text>\n`;
    if (b.note) {
      svg += `<text x="${cx}" y="${y - 40}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${esc(b.note)}</text>\n`;
    }

    const labLines = wrap(b.label, groupW - 10, 22);
    const labY = plotY + plotH + 34;
    svg += `<text x="${cx}" y="${labY}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">${tspans(labLines, cx, labY, 27)}</text>\n`;
  });

  svg += `<line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  // lever annotations, one per gap between consecutive bars, in the
  // headroom above the plot — clear of both the axis-unit label and every
  // bar's value label (which sit at/below plotY).
  const leverY = 46;
  const arrowY = 72;
  (d.levers || []).forEach((lv, i) => {
    const cx0 = centers[i];
    const cx1 = centers[i + 1];
    const mx = (cx0 + cx1) / 2;
    svg += `<text x="${mx}" y="${leverY}" text-anchor="middle" fill="${C.textSecondary}" font-size="22" font-weight="600">${esc(lv.label)}</text>\n`;
    svg += `<line x1="${cx0 + barW / 2 + 10}" y1="${arrowY}" x2="${cx1 - barW / 2 - 10}" y2="${arrowY}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#jitter-arrow)"/>\n`;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 5. d4-slope.svg — slopegraph, top-1 -> top-3, for G0 and G0h. The gap between
// the two series is labelled at each end column ("the gain halves").
// ---------------------------------------------------------------------------
// Slide 13 runs d4-slope.svg and lot-bar.svg side by side in two 556x440
// boxes (coordinator, 2026-09-24) — half the standard chart width, same
// height. Every offset below is sized for that box, not derived from the
// deck-wide W/H constants.
const SLOPE_W = 556;
const SLOPE_H = 440;

function buildD4Slope(d) {
  let svg = svgOpen(SLOPE_W, SLOPE_H);

  const roleColor = { baseline: C.blue, after: C.orange };

  // No drawn axis/gridlines here (unlike the other bar/dot charts): at
  // 556px wide there isn't room for both a left tick-label column ("100%"
  // etc.) and the outward value labels beside col0 without the two
  // colliding, and a slopegraph's points are already directly labeled, so
  // the axis is redundant. The 0-100 scale is still used for the y mapping
  // (unstated but implied — same scale as every other top-1/top-3 chart in
  // the deck), just not drawn.
  const plotY = 110;
  const plotH = 250;
  const axisMax = 100;
  const marginSide = 130; // room for the outward value label + its gap
  const colX = [marginSide, SLOPE_W - marginSide];
  const yOf = (pct) => plotY + plotH - (pct / axisMax) * plotH;

  const seriesPts = d.series.map((s) => ({
    ...s,
    pts: s.points.map((p) => pctOf(p.numerator, p.denominator)),
  }));

  seriesPts.forEach((s) => {
    const y0 = yOf(s.pts[0]);
    const y1 = yOf(s.pts[1]);
    svg += `<line x1="${colX[0]}" y1="${y0}" x2="${colX[1]}" y2="${y1}" stroke="${roleColor[s.role]}" stroke-width="3"/>\n`;
    svg += `<circle cx="${colX[0]}" cy="${y0}" r="9" fill="${roleColor[s.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
    svg += `<circle cx="${colX[1]}" cy="${y1}" r="9" fill="${roleColor[s.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
  });

  // Endpoint value labels sit OUTWARD of the plot (left of col0, right of
  // col1) so they never contest the gap labels, which sit inward. At top-3
  // the two series are only ~12px apart — too close for both labels to use
  // a fixed same-side offset from their own dot without touching — so each
  // column ranks its two points by y and staggers the label of the LOWER
  // one further down, clear of the upper one, regardless of the raw gap.
  [0, 1].forEach((col) => {
    const ranked = seriesPts
      .map((s) => ({ s, y: yOf(s.pts[col]) }))
      .sort((a, b) => a.y - b.y); // ascending: top of chart first
    const anchor = col === 0 ? 'end' : 'start';
    const lx = col === 0 ? colX[0] - 18 : colX[1] + 18;
    svg += `<text x="${lx}" y="${ranked[0].y - 10}" text-anchor="${anchor}" fill="${C.textPrimary}" font-size="24" font-weight="700">${ranked[0].s.pts[col].toFixed(2)}%</text>\n`;
    svg += `<text x="${lx}" y="${ranked[1].y + 26}" text-anchor="${anchor}" fill="${C.textPrimary}" font-size="24" font-weight="700">${ranked[1].s.pts[col].toFixed(2)}%</text>\n`;
  });

  d.columns.forEach((label, i) => {
    svg += `<text x="${colX[i]}" y="${plotY + plotH + 40}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${esc(label)}</text>\n`;
  });

  // gap labels, one per column, placed INWARD (toward the other column) at
  // the vertical midpoint between the two series' points at that column. In
  // the half-width box the two columns are only ~226px apart, so a short
  // form ("+9.95", no "pts" suffix — matching d4-top3.svg's own delta
  // convention) and a tight inward offset keep the two labels from
  // colliding with each other in the middle.
  d.gaps.forEach((g, gi) => {
    const x = colX[gi];
    const ys = seriesPts.map((s) => yOf(s.pts[gi]));
    const midY = (ys[0] + ys[1]) / 2;
    const inward = gi === 0 ? 1 : -1;
    const lx = x + inward * 14;
    const anchor = gi === 0 ? 'start' : 'end';
    svg += `<text x="${lx}" y="${midY + 8}" text-anchor="${anchor}" fill="${C.textSecondary}" font-size="24" font-weight="700">${esc(g.delta)}</text>\n`;
  });

  // legend, stacked (two rows — the box is too narrow for a single row of
  // both series' full labels), then the note below both rows.
  const legX = 24;
  let legY = 22;
  seriesPts.forEach((s) => {
    svg += `<rect x="${legX}" y="${legY - 15}" width="18" height="18" rx="3" fill="${roleColor[s.role]}"/>\n`;
    svg += `<text x="${legX + 26}" y="${legY}" fill="${C.textSecondary}" font-size="22">${esc(s.label)}</text>\n`;
    legY += 26;
  });

  if (d.note) {
    svg += `<text x="${SLOPE_W / 2}" y="${legY + 12}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${esc(d.note)}</text>\n`;
  }

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 6. top3-measures.svg — four separate yardsticks, one strip, never joined
//    (except the before→after pair inside its own lane)
// ---------------------------------------------------------------------------
function buildTop3Measures(d) {
  let svg = svgOpen();

  const roleColor = { baseline: C.blue, after: C.orange, context: C.grey };

  const plotX = 320;
  const plotXEnd = W - 40;
  const plotW = plotXEnd - plotX;
  const axisTop = 30;
  const axisBottom = 370;
  const rows = d.lanes.length;
  const rowH = (axisBottom - axisTop) / rows;

  const xOf = (pct) => plotX + (pct / 100) * plotW;

  // shared gridlines
  [0, 25, 50, 75, 100].forEach((v) => {
    const x = xOf(v);
    svg += `<line x1="${x}" y1="${axisTop}" x2="${x}" y2="${axisBottom}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${x}" y="${axisBottom + 30}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  });
  svg += `<line x1="${plotX}" y1="${axisBottom}" x2="${plotXEnd}" y2="${axisBottom}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  d.lanes.forEach((lane, i) => {
    const rowCy = axisTop + rowH * i + rowH / 2;
    const laneLines = wrap(lane.label, plotX - 40, 24);
    const labY = rowCy - ((laneLines.length - 1) * 14);
    svg += `<text x="${plotX - 24}" y="${labY}" text-anchor="end" fill="${C.textPrimary}" font-size="24" font-weight="600">${tspans(laneLines, plotX - 24, labY, 28)}</text>\n`;

    if (lane.points.length === 2 && lane.role === 'before-after') {
      const [p0, p1] = lane.points;
      const x0 = xOf(p0.pct);
      const x1 = xOf(p1.pct);
      svg += `<line x1="${x0}" y1="${rowCy}" x2="${x1}" y2="${rowCy}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#top3-arrow)"/>\n`;
      svg += `<circle cx="${x0}" cy="${rowCy}" r="9" fill="${roleColor[p0.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<circle cx="${x1}" cy="${rowCy}" r="9" fill="${roleColor[p1.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<text x="${x0}" y="${rowCy - 18}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(p0.pct)}%</text>\n`;
      svg += `<text x="${x1}" y="${rowCy - 18}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(p1.pct)}%</text>\n`;
    } else {
      // Multiple points in one lane that are NOT a before/after pair (e.g.
      // "live lots": pooled vs non-locked) can sit close together on the
      // shared 0-100 axis. Stagger each point's dot and label vertically
      // within the row so their (wide) text labels never collide, even when
      // their x positions are only a few points apart.
      const multi = lane.points.length > 1;
      lane.points.forEach((pt, pi) => {
        const pct = pt.pct != null ? pt.pct : pctOf(pt.numerator, pt.denominator);
        const x = xOf(pct);
        const dotY = multi ? rowCy + (pi === 0 ? -18 : 18) : rowCy;
        svg += `<circle cx="${x}" cy="${dotY}" r="9" fill="${roleColor[lane.role] || C.grey}" stroke="${C.surface}" stroke-width="2"/>\n`;
        const frac = pt.numerator != null ? ` (${pt.numerator}/${pt.denominator})` : '';
        const valTxt = `${fmt1(pct)}%${pt.label ? ' ' + pt.label : ''}${frac}`;
        svg += `<text x="${x}" y="${dotY - 16}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${esc(valTxt)}</text>\n`;
      });
    }
  });

  svg = svg.replace(
    '<rect x="0" y="0"',
    `<defs><marker id="top3-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="${C.textMuted}"/></marker></defs>\n<rect x="0" y="0"`
  );

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 7. lot-bar.svg — stat tiles + day-dot panel, labelled "all lots, by day"
// ---------------------------------------------------------------------------
// Slide 13 runs lot-bar.svg and d4-slope.svg side by side in two 556x440
// boxes (coordinator, 2026-09-24). lot-bar.svg now carries only the three
// stat tiles, stacked (a 3-across row does not fit a 556-wide box at
// text >= 24px); the day-dot panel moves to its own full-width chart,
// lot-days.svg, kept as backup/appendix material.
function buildLotBar(d) {
  let svg = svgOpen(SLOPE_W, SLOPE_H);

  const tileX = 40;
  const tileW = SLOPE_W - 80;
  const tileH = 118;
  const gap = 24;
  const topY = 26;

  d.tiles.forEach((tile, i) => {
    const y = topY + i * (tileH + gap);
    const pct = pctOf(tile.numerator, tile.denominator);
    svg += `<rect x="${tileX}" y="${y}" width="${tileW}" height="${tileH}" rx="8" fill="${C.grid}" opacity="0.45"/>\n`;
    svg += `<text x="${tileX + 20}" y="${y + 28}" fill="${C.textMuted}" font-size="22">${tspans(wrap(tile.label, tileW - 40, 22), tileX + 20, y + 28, 26)}</text>\n`;
    svg += `<text x="${tileX + 20}" y="${y + 76}" fill="${C.blue}" font-size="38" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${tileX + 20}" y="${y + 100}" fill="${C.textMuted}" font-size="22">${tile.numerator}/${tile.denominator}, CI ${fmt1(tile.ciLo)}–${fmt1(tile.ciHi)}</text>\n`;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// lot-days.svg — the day-dot panel split out of lot-bar.svg (backup/appendix
// use at full 1136x440 width). Same "all lots" reference line and per-dot
// label-position logic as before.
// ---------------------------------------------------------------------------
function buildLotDays(d) {
  let svg = svgOpen();

  const overallPct = pctOf(d.overall.numerator, d.overall.denominator);
  const titleY = 44;
  svg += `<text x="40" y="${titleY}" fill="${C.textPrimary}" font-size="26" font-weight="700">all lots, by day <tspan fill="${C.textSecondary}" font-size="22" font-weight="600">— dashed line: all lots ${fmt1(overallPct)}%</tspan></text>\n`;

  const plotX = 90;
  const plotY = titleY + 50;
  const plotW = W - plotX - 40;
  const plotH = 300;
  const axisMax = 100;

  [0, 25, 50, 75, 100].forEach((v) => {
    const y = plotY + plotH - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 6}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  });

  const yOverall = plotY + plotH - (overallPct / axisMax) * plotH;
  svg += `<line x1="${plotX}" y1="${yOverall}" x2="${plotX + plotW}" y2="${yOverall}" stroke="${C.textSecondary}" stroke-width="2" stroke-dasharray="7,7"/>\n`;

  const pts = d.dotplot.points;
  const slotW = plotW / (pts.length + 1);
  // Each dot gets its own label position: default just above the dot, but
  // pushed further up whenever the dot itself sits close to the dashed
  // "all lots" line, so its label never lands on top of the line.
  pts.forEach((pt, i) => {
    const pct = pctOf(pt.numerator, pt.denominator);
    const w = wilson(pt.numerator, pt.denominator);
    const x = plotX + slotW * (i + 1);
    const y = plotY + plotH - (pct / axisMax) * plotH;
    const yLo = plotY + plotH - (w.lo / axisMax) * plotH;
    const yHi = plotY + plotH - (w.hi / axisMax) * plotH;
    const nearLine = Math.abs(y - yOverall) < 24;
    const labelY = y + (nearLine ? -34 : -16);
    svg += `<line x1="${x}" y1="${yLo}" x2="${x}" y2="${yHi}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.4"/>\n`;
    svg += `<circle cx="${x}" cy="${y}" r="9" fill="${C.orange}" stroke="${C.surface}" stroke-width="2"/>\n`;
    svg += `<text x="${x}" y="${labelY}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${x}" y="${plotY + plotH + 30}" text-anchor="middle" fill="${C.textSecondary}" font-size="22">${esc(pt.day)}</text>\n`;
  });

  svg += `<line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 8. f-two-levers.svg — linear seconds axis, hand vs stacked agent+review
// ---------------------------------------------------------------------------
function buildTwoLevers(d) {
  let svg = svgOpen();
  svg += `<defs>${hatchDef('hatch-hand', C.blue, '#0d2a52')}</defs>\n`;

  const plotX = 300;
  const plotXEnd = W - 40;
  const plotW = plotXEnd - plotX;
  const axisMin = 0;
  const axisMax = 200;
  const xOf = (v) => plotX + ((v - axisMin) / (axisMax - axisMin)) * plotW;

  const axisY = 400;
  [0, 50, 100, 150, 200].forEach((v) => {
    const x = xOf(v);
    svg += `<line x1="${x}" y1="40" x2="${x}" y2="${axisY}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${x}" y="${axisY + 30}" text-anchor="middle" fill="${C.textMuted}" font-size="22">${v}s</text>\n`;
  });
  svg += `<line x1="${plotX}" y1="${axisY}" x2="${plotXEnd}" y2="${axisY}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  const barThick = 64;

  // Bar A — by hand, hatched blue to mark founder testimony (D7)
  const yA = 130;
  const a = d.barA;
  svg += `<text x="${plotX - 24}" y="${yA + 8}" text-anchor="end" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(a.label)}</text>\n`;
  svg += `<rect x="${xOf(0)}" y="${yA - barThick / 2}" width="${xOf(a.high) - xOf(0)}" height="${barThick}" rx="4" fill="url(#hatch-hand)" stroke="${C.blue}" stroke-width="2"/>\n`;
  svg += `<text x="${xOf(a.high) + 16}" y="${yA + 9}" fill="${C.textPrimary}" font-size="28" font-weight="700">${a.high}${a.unit}</text>\n`;
  svg += `<text x="${xOf(0)}" y="${yA + barThick / 2 + 26}" fill="${C.textMuted}" font-size="22">founder testimony — not instrumented</text>\n`;

  // Bar B — with agents: stacked agent-pass + human-review, midpoints for
  // the stack geometry, a whisker bracket for the honest total range.
  const yB = 280;
  const b = d.barB;
  const [seg1, seg2] = b.segments;
  const mid1 = (seg1.low + seg1.high) / 2;
  const mid2 = (seg2.low + seg2.high) / 2;
  const stackEnd1 = mid1;
  const stackEnd2 = mid1 + mid2;

  svg += `<text x="${plotX - 24}" y="${yB + 8}" text-anchor="end" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(b.label)}</text>\n`;

  svg += `<rect x="${xOf(0)}" y="${yB - barThick / 2}" width="${xOf(stackEnd1) - xOf(0)}" height="${barThick}" fill="${C.orange}"/>\n`;
  svg += `<rect x="${xOf(stackEnd1) + 2}" y="${yB - barThick / 2}" width="${Math.max(0, xOf(stackEnd2) - xOf(stackEnd1) - 2)}" height="${barThick}" fill="${C.orange}" opacity="0.62"/>\n`;
  svg += `<rect x="${xOf(0)}" y="${yB - barThick / 2}" width="${xOf(stackEnd2) - xOf(0)}" height="${barThick}" fill="none" stroke="${C.orange}" stroke-width="2" rx="4"/>\n`;

  // total-range whisker bracket at the stack's end
  const xLoT = xOf(b.totalLow);
  const xHiT = xOf(b.totalHigh);
  const whiskerY = yB - barThick / 2 - 14;
  svg += `<line x1="${xLoT}" y1="${whiskerY}" x2="${xHiT}" y2="${whiskerY}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.6"/>\n`;
  svg += `<line x1="${xLoT}" y1="${whiskerY - 6}" x2="${xLoT}" y2="${whiskerY + 6}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.6"/>\n`;
  svg += `<line x1="${xHiT}" y1="${whiskerY - 6}" x2="${xHiT}" y2="${whiskerY + 6}" stroke="${C.textPrimary}" stroke-width="2" opacity="0.6"/>\n`;

  svg += `<text x="${xOf(stackEnd2) + 16}" y="${yB + 9}" fill="${C.textPrimary}" font-size="28" font-weight="700">${b.totalLow}–${b.totalHigh}${seg1.unit} total</text>\n`;

  // Bar B's two segments are narrow in pixels (11-46s on a 0-200s axis), so
  // their labels are stacked as short lines below the bar rather than
  // pinned to each segment's own (often-overlapping) x position. Full
  // evidence-class attribution (tierLabel) stays in the JSON for the deck's
  // notes; the chart itself carries a short, ≥22px tag.
  const segTag = (tl) => (/^instrumented/.test(tl) ? 'instrumented, E84' : 'founder estimate — not instrumented');
  const segLabelY1 = yB + barThick / 2 + 26;
  const segLabelY2 = segLabelY1 + 28;
  svg += `<text x="${xOf(0)}" y="${segLabelY1}" fill="${C.textSecondary}" font-size="22" font-weight="600">${esc(seg1.label)}: ${seg1.low}–${seg1.high}${seg1.unit} (${segTag(seg1.tierLabel)})</text>\n`;
  svg += `<text x="${xOf(0)}" y="${segLabelY2}" fill="${C.textSecondary}" font-size="22" font-weight="600">${esc(seg2.label)}: ${seg2.low}–${seg2.high}${seg2.unit} (${segTag(seg2.tierLabel)})</text>\n`;

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 9. e-lane-dag.svg — coordinator pattern: tiers, reviewer-above arrows,
//    3-5 real lanes from this repo. No commit hashes.
// ---------------------------------------------------------------------------
function buildLaneDag(d) {
  let svg = svgOpen();

  const tierColor = { haiku: C.blue, sonnet: C.orange, opus: C.green, fable: C.green, root: C.textMuted };
  svg += `<defs>${hatchDef('hatch-fable', C.green, '#0f3b2c')}
    <marker id="dag-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="${C.textMuted}"/>
    </marker></defs>\n`;

  const tierY = { fable: 60, opus: 150, sonnet: 240, haiku: 330 };
  const mainNode = { x: 1055, y: 390 };

  Object.entries(d.tierLabels).forEach(([tier, label]) => {
    if (tierY[tier] == null) return;
    // The row label is the tier name only (e.g. "Fable"); the full label
    // (e.g. "Fable — coordinator") is reserved for the legend below, where
    // there is room for the full text without clipping the canvas edge.
    const shortLabel = label.split('—')[0].trim();
    svg += `<text x="80" y="${tierY[tier] + 6}" text-anchor="end" fill="${C.textMuted}" font-size="22">${esc(shortLabel)}</text>\n`;
    svg += `<line x1="92" y1="${tierY[tier]}" x2="${W - 40}" y2="${tierY[tier]}" stroke="${C.grid}" stroke-width="1" stroke-dasharray="2,4"/>\n`;
  });

  // Lanes, one column per chain of edges that ends at main — derived from
  // the edge graph itself (never hard-coded), so two nodes on the same
  // tier (e.g. two Sonnet mining lanes reviewed by two different Opus
  // lanes) get their own columns instead of silently overlapping.
  const hasIncoming = new Set(d.edges.filter((e) => e.to !== 'main').map((e) => e.to));
  const nextOf = {};
  d.edges.forEach((e) => { if (e.to !== 'main') nextOf[e.from] = e.to; });
  const laneRoots = d.nodes.filter((n) => n.id !== 'main' && !hasIncoming.has(n.id)).map((n) => n.id);
  const laneOfId = {};
  laneRoots.forEach((root, i) => {
    let cur = root;
    while (cur) { laneOfId[cur] = i; cur = nextOf[cur]; }
  });
  // Consecutive lane columns must clear the node box width (210px) plus a
  // margin, in every tier row that holds more than one lane's node — Opus
  // is the tightest (3 lanes' review/synthesis boxes on one row).
  const laneMarginL = 220;
  const laneMarginR = 910;
  const laneX = laneRoots.map((_, i) =>
    laneRoots.length > 1 ? laneMarginL + (i * (laneMarginR - laneMarginL)) / (laneRoots.length - 1) : (laneMarginL + laneMarginR) / 2
  );

  const nodeById = { main: mainNode };
  d.nodes.forEach((node) => {
    if (node.id === 'main') return;
    nodeById[node.id] = { x: laneX[laneOfId[node.id]], y: tierY[node.tier] };
  });

  d.edges.forEach((e) => {
    const a = nodeById[e.from];
    const b = nodeById[e.to];
    svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#dag-arrow)"/>\n`;
  });

  svg += `<rect x="${mainNode.x - 58}" y="${mainNode.y - 22}" width="116" height="44" rx="8" fill="${C.surface}" stroke="${C.textPrimary}" stroke-width="2"/>\n`;
  svg += `<text x="${mainNode.x}" y="${mainNode.y + 6}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">main</text>\n`;

  d.nodes.forEach((node) => {
    if (node.id === 'main') return;
    const { x, y } = nodeById[node.id];
    const fill = node.tier === 'fable' ? 'url(#hatch-fable)' : tierColor[node.tier];
    const boxW = 210;
    const lines = wrap(node.label, boxW - 24, 22);
    const boxH = lines.length > 1 ? 56 : 44;
    svg += `<rect x="${x - boxW / 2}" y="${y - boxH / 2}" width="${boxW}" height="${boxH}" rx="8" fill="${fill}" stroke="${C.surface}" stroke-width="3"/>\n`;
    const ty = y + (lines.length > 1 ? -3 : 7);
    svg += `<text x="${x}" y="${ty}" text-anchor="middle" fill="${C.textPrimary}" font-size="22" font-weight="700">${tspans(lines, x, ty, 24)}</text>\n`;
  });

  // legend
  let lx = 92;
  const ly = H - 14;
  svg += `<text x="${lx}" y="${ly - 20}" fill="${C.textMuted}" font-size="22">tier — the reviewer sits one tier above the implementer</text>\n`;
  d.tierOrder.forEach((tier) => {
    const fill = tier === 'fable' ? 'url(#hatch-fable)' : tierColor[tier];
    svg += `<rect x="${lx}" y="${ly - 6}" width="22" height="22" rx="3" fill="${fill}"/>\n`;
    svg += `<text x="${lx + 30}" y="${ly + 11}" fill="${C.textSecondary}" font-size="22">${esc(d.tierLabels[tier])}</text>\n`;
    lx += 195;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------

const charts = [
  ['b-four-acts', buildFourActs],
  ['d4-arms', buildD4Arms],
  ['d4-top3', buildD4Top3],
  ['d4-slope', buildD4Slope],
  ['top3-measures', buildTop3Measures],
  ['lot-bar', buildLotBar],
  ['lot-days', buildLotDays],
  ['jitter-drops', buildJitterDrops],
  ['f-two-levers', buildTwoLevers],
  ['e-lane-dag', buildLaneDag],
];

// The remembered-vs-recorded section is cut (D16, structure v2) — its two
// charts and their JSON are deleted. Warn if a stale copy is still on disk
// (e.g. from an unclean worktree) rather than silently leaving it behind.
// A prior revision before that also drew a single combined table under this
// name; both are handled the same way.
for (const stale of ['remembered-vs-recorded.svg', 'rvr-memory.svg', 'rvr-counter.svg']) {
  const stalePath = path.join(OUT_DIR, stale);
  if (existsSync(stalePath)) {
    console.log(`note: stale ${path.relative(process.cwd(), stalePath)} still on disk — delete it manually`);
  }
}

for (const [name, fn] of charts) {
  const data = readJSON(name);
  const svg = fn(data);
  const outPath = path.join(OUT_DIR, `${name}.svg`);
  writeFileSync(outPath, svg, 'utf8');
  console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
}
