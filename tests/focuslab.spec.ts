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
  await expect(dialog.getByRole("heading", { name: "Fresh-chat handoff" })).toBeVisible();
  await expect(dialog.getByText("## Fresh-Chat Starter")).toBeVisible();
  await expect(dialog.getByText("## Exact Next Action")).toBeVisible();
  await expect(dialog.getByText("Start next task: Finish rendered export test")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy prompt" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy Markdown" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Save Markdown" })).toBeVisible();
});
