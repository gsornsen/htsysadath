# Coordinator & model routing

The coordinator is a Fable session (the one reading this). It does NOT do the bulk work. It:
writes self-contained briefs, spawns lanes, judges results, reconciles disagreements, logs
decisions, and keeps tracking.md true.

## Tiers (pick by the judgment the task needs, not by its size)

| Tier | Use for | Examples in this project |
|---|---|---|
| **Haiku** | mechanical, well-specified, verifiable by count | run the inventory script and format its output; list experiment files with their first heading; extract dates from filenames; grep a transcript for a keyword list and return line numbers |
| **Sonnet** | bounded extraction/summary that needs some judgment, within one source | summarise one experiment doc into hypothesis/test/result/decision; build the pivot timeline from plan docs; draft one audience version of the abstract from a persona brief |
| **Opus** (confirm exact id — Gerald named "Opus 5.5"; this session knows `claude-opus-5`; in Grailith the pinned agent type `opus46` was preferred for instruction-following) | synthesis across sources; building an argument; persona critique; reviewing Sonnet output | write arc A's narrative from 20 experiment summaries + 3 transcript slices; the persona panel on outline v1; reconcile two lanes' conflicting timelines |
| **Fable** (coordinator) | briefs, judgment, reconciliation, anything the talk's thesis depends on | this doc; choosing the spine arc; final outline |

**Reviewer is one tier above the implementer.** Haiku work is checked by Sonnet, Sonnet by Opus,
Opus by Fable. A review is a positive statement of what was verified (counts, spot-checks with
provenance), never "looks good."

## Brief template (every lane gets one; paste it whole)

```
LANE <name> · branch <mine|draft|talk>/<slug> · model <tier>
GOAL: one sentence, with the artifact it produces (path).
SOURCES: exact paths; what to read and what NOT to open (size guard).
OUTPUT CONTRACT: file path, section headings, provenance format, max length.
HYGIENE: public repo — paraphrase, strip emails/keys/hosts/credits; see docs/project/public-repo-hygiene.md.
DONE MEANS: a positive check (e.g. "every finding has a [src:] line; N findings; spot-checked 3").
COMMIT: small commits on the branch; message prefix `mine:` / `draft:` / `talk:`; do not merge.
REPORT: ≤ 30 lines — what you found, what you could not, alternatives you considered, shas.
Do not spawn sub-agents. Do not end your turn waiting on anything.
```

## Swarm shapes that fit this project

- **Fan-out by source** (independent): one lane per arc/source, all Sonnet, Opus reviews each.
- **Fan-out by audience** (independent): four Sonnet drafts of the same document from four persona
  briefs; Fable (or Gerald) picks a hybrid. This is arc D demonstrated on itself.
- **Pipeline**: inventory (Haiku) → targeted transcript slices (Sonnet) → arc narrative (Opus) →
  persona panel (Opus) → Fable/Gerald decision.
- **Challenge round**: after a synthesis, one Opus lane argues the opposite reading from the same
  evidence; Fable reconciles and logs the decision. (Used in Grailith's chips investigation —
  worth showing in the talk.)

## Rules that came from pain (keep)

1. Commit early on every lane; a limit or crash kills uncommitted work.
2. A lane never ends its turn waiting on something; it reports and stops.
3. Size guards in every brief: a lane that opens a 500 MB file has failed the brief.
4. One writer per file at a time; parallel lanes touch disjoint paths.
5. The coordinator measures live state before claiming it (a lane's "done" is checked by count).
6. Ground-truth beats inference: a finding quotes provenance or is labelled a guess.
