var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  console.log("Fetching users...");
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute(`
      SELECT username, email, role, created_at FROM Users
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

module.exports = router;
