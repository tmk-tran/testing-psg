const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

//Get route for coupon books data
router.get("/", (req, res) => {
  const queryText = `
            SELECT * 
            FROM "coupon_book"
            ORDER BY id ASC;
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

// router.get("/:id", (req, res) => {
//   const bookId = req.params.id;

//   const queryText = `
//         SELECT *
//         FROM coupon_book
//         WHERE id = $1;
//     `;
//   pool
//     .query(queryText, [bookId])
//     .then((result) => {
//       res.send(result.rows);
//     })
//     .catch((err) => {
//       console.log("Error getting coupon books", err);
//       res.sendStatus(500);
//     });
// });

router.get("/:season", (req, res) => {
    const season = req.params.season;
    console.log("season = ", season);
  
    const queryText = `
          SELECT *
          FROM coupon_book
          WHERE year = $1;
      `;
    pool
      .query(queryText, [season])
      .then((result) => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log("Error getting coupon books", err);
        res.sendStatus(500);
      });
  });

//Post route to add a new coupon book
// router.post("/", (req, res) => {
//   const year = req.body;
//   const queryText = `INSERT INTO "coupon_book" ("year")
//     VALUES ($1);`;

//   pool
//     .query(queryText, [year])
//     .then(() => {
//       res.sendStatus(201);
//     })
//     .catch((err) => {
//       console.log("Error adding new coupon book", err);
//       res.sendStatus(500);
//     });
// });

router.post("/", (req, res) => {
  const queryText = `SELECT year FROM coupon_book ORDER BY year DESC LIMIT 1`;

  pool
    .query(queryText)
    .then((result) => {
      let latestYear = "2023-2024"; // Default value if no year exists yet
      if (result.rows.length > 0) {
        latestYear = result.rows[0].year;
      }

      // Calculate the next year
      const [startYear, endYear] = latestYear.split("-");
      const nextYear = `${parseInt(endYear) + 1}-${parseInt(endYear) + 2}`;

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

module.exports = router;
