const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const orgId = req.params.id;
  console.log(orgId);

  const queryText = `
          SELECT * 
          FROM organization_tasks 
          WHERE organization_id = $1 
          ORDER BY due_date ASC;
        `;
  pool
    .query(queryText, [orgId])
    .then((result) => {
      console.log("FROM orgTask.router: ", result.rows);
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
      console.log("FROM orgTask.router: ", result.rows);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in the PUT / request for orgTask router: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
