import { describe, expect, it } from "vitest";
import { createInitialState } from "./domain";
import { parseStoredState, serializeState } from "./storage";

describe("storage serialization", () => {
  it("round-trips sprint state without dropping reset-critical collections", () => {
    const state = createInitialState();
    state.sprint.title = "Storage coverage sprint";
    state.tasks = [
      {
        id: "task_storage",
        title: "Verify local persistence",
        status: "todo",
        priority: "P1",
        createdAt: state.sprint.startedAt,
        updatedAt: state.sprint.updatedAt
      }
    ];
    state.blockers = [
      {
        id: "blocker_storage",
        title: "No storage test",
        status: "open",
        neededFrom: "QA",
        createdAt: state.sprint.startedAt
      }
    ];

    const restored = parseStoredState(serializeState(state));

    expect(restored.sprint.title).toBe("Storage coverage sprint");
    expect(restored.tasks).toHaveLength(1);
    expect(restored.tasks[0].title).toBe("Verify local persistence");
    expect(restored.blockers).toHaveLength(1);
    expect(restored.blockers[0].neededFrom).toBe("QA");
  });

  it("falls back to a blank first-run state when stored data is missing", () => {
    const restored = parseStoredState(null);

    expect(restored.sprint.title).toBe("Untitled sprint");
    expect(restored.tasks).toEqual([]);
    expect(restored.blockers).toEqual([]);
  });

  it("falls back to a blank first-run state when stored data is corrupt", () => {
    const restored = parseStoredState("{not valid json");

    expect(restored.sprint.title).toBe("Untitled sprint");
    expect(restored.sprint.goal).toBe("");
    expect(restored.tasks).toEqual([]);
  });
});
