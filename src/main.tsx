import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="shell">
      <section className="status-panel">
        <p className="eyebrow">FocusLab</p>
        <h1>Single-sprint execution and handoff lab</h1>
        <p>
          Architecture baseline is ready. The first prototype will turn active
          sprint state into a clean JARVIS/Codex handoff.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

