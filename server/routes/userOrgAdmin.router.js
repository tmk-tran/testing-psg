const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT * 
          FROM user_org_admin;
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

router.post("/", rejectUnauthenticated, (req, res) => {
  const user = req.body;
  const userId = user.user_id;
  const orgId = user.org_id;

  const queryText = `
        INSERT INTO user_org_admin (
            user_id, 
            org_id
        )
        VALUES ($1, $2);
      `;

  pool
    .query(queryText, [userId, orgId])
    .then((response) => {
      console.log("Successful POST in user_org_admin.router", response.rows);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon PUT route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;
  const orgId = req.body.org_id;

  const queryText = `
          UPDATE "user_org_admin"
          SET org_id = $1
          WHERE user_id = $2;
        `;
  pool
    .query(queryText, [orgId, userId])
    .then((response) => {
      console.log("Successful PUT in user_org_admin.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon PUT route", err);
      res.sendStatus(500);
    });
});

router.delete("/replace", rejectUnauthenticated, (req, res) => {
  const userId = req.body.user_id;
  const orgId = req.body.org_id;

  const queryText = `
            DELETE FROM "user_org_admin"
            WHERE user_id = $1
            AND org_id = $2;
          `;

  pool
    .query(queryText, [userId, orgId])
    .then((response) => {
      console.log("Successful REPLACE DELETE in user_org_admin.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon DELETE route", err);
      res.sendStatus(500);
    });
});

// Delete orgAdmin access for user
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;
  const orgId = req.body.org_id;

  const queryText = `
          DELETE FROM "user_org_admin"
          WHERE user_id = $1
          AND org_id = $2;
        `;

  pool
    .query(queryText, [userId, orgId])
    .then((response) => {
      console.log("Successful DELETE USERORG in user_org_admin.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in userCoupon DELETE route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
