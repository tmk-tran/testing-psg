import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* merchantNotes(action) {
  console.log(action.payload);
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      merchant_notes (filter: "merchant_id = ${action.payload.id}" ordering: "id DESC"){
        id
         merchant_id
        note_date
        note_content
        is_deleted
    }
  }`

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", `{}`);

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log("FETCH request from merchantNotes.saga, ITEMS = ", response.data);
    yield put({ type: "SET_MERCHANT_NOTES", payload: response.data.merchant_notes });
  } catch (error) {
    console.log("error in merchantNotes Saga", error);
  }
}

function* addNotes(action) {
  console.log(action.payload);
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const newNote = action.payload.newNote
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation($input: merchant_notesInput){
      create_merchant_notes (input: $input){
         id
         merchant_id
         note_date
         note_content
         is_deleted
       }
     }`

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", JSON.stringify({
      "input": {
        "merchant_id": Number(newNote.organization_id),
        "note_date": newNote.note_date,
        "note_content": newNote.note_content
      }
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_MERCHANT_NOTES", payload: { id: Number(newNote.organization_id), auth: auth_response } });
  } catch (error) {
    console.log("error in addMerchantNotes Saga", error);
  }
}



function* deleteMerchantNote(action) {
  console.log(action.payload);
  const noteId = action.payload.noteId;
  console.log(noteId);
  const merchantId = action.payload.entityId;

  try {
    const response = yield axios.delete(`/api/merchantnotes/${noteId}`);
    console.log(
      "DELETE request from merchantNotes.saga, response FOR DELETE = ",
      response
    );
    yield put({ type: "FETCH_MERCHANT_NOTES", payload: merchantId });
  } catch (error) {
    console.log("error with deleteMerchantNote request", error);
  }
}

export default function* merchantNotesSaga() {
  yield takeEvery("FETCH_MERCHANT_NOTES", merchantNotes);
  yield takeEvery("ADD_MERCHANT_NOTES", addNotes);
  yield takeEvery("DELETE_MERCHANT_NOTE", deleteMerchantNote);
}
