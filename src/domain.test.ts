import { describe, expect, it } from "vitest";
import { createInitialState } from "./domain";
import { generateMarkdownHandoff, getReadinessWarnings } from "./handoff";

describe("first-run sprint lifecycle state", () => {
  it("starts from a blank reusable sprint without project-specific seed data", () => {
    const state = createInitialState();

    expect(state.sprint.title).toBe("Untitled sprint");
    expect(state.sprint.goal).toBe("");
    expect(state.sprint.currentState).toBe("");
    expect(state.sprint.status).toBe("active");
    expect(state.tasks).toEqual([]);
    expect(state.blockers).toEqual([]);
    expect(state.decisions).toEqual([]);
    expect(state.notes).toEqual([]);
    expect(state.artifacts).toEqual([]);
    expect(state.milestones).toEqual([]);

    const serialized = JSON.stringify(state);
    expect(serialized).not.toContain("FocusLab Milestone");
    expect(serialized).not.toContain("Implement the single-sprint app shell");
    expect(serialized).not.toContain("SQLite");
  });

  it("warns that a blank sprint still needs handoff-critical setup", () => {
    const state = createInitialState();

    expect(getReadinessWarnings(state)).toEqual([
      "Missing sprint goal",
      "Missing current state",
      "No active or open task"
    ]);
  });

  it("exports explicit empty-state language instead of hiding missing context", () => {
    const state = createInitialState();
    const handoff = generateMarkdownHandoff(state);

    expect(handoff).toContain("# Untitled sprint Handoff");
    expect(handoff).toContain("No goal captured.");
    expect(handoff).toContain("No current state captured.");
    expect(handoff).toContain("Review milestone and decide whether the sprint is ready to close.");
  });
});
