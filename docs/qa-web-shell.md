# QA Report: Web-Shell Prototype

Date: 2026-04-28

## Scope

This QA pass covered the React/Vite web-shell prototype before desktop integration. It is superseded for desktop readiness by the later Tauri/SQLite verification recorded in `docs/prototype-status.md`.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Build | Pass | `npm run build` completed successfully with Vite `6.4.2` |
| Dependency audit | Pass | `npm audit --audit-level=moderate` found 0 vulnerabilities |
| Handoff preview | Pass | Export preview includes `Fresh-Chat Starter`, `Exact Next Action`, and the Rust/Cargo blocker |
| Persistence smoke | Pass for development adapter | Captured task persisted after browser reload using local storage |
| Visual smoke | Pass after responsive fix | In-app browser narrow viewport no longer clips the main layout |
| Offline/privacy source scan | Pass for app source | No `fetch`, `XMLHttpRequest`, `sendBeacon`, analytics, or telemetry calls found in `src/` |
| Git baseline | Pass | Public-safe files committed; `company/`, `dist/`, `node_modules/`, and build info are ignored |

## Blocking Gaps

- Rust/Cargo are not installed, so Tauri dev/build cannot run.
- SQLite persistence is not implemented yet.
- No packaged macOS app exists yet.
- No automated UI/export tests exist yet.

## Recommendation

Continue implementation, not user-review acceptance.

The web-shell prototype is useful enough to guide the next engineering step, but Milestone 1 should not be marked ready for Melih review until:

1. Rust/Cargo are available.
2. Tauri shell is added.
3. SQLite persistence replaces browser local storage.
4. QA verifies restart persistence in the desktop app.
