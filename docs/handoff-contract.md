# Handoff Contract

## Purpose

FocusLab handoffs are operational restart packets. They are not transcripts and not generic summaries. A fresh JARVIS/Codex chat should be able to read the handoff and continue the sprint without asking Melih to reconstruct state.

## Export Outputs

Milestone 1 produces two outputs from the same read-only sprint snapshot:

1. Markdown handoff file.
2. Clipboard-ready next-chat prompt.

FocusLab must not automatically write either output into the JARVIS vault in v1. Saving/copying is user-triggered.

## Snapshot Inputs

The handoff generator reads:

- `sprints.title`
- `sprints.goal`
- `sprints.current_state`
- `sprints.status`
- open and completed `tasks`
- open/resolved `blockers`
- `decisions`
- selected or recent `notes`
- `artifacts`
- `milestones`

## Markdown Template

```md
# <Sprint Title> Handoff

Generated: <ISO/local timestamp>
App: FocusLab

## Fresh-Chat Starter

<One paragraph the user can paste into a new JARVIS/Codex chat. It should name the project, goal, current state, blocker status, and exact next action.>

## Goal

<Sprint goal>

## Current State

<Operational state in 2-5 bullets. Include what changed during this sprint and where the work stands now.>

## Completed Work

- [x] <completed task title> - <brief result if available>

## Open Tasks

- [ ] <status/priority> <task title> - <notes or next action>

## Blockers

### Open

- <blocker title>
  - Blocks: <task or sprint>
  - Needed from: <person/tool/decision>
  - Detail: <description>

### Resolved

- <blocker title> - <resolution>

## Decisions

- <decision title>
  - Context: <why this mattered>
  - Decision: <what was chosen>
  - Rationale: <why>
  - Impact: <what future work should assume>

## Notes

- <timestamp/kind> <note body>

## Artifacts And Paths

- <label>: `<absolute path or URL>`
  - Why it matters: <description>

## Milestones

- <status> <milestone title> - <summary/target if available>

## Exact Next Action

<One concrete next action. If blocked, say exactly what is needed.>

## Caveats

- <Missing context, known risk, or validation gap>
```

## Next-Chat Prompt Template

```text
Use JARVIS and continue this FocusLab sprint from the handoff below.

Project: <project/sprint title>
Goal: <sprint goal>
Current state: <short state>
Exact next action: <next action>
Blockers: <open blockers or "none">
Key files/artifacts: <most important paths>

Handoff:
<paste Markdown handoff or attach/export path>
```

## Handoff Readiness Rules

The export preview should show warnings, not hard failures, for:

- missing sprint goal
- missing current state
- no active/open task
- open blocker without `needed_from`
- decision without rationale
- artifact without path
- no exact next action

## Required Generation Logic

### Completed Work

Include tasks with `status = done`, ordered by completion time when available.

### Open Tasks

Include tasks with `status in (todo, active, blocked)`, ordered by priority then updated time.

### Blockers

Open blockers must be visible even if linked tasks are not visible. A handoff that hides blockers is considered weak.

### Decisions

Include all sprint decisions for Milestone 1. Later versions can allow selection.

### Notes

Include notes marked as `risk`, `progress`, or recent enough to matter. For Milestone 1, include all notes unless the user deselects them in preview.

### Artifacts

Always preserve exact paths. Do not rewrite local paths into vague labels.

### Exact Next Action

Prefer:

1. active task if one exists,
2. highest-priority open task if no active task exists,
3. blocker resolution if all open work is blocked,
4. milestone review if no open task remains.

## Sample Mini-Handoff

```md
# FocusLab M1 Handoff

Generated: 2026-04-28 18:00
App: FocusLab

## Fresh-Chat Starter

Use JARVIS and continue FocusLab Milestone 1. The architecture baseline is done, product workflow is defined, and the next step is implementing the single-sprint app shell with local persistence and handoff export. Rust/Cargo are still missing for Tauri packaging.

## Goal

Build the Single-Sprint Focus Loop Prototype.

## Current State

- Architecture baseline exists.
- Product workflow exists.
- Handoff contract exists.
- Tauri packaging is blocked until Rust/Cargo are installed.

## Completed Work

- [x] Define architecture baseline - committed as `410b426`.
- [x] Define product workflow - committed as `f0caeec`.

## Open Tasks

- [ ] P0 Implement Milestone 1 prototype.
- [ ] P1 Bootstrap Rust/Tauri local toolchain.

## Blockers

### Open

- Rust/Cargo missing
  - Blocks: Tauri dev/build
  - Needed from: Melih approval or local toolchain install
  - Detail: Vite build works, but desktop packaging cannot be verified.

## Decisions

- Stack direction
  - Context: Need a local private desktop app.
  - Decision: Use Tauri + React + TypeScript + SQLite.
  - Rationale: Smaller footprint than Electron, fast UI iteration, reliable local persistence.
  - Impact: Rust/Cargo are required.

## Artifacts And Paths

- Architecture: `docs/architecture.md`
- Data model: `docs/data-model.md`
- Product workflow: `docs/product-workflow.md`

## Exact Next Action

Implement the one-active-sprint app shell and persistence model, while keeping Tauri packaging marked blocked until Rust/Cargo are available.
```

## Acceptance Test For Desktop Engineer

Given a sample sprint with:

- one completed task,
- one active task,
- one open blocker,
- one decision,
- one artifact path,
- one milestone,

the generated Markdown must include all required sections and the next-chat prompt must name the exact next action and blocker status.

## Out-of-Box Decision

Idea considered: generate a "Fresh-Chat Starter" as the first section, not as a final appendix.

Decision: acted. The starter paragraph is the fastest bridge from FocusLab to a new JARVIS/Codex chat and should be visible immediately.

