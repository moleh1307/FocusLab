import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  FileDown,
  FileText,
  FolderOpen,
  HardDrive,
  ListChecks,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import {
  addArtifactPath,
  applyCapture,
  resetSprintState,
  updateArtifactDescription,
  updateBlockerDetails,
  updateDecisionDetails,
  updateTaskDetails
} from "./actions";
import { FocusLabState, nowIso, Priority, Status } from "./domain";
import { generateMarkdownHandoff, generateNextChatPrompt, getReadinessWarnings } from "./handoff";
import { ArtifactPickerKind, pickArtifactPath } from "./picker";
import { loadFallbackState, loadPersistedState, saveFallbackState, savePersistedState } from "./storage";
import "./styles.css";

const statusOptions: Status[] = ["todo", "active", "blocked", "done", "dropped"];
const priorityOptions: Priority[] = ["P0", "P1", "P2"];

function App() {
  const [state, setState] = useState<FocusLabState>(() => loadFallbackState());
  const [hydrated, setHydrated] = useState(false);
  const [capture, setCapture] = useState("");
  const [search, setSearch] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pickerError, setPickerError] = useState("");

  useEffect(() => {
    let cancelled = false;

    loadPersistedState()
      .then((persisted) => {
        if (!cancelled) {
          setState(persisted);
          setHydrated(true);
        }
      })
      .catch(() => {
        setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    saveFallbackState(state);

    if (!hydrated) {
      return;
    }

    savePersistedState(state).catch(() => {
      // Keep browser fallback state intact if the desktop adapter fails.
    });
  }, [hydrated, state]);

  const warnings = useMemo(() => getReadinessWarnings(state), [state]);
  const handoff = useMemo(() => generateMarkdownHandoff(state), [state]);
  const prompt = useMemo(() => generateNextChatPrompt(state), [state]);
  const filteredTasks = state.tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
  const activeTask = state.tasks.find((task) => task.status === "active");

  function updateState(next: FocusLabState) {
    setState({
      ...next,
      sprint: {
        ...next.sprint,
        updatedAt: nowIso()
      }
    });
  }

  function handleCapture(event: React.FormEvent) {
    event.preventDefault();
    const next = applyCapture(state, capture);
    if (!next) return;

    setState(next);
    setCapture("");
  }

  function updateTask(id: string, patch: Parameters<typeof updateTaskDetails>[2]) {
    setState(updateTaskDetails(state, id, patch));
  }

  function handleBlockerDetails(id: string, patch: Parameters<typeof updateBlockerDetails>[2]) {
    setState(updateBlockerDetails(state, id, patch));
  }

  function handleDecisionDetails(id: string, patch: Parameters<typeof updateDecisionDetails>[2]) {
    setState(updateDecisionDetails(state, id, patch));
  }

  function handleNewSprint() {
    setShowResetConfirm(true);
  }

  function confirmNewSprint() {
    setState(resetSprintState());
    setShowResetConfirm(false);
  }

  async function handlePickArtifact(kind: ArtifactPickerKind) {
    setPickerError("");

    try {
      const path = await pickArtifactPath(kind);
      if (!path) return;

      const next = addArtifactPath(state, path, kind);
      if (next) {
        setState(next);
      }
    } catch {
      setPickerError("Native picker is unavailable in this environment.");
    }
  }

  function handleArtifactDescription(artifactId: string, description: string) {
    setState(updateArtifactDescription(state, artifactId, description));
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  function downloadHandoff() {
    const blob = new Blob([handoff], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.sprint.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-handoff.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">FocusLab</p>
          <h1>{state.sprint.title || "Untitled sprint"}</h1>
        </div>
        <div className="top-actions">
          <span className="status-pill">{state.sprint.status}</span>
          <button onClick={handleNewSprint}>
            <RotateCcw size={16} />
            New sprint
          </button>
          <button className="primary-action" onClick={() => setShowExport(true)}>
            <FileText size={16} />
            Handoff
          </button>
        </div>
      </header>

      <form className="capture-bar" onSubmit={handleCapture}>
        <Plus size={18} />
        <input
          value={capture}
          onChange={(event) => setCapture(event.target.value)}
          placeholder="task: implement capture flow, blocker: missing API key, decision: use SQLite..."
        />
        <button type="submit">Capture</button>
      </form>

      <section className="workspace-grid">
        <aside className="left-rail">
          <section className="panel">
            <div className="panel-title">
              <Sparkles size={16} />
              Sprint Map
            </div>
            <label>
              Title
              <input
                className="search-input"
                value={state.sprint.title}
                onChange={(event) =>
                  updateState({ ...state, sprint: { ...state.sprint, title: event.target.value } })
                }
                placeholder="Name this sprint"
              />
            </label>
            <label>
              Goal
              <textarea
                value={state.sprint.goal}
                onChange={(event) =>
                  updateState({ ...state, sprint: { ...state.sprint, goal: event.target.value } })
                }
              />
            </label>
            <label>
              Current state
              <textarea
                value={state.sprint.currentState}
                onChange={(event) =>
                  updateState({ ...state, sprint: { ...state.sprint, currentState: event.target.value } })
                }
              />
            </label>
          </section>

          <section className="panel">
            <div className="panel-title">
              <Search size={16} />
              Search
            </div>
            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter tasks"
            />
          </section>

          <section className="panel">
            <div className="panel-title">
              <ListChecks size={16} />
              Handoff readiness
            </div>
            {warnings.length === 0 ? (
              <p className="positive"><CheckCircle2 size={16} /> Ready to export</p>
            ) : (
              <ul className="warning-list">
                {warnings.map((warning) => (
                  <li key={warning}>
                    <AlertTriangle size={15} />
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        <section className="execution-lane">
          <section className="active-task">
            <p className="eyebrow">Active task</p>
            <h2>{activeTask?.title || "No active task"}</h2>
            <p>{activeTask ? `${activeTask.priority} · ${activeTask.status}` : "Capture or activate a task to define the next action."}</p>
            {activeTask?.notes ? <p className="active-task-note">{activeTask.notes}</p> : null}
          </section>

          <section className="panel wide-panel">
            <div className="panel-title">
              <ListChecks size={16} />
              Tasks
            </div>
            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <p className="empty-copy">Capture `task: ...` to define the next action.</p>
              ) : filteredTasks.map((task) => (
                <article className="task-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.priority}</span>
                  </div>
                  <div className="row-actions">
                    <select value={task.priority} onChange={(event) => updateTask(task.id, { priority: event.target.value as Priority })}>
                      {priorityOptions.map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </select>
                    <select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as Status })}>
                      {statusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className="task-note"
                    value={task.notes || ""}
                    onChange={(event) => updateTask(task.id, { notes: event.target.value })}
                    placeholder="Execution note for handoff"
                    aria-label={`Execution note for ${task.title}`}
                  />
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="right-rail">
          <RailSection icon={<ShieldAlert size={16} />} title="Blockers">
            {state.blockers.length === 0 ? <p className="empty-copy">No blockers captured.</p> : state.blockers.map((blocker) => (
              <article className="compact-item detail-item" key={blocker.id}>
                <strong>{blocker.title}</strong>
                <input
                  className="detail-input"
                  value={blocker.neededFrom || ""}
                  onChange={(event) => handleBlockerDetails(blocker.id, { neededFrom: event.target.value })}
                  placeholder="Needed from"
                  aria-label={`Needed from for ${blocker.title}`}
                />
                <textarea
                  className="detail-textarea"
                  value={blocker.description || ""}
                  onChange={(event) => handleBlockerDetails(blocker.id, { description: event.target.value })}
                  placeholder="Detail"
                  aria-label={`Detail for ${blocker.title}`}
                />
              </article>
            ))}
          </RailSection>

          <RailSection icon={<CheckCircle2 size={16} />} title="Decisions">
            {state.decisions.length === 0 ? <p className="empty-copy">No decisions captured.</p> : state.decisions.map((decision) => (
              <article className="compact-item detail-item" key={decision.id}>
                <strong>{decision.title}</strong>
                <textarea
                  className="detail-textarea"
                  value={decision.context}
                  onChange={(event) => handleDecisionDetails(decision.id, { context: event.target.value })}
                  placeholder="Context"
                  aria-label={`Context for ${decision.title}`}
                />
                <textarea
                  className="detail-textarea"
                  value={decision.rationale || ""}
                  onChange={(event) => handleDecisionDetails(decision.id, { rationale: event.target.value })}
                  placeholder="Rationale"
                  aria-label={`Rationale for ${decision.title}`}
                />
                <textarea
                  className="detail-textarea"
                  value={decision.impact || ""}
                  onChange={(event) => handleDecisionDetails(decision.id, { impact: event.target.value })}
                  placeholder="Impact"
                  aria-label={`Impact for ${decision.title}`}
                />
              </article>
            ))}
          </RailSection>

          <RailSection icon={<FileText size={16} />} title="Notes">
            {state.notes.length === 0 ? <p className="empty-copy">No notes captured.</p> : state.notes.map((note) => (
              <article className="compact-item" key={note.id}>
                <strong>{note.kind}</strong>
                <span>{note.body}</span>
              </article>
            ))}
          </RailSection>

          <RailSection icon={<FolderOpen size={16} />} title="Artifacts">
            <div className="artifact-actions">
              <button onClick={() => handlePickArtifact("file")}>
                <FileText size={16} />
                Add file
              </button>
              <button onClick={() => handlePickArtifact("folder")}>
                <HardDrive size={16} />
                Add folder
              </button>
            </div>
            {pickerError ? <p className="inline-warning">{pickerError}</p> : null}
            {state.artifacts.length === 0 ? <p className="empty-copy">No artifact paths linked.</p> : state.artifacts.map((artifact) => (
              <article className="compact-item artifact-item" key={artifact.id}>
                <strong>{artifact.label}</strong>
                <span>{artifact.path}</span>
                <textarea
                  className="artifact-description"
                  value={artifact.description || ""}
                  onChange={(event) => handleArtifactDescription(artifact.id, event.target.value)}
                  placeholder="Why it matters"
                  aria-label={`Why ${artifact.label} matters`}
                />
              </article>
            ))}
          </RailSection>
        </aside>
      </section>

      {showResetConfirm && (
        <section className="export-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="export-panel reset-panel">
            <div>
              <p className="eyebrow">New sprint</p>
              <h2 id="reset-title">Clear current sprint?</h2>
            </div>
            <p className="modal-copy">
              This starts from a blank first-run sprint and replaces the current local app state. Export a handoff
              first if this sprint needs to be preserved.
            </p>
            <div className="export-actions reset-actions">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="danger-action" onClick={confirmNewSprint}>
                <RotateCcw size={16} />
                Clear sprint
              </button>
            </div>
          </div>
        </section>
      )}

      {showExport && (
        <section className="export-overlay" role="dialog" aria-modal="true">
          <div className="export-panel">
            <div className="export-head">
              <div>
                <p className="eyebrow">Export preview</p>
                <h2>Fresh-chat handoff</h2>
              </div>
              <button onClick={() => setShowExport(false)}>Close</button>
            </div>
            <div className="export-actions">
              <button onClick={() => copy(prompt)}>
                <Clipboard size={16} />
                Copy prompt
              </button>
              <button onClick={() => copy(handoff)}>
                <Clipboard size={16} />
                Copy Markdown
              </button>
              <button onClick={downloadHandoff}>
                <FileDown size={16} />
                Save Markdown
              </button>
            </div>
            <pre>{handoff}</pre>
          </div>
        </section>
      )}
    </main>
  );
}

function RailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="panel rail-section">
      <div className="panel-title">
        {icon}
        {title}
      </div>
      <div className="rail-stack">{children}</div>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
