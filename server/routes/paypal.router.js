const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
          SELECT pt.*,
            o.organization_name,
            s1.firstname AS seller_first_name,
            s1.lastname AS seller_last_name
          FROM "paypal_transactions" pt
          LEFT JOIN "sellers" s ON pt.seller_ref_id = s."refId"
          LEFT JOIN "organization" o ON s.organization_id = o.id
          LEFT JOIN "sellers" s1 ON pt.seller_ref_id = s1."refId"
          ORDER BY pt."purchase_units_payments_captures_create_time" DESC;
        `;

  pool
    .query(queryText)
    .then((result) => {
      console.log("Successful GET in paypal.router");
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for paypal", err);
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  const data = req.body;

  const values = [
    data.status,
    data.payment_source_email,
    data.payment_source_account_id,
    data.payment_source_account_status,
    data.payment_source_name_given_name,
    data.payment_source_name_surname,
    data.purchase_units_reference_id,
    data.purchase_units_shipping_name_full_name,
    data.purchase_units_shipping_address_address_line_1,
    data.purchase_units_shipping_address_admin_area_2,
    data.purchase_units_shipping_address_admin_area_1,
    data.purchase_units_shipping_address_postal_code,
    data.purchase_units_payments_captures_id,
    data.purchase_units_payments_captures_status,
    data.purchase_units_payments_captures_amount_value,
    data.purchase_units_payments_captures_create_time,
    data.purchase_units_payments_captures_update_time,
    data.payer_name_given_name,
    data.payer_name_surname,
    data.payer_email_address,
    data.payer_payer_id,
    data.links_href,
    data.links_rel,
    data.links_method,
    data.seller_receivable_gross_amount_value,
    data.seller_receivable_paypal_fee_value,
    data.seller_receivable_net_amount_value,
    data.seller_ref_id,
    data.book_type_sold,
  ];

  const queryText = `
    INSERT INTO paypal_transactions (
      status,
      payment_source_email,
      payment_source_account_id,
      payment_source_account_status,
      payment_source_name_given_name,
      payment_source_name_surname,
      purchase_units_reference_id,
      purchase_units_shipping_name_full_name,
      purchase_units_shipping_address_address_line_1,
      purchase_units_shipping_address_admin_area_2,
      purchase_units_shipping_address_admin_area_1,
      purchase_units_shipping_address_postal_code,
      purchase_units_payments_captures_id,
      purchase_units_payments_captures_status,
      purchase_units_payments_captures_amount_value,
      purchase_units_payments_captures_create_time,
      purchase_units_payments_captures_update_time,
      payer_name_given_name,
      payer_name_surname,
      payer_email_address,
      payer_payer_id,
      links_href,
      links_rel,
      links_method,
      seller_receivable_gross_amount_value,
      seller_receivable_paypal_fee_value,
      seller_receivable_net_amount_value,
      seller_ref_id,
      book_type_sold
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
  `;

  pool
    .query(queryText, values)
    .then(() => {
      console.log("successful POST paypal.router");
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error("Error inserting paypal transaction:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
