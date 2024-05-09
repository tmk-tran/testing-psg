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
      // console.log("from GET ALL customers.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for customers", err);
      res.sendStatus(500);
    });
});

router.get("/:id", (req, res) => {
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
      // console.log("from GET /id customers.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for customers", err);
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
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

  // Check if the email already exists in the user table
  const emailExistsQuery = `
    SELECT
      *
    FROM
      "user"
    WHERE
      username = $1;
  `;

  try {
    const emailExistsResult = await pool.query(emailExistsQuery, [email]);
    if (emailExistsResult.rows.length > 0) {
      // Email already exists, return an error
      return res
        .status(400)
        .json({ error: "This email is already in use. Please try again..." });
    }

    // Email does not exist, proceed with inserting into the customers table
    const insertQuery = `
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "id";
    `;

    const response = await pool.query(insertQuery, [
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
    ]);

    console.log("Successful POST in customers.router");
    res.status(201).send(response.rows);
  } catch (error) {
    console.log("error in customers POST route", error);
    res.sendStatus(500);
  }
});

module.exports = router;
