const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/:id", (req, res) => {
  const orgId = req.params.id;
  // const queryText = `SELECT
  // o.id AS organization_id,
  // o.organization_name,
  // o.type,
  // o.address,
  // o.city,
  // o.state,
  // o.zip,
  // o.primary_contact_first_name,
  // o.primary_contact_last_name,
  // o.primary_contact_phone,
  // o.primary_contact_email,
  // o.organization_logo,
  // o.organization_earnings,
  // g.id AS group_id,
  // g.department,
  // g.sub_department,
  // g.group_nickname,
  // g.group_photo,
  // g.group_description,
  // SUM(f.goal)
  // FROM
  // "organization" o
  // LEFT JOIN
  // "group" g ON o.id = g.organization_id
  // LEFT JOIN
  // "fundraiser" AS f ON f.group_id = g.id
  // WHERE
  // o.id = $1 AND
  // o.is_deleted = false AND
  // (g.is_deleted = false OR g.is_deleted IS NULL)
  // GROUP BY
  // o.id, g.id, f.group_id
  // ORDER BY LOWER (g.group_nickname) ASC;`;
  const queryText = `
          SELECT
            f.id AS fundraiser_id,
            f.title AS fundraiser_title,
            f.description AS fundraiser_description,
            f.start_date AS fundraiser_start_date,
            f.end_date AS fundraiser_end_date,
            f.requested_book_quantity,
            f.book_quantity_checked_out,
            f.book_checked_out_total_value,
            f.book_quantity_checked_in,
            f.books_sold,
            f.money_received,
            f.outstanding_balance,
            f.is_deleted AS fundraiser_is_deleted,
            f.closed AS fundraiser_closed,
            f.goal AS fundraiser_goal,

            g.id AS group_id,
            g.organization_id AS group_organization_id,
            g.department AS group_department,
            g.sub_department AS group_sub_department,
            g.group_nickname,
            g.group_photo,
            g.group_description,
            g.is_deleted AS group_is_deleted,
  
            o.id AS organization_id,
            o.organization_name,
            o.type AS organization_type,
            o.address AS organization_address,
            o.city AS organization_city,
            o.state AS organization_state,
            o.zip AS organization_zip,
            o.primary_contact_first_name,
            o.primary_contact_last_name,
            o.primary_contact_phone,
            o.primary_contact_email,
            o.organization_logo,
            o.is_deleted AS organization_is_deleted,
            o.organization_earnings
          FROM fundraiser f
          JOIN "group" g ON f.group_id = g.id
          JOIN organization o ON g.organization_id = o.id
          WHERE o.id = $1;`;

  pool
    .query(queryText, [orgId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR in fundraisers", err);
      res.sendStatus(500);
    });
});

//Get route for fundraisers with a specific group id
router.get("/groupfundraisers/:id", (req, res) => {
  const groupId = req.params.id;
  const queryText = `
          SELECT 
            "f".id, 
            "f".group_id, 
            "f".title, 
            "f".description, 
            "f".photo, 
            "f".requested_book_quantity, 
            "f".book_quantity_checked_out, 
            "f".book_checked_out_total_value, 
            "f".book_quantity_checked_in, 
            "f".books_sold, 
            "f".money_received, 
            "f".start_date, 
            "f".end_date, 
            "f".goal, 
            "cb".year, 
            "f".outstanding_balance, 
            "f".closed,
            "o".organization_earnings
          FROM "fundraiser" AS "f"
          JOIN "group" AS "g" ON "f".group_id = "g".id
          JOIN "organization" AS "o" ON "g".organization_id = "o".id
          JOIN "coupon_book" AS "cb" ON "f".coupon_book_id = "cb".id
          WHERE "f".group_id = $1
          ORDER BY "f".id ASC, "f".closed = false;`;

  pool
    .query(queryText, [groupId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error in getting fundraisers", err);
      res.sendStatus(500);
    });
});

//Post route for a new fundraiser, data comes from form inputs
router.post("/", (req, res) => {
  const newFundraiser = req.body;
  const queryText = `
          INSERT INTO "fundraiser" (
            "group_id", 
            "title", 
            "description", 
            "requested_book_quantity", 
            "book_quantity_checked_out", 
            "goal", 
            "start_date", 
            "end_date", 
            "coupon_book_id", 
            "books_sold", 
            "book_quantity_checked_in", 
            "money_received"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
        `;

  pool
    .query(queryText, [
      newFundraiser.group_id,
      newFundraiser.title,
      newFundraiser.description,
      newFundraiser.requested_book_quantity,
      newFundraiser.book_quantity_checked_out,
      newFundraiser.goal,
      newFundraiser.start_date,
      newFundraiser.end_date,
      newFundraiser.coupon_book_id,
      newFundraiser.books_sold,
      newFundraiser.book_quantity_checked_in,
      newFundraiser.money_received,
    ])
    .then(() => {
      console.log("Successful POST in fundraisers.router");
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error adding new fundraiser", err);
      res.sendStatus(500);
    });
});

//Put route for updating amounts of books and money in a fundraiser
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedAmount = req.body;

  const queryText = `
          UPDATE "fundraiser" 
          SET 
            "title" = $1, 
            "book_quantity_checked_out" = $2, 
            "book_quantity_checked_in" = $3, 
            "books_sold" = $4, 
            "money_received" = $5, 
            "goal" = $6 
          WHERE "id" = $7;
        `;

  pool
    .query(queryText, [
      updatedAmount.title,
      updatedAmount.newBooksCheckedOut,
      updatedAmount.newBooksCheckedIn,
      updatedAmount.newBooksSold,
      updatedAmount.newMoneyReceived,
      updatedAmount.newGoal,
      id,
    ])
    .then(() => {
      console.log("Successful PUT in fundraisers.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in updating amounts", err);
      res.sendStatus(500);
    });
});
//PUT route that sets a fundraiser to closed
router.put("/close/:id", (req, res) => {
  const id = req.params.id;

  const queryText = `
          UPDATE "fundraiser" 
          SET "closed" = 'true' 
          WHERE "id" = $1;
        `;

  pool
    .query(queryText, [id])
    .then(() => {
      console.log("Successful PUT to /close in fundraisers.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in closing fundraiser", err);
      res.sendStatus(500);
    });
});
//PUT route to reopen a fundraiser
router.put("/open/:id", (req, res) => {
  const id = req.params.id;

  const queryText = `
          UPDATE "fundraiser" 
          SET "closed" = 'false' 
          WHERE "id" = $1;
        `;

  pool
    .query(queryText, [id])
    .then(() => {
      console.log("Successful PUT to /open in fundraisers.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in opening fundraiser", err);
      res.sendStatus(500);
    });
});

//Delete route to set a fundraiser to deleted, not used in current scope of admin dashboard
router.put("/delete/:id", (req, res) => {
  const id = req.params.id;

  const queryText = `
          UPDATE "fundraiser" 
          SET "is_deleted" = 'true' 
          WHERE "id" = $1;
        `;

  pool
    .query(queryText, [id])
    .then(() => {
      console.log("Successful PUT to /delete in fundraisers.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error in deleting fundraiser", err);
      res.sendStatus(500);
    });
});

module.exports = router;
