const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT mt.*, m.merchant_name
          FROM merchant_tasks mt
          JOIN merchant m ON mt.merchant_id = m.id
          ORDER BY mt.due_date ASC;
        `;

  pool
    .query(queryText)
    .then((result) => {
      console.log("Successful GET from allTasksM.router");
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;

  const queryText = `
          SELECT mt.*, m.merchant_name
          FROM merchant_tasks mt
          JOIN merchant m ON mt.merchant_id = m.id
          WHERE mt.merchant_id = $1
          ORDER BY mt.due_date ASC;
        `;

  pool
    .query(queryText, [merchantId])
    .then((result) => {
      console.log("Successful GET by id in allTasksM.router");
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const category = req.body.category;
  const task = req.body.task;
  const merchantId = req.body.merchant_id;
  const assign = req.body.assign;
  const dueDate = req.body.due_date;
  const description = req.body.description;
  const taskStatus = req.body.task_status;
  const couponOffer = req.body.coupon_details;
  const bookYearId = req.body.book_id;

  const queryText = `
          INSERT INTO "merchant_tasks" (
            category, 
            task, 
            merchant_id,  
            assign, 
            due_date, 
            description, 
            task_status, 
            coupon_details,
            book_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;

  pool
    .query(queryText, [
      category,
      task,
      merchantId,
      assign,
      dueDate,
      description,
      taskStatus,
      couponOffer,
      bookYearId,
    ])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error with allTaskM POST route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const taskId = req.params.id;
  const task = req.body.task;
  const taskStatus = req.body.task_status;

  const queryText = `
            UPDATE 
              "merchant_tasks"
            SET
              task = $1,
              task_status = $2
            WHERE
              id = $3;
        `;

  pool
    .query(queryText, [task, taskStatus, taskId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with allTaskM PUT route", err);
      res.sendStatus(500);
    });
});

router.put("/status/:id", rejectUnauthenticated, (req, res) => {
  const taskId = req.params.id;
  const taskStatus = req.body.task_status;

  const queryText = `
            UPDATE 
              "merchant_tasks"
            SET
              task_status = $1
            WHERE
              id = $2;
        `;

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

router.delete("/:id", (req, res) => {
  const taskId = req.params.id;

  pool
    .query(
      `UPDATE "merchant_tasks"
      SET is_deleted = true
      WHERE id = $1;`,
      [taskId]
    )
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with allTaskM DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
