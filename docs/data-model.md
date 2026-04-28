# Data Model

## Design Goals

- Support one active sprint cleanly in Milestone 1.
- Preserve enough structure to generate strong handoffs.
- Avoid premature multi-project complexity.
- Keep future multi-sprint/project support possible.

## Entities

### `sprints`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `title` | text | Sprint name |
| `goal` | text | Main objective |
| `status` | text | `active`, `paused`, `completed` |
| `started_at` | text | ISO timestamp |
| `ended_at` | text nullable | ISO timestamp |
| `current_state` | text | Short operational state |
| `created_at` | text | ISO timestamp |
| `updated_at` | text | ISO timestamp |

### `tasks`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `title` | text | Required |
| `status` | text | `todo`, `active`, `blocked`, `done`, `dropped` |
| `priority` | text | `P0`, `P1`, `P2` |
| `parent_task_id` | text nullable | Reserved for cheap subtasks |
| `notes` | text nullable | Lightweight task-specific notes |
| `created_at` | text | ISO timestamp |
| `updated_at` | text | ISO timestamp |
| `completed_at` | text nullable | ISO timestamp |

### `blockers`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `task_id` | text nullable | Optional link |
| `title` | text | Required |
| `description` | text nullable | What is blocked and why |
| `status` | text | `open`, `resolved`, `deferred` |
| `needed_from` | text nullable | Person/tool/decision needed |
| `resolution` | text nullable | How it was resolved |
| `created_at` | text | ISO timestamp |
| `resolved_at` | text nullable | ISO timestamp |

### `decisions`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `title` | text | Decision label |
| `context` | text | Why the decision was needed |
| `decision` | text | What was chosen |
| `rationale` | text nullable | Why |
| `impact` | text nullable | Consequence for future work |
| `created_at` | text | ISO timestamp |

### `notes`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `body` | text | Markdown/plain text |
| `kind` | text | `note`, `progress`, `risk`, `idea` |
| `created_at` | text | ISO timestamp |

### `artifacts`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `label` | text | Human-readable name |
| `path` | text | Absolute local path or file URL |
| `kind` | text | `file`, `folder`, `url`, `repo`, `output` |
| `description` | text nullable | Why it matters |
| `created_at` | text | ISO timestamp |

### `milestones`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `title` | text | Required |
| `status` | text | `planned`, `active`, `reached`, `missed` |
| `target_at` | text nullable | Optional ISO timestamp |
| `summary` | text nullable | Outcome or expectation |
| `created_at` | text | ISO timestamp |
| `updated_at` | text | ISO timestamp |

### `handoff_exports`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | text primary key | Stable UUID/ULID |
| `sprint_id` | text | Required |
| `markdown` | text | Generated handoff |
| `next_chat_prompt` | text | Clipboard-ready prompt |
| `generated_at` | text | ISO timestamp |

## Handoff Snapshot

The handoff generator should assemble a snapshot containing:

- sprint goal and current state
- completed tasks
- active/open tasks
- open blockers
- resolved blockers if relevant
- decisions
- notes selected for handoff
- artifact paths
- milestones
- exact next action

## Search Scope

Milestone 1 basic search should query task titles, blocker titles/descriptions, decision text, note body, artifact labels/paths, and milestone titles. SQLite `LIKE` search is enough for v1; full-text search can wait.

