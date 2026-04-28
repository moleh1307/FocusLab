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
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  const id = randomUUID ? randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${id}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function createInitialState(): FocusLabState {
  const now = nowIso();

  return {
    sprint: {
      id: createId("sprint"),
      title: "Untitled sprint",
      goal: "",
      status: "active",
      currentState: "",
      startedAt: now,
      updatedAt: now
    },
    tasks: [],
    blockers: [],
    decisions: [],
    notes: [],
    artifacts: [],
    milestones: []
  };
}
