#!/usr/bin/env python3
"""Inventory Claude Code transcript files WITHOUT reading them whole.

For each *.jsonl under a project dir: session id, size, first/last timestamp, the first user
request (truncated, single line), and a rough message count from a bounded scan.

Usage:
  python3 scripts/inventory-transcripts.py ~/.claude/projects/-Users-geraldsornsen-git-grAIde \
      --out mining/timeline/sessions.md [--max-scan-mb 32]

Reads at most --max-scan-mb from the head of each file plus 256 KB from the tail; a 6 GB
directory inventories in seconds. Output is Markdown. The opening-request column is RAW and can contain names, paths and
product ids: paraphrase it to <= 12 words BEFORE the first commit, not after. Committing the
raw column puts it in git history, which a later redaction commit does not remove.
"""
import argparse, json, os, sys, time
from pathlib import Path

def first_text(msg):
    c = msg.get("content") if isinstance(msg, dict) else None
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        for part in c:
            if isinstance(part, dict) and part.get("type") == "text" and part.get("text"):
                return part["text"]
    return ""

def head_scan(path, max_bytes):
    first_ts = None; opening = ""; n = 0; roles = {}
    with open(path, "rb") as f:
        read = 0
        for raw in f:
            read += len(raw)
            try:
                rec = json.loads(raw)
            except Exception:
                continue
            n += 1
            t = rec.get("type"); roles[t] = roles.get(t, 0) + 1
            ts = rec.get("timestamp")
            if ts and not first_ts: first_ts = ts
            if not opening and t == "user":
                txt = first_text(rec.get("message", {}))
                if txt and not txt.startswith("<"):
                    opening = " ".join(txt.split())[:160]
            if read >= max_bytes: break
    return first_ts, opening, n, roles, read

def tail_ts(path, tail_bytes=256 * 1024):
    size = os.path.getsize(path)
    with open(path, "rb") as f:
        f.seek(max(0, size - tail_bytes))
        chunk = f.read().splitlines()
    for raw in reversed(chunk):
        try:
            ts = json.loads(raw).get("timestamp")
            if ts: return ts
        except Exception:
            continue
    return None

def _safe_label(d):
    """Project label with no home path. `-Users-me-git-foo` -> `foo`; never an absolute path.

    The inventory is committed to a PUBLIC repo, so the header must not carry a
    filesystem path (docs/project/public-repo-hygiene.md).
    """
    name = Path(d).name
    return name.split("-")[-1] or "unknown"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--out", default="-")
    ap.add_argument("--max-scan-mb", type=float, default=32)
    a = ap.parse_args()
    d = Path(os.path.expanduser(a.project_dir))
    files = sorted(d.glob("*.jsonl"))
    rows = []
    t0 = time.time()
    for p in files:
        size = p.stat().st_size
        f_ts, opening, n, roles, read = head_scan(p, int(a.max_scan_mb * 1024 * 1024))
        l_ts = tail_ts(p)
        partial = read < size
        rows.append((f_ts or "", l_ts or "", p.stem[:8], size, n, partial, opening.replace("|", "\\|")))
    rows.sort()
    out = []
    out.append(f"# Session inventory — project `{_safe_label(d)}`\n")
    out.append(f"{len(files)} files · {sum(r[3] for r in rows)/1e9:.2f} GB · scanned {time.time()-t0:.1f}s · "
               f"head scan {a.max_scan_mb} MB (msg count is a lower bound when marked ~)\n")
    out.append("| first | last | session | size | msgs | opening request (paraphrased, <= 12 words) |")
    out.append("|---|---|---|---|---|---|")
    for f_ts, l_ts, sid, size, n, partial, opening in rows:
        out.append(f"| {f_ts[:16]} | {l_ts[:16]} | {sid} | {size/1e6:,.0f} MB | {'~' if partial else ''}{n} | {opening} |")
    text = "\n".join(out) + "\n"
    if a.out == "-":
        sys.stdout.write(text)
    else:
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        Path(a.out).write_text(text)
        print(f"wrote {a.out} ({len(rows)} sessions)")

if __name__ == "__main__":
    main()
