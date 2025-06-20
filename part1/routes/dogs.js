var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  console.log("Fetching dogs...");
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching dogs" });
  }
});

router.post("/", async (req, res) => {
  console.log("Adding dog...");
  const db = req.app.locals.db;
  const { name, size, owner_id } = req.body;
  try {
    const result = await db.execute(
      `INSERT INTO Dogs (name, size, owner_id) VALUES (?, ?, ?)`,
      [name, size, owner_id]
    );
    const newDogId = result[0].insertId;
    res.status(201).json({ dog_id: newDogId, name, size, owner_id });
  } catch (err) {
    res.status(500).json({ error: "Error adding dog" });
  }
});

module.exports = router;
