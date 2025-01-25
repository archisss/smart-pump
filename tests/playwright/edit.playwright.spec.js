const { test, expect } = require("@playwright/test");

test.describe("Edit Profile Page", () => {
    test("should load the edit profile page and fill the form with user data", async ({
        page,
    }) => {
        // Create user in localStorage
        const user = {
            _id: "12345",
            name: { first: "Testing", last: "User" },
            email: "testing.user@example.com",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/edit.html");

        const firstNameField = await page.locator("#firstName");
        const lastNameField = await page.locator("#lastName");
        const emailField = await page.locator("#email");

        await expect(firstNameField).toHaveValue(user.name.first);
        await expect(lastNameField).toHaveValue(user.name.last);
        await expect(emailField).toHaveValue(user.email);
    });

    test("should update user profile and redirect to profile page", async ({
        page,
    }) => {
        const user = {
            _id: "12345",
            name: { first: "Testing", last: "User" },
            email: "testing.user@example.com",
        };
        await page.addInitScript((user) => {
            localStorage.setItem("user", JSON.stringify(user));
        }, user);

        await page.goto("http://localhost:3000/edit.html");

        await page.fill("#firstName", "Jane");
        await page.fill("#lastName", "Smith");
        await page.fill("#age", "56");
        await page.fill("#eyeColor", "blue");
        await page.fill("#company", "PERSONAL");
        await page.fill("#phone", "+1 (936) 451-3590");
        await page.fill(
            "#address",
            "176543 street name, Mexico, Mexico, 98283"
        );
        await page.fill("#email", "jane.smith@example.com");

        await page.route(
            "http://localhost:3000/api/users/profile/*",
            (route, request) => {
                expect(request.method()).toBe("PUT");
                expect(request.postData()).toContain("Jane");
                route.continue();
            }
        );

        await page.click('button[type="submit"]');

        await page.waitForURL("http://localhost:3000/profile.html");

        const profileImage = await page.locator("#profilePicture");
        const profileName = await page.locator("#name");

        await expect(profileImage).toHaveAttribute("src", user.picture);
        await expect(profileName).toHaveText(
            `${user.name.first} ${user.name.last}`
        );
    });

    test("should redirect to index page if no user in localStorage", async ({
        page,
    }) => {
        await page.addInitScript(() => {
            localStorage.removeItem("user");
        });

        await page.goto("http://localhost:3000/edit.html");

        await expect(page).toHaveURL("http://localhost:3000/");
    });
});
