const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
// ~~~~~~~~~~ Upload Files ~~~~~~~~~~
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
  SELECT 
    id,
    merchant_name,
    address,
    city,
    state,
    zip,
    primary_contact_first_name,
    primary_contact_last_name,
    contact_phone_number,
    contact_email,
    is_deleted,
    archive_reason,
    encode(merchant_logo, 'base64') AS merchant_logo_base64,
    filename,
    website,
    contact_method
  FROM 
    merchant 
  WHERE 
    is_deleted=false 
  ORDER BY 
    merchant_name;`;

  pool
    .query(queryText)
    .then((result) => {
      // console.log("from GET ALL merchants.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for all merchants", err);
      res.sendStatus(500);
    });
});

router.get("/number", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT
        m.id AS merchant_id,
        m.merchant_name,
      COUNT(c.id) AS num_coupons
    FROM
        merchant m
    LEFT JOIN
        coupon c ON m.id = c.merchant_id AND c.is_deleted = false
    GROUP BY
        m.id
    ORDER BY
        m.id;
  `;

  pool
    .query(queryText)
    .then((result) => {
      // console.log("from GET /number merchants.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for number of coupons", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;

  const queryText = `
  SELECT
    *,
    encode(merchant_logo, 'base64') AS merchant_logo_base64
  FROM
    merchant
  WHERE
    id = $1;`;

  pool
    .query(queryText, [merchantId])
    .then((result) => {
      // console.log("from GET /id merchants.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for merchant details", err);
      res.sendStatus(500);
    });
});

router.post("/", upload.single("merchant_logo"), (req, res) => {
  const data = req.body;
  const merchantLogo = req.file ? req.file.buffer : null;

  const merchantName = data.merchant_name;
  const address = data.address;
  const city = data.city;
  const state = data.state;
  const zip = data.zip;
  const primaryContactFirstName = data.primary_contact_first_name;
  const primaryContactLastName = data.primary_contact_last_name;
  const contactPhoneNumber = data.contact_phone_number;
  const contactEmail = data.contact_email;
  const filename = data.filename ? data.filename : null;
  const website = data.website ? data.website : null;
  const contactMethod = data.contact_method;

  const queryText = `
      INSERT INTO "merchant" (
        "merchant_name",
        "address",
        "city",
        "state",
        "zip",
        "primary_contact_first_name",
        "primary_contact_last_name",
        "contact_phone_number",
        "contact_email",
        "merchant_logo",
        "filename",
        "website",
        "contact_method"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`;

  pool
    .query(queryText, [
      merchantName,
      address,
      city,
      state,
      zip,
      primaryContactFirstName,
      primaryContactLastName,
      contactPhoneNumber,
      contactEmail,
      merchantLogo,
      filename,
      website,
      contactMethod,
    ])
    .then((response) => {
      console.log("Successful POST in merchants.router");
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in organizations POST route", err);
      res.sendStatus(500);
    });
});

router.put(
  "/:id",
  upload.single("merchant_logo"),
  rejectUnauthenticated,
  (req, res) => {
    const merchant = req.body;
    const merchantId = req.params.id;

    // Merchant Details
    const merchantName = merchant.merchant_name;
    const address = merchant.address;
    const city = merchant.city;
    const state = merchant.state;
    const zip = merchant.zip;

    // Merchant Contact Details
    const firstName = merchant.primary_contact_first_name;
    const lastName = merchant.primary_contact_last_name;
    const phone = merchant.contact_phone_number;
    const email = merchant.contact_email;
    const filename = merchant.filename;
    const website = merchant.website ? merchant.website : null;
    const contactMethod = merchant.contact_method;

    let merchant_logo = null;
    if (req.file) {
      merchant_logo = req.file.buffer;
    }

    let queryText;
    let values;
    if (merchant_logo) {
      // If a new logo is being uploaded, update the organization logo as well
      queryText = `
          UPDATE "merchant" 
          SET 
            "merchant_name" = $1, 
            "address" = $2, 
            "city" = $3, 
            "state" = $4, 
            "zip" = $5, 
            "primary_contact_first_name" = $6, 
            "primary_contact_last_name" = $7, 
            "contact_phone_number" = $8, 
            "contact_email" = $9,
            "merchant_logo" = $10,
            "filename" = $11,
            "website" = $12,
            "contact_method" = $13
          WHERE id = $14;`;

      values = [
        merchantName,
        address,
        city,
        state,
        zip,
        firstName,
        lastName,
        phone,
        email,
        merchant_logo,
        filename,
        website,
        contactMethod,
        merchantId,
      ];
    } else {
      // If no new logo is being uploaded, update the organization logo only
      queryText = `
              UPDATE "merchant" 
              SET 
                "merchant_name" = $1, 
                "address" = $2, 
                "city" = $3, 
                "state" = $4, 
                "zip" = $5, 
                "primary_contact_first_name" = $6, 
                "primary_contact_last_name" = $7, 
                "contact_phone_number" = $8, 
                "contact_email" = $9,
                "filename" = $10,
                "website" = $11,
                "contact_method" = $12
              WHERE id = $13;`;

      values = [
        merchantName,
        address,
        city,
        state,
        zip,
        firstName,
        lastName,
        phone,
        email,
        filename,
        website,
        contactMethod,
        merchantId,
      ];
    }

    pool
      .query(queryText, values)
      .then((response) => {
        console.log("successful PUT in merchants.router");
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log("error saving to database, from merchants.router", err);
        res.sendStatus(500);
      });
  }
);

router.put("/contact/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;
  const method = req.body.contact_method;

  const queryText = `
          UPDATE "merchant"
          SET contact_method = $1
          WHERE id = $2;
        `;
  pool
    .query(queryText, [method, merchantId])
    .then((response) => {
      console.log("Successful PUT to /contact in merchants.router");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error saving to database, from merchants.router", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { archiveReason } = req.body;

  const queryText = `
          UPDATE "merchant" 
          SET 
            is_deleted = true, 
            archive_reason = $1 
          WHERE id = $2;
        `;

  pool
    .query(queryText, [archiveReason, id])
    .then((response) => {
      console.log("successful DELETE from merchants.router");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with merchant DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
