import { open } from "@tauri-apps/plugin-dialog";

export type ArtifactPickerKind = "file" | "folder";

declare global {
  interface Window {
    __focusLabPickArtifact?: (kind: ArtifactPickerKind) => Promise<string | null>;
  }
}

export async function pickArtifactPath(kind: ArtifactPickerKind) {
  if (window.__focusLabPickArtifact) {
    return window.__focusLabPickArtifact(kind);
  }

  const selected = await open({
    directory: kind === "folder",
    multiple: false
  });

  if (typeof selected === "string") {
    return selected;
  }

  return null;
}
