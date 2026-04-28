import { createInitialState, FocusLabState } from "./domain";
import { invoke } from "@tauri-apps/api/core";

const STORAGE_KEY = "focuslab.v1.sprint";

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in window;
}

function parseState(raw: string | null): FocusLabState {
  if (!raw) {
    return createInitialState();
  }

  try {
    return JSON.parse(raw) as FocusLabState;
  } catch {
    return createInitialState();
  }
}

export function loadFallbackState(): FocusLabState {
  const raw = localStorage.getItem(STORAGE_KEY);
  return parseState(raw);
}

export async function loadPersistedState(): Promise<FocusLabState> {
  if (isTauriRuntime()) {
    const raw = await invoke<string | null>("load_state");
    return parseState(raw);
  }

  return loadFallbackState();
}

export async function savePersistedState(state: FocusLabState) {
  const serialized = JSON.stringify(state);

  if (isTauriRuntime()) {
    await invoke("save_state", { state: serialized });
    return;
  }

  localStorage.setItem(STORAGE_KEY, serialized);
}

export function saveFallbackState(state: FocusLabState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
