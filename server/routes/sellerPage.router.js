const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/:refId", (req, res) => {
  const refId = req.params.refId;

  const queryText = `
          SELECT
            s.*,
            o.organization_name,
            o.address,
            o.city,
            o.state,
            o.zip
          FROM
            sellers s
          INNER JOIN
            organization o ON s.organization_id = o.id
          WHERE
            s."refId" = $1;`;

  pool
    .query(queryText, [refId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for sellers", err);
      res.sendStatus(500);
    });
});

router.put("/:id", (req, res) => {
  const sellerId = req.params.id;
  const sellerInfo = req.body;
  const updateType = sellerInfo.updateType;
  const refId = sellerInfo.refId;

  let queryText;
  let values;

  switch (updateType) {
    case "cash":
      queryText = `
            UPDATE 
              "sellers"
            SET
              "cash" = "cash" + $1
            WHERE 
              "id" = $2
            AND
              "refId" = $3
            ;`;
      values = [sellerInfo.cash, sellerId, refId];
      break;
    case "checks":
      queryText = `
            UPDATE 
              "sellers"
            SET
              "checks" = "checks" + $1
            WHERE 
              "id" = $2
            AND
              "refId" = $3
            ;`;
      values = [sellerInfo.checks, sellerId, refId];
      break;
    case "donations":
      queryText = `
            UPDATE 
              "sellers"
            SET
              "donations" = "donations" + $1
            WHERE 
              "id" = $2
            AND
              "refId" = $3
            ;`;
      values = [sellerInfo.donations, sellerId, refId];
      break;
    case "digital_donations":
      queryText = `
          UPDATE 
            "sellers"
          SET
            "digital_donations" = "digital_donations" + $1
          WHERE 
            "id" = $2
          AND
            "refId" = $3
          ;`;
      values = [sellerInfo.digital_donations, sellerId, refId];
      break;
    case "digital":
      queryText = `
        UPDATE
          "sellers"
        SET
          "digital" = "digital" + $1
        WHERE
          "id" = $2
        AND
          "refId" = $3
        ;`;
      values = [sellerInfo.digital, sellerId, refId];
      break;
    default:
      res.status(400).json({ error: "Invalid update type" });
      return;
  }

  pool
    .query(queryText, values)
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error with sellerPage PUT route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
