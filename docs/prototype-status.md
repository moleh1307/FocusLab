# Prototype Status

## Implemented In Current Prototype

- One active sprint workspace.
- Quick capture input with `task:`, `blocker:`, `decision:`, `note:`, `progress:`, `risk:`, `idea:`, `artifact:`, and `state:` prefixes.
- Task list with status and priority controls.
- Task execution notes that appear in active-task context and Markdown handoffs.
- First-class blockers, decisions, notes, and artifacts rails.
- Handoff readiness warnings.
- Markdown handoff preview.
- Visible clipboard-ready next-chat prompt preview and copy.
- Markdown copy and save actions.
- Browser local persistence for development preview.
- Tauri desktop shell.
- SQLite persistence in `~/Library/Application Support/FocusLab/focuslab.sqlite`.
- Debug `.app` and `.dmg` bundle outputs.
- Clean first-run state with editable sprint title, empty goal/current-state fields, and empty-section guidance.
- Guarded New sprint action with an in-app confirmation for intentionally clearing the current local sprint state.
- Native Add file and Add folder actions for artifact linking.
- Editable artifact descriptions that appear in Markdown handoff exports.
- Editable blocker needed-from/detail and decision context/rationale/impact fields.

## Verification

Checked through 2026-04-29:

- `npm run build` passes.
- `npm audit --audit-level=moderate` reports zero vulnerabilities.
- In-app browser render checked at narrow viewport.
- Handoff export preview includes `Fresh-Chat Starter`, `Exact Next Action`, and the known Rust/Cargo blocker.
- Capture persistence smoke test passed after reload in browser local storage.
- Rust/Cargo installed and verified with `rustc 1.95.0` and `cargo 1.95.0`.
- `cargo check --manifest-path src-tauri/Cargo.toml` passes.
- `npm run tauri -- build --debug` produced:
  - `src-tauri/target/debug/bundle/macos/FocusLab.app`
  - `src-tauri/target/debug/bundle/dmg/FocusLab_0.1.0_aarch64.dmg`
- Desktop app rendered in a native Tauri window.
- Desktop SQLite persistence smoke test passed after app restart.
- First-run setup state rendered without project-specific seed data.
- `npm test` covers handoff generation, first-run/reset lifecycle invariants, storage serialization, capture/reset state transitions, artifact description updates, task note updates, and blocker/decision detail updates.
- `cargo test --manifest-path src-tauri/Cargo.toml` covers SQLite persistence internals.
- `npm run test:ui` covers rendered reset, prompt/Markdown handoff export, artifact picker, artifact-description export, task-note export, and blocker/decision detail flows in Chromium against the Vite app shell.
- Packaged debug app smoke checks passed for reset, native artifact picker rendering, artifact descriptions, blocker/decision details, task execution notes, and visible prompt/Markdown handoff preview layout. Temporary QA data was reset after each packaged smoke.

## Known Gaps

- Rendered UI automation targets the Vite app shell, not the packaged Tauri window.
- Debug bundle only; no signed/notarized release artifact has been created.

## Next Engineering Step

Refresh release readiness and owner-review criteria before adding more prototype polish.
