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

module.exports = router;
