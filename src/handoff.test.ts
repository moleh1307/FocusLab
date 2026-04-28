import { describe, expect, it } from "vitest";
import { createInitialState } from "./domain";
import { generateMarkdownHandoff, generateNextChatPrompt, getExactNextAction, getReadinessWarnings } from "./handoff";

describe("handoff generation", () => {
  it("includes restart-critical sections and exact paths", () => {
    const state = createInitialState();
    const markdown = generateMarkdownHandoff(state);

    expect(markdown).toContain("## Fresh-Chat Starter");
    expect(markdown).toContain("## Goal");
    expect(markdown).toContain("## Current State");
    expect(markdown).toContain("## Open Tasks");
    expect(markdown).toContain("## Decisions");
    expect(markdown).toContain("## Artifacts And Paths");
    expect(markdown).toContain("## Exact Next Action");
    expect(markdown).toContain("/Users/melihkarakose/Projects/Active/FocusLab/docs/architecture.md");
  });

  it("prefers the active task as the exact next action", () => {
    const state = createInitialState();

    expect(getExactNextAction(state)).toBe("Continue active task: Implement the single-sprint app shell");
  });

  it("reports missing handoff-critical context as readiness warnings", () => {
    const state = createInitialState();
    state.sprint.goal = "";
    state.decisions[0].rationale = "";
    state.artifacts[0].path = "";

    expect(getReadinessWarnings(state)).toEqual(
      expect.arrayContaining(["Missing sprint goal", "Decision without rationale", "Artifact without path"])
    );
  });

  it("creates a clipboard-ready next-chat prompt", () => {
    const state = createInitialState();
    const prompt = generateNextChatPrompt(state);

    expect(prompt).toContain("Use JARVIS and continue this FocusLab sprint");
    expect(prompt).toContain("Project: FocusLab Milestone 1");
    expect(prompt).toContain("Exact next action: Continue active task: Implement the single-sprint app shell");
    expect(prompt).toContain("Handoff:");
  });
});

