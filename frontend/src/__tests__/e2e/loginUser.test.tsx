import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

test.describe("Login User", () => {
  test("should login successfully and display the user name in the header", async ({
    page,
  }) => {
    const frontendUrl = process.env.VITE_FRONTEND_URL;
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const screenshotDir = path.join(__dirname, "playwright-screenshots");

    if (!frontendUrl) {
      throw new Error("VITE_FRONTEND_URL is not defined in the .env file");
    }

    await page.goto(frontendUrl);

    const loginButton = await page.locator("button", {
      hasText: "S'inscrire / Se connecter",
    });
    await loginButton.click();

    await expect(page.locator("label", { hasText: "E-mail" })).toBeVisible();
    await expect(
      page.locator("label", { hasText: "Mot de passe" })
    ).toBeVisible();

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await emailInput.fill("user.test@yopmail.com");
    await passwordInput.fill("123456Aa!");

    const submitButton = page.locator('button[type="submit"]', {
      hasText: "Se connecter",
    });
    await submitButton.click();

    await page.screenshot({
      path: path.join(screenshotDir, "login-success.png"),
    });

    await page.waitForLoadState("networkidle");

    const userName = await page.locator("header").locator("text=User T.");
    await expect(userName).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDir, "user-visible.png"),
    });
  });

  test("should display an error message when the login fails", async ({
    page,
  }) => {
    const frontendUrl = process.env.VITE_FRONTEND_URL;
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const screenshotDir = path.join(__dirname, "playwright-screenshots");

    if (!frontendUrl) {
      throw new Error("VITE_FRONTEND_URL is not defined in the .env file");
    }

    await page.goto(frontendUrl);

    const loginButton = await page.locator("button", {
      hasText: "S'inscrire / Se connecter",
    });
    await loginButton.click();

    await expect(page.locator("label", { hasText: "E-mail" })).toBeVisible();
    await expect(
      page.locator("label", { hasText: "Mot de passe" })
    ).toBeVisible();

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await emailInput.fill("user.test@yopmail.com");
    await passwordInput.fill("wrong-password");

    const submitButton = page.locator('button[type="submit"]', {
      hasText: "Se connecter",
    });
    await submitButton.click();

    await page.screenshot({
      path: path.join(screenshotDir, "login-fail.png"),
    });

    await page.waitForLoadState("networkidle");

    const errorMessage = await page.locator("text=Identifiants incorrects");

    await expect(errorMessage).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDir, "error-message.png"),
    });
  });
});
