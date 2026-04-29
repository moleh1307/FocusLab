import { describe, expect, it } from "vitest";
import {
  addArtifactPath,
  applyCapture,
  labelFromPath,
  resetSprintState,
  updateArtifactDescription,
  updateBlockerDetails,
  updateDecisionDetails
} from "./actions";
import { createInitialState } from "./domain";

const now = "2026-04-29T06:45:00.000Z";

function testOptions() {
  return {
    nowIso: () => now,
    createId: (prefix: string) => `${prefix}_test`
  };
}

describe("capture state transitions", () => {
  it("ignores empty capture text", () => {
    const state = createInitialState();

    expect(applyCapture(state, "   ", testOptions())).toBeNull();
  });

  it("captures unprefixed text as a P1 todo task", () => {
    const state = createInitialState();
    const next = applyCapture(state, "Write handoff tests", testOptions());

    expect(next?.tasks[0]).toMatchObject({
      id: "task_test",
      title: "Write handoff tests",
      status: "todo",
      priority: "P1",
      createdAt: now,
      updatedAt: now
    });
    expect(next?.sprint.updatedAt).toBe(now);
  });

  it("captures blockers, decisions, notes, and current state by prefix", () => {
    let state = createInitialState();
    state = applyCapture(state, "blocker: Waiting on local API key", testOptions()) ?? state;
    state = applyCapture(state, "decision: Keep SQLite local-only", testOptions()) ?? state;
    state = applyCapture(state, "risk: Reset flow needs confirmation", testOptions()) ?? state;
    state = applyCapture(state, "state: Ready for QA", testOptions()) ?? state;

    expect(state.blockers[0]).toMatchObject({
      id: "blocker_test",
      title: "Waiting on local API key",
      status: "open"
    });
    expect(state.decisions[0]).toMatchObject({
      id: "decision_test",
      title: "Keep SQLite local-only",
      decision: "Keep SQLite local-only"
    });
    expect(state.notes[0]).toMatchObject({
      id: "note_test",
      kind: "risk",
      body: "Reset flow needs confirmation"
    });
    expect(state.sprint.currentState).toBe("Ready for QA");
  });

  it("captures artifact labels and paths with the pipe shorthand", () => {
    const state = createInitialState();
    const next = applyCapture(state, "artifact: QA report | /tmp/focuslab-qa.md", testOptions());

    expect(next?.artifacts[0]).toMatchObject({
      id: "artifact_test",
      label: "QA report",
      path: "/tmp/focuslab-qa.md",
      kind: "file"
    });
  });
});

describe("reset state transition", () => {
  it("returns a blank first-run sprint", () => {
    const reset = resetSprintState();

    expect(reset.sprint.title).toBe("Untitled sprint");
    expect(reset.sprint.goal).toBe("");
    expect(reset.sprint.currentState).toBe("");
    expect(reset.tasks).toEqual([]);
    expect(reset.blockers).toEqual([]);
    expect(reset.decisions).toEqual([]);
  });
});

describe("artifact picker state transitions", () => {
  it("derives artifact labels from file and folder paths", () => {
    expect(labelFromPath("/Users/melih/project/report.md")).toBe("report.md");
    expect(labelFromPath("/Users/melih/project/output/")).toBe("output");
  });

  it("adds selected file and folder artifacts without changing the schema", () => {
    let state = createInitialState();
    state = addArtifactPath(state, "/Users/melih/project/report.md", "file", testOptions()) ?? state;
    state = addArtifactPath(state, "/Users/melih/project/output", "folder", testOptions()) ?? state;

    expect(state.artifacts[0]).toMatchObject({
      id: "artifact_test",
      label: "output",
      path: "/Users/melih/project/output",
      kind: "folder"
    });
    expect(state.artifacts[1]).toMatchObject({
      id: "artifact_test",
      label: "report.md",
      path: "/Users/melih/project/report.md",
      kind: "file"
    });
  });

  it("ignores empty picker selections", () => {
    const state = createInitialState();

    expect(addArtifactPath(state, "  ", "file", testOptions())).toBeNull();
  });

  it("updates artifact descriptions for handoff context", () => {
    let state = createInitialState();
    state = addArtifactPath(state, "/Users/melih/project/report.md", "file", testOptions()) ?? state;

    const next = updateArtifactDescription(state, "artifact_test", "Final QA report used for the handoff.", testOptions());

    expect(next.artifacts[0]).toMatchObject({
      description: "Final QA report used for the handoff."
    });
    expect(next.sprint.updatedAt).toBe(now);
  });
});

describe("handoff detail state transitions", () => {
  it("updates blocker needed-from and detail fields", () => {
    let state = createInitialState();
    state = applyCapture(state, "blocker: Waiting on API key", testOptions()) ?? state;

    const next = updateBlockerDetails(
      state,
      "blocker_test",
      { neededFrom: "Platform owner", description: "Need a local-only test credential." },
      testOptions()
    );

    expect(next.blockers[0]).toMatchObject({
      neededFrom: "Platform owner",
      description: "Need a local-only test credential."
    });
    expect(next.sprint.updatedAt).toBe(now);
  });

  it("updates decision context, rationale, and impact fields", () => {
    let state = createInitialState();
    state = applyCapture(state, "decision: Keep SQLite snapshot storage", testOptions()) ?? state;

    const next = updateDecisionDetails(
      state,
      "decision_test",
      {
        context: "v1 only needs one active sprint.",
        rationale: "Snapshot persistence is reliable and simple.",
        impact: "Normalized tables can wait for multi-sprint scale."
      },
      testOptions()
    );

    expect(next.decisions[0]).toMatchObject({
      context: "v1 only needs one active sprint.",
      rationale: "Snapshot persistence is reliable and simple.",
      impact: "Normalized tables can wait for multi-sprint scale."
    });
    expect(next.sprint.updatedAt).toBe(now);
  });
});
