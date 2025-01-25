const { test, expect } = require("@playwright/test");

test("should load the login page and check elements", async ({ page }) => {
    await page.goto("http://localhost:3000");
    expect(await page.title()).toBe("Login");
    await expect(page.locator("form#loginForm")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test("should log in with correct credentials and redirect to profile", async ({
    page,
}) => {
    await page.goto("http://localhost:3000");
    await page.fill("input#email", "ruby.glenn@waterbaby.co.uk");
    await page.fill("input#password", "red^adl4");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/profile.html/);
});

test("should show an alert on invalid login credentials", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.fill("input#email", "wronguser@example.com");
    await page.fill("input#password", "wrongpassword");
    page.on("dialog", async (dialog) => {
        expect(dialog.message()).toBe("User not found");
        await dialog.dismiss();
    });
    await page.click('button[type="submit"]');
});

test("should not submit the form if email and password are empty", async ({
    page,
}) => {
    await page.goto("http://localhost:3000");
    await page.click('button[type="submit"]');
    expect(page.url()).toBe("http://localhost:3000/");
});

test("should not submit the form if email is empty", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    expect(page.url()).toBe("http://localhost:3000/");
});

test("should not submit the form if password is empty", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.fill("input#email", "tempuser@example.com");
    await page.click('button[type="submit"]');
    expect(page.url()).toBe("http://localhost:3000/");
});
