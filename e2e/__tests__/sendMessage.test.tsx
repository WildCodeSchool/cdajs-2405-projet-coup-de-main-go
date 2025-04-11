import { test, expect, Page } from "@playwright/test";
import { config } from "dotenv";

config({ path: ".env" });

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
    chatLink: 'a[href="/chat"]',
    conversationItem: '.MuiListItemButton-root:has-text("Jean D.")',
    messageInput: '.MuiOutlinedInput-input[type="text"]',
};

test.describe("Send Message - E2E Tests", () => {
    let frontendUrl: string;

    test.beforeAll(() => {
        frontendUrl = process.env.VITE_FRONTEND_URL || "";
        if (!frontendUrl) {
            throw new Error(
                "VITE_FRONTEND_URL is not defined in the .env file"
            );
        }
    });

    test.beforeEach(async ({ page }) => {
        await page.goto(frontendUrl);
        await login(page);
    });

    async function login(page: Page) {
        await page.click(SELECTORS.loginButton);
        await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
        await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);
        await page.click(SELECTORS.submitButton);
        await expect(page.locator(SELECTORS.userHeader)).toBeVisible({
            timeout: 15000,
        });
    }

    test("should send reply to Jean D.", async ({ page }) => {
        const replyMessage = "Merci Jean ! J'apprécie votre aide.";
        const screenshotPath = "test-results/message-sent-existing-chat.png";

        await page.click(SELECTORS.chatLink);
        await page.locator(SELECTORS.conversationItem).first().click();
        await page.locator(SELECTORS.messageInput).fill(replyMessage);
        await page.locator("form").locator("button").click();

        await expect(page.locator(`text=${replyMessage}`).last()).toBeVisible({
            timeout: 5000,
        });

        await page.screenshot({
            path: screenshotPath,
            fullPage: true,
        });
    });
});
