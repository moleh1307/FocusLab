export type Status = "todo" | "active" | "blocked" | "done" | "dropped";
export type Priority = "P0" | "P1" | "P2";

export interface Sprint {
  id: string;
  title: string;
  goal: string;
  status: "active" | "paused" | "completed";
  currentState: string;
  startedAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blocker {
  id: string;
  title: string;
  description?: string;
  status: "open" | "resolved" | "deferred";
  neededFrom?: string;
  resolution?: string;
  taskId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  rationale?: string;
  impact?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  kind: "note" | "progress" | "risk" | "idea";
  body: string;
  createdAt: string;
}

export interface Artifact {
  id: string;
  label: string;
  path: string;
  kind: "file" | "folder" | "url" | "repo" | "output";
  description?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: "planned" | "active" | "reached" | "missed";
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusLabState {
  sprint: Sprint;
  tasks: Task[];
  blockers: Blocker[];
  decisions: Decision[];
  notes: Note[];
  artifacts: Artifact[];
  milestones: Milestone[];
}

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function createInitialState(): FocusLabState {
  const now = nowIso();

  return {
    sprint: {
      id: createId("sprint"),
      title: "FocusLab Milestone 1",
      goal: "Build a single-sprint execution and handoff prototype for JARVIS/Codex work.",
      status: "active",
      currentState: "Architecture, product workflow, and handoff contract are defined. Implementation is active.",
      startedAt: now,
      updatedAt: now
    },
    tasks: [
      {
        id: createId("task"),
        title: "Implement the single-sprint app shell",
        status: "active",
        priority: "P0",
        createdAt: now,
        updatedAt: now
      }
    ],
    blockers: [
      {
        id: createId("blocker"),
        title: "Rust/Cargo missing for Tauri packaging",
        description: "Vite/React can build, but final desktop packaging needs the Rust toolchain.",
        status: "open",
        neededFrom: "Melih approval or local Rust installation",
        createdAt: now
      }
    ],
    decisions: [
      {
        id: createId("decision"),
        title: "Keep Tauri + React + TypeScript + SQLite direction",
        context: "FocusLab needs a local, private, native-feeling macOS app.",
        decision: "Use Tauri, React, TypeScript, and SQLite for Milestone 1.",
        rationale: "This gives a smaller desktop footprint than Electron, fast UI iteration, and reliable local persistence.",
        impact: "Rust/Cargo are required before final Tauri verification.",
        createdAt: now
      }
    ],
    notes: [
      {
        id: createId("note"),
        kind: "progress",
        body: "Company Mode initialized; architecture, workflow, and handoff contract are available in docs/.",
        createdAt: now
      }
    ],
    artifacts: [
      {
        id: createId("artifact"),
        label: "Architecture docs",
        path: "/Users/melihkarakose/Projects/Active/FocusLab/docs/architecture.md",
        kind: "file",
        description: "Stack, storage boundary, and module plan.",
        createdAt: now
      },
      {
        id: createId("artifact"),
        label: "Handoff contract",
        path: "/Users/melihkarakose/Projects/Active/FocusLab/docs/handoff-contract.md",
        kind: "file",
        description: "Markdown export and next-chat prompt contract.",
        createdAt: now
      }
    ],
    milestones: [
      {
        id: createId("milestone"),
        title: "Single-Sprint Focus Loop Prototype",
        status: "active",
        summary: "One active sprint with tasks, blockers, decisions, notes, artifacts, and handoff export.",
        createdAt: now,
        updatedAt: now
      }
    ]
  };
}

