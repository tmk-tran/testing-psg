const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("from GET /id seller.router: ");

  const queryText = `
            SELECT * 
            FROM 
                region 
            ORDER BY 
                region_name ASC;
              `;

  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for regions", err);
      res.sendStatus(500);
    });
});

router.put("/:id", async (req, res) => {
  const regionId = req.params.id;

  try {
    await pool.query("BEGIN");

    // Set the current active year to false
    await pool.query("UPDATE region SET active = FALSE WHERE active = TRUE");

    // Set the new active year to true
    await pool.query("UPDATE region SET active = TRUE WHERE id = $1", [
      regionId,
    ]);

    await pool.query("COMMIT");

    console.log("Successfully updated region to active");
    res.sendStatus(201);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.log("error in the PUT / request for regions", err);
    res.sendStatus(500);
  }
});

module.exports = router;
