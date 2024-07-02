const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const orgId = req.params.id;
  console.log("orgId = ", orgId);
  const queryText = `SELECT * FROM "organization_notes" WHERE organization_id = $1 ORDER by "id" DESC;`;
  pool
    .query(queryText, [orgId])
    .then((result) => {
      // console.log("orgId = ", orgId);
      console.log("FROM orgNotes.router: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const note = req.body;
  const orgId = note.organization_id;
  const date = note.note_date;
  const content = note.note_content;

  const queryText = `INSERT INTO "organization_notes" ("organization_id", "note_date", "note_content")
  VALUES ($1, $2, $3);`;

  pool
    .query(queryText, [orgId, date, content])
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("error in orgNotes POST route", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  console.log("ORG noteId = ", noteId);
  pool
    .query(
      `UPDATE "organization_notes"
      SET is_deleted = true
      WHERE id = $1;`,
      [noteId]
    )
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error with orgNotes DELETE route", error);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const note = req.body;
  const orgId = req.params.id;

  //   const user = req.user.id;
  const date = note.note_date;
  const content = note.note_content;
  const queryText = `
    UPDATE "organization_notes" SET note_date = $1, note_content = $2
    WHERE
        organization_id = $3;
    `;
  pool
    .query(queryText, [date, content, orgId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error with orgNotes PUT route", err);
      res.sendStatus(500);
    });
});

module.exports = router;
