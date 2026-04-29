import { Artifact, createId, createInitialState, FocusLabState, Note, nowIso } from "./domain";

type IdFactory = typeof createId;
type TimeFactory = typeof nowIso;
type ArtifactKind = Extract<Artifact["kind"], "file" | "folder">;

function withUpdatedSprint(state: FocusLabState, updatedAt: string): FocusLabState {
  return {
    ...state,
    sprint: {
      ...state.sprint,
      updatedAt
    }
  };
}

export function resetSprintState() {
  return createInitialState();
}

export function labelFromPath(path: string) {
  const cleaned = path.trim().replace(/[\\/]+$/, "");
  const parts = cleaned.split(/[\\/]/);

  return parts.at(-1) || "Artifact";
}

export function addArtifactPath(
  state: FocusLabState,
  path: string,
  kind: ArtifactKind,
  options: { createId?: IdFactory; nowIso?: TimeFactory } = {}
): FocusLabState | null {
  const trimmedPath = path.trim();
  if (!trimmedPath) return null;

  const makeId = options.createId ?? createId;
  const makeNow = options.nowIso ?? nowIso;
  const now = makeNow();
  const next = withUpdatedSprint(state, now);

  return {
    ...next,
    artifacts: [
      {
        id: makeId("artifact"),
        label: labelFromPath(trimmedPath),
        path: trimmedPath,
        kind,
        description: "",
        createdAt: now
      },
      ...state.artifacts
    ]
  };
}

export function applyCapture(
  state: FocusLabState,
  rawCapture: string,
  options: { createId?: IdFactory; nowIso?: TimeFactory } = {}
): FocusLabState | null {
  const text = rawCapture.trim();
  if (!text) return null;

  const makeId = options.createId ?? createId;
  const makeNow = options.nowIso ?? nowIso;
  const now = makeNow();
  const [rawPrefix, ...rest] = text.split(":");
  const prefix = rest.length ? rawPrefix.toLowerCase().trim() : "task";
  const body = rest.length ? rest.join(":").trim() : text;
  const next = withUpdatedSprint(state, now);

  if (prefix === "blocker") {
    return {
      ...next,
      blockers: [
        {
          id: makeId("blocker"),
          title: body,
          status: "open",
          neededFrom: "",
          description: "",
          createdAt: now
        },
        ...state.blockers
      ]
    };
  }

  if (prefix === "decision") {
    return {
      ...next,
      decisions: [
        {
          id: makeId("decision"),
          title: body,
          context: "",
          decision: body,
          rationale: "",
          impact: "",
          createdAt: now
        },
        ...state.decisions
      ]
    };
  }

  if (prefix === "note" || prefix === "progress" || prefix === "risk" || prefix === "idea") {
    const kind: Note["kind"] = prefix === "progress" || prefix === "risk" || prefix === "idea" ? prefix : "note";

    return {
      ...next,
      notes: [
        {
          id: makeId("note"),
          kind,
          body,
          createdAt: now
        },
        ...state.notes
      ]
    };
  }

  if (prefix === "artifact") {
    const [label, path] = body.includes("|") ? body.split("|").map((part) => part.trim()) : ["Artifact", body];

    return {
      ...next,
      artifacts: [
        {
          id: makeId("artifact"),
          label,
          path,
          kind: "file",
          description: "",
          createdAt: now
        },
        ...state.artifacts
      ]
    };
  }

  if (prefix === "state") {
    return {
      ...next,
      sprint: {
        ...next.sprint,
        currentState: body
      }
    };
  }

  return {
    ...next,
    tasks: [
      {
        id: makeId("task"),
        title: body,
        status: "todo",
        priority: "P1",
        createdAt: now,
        updatedAt: now
      },
      ...state.tasks
    ]
  };
}
