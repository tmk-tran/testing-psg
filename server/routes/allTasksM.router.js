const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM merchant_tasks ORDER BY due_date ASC;`;
  pool
    .query(queryText)
    .then((result) => {
      console.log("FROM tasks.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const taskId = req.params.id;
  const taskStatus = req.body.task_status;

  const queryText = `UPDATE "merchant_tasks" SET task_status = $1 WHERE id = $2;`;
  pool
    .query(queryText, [taskStatus, taskId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with allTaskM PUT route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
