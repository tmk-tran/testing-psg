const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;

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
          WHERE
            uc.user_id = $1
            AND uc.redeemed = false
          GROUP BY
            c.id, m.merchant_name, cl.coupon_id
          ORDER BY
            m.merchant_name ASC;
        `;

  pool
    .query(queryText, [userId])
    .then((result) => {
      console.log("FROM userCoupon.router: ", result.rows);
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

  const queryText = `
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

  pool
    .query(queryText, [couponId])
    .then((response) => {
      console.log("response from POST userCoupon.router: ", response.rows);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon POST route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
