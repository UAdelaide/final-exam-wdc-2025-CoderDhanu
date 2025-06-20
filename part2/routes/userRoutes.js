const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all users (for admin/testing)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, username, email, role FROM Users"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST a new user (simple signup)
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(
      `
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `,
      [username, email, password, role]
    );

    res
      .status(201)
      .json({ message: "User registered", user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("req", email, password);

  try {
    const [rows] = await db.query(
      `
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `,
      [email, password]
    );
    console.log("Query result", rows);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.user = rows[0];
    console.log("req", req);
    res.json({ message: "Login successful", user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  console.log("req", req.session);
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/dogs/my-dogs", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const userId = req.session.user.user_id;

  try {
    const [rows] = await db.query(
      "SELECT dog_id, name, size FROM Dogs WHERE owner_id = ?",
      [userId]
    );
    console.log("dog rows", rows);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

router.get("/dogs", async (req, res) => {
  console.log("Fetching dogs...");
  try {
    const [rows] = await db.query(`
      SELECT
        d.dog_id,
        d.owner_id,
        d.name AS dog_name,
        d.size,
        u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error while fetching dogs" });
  }
});

module.exports = router;
