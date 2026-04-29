# FocusLab

FocusLab is a local, offline-first desktop app for managing one active research/build sprint and exporting clean handoffs for a fresh JARVIS/Codex chat.

## Current Status

Version: `0.1.0`

Milestone 1, the Single-Sprint Focus Loop Prototype, is implemented and internally accepted:

- Tauri desktop shell
- React + TypeScript UI
- SQLite persistence
- one active sprint
- tasks with execution notes
- first-class blockers
- notes
- decisions
- editable blocker and decision handoff details
- milestones
- local artifact/file links with handoff descriptions
- Markdown handoff export
- visible clipboard-ready next-chat prompt
- guarded new-sprint reset
- polished operations-cockpit UI with sprint signal metrics and stronger handoff readiness emphasis
- automated tests for handoff, lifecycle, storage serialization, capture/reset transitions, handoff detail editing, task note export, rendered UI flows, and SQLite persistence internals

Debug bundle outputs are produced locally under:

- `src-tauri/target/debug/bundle/macos/FocusLab.app`
- `src-tauri/target/debug/bundle/dmg/FocusLab_0.1.0_aarch64.dmg`

## Product Principles

- Local-only and offline by default.
- No telemetry, no cloud sync, no remote services.
- App data is separate from the JARVIS vault.
- JARVIS markdown export is explicit and user-triggered.
- Handoff quality matters more than generic task-app breadth.

## Setup

Requirements:

- Node.js `>=18.19 <21 || >=22`
- npm
- Rust/Cargo for Tauri builds

Install dependencies:

```bash
npm install
```

Run the web preview:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run rendered UI tests:

```bash
npm run test:ui
```

Build the frontend:

```bash
npm run build
```

Check the Tauri/Rust side:

```bash
cargo check --manifest-path src-tauri/Cargo.toml
```

Build a debug desktop bundle:

```bash
npm run tauri -- build --debug
```

## Local Data

FocusLab stores desktop app state in SQLite:

```text
~/Library/Application Support/FocusLab/focuslab.sqlite
```

The development web preview uses browser local storage as a fallback adapter.

## Company Mode State

The local Company Mode operating layer lives in:

```text
company/
```

That folder is intentionally ignored by git because it contains private local planning and role memory. Public repo status is reflected through this README, `CHANGELOG.md`, and the documents under `docs/`.

## Documentation

- [Architecture](docs/architecture.md)
- [Data Model](docs/data-model.md)
- [Product Workflow](docs/product-workflow.md)
- [Artifact Linking UX](docs/artifact-linking-ux.md)
- [Handoff Contract](docs/handoff-contract.md)
- [Implementation Plan](docs/implementation-plan.md)
- [Prototype Status](docs/prototype-status.md)
- [Web-Shell QA Report](docs/qa-web-shell.md)
- [Desktop QA Report](docs/qa-desktop.md)
- [Release Readiness](docs/release-readiness.md)

## Known Limitations

- Debug build only; no signed release artifact yet.
- SQLite currently stores the sprint as a JSON snapshot. This is acceptable for `0.1.0` but should migrate before multi-project/multi-sprint scale.
- Rendered UI automation currently targets the Vite app shell, not the packaged Tauri window.
