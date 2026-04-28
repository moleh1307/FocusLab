# Prototype Status

## Implemented In Current Prototype

- One active sprint workspace.
- Quick capture input with `task:`, `blocker:`, `decision:`, `note:`, `progress:`, `risk:`, `idea:`, `artifact:`, and `state:` prefixes.
- Task list with status and priority controls.
- First-class blockers, decisions, notes, and artifacts rails.
- Handoff readiness warnings.
- Markdown handoff preview.
- Clipboard-ready next-chat prompt copy.
- Markdown copy and save actions.
- Browser local persistence for development preview.
- Tauri desktop shell.
- SQLite persistence in `~/Library/Application Support/FocusLab/focuslab.sqlite`.
- Debug `.app` and `.dmg` bundle outputs.

## Verification

Checked on 2026-04-28:

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

## Known Gaps

- No automated test suite yet.
- Current SQLite database contains a QA smoke-test task from verification unless reset later.

## Next Engineering Step

Add automated tests for handoff generation and storage behavior, then run a final product review with Melih.
