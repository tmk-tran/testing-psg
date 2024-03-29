const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;

  const queryText = `SELECT * FROM merchant_tasks WHERE merchant_id = $1 ORDER BY due_date ASC;`;
  pool
    .query(queryText, [merchantId])
    .then((result) => {
      console.log("FROM tasks.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchatTask router: ", err);
      res.sendStatus(500);
    });
});


module.exports = router;
