const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
  SELECT
      id,
      merchant_id,
      TO_CHAR(created_at, 'MM/DD/YYYY') AS formatted_date,
      TO_CHAR(created_at, 'HH12:MI:SS AM') AS formatted_time,
      comment_content,
      "user",
      "task_id",
      "coupon_id"
  FROM
      "merchant_comments"
  ORDER BY
      created_at;
  `;

  pool
    .query(queryText)
    .then((result) => {
      console.log("FROM merchantComments.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchantComments", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;
  console.log("merchantId = ", merchantId);
  const queryText = `
  SELECT
      id,
      merchant_id,
      TO_CHAR(created_at, 'MM/DD/YYYY') AS formatted_date,
      TO_CHAR(created_at, 'HH12:MI:SS AM') AS formatted_time,
     comment_content,
     "user",
     "task_id",
     "coupon_id"
  FROM
     "merchant_comments"
  WHERE
      merchant_id = $1
  ORDER BY
      created_at DESC, id DESC;

`;

  pool
    .query(queryText, [merchantId])
    .then((result) => {
      // console.log("merchantId = ", merchantId);
      console.log("FROM merchantComments.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchantComments", err);
      res.sendStatus(500);
    });
});

router.get("/task/:id", rejectUnauthenticated, (req, res) => {
  const taskId = req.params.id;
  console.log("taskId = ", taskId);
  const queryText = `
  SELECT
      id,
      merchant_id,
      TO_CHAR(created_at, 'MM/DD/YYYY') AS formatted_date,
      TO_CHAR(created_at, 'HH12:MI:SS AM') AS formatted_time,
     comment_content,
     "user",
     "task_id",
     "coupon_id"
  FROM
     "merchant_comments"
  WHERE
      task_id = $1
  ORDER BY
      created_at DESC, id DESC;

`;

  pool
    .query(queryText, [taskId])
    .then((result) => {
      // console.log("merchantId = ", merchantId);
      console.log(
        "FROM merchantComments.router for coupon comments: ",
        result.rows
      );
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchantComments", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const comment = req.body;
  console.log("COMMENT IS: ", comment);
  const merchantId = comment.merchant_id;
  const content = comment.comment_content;
  const user = comment.user;
  const taskId = comment.task_id;
  const couponId = comment.coupon_id;

  const queryText = `
        INSERT INTO "merchant_comments" (
          "merchant_id", 
          "comment_content", 
          "user", 
          "task_id", 
          "coupon_id"
          )
          VALUES ($1, $2, $3, $4, $5);`;

  pool
    .query(queryText, [merchantId, content, user, taskId, couponId])
    .then((response) => {
      console.log("response from merchantComments.router: ", response.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in merchantComments POST route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
