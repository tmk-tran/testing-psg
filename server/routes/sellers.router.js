const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const orgId = req.params.id;

  // const queryText = `
  // SELECT
  //     s.*,
  //     o.organization_name,
  //     o.address,
  //     o.city,
  //     o.state,
  //     o.zip
  // FROM
  //     sellers s
  // INNER JOIN
  //     organization o ON s.organization_id = o.id
  // WHERE
  //     s.organization_id = $1;`;

  const queryText = `
  SELECT
      s.id,
      s."refId",
      s.lastname,
      s.firstname,
      s.level,
      s.teacher,
      s.initial_books,
      s.additional_books,
      s.books_returned,
      ROUND(s.cash::numeric, 2) AS cash,
      ROUND(s.checks::numeric, 2) AS checks,
      ROUND(s.digital::numeric, 2) AS digital,
      ROUND(s.donations::numeric, 2) AS donations,
      ROUND(s.digital_donations::numeric, 2) AS digital_donations,
      s.notes,
      s.organization_id,
      s.is_deleted,
      s.books_due,
      o.organization_name,
      o.address,
      o.city,
      o.state,
      o.zip,
      t.physical_book_cash,
      t.physical_book_digital,
      t.digital_book_credit,
      ROUND(t.seller_earnings::numeric, 2) AS seller_earnings
  FROM
      sellers s
  INNER JOIN
      organization o ON s.organization_id = o.id
  INNER JOIN
      transactions t ON s."refId" = t."refId"
  WHERE
      s.organization_id = $1
  ORDER BY s.lastname ASC;    
  `;

  pool
    .query(queryText, [orgId])
    .then((result) => {
      console.log("from GET /id sellers.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for sellers", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const data = req.body;
  console.log(req.body);
  console.log(req.user);

  const refId = data.refId;
  const lastName = data.lastname;
  const firstName = data.firstname;
  const level = data.level;
  const teacher = data.teacher;
  const initialBooks = data.initial_books;
  const additionalBooks = data.additional_books;
  const booksReturned = data.books_returned;
  const cash = data.cash;
  const checks = data.checks;
  const digital = data.digital;
  const donations = data.donations;
  const notes = data.notes;
  const organizationId = data.organization_id;
  const digitalDonations = data.digital_donations;

  const queryText = `
        INSERT INTO "sellers" (
          "refId",
          "lastname",
          "firstname",
          "level",
          "teacher",
          "initial_books",
          "additional_books",
          "books_returned",
          "cash",
          "checks",
          "digital",
          "donations",
          "notes",
          "organization_id",
          "digital_donations"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`;

  pool
    .query(queryText, [
      refId,
      lastName,
      firstName,
      level,
      teacher,
      initialBooks,
      additionalBooks,
      booksReturned,
      cash,
      checks,
      digital,
      donations,
      notes,
      organizationId,
      digitalDonations,
    ])
    .then((response) => {
      console.log("response from POST sellers.router: ", response.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in sellers POST route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const seller = req.body;
  const sellerId = req.body.id;
  console.log("Req.body from sellers = ", seller);

  const queryText = `
        UPDATE 
          "sellers"
        SET
          "lastname" = $1,
          "firstname" = $2,
          "level" = $3,
          "teacher" = $4,
          "initial_books" = $5,
          "additional_books" = $6,
          "books_returned" = $7,
          "cash" = $8,
          "checks" = $9,
          "digital" = $10,
          "donations" = $11,
          "notes" = $12,
          "digital_donations" = $13
        WHERE "id" = $14;`;

  const values = [
    seller.lastname,
    seller.firstname,
    seller.level,
    seller.teacher,
    seller.initial_books,
    seller.additional_books,
    seller.books_returned,
    seller.cash,
    seller.checks,
    seller.digital,
    seller.donations,
    seller.notes,
    seller.digital_donations,
    sellerId,
  ];

  pool
    .query(queryText, values)
    .then((response) => {
      console.log("response from PUT sellers.router: ", response.rows);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with sellers PUT route", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const sellerId = req.params.id;
  console.log(sellerId);
  pool
    .query(
      `UPDATE 
        "sellers"
        SET is_deleted = true
        WHERE id = $1;`,
      [sellerId]
    )
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with sellers DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
