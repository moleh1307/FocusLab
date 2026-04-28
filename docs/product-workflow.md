# Product Workflow

## Product Shape

FocusLab's first screen should feel like an active sprint cockpit, not a todo board. The core question it answers is:

> If this session ended now, would a new JARVIS/Codex chat know exactly what to do next?

The UI should make handoff completeness visible while work happens, instead of treating export as an afterthought.

## First-Screen Layout

Use a dense three-zone layout:

```text
Top bar: sprint title, current status, quick capture, export/handoff action

Left rail: session map
- Goal
- Milestone
- Current state
- Handoff readiness checklist
- Search

Center: execution lane
- Active task
- Open tasks
- Completed work

Right rail: continuity lane
- Open blockers
- Decisions
- Notes
- Artifacts/files
```

The center should show work state. The right rail should show context that would otherwise be lost in a chat switch.

## Primary Interaction Model

### Fast Capture

Provide one command-style capture input with typed shortcuts:

- `task:` create task
- `blocker:` create blocker
- `decision:` create decision
- `note:` create note
- `artifact:` attach/link file or folder path
- `state:` update current sprint state

This gives Raycast-like speed without needing a full command palette in the first implementation.

### Focused Editing

Clicking any item opens an inline or side-panel editor. Avoid modal-heavy flows. The app should keep the active sprint visible while details are edited.

### Handoff Export

Export should be a first-class action in the top bar. Before export, show a compact preview with missing-context warnings:

- no current state
- no next task
- open blockers without needed-from
- decisions without rationale
- artifacts without path

Warnings should not block export in v1, but they should teach the user what makes a handoff stronger.

## Required Screens / States

### Empty State

The empty state should create one active sprint immediately:

- sprint title
- goal
- first milestone optional

Avoid a dashboard of blank cards.

### Active Sprint

The main state shows:

- current goal and status
- active task
- open tasks
- first-class blockers
- decisions
- notes
- artifact links
- handoff readiness

### Export Preview

Shows:

- Markdown handoff preview
- next-chat prompt preview
- copy buttons
- save/export Markdown action

## Visual Direction

- Dark mode first.
- Quiet operational palette, not single-hue purple/blue.
- Use strong contrast and restrained accent color.
- Cards should be sparse and functional; avoid nested cards.
- Dense but breathable information layout.
- No marketing hero, no decorative blobs, no generic SaaS dashboard filler.
- 8px radius max unless a component needs less.

## Interaction Priorities

1. Capture new work in under two seconds.
2. See blockers without hunting.
3. See current state and next action at all times.
4. Export a clean handoff without manual rewriting.
5. Resume the app without data loss.

## Implementation Guidance

For Milestone 1, Desktop Engineer should implement:

- one active sprint shell
- quick capture input
- simple segmented views or sections for tasks/blockers/decisions/notes/artifacts
- handoff readiness checklist
- export preview route/panel

Do not implement:

- multi-project navigation
- team/role workflows
- dashboards with analytics
- rich text editor
- semantic search

## Quality Criteria

The prototype is visually acceptable only if:

- it does not look like a generic todo app,
- blockers and decisions are visible without navigation,
- the handoff/export action is prominent,
- text fits cleanly at desktop widths,
- the empty state leads directly into creating a sprint,
- the UI feels fast and calm rather than decorative.

## Out-of-Box Decision

Idea considered: make the handoff readiness checklist a visible product primitive, not a hidden export validation step.

Decision: acted. This becomes part of the first-screen layout because it directly supports the core pain: losing context across chats.

