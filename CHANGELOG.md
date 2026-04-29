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
- Added Rust tests for SQLite persistence internals.
- Added Playwright rendered UI tests for reset and handoff export flows.
- Added a release readiness checklist for local debug prototype review.
- Added artifact linking UX decision for native file/folder picker flow.
- Added native file/folder picker actions for artifact links.
- Added editable artifact descriptions so handoff exports explain why linked files/folders matter.
- Added blocker and decision detail editing so readiness warnings can be resolved from the UI.
- Added task execution notes so active/open task handoffs carry resume context.
- Added visible next-chat prompt preview inside the handoff export modal.
- Refined the cockpit UI with stronger visual hierarchy, sprint signal metrics, readiness emphasis, count badges, and polished desktop panel styling.
- Replaced the generic gradient-dashboard styling with a flatter instrument-panel visual direction for the cockpit UI.
- Reworked the UI into a joined command deck and three-zone workbench composition for a more signature FocusLab surface.
- Published the public GitHub baseline at `https://github.com/moleh1307/FocusLab`.
