const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.post("/", rejectUnauthenticated, (req, res) => {
  const coupon = req.body;

  const queryText = `
      INSERT INTO 
          coupon_redemption (
              coupon_id, 
              location_id, 
              redeemed_by
          )
      VALUES 
          ${coupon.locationId
            .map(
              (_, index) =>
                `($1, $${index + 2}, $${coupon.locationId.length + 2})`
            )
            .join(", ")};
      `;

  const params = [coupon.couponId, ...coupon.locationId, coupon.userId];

  pool
    .query(queryText, params)
    .then((response) => {
      console.log("Successful POST in couponRedemption.router");
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in locations POST couponRedemption route", err);
      res.sendStatus(500);
    });
});

// PUT route for redeeming a coupon
router.put("/:id", (req, res) => {
  const couponId = req.params.id;

  const queryText = `
    UPDATE coupon
    SET is_redeemed = true
    WHERE id = $1;
  `;

  pool
    .query(queryText, [couponId])
    .then((response) => {
      console.log("Coupon redeemed");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error redeeming coupon:", error);
      res.sendStatus(500);
    });
});

module.exports = router;
