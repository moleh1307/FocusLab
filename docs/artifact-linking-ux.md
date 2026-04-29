# Artifact Linking UX

## Decision

Use a native file/folder picker for artifact linking, backed by Tauri's dialog plugin, while keeping the existing `artifact:` text capture as a fast fallback.

Official Tauri reference: https://v2.tauri.app/plugin/dialog/

## Rationale

Artifact links are handoff-critical because new JARVIS/Codex chats need exact file and folder paths. Manual path entry works for power users, but it is too easy to mistype paths and too slow for repeated sprint capture.

The current data model already supports:

- `kind: "file"`
- `kind: "folder"`
- `kind: "url"`
- `kind: "repo"`
- `kind: "output"`
- exact `path`
- human-readable `label`

The implementation should improve capture, not change the schema.

## Target Interaction

The Artifacts rail should expose two icon+text actions:

- `Add file`
- `Add folder`

Both actions should open a native picker. After the user selects a path:

1. FocusLab creates an artifact immediately.
2. `label` defaults to the file or folder basename.
3. `path` stores the exact selected local path.
4. `kind` is `file` or `folder`.
5. `description` remains empty until edited later.
6. The artifact appears at the top of the Artifacts rail.
7. The handoff export includes the exact path.

If the user cancels the picker, no artifact is created and no warning is shown.

## Fast Capture Fallback

Keep the existing command input:

```text
artifact: Label | /absolute/path
```

This remains useful when pasting paths from Terminal, Finder, or another agent.

## Dependency And Permission Boundary

Implementation should use Tauri's official dialog plugin:

```bash
npm run tauri add dialog
```

That command changes project dependencies and Tauri permissions, so it requires action-time approval before execution.

Expected permission surface:

- Native open dialog.
- File picker.
- Folder picker.
- No file reads or writes from selected paths.
- No automatic upload, sync, or JARVIS vault mutation.

FocusLab should store the selected path only. It should not inspect file contents in this milestone.

## Not In Scope

- Opening files/folders from FocusLab.
- Previewing file contents.
- Validating path existence after selection.
- Watching file changes.
- Copying files into FocusLab.
- Writing to selected paths.
- Automatic JARVIS vault mutation.

## Acceptance Criteria For Implementation

- `Add file` creates a `file` artifact with exact selected path.
- `Add folder` creates a `folder` artifact with exact selected path.
- Canceling either picker leaves state unchanged.
- Existing `artifact:` capture still works.
- Handoff output preserves exact paths.
- Playwright coverage uses a mocked picker seam rather than opening native OS dialogs.
