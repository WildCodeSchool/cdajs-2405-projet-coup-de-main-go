import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("Login User", () => {
  test("should login successfully and display the user name in the header", async ({
    page,
  }) => {
    const frontendUrl = process.env.VITE_FRONTEND_URL;

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
      path: "./screenshots/login-success.png",
    });

    await page.waitForURL(frontendUrl + "/dashboard", { timeout: 10000 });

    const userName = await page.locator("header").locator("text=User T.");
    await expect(userName).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "./screenshots/user-name.png",
    });
  });

  test("should display an error message when the login fails", async ({
    page,
  }) => {
    const frontendUrl = process.env.VITE_FRONTEND_URL;

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
      path: "./screenshots/login-fail.png",
    });

    const errorMessage = await page.locator("text=Identifiants incorrects");

    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "./screenshots/error-message.png",
    });
  });
});
