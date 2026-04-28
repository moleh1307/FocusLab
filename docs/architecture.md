# Architecture

## Stack Decision

Decision: keep the Founder provisional stack for Milestone 1.

- Desktop shell: Tauri 2
- UI: React + TypeScript
- Build tooling: Vite 6
- Local persistence: SQLite
- Export format: generated Markdown and clipboard-ready plain text

## Rationale

Tauri is the best fit for FocusLab's constraints: local-first, private, offline, native-feeling macOS app, and smaller footprint than Electron. React/TypeScript keeps product iteration fast while supporting a polished command-heavy workflow. SQLite gives structured local persistence and reliable export generation without a server or cloud dependency.

Electron remains the fallback only if Tauri packaging becomes a real blocker. A local web-only app is useful for development but is not the product target.

## Local Tooling Check

Checked on 2026-04-28:

- Node: available, `v18.16.0`
- npm: available, `9.5.1`
- GitHub CLI: available and authenticated as `moleh1307`
- GitHub repo: `https://github.com/moleh1307/FocusLab`, currently empty/public
- Rust/Cargo: not installed
- Dependency audit: clean after using Vite `6.4.2`

Consequence: Vite/React development can start, but Tauri dev/build requires installing Rust/Cargo first.

## Repository Boundary

The project workspace contains a private Company Mode layer under `company/`. The public code repository must not include that operating memory by default, so `company/` is ignored in `.gitignore`.

Remote URL is known, but no push should occur until a clean local baseline is approved:

```text
https://github.com/moleh1307/FocusLab.git
```

## Runtime Architecture

```text
React UI
  |
  | user actions / command capture
  v
Application state services
  |
  | structured reads/writes
  v
SQLite local database
  |
  | deterministic snapshot
  v
Markdown handoff generator + clipboard prompt generator
```

## Storage Boundary

FocusLab owns its own local app data. It may link to files/folders and export Markdown on request, but it must not automatically mutate the JARVIS vault in v1.

Recommended local data location for the first implementation:

```text
~/Library/Application Support/FocusLab/focuslab.sqlite
```

For development, a repo-local ignored database under `.focuslab/dev.sqlite` is acceptable.

## Core Modules

- `SprintService`: create/read/update one active sprint.
- `TaskService`: flat tasks with optional parent id reserved for cheap subtasks later.
- `BlockerService`: first-class blockers linked optionally to a task.
- `DecisionService`: decision records with rationale and impact.
- `NoteService`: timestamped notes scoped to the active sprint.
- `ArtifactService`: file/folder path links with labels and optional relation to task/decision/blocker.
- `HandoffService`: deterministic Markdown and next-chat prompt generation from a snapshot.

## Export Rule

Handoff export should be generated from a read-only snapshot of current structured data. This prevents the export from depending on UI-only transient state and makes it testable.

## Privacy Rule

No network calls, cloud sync, telemetry, analytics, crash reporting, or remote model calls in v1.
