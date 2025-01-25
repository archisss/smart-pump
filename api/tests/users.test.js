const request = require("supertest");
const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bcrypt = require("bcryptjs");
const usersRouter = require("../users");

// Config DB for testing
const adapter = new FileSync("./api/data/users.json");
const db = low(adapter);
const app = express();
app.use(express.json());
app.use("/api", usersRouter);

let tempUserId;

beforeAll(() => {
    const newUser = {
        _id: "965789953e099f716e32e05",
        email: "tempuser@example.com",
        password: "password123",
    };

    db.get("users").push(newUser).write();

    tempUserId = newUser._id;
});

describe("API Testing", () => {
    it("should return 404 if user is not found on login", async () => {
        const response = await request(app)
            .post("/api/login")
            .send({
                email: "nonexistent@example.com",
                password: "password123",
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });

    it("should return 404 for invalid password", async () => {
        const response = await request(app)
            .post("/api/login")
            .send({
                email: "ruby.glenn@waterbaby.co.uk",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid password");
    });

    it("should return user data on successful login", async () => {
        const response = await request(app)
            .post("/api/login")
            .send({
                email: "ruby.glenn@waterbaby.co.uk",
                password: "red^adl4",
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toBe("ruby.glenn@waterbaby.co.uk");
    });

    it("should return 404 if user profile is not found", async () => {
        const response = await request(app).get("/api/profile/999");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });

    it("should return user profile data", async () => {
        const response = await request(app).get(
            "/api/profile/5410953e099f716e02f32e05"
        );
        expect(response.status).toBe(200);
        expect(response.body._id).toBe("5410953e099f716e02f32e05");
        expect(response.body.email).toBe("ruby.glenn@waterbaby.co.uk");
    });

    it("should return 404 if user to update is not found", async () => {
        const response = await request(app)
            .put("/api/profile/999")
            .send({ email: "updated@example.com" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
});

afterAll(() => {
    db.get("users").remove({ _id: tempUserId }).write();
});
