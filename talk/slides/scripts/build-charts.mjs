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
// Every label is >= 24px; axis ticks and small tags >= 20px.
//
// Colour meaning, ONE per hue across EVERY asset, charts and diagrams alike
// (fix/visuals F1, 2026-09-24):
//   blue   = before / baseline
//   orange = after / intervention (and the one accent on a stat row)
//   green  = method / gate (a reviewer, a gate, a pre-registered rule)
//   grey   = context / rails (a measurement that is neither, an implementer)
// Stat tiles are never blue. Status red is a text tag only ("dropped", the pass/fail bar).
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
  critical: '#e66767', // status red — text/icon tag only (e.g. "dropped"), never a fill
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

// Accessible name + description, never drawn: <title> is the JSON's `title`,
// <desc> is its `desc` (what the chart shows, in words) plus `Source: ` and
// its `source` field, so every chart cites where its numbers come from.
function svgOpen(d = {}, w = W, h = H) {
  const title = d.title ? `<title id="t">${esc(d.title)}</title>\n` : '';
  const descText = [d.desc, d.source ? `Source: ${d.source}` : ''].filter(Boolean).join(' ');
  const desc = descText ? `<desc id="d">${esc(descText)}</desc>\n` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ` +
    `role="img" aria-labelledby="t d" font-family='${FONT}'>\n` +
    title +
    desc +
    `<rect x="0" y="0" width="${w}" height="${h}" fill="${C.surface}"/>\n`
  );
}
const svgClose = '</svg>\n';

// 45deg hatch, used ONLY as the texture channel (never a colour substitute):
// here, to mark my testimony (an unmeasured figure) apart from an
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
  let svg = svgOpen(d);

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
    // grey = context/rails: an act is neither a before nor an after
    svg += `<circle cx="${cx}" cy="${railY}" r="27" fill="${C.grey}" stroke="${C.surface}" stroke-width="4"/>\n`;
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
// 2. d4-arms.svg — three bars @1: G0, G3 (dropped), G0h, plus the pass/fail bar
// ---------------------------------------------------------------------------
function buildD4Arms(d) {
  let svg = svgOpen(d);

  const roleColor = { baseline: C.blue, context: C.grey, after: C.orange };

  // Plot on the left, a 250px gutter on the right for the pass/fail-bar label:
  // at the line's own height, clear of every bar and every bar's labels
  // (critique2 F1: the label used to run across the G0 bar).
  const plotX = 90;
  const plotY = 36;
  const gutter = 250;
  const plotW = W - plotX - gutter;
  const plotH = 250;
  const axisMax = 100;
  const yOf = (pct) => plotY + plotH - (pct / axisMax) * plotH;

  for (let v = 0; v <= 100; v += 20) {
    const y = yOf(v);
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  }

  const n = d.bars.length;
  const groupW = plotW / n;
  const barW = 150;

  // pass/fail bar, drawn under the bars so bar fills sit on top of it
  const killY = yOf(d.killLine.pct);
  svg += `<line x1="${plotX}" y1="${killY}" x2="${plotX + plotW + 10}" y2="${killY}" stroke="${C.critical}" stroke-width="2" stroke-dasharray="8,6"/>\n`;

  d.bars.forEach((b, i) => {
    const pct = pctOf(b.numerator, b.denominator);
    const cx = plotX + groupW * i + groupW / 2;
    const x = cx - barW / 2;
    const y = yOf(pct);
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${plotY + plotH - y}" rx="4" fill="${roleColor[b.role]}"/>\n`;

    // Value + count sit INSIDE the bar top, so nothing floats between a
    // short bar and the pass/fail bar above it.
    svg += `<text x="${cx}" y="${y + 36}" text-anchor="middle" fill="${C.textPrimary}" font-size="28" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${cx}" y="${y + 66}" text-anchor="middle" fill="${C.textPrimary}" font-size="22">${b.numerator} of ${b.denominator}</text>\n`;

    // explicit line breaks from the JSON when given, so a long plain-words
    // label breaks where it reads well rather than where the wrap lands
    const labLines = b.lines || wrap(b.label, groupW - 16, 24);
    const labY = plotY + plotH + 34;
    svg += `<text x="${cx}" y="${labY}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${tspans(labLines, cx, labY, 28)}</text>\n`;

    // Small tags under the arm's name: the dropped status (status red, text
    // only) and the post-hoc honesty tag on G0h (arc A: found afterwards).
    let tagY = labY + 28 * (labLines.length - 1) + 32;
    if (b.dropped) {
      svg += `<text x="${cx}" y="${tagY}" text-anchor="middle" fill="${C.critical}" font-size="22" font-weight="700">${esc(b.status || 'dropped')}</text>\n`;
      tagY += 26;
    }
    (b.tag || []).forEach((t) => {
      svg += `<text x="${cx}" y="${tagY}" text-anchor="middle" fill="${C.textSecondary}" font-size="22">${esc(t)}</text>\n`;
      tagY += 26;
    });
  });

  // pass/fail-bar label in the right gutter, centred on the line's height
  const kl = d.killLine.lines.map((l) => l.replace('{pct}', `${fmt1(d.killLine.pct)}%`));
  const klX = plotX + plotW + 24;
  const klY0 = killY - ((kl.length - 1) * 28) / 2 + 8;
  svg += `<text x="${klX}" y="${klY0}" fill="${C.critical}" font-size="24" font-weight="600">${tspans(kl, klX, klY0, 28)}</text>\n`;

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 3. d4-top3.svg — G0 vs G0h, paired @1 / @3
// ---------------------------------------------------------------------------
function buildD4Top3(d) {
  let svg = svgOpen(d);

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
  let svg = svgOpen(d);
  svg += `<defs>
    <marker id="jitter-arrow" viewBox="0 0 12 12" markerWidth="9" markerHeight="9" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M2,2 L10,6 L2,10" fill="none" stroke="${C.textMuted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="jitter-pointer" viewBox="0 0 12 12" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M2,2 L10,6 L2,10" fill="none" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>\n`;

  const roleColor = { baseline: C.blue, context: C.grey, after: C.orange };

  const plotX = 90;
  const plotY = 100;
  const plotW = W - plotX - 40;
  const plotH = 200;
  const axisMax = d.axisMax;
  const base = plotY + plotH;

  const ticks = [0, 10, 20, 30, 40].filter((v) => v <= axisMax);
  ticks.forEach((v) => {
    const y = base - (v / axisMax) * plotH;
    svg += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${plotX - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}</text>\n`;
  });
  svg += `<text x="${plotX}" y="${plotY - 34}" fill="${C.textMuted}" font-size="22">${esc(d.unit)}</text>\n`;

  const n = d.bars.length;
  const groupW = plotW / n;
  const barW = 150;
  const centers = [];
  // A tiny value (0.14 on a 0-40 scale is ~0.7px) gets a visible floor so the
  // hero bar has ink, plus an orange pointer from its label down to the bar
  // (critique2 F1). The floor is a drawing minimum, not a data value: the
  // label always states the true number.
  const MIN_BAR_PX = 6;

  d.bars.forEach((b, i) => {
    const cx = plotX + groupW * i + groupW / 2;
    centers.push(cx);
    const x = cx - barW / 2;
    const trueH = (b.value / axisMax) * plotH;
    const tiny = trueH < MIN_BAR_PX;
    const barH = Math.max(MIN_BAR_PX, trueH);
    const y = base - barH;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${roleColor[b.role]}"/>\n`;

    const valTxt = b.value < 1 ? b.value.toFixed(2) : fmt1(b.value);
    if (tiny) {
      // pointer: label ~60px above the bar, a short orange arrow down to it
      const valY = y - 62;
      svg += `<line x1="${cx}" y1="${valY + 12}" x2="${cx}" y2="${y - 8}" stroke="${C.orange}" stroke-width="2.5" marker-end="url(#jitter-pointer)"/>\n`;
      svg += `<text x="${cx}" y="${valY}" text-anchor="middle" fill="${C.textPrimary}" font-size="30" font-weight="700">${esc(valTxt)}</text>\n`;
      if (b.note) {
        svg += `<text x="${cx}" y="${valY - 44}" text-anchor="middle" fill="${C.textSecondary}" font-size="24">${esc(b.note)}</text>\n`;
      }
    } else {
      svg += `<text x="${cx}" y="${y - 14}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(valTxt)}</text>\n`;
      if (b.note) {
        svg += `<text x="${cx}" y="${y - 52}" text-anchor="middle" fill="${C.textSecondary}" font-size="24">${esc(b.note)}</text>\n`;
      }
    }

    const labLines = wrap(b.label, groupW - 20, 24);
    const labY = base + 34;
    svg += `<text x="${cx}" y="${labY}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" font-weight="700">${tspans(labLines, cx, labY, 29)}</text>\n`;
  });

  svg += `<line x1="${plotX}" y1="${base}" x2="${plotX + plotW}" y2="${base}" stroke="${C.baseline}" stroke-width="2"/>\n`;

  // lever annotations, one per gap between consecutive bars, in the
  // headroom above the plot — clear of the axis-unit label and every bar's
  // value label.
  const leverY = 40;
  const arrowY = 64;
  (d.levers || []).forEach((lv, i) => {
    const cx0 = centers[i];
    const cx1 = centers[i + 1];
    const mx = (cx0 + cx1) / 2;
    svg += `<text x="${mx}" y="${leverY}" text-anchor="middle" fill="${C.textSecondary}" font-size="24" font-weight="600">${esc(lv.label)}</text>\n`;
    svg += `<line x1="${cx0 + barW / 2 + 10}" y1="${arrowY}" x2="${cx1 - barW / 2 - 10}" y2="${arrowY}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#jitter-arrow)"/>\n`;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 5. d4-slope.svg — slopegraph, top-1 -> top-3, for G0 and G0h. The gap between
// the two series is labelled at each end column ("the gain halves").
// ---------------------------------------------------------------------------
// Slide 13 now runs d4-slope.svg alone at the full 1136x440 box, and slide
// 14 runs lot-bar.svg alone (critique2 final numbering, 2026-09-24).
function buildD4Slope(d) {
  let svg = svgOpen(d);

  const roleColor = { baseline: C.blue, after: C.orange };

  // Full 1136x440 box (critique2 F1: slide 13 is now this chart alone). The
  // y-axis is cropped to d.yRange (60-95%) so the halving of the gap is
  // visible; the tick labels say so, and each gap is stated as a number.
  const [yMin, yMax] = d.yRange;
  const plotY = 40;
  const plotH = 320;
  const gridX0 = 120;
  const gridX1 = W - 40;
  const colX = [400, 736];
  const yOf = (pct) => plotY + plotH - ((pct - yMin) / (yMax - yMin)) * plotH;

  for (let v = Math.ceil(yMin / 10) * 10; v <= yMax; v += 10) {
    const y = yOf(v);
    svg += `<line x1="${gridX0}" y1="${y}" x2="${gridX1}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${gridX0 - 14}" y="${y + 7}" text-anchor="end" fill="${C.textMuted}" font-size="22">${v}%</text>\n`;
  }

  const seriesPts = d.series.map((s) => ({
    ...s,
    pts: s.points.map((p) => pctOf(p.numerator, p.denominator)),
  }));

  seriesPts.forEach((s) => {
    const y0 = yOf(s.pts[0]);
    const y1 = yOf(s.pts[1]);
    svg += `<line x1="${colX[0]}" y1="${y0}" x2="${colX[1]}" y2="${y1}" stroke="${roleColor[s.role]}" stroke-width="3"/>\n`;
    svg += `<circle cx="${colX[0]}" cy="${y0}" r="10" fill="${roleColor[s.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
    svg += `<circle cx="${colX[1]}" cy="${y1}" r="10" fill="${roleColor[s.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
  });

  // Value labels sit OUTWARD of each column, level with their own dot.
  const valOff = 22;
  [0, 1].forEach((col) => {
    const anchor = col === 0 ? 'end' : 'start';
    const lx = col === 0 ? colX[0] - valOff : colX[1] + valOff;
    seriesPts.forEach((s) => {
      svg += `<text x="${lx}" y="${yOf(s.pts[col]) + 9}" text-anchor="${anchor}" fill="${C.textPrimary}" font-size="26" font-weight="700">${fmt1(s.pts[col])}%</text>\n`;
    });
  });

  d.columns.forEach((label, i) => {
    svg += `<text x="${colX[i]}" y="${plotY + plotH + 40}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(label)}</text>\n`;
  });

  // Gap labels OFF the lines (critique2 F1): a bracket further outward than
  // the value labels, and the delta beyond the bracket. Nothing sits between
  // the two columns except the lines themselves.
  const bracketOff = 132;
  d.gaps.forEach((g, gi) => {
    const ys = seriesPts.map((s) => yOf(s.pts[gi])).sort((a, b) => a - b);
    const out = gi === 0 ? -1 : 1;
    const bx = colX[gi] + out * bracketOff;
    const tick = 10 * -out; // ticks point back toward the column
    svg += `<path d="M ${bx + tick} ${ys[0]} L ${bx} ${ys[0]} L ${bx} ${ys[1]} L ${bx + tick} ${ys[1]}" fill="none" stroke="${C.textSecondary}" stroke-width="2"/>\n`;
    const midY = (ys[0] + ys[1]) / 2;
    const anchor = gi === 0 ? 'end' : 'start';
    svg += `<text x="${bx + out * 14}" y="${midY + 9}" text-anchor="${anchor}" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(g.delta)}</text>\n`;
  });

  // Series key, top-left: the one empty region (every top-1 value sits
  // below 80%), clear of both columns' labels and brackets.
  const keyX = 140;
  let keyY = plotY + 24;
  seriesPts.forEach((s) => {
    svg += `<line x1="${keyX}" y1="${keyY - 8}" x2="${keyX + 30}" y2="${keyY - 8}" stroke="${roleColor[s.role]}" stroke-width="3"/>\n`;
    svg += `<circle cx="${keyX + 15}" cy="${keyY - 8}" r="7" fill="${roleColor[s.role]}"/>\n`;
    svg += `<text x="${keyX + 42}" y="${keyY}" fill="${C.textSecondary}" font-size="24">${esc(s.label)}</text>\n`;
    keyY += 40;
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 6. top3-measures.svg — four separate yardsticks, one strip, never joined
//    (except the before→after pair inside its own lane)
// ---------------------------------------------------------------------------
function buildTop3Measures(d) {
  let svg = svgOpen(d);
  svg += `<defs><marker id="top3-arrow" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2,2 L10,6 L2,10" fill="none" stroke="${C.textMuted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>\n`;

  const roleColor = { baseline: C.blue, after: C.orange, context: C.grey };

  const plotX = 320;
  const plotXEnd = W - 40;
  const plotW = plotXEnd - plotX;
  const axisTop = 20;
  const axisBottom = 380;
  const rows = d.lanes.length;
  const rowH = (axisBottom - axisTop) / rows;

  const xOf = (pct) => plotX + (pct / 100) * plotW;
  const pctOfPt = (pt) => (pt.pct != null ? pt.pct : pctOf(pt.numerator, pt.denominator));
  // value bold + label regular, as two tspans with an explicit gap, so the
  // pair never runs together ("78.2%pooled") in any renderer.
  const valueLabel = (pt, pct) => {
    const frac = pt.numerator != null ? ` (${pt.numerator}/${pt.denominator})` : '';
    const lab = `${pt.label || ''}${frac}`.trim();
    return `<tspan font-weight="700">${fmt1(pct)}%</tspan>${lab ? `<tspan dx="8" font-weight="400" fill="${C.textSecondary}">${esc(lab)}</tspan>` : ''}`;
  };

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
    const labY = rowCy + 8 - ((laneLines.length - 1) * 28) / 2;
    svg += `<text x="${plotX - 24}" y="${labY}" text-anchor="end" fill="${C.textPrimary}" font-size="24" font-weight="600">${tspans(laneLines, plotX - 24, labY, 28)}</text>\n`;

    if (lane.points.length === 2 && lane.role === 'before-after') {
      // Before -> after pair: values above the dots, what each dot is
      // below them (the key for blue/orange), anchored AWAY from each other.
      const [p0, p1] = lane.points;
      const x0 = xOf(p0.pct);
      const x1 = xOf(p1.pct);
      const dotY = rowCy + 2;
      svg += `<line x1="${x0 + 12}" y1="${dotY}" x2="${x1 - 14}" y2="${dotY}" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#top3-arrow)"/>\n`;
      svg += `<circle cx="${x0}" cy="${dotY}" r="9" fill="${roleColor[p0.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<circle cx="${x1}" cy="${dotY}" r="9" fill="${roleColor[p1.role]}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<text x="${x0 + 6}" y="${dotY - 18}" text-anchor="end" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(p0.pct)}%</text>\n`;
      svg += `<text x="${x1 - 6}" y="${dotY - 18}" text-anchor="start" fill="${C.textPrimary}" font-size="24" font-weight="700">${fmt1(p1.pct)}%</text>\n`;
      svg += `<text x="${x0 + 6}" y="${dotY + 34}" text-anchor="end" fill="${C.textSecondary}" font-size="22">${esc(p0.label)}</text>\n`;
      svg += `<text x="${x1 - 6}" y="${dotY + 34}" text-anchor="start" fill="${C.textSecondary}" font-size="22">${esc(p1.label)}</text>\n`;
    } else if (lane.points.length > 1) {
      // Several points that are NOT a before/after pair (live lots: all lots
      // vs not auto-locked) sit a few points apart. Each gets its own
      // sub-row, and its label sits to the LEFT of its own dot, level with
      // it — so no label can run into the other dot (critique2 F1).
      const sub = 34;
      lane.points.forEach((pt, pi) => {
        const pct = pctOfPt(pt);
        const x = xOf(pct);
        const dotY = rowCy + (pi - (lane.points.length - 1) / 2) * sub;
        svg += `<circle cx="${x}" cy="${dotY}" r="9" fill="${roleColor[lane.role] || C.grey}" stroke="${C.surface}" stroke-width="2"/>\n`;
        svg += `<text x="${x - 18}" y="${dotY + 8}" text-anchor="end" fill="${C.textPrimary}" font-size="24">${valueLabel(pt, pct)}</text>\n`;
      });
    } else {
      const pt = lane.points[0];
      const pct = pctOfPt(pt);
      const x = xOf(pct);
      svg += `<circle cx="${x}" cy="${rowCy}" r="9" fill="${roleColor[lane.role] || C.grey}" stroke="${C.surface}" stroke-width="2"/>\n`;
      svg += `<text x="${x - 18}" y="${rowCy + 8}" text-anchor="end" fill="${C.textPrimary}" font-size="24">${valueLabel(pt, pct)}</text>\n`;
    }
  });

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 7. lot-bar.svg — three stat tiles in one row, full width (slide 14). The
// day-dot panel lives in its own chart, lot-days.svg (backup/appendix).
// ---------------------------------------------------------------------------
function buildLotBar(d) {
  let svg = svgOpen(d);

  // Full 1136x440 box (critique2 F1: slide 14 is this chart alone): three
  // tiles in one row. Neutral ink for context tiles, ONE accent (orange, the
  // shipped result) on the tile flagged `accent`. Never blue: blue means
  // "before" everywhere else in the deck. The interval is small text in
  // plain words (no "CI" on screen).
  const n = d.tiles.length;
  const padX = 24;
  const gap = 24;
  const tileW = (W - padX * 2 - gap * (n - 1)) / n;
  const tileY = 24;
  const tileH = H - tileY * 2;

  d.tiles.forEach((tile, i) => {
    const x = padX + i * (tileW + gap);
    const cx = x + tileW / 2;
    const pct = pctOf(tile.numerator, tile.denominator);
    const accent = !!tile.accent;
    const ink = accent ? C.orange : C.textPrimary;
    svg += `<rect x="${x}" y="${tileY}" width="${tileW}" height="${tileH}" rx="12" fill="${C.grid}" fill-opacity="0.55" stroke="${accent ? C.orange : C.baseline}" stroke-width="${accent ? 3 : 1.5}"/>\n`;
    const labLines = wrap(tile.label, tileW - 40, 26);
    const labY = tileY + 64;
    svg += `<text x="${cx}" y="${labY}" text-anchor="middle" fill="${C.textPrimary}" font-size="26" font-weight="600">${tspans(labLines, cx, labY, 32)}</text>\n`;
    svg += `<text x="${cx}" y="${tileY + 220}" text-anchor="middle" fill="${ink}" font-size="80" font-weight="700">${fmt1(pct)}%</text>\n`;
    svg += `<text x="${cx}" y="${tileY + 280}" text-anchor="middle" fill="${C.textSecondary}" font-size="26">${tile.numerator} of ${tile.denominator} ${esc(tile.unit)}</text>\n`;
    svg += `<text x="${cx}" y="${tileY + 336}" text-anchor="middle" fill="${C.textMuted}" font-size="22">likely ${fmt1(tile.ciLo)}–${fmt1(tile.ciHi)}%</text>\n`;
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
  let svg = svgOpen(d);

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
  let svg = svgOpen(d);
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

  // Bar A — by hand, hatched blue to mark my testimony (D7)
  const yA = 130;
  const a = d.barA;
  svg += `<text x="${plotX - 24}" y="${yA + 8}" text-anchor="end" fill="${C.textPrimary}" font-size="26" font-weight="700">${esc(a.label)}</text>\n`;
  svg += `<rect x="${xOf(0)}" y="${yA - barThick / 2}" width="${xOf(a.high) - xOf(0)}" height="${barThick}" rx="4" fill="url(#hatch-hand)" stroke="${C.blue}" stroke-width="2"/>\n`;
  svg += `<text x="${xOf(a.high) + 16}" y="${yA + 9}" fill="${C.textPrimary}" font-size="28" font-weight="700">${a.high}${a.unit}</text>\n`;
  svg += `<text x="${xOf(0)}" y="${yA + barThick / 2 + 26}" fill="${C.textMuted}" font-size="22">my stopwatch — not instrumented</text>\n`;

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
  // On-screen tag in plain words (seg.shortTag); the experiment code stays in
  // the JSON's tierLabel/source, never on the slide.
  const segTag = (seg) => seg.shortTag || (/^instrumented/.test(seg.tierLabel) ? 'measured' : 'my estimate — not instrumented');
  const segLabelY1 = yB + barThick / 2 + 26;
  const segLabelY2 = segLabelY1 + 28;
  svg += `<text x="${xOf(0)}" y="${segLabelY1}" fill="${C.textSecondary}" font-size="22" font-weight="600">${esc(seg1.label)}: ${seg1.low}–${seg1.high}${seg1.unit} (${segTag(seg1)})</text>\n`;
  svg += `<text x="${xOf(0)}" y="${segLabelY2}" fill="${C.textSecondary}" font-size="22" font-weight="600">${esc(seg2.label)}: ${seg2.low}–${seg2.high}${seg2.unit} (${segTag(seg2)})</text>\n`;

  svg += svgClose;
  return svg;
}

// ---------------------------------------------------------------------------
// 9. e-lane-dag.svg — coordinator pattern: tiers, reviewer-above arrows,
//    3-5 real lanes from this repo. No commit hashes.
// ---------------------------------------------------------------------------
function buildLaneDag(d) {
  let svg = svgOpen(d);

  // Tier is encoded by ROW (position) only, labelled in a 170px left gutter
  // (critique2 F1: "Opus 5.5" was clipped). Colour encodes ROLE, with the
  // deck-wide meanings: grey = an implementer doing the work (context),
  // green = a reviewer gate one tier up (method/gate), and the coordinator a
  // neutral white outline, visibly not the Opus green. Every edge is a
  // directed arrow that stops short of its target box.
  svg += `<defs>
    <marker id="dag-arrow" viewBox="0 0 12 12" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M2,2 L10,6 L2,10" fill="none" stroke="${C.textSecondary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker></defs>\n`;

  const tierY = { fable: 52, opus: 146, sonnet: 240, haiku: 334 };
  const gutterX = 206; // right edge of the tier labels (plain-words roles, two lines)
  const boxW = 190;
  const boxH = 54;
  const mainY = 396; // top of the main trunk
  const mainH = 38;

  // Tier row labels, level with their row's boxes. No row rules: the key
  // sits in the first lane's empty upper column and a rule would run
  // through it.
  Object.entries(d.tierLabels).forEach(([tier, label]) => {
    if (tierY[tier] == null) return;
    const lines = label.split('\n');
    const y0 = tierY[tier] + 8 - ((lines.length - 1) * 26) / 2;
    svg += `<text x="${gutterX}" y="${y0}" text-anchor="end" fill="${C.textSecondary}" font-size="24">${tspans(lines, gutterX, y0, 26)}</text>\n`;
  });

  // Lanes, one column per chain of edges that ends at main — derived from
  // the edge graph itself (never hard-coded).
  const hasIncoming = new Set(d.edges.filter((e) => e.to !== 'main').map((e) => e.to));
  const nextOf = {};
  d.edges.forEach((e) => { if (e.to !== 'main') nextOf[e.from] = e.to; });
  const laneRoots = d.nodes.filter((n) => n.id !== 'main' && !hasIncoming.has(n.id)).map((n) => n.id);
  const laneOfId = {};
  laneRoots.forEach((root, i) => {
    let cur = root;
    while (cur) { laneOfId[cur] = i; cur = nextOf[cur]; }
  });
  const laneX0 = gutterX + 24 + boxW / 2;
  const pitch = 214;
  const laneX = laneRoots.map((_, i) => laneX0 + i * pitch);

  const pos = {};
  d.nodes.forEach((node) => {
    if (node.id === 'main') return;
    pos[node.id] = { x: laneX[laneOfId[node.id]], y: tierY[node.tier] };
  });
  const role = (node) => (node.tier === 'fable' ? 'coordinator' : hasIncoming.has(node.id) ? 'reviewer' : 'implementer');

  // main trunk: a full-width bar every lane merges into
  const trunkX0 = gutterX + 20;
  const trunkX1 = W - 16;
  svg += `<rect x="${trunkX0}" y="${mainY}" width="${trunkX1 - trunkX0}" height="${mainH}" rx="8" fill="${C.surface}" stroke="${C.textPrimary}" stroke-width="2"/>\n`;
  svg += `<text x="${trunkX0 + 16}" y="${mainY + mainH / 2 + 8}" fill="${C.textPrimary}" font-size="24" font-weight="700">${esc(d.trunkLabel || 'merged')}</text>\n`;

  // edges: review hand-offs go straight up; merges go right, then down.
  const gapTip = 8;
  d.edges.forEach((e) => {
    const a = pos[e.from];
    if (e.to === 'main') {
      const below = d.nodes.some((n) => n.id !== 'main' && laneOfId[n.id] === laneOfId[e.from] && tierY[n.tier] > a.y);
      if (!below) {
        svg += `<line x1="${a.x}" y1="${a.y + boxH / 2}" x2="${a.x}" y2="${mainY - gapTip}" stroke="${C.textSecondary}" stroke-width="2.5" marker-end="url(#dag-arrow)"/>\n`;
      } else {
        const ex = a.x + (pitch + boxW) / 4;
        svg += `<path d="M ${a.x + boxW / 2} ${a.y} L ${ex} ${a.y} L ${ex} ${mainY - gapTip}" fill="none" stroke="${C.textSecondary}" stroke-width="2.5" marker-end="url(#dag-arrow)"/>\n`;
      }
    } else {
      const b = pos[e.to];
      svg += `<line x1="${a.x}" y1="${a.y - boxH / 2}" x2="${b.x}" y2="${b.y + boxH / 2 + gapTip}" stroke="${C.textSecondary}" stroke-width="2.5" marker-end="url(#dag-arrow)"/>\n`;
    }
  });

  const style = {
    implementer: { fill: '#2a2927', stroke: C.grey, sw: 1.5, dash: '' },
    reviewer: { fill: '#162c24', stroke: C.green, sw: 2, dash: '' },
    coordinator: { fill: C.surface, stroke: C.textPrimary, sw: 2, dash: ' stroke-dasharray="7 5"' },
  };
  d.nodes.forEach((node) => {
    if (node.id === 'main') return;
    const { x, y } = pos[node.id];
    const st = style[role(node)];
    svg += `<rect x="${x - boxW / 2}" y="${y - boxH / 2}" width="${boxW}" height="${boxH}" rx="8" fill="${st.fill}" stroke="${st.stroke}" stroke-width="${st.sw}"${st.dash}/>\n`;
    svg += `<text x="${x}" y="${y + 8}" text-anchor="middle" fill="${C.textPrimary}" font-size="24" >${esc(node.label)}</text>\n`;
  });

  // key, stacked in the first lane's column above its only (bottom-row)
  // node — the one empty block in the chart.
  // A hairline frame sets the key apart from the tier labels to its left.
  const kx = laneX[0] - boxW / 2 + 16;
  let ky = tierY.fable + 50;
  const keyLines = d.roleKey.reduce((n, k) => n + k.label.split('\n').length, 0);
  const keyH = 28 * keyLines + 22 * (d.roleKey.length - 1) + 36;
  svg += `<rect x="${kx - 16}" y="${ky - 28}" width="${boxW}" height="${keyH}" rx="8" fill="none" stroke="${C.baseline}" stroke-width="1.5"/>\n`;
  d.roleKey.forEach((k) => {
    const st = style[k.role];
    const lines = k.label.split('\n');
    svg += `<rect x="${kx}" y="${ky - 11}" width="22" height="22" rx="4" fill="${st.fill}" stroke="${st.stroke}" stroke-width="${st.sw}"/>\n`;
    svg += `<text x="${kx + 34}" y="${ky + 8}" fill="${C.textSecondary}" font-size="24">${tspans(lines, kx + 34, ky + 8, 28)}</text>\n`;
    ky += 28 * lines.length + 22;
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
