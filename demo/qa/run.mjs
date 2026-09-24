#!/usr/bin/env node
// demo/qa/run.mjs — the Q&A demo pipeline (spec: talk/plan/qa-demo.md).
//
//   node demo/qa/run.mjs                 # --replay (default): no model calls, fixtures only
//   node demo/qa/run.mjs --live          # calls `claude -p` and (re)writes fixtures
//
// Options:
//   --replay | --live       mode (default --replay; a missing fixture in replay is an error)
//   --model <name>          model for live calls (default: sonnet)
//   --only <id,id,…>        live mode: re-call the model only for these answer ids; everything
//                           else (questions included) is replayed from fixtures
//   --reuse                 live mode: call the model only where a fixture is missing
//   --rekey                 replay mode, one-off: move fixtures written under an older key scheme to
//                           the current key (matched by persona / answer id), delete orphans
//   --concurrency <n>       live answer calls in flight at once (default 4)
//   --out <dir>             where pass outputs go (default demo/qa/out)
//   --site <file>           rendered page (default demo/qa/site/index.html)
//
// GRAILITH_DIR (live mode only) adds the private experiment write-ups and ledger to retrieval.
// Their text is sent to the model but never written to disk: only a path + sha256 manifest
// (replay/grailith-manifest.json) is committed, so replay computes the same fixture keys.
//
// Node built-ins only. Deterministic passes: stable ids, sorted output, no timestamps.

import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const REPLAY = path.join(HERE, 'replay');
const GRAILITH_MANIFEST = path.join(REPLAY, 'grailith-manifest.json');

// ---- fixed parameters (changing any of these changes the output) ----
const PERSONAS = ['designer', 'mid-swe', 'pm', 'senior-swe'];
const CLUSTER_THRESHOLD = 0.5; // overlap coefficient of content tokens, question vs cluster seed
const TOP_N = 20; // ranked questions that get an answer
const K_REPO = 6; // repo excerpts per answer
const K_GRAILITH = 3; // grailith excerpts per answer (live + GRAILITH_DIR only)
const CHUNK_MAX = 1600; // max chars per excerpt
const MAX_WORDS = 120;
const GRAILITH_GLOBS = ['docs/experiments', 'docs/plan/2026-09-18-trunk-consolidation/experiment-ledger.md'];
// The answers are Gerald's own, in the first person; outputs never refer to him in the third person.
const THIRD_PERSON = /founder|gerald/i;
// Left out of the Grailith pool: the operator's own working-lane notes (about the person, not an experiment).
const GRAILITH_EXCLUDE = /founder/i;
const DISALLOWED_TOOLS = 'Bash,Edit,Write,Read,Glob,Grep,WebFetch,WebSearch,Task,NotebookEdit';

// ---- args ----
function parseArgs(argv) {
  const a = { live: false, model: 'sonnet', only: null, reuse: false, concurrency: 4,
    out: path.join(HERE, 'out'), site: path.join(HERE, 'site', 'index.html') };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--live') a.live = true;
    else if (k === '--replay') a.live = false;
    else if (k === '--reuse') a.reuse = true;
    else if (k === '--rekey') a.rekey = true;
    else if (k === '--model') a.model = argv[++i];
    else if (k === '--only') a.only = new Set(argv[++i].split(',').map((s) => s.trim()).filter(Boolean));
    else if (k === '--concurrency') a.concurrency = Math.max(1, parseInt(argv[++i], 10) || 4);
    else if (k === '--out') a.out = path.resolve(argv[++i]);
    else if (k === '--site') a.site = path.resolve(argv[++i]);
    else { console.error(`run.mjs: unknown argument ${k}`); process.exit(2); }
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));
if (args.rekey && args.live) { console.error('run.mjs: --rekey is a replay-only step'); process.exit(2); }
const GRAILITH_DIR = args.live && process.env.GRAILITH_DIR ? path.resolve(process.env.GRAILITH_DIR) : null;

// ---- helpers ----
const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const readText = (p) => fs.readFileSync(p, 'utf8');
function writeJson(p, v) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
}
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
function die(msg) { console.error(`run.mjs: ${msg}`); process.exit(1); }

function listMd(dirAbs, recursive) {
  if (!fs.existsSync(dirAbs)) return [];
  const out = [];
  for (const e of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory() && recursive) out.push(...listMd(p, true));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// ---- text normalization, tokens ----
const STOP = new Set(('a an the and or but if then than so of to in on at by for with from into onto as is are was were ' +
  'be been being do does did done have has had having it its this that these those there here what which who whom whose ' +
  'when where why how you your yours i me my we our us they them their he she his her not no yes can could would should ' +
  'will shall may might must just also about over under more most less least very really any all each every some such ' +
  'only own same other both few many much get got make made like actually talk slide slides gerald said ' +
  'say says mean means did didnt dont doesnt isnt wasnt youre youve ive thats whats vs via per').split(/\s+/));
function stem(t) {
  if (t.length > 5 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith('ed')) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
}
function tokens(text) {
  return text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').split(' ')
    .filter((t) => t && !STOP.has(t) && (t.length >= 3 || /\d/.test(t))).map(stem);
}
const tokenSet = (text) => new Set(tokens(text));
const normQ = (q) => q.toLowerCase().replace(/\s+/g, ' ').trim();

// ---- pass 0: snapshot ----
function repoCorpusPaths() {
  const fixed = ['talk/notes.md', 'talk/slides/deck.md', 'talk/outline.md', 'docs/project/decisions.md'];
  const globbed = [
    ...listMd(path.join(ROOT, 'mining/findings'), false),
    ...listMd(path.join(ROOT, 'mining/arcs'), false),
    ...listMd(path.join(ROOT, 'talk/plan/critique2'), false),
    ...listMd(path.join(ROOT, 'starter'), true),
  ].map(rel);
  const all = [...new Set([...fixed.filter((p) => fs.existsSync(path.join(ROOT, p))), ...globbed])];
  return all.sort(cmp);
}
function grailithPaths(dir) {
  const out = [];
  for (const g of GRAILITH_GLOBS) {
    const abs = path.join(dir, g);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isDirectory()) out.push(...listMd(abs, false).map((p) => path.relative(dir, p).split(path.sep).join('/')));
    else out.push(g);
  }
  return [...new Set(out)].filter((p) => !GRAILITH_EXCLUDE.test(p)).sort(cmp);
}
function pass0() {
  const repo = repoCorpusPaths().map((p) => {
    const buf = fs.readFileSync(path.join(ROOT, p));
    return { path: p, sha256: sha256(buf), bytes: buf.length, source: 'repo', text: buf.toString('utf8') };
  });
  let grailith = [];
  if (GRAILITH_DIR) {
    grailith = grailithPaths(GRAILITH_DIR).map((p) => {
      const buf = fs.readFileSync(path.join(GRAILITH_DIR, p));
      return { path: `grailith:${p}`, sha256: sha256(buf), bytes: buf.length, source: 'grailith', text: buf.toString('utf8') };
    });
  } else if (fs.existsSync(GRAILITH_MANIFEST)) {
    grailith = JSON.parse(readText(GRAILITH_MANIFEST)).files.map((f) => ({ ...f, source: 'grailith', text: null }));
  }
  const files = [...repo, ...grailith].sort((a, b) => cmp(a.path, b.path));
  const corpus = { files: files.map(({ path: p, sha256: s, bytes, source }) => ({ path: p, sha256: s, bytes, source })) };
  const grailithHash = grailith.length ? sha256(JSON.stringify(grailith.map((f) => [f.path, f.sha256]))) : null;
  return { corpus, repo, grailith, grailithHash };
}

// ---- model calls (live) and fixtures ----
function fixturePath(pass, key) { return path.join(REPLAY, pass, `${key}.json`); }
function loadFixture(pass, key) {
  const p = fixturePath(pass, key);
  return fs.existsSync(p) ? JSON.parse(readText(p)) : null;
}
// --rekey: find an old-keyed fixture by identity (persona, or answer id), and move it to the new key.
// Several candidates for one answer id → the one whose answer is in the committed out/answers.json.
function rekeyFixture(pass, key, match, preferAnswer) {
  const dir = path.join(REPLAY, pass);
  if (!fs.existsSync(dir)) return null;
  const cands = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort(cmp)
    .map((f) => ({ f, fx: JSON.parse(readText(path.join(dir, f))) })).filter(({ fx }) => match(fx));
  let pick = cands.length === 1 ? cands[0] : cands.find(({ fx }) => preferAnswer && fx.output?.answer === preferAnswer);
  if (!pick) return null;
  const fx = { ...pick.fx, key };
  fs.unlinkSync(path.join(dir, pick.f));
  writeJson(fixturePath(pass, key), fx);
  console.error(`  rekey ${pass}: ${pick.f.slice(0, 12)}… → ${key.slice(0, 12)}…`);
  return fx;
}
const staleNotes = [];
function callClaude(prompt, model) {
  return new Promise((resolve, reject) => {
    // cwd is a neutral temp dir so the call doesn't pick up this repo's CLAUDE.md as context.
    const child = spawn('claude', ['-p', '--model', model, '--output-format', 'text',
      '--disallowed-tools', DISALLOWED_TOOLS], { cwd: os.tmpdir(), stdio: ['pipe', 'pipe', 'pipe'] });
    let out = ''; let err = '';
    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('claude -p timed out')); }, 6 * 60 * 1000);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out); else reject(new Error(`claude -p exited ${code}: ${err.slice(0, 300)}`));
    });
    child.stdin.end(prompt);
  });
}
function extractJson(text) {
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('no JSON object in model output');
  return JSON.parse(t.slice(start, end + 1));
}
async function modelJson(prompt, validate) {
  let lastErr;
  let p = prompt;
  for (let attempt = 0; attempt < 4; attempt++) {
    try { return validate(extractJson(await callClaude(p, args.model))); } catch (e) {
      lastErr = e;
      // Re-ask with the rejection reason appended (the fixture key stays that of the base prompt).
      p = `${prompt}\n\n=== YOUR PREVIOUS OUTPUT WAS REJECTED ===\n${e.message}. ` +
        'Follow every rule above (first person only: never "Gerald" or "the founder"), and output STRICT JSON only.';
    }
  }
  throw lastErr;
}
async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() { while (next < items.length) { const i = next++; results[i] = await fn(items[i], i); } }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return results;
}

// ---- pass 1: questions ----
function validateQuestions(obj) {
  if (!obj || !Array.isArray(obj.questions)) throw new Error('questions: bad shape');
  // Questions that name the speaker in the third person are dropped, not rewritten.
  const kept = obj.questions.filter((q) => q && typeof q.question === 'string' && q.question.trim() &&
    !THIRD_PERSON.test(q.question) && !THIRD_PERSON.test(String(q.why ?? '')));
  if (kept.length < 5) throw new Error('questions: too few usable questions');
  return {
    questions: kept.map((q) => {
      const lk = Math.round(Number(q.likelihood));
      return { question: q.question.trim(), likelihood: Math.min(5, Math.max(1, Number.isFinite(lk) ? lk : 1)),
        why: String(q.why ?? '').trim(), slide_ref: Math.max(0, Math.round(Number(q.slide_ref)) || 0) };
    }),
  };
}
async function pass1(used) {
  const tmpl = readText(path.join(HERE, 'prompts/questions.md'));
  const talk = readText(path.join(ROOT, 'talk/slides/deck.md'));
  const liveQ = args.live && !args.only;
  const perPersona = await Promise.all(PERSONAS.map(async (persona) => {
    const personaText = readText(path.join(HERE, 'personas', `${persona}.md`));
    // Key = what a public checkout can always compute: pass, prompt, persona. The deck the questions
    // were asked about is recorded in the fixture (inputs.talk_sha256); a later deck edit makes the
    // fixture stale (reported), not missing.
    const key = sha256(JSON.stringify(['questions', sha256(tmpl), persona, sha256(personaText)]));
    used.questions.add(key);
    let fx = loadFixture('questions', key);
    if (!fx && args.rekey) {
      fx = rekeyFixture('questions', key, (f) => f.persona === persona);
      // The old key contained the deck's hash and replayed, so it was asked about this deck.
      if (fx && !fx.inputs) { fx.inputs = { talk_sha256: sha256(talk) }; writeJson(fixturePath('questions', key), fx); }
    }
    if (liveQ && !(args.reuse && fx)) {
      const prompt = tmpl.replace('{{PERSONA}}', personaText).replace('{{TALK}}', talk);
      console.error(`  questions: calling ${args.model} for ${persona}`);
      const output = await modelJson(prompt, validateQuestions);
      fx = { pass: 'questions', key, persona, model: args.model, inputs: { talk_sha256: sha256(talk) }, output };
      writeJson(fixturePath('questions', key), fx);
    }
    if (!fx) die(`missing replay fixture replay/questions/${key}.json (persona ${persona}); run --live`);
    if (fx.inputs?.talk_sha256 !== sha256(talk)) staleNotes.push(`questions/${persona}: asked about an older deck`);
    return { persona, questions: fx.output.questions };
  }));
  const seen = new Set();
  const out = [];
  for (const { persona, questions } of perPersona) {
    for (const q of questions) {
      const id = 'q-' + sha256(`${persona}\n${normQ(q.question)}`).slice(0, 10);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ id, persona, question: q.question, likelihood: q.likelihood, why: q.why, slide_ref: q.slide_ref });
    }
  }
  return out.sort((a, b) => cmp(a.persona, b.persona) || cmp(a.id, b.id));
}

// ---- pass 2: rank ----
function overlap(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const t of a) if (b.has(t)) n++;
  return n / Math.min(a.size, b.size);
}
function pass2(questions) {
  const order = [...questions].sort((a, b) => b.likelihood - a.likelihood || cmp(a.id, b.id));
  const clusters = [];
  for (const q of order) {
    const toks = tokenSet(q.question);
    let best = null; let bestSim = 0;
    for (const c of clusters) {
      const s = overlap(toks, c.seedTokens);
      if (s >= CLUSTER_THRESHOLD && s > bestSim) { best = c; bestSim = s; }
    }
    if (best) best.members.push(q);
    else clusters.push({ seed: q, seedTokens: toks, members: [q] });
  }
  const ranked = clusters.map((c) => {
    const personas = [...new Set(c.members.map((m) => m.persona))].sort(cmp);
    const sumLk = c.members.reduce((s, m) => s + m.likelihood, 0);
    return { id: c.seed.id, question: c.seed.question, personas,
      score: sumLk * (1 + 0.5 * (personas.length - 1)), members: c.members.map((m) => m.id).sort(cmp) };
  }).sort((a, b) => b.score - a.score || cmp(a.id, b.id));
  return ranked.map((r, i) => ({ rank: i + 1, ...r }));
}

// ---- retrieval ----
function chunkFile(p, text) {
  const lines = text.split('\n');
  const sections = [];
  let cur = { heading: '(top of file)', lines: [] };
  for (const line of lines) {
    const m = /^#{1,4}\s+(.*\S)\s*$/.exec(line);
    if (m) { if (cur.lines.some((l) => l.trim())) sections.push(cur); cur = { heading: m[1], lines: [line] }; }
    else cur.lines.push(line);
  }
  if (cur.lines.some((l) => l.trim())) sections.push(cur);
  const chunks = [];
  for (const s of sections) {
    const parts = [];
    let buf = '';
    for (const line of s.lines) {
      const l = line.length > CHUNK_MAX ? line.slice(0, CHUNK_MAX) : line;
      if (buf && buf.length + l.length + 1 > CHUNK_MAX) { parts.push(buf); buf = ''; }
      buf += (buf ? '\n' : '') + l;
    }
    if (buf.trim()) parts.push(buf);
    parts.forEach((t, i) => chunks.push({ path: p, heading: s.heading, part: parts.length > 1 ? i + 1 : 0,
      seq: chunks.length, text: t.trim() }));
  }
  return chunks;
}
// BM25 (k1 1.2, b 0.75) over heading-cut chunks; idf computed within each pool (repo, grailith).
const BM25_K1 = 1.2;
const BM25_B = 0.75;
function buildIndex(files) {
  const chunks = files.flatMap((f) => chunkFile(f.path, f.text));
  const df = new Map();
  let totalLen = 0;
  for (const c of chunks) {
    const toks = tokens(c.text);
    c.len = toks.length;
    totalLen += c.len;
    c.tf = new Map();
    for (const t of toks) c.tf.set(t, (c.tf.get(t) || 0) + 1);
    for (const t of c.tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = chunks.length;
  const avgdl = N ? totalLen / N : 1;
  const idf = (t) => { const d = df.get(t) || 0; return Math.log(1 + (N - d + 0.5) / (d + 0.5)); };
  return { chunks, idf, avgdl };
}
function retrieve(index, qToks, k) {
  if (!index) return [];
  const scored = [];
  for (const c of index.chunks) {
    let s = 0;
    for (const t of qToks) {
      const tf = c.tf.get(t);
      if (tf) s += index.idf(t) * (tf * (BM25_K1 + 1)) / (tf + BM25_K1 * (1 - BM25_B + BM25_B * c.len / index.avgdl));
    }
    if (s > 0) scored.push({ c, s: Math.round(s * 1e6) });
  }
  scored.sort((a, b) => b.s - a.s || cmp(a.c.path, b.c.path) || a.c.seq - b.c.seq);
  return scored.slice(0, k).map((x) => x.c);
}
const headerOf = (c, n) => `[${n}] ${c.path} § ${c.heading}${c.part ? ` (part ${c.part})` : ''}`;

// ---- pass 3: answers ----
function validateAnswer(obj) {
  const G = ['sourced', 'testimony', 'not in the record'];
  if (!obj || typeof obj.answer !== 'string' || !obj.answer.trim()) throw new Error('answer: empty');
  if (!G.includes(obj.grounding)) throw new Error(`answer: bad grounding ${obj.grounding}`);
  const words = obj.answer.trim().split(/\s+/).length;
  if (words > MAX_WORDS) throw new Error(`answer: ${words} words`);
  const citations = Array.isArray(obj.citations) ? obj.citations : [];
  if (THIRD_PERSON.test(obj.answer) || citations.some((c) => THIRD_PERSON.test(String(c?.locator ?? '')))) {
    throw new Error('answer: third-person reference to the speaker');
  }
  return { answer: obj.answer.trim().replace(/\s+/g, ' '), grounding: obj.grounding,
    citations: citations.filter((c) => c && typeof c.path === 'string')
      .map((c) => ({ path: c.path.trim(), locator: String(c.locator ?? '').trim() })) };
}
async function pass3(ranked, questionsById, snap, used) {
  const committedPath = path.join(HERE, 'out', 'answers.json');
  const committedAnswers = new Map(args.rekey && fs.existsSync(committedPath)
    ? JSON.parse(readText(committedPath)).map((a) => [a.id, a.answer]) : []);
  const tmpl = readText(path.join(HERE, 'prompts/answer.md'));
  const repoIndex = buildIndex(snap.repo);
  const gIndex = GRAILITH_DIR ? buildIndex(snap.grailith) : null;
  const top = ranked.slice(0, TOP_N);
  const retrievalOut = [];
  const jobs = top.map((r) => {
    const qText = r.members.map((id) => questionsById.get(id).question).join(' ');
    const qToks = [...tokenSet(qText)].sort(cmp);
    const repoEx = retrieve(repoIndex, qToks, K_REPO);
    // Key = [pass, prompt, question id + text, Grailith manifest hash]: all computable from a public
    // checkout (the manifest is committed). Neither excerpt text enters the key; the repo excerpts
    // the model saw are recorded in the fixture, and a drift from today's retrieval is reported as stale.
    const key = sha256(JSON.stringify(['answer', sha256(tmpl), r.id, r.question, snap.grailithHash]));
    used.answers.add(key);
    return { r, qToks, repoEx, key };
  });
  const results = await pool(jobs, args.live ? args.concurrency : 1, async ({ r, qToks, repoEx, key }) => {
    let fx = loadFixture('answers', key);
    if (!fx && args.rekey) fx = rekeyFixture('answers', key, (f) => f.id === r.id, committedAnswers.get(r.id));
    const want = args.live && (!args.only || args.only.has(r.id)) && !(args.reuse && fx);
    if (want) {
      const gEx = retrieve(gIndex, qToks, K_GRAILITH);
      const ex = [...repoEx, ...gEx];
      const excerpts = ex.map((c, i) => `${headerOf(c, i + 1)}\n${c.text}`).join('\n\n');
      const prompt = tmpl.replace('{{QUESTION}}', r.question).replace('{{EXCERPTS}}', excerpts);
      console.error(`  answers: calling ${args.model} for ${r.id} (rank ${r.rank})`);
      const output = await modelJson(prompt, validateAnswer);
      fx = { pass: 'answers', key, id: r.id, model: args.model,
        excerpts: ex.map((c) => ({ path: c.path, chunk: c.seq, sha256: sha256(c.text) })), output };
      writeJson(fixturePath('answers', key), fx);
    }
    if (!fx) die(`missing replay fixture replay/answers/${key}.json (question ${r.id}); run --live`);
    const now = JSON.stringify(repoEx.map((c) => [c.path, c.seq, sha256(c.text)]));
    const then = JSON.stringify(fx.excerpts.filter((e) => !e.path.startsWith('grailith:')).map((e) => [e.path, e.chunk, e.sha256]));
    if (now !== then) staleNotes.push(`answers/${r.id}: retrieval over today's repo differs from what the model saw`);
    retrievalOut.push({ id: r.id, rank: r.rank, excerpts: fx.excerpts });
    return { id: r.id, answer: fx.output.answer, grounding: fx.output.grounding, citations: fx.output.citations };
  });
  retrievalOut.sort((a, b) => a.rank - b.rank);
  return { answers: results, retrieval: retrievalOut };
}

// ---- pass 4: verify ----
const normLoose = (s) => s.toLowerCase().replace(/[*`_>|\\]/g, '').replace(/[“”"‘’']/g, '').replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim();
function cleanLocator(loc) {
  return loc.replace(/\s*\(part \d+\)\s*$/i, '').replace(/^§\s*/, '').replace(/^#+\s*/, '').trim();
}
// Schema shared with render.mjs: [{id, ok, citations:[{path, locator, status}]}], where status is
// "verified" | "failed" | "unverifiable". ok is false when any citation failed, the answer runs
// over MAX_WORDS, or a sourced/testimony answer cites nothing. Reasons go to stderr only.
function pass4(answers, snap) {
  const corpusPaths = new Set(snap.corpus.files.map((f) => f.path));
  const repoText = new Map(snap.repo.map((f) => [f.path, normLoose(f.text)]));
  const envG = process.env.GRAILITH_DIR ? path.resolve(process.env.GRAILITH_DIR) : null;
  const gSha = new Map(snap.grailith.map((f) => [f.path, f.sha256]));
  return answers.map((a) => {
    const issues = [];
    const words = a.answer.split(/\s+/).filter(Boolean).length;
    if (words > MAX_WORDS) issues.push(`answer is ${words} words (> ${MAX_WORDS})`);
    if (a.grounding !== 'not in the record' && a.citations.length === 0) issues.push(`grounding "${a.grounding}" but no citations`);
    const citations = a.citations.map((c) => {
      let status;
      let why = '';
      const needle = normLoose(cleanLocator(c.locator));
      if (!corpusPaths.has(c.path)) { status = 'failed'; why = 'path not in corpus'; }
      else if (!needle) { status = 'failed'; why = 'empty locator'; }
      else if (c.path.startsWith('grailith:')) {
        const p = c.path.slice('grailith:'.length);
        const abs = envG ? path.join(envG, p) : null;
        if (abs && fs.existsSync(abs) && sha256(fs.readFileSync(abs)) === gSha.get(c.path)) {
          status = normLoose(readText(abs)).includes(needle) ? 'verified' : 'failed';
          if (status === 'failed') why = 'locator not found';
        } else status = 'unverifiable';
      } else if (repoText.get(c.path).includes(needle)) status = 'verified';
      else { status = 'failed'; why = 'locator not found'; }
      if (status === 'failed') issues.push(`${c.path}: ${why}`);
      return { path: c.path, locator: c.locator, status };
    });
    for (const i of issues) console.error(`    verify ${a.id}: ${i}`);
    return { id: a.id, ok: issues.length === 0, citations };
  });
}

// ---- main ----
async function main() {
  console.error(`run.mjs: mode=${args.live ? 'live' : 'replay'}${args.live ? ` model=${args.model}` : ''}` +
    `${GRAILITH_DIR ? ' +grailith' : ''}`);
  const used = { questions: new Set(), answers: new Set() };

  const snap = pass0();
  if (GRAILITH_DIR) writeJson(GRAILITH_MANIFEST, { files: snap.grailith.map(({ path: p, sha256: s, bytes }) => ({ path: p, sha256: s, bytes })) });
  writeJson(path.join(args.out, 'corpus.json'), snap.corpus);
  console.error(`  pass 0 snapshot: ${snap.repo.length} repo + ${snap.grailith.length} grailith files`);

  const questions = await pass1(used);
  writeJson(path.join(args.out, 'questions.json'), questions);
  console.error(`  pass 1 questions: ${questions.length}`);

  const ranked = pass2(questions);
  writeJson(path.join(args.out, 'ranked.json'), ranked);
  console.error(`  pass 2 rank: ${ranked.length} clusters`);

  const qById = new Map(questions.map((q) => [q.id, q]));
  const { answers, retrieval } = await pass3(ranked, qById, snap, used);
  writeJson(path.join(args.out, 'answers.json'), answers);
  writeJson(path.join(args.out, 'retrieval.json'), retrieval);
  const g = answers.reduce((m, a) => ({ ...m, [a.grounding]: (m[a.grounding] || 0) + 1 }), {});
  console.error(`  pass 3 answers: ${answers.length} (${Object.entries(g).map(([k, v]) => `${k} ${v}`).join(', ')})`);

  const verify = pass4(answers, snap);
  writeJson(path.join(args.out, 'verify.json'), verify);
  const cs = verify.flatMap((v) => v.citations).reduce((m, c) => ({ ...m, [c.status]: (m[c.status] || 0) + 1 }), {});
  console.error(`  pass 4 verify: ${verify.filter((v) => v.ok).length}/${verify.length} answers ok; citations ` +
    `${Object.entries(cs).sort(([x], [y]) => cmp(x, y)).map(([k, v]) => `${k} ${v}`).join(', ')}`);

  // Live runs prune fixtures no longer referenced, so replay/ holds exactly one run's calls.
  if (staleNotes.length) {
    console.error(`  stale: ${staleNotes.length} fixture(s) predate today's inputs (outputs still replay exactly; --live refreshes):`);
    for (const n of staleNotes.sort(cmp)) console.error(`    ${n}`);
  }
  if (args.live || args.rekey) {
    for (const pass of ['questions', 'answers']) {
      const dir = path.join(REPLAY, pass);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) if (f.endsWith('.json') && !used[pass].has(f.slice(0, -5))) fs.unlinkSync(path.join(dir, f));
    }
  }

  const render = path.join(HERE, 'render.mjs');
  if (!fs.existsSync(render)) { console.error('  pass 5 render: render.mjs missing: skip'); return; }
  const r = spawnSync(process.execPath, [render, args.out, args.site], { stdio: 'inherit' });
  if (r.status !== 0) die(`render.mjs exited ${r.status}`);
  console.error(`  pass 5 render: ${rel(args.site)}`);
}

main().catch((e) => die(e.stack || String(e)));
