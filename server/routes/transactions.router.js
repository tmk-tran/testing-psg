const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const refId = req.params.id;
  console.log("refId = ", refId);

  const queryText = `
        SELECT
            *
        FROM "transactions"
        WHERE "refId" = $1;
    `;

  pool
    .query(queryText, [refId])
    .then((result) => {
      console.log("from GET /id transactions.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for transactions", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const data = req.body;

  const refId = data.refId;
  const orgId = data.organization_id;
  const physicalBookCash = data.physical_book_cash;
  const physicalBookCredit = data.physical_book_digital;
  const digitalBookCredit = data.digital_book_credit;

  const queryText = `
        INSERT INTO "transactions" (
            "refId",
            "organization_id",
            "physical_book_cash",
            "physical_book_digital",
            "digital_book_credit"
        )
        VALUES ($1, $2, $3, $4, $5);
    `;

  pool
    .query(queryText, [
      refId,
      orgId,
      physicalBookCash,
      physicalBookCredit,
      digitalBookCredit,
    ])
    .then((response) => {
      console.log("response from POST transactions.router: ", response.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in transactions POST route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const seller = req.body;
  const refId = req.params.id;
  console.log("Req.body from transactions = ", seller);
  const caseType = req.body.caseType;

  // Ensure seller.physical_book_cash is a number
  const physicalBookCash = Number(seller.physical_book_cash);
  const physicalBookCredit = Number(seller.physical_book_digital);
  const digitalBookCredit = Number(seller.digital_book_credit);

  let queryText;

  switch (caseType) {
    case "edit":
      queryText = `
        UPDATE
          "transactions"
        SET
          "physical_book_cash" = $1
        WHERE "refId" = $2;
        `;
      break;
    default:
      queryText = `
        UPDATE 
          "transactions"
        SET
          "physical_book_cash" = "physical_book_cash" + $1,
          "physical_book_digital" = "physical_book_digital" + $2,
          "digital_book_credit" = "digital_book_credit" + $3
        WHERE "refId" = $4;
        `;
      break;
  }

  let values;

  switch (caseType) {
    case "edit":
      values = [physicalBookCash, refId];
      break;
    default:
      values = [physicalBookCash, physicalBookCredit, digitalBookCredit, refId];
      break;
  }

  pool
    .query(queryText, values)
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with transactions PUT route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
