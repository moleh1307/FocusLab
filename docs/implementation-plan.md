# Implementation Plan

## Milestone 1 Sequence

1. Product Designer defines the one-active-sprint workflow and UI direction.
2. Handoff Systems Designer defines the Markdown handoff and next-chat prompt contract.
3. Desktop Engineer implements the prototype.
4. QA / Release Engineer verifies persistence, export quality, privacy/offline behavior, and visual quality.
5. Founder reviews with Melih before final milestone acceptance.

## Engineering Slice

### Slice 1: App Shell

- Vite/React app runs locally.
- Dark-mode-first visual foundation.
- One active sprint placeholder state.

### Slice 2: Local Data

- SQLite schema/migrations.
- Create/load active sprint.
- CRUD for tasks, blockers, notes, decisions, artifacts, milestones.

Current implementation note: the web-shell prototype uses browser local storage as a development adapter. This is useful for workflow validation but must be replaced with SQLite before desktop readiness.

### Slice 3: Focus Workflow

- Fast capture for common entries.
- Active/open/done task sections.
- Blocker list as first-class surface.
- Decision capture with context/rationale.
- Artifact path capture.

### Slice 4: Handoff Export

- Generate deterministic Markdown from current sprint snapshot.
- Generate clipboard-ready next-chat prompt.
- Export file save and clipboard copy.

### Slice 5: Verification Polish

- Restart persistence check.
- Export completeness fixture.
- Desktop visual QA.
- Offline/privacy check.

## Tooling Requirements

Current machine has Node/npm but not Rust/Cargo. Before Tauri dev/build:

```bash
rustc --version
cargo --version
```

must succeed.

If Rust remains unavailable, Desktop Engineer may implement and test the React/Vite app shell first, but the desktop milestone cannot be marked ready.

## Git Plan

- Initialize local git on `main`.
- Add remote `origin` as `https://github.com/moleh1307/FocusLab.git`.
- Do not push until the local baseline is clean and Melih approves.
- Keep `company/` ignored because it contains private Company Mode operating memory.
