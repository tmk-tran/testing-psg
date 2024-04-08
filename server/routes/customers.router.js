const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT 
      *
    FROM
      customers
    ORDER BY
      last_name ASC;
    `;

  pool
    .query(queryText)
    .then((result) => {
      console.log("from GET ALL customers.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for customers", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const customerId = req.params.id;

  const queryText = `
          SELECT
            email
          FROM
            customers
          WHERE
            id = $1;
        `;

  pool
    .query(queryText, [customerId])
    .then((result) => {
      console.log("from GET /id customers.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for customers", err);
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  const customer = req.body;
  const refId = customer.refId;
  const lastName = customer.last_name;
  const firstName = customer.first_name;
  const phone = customer.phone;
  const email = customer.email;
  const address = customer.address;
  const unit = customer.unit;
  const city = customer.city;
  const state = customer.state;
  const zip = customer.zip;

  // Check if the phone number is exactly 10 digits long
  // if (!/^\d{10}$/.test(phone)) {
  //   console.log("Phone number is not 10 digits long");
  //   return res.status(400).send("Phone number must be 10 digits long");
  // }

  const queryText = `
        INSERT INTO "customers" (
          "refId",
          "last_name",
          "first_name",
          "phone",
          "email",
          "address",
          "unit",
          "city",
          "state",
          "zip"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `;

  pool
    .query(queryText, [
      refId,
      lastName,
      firstName,
      phone,
      email,
      address,
      unit,
      city,
      state,
      zip,
    ])
    .then((response) => {
      console.log("response from POST customers.router: ", response.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in customers POST route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
