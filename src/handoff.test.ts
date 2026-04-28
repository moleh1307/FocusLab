import { describe, expect, it } from "vitest";
import { createInitialState, FocusLabState, nowIso } from "./domain";
import { generateMarkdownHandoff, generateNextChatPrompt, getExactNextAction, getReadinessWarnings } from "./handoff";

function createHandoffFixture(): FocusLabState {
  const state = createInitialState();
  const now = nowIso();

  state.sprint.title = "FocusLab Milestone 1";
  state.sprint.goal = "Build a single-sprint execution and handoff prototype for JARVIS/Codex work.";
  state.sprint.currentState = "Desktop shell and SQLite persistence are implemented.";
  state.tasks = [
    {
      id: "task_active",
      title: "Implement the single-sprint app shell",
      status: "active",
      priority: "P0",
      createdAt: now,
      updatedAt: now
    }
  ];
  state.decisions = [
    {
      id: "decision_stack",
      title: "Keep Tauri + React + TypeScript + SQLite direction",
      context: "FocusLab needs a local, private, native-feeling macOS app.",
      decision: "Use Tauri, React, TypeScript, and SQLite for Milestone 1.",
      rationale: "This gives a smaller desktop footprint than Electron, fast UI iteration, and reliable local persistence.",
      impact: "Rust/Cargo are installed locally and Tauri debug packaging verifies.",
      createdAt: now
    }
  ];
  state.artifacts = [
    {
      id: "artifact_architecture",
      label: "Architecture docs",
      path: "/Users/melihkarakose/Projects/Active/FocusLab/docs/architecture.md",
      kind: "file",
      createdAt: now
    }
  ];

  return state;
}

describe("handoff generation", () => {
  it("includes restart-critical sections and exact paths", () => {
    const state = createHandoffFixture();
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
    const state = createHandoffFixture();

    expect(getExactNextAction(state)).toBe("Continue active task: Implement the single-sprint app shell");
  });

  it("reports missing handoff-critical context as readiness warnings", () => {
    const state = createHandoffFixture();
    state.sprint.goal = "";
    state.decisions[0].rationale = "";
    state.artifacts[0].path = "";

    expect(getReadinessWarnings(state)).toEqual(
      expect.arrayContaining(["Missing sprint goal", "Decision without rationale", "Artifact without path"])
    );
  });

  it("creates a clipboard-ready next-chat prompt", () => {
    const state = createHandoffFixture();
    const prompt = generateNextChatPrompt(state);

    expect(prompt).toContain("Use JARVIS and continue this FocusLab sprint");
    expect(prompt).toContain("Project: FocusLab Milestone 1");
    expect(prompt).toContain("Exact next action: Continue active task: Implement the single-sprint app shell");
    expect(prompt).toContain("Handoff:");
  });
});
