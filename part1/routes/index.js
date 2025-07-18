var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/dogs", async (req, res) => {
  console.log("Fetching dogs...");
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute(`
      SELECT
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

router.get("/api/walkrequests/open", async (req, res) => {
  console.log("Fetching walk requests...");
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute(`
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time,
             wr.duration_minutes, wr.location, u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch walk requests" });
  }
});

router.get("/api/walkers/summary", async (req, res) => {
  console.log("Fetching walks...");
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute(`
      SELECT u.username AS walker_username,
             COUNT(r.rating_id) AS total_ratings,
             ROUND(AVG(r.rating), 1) AS average_rating,
             SUM(CASE WHEN wr.status = 'completed' THEN 1 ELSE 0 END) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
      LEFT JOIN WalkRequests wr ON r.request_id = wr.request_id
      WHERE u.role = 'walker'
      GROUP BY u.username
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch walker summary" });
  }
});

module.exports = router;
