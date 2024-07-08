const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM organization_tasks ORDER BY due_date ASC;`;
  pool
    .query(queryText)
    .then((result) => {
      console.log("FROM allTasksO.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "organization_tasks" (category, task, organization_id, organization_name, assign, due_date, description, task_status) 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  const category = req.body.category;
  const task = req.body.task;
  const organizationId = req.body.organization_id;
  const organizationName = req.body.organization_name;
  const assign = req.body.assign;
  const dueDate = req.body.due_date;
  const description = req.body.description;
  const taskStatus = req.body.task_status;

  pool
    .query(queryText, [
      category,
      task,
      organizationId,
      organizationName,
      assign,
      dueDate,
      description,
      taskStatus,
    ])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error with allTaskO POST route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const taskId = req.params.id;
  const taskStatus = req.body.task_status;

  const queryText = `UPDATE "organization_tasks" SET task_status = $1 WHERE id = $2;`;
  pool
    .query(queryText, [taskStatus, taskId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with allTaskO PUT route", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const taskId = req.params.id;
  console.log("taskId = ", taskId);
  pool
    .query(
      `UPDATE "organization_tasks"
      SET is_deleted = true
      WHERE id = $1;`,
      [taskId]
    )
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with allTaskO DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
