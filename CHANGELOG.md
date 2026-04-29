# Changelog

## 0.1.0 - 2026-04-28

- Built the Single-Sprint Focus Loop Prototype.
- Added Tauri desktop shell with React and TypeScript.
- Added SQLite snapshot persistence at `~/Library/Application Support/FocusLab/focuslab.sqlite`.
- Added quick capture for tasks, blockers, decisions, notes, artifacts, and current state.
- Added first-class blockers, decisions, notes, artifacts, and handoff readiness surfaces.
- Added Markdown handoff export, clipboard-ready next-chat prompt, and Markdown save action.
- Added desktop QA evidence and initial automated handoff tests.
- Replaced project-specific seed data with a reusable first-run sprint setup state.
- Added a guarded New sprint action with an in-app confirmation for clearing local sprint state intentionally.
- Added lifecycle tests for first-run/reset state invariants.
- Added storage serialization tests for local persistence fallback and round-trip behavior.
- Extracted capture/reset state transitions and added unit coverage for core execution actions.
- Published the public GitHub baseline at `https://github.com/moleh1307/FocusLab`.
