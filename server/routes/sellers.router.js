const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
            SELECT sellers.*, o.organization_name
            FROM sellers
            JOIN organization o ON sellers.organization_id = o.id;
        `;

  pool
    .query(queryText)
    .then((response) => {
      res.send(response.rows).status(200);
    })
    .catch((err) => {
      console.log("error in the GET / request for seller details", err);
      res.sendStatus(500);
    });
});

router.get("/name", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT sellers.*, o.organization_name
          FROM sellers
          JOIN organization o ON sellers.organization_id = o.id
          WHERE sellers.lastname = $1
          ${req.query.firstname ? "AND sellers.firstname = $2" : ""}
          AND sellers.is_deleted = false
        `;

  const params = [req.query.lastname];

  if (req.query.firstname) {
    params.push(req.query.firstname);
  }

  pool
    .query(queryText, params)
    .then((response) => {
      res.send(response.rows).status(200);
    })
    .catch((err) => {
      console.log("error in the GET / request for seller details", err);
      res.sendStatus(500);
    });
});

router.get("/byrefid", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT sellers.*, o.organization_name
          FROM sellers
          JOIN organization o ON sellers.organization_id = o.id
          WHERE sellers."refId" = $1
          AND sellers.is_deleted = false;
        `;

  const params = [req.query.refId];

  pool
    .query(queryText, params)
    .then((response) => {
      res.send(response.rows).status(200);
    })
    .catch((err) => {
      console.log("error in the GET / request for seller details", err);
      res.sendStatus(500);
    });
});

// From sellers saga
router.get("/:orgId/:yearId", rejectUnauthenticated, (req, res) => {
  // console.log("From sellers router: ", req.params);
  const orgId = req.params.orgId;
  const yearId = req.params.yearId;

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
          COALESCE(t.physical_book_cash, 0) AS physical_book_cash,
          COALESCE(t.physical_book_digital, 0) AS physical_book_digital,
          COALESCE(t.digital_book_credit, 0) AS digital_book_credit,
          ROUND(COALESCE(t.seller_earnings, 0), 2) AS seller_earnings,
          -- Calculate the total donations
          ROUND(
              COALESCE(s.donations, 0) + COALESCE(s.digital_donations, 0), 
              2
          ) AS total_donations,
          -- Calculate the sum of seller_earnings and total_donations
          ROUND(
              COALESCE(t.seller_earnings, 0) + 
              COALESCE(s.donations, 0) + 
              COALESCE(s.digital_donations, 0),
              2
          ) AS total_seller_earnings
      FROM
          sellers s
      INNER JOIN
          organization o ON s.organization_id = o.id
      INNER JOIN
          transactions t ON s."refId" = t."refId"
      WHERE
          s.organization_id = $1
          AND s.coupon_book_id = $2
      ORDER BY s.lastname ASC;  
  `;

  pool
    .query(queryText, [orgId, yearId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for sellers", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const data = req.body;

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
  const bookYear = data.coupon_book_id;

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
          "digital_donations",
          "coupon_book_id"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);`;

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
      bookYear,
    ])
    .then((response) => {
      console.log("Successful POST sellers.router: ");
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
              "digital" = $8,
              "notes" = $9,
              "digital_donations" = $10
            WHERE "id" = $11;`;

  const values = [
    seller.lastname,
    seller.firstname,
    seller.level,
    seller.teacher,
    seller.initial_books,
    seller.additional_books,
    seller.books_returned,
    seller.digital,
    seller.notes,
    seller.digital_donations,
    sellerId,
  ];

  pool
    .query(queryText, values)
    .then((response) => {
      console.log("Successful PUT sellers.router: ");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with sellers PUT route", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const sellerId = req.params.id;

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
