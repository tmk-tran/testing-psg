const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const merchantId = req.params.id;
  console.log("merchantId = ", merchantId);
  const queryText = `SELECT * FROM "merchant_notes" WHERE merchant_id = $1 ORDER by "id" DESC;`;
  pool
    .query(queryText, [merchantId])
    .then((result) => {
      // console.log("merchantId = ", merchantId);
      console.log("FROM merchantNotes.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const note = req.body;
  console.log(note);
  const merchantId = note.merchant_id;
  const date = note.note_date;
  const content = note.note_content;

  const queryText = `INSERT INTO "merchant_notes" ("merchant_id", "note_date", "note_content")
  VALUES ($1, $2, $3);`;

  pool
    .query(queryText, [merchantId, date, content])
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in merchantNotes POST route", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  console.log("MERCHANT noteId = ", noteId);

  pool
    .query(
      `UPDATE "merchant_notes"
      SET is_deleted = true
      WHERE id = $1;`,
      [noteId]
    )
    .then((response) => {
      console.log(response.rows);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with merchantNotes DELETE route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
