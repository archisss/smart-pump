const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bcrypt = require("bcryptjs");
const router = express.Router();

const adapter = new FileSync("./api/data/users.json");
const db = low(adapter);

const findUserByEmail = (email) => db.get("users").find({ email }).value();

// POST /login
// User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = password == user.password;
    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
    }

    res.json(user);
});

// GET /profile/:id
// Get User Profile
router.get("/profile/:id", (req, res) => {
    const user = db.get("users").find({ _id: req.params.id }).value();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// PUT /profile/:id
// Edit User Profile
router.put("/profile/:id", (req, res) => {
    const { id } = req.params;
    const user = db.get("users").find({ _id: id }).value();

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    db.get("users").find({ _id: id }).assign(req.body).write();

    res.json({ message: "Profile updated successfully" });
});

module.exports = router;
