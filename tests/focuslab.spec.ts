import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("guards new sprint reset with cancel and confirm paths", async ({ page }) => {
  await page.getByPlaceholder("task: implement capture flow").fill("task: Playwright reset smoke");
  await page.getByRole("button", { name: "Capture" }).click();

  await expect(page.getByText("Playwright reset smoke")).toBeVisible();

  await page.getByRole("button", { name: "New sprint" }).click();
  await expect(page.getByRole("dialog", { name: "Clear current sprint?" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.getByText("Playwright reset smoke")).toBeVisible();

  await page.getByRole("button", { name: "New sprint" }).click();
  await page.getByRole("button", { name: "Clear sprint" }).click();

  await expect(page.getByRole("heading", { name: "Untitled sprint", level: 1 })).toBeVisible();
  await expect(page.getByText("Playwright reset smoke")).toBeHidden();
  await expect(page.getByText("No active or open task")).toBeVisible();
});

test("renders a fresh-chat handoff export from captured sprint state", async ({ page }) => {
  await page.getByPlaceholder("Name this sprint").fill("Playwright handoff sprint");
  await page.getByRole("textbox", { name: "Goal" }).fill("Verify rendered handoff export.");
  await page.getByRole("textbox", { name: "Current state" }).fill("Rendered UI automation is under test.");
  await page.getByPlaceholder("task: implement capture flow").fill("task: Finish rendered export test");
  await page.getByRole("button", { name: "Capture" }).click();

  await page.getByRole("button", { name: "Handoff" }).click();

  const dialog = page.getByRole("dialog");
  const promptPreview = dialog.locator(".preview-block").first();
  const markdownPreview = dialog.locator(".preview-block").nth(1);

  await expect(dialog.getByRole("heading", { name: "Fresh-chat handoff" })).toBeVisible();
  await expect(dialog.getByText("Next-chat prompt")).toBeVisible();
  await expect(promptPreview.getByText("Use JARVIS and continue this FocusLab sprint from the handoff below.")).toBeVisible();
  await expect(promptPreview.getByText("Project: Playwright handoff sprint")).toBeVisible();
  await expect(promptPreview.getByText("Exact next action: Start next task: Finish rendered export test")).toBeVisible();
  await expect(dialog.getByText("Markdown handoff", { exact: true })).toBeVisible();
  await expect(markdownPreview.getByText("## Fresh-Chat Starter")).toBeVisible();
  await expect(markdownPreview.getByText("## Exact Next Action")).toBeVisible();
  await expect(markdownPreview.getByText("Start next task: Finish rendered export test")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy prompt" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy Markdown" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Save Markdown" })).toBeVisible();
});

test("adds file and folder artifacts through the picker seam", async ({ page }) => {
  await page.addInitScript(() => {
    const focusLabWindow = window as Window & {
      __focusLabPickArtifact?: (kind: "file" | "folder") => Promise<string | null>;
    };

    focusLabWindow.__focusLabPickArtifact = async (kind) =>
      kind === "file" ? "/Users/melih/project/report.md" : "/Users/melih/project/output";
  });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByRole("button", { name: "Add file" }).click();
  await page.getByRole("button", { name: "Add folder" }).click();

  await expect(page.getByText("report.md", { exact: true })).toBeVisible();
  await expect(page.getByText("/Users/melih/project/report.md")).toBeVisible();
  await expect(page.getByText("output", { exact: true })).toBeVisible();
  await expect(page.getByText("/Users/melih/project/output")).toBeVisible();
});

test("includes artifact descriptions in the handoff export", async ({ page }) => {
  await page.addInitScript(() => {
    const focusLabWindow = window as Window & {
      __focusLabPickArtifact?: () => Promise<string | null>;
    };

    focusLabWindow.__focusLabPickArtifact = async () => "/Users/melih/project/report.md";
  });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByRole("button", { name: "Add file" }).click();
  await page.getByLabel("Why report.md matters").fill("Use this report as the source of truth for QA status.");
  await page.getByRole("button", { name: "Handoff" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("report.md: `/Users/melih/project/report.md`")).toBeVisible();
  await expect(dialog.getByText("Why it matters: Use this report as the source of truth for QA status.")).toBeVisible();
});

test("edits blocker and decision details for readiness and handoff export", async ({ page }) => {
  await page.getByPlaceholder("task: implement capture flow").fill("blocker: Waiting on API key");
  await page.getByRole("button", { name: "Capture" }).click();
  await expect(page.getByText("Open blocker without needed-from")).toBeVisible();

  await page.getByLabel("Needed from for Waiting on API key").fill("Platform owner");
  await page.getByLabel("Detail for Waiting on API key").fill("Need a local-only credential for the smoke test.");
  await expect(page.getByText("Open blocker without needed-from")).toBeHidden();

  await page.getByPlaceholder("task: implement capture flow").fill("decision: Keep SQLite snapshot storage");
  await page.getByRole("button", { name: "Capture" }).click();
  await expect(page.getByText("Decision without rationale")).toBeVisible();

  await page.getByLabel("Context for Keep SQLite snapshot storage").fill("v1 has one active sprint.");
  await page.getByLabel("Rationale for Keep SQLite snapshot storage").fill("Snapshot persistence keeps local storage simple.");
  await page.getByLabel("Impact for Keep SQLite snapshot storage").fill("Schema normalization can wait.");
  await expect(page.getByText("Decision without rationale")).toBeHidden();

  await page.getByRole("button", { name: "Handoff" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Needed from: Platform owner")).toBeVisible();
  await expect(dialog.getByText("Detail: Need a local-only credential for the smoke test.")).toBeVisible();
  await expect(dialog.getByText("Context: v1 has one active sprint.")).toBeVisible();
  await expect(dialog.getByText("Rationale: Snapshot persistence keeps local storage simple.")).toBeVisible();
  await expect(dialog.getByText("Impact: Schema normalization can wait.")).toBeVisible();
});

test("edits task execution notes for active-task context and handoff export", async ({ page }) => {
  await page.getByPlaceholder("task: implement capture flow").fill("task: Finish task detail ergonomics");
  await page.getByRole("button", { name: "Capture" }).click();

  await page.getByLabel("Execution note for Finish task detail ergonomics").fill("Resume by checking the rendered handoff preview.");
  await page.getByRole("combobox").nth(1).selectOption("active");

  await expect(page.getByRole("heading", { name: "Finish task detail ergonomics" })).toBeVisible();
  await expect(page.locator(".active-task").getByText("Resume by checking the rendered handoff preview.")).toBeVisible();

  await page.getByRole("button", { name: "Handoff" }).click();

  const dialog = page.getByRole("dialog");
  const promptPreview = dialog.locator(".preview-block").first();
  const markdownPreview = dialog.locator(".preview-block").nth(1);

  await expect(promptPreview.getByText("Continue active task: Finish task detail ergonomics")).toBeVisible();
  await expect(markdownPreview.getByText("P1 Finish task detail ergonomics - Resume by checking the rendered handoff preview.")).toBeVisible();
});
