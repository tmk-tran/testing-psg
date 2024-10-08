const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

//Get route for coupon books data
router.get("/", (req, res) => {
  const queryText = `
            SELECT * 
            FROM "coupon_book"
            ORDER BY id DESC;
            ;
            `;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error getting coupon books", err);
      res.sendStatus(500);
    });
});

router.get("/id/:id", (req, res) => {
  const bookId = req.params.id;

  // Made a change to queryText on Aug 2, '24
  // -----------------------------------------------------------
  // To enable fetching of coupons determined by the app year set
  //  to 'active' in the 'coupon_book' DB table. The active year
  //  can be set by the admin users in the UserAdmin component.
  // ------------------------------------------------------------
  // Adding a function to the table in the DB to automatically change
  //  the activeYear based on the end of season (i.e. September 1st, 2024 12:00AM)
  const queryText = `
          SELECT *
          FROM coupon_book
          WHERE id = $1;
        `;

  pool
    .query(queryText, [bookId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error getting coupon books", err);
      res.sendStatus(500);
    });
});

router.get("/season", (req, res) => {
  const queryText = `
    SELECT *
    FROM coupon_book
    WHERE active = true;
`;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Error getting coupon books", err);
      res.sendStatus(500);
    });
});

//Post route to add a new coupon book
router.post("/", (req, res) => {
  const queryText = `
          SELECT year 
          FROM coupon_book 
          ORDER BY year DESC LIMIT 1`;

  pool
    .query(queryText)
    .then((result) => {
      let latestYear = "2023-2024"; // Default value if no year exists yet
      if (result.rows.length > 0) {
        latestYear = result.rows[0].year;
      }

      // Calculate the next year
      const [startYear, endYear] = latestYear.split("-");
      const nextYear = `${parseInt(endYear)}-${parseInt(endYear) + 1}`;

      const insertQueryText = `INSERT INTO "coupon_book" ("year")
          VALUES ($1);`;

      pool
        .query(insertQueryText, [nextYear])
        .then(() => {
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log("Error adding new coupon year", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Error fetching latest year", err);
      res.sendStatus(500);
    });
});

router.put("/id/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("BEGIN");

    // Set the current active year to false
    await pool.query(
      "UPDATE coupon_book SET active = FALSE WHERE active = TRUE"
    );

    // Set the new active year to true
    await pool.query("UPDATE coupon_book SET active = TRUE WHERE id = $1", [
      id,
    ]);

    await pool.query("COMMIT");

    console.log("Successfully updated coupon book to active");
    res.sendStatus(201);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error updating coupon book", err);
    res.sendStatus(500);
  }
});

module.exports = router;
