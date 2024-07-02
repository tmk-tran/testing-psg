const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

router.get("/table", rejectUnauthenticated, (req, res) => {
  // const queryText = `
  //         SELECT
  //           id,
  //           username,
  //           first_name,
  //           last_name,
  //           org_admin,
  //           org_id,
  //           graphic_designer
  //         FROM "user"
  //         ORDER BY last_name ASC;
  //       `;
  const queryText = `
          SELECT 
            u.id, 
            u.username,
            u.first_name,
            u.last_name, 
            u.org_admin,
            u.org_id,
            u.graphic_designer,
            o.organization_name,
            STRING_AGG(DISTINCT uc.show_book::text, ',') AS show_book
          FROM "user" u
          LEFT JOIN organization o ON u.org_id = o.id
          LEFT JOIN user_coupon uc ON u.id = uc.user_id
          GROUP BY u.id, u.username, u.first_name, u.last_name, u.org_admin, u.org_id, u.graphic_designer, o.organization_name
          ORDER BY u.last_name ASC;
        `;

  pool
    .query(queryText)
    .then((result) => {
      // console.log("FROM users.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;

  const queryText = `
          INSERT INTO "user" (
            username, 
            password, 
            first_name, 
            last_name
          )
          VALUES ($1, $2, $3, $4) 
          RETURNING id;
        `;
  pool
    .query(queryText, [username, password, firstName, lastName])
    .then((response) => {
      // console.log(response.rows);
      res.send(response.rows);
    })
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;
  const { id, ...updates } = req.body; // Destructure the id and other updates

  if (Object.keys(updates).length !== 1) {
    return res.status(400).json({ message: "Invalid update payload" });
  }

  const columnName = Object.keys(updates)[0]; // Get the key (column name) from updates
  const value = updates[columnName]; // Get the value from updates

  let queryText = `
          UPDATE "user" 
          SET ${columnName} = $1 
          WHERE id = $2;
          `;

  pool
    .query(queryText, [value, userId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in the PUT / request for user role change", err);
      res.sendStatus(500);
    });
});

router.put("/org/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.params.id;
  const orgId = req.body.org_id;

  const queryText = `
          UPDATE "user"
          SET org_id = $1
          WHERE id = $2;
      `;

  pool
    .query(queryText, [orgId, userId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error in the PUT / request for orgAdmin, user.router", err);
      res.sendStatus(500);
    });
});

module.exports = router;
