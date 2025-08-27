const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;

  const queryText = `
          SELECT mt.*, m.merchant_name
          FROM merchant_tasks mt
          JOIN merchant m ON mt.merchant_id = m.id
          WHERE mt.merchant_id = $1
            AND mt.is_deleted = false
          ORDER BY mt.due_date ASC;
        `;

  pool
    .query(queryText, [merchantId])
    .then((result) => {
      console.log("Successful GET in merchantTask.router");
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchatTask router: ", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const assignedTo = req.body.assign;
  const taskId = req.params.id;

  const queryText = `
          UPDATE "merchant_tasks"
          SET assign = $1
          WHERE id = $2;
  `;

  pool
    .query(queryText, [assignedTo, taskId])
    .then((result) => {
      console.log("Successful PUT by ID in merchantTask.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(
        "error in the PUT / request by ID for merchantTask router: ",
        err
      );
      res.sendStatus(500);
    });
});

router.put("/duedate/:id", rejectUnauthenticated, (req, res) => {
  const dueDate = req.body.due_date;
  const taskId = req.params.id;

  const queryText = `
          UPDATE "merchant_tasks"
          SET due_date = $1
          WHERE id = $2;
  `;

  pool
    .query(queryText, [dueDate, taskId])
    .then((result) => {
      console.log("Successful PUT to /duedate in merchantTask.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(
        "error in the PUT / request for /duedate merchantTask router: ",
        err
      );
      res.sendStatus(500);
    });
});

module.exports = router;
