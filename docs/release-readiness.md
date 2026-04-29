# Release Readiness

Status: preparatory checklist only. No release, tag, signing, notarization, upload, or distribution has been performed.

## Current Candidate

- Version: `0.1.0`
- Current release type: local debug prototype
- Current branch: `main`
- Current distribution artifacts:
  - `src-tauri/target/debug/bundle/macos/FocusLab.app`
  - `src-tauri/target/debug/bundle/dmg/FocusLab_0.1.0_aarch64.dmg`

## Required Verification Before Any Release Decision

Run with Node.js `>=18.19 <21 || >=22`:

```bash
npm test
npm run test:ui
npm run build
npm audit --audit-level=moderate
```

Run with the local Rust/Cargo toolchain:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
npm run tauri -- build --debug
```

## Manual Checks

- Launch the debug `.app`.
- Confirm first-run state is blank and generic.
- Capture a task, blocker, decision, note, artifact, and current state.
- Open Handoff and verify Fresh-Chat Starter, Exact Next Action, open tasks, blockers, decisions, and artifact paths.
- Verify New sprint cancel preserves data.
- Verify New sprint clear resets to blank first-run state.
- Confirm no cloud, telemetry, remote sync, or automatic JARVIS vault mutation exists.

## Public Release Blockers

- Debug build only; no signed release artifact.
- No macOS signing or notarization workflow.
- No release tag or GitHub release process defined.
- Rendered UI automation targets the Vite app shell, not the packaged Tauri window.
- SQLite persistence stores the sprint as a JSON snapshot, acceptable for `0.1.0` but not the intended long-term multi-project shape.

## Release Decision Boundary

Creating a git tag, GitHub release, signed/notarized artifact, uploaded build, or public distribution requires a future explicit decision.
