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
      console.log("from GET /id region.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for regions", err);
      res.sendStatus(500);
    });
});

module.exports = router;
