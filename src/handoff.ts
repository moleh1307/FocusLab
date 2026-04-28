import { Blocker, FocusLabState, Task } from "./domain";

function linesForTasks(tasks: Task[]) {
  if (tasks.length === 0) {
    return "- None";
  }

  return tasks
    .map((task) => {
      const checkbox = task.status === "done" ? "x" : " ";
      const detail = task.notes ? ` - ${task.notes}` : "";
      return `- [${checkbox}] ${task.priority} ${task.title}${detail}`;
    })
    .join("\n");
}

function linesForBlockers(blockers: Blocker[]) {
  if (blockers.length === 0) {
    return "- None";
  }

  return blockers
    .map((blocker) => {
      const parts = [
        `- ${blocker.title}`,
        `  - Needed from: ${blocker.neededFrom || "unknown"}`,
        `  - Detail: ${blocker.description || "No detail captured"}`
      ];

      if (blocker.resolution) {
        parts.push(`  - Resolution: ${blocker.resolution}`);
      }

      return parts.join("\n");
    })
    .join("\n");
}

export function getExactNextAction(state: FocusLabState) {
  const activeTask = state.tasks.find((task) => task.status === "active");
  if (activeTask) {
    return `Continue active task: ${activeTask.title}`;
  }

  const openTask = state.tasks.find((task) => task.status === "todo" || task.status === "blocked");
  if (openTask) {
    return `Start next task: ${openTask.title}`;
  }

  const openBlocker = state.blockers.find((blocker) => blocker.status === "open");
  if (openBlocker) {
    return `Resolve blocker: ${openBlocker.title}`;
  }

  return "Review milestone and decide whether the sprint is ready to close.";
}

export function getReadinessWarnings(state: FocusLabState) {
  const warnings: string[] = [];

  if (!state.sprint.goal.trim()) warnings.push("Missing sprint goal");
  if (!state.sprint.currentState.trim()) warnings.push("Missing current state");
  if (!state.tasks.some((task) => task.status === "active" || task.status === "todo")) {
    warnings.push("No active or open task");
  }
  if (state.blockers.some((blocker) => blocker.status === "open" && !blocker.neededFrom?.trim())) {
    warnings.push("Open blocker without needed-from");
  }
  if (state.decisions.some((decision) => !decision.rationale?.trim())) {
    warnings.push("Decision without rationale");
  }
  if (state.artifacts.some((artifact) => !artifact.path.trim())) {
    warnings.push("Artifact without path");
  }

  return warnings;
}

export function generateMarkdownHandoff(state: FocusLabState) {
  const generatedAt = new Date().toLocaleString();
  const completed = state.tasks.filter((task) => task.status === "done");
  const open = state.tasks.filter((task) => ["todo", "active", "blocked"].includes(task.status));
  const openBlockers = state.blockers.filter((blocker) => blocker.status === "open");
  const resolvedBlockers = state.blockers.filter((blocker) => blocker.status === "resolved");
  const nextAction = getExactNextAction(state);
  const starter = `Use JARVIS and continue ${state.sprint.title}. Goal: ${state.sprint.goal} Current state: ${state.sprint.currentState} Exact next action: ${nextAction}`;

  return `# ${state.sprint.title} Handoff

Generated: ${generatedAt}
App: FocusLab

## Fresh-Chat Starter

${starter}

## Goal

${state.sprint.goal || "No goal captured."}

## Current State

- ${state.sprint.currentState || "No current state captured."}
- Sprint status: ${state.sprint.status}

## Completed Work

${linesForTasks(completed)}

## Open Tasks

${linesForTasks(open)}

## Blockers

### Open

${linesForBlockers(openBlockers)}

### Resolved

${linesForBlockers(resolvedBlockers)}

## Decisions

${state.decisions.length === 0 ? "- None" : state.decisions.map((decision) => `- ${decision.title}
  - Context: ${decision.context || "No context captured"}
  - Decision: ${decision.decision || "No decision captured"}
  - Rationale: ${decision.rationale || "No rationale captured"}
  - Impact: ${decision.impact || "No impact captured"}`).join("\n")}

## Notes

${state.notes.length === 0 ? "- None" : state.notes.map((note) => `- ${note.kind}: ${note.body}`).join("\n")}

## Artifacts And Paths

${state.artifacts.length === 0 ? "- None" : state.artifacts.map((artifact) => `- ${artifact.label}: \`${artifact.path}\`
  - Why it matters: ${artifact.description || "No description captured"}`).join("\n")}

## Milestones

${state.milestones.length === 0 ? "- None" : state.milestones.map((milestone) => `- ${milestone.status} ${milestone.title} - ${milestone.summary || "No summary captured"}`).join("\n")}

## Exact Next Action

${nextAction}

## Caveats

${getReadinessWarnings(state).length === 0 ? "- No readiness warnings." : getReadinessWarnings(state).map((warning) => `- ${warning}`).join("\n")}
`;
}

export function generateNextChatPrompt(state: FocusLabState) {
  const blockers = state.blockers.filter((blocker) => blocker.status === "open");
  const topArtifacts = state.artifacts.slice(0, 3).map((artifact) => `${artifact.label}: ${artifact.path}`).join("; ");

  return `Use JARVIS and continue this FocusLab sprint from the handoff below.

Project: ${state.sprint.title}
Goal: ${state.sprint.goal}
Current state: ${state.sprint.currentState}
Exact next action: ${getExactNextAction(state)}
Blockers: ${blockers.length ? blockers.map((blocker) => blocker.title).join("; ") : "none"}
Key files/artifacts: ${topArtifacts || "none"}

Handoff:
<paste Markdown handoff or attach/export path>`;
}

