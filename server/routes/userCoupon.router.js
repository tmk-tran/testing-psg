const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT user_id, show_book 
          FROM user_coupon;
        `;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error in the GET / request for user coupons", error);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;
  const yearId = req.query.yearId;

  const queryText = `
          SELECT
            c.*,
            cl.coupon_id AS coupon_id,
            ARRAY_AGG(l.id) AS location_id,
            ARRAY_AGG(l.location_name) AS location_name,
            ARRAY_AGG(l.phone_number) AS phone_number,
            ARRAY_AGG(l.address) AS address,
            ARRAY_AGG(l.city) AS city,
            ARRAY_AGG(l.state) AS state,
            ARRAY_AGG(l.zip) AS zip,
            ARRAY_AGG(l.merchant_id) AS location_merchant_id,
            ARRAY_AGG(l.additional_details) AS location_additional_details,
            m.merchant_name
          FROM
            coupon c
          LEFT JOIN
            coupon_location cl ON c.id = cl.coupon_id
          LEFT JOIN
            location l ON cl.location_id = l.id
          JOIN
            merchant m ON c.merchant_id = m.id
          LEFT JOIN
            user_coupon uc ON c.id = uc.coupon_id
          JOIN
            coupon_book cb ON c.book_id = cb.id
          WHERE
            uc.user_id = $1
            AND uc.redeemed = false
            AND uc.show_book = true
            AND cb.id = $2
          GROUP BY
            c.id, m.merchant_name, cl.coupon_id, uc.show_book
          ORDER BY
            m.merchant_name ASC;
        `;

  pool
    .query(queryText, [userId, yearId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error in the GET / request for user coupons", error);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const coupon = req.body;
  const couponId = coupon.id;

  const insertQueryText = `
        INSERT INTO user_coupon (user_id, coupon_id, redeemed)
        SELECT u.id, c.id, false
        FROM "user" u
        CROSS JOIN coupon c
        WHERE c.id = $1
      AND NOT EXISTS (
            SELECT 1
            FROM user_coupon uc
            WHERE uc.user_id = u.id
            AND uc.coupon_id = c.id
          );
      `;
  // const updateQueryText = `
  //       UPDATE user_coupon uc
  //       SET show_book = true
  //     WHERE EXISTS (
  //       SELECT 1
  //       FROM user_coupon
  //       WHERE user_id = uc.user_id
  //       AND show_book = true
  //       GROUP BY user_id
  //     HAVING COUNT(*) > 1
  //       )
  //       AND coupon_id = $1;
  //     `;

  // Execute the insert query
  pool.query(insertQueryText, [couponId], (err, result) => {
    if (err) {
      // Handle error
      console.error("Error executing insert query:", err);
      return;
    }
    // Insert query successful
    console.log("Insert query executed successfully:", result);

    // Execute the update query
    // pool.query(updateQueryText, [couponId], (updateErr, updateResult) => {
    //   if (updateErr) {
    //     // Handle update error
    //     console.error("Error executing update query:", updateErr);
    //     return;
    //   }
    //   // Update query successful
    //   console.log("Update query executed successfully:", updateResult);
    // });
  });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;

  const queryText = `
          UPDATE "user_coupon"
          SET show_book = $1
          WHERE user_id = $2;
        `;
  pool
    .query(queryText, [req.body.show_book, userId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon PUT route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
