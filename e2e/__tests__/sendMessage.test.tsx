import { test, expect } from "@playwright/test";
import { config } from "dotenv";

config();

test.describe("Chat Message", () => {
  let frontendUrl: string | undefined;

  test.beforeEach(async ({ page }) => {
    frontendUrl = process.env.VITE_FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("VITE_FRONTEND_URL is not defined in the .env file");
    }

    await page.goto(frontendUrl);

    const loginButton = await page.locator("button", {
      hasText: "S'inscrire / Se connecter",
    });
    await loginButton.click();

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await emailInput.fill("user.test@yopmail.com");
    await passwordInput.fill("123456Aa!");

    const submitButton = page.locator('button[type="submit"]', {
      hasText: "Se connecter",
    });
    await submitButton.click();

    await expect(page.locator("header").locator("text=User T.")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should send reply to Jean D.", async ({ page }) => {
    const chatIcon = page.locator('a[href="/chat"]');
    await chatIcon.click();

    const testConversation = page
      .locator('.MuiListItemButton-root:has-text("Jean D.")')
      .first();
    await testConversation.click();

    const messageInput = page.locator('.MuiOutlinedInput-input[type="text"]');
    const replyMessage = "Merci Jean ! J'apprécie votre aide.";
    await messageInput.fill(replyMessage);
    await messageInput.press("Enter");

    await expect(page.locator(`text=${replyMessage}`).last()).toBeVisible();

    await page.screenshot({
      path: "./screenshots/message-sent-existing-chat.png",
    });
  });

  test("should display multiple messages in correct order", async ({
    page,
  }) => {
    const chatIcon = page.locator('a[href="/chat"]');
    await chatIcon.click();

    const testConversation = page
      .locator('.MuiListItemButton-root:has-text("Jean D.")')
      .first();
    await testConversation.click();

    // Send multiple messages
    const messageInput = page.locator('.MuiOutlinedInput-input[type="text"]');
    const testMessages = [
      "Première question...",
      "Deuxième point à clarifier",
      "Dernier message de test",
    ];

    for (const msg of testMessages) {
      await messageInput.fill(msg);
      await messageInput.press("Enter");
      await page.waitForTimeout(300);
    }

    const messageElements = await page.locator('.MuiBox-root .MuiTypography-body1').all();

    //For each message element, get the text content
    const allMessages = await Promise.all(
      messageElements.map(async el => {
        const text = await el.textContent();
        return text?.trim() || '';
      })
    );
  
    // Get only the new messages (excluding initial ones)
    const newMessages = allMessages.slice(-testMessages.length);
  
    expect(newMessages.length).toBe(testMessages.length);
  
    // Verify each message was received in correct order
    for (let i = 0; i < testMessages.length; i++) {
      expect(newMessages[i]).toContain(testMessages[i]);
    }  

    await page.screenshot({
      path: "./screenshots/multiple-messages-order.png",
    });
  });
});
