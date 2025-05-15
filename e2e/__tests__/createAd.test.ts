import { test, expect } from "@playwright/test";
import { login } from "./actions/login";
import { config } from "dotenv";

config({ path: ".env" });

test.describe("Create ad - E2E Tests", () => {
  let frontendUrl: string;

  test.beforeAll(() => {
    frontendUrl = process.env.VITE_FRONTEND_URL || "";
    if (!frontendUrl) {
      throw new Error("VITE_FRONTEND_URL is not defined in the .env file");
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(frontendUrl);
    await login(page);
  });

  test("should display create ad modal", async ({ page }) => {
    await page.getByRole("button", { name: "Créer une annonce" }).click();

    await expect(page.getByRole("heading")).toContainText("Créer une annonce");
  });

  test("should successfully create a new ad and display a success message", async ({
    page,
  }) => {
    // Open modal
    await page.getByRole("button", { name: "Créer une annonce" }).click();

    // Fill title in
    await page.getByRole("textbox", { name: "Titre" }).click();
    await page.getByRole("textbox", { name: "Titre" }).fill("Titre");

    // Fill description in
    await page.getByRole("textbox", { name: "Description" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("Description");

    // Choose an address suggestion
    await page.getByRole("combobox", { name: "Adresse" }).click();
    await page.getByRole("combobox", { name: "Adresse" }).fill("5 pl");
    await page.waitForSelector('[role="listbox"]');
    await page.locator('[role="option"]').first().click();

    // Choose a category
    await page.getByRole("combobox", { name: "Catégorie" }).click();
    await page.waitForSelector('[role="listbox"]');
    await page.locator('[role="option"]').first().click();

    // Choose duration
    await page.locator(".MuiSlider-root").locator("span").nth(5).click();

    // Pick one picture
    await page.setInputFiles(
      'input[type="file"]',
      "__tests__/assets/test-picture.jpg"
    );

    // Submit ad
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("Annonce ajoutée avec succès !")).toBeVisible();
  });
});
