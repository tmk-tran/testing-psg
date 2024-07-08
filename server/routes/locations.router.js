const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT
        *
    FROM
        "location"
    ORDER BY
        "id" ASC;
    `;

  pool
    .query(queryText)
    .then((result) => {
      console.log("FROM locations.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for location info", err);
      res.sendStatus(500);
    });
});

router.get("/:id", (req, res) => {
  const merchantId = req.params.id;

  const queryText = `
    SELECT
        *
    FROM
        "location"
    WHERE
        merchant_id = $1
    ORDER BY
        "id" ASC;
    `;

  pool
    .query(queryText, [merchantId])
    .then((result) => {
      console.log("FROM locationsGET by ID.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for location by ID info", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const location = req.body;
  console.log("LOCATION IS: ", location);
  const locationName = location.location_name;
  const phoneNumber = location.phone_number;
  const address = location.address;
  const city = location.city;
  const state = location.state;
  const zip = location.zip;
  const coordinates = location.coordinates;
  const regionId = location.region_id;
  const merchantId = location.merchant_id;
  const additionalDetails = location.additional_details;

  const queryText = `INSERT INTO "location" ("location_name", "phone_number", "address", "city", "state", "zip", "coordinates", "region_id", "merchant_id", "additional_details")
                                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;

  pool
    .query(queryText, [
      locationName,
      phoneNumber,
      address,
      city,
      state,
      zip,
      coordinates,
      regionId,
      merchantId,
      additionalDetails,
    ])
    .then((response) => {
      console.log("response from locations.router: ", response.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in locations POST route", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const location = req.body;
  console.log("LOCATION IS: ", location);
  const locationId = req.params.id;

  const locationName = location.location_name;
  const phoneNumber = location.phone_number;
  const address = location.address;
  const city = location.city;
  const state = location.state;
  const zip = location.zip;
  // const coordinates = location.coordinates;
  // const regionId = location.region_id;
  const merchantId = location.merchant_id;
  const additionalDetails = location.additional_details;

  const queryText = `
    UPDATE "location" 
    SET "location_name" = $1, 
        "phone_number" = $2, 
        "address" = $3, 
        "city" = $4, 
        "state" = $5, 
        "zip" = $6, 
        "merchant_id" = $7, 
        "additional_details" = $8 
    WHERE id = $9;
    `;

  pool
    .query(queryText, [
      locationName,
      phoneNumber,
      address,
      city,
      state,
      zip,
      merchantId,
      additionalDetails,
      locationId,
    ])
    .then((response) => {
      console.log(response.rows);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with location PUT route", error);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const locationId = req.params.id;

  pool
    .query(
      `UPDATE "location"
      SET is_deleted = true
      WHERE id = $1;`,
      [locationId]
    )
    .then((response) => {
      console.log(response.rows);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with location DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
