const { test, expect } = require("@playwright/test");

test.describe("User Profile Page", () => {
    test("should load the user profile page", async ({ page }) => {
        const user = {
            picture: "/assets/picture.jpg",
            name: { first: "John", last: "Doe" },
            isActive: true,
            balance: "100.00",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/profile.html");

        const profileImage = await page.locator("#profilePicture");
        const profileName = await page.locator("#name");

        await expect(profileImage).toHaveAttribute("src", user.picture);
        await expect(profileName).toHaveText(
            `${user.name.first} ${user.name.last}`
        );
    });

    test("should enable the balance button if user is active", async ({
        page,
    }) => {
        const user = {
            picture: "/assets/picture.jpg",
            name: { first: "John", last: "Doe" },
            isActive: true,
            balance: "100.00",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/profile.html");

        const balanceButton = await page.locator("#balanceBtn");
        await expect(balanceButton).not.toBeDisabled();
    });

    test("should disable the balance button if user is not active", async ({
        page,
    }) => {
        const user = {
            picture: "/assets/picture.jpg",
            name: { first: "John", last: "Doe" },
            isActive: false,
            balance: "100.00",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/profile.html");

        const balanceButton = await page.locator("#balanceBtn");
        await expect(balanceButton).toBeDisabled();
    });

    test("should redirect to edit page when Edit button is clicked", async ({
        page,
    }) => {
        const user = {
            picture: "/assets/picture.jpg",
            name: { first: "John", last: "Doe" },
            isActive: true,
            balance: "100.00",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/profile.html");

        await page.locator("#editBtn").click();

        await expect(page).toHaveURL("http://localhost:3000/edit.html");
    });

    test("should redirect to index page if no user in localStorage", async ({
        page,
    }) => {
        await page.addInitScript(() => {
            localStorage.removeItem("user");
        });

        await page.goto("http://localhost:3000/profile.html");

        await expect(page).toHaveURL("http://localhost:3000/");
    });
});
