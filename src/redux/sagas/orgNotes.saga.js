import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* orgNotes(action) {
  console.log(action.payload);
  try {
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{organization_notes(filter: "organization_id = ${action.payload.id}") {
       id
       organization_id
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
    console.log(response)
    console.log("FETCH request from orgNotes.saga, ITEMS = ", response.data);
    yield put({ type: "SET_ORG_NOTES", payload: response.data.organization_notes });
  } catch (error) {
    console.log("error in orgNotes Saga", error);
  }
}

function* addNotes(action) {
  try {
    console.log(action.payload)
    const newNote = action.payload.sendNote
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: organization_notesInput){
       create_organization_notes(input: $input){
       id
       organization_id
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
        "organization_id": Number(newNote.organization_id),
        "note_date": newNote.note_date,
        "note_content": newNote.note_content
      }
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORG_NOTES", payload: { id: Number(newNote.organization_id), auth: auth_response } });
  } catch (error) {
    console.log("error in addNotes Saga", error);
  }
}

function* editNotes(action) {
  try {
    const items = yield axios.post(
      `/api/orgnotes/update/${action.payload.id}`,
      action.payload
    );
    console.log(
      "FETCH request from orgNotes.saga, ITEMS FOR editContact = ",
      items
    );
    console.log("EDIT_CONTACT_INFO action.payload = ", action.payload);

    yield put({
      type: "FETCH_ORG_NOTES",
      payload: action.payload.organization_id,
    });
  } catch {
    console.log("error in editNotes Saga");
  }
}

function* deleteOrgNote(action) {
  try {
    console.log(action.payload)
    const deletedNote = action.payload.deletedNote
    const orgId = deletedNote.entity_id
    console.log(orgId)
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = ` mutation ($input: organization_notesInput, $id: ID!){
       update_organization_notes(input: $input id: $id){
       id
       organization_id
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
        "organization_id": Number(orgId),
        "note_date": deletedNote.note_date,
        "note_content": deletedNote.note_content,
        "is_deleted": deletedNote.is_deleted
      },
        "id": Number(deletedNote.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORG_NOTES", payload: { id: orgId, auth: auth_response } });
  } catch (error) {
    console.log("error with deleteOrgNotes request", error);
  }
}

export default function* orgDetailsSaga() {
  yield takeEvery("FETCH_ORG_NOTES", orgNotes);
  yield takeEvery("ADD_ORG_NOTES", addNotes);
  yield takeEvery("EDIT_ORG_NOTES", editNotes);
  yield takeEvery("DELETE_ORG_NOTE", deleteOrgNote);
}
