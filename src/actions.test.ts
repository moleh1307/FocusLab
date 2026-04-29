import { describe, expect, it } from "vitest";
import { applyCapture, resetSprintState } from "./actions";
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
