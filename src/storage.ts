import { createInitialState, FocusLabState } from "./domain";

const STORAGE_KEY = "focuslab.v1.sprint";

export function loadState(): FocusLabState {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createInitialState();
  }

  try {
    return JSON.parse(raw) as FocusLabState;
  } catch {
    return createInitialState();
  }
}

export function saveState(state: FocusLabState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

