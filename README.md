# FocusLab

FocusLab is a local, offline-first desktop app for managing one active research/build sprint and exporting clean handoffs for a fresh JARVIS/Codex chat.

## Milestone 1

The first milestone is the Single-Sprint Focus Loop Prototype:

- one active sprint
- tasks
- first-class blockers
- notes
- decisions
- milestones
- local artifact/file links
- local persistence
- Markdown handoff export
- clipboard-ready next-chat prompt

## Product Principles

- Local-only and offline by default.
- No telemetry, no cloud sync, no remote services.
- App data is separate from the JARVIS vault.
- JARVIS markdown export is explicit and user-triggered.
- Handoff quality matters more than generic task-app breadth.

## Stack Direction

Architecture baseline: Tauri + React + TypeScript + SQLite.

Current local prerequisite gap: Rust/Cargo are not installed on this machine yet, so Tauri dev/build cannot run until the Rust toolchain is installed.

## Documentation

- [Architecture](docs/architecture.md)
- [Data Model](docs/data-model.md)
- [Product Workflow](docs/product-workflow.md)
- [Handoff Contract](docs/handoff-contract.md)
- [Implementation Plan](docs/implementation-plan.md)
