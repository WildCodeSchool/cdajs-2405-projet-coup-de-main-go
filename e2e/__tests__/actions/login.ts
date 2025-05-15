import { expect, Page } from "@playwright/test";

const TEST_CREDENTIALS = {
  email: "user.test@yopmail.com",
  password: "123456Aa!",
};

const SELECTORS = {
  loginButton: 'button:has-text("S\'inscrire / Se connecter")',
  emailInput: 'input[name="email"]',
  passwordInput: 'input[name="password"]',
  submitButton: 'button[type="submit"]:has-text("Se connecter")',
  userHeader: "header >> text=User T.",
};

export async function login(page: Page) {
  await page.click(SELECTORS.loginButton);
  await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
  await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);
  await page.click(SELECTORS.submitButton);
  await expect(page.locator(SELECTORS.userHeader)).toBeVisible({
    timeout: 15000,
  });
}
