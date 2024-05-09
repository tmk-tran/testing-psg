const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const orgId = req.params.id;

  const queryText = `
          SELECT ot.*, o.organization_name
          FROM organization_tasks ot
          JOIN organization o ON ot.organization_id = o.id
          WHERE ot.organization_id = $1
          ORDER BY ot.due_date ASC;
        `;

  pool
    .query(queryText, [orgId])
    .then((result) => {
      console.log("Successful GET in organizationTask.router");
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const assignedTo = req.body.assign;
  const taskId = req.params.id;

  const queryText = `
          UPDATE "organization_tasks"
          SET assign = $1
          WHERE id = $2;
        `;

  pool
    .query(queryText, [assignedTo, taskId])
    .then((result) => {
      console.log("Successful PUT in organizationTask.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(
        "error in the PUT / request for organizationTask router: ",
        err
      );
      res.sendStatus(500);
    });
});

router.put("/duedate/:id", rejectUnauthenticated, (req, res) => {
  const dueDate = req.body.due_date;
  const taskId = req.params.id;

  const queryText = `
          UPDATE "organization_tasks"
          SET due_date = $1
          WHERE id = $2;
  `;

  pool
    .query(queryText, [dueDate, taskId])
    .then((result) => {
      console.log("Successful PUT to /duedate in organizationTask.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(
        "error in the PUT / request for organizationTask router: ",
        err
      );
      res.sendStatus(500);
    });
});

module.exports = router;
